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

client = MongoClient("mongodb://localhost:27017/")
db = client["MitEszunkMaDB"]
collection = db["RecipiesCollection"]

# Placeholder kép base64 formátumban
PLACEHOLDER_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="

assets_dir = "client/src/assets"

collection.delete_many({})

# Recepteket a JSON fájlból
with open('server/recipes.json', 'r', encoding='utf-8') as f:
    recipe_data = json.load(f)

for recipe in recipe_data["recipes"]:
    image_path = os.path.join(assets_dir, recipe["image"])
    print(f"Looking for image at: {image_path}")
    
    if os.path.exists(image_path):
        encoded_image = encode_image(image_path)
        if encoded_image:
            recipe["image"] = encoded_image
            print(f"Added recipe with image: {recipe['name']}")
        else:
            print(f"Error encoding image for recipe: {recipe['name']}, using placeholder...")
            recipe["image"] = PLACEHOLDER_IMAGE
    else:
        print(f"Image not found for recipe: {recipe['name']}, using placeholder...")
        recipe["image"] = PLACEHOLDER_IMAGE
    
    collection.insert_one(recipe)

print("Recipe upload completed successfully!")

