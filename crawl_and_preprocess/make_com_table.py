#-*-coding: utf-8-*-
import pandas as pd
import re
from konlpy.tag import Okt
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError,IntegrityError

engine = create_engine("mysql+pymysql://viewer:"+"moja"+"@localhost/crawl_db?host=localhost?port=3306", encoding='utf-8')
conn = engine.connect()

jababa_pre_table = "select * from jababa_preprocess"
youth_pre_table = "select * from youth_preprocess"

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

def make_com_table():
    df_j=pd.read_sql(jababa_pre_table,con=conn)
    df_y=pd.read_sql(youth_pre_table,con=conn)

    df_j2 = df_j.loc[df_j['dor']=='전국']
    df_j2 = df_j2.loc[(df_j2['title']!='err')]

    df_y['title_refine'] =  df_y['title'].apply(lambda x : remove_brace(x))
    df_j2['title_refine'] = df_j2['title'].apply(lambda x : remove_brace(x))

    okt = Okt()

    df_y['token'] = df_y['title'].apply(lambda x: set(okt.morphs(x)))

    df_j2['token'] = df_j2['title'].apply(lambda x : set(okt.morphs(x)))

    df_j2['p_test']=df_j2['policy_uri'].apply(lambda x : pattern_uri_head.search(str(x)).group() if pattern_uri_head.search(str(x)) else False)


    df_y['p_test']=df_y['policy_uri'].apply(lambda x : str(x).split(","))

    df_y['p_test2'] = df_y['p_test'].apply(lambda x: parse_uri_list(x))

    df_integrate = pd.DataFrame(columns=['table1','id1','table2','id2','listing'])
    
    
    for idx,yrow in df_y.iterrows():
        flag = 0
        for kda,jrow in df_j2.iterrows():
            if Overlap_coefficient(yrow['token'],jrow['token']) > 0.5:
                df_integrate = df_integrate.append({'table1':'youth_preprocess','id1':yrow['id'],'table2':'jababa_preprocess','id2':jrow['id']},ignore_index = True)
    df_integrate['listing']= 0    
     
    try:
        conn.execute(table_integrate)
    except SQLAlchemyError as e:
        print('table??')
        print(e)
        pass

    for i in range(len(df_integrate)):
        try:
            df_integrate.iloc[i:i+1].to_sql(name="combine_table",if_exists='append',con=conn,index=False)
        except IntegrityError:
            pass
         
#make_com_table()
        


    
