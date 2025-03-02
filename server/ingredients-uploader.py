import os
import json
from pymongo import MongoClient
import base64
import mimetypes

def get_mime_type(file_path):
    mime_type, _ = mimetypes.guess_type(file_path)
    return mime_type or 'image/jpeg'  # default to jpeg if can't determine

def encode_image(image_path):
    try:
        with open(image_path, 'rb') as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
            mime_type = get_mime_type(image_path)
            return f"data:{mime_type};base64,{encoded_string}"
    except Exception as e:
        print(f"Hiba a kép kódolásakor: {e}")
        return None

print("Connecting to MongoDB...")
client = MongoClient("mongodb://localhost:27017/")
db = client["MitEszunkMaDB"]
collection = db["IngredientsCollection"]  # Új collection az összetevőknek

# Placeholder kép base64 formátumban
PLACEHOLDER_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="

assets_dir = "client/src/assets"
print(f"Assets directory: {os.path.abspath(assets_dir)}")

# Ellenőrizzük, hogy létezik-e az assets könyvtár
if not os.path.exists(assets_dir):
    print(f"HIBA: Az assets könyvtár nem található: {assets_dir}")
    exit(1)

# Töröljük a korábbi adatokat a collection-ből (ha van)
delete_result = collection.delete_many({})
print(f"Deleted {delete_result.deleted_count} existing ingredients from the collection")

# Hozzávalókat a JSON fájlból
json_path = 'server/new-ingredients.json'
print(f"Reading ingredients from: {os.path.abspath(json_path)}")

if not os.path.exists(json_path):
    print(f"HIBA: A JSON fájl nem található: {json_path}")
    exit(1)

with open(json_path, 'r', encoding='utf-8') as f:
    ingredients_data = json.load(f)

print(f"Found {len(ingredients_data['ingredients'])} ingredients in the JSON file")

success_count = 0
error_count = 0
missing_image_count = 0

for ingredient in ingredients_data["ingredients"]:
    image_path = os.path.join(assets_dir, ingredient["image"])
    print(f"Looking for image at: {image_path}")
    
    if os.path.exists(image_path):
        encoded_image = encode_image(image_path)
        if encoded_image:
            ingredient["image"] = encoded_image
            print(f"Added ingredient with image: {ingredient['name']}")
            success_count += 1
        else:
            print(f"Error encoding image for ingredient: {ingredient['name']}, using placeholder...")
            ingredient["image"] = PLACEHOLDER_IMAGE
            error_count += 1
    else:
        print(f"Image not found for ingredient: {ingredient['name']}, using placeholder...")
        ingredient["image"] = PLACEHOLDER_IMAGE
        missing_image_count += 1
    
    collection.insert_one(ingredient)

print("\nIngredients upload summary:")
print(f"- Successfully added with images: {success_count}")
print(f"- Added with encoding errors: {error_count}")
print(f"- Added with missing images: {missing_image_count}")
print(f"- Total ingredients added: {success_count + error_count + missing_image_count}")

# Ellenőrizzük, hogy tényleg feltöltődtek-e az adatok
count = collection.count_documents({})
print(f"Total ingredients in the collection after upload: {count}")

print("\nIngredients upload completed successfully!") 