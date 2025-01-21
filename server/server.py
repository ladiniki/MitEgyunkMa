from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import base64
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

client = MongoClient("mongodb://localhost:27017/")
db = client["MitEszunkMaDB"]
collection = db["RecipiesCollection"]

# TODO: put it in a .env file instead :)
app.config["JWT_SECRET_KEY"] = "7a61647cb6417a6f191d46a4c674279fe48981a0e40b6601581099135f1d1d6555e5fd61d4a4bb29aeec06e688a77971cbf979754996161667b34e9b2db8026f9214e9349176a5f646d5053a5974499b806c7a35c7f6c253deb5a487236a61a40b710139d48e40f2d222f7780e91a90dc7e7e025db76a79f9a99685ec1302bd67b727b50083eac8f849ebd66ba1fa7440175878d9ac690c0c859d1e2ea6e7fcd33e45f723d023778883765102d617f796353783d0a092d300f7b00c389eb1abf7d3a90ee06edf8148219ed856876651a191d56768f2b7f6daf71f5f8f1415b64ae37660bb318d650b18e20f7d6ac193afb4042efbd5ac2965a0ec799a96eff33" 
jwt = JWTManager(app)


@app.route('/recipies', methods=['GET'])
def get_recipies():
    recipies = collection.find()
    result = []

    for recipe in recipies:
        image_data = recipe.get("image", None)
        if image_data:
            image_data = image_data.decode('utf-8') if isinstance(image_data, bytes) else image_data
        result.append({
            "name": recipe.get("name"),
            "cookingTime": recipe.get("cookingTime"),
            "image": image_data
        })

    return jsonify(result)


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
    db.users.insert_one({'username': username, 'password': hashed_password})

    return jsonify({'message': 'Successful registration'}), 201


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

if __name__ == '__main__':
    app.run(debug=True)
