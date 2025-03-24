import firebase_admin
from firebase_admin import credentials, storage, db
import pandas as pd
import os
from dotenv import load_dotenv
load_dotenv()


service_account_info = {
    "type": os.getenv("FIREBASE_PROJECT_TYPE"),
    "project_id": os.getenv("FIREBASE_PROJECT_ID"),
    "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
    "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace('\\n', '\n'),
    "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
    "client_id": os.getenv("FIREBASE_CLIENT_ID"),
    "auth_uri": os.getenv("FIREBASE_AUTH_URI"),
    "token_uri": os.getenv("FIREBASE_TOKEN_URI"),
    "auth_provider_x509_cert_url": os.getenv("FIREBASE_AUTH_PROVIDER_X509_CERT_URL"),
    "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_X509_CERT_URL"),
    "universe_domain": os.getenv("FIREBASE_UNIVERSE_DOMAIN"),
}

cred = credentials.Certificate(service_account_info)
firebase_admin.initialize_app(cred, {
    'storageBucket': 'brewbot-fac2b.firebasestorage.app',
    'databaseURL': 'https://brewbot-fac2b-default-rtdb.firebaseio.com/',
})


bucket = storage.bucket()

images_path = './products/images'
products_collection = db.reference('products')

df = pd.read_json('products/products.jsonl', lines=True)
# print(df.head())

def upload_image(bucket, image_path):
    image_name = image_path.split('/')[-1]
    blob = bucket.blob(f'product_images/{image_name}')
    blob.upload_from_filename(image_path)
    blob.make_public()
    return blob.public_url


for index, row in df.iterrows():
    print(index, row['name'])
    
    image_path = os.path.join(images_path,row['image_path'])
    image_url = upload_image(bucket,image_path)
    product_data = row.to_dict()
    product_data.pop('image_path')
    product_data['image_url']= image_url

    products_collection.push().set(product_data)