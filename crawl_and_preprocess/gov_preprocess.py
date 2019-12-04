import pandas as pd

from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.exc import IntegrityError

import re

pattern_age = re.compile(r"[0-9][0-9]세") 
pattern_age_num = re.compile(r"[0-9][0-9]") 
pattern_age_se = re.compile(r"[0-9][0-9]\s?(?=세)")
pattern_age_wave = re.compile(r"[0-9][0-9]\s?(?=~)")
pattern_age_more = re.compile(r"[0-9][0-9]\s?세?\s?이상")
pattern_age_less = re.compile(r"[0-9][0-9]\s?세?\s?이하")
pattern_age_less2 = re.compile(r"[0-9][0-9]\s?세?\s?미만")

age_col = 'target'

engine = create_engine("mysql+pymysql://viewer:"+"moja"+"@localhost/crawl_db?host=localhost?port=3306", encoding='utf-8')


gov_preprocess_table = """ CREATE TABLE  gov_preprocess(
                            id varchar(100),
                            title varchar(100),
                            uri text,
                            start_age int(11) DEFAULT NULL,
                            end_age   int(11) DEFAULT NULL,
                            category varchar(50),
                            contents text,
                            target text,
                            `use` varchar(200),
                            dor varchar(42),
                            si varchar(42),
                            apply_start timestamp NULL DEFAULT NULL,
                            apply_end timestamp NULL DEFAULT NULL,
                            crawl_date timestamp NULL DEFAULT NULL,
                            PRIMARY KEY (id)
);
"""

origin_table_policy = """
    SELECT *
    FROM gov_table
    WHERE id not in (SELECT id FROM gov_preprocess);
"""

origin_table_policy_sec = """
   SELECT *
   from gov_table
"""


def list_minus_list(x,y):
    res = x.copy()
    for idx in y:
        if idx in res:
            res.remove(idx)
    return res


def remove_dup_list(x):

    temp_set = set()
    res = []
    for idx in x:
        if idx not in temp_set:
            res.append(idx)
            temp_set.add(idx)
    return res

def age_parse(df):
    
    df_res = df.copy()
    
    x = df_res[age_col]
    
    df_res['start_age'] = None
    df_res['end_age'] =None
    
    more = []
    less = []
    wave = []
    se = []
    less2=[]
    
    temp = []
    start = []
    end = []
    
    if pattern_age_more.search(x):
        more.extend(pattern_age_more.findall(x))
    
    if pattern_age_less.search(x):
        less.extend(pattern_age_less.findall(x))
    
    if pattern_age_wave.search(x):
        wave.extend(pattern_age_wave.findall(x))
    
    if pattern_age_se.search(x):
        se.extend(pattern_age_se.findall(x))
    
    if pattern_age_less2.search(x):
        less2.extend(pattern_age_less2.findall(x))
    
    
    for i in se:
        temp.extend(pattern_age_num.findall(i))
    for i in wave:
        start.extend(pattern_age_num.findall(i))
    for i in less:
        end.extend(pattern_age_num.findall(i))
    for i in more:
        start.extend(pattern_age_num.findall(i))
    for i in less2:
        end.extend(pattern_age_num.findall(i))
    
    start = remove_dup_list(start)
    temp = remove_dup_list(temp)
    
    #temp = list(set(temp)-set(start))
    #temp = list(set(temp)-set(end))
    
    temp = list_minus_list(temp,start)
    temp = list_minus_list(temp,end)
    
    
    if len(temp)>1:
        start.append(temp[0])
        end.append(temp[1])

    elif len(temp)==1:
        if temp[0] not in start and temp[0] not in end:
            if len(start) == 0:
                start.append(temp[0])
            elif len(end) == 0:
                end.append(temp[0])
    
    if len(start)>0:
        df_res['start_age'] = start[0]
    
    if len(end)>0:
        df_res['end_age'] = end[0]
#     if df_res['start_age']!=None or df_res['end_age']!=None:
#         print(df_res[age_col])
#         print('temp')
#         print(temp)
#         print('start')
#         print(start)
#         print('end')
#         print(end)

#         print(df_res['start_age'])
#         print( df_res['end_age'])
    return df_res

def gov_preprocess_d():
    conn = engine.connect()


    try:
        df = pd.read_sql(origin_table_policy,con=conn)
    except SQLAlchemyError:
        print("preprocess table loss")
        df = pd.read_sql(origin_table_policy_sec,con=conn)
        pass


    if len(df)==0:
        print("data already preprocessed")
        return 


    
    df = df.apply(age_parse,axis=1)

    df['dor'] = '전국'
    df['si'] = '전체'
    df['apply_start'] = None
    df['apply_end'] = None

    try:
        conn.execute(gov_preprocess_table)
        print("table make")
    except SQLAlchemyError as e:
        print(e)
        print("exist table")
        pass


    for i in range(len(df)):
        try:
            df.iloc[i:i+1].to_sql(name="gov_preprocess",if_exists='append',con=conn,index=False)
        except IntegrityError:
            pass

#gov_preprocess_d()
