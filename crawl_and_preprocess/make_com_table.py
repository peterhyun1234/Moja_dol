#-*-coding: utf-8-*-
import pandas as pd
import re
from konlpy.tag import Okt
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError,IntegrityError

from test_slack import slack_chat

engine = create_engine("mysql+pymysql://viewer:"+"moja"+"@localhost/crawl_db?host=localhost?port=3306", encoding='utf-8')
conn = engine.connect()

jababa_pre_table = "select * from jababa_preprocess"
youth_pre_table = "select * from youth_preprocess"
gov_pre_table = "select * from gov_preprocess"

table_integrate = """
CREATE TABLE combine_table(
table1 varchar(200),
id1 varchar(100),
table2 varchar(200),
id2 varchar(100),
listing tinyint(1),
CONSTRAINT inte_pk PRIMARY KEY (table1,id1,table2,id2)
)

"""

pattern_brace1 = re.compile(r"[\(\)]+")
pattern_brace2 = re.compile(r"\[^\]]*\]")
pattern_uri_head = re.compile(r"(?<=\:\/\/)[^\/]*")
pattern_year = re.compile(r'[0-9]+년')
pattern_cha  = re.compile(r'[0-9]+년')

filter_list = []

def remove_brace(x):
    res = x
    
    res = pattern_brace1.sub(" ",res)
    # res = pattern_brace2.sub("",res)
    
    return res

def Overlap_coefficient(x,y):
    x_set = set(x)
    y_set = set(y)
    numerator = len(x_set.intersection(y_set))
    denominator = min(len(x_set),len(y_set))
    
    if denominator == 0:
        return 0
    else:
        return (numerator/denominator)

def parse_uri_list(x):
    res = []
    for i in x:
        if pattern_uri_head.search(i):
            res.append(pattern_uri_head.search(i).group())
        else:
            res.append(i)
    return res

def list_count_word(df):
    res = {}
    for idx,row in df.iterrows():
        for kda in row['token']:
            if res.get(kda) == None:
                res[kda] = 1
            else:
                res[kda] = res[kda] +1
    for idx in sorted(res,key=lambda x : res[x],reverse=True):
         ## compared number is variable
         if int(res[idx])>=300:
            filter_list.append(idx)

def list_filtering(x):
    res = [] 
    for idx in x:
        if idx in filter_list:
            pass
        else:
            res.append(idx)
    return res

def make_com_table():
    df_j=pd.read_sql(jababa_pre_table,con=conn)
    df_y=pd.read_sql(youth_pre_table,con=conn)
    
    df_g = pd.read_sql(gov_pre_table,con=conn)

    df_j2 = df_j #.loc[df_j['dor']=='전국']
    df_j2 = df_j2.loc[(df_j2['title']!='err')]

    df_y['title_refine'] =  df_y['title'].apply(lambda x : remove_brace(x))
    df_j2['title_refine'] = df_j2['title'].apply(lambda x : remove_brace(x))
       

    okt = Okt()

    df_y['token'] = df_y['title'].apply(lambda x: set(okt.morphs(x)))

    df_j2['token'] = df_j2['title'].apply(lambda x : set(okt.morphs(x)))
   
    df_g['token'] = df_g['title'].apply(lambda x: set(okt.morphs(x)))
 
    list_count_word(df_j2)
    
    df_j2.loc[:,'token_filterd'] = df_j2['token'].apply(lambda x : list_filtering(x))
   
    
   
    df_j2['p_test']=df_j2['policy_uri'].apply(lambda x : pattern_uri_head.search(str(x)).group() if pattern_uri_head.search(str(x)) else False)


    df_y['p_test']=df_y['policy_uri'].apply(lambda x : str(x).split(","))

    df_y['p_test2'] = df_y['p_test'].apply(lambda x: parse_uri_list(x))

    df_integrate = pd.DataFrame(columns=['table1','id1','table2','id2','listing'])
    
    ## jababa and youth
    for idx,yrow in df_y.loc[df_y['dor']=='전국'].iterrows():
        flag = 0
        for kda,jrow in df_j2.loc[df_j2['dor']=='전국'].iterrows():
            if Overlap_coefficient(yrow['token'],jrow['token_filterd']) > 0.5:
                df_integrate = df_integrate.append({'table1':'youth_preprocess','id1':yrow['id'],'table2':'jababa_preprocess','id2':jrow['id']},ignore_index = True)
    
    for idx,yrow in df_y.loc[df_y['dor']=='전국'].iterrows():
        for kda,grow in df_g.iterrows():
            if Overlap_coefficient(yrow['token'],grow['token']) > 0.5:
                df_integrate = df_integrate.append({'table1':'youth_preprocess','id1':yrow['id'],'table2':'gov_preprocess','id2':grow['id']},ignore_index = True)
    
 


    # jababa inner dup
    for cat in list(df_j2['category'].unique()):
        for idx in df_j2.location.unique():
            n=1
            for i,row1 in df_j2.loc[(df_j2.location==idx)&(df_j2.category == cat)].iterrows():
                for k,row2 in df_j2.loc[(df_j2.location==idx)&(df_j2.category == cat)].iloc[n:].iterrows():
                    if Overlap_coefficient(row1['token_filterd'],row2['token_filterd'])>0.5:
                        df_integrate = df_integrate.append({'table1':'jababa_preprocess','id1':row1['id'],'table2':'jababa_preprocess','id2':row2['id']},ignore_index = True)
    
                n=n+1 


    df_integrate['listing']= 0 

  
    try:
        conn.execute(table_integrate)
    except SQLAlchemyError as e:
        print('table??')
        print(e)
        pass
    
    n= len(df_integrate)
    for i in range(len(df_integrate)):
        try:
            df_integrate.iloc[i:i+1].to_sql(name="combine_table",if_exists='append',con=conn,index=False)
        except IntegrityError:
            n=n-1
            pass

    slack_chat('listing table fill, len is : ' + str(n))
         
#make_com_table()
        


    
