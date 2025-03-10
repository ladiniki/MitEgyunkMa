from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from bson import json_util, ObjectId
import json
from datetime import datetime
import base64
import os
import logging

# Logging beállítása
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

logger.info("Connecting to MongoDB...")
client = MongoClient("mongodb://localhost:27017/")
db = client["MitEszunkMaDB"]
collection = db["RecipiesCollection"]
ingredients_collection = db["IngredientsCollection"]
reviews_collection = db["ReviewsCollection"]  # Új collection a véleményeknek

# Ellenőrizzük a kapcsolatot
try:
    # A ping parancs ellenőrzi a kapcsolatot
    client.admin.command('ping')
    logger.info("MongoDB connection successful!")
    
    # Ellenőrizzük a collection-öket
    recipes_count = collection.count_documents({})
    ingredients_count = ingredients_collection.count_documents({})
    logger.info(f"Found {recipes_count} recipes and {ingredients_count} ingredients in the database")
except Exception as e:
    logger.error(f"MongoDB connection failed: {e}")

# TODO: put it in a .env file instead :)
app.config["JWT_SECRET_KEY"] = "7a61647cb6417a6f191d46a4c674279fe48981a0e40b6601581099135f1d1d6555e5fd61d4a4bb29aeec06e688a77971cbf979754996161667b34e9b2db8026f9214e9349176a5f646d5053a5974499b806c7a35c7f6c253deb5a487236a61a40b710139d48e40f2d222f7780e91a90dc7e7e025db76a79f9a99685ec1302bd67b727b50083eac8f849ebd66ba1fa7440175878d9ac690c0c859d1e2ea6e7fcd33e45f723d023778883765102d617f796353783d0a092d300f7b00c389eb1abf7d3a90ee06edf8148219ed856876651a191d56768f2b7f6daf71f5f8f1415b64ae37660bb318d650b18e20f7d6ac193afb4042efbd5ac2965a0ec799a96eff33" 
jwt = JWTManager(app)

# A végpont egy receptlistát ad vissza JSON formátumban (recept név, elkészítési idő, kép)
# TODO: jwt required!!!
@app.route('/recipies', methods=['GET'])
def get_recipies():
    # Get the meal type from query parameters
    meal_type = request.args.get('mealType')
    
    # Create the query
    query = {}
    if meal_type:
        query['mealType'] = meal_type
    
    recipies = collection.find(query)
    result = []

    for recipe in recipies:
        image_data = recipe.get("image", None)
        if image_data:
            image_data = image_data.decode('utf-8') if isinstance(image_data, bytes) else image_data
        result.append({
            "name": recipe.get("name"),
            "cookingTime": recipe.get("cookingTime"),
            "image": image_data,
            "mealType": recipe.get("mealType"),
            "difficulty": recipe.get("difficulty")
        })

    return jsonify(result)

# Új végpont egy adott recept részleteinek lekérdezéséhez
@app.route('/recipe/<recipe_name>', methods=['GET'])
def get_recipe_details(recipe_name):
    # Keresés a recept neve alapján
    recipe = collection.find_one({"name": recipe_name})
    
    if not recipe:
        return jsonify({"message": "A recept nem található"}), 404
    
    # Kép adatok kezelése
    image_data = recipe.get("image", None)
    if image_data:
        image_data = image_data.decode('utf-8') if isinstance(image_data, bytes) else image_data
    
    # Recept adatok összeállítása
    result = {
        "name": recipe.get("name"),
        "cookingTime": recipe.get("cookingTime"),
        "image": image_data,
        "mealType": recipe.get("mealType"),
        "difficulty": recipe.get("difficulty"),
        "description": recipe.get("description"),
        "ingredients": recipe.get("ingredients"),
        "steps": recipe.get("steps"),
        "reviews": recipe.get("reviews", [])  # Vélemények hozzáadása a válaszhoz
    }
    
    return jsonify(result)

# Csekkolja a regisztrációt
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'message': 'Username and password are required'}), 400

    username = data['username'].strip()
    password = data['password'].strip()

    if db.users.find_one({'username': username}):
        return jsonify({'message': 'User already exists'}), 400

    hashed_password = generate_password_hash(password)
    db.users.insert_one({
        'username': username, 
        'password': hashed_password,
        'favorites': [],  # Üres lista a kedvenceknek
        'ingredients': []  # Üres lista a hozzávalóknak
    })

    return jsonify({'message': 'Successful registration'}), 201


