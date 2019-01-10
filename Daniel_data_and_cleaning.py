
# coding: utf-8

# In[12]:


from bs4 import BeautifulSoup as bs
import pandas as pd
import requests
import time
from splinter import Browser


# In[13]:


import pymongo


# # Thanks to Redfin.com for the convenient download link!!!

# In[20]:


url="https://www.redfin.com/zipcode/"
zip_code = "92618"
executable_path = {'executable_path': 'chromedriver.exe'} 
browser = Browser('chrome', **executable_path, headless=False)
browser.visit(url+zip_code)


    # In[21]:


redfin_html=browser.html
soup_redfin = bs(redfin_html, 'html.parser')
result=soup_redfin.find('a',class_='downloadLink')["href"]
csv_link = "https://www.redfin.com/"+result
browser.visit(csv_link)


    # In[22]:


select_housing_data = pd.read_csv(csv_link)
select_housing_data = select_housing_data[select_housing_data["SQUARE FEET"]>1000]
select_housing_data = select_housing_data[select_housing_data["PRICE"]>1000]
select_housing_data = select_housing_data[select_housing_data["BEDS"]>0]
select_housing_data = select_housing_data[select_housing_data["BATHS"]>0]
select_housing_data = select_housing_data.sort_values(by=["ADDRESS"])

browser.quit()

    # # run mongod in gitbash / terminal

    # In[36]:


conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)
db=client.PropertyDB
# clear database for each scraping
if db.property_data:
    db.property_data.drop()


# In[39]:


for index,row in select_housing_data.iterrows():

    if row[2][:4]=="Cond":
        type="Condo"
    elif row[2][:4]=="Sing":
        type="Single-Family"
    elif row[2][:4]=="Mult":
        type="Multi-Family"
    elif row[2][:4]=="Town":
        type="Townhouse"
    else:
        type="Other"
    db.property_data.insert_one({
        "property_type":type,
        "address":row[3],
        "city":row[4],
        "state":row[5],
        "price":row[7],
        "BnB":f"{row[8]}B{row[9]}B",
        "location":row[10],
        "sq_feet":row[11],
        "year_built":row[13],
        "dollar_per_sqfeet":row[15],
        "HOA":row[16],
        "redfin_link":row[20],
        "lat":row[25],
        "long":row[26],
        
    })

properties = pd.DataFrame(list(db.property_data.find()))
properties.to_csv("Data/property_data.csv",index=False)
