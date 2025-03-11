from pymongo import MongoClient
from datetime import datetime, timedelta
import random

client = MongoClient('mongodb://localhost:27017/')
db = client['MitEszunkMaDB']
recipes_collection = db['RecipiesCollection']
reviews_collection = db['ReviewsCollection']

#Példa felhasználónevek
usernames = ['Niki', 'Adam', 'Karesz', 'Zsuzsi', 'Peti', 'Anna', 'Máté', 'Eszter']

#Példa vélemény szövegek
all_comments = {
    'positive': [
        "Nagyon finom lett, mindenkinek ajánlom!",
        "Egyszerű elkészíteni és nagyszerű az íze.",
        "A család kedvence lett, gyakran elkészítem.",
        "Tökéletes recept, pont olyan lett, mint a képen.",
        "Remek választás vendégvárónak is.",
        "Fantasztikus recept, köszönöm!",
        "Sokkal jobb, mint vártam!",
        "Ez lesz a kedvenc receptem mostantól.",
        "Gyorsan elkészíthető és nagyon finom!",
        "Mindenki repetázott belőle!"
    ],
    'neutral': [
        "Jó recept, de én kicsit másképp készítem.",
        "Ehető, de lehetne még finomítani rajta.",
        "Nem rossz, de nem is kiemelkedő.",
        "Egyszer érdemes kipróbálni.",
        "Átlagos recept, semmi extra.",
        "Működik, de van rajta mit csiszolni.",
        "Közepes eredmény, de azért ehető.",
        "Nem lett rossz, de nem is tökéletes."
    ],
    'negative': [
        "Sajnos nem sikerült olyan jól, mint vártam.",
        "Túl bonyolult az elkészítése.",
        "Nekem nem jött be az íze.",
        "Nem ajánlom kezdőknek.",
        "Túl időigényes a végeredményhez képest.",
        "Valami hiányzik belőle.",
        "Nem olyan finom, mint amilyennek kinéz.",
        "Kicsit csalódtam benne."
    ]
}

#Használt kommentek nyilvántartása
used_comments = set()

def get_unused_comment(rating):
    global used_comments
    
    #Komment típus kiválasztása az értékelés alapján
    if rating >= 4:
        available_comments = [c for c in all_comments['positive'] if c not in used_comments]
        if not available_comments:
            used_comments = set()
            available_comments = all_comments['positive']
    elif rating == 3:
        available_comments = [c for c in all_comments['neutral'] if c not in used_comments]
        if not available_comments:
            used_comments = set()
            available_comments = all_comments['neutral']
    else:
        available_comments = [c for c in all_comments['negative'] if c not in used_comments]
        if not available_comments:
            used_comments = set()
            available_comments = all_comments['negative']
    
    comment = random.choice(available_comments)
    used_comments.add(comment)
    return comment

def generate_review(recipe_id, recipe_name):
    rating = random.randint(1, 5)
    
    comment = get_unused_comment(rating)
    
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
    reviews_collection.delete_many({})
    print("Meglévő vélemények törölve.")
    
    recipes = recipes_collection.find()
    total_reviews = 0
    
    for recipe in recipes:
        num_reviews = random.randint(1, 3)
        
        for _ in range(num_reviews):
            review = generate_review(recipe['_id'], recipe['name'])
            reviews_collection.insert_one(review)
            total_reviews += 1
    
    print(f"Összesen {total_reviews} vélemény lett feltöltve.")

if __name__ == "__main__":
    print("Vélemények feltöltése kezdődik...")
    upload_sample_reviews()
    print("Vélemények feltöltése befejeződött.") 