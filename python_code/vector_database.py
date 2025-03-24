from pinecone import Pinecone, ServerlessSpec
from openai import OpenAI
import pandas as pd 
from time import time
import os
from dotenv import load_dotenv
load_dotenv()

RUNPOD_API_KEY = os.getenv("RUNPOD_API_KEY")
RUNPOD_ENDPOINT_ID = os.getenv("RUNPOD_ENDPOINT_ID")
OPENAI_BASE_URL = f"https://api.runpod.ai/v2/{RUNPOD_ENDPOINT_ID}/openai/v1"
RUNPOD_EMBEDDING_URL = os.getenv("RUNPOD_EMBEDDING_URL")
MODEL_NAME = os.getenv("MODEL_NAME")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")


pc = Pinecone(api_key = PINECONE_API_KEY)

client = OpenAI(
    api_key = RUNPOD_API_KEY,
    base_url = RUNPOD_EMBEDDING_URL,
)

df=pd.read_json('products/products.jsonl',lines=True)

df['text'] =  df['name']+" : "+df['description'] + \
                " -- Ingredients: " + df['ingredients'].astype(str) + \
                " -- Price: " + df['price'].astype(str) + \
                " -- rating: " + df['rating'].astype(str) 

embedding_data = df['text'].tolist()


with open('products/BrewHaven_about_us.txt') as f:
    BrewHaven_about_section = f.read()
    
BrewHaven_about_section = "BrewHaven about section: " + BrewHaven_about_section
embedding_data.append(BrewHaven_about_section)


with open('products/menu_items_text.txt') as f:
    menu_items_text = f.read()
    
menu_items_text = "Menu Items: " + menu_items_text
embedding_data.append(menu_items_text)


output = client.embeddings.create(input = embedding_data, model=EMBEDDING_MODEL)

embeddings = output.data

index_name = "brewhaven"
pc.create_index(
    name=index_name,
    dimension=384, 
    metric="cosine",
    spec=ServerlessSpec(
        cloud="aws",
        region="us-east-1"
    ) 
)


while not pc.describe_index(index_name).status['ready']:
    time.sleep(1)

index = pc.Index(index_name)

vectors = []
for text, e in zip(embedding_data, embeddings):
    entry_id = text.split(":")[0].strip()
    vectors.append({
        "id": entry_id,
        "values": e.embedding,
        "metadata": {'text': text}
    })
    
index.upsert(
    vectors=vectors,
    namespace="ns1"
)




