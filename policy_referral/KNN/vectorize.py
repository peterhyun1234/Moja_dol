import pandas as pd
from vector_list import category_diction
from joblib import load 
import pickle

def vectorize_by_world(df):
    with open("/root/mojadol_server/KNN/category_diction_count.pickle",'rb') as fw:
        category_diction_count = pickle.load(fw)
   
    word_dict = category_diction.copy()
    res = [0]*(4+len(word_dict))
    key_list = list(word_dict.keys())
    
    if df['Employment_sup'] == 1:
        res[0] = 0
    if df['Startup_sup'] == 1:
        res[1] = 0
    if df['Life_welfare'] == 1:
        res[2] = 0
    if df['Residential_finance'] == 1:
        res[3] = 0
    for idx in word_dict:
         for kda in word_dict[idx]:
                if kda in df['title']:
                    res[4+key_list.index(idx)] = 1 / category_diction_count[kda]
        
    df['vector'] = res
    return df
