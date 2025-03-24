from openai import OpenAI
import os
from pinecone import Pinecone
from copy import deepcopy
from .utils import get_response, get_embedding
from dotenv import load_dotenv 
load_dotenv() 

class DetailsAgent():

    def __init__(self):
        # self.runpod_endpoint_id = os.getenv("RUNPOD_ENDPOINT_ID")
        self.client = OpenAI(
            api_key = os.getenv("RUNPOD_TOKEN"),
            base_url = os.getenv("RUNPOD_CHATBOT_URL"),
            )
        self.model_name = os.getenv("MODEL_NAME")

        # self.runpod_embedding_url = os.getenv("RUNPOD_EMBEDDING_URL")

        self.embedding_client = OpenAI(
            api_key=os.getenv("RUNPOD_TOKEN"), 
            base_url=os.getenv("RUNPOD_EMBEDDING_URL"),
            )
        
        self.embedding_model = os.getenv("EMBEDDING_MODEL")
        
        self.pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
        self.index_name = os.getenv("PINECONE_INDEX_NAME")

    def get_closest_results(self,index_name,input_embeddings,top_k=2):
        index = self.pc.Index(index_name)
            
        results = index.query(
            namespace='ns1',
            vector=input_embeddings,
            top_k=top_k,
            include_values=False,
            include_metadata=True
        )

        return results
        
    def response(self,messages):
        messages = deepcopy(messages)

        user_message = messages[-1]['content']
        user_message_embedding = get_embedding(self.embedding_client,self.embedding_model,user_message)[0]

        result = self.get_closest_results(self.index_name,user_message_embedding)
        retrieved_context = "\n".join([x['metadata']['text'].strip()+'\n' for x in result['matches']])

        prompt = f"""
        Using the contexts below, answer the query.

        Contexts:
        {retrieved_context}

        Query: {user_message}
        """

        system_prompt = """ You are a customer support agent for a coffee shop application called BrewHaven. You should answer every question as if you are waiter and provide the neccessary information to the user regarding their orders. Note that all the prices are in ₹. """
        messages[-1]['content'] = prompt
        input_messages = [{"role": "system", "content": system_prompt}] + messages[-4:]

        chatbot_output =get_response(self.client,self.model_name,input_messages)
        output = self.postprocess(chatbot_output)

        return output
        
    def postprocess(self,output):
        output = {
            "role": "assistant",
            "content": output,
            "memory":{
                "agent":"details_agent"
            }
        }
        return output






        