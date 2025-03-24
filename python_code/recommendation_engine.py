from mlxtend.frequent_patterns import apriori, association_rules
import pandas as pd  
import json
import pprint

sales_reciepts = pd.read_csv('dataset/201904 sales reciepts.csv')
# print(sales_reciepts.head())

products = pd.read_csv('dataset/product.csv')

sales_reciepts = sales_reciepts[["transaction_id", "transaction_date", "customer_id", "product_id", "quantity","sales_outlet_id"]]
products = products[["product_id", "product_category", "product"]]

dataset = pd.merge(sales_reciepts, products, on="product_id", how="left")

dataset["product"]=dataset["product"].str.replace(" Rg","")
dataset["product"]=dataset["product"].str.replace(" Sm","")
dataset["product"]=dataset["product"].str.replace(" Lg","")

products_to_take = ['Cappuccino', 'Latte', 'Espresso shot',  \
                     'Dark chocolate','Sugar Free Vanilla syrup', 'Chocolate syrup',\
                    'Carmel syrup', 'Hazelnut syrup', 'Ginger Scone',  \
                    'Chocolate Croissant', 'Jumbo Savory Scone', 'Cranberry Scone', 'Hazelnut Biscotti',\
                    'Croissant', 'Almond Croissant', 'Oatmeal Scone', 'Chocolate Chip Biscotti',\
                    'Ginger Biscotti',\
                   ]

dataset = dataset[dataset['product'].isin(products_to_take)]

dataset['transaction'] = dataset['transaction_id'].astype(str) +"_"+  dataset['customer_id'].astype(str)

num_of_items_for_each_transaction = dataset['transaction'].value_counts().reset_index()
valid_transactions = num_of_items_for_each_transaction[(num_of_items_for_each_transaction['count']>1)]['transaction'].tolist()
dataset = dataset[dataset['transaction'].isin(valid_transactions)]
print(dataset.shape)
#Popular Recommendation Engine
popularity_recommendation = dataset.groupby(['product','product_category']).count().reset_index()
popularity_recommendation = popularity_recommendation[['product','product_category','transaction_id']]
popularity_recommendation = popularity_recommendation.rename(columns = {'transaction_id':'number_of_transactions'})

popularity_recommendation.to_csv('api/recommendation_objects/popularity_recommendation.csv',index=False) 


train_basket = (dataset.groupby(['transaction','product'])['product'].count().reset_index(name ='Count'))
my_basket = train_basket.pivot_table(index='transaction', columns='product', values='Count', aggfunc='sum').fillna(0)


def encode_units(x):
  if x <= 0:
    return 0
  if x >= 0:
    return 1

my_basket_sets = my_basket.applymap(encode_units)


frequent_items = apriori(my_basket_sets, min_support = 0.05,use_colnames = True)
rules_basket = association_rules(frequent_items, metric = "lift", min_threshold = 1)

product_categories = dataset[['product','product_category']].drop_duplicates().set_index('product').to_dict()['product_category']

recommendations_json = {}

antecedents = rules_basket['antecedents'].unique()
for antecedent in antecedents:
    df_rec = rules_basket[rules_basket['antecedents']==antecedent]
    df_rec = df_rec.sort_values('confidence',ascending=False)
    key = "_".join(antecedent)
    recommendations_json[key] = []
    for _, row in df_rec.iterrows():
        rec_objects =row['consequents']
        for rec_object in rec_objects:
            already_exists = False
            for current_rec_object in recommendations_json[key]:
                if rec_object == current_rec_object['product']:
                    already_exists=True
            if already_exists:
                continue
            
            rec = {'product':rec_object, 
                   'product_category':product_categories[rec_object],
                   'confidence': row['confidence']
                  }
            recommendations_json[key].append(rec)


with open('api/recommendation_objects/apriori_recommendations.json', 'w') as json_file:
    json.dump(recommendations_json, json_file)