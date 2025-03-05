from pymongo import MongoClient
from datetime import datetime, timedelta
import random

# MongoDB kapcsolat létrehozása
client = MongoClient('mongodb://localhost:27017/')
db = client['MitEszunkMaDB']
recipes_collection = db['RecipiesCollection']
reviews_collection = db['ReviewsCollection']

# Példa felhasználónevek
usernames = ['Niki', 'Adam', 'Karesz', 'Zsuzsi', 'Peti', 'Anna', 'Máté', 'Eszter']

# Példa vélemény szövegek
positive_comments = [
    "Nagyon finom lett, mindenkinek ajánlom!",
    "Egyszerű elkészíteni és nagyszerű az íze.",
    "A család kedvence lett, gyakran elkészítem.",
    "Tökéletes recept, pont olyan lett, mint a képen.",
    "Remek választás vendégvárónak is."
]

neutral_comments = [
    "Jó recept, de én kicsit másképp készítem.",
    "Ehető, de lehetne még finomítani rajta.",
    "Nem rossz, de nem is kiemelkedő.",
    "Egyszer érdemes kipróbálni."
]

negative_comments = [
    "Sajnos nem sikerült olyan jól, mint vártam.",
    "Túl bonyolult az elkészítése.",
    "Nekem nem jött be az íze.",
    "Nem ajánlom kezdőknek."
]

def generate_review(recipe_id, recipe_name):
    # Véletlenszerű értékelés (1-5)
    rating = random.randint(1, 5)
    
    # Az értékeléstől függően választunk kommentet
    if rating >= 4:
        comment = random.choice(positive_comments)
    elif rating == 3:
        comment = random.choice(neutral_comments)
    else:
        comment = random.choice(negative_comments)
    
    # Véletlenszerű dátum az elmúlt 30 napból
    random_days = random.randint(0, 30)
    review_date = datetime.now() - timedelta(days=random_days)
    
    return {
        "recipe_id": recipe_id,
        "recipe_name": recipe_name,
        "username": random.choice(usernames),
        "rating": rating,
        "comment": comment,
        "date": review_date
    }

def upload_sample_reviews():
    # Töröljük a meglévő véleményeket
    reviews_collection.delete_many({})
    print("Meglévő vélemények törölve.")
    
    # Lekérjük az összes receptet
    recipes = recipes_collection.find()
    total_reviews = 0
    
    for recipe in recipes:
        # Minden recepthez 1-5 véleményt generálunk
        num_reviews = random.randint(1, 5)
        
        for _ in range(num_reviews):
            review = generate_review(recipe['_id'], recipe['name'])
            reviews_collection.insert_one(review)
            total_reviews += 1
    
    print(f"Összesen {total_reviews} vélemény lett feltöltve.")

if __name__ == "__main__":
    print("Vélemények feltöltése kezdődik...")
    upload_sample_reviews()
    print("Vélemények feltöltése befejeződött.") 