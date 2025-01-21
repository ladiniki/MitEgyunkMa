import os
import base64
from pymongo import MongoClient
from shutil import copyfile

client = MongoClient("mongodb://localhost:27017/")
db = client["MitEszunkMaDB"]
collection = db["RecipiesCollection"]

output_dir = "./downloaded_images"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

recipies = collection.find()

for recipe in recipies:
    
    if 'image' in recipe:
        try:
            image_data = base64.b64decode(recipe['image'])
            image_filename = f"{recipe['name']}_{recipe['_id']}.jpg" 
            image_path = os.path.join(output_dir, image_filename)

            with open(image_path, 'wb') as img_file:
                img_file.write(image_data)

            print(f"Image saved: {image_path}")
        except Exception as e:
            print(f"Error decoding and saving image for recipe {recipe['name']}: {e}")
    else:
        print(f"Image not found for recipe: {recipe['name']}")

print("Image download and verification complete.")
