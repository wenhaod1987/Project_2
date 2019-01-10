from flask import Flask, render_template, request
import pandas as pd
import numpy as np 
import matplotlib.pyplot as plt
import math
import datetime
import matplotlib.colors as colors
from bs4 import BeautifulSoup as bs
import requests
import time
from splinter import Browser
import pymongo
from API_Config_Keys import Google_API
import os
import json




app = Flask(__name__)



# #################################

# main page
@app.route('/')
def form():

    return render_template("index.html")


@app.route("/Datasource.html")
def form2():
    return render_template('Datasource.html')

@app.route("/LM.html")
def form3():
    return render_template('LM.html')

# route to load data from csv
@app.route("/data")
def data():
    df = pd.read_csv('Data/property_data.csv')
    return df.to_json(orient='records')


if __name__ == '__main__':
    app.run(port = 8000, debug=True)
