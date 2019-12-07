import pandas as pd
from konlpy.tag import Okt
from sqlalchemy import create_engine
import pickle
from vector_list import category_diction


engine = create_engine("mysql+pymysql://viewer:"+"moja"+"@localhost/mojadol_DB00?host=localhost?port=3306", encoding='utf-8')

okt = Okt()

def tokenlize(x):
    temp = okt.pos(x)
    res = []
    for idx in temp:
        if idx[1] == 'Punctuation':
            pass
        elif idx[1] == 'Number':
            if idx[0][0:2] == '20':
                pass
            else:
                res.append(idx[0])
        else:
            #print(idx[0])
            res.append(idx[0])
    
    return res

def word_count(df):
    # x is df
    df_temp = df.copy()
    word_dict = {}
    for inx,row in df_temp.iterrows():
        
        for idx in row['title_okt']:
            if idx in word_dict.keys():
                word_dict[idx] = word_dict[idx] +1
            else:
                word_dict[idx] = 1
    return word_dict


def make_vector():

    conn = engine.connect()

    policy = pd.read_sql("select * from policy",con = conn)
    interest = pd.read_sql("select * from interest",con=conn)

    policy = pd.merge(policy,interest,on='p_code')


    policy['title_okt'] = policy['title'].apply(lambda x : tokenlize(x))

    word_dict = word_count(policy)
    
    with open("word_dict.pickle","wb") as fw:
        pickle.dump(word_dict,fw)
    
    word_count_dict = {}    
    for idx in category_diction.keys():
        temp = 0
        for kda in category_diction[idx]:
            temp = temp + word_dict[kda]
        word_count_dict[idx] = temp

    with open("word_count_dict.pickle",'wb') as fw:
        pickle.dump(word_count_dict,fw)

make_vector()    