# Ellenőriz, majd odaadja a tokent (JWT authentikáció)
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'message': 'Username and password are required'}), 400

    username = data['username'].strip()
    password = data['password'].strip()

    user = db.users.find_one({'username': username})
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'msg': 'Incorrect login credentials'}), 401

    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token), 200


# Kikérjük a felhasználó nevét (Admin)
@app.route('/user', methods=['GET'])
@jwt_required()
def get_user():
    current_user = get_jwt_identity() 
    user = db.users.find_one({'username': current_user})

    if user:
        response = {'username': user['username']}
        return jsonify(response), 200
    else:
        return jsonify({'message': 'User not found'}), 404

# Új végpont az összetevők lekérdezéséhez
@app.route('/ingredients', methods=['GET'])
def get_ingredients():
    try:
        # Keresési kifejezés a query paraméterből
        search_term = request.args.get('search', '')
        logger.info(f"Ingredients request received with search term: '{search_term}'")
        
        # Keresési feltétel létrehozása
        query = {}
        if search_term:
            query['name'] = {'$regex': search_term, '$options': 'i'}  # Case-insensitive keresés
        
        logger.info(f"Querying ingredients with: {query}")
        ingredients = ingredients_collection.find(query)
        result = []

        for ingredient in ingredients:
            # Az _id mező eltávolítása, mert nem JSON-szerializálható
            if '_id' in ingredient:
                del ingredient['_id']
                
            image_data = ingredient.get("image", None)
            if image_data:
                image_data = image_data.decode('utf-8') if isinstance(image_data, bytes) else image_data
            
            result.append({
                "name": ingredient.get("name"),
                "unit": ingredient.get("unit"),
                "image": image_data
            })

        logger.info(f"Returning {len(result)} ingredients")
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error in /ingredients endpoint: {e}")
        return jsonify({"error": str(e)}), 500

# Vélemények lekérése egy recepthez
@app.route('/recipe/<recipe_name>/reviews', methods=['GET'])
def get_recipe_reviews(recipe_name):
    try:
        # Recept azonosítójának lekérése
        recipe = collection.find_one({"name": recipe_name})
        if not recipe:
            return jsonify({"message": "A recept nem található"}), 404
        
        recipe_id = recipe['_id']
        
        # Vélemények lekérése a reviews collection-ből
        reviews = list(reviews_collection.find({"recipe_id": recipe_id}).sort("date", -1))
        
        # ObjectId és dátum konvertálása string-é
        for review in reviews:
            review['_id'] = str(review['_id'])
            review['recipe_id'] = str(review['recipe_id'])
            review['date'] = review['date'].isoformat()
        
        return jsonify(reviews)
    except Exception as e:
        logger.error(f"Error getting reviews: {e}")
        return jsonify({"error": str(e)}), 500

