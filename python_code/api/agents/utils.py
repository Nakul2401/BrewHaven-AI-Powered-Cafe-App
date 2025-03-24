def get_response(client, model_name, messages, temperature = 0):
    
    input_messages = []
    for message in messages:
        input_messages.append({"role": message["role"], "content": message["content"]})
                                                                           
    response = client.chat.completions.create(
    model=model_name,
    messages= input_messages,
    temperature=temperature,
    top_p= 0.8,
    max_tokens=2000,
    ).choices[0].message.content

    return response


def get_embedding(embedding_client,embedding_model,text_input):
    output = embedding_client.embeddings.create(input = text_input,model=embedding_model)
    
    embedings = []
    for embedding_object in output.data:
        embedings.append(embedding_object.embedding)

    return embedings


def double_check_json_output(client,model_name,json_string):
    prompt = f""" You will check this json string and correct any mistakes that are making it invalid. Then you will return the corrected json string. Nothing else. 
    If the json string is in correct format just return it.

    if there is any text before or after the json string, remove it.
    make sure that json string is in correct format. enclosing keys and values in double quotes
    Do NOT return a single letter outside of the json string.
    The first thing you should write is curly brace of the json and last letter you write should be the closing curly brace.

    you should check the json string for following text between triple backticks:
    ```
    {json_string}
    ```
    """

    messages = [{"role": "user", "content": prompt}]

    response = get_response(client,model_name,messages)
    response = response.replace("`","")

    return response