import pandas as pd
from sqlalchemy import create_engine
from sklearn.neighbors import NearestNeighbors
from joblib import dump

import sys,os


sys.path.append('/root/mojadol_server/KNN')
#print(os.path.dirname(os.path.abspath(os.path.dirname(os.path.abspath(os.path.dirname('mojadol_server'))))))

from vector_list import category_diction
from vectorize import vectorize_by_world

engine = create_engine("mysql+pymysql://viewer:"+"moja"+"@localhost/mojadol_DB00?host=localhost?port=3306", encoding='utf-8')

#category_diction = {'관광':['관광'],'청소년':['청소년'],'청년':['청년'],'창업':['창업'],'취업':['취업'],'대학':['대학'],'주택':['주택','기숙사'],'채용':['채용'],
#                   '교육':['교육'],'문화':['문화'],'해외':['해외'],'융자':['융자','대출'],'정장':['정장'],'인턴십':['인턴십','멘토링'],'심리':['심리','흥미'],'프로그램':['프로그램'],'여성':['여성'],'근로자':['근로자'],'장애인':['장애인'],'통장':['통장'],'장학금':['장학금'],'면접':['면접']}


#def vectorize_by_world(df):
#    word_dict = category_diction.copy()
#    res = [0]*(4+len(word_dict))
#    key_list = list(word_dict.keys())
    
#    if df['Employment_sup'] == 1:
#        res[0] = 1
#    if df['Startup_sup'] == 1:
#        res[1] = 1
#    if df['Life_welfare'] == 1:
#        res[2] = 1
#    if df['Residential_finance'] == 1:
#        res[3] = 1
#    for idx in word_dict:
#         for kda in word_dict[idx]:
#                if kda in df['title']:
#                    res[4+key_list.index(idx)] = 1
#    df['vector'] = res
#    return df

def make_knn_model():
    conn = engine.connect()
    policy = pd.read_sql("select * from policy where expiration_flag=2 or (apply_end >= NOW())",con = conn)

    interest = pd.read_sql('select * from interest where p_code in (select p_code from policy where expiration_flag=2 or (apply_end >=NOW()))',con=conn)

    policy = pd.merge(policy,interest,on='p_code')
    
     
   
    policy = policy.apply(vectorize_by_world,axis =1)
    model_knn = NearestNeighbors(metric='cosine', algorithm='brute')
    res_model=model_knn.fit(list(policy['vector']))
    dump(res_model,'/root/mojadol_server/KNN/knn.joblib')


#make_knn_model()