# Új vélemény hozzáadása egy recepthez
@app.route('/recipe/<recipe_name>/reviews', methods=['POST'])
@jwt_required()  # JWT token szükséges a vélemény írásához
def add_recipe_review(recipe_name):
    try:
        current_user = get_jwt_identity()
        logger.info(f"Új vélemény beküldése - Felhasználó: {current_user}, Recept: {recipe_name}")
        
        review_data = request.json
        logger.info(f"Beérkezett adatok: {review_data}")
        
        if not review_data or not all(key in review_data for key in ["rating", "comment"]):
            logger.error("Hiányzó adatok a kérésben")
            return jsonify({"message": "Hiányzó adatok"}), 400

        # Recept azonosítójának lekérése
        recipe = collection.find_one({"name": recipe_name})
        if not recipe:
            logger.error(f"A recept nem található: {recipe_name}")
            return jsonify({"message": "A recept nem található"}), 404

        # Ellenőrizzük az értékelést
        rating = int(review_data["rating"])
        if not 1 <= rating <= 5:
            logger.error(f"Érvénytelen értékelés: {rating}")
            return jsonify({"message": "Az értékelésnek 1 és 5 között kell lennie"}), 400

        # Új vélemény létrehozása
        new_review = {
            "recipe_id": recipe['_id'],
            "recipe_name": recipe_name,
            "username": current_user,
            "rating": rating,
            "comment": review_data["comment"],
            "date": datetime.now()
        }
        logger.info(f"Új vélemény objektum létrehozva: {new_review}")

        # Vélemény mentése a reviews collection-be
        result = reviews_collection.insert_one(new_review)
        logger.info(f"Vélemény sikeresen elmentve, ID: {result.inserted_id}")

        if not result.inserted_id:
            logger.error("Hiba történt a vélemény mentése közben")
            return jsonify({"message": "Hiba történt a vélemény mentése közben"}), 500

        # Frissített vélemény visszaküldése
        new_review['_id'] = str(result.inserted_id)
        new_review['recipe_id'] = str(new_review['recipe_id'])
        new_review['date'] = new_review['date'].isoformat()

        logger.info("Vélemény sikeresen hozzáadva és visszaküldve")
        return jsonify(new_review)
    except Exception as e:
        logger.error(f"Hiba a vélemény hozzáadásakor: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Kedvencek lekérdezése
@app.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    try:
        current_user = get_jwt_identity()
        user = db.users.find_one({'username': current_user})
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
            
        # Lekérjük a kedvenc receptek részletes adatait
        favorite_recipes = []
        for recipe_name in user.get('favorites', []):
            recipe = collection.find_one({'name': recipe_name})
            if recipe:
                image_data = recipe.get("image", None)
                if image_data:
                    image_data = image_data.decode('utf-8') if isinstance(image_data, bytes) else image_data
                
                favorite_recipes.append({
                    "name": recipe.get("name"),
                    "cookingTime": recipe.get("cookingTime"),
                    "image": image_data,
                    "mealType": recipe.get("mealType"),
                    "difficulty": recipe.get("difficulty")
                })
        
        return jsonify({'favorites': favorite_recipes}), 200
    except Exception as e:
        logger.error(f"Error getting favorites: {e}")
        return jsonify({"error": str(e)}), 500

# Kedvenc hozzáadása
@app.route('/favorites/add', methods=['POST'])
@jwt_required()
def add_favorite():
    try:
        current_user = get_jwt_identity()
        data = request.get_json()
        
        if not data or 'recipeName' not in data:
            return jsonify({'message': 'Recipe name is required'}), 400
            
        recipe_name = data['recipeName']
        
        # Ellenőrizzük, hogy létezik-e a recept
        recipe = collection.find_one({'name': recipe_name})
        if not recipe:
            return jsonify({'message': 'Recipe not found'}), 404
            
        # Hozzáadjuk a kedvencekhez, ha még nincs benne
        result = db.users.update_one(
            {'username': current_user, 'favorites': {'$ne': recipe_name}},
            {'$push': {'favorites': recipe_name}}
        )
        
        if result.modified_count > 0:
            return jsonify({'message': 'Recipe added to favorites'}), 200
        return jsonify({'message': 'Recipe is already in favorites'}), 200
    except Exception as e:
        logger.error(f"Error adding favorite: {e}")
        return jsonify({"error": str(e)}), 500

# Kedvenc eltávolítása
@app.route('/favorites/remove', methods=['POST'])
@jwt_required()
def remove_favorite():
    try:
        current_user = get_jwt_identity()
        data = request.get_json()
        
        if not data or 'recipeName' not in data:
            return jsonify({'message': 'Recipe name is required'}), 400
            
        recipe_name = data['recipeName']
        
        # Eltávolítjuk a kedvencekből
        result = db.users.update_one(
            {'username': current_user},
            {'$pull': {'favorites': recipe_name}}
        )
        
        if result.modified_count > 0:
            return jsonify({'message': 'Recipe removed from favorites'}), 200
        return jsonify({'message': 'Recipe was not in favorites'}), 200
    except Exception as e:
        logger.error(f"Error removing favorite: {e}")
        return jsonify({"error": str(e)}), 500

# Felhasználó hozzávalóinak lekérdezése
@app.route('/user/ingredients', methods=['GET'])
@jwt_required()
def get_user_ingredients():
    try:
        current_user = get_jwt_identity()
        user = db.users.find_one({'username': current_user})
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
            
        # Ha nincsenek hozzávalók, üres listát adunk vissza
        ingredients = user.get('ingredients', [])
        
        return jsonify({'ingredients': ingredients}), 200
    except Exception as e:
        logger.error(f"Error getting user ingredients: {e}")
        return jsonify({"error": str(e)}), 500

# Felhasználó hozzávalóinak frissítése
@app.route('/user/ingredients', methods=['POST'])
@jwt_required()
def update_user_ingredients():
    try:
        current_user = get_jwt_identity()
        data = request.get_json()
        
        if not data or 'ingredients' not in data:
            return jsonify({'message': 'Ingredients list is required'}), 400
            
        # Frissítjük a felhasználó hozzávalóit
        result = db.users.update_one(
            {'username': current_user},
            {'$set': {'ingredients': data['ingredients']}}
        )
        
        if result.modified_count > 0:
            return jsonify({'message': 'Ingredients updated successfully'}), 200
        return jsonify({'message': 'No changes were made'}), 200
    except Exception as e:
        logger.error(f"Error updating user ingredients: {e}")
        return jsonify({"error": str(e)}), 500

# Hozzávaló törlése
@app.route('/user/ingredients/remove', methods=['POST'])
@jwt_required()
def remove_ingredient():
    try:
        current_user = get_jwt_identity()
        data = request.get_json()
        
        if not data or 'name' not in data:
            return jsonify({'message': 'Ingredient name is required'}), 400
            
        ingredient_name = data['name']
        
        # Eltávolítjuk a hozzávalót a felhasználó listájából
        result = db.users.update_one(
            {'username': current_user},
            {'$pull': {'ingredients': {'name': ingredient_name}}}
        )
        
        if result.modified_count > 0:
            return jsonify({'message': 'Ingredient removed successfully'}), 200
        return jsonify({'message': 'Ingredient was not in the list'}), 200
    except Exception as e:
        logger.error(f"Error removing ingredient: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/recipe/<recipe_name>/match', methods=['GET'])
@jwt_required()
def get_recipe_match(recipe_name):
    try:
        current_user = get_jwt_identity()
        logger.info(f"Calculating match for recipe {recipe_name} and user {current_user}")
        
        user = db.users.find_one({'username': current_user})
        if not user:
            logger.error(f"User {current_user} not found")
            return jsonify({'message': 'User not found'}), 404
            
        # Recept lekérése
        recipe = collection.find_one({"name": recipe_name})
        if not recipe:
            logger.error(f"Recipe {recipe_name} not found")
            return jsonify({"message": "Recipe not found"}), 404
            
        # Felhasználó hozzávalói
        user_ingredients = user.get('ingredients', [])
        logger.info(f"User ingredients: {json.dumps(user_ingredients, indent=2)}")
        
        # Recept hozzávalói
        recipe_ingredients = recipe.get('ingredients', [])
        logger.info(f"Recipe ingredients: {json.dumps(recipe_ingredients, indent=2)}")
        
        # Egyezések számolása
        total_ingredients = len(recipe_ingredients)
        matching_ingredients = 0
        
        for recipe_ing in recipe_ingredients:
            # Ellenőrizzük a recept hozzávaló struktúráját
            logger.info(f"Checking recipe ingredient: {json.dumps(recipe_ing, indent=2)}")
            
            # Név kinyerése a receptből
            recipe_ingredient_name = recipe_ing.get('name', '')
            logger.info(f"Recipe ingredient name: {recipe_ingredient_name}")
            
            # Keresés a felhasználó hozzávalói között
            for user_ing in user_ingredients:
                user_ingredient_name = user_ing.get('name', '')
                logger.info(f"Comparing with user ingredient: {user_ingredient_name}")
                
                if user_ingredient_name.lower() == recipe_ingredient_name.lower():
                    matching_ingredients += 1
                    logger.info(f"Found matching ingredient: {recipe_ingredient_name}")
                    break
        
        # Százalék számítása
        match_percentage = (matching_ingredients / total_ingredients * 100) if total_ingredients > 0 else 0
        logger.info(f"Match percentage: {match_percentage}% ({matching_ingredients}/{total_ingredients})")
        
        result = {
            'total_ingredients': total_ingredients,
            'matching_ingredients': matching_ingredients,
            'match_percentage': round(match_percentage, 1)
        }
        logger.info(f"Returning result: {json.dumps(result, indent=2)}")
        
        return jsonify(result), 200
        
    except Exception as e:
        logger.error(f"Error calculating recipe match: {e}")
        logger.exception("Detailed error:")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
