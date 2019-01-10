
import pymongo
import pandas as pd


conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)
db=client.PropertyDB
properties = pd.DataFrame(list(db.property_data.find()))
properties.to_csv("Data/property_data.csv",index=False)

