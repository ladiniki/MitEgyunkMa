import os
from pymongo import MongoClient
import base64

client = MongoClient("mongodb://localhost:27017/")  
db = client["MitEszunkMaDB"]  
collection = db["RecipiesCollection"]  

assets_dir = "client/src/assets"

recipies = [
    { "name": "Tükörtojás", "cookingTime": 10, "image": "tükörtojás.jpg", "mealType": "reggeli" },
    { "name": "Gofri", "cookingTime": 20, "image": "gofri.jpg", "mealType": "reggeli" },
    { "name": "Krumpli", "cookingTime": 30, "image": "krumpli.jpg", "mealType": "ebéd" },
    { "name": "Kukorica", "cookingTime": 15, "image": "kukorica.jpg", "mealType": "ebéd" },
    { "name": "Csokitorta", "cookingTime": 45, "image": "csokitorta.jpeg", "mealType": "desszert" },
]

# Töröljük a korábbi recepteket
collection.delete_many({})

for recipe in recipies:
    image_path = os.path.join(assets_dir, recipe["image"])
    print(f"Looking for image at: {image_path}")  
    if os.path.exists(image_path):
        with open(image_path, 'rb') as image_file:
            encoded_image = base64.b64encode(image_file.read())
            recipe["image"] = encoded_image
        print(f"Added recipe: {recipe['name']}")
        collection.insert_one(recipe)
    else:
        print(f"Image not found for recipe: {recipe['name']}, skipping...")

