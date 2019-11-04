from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.exc import IntegrityError

import pandas as pd
import re
import numpy as np
import datetime

engine = create_engine("mysql+pymysql://viewer:"+"moja"+"@localhost/mojadol_DB00?host=localhost?port=3306", encoding='utf-8')

origin_table_policy = """
    SELECT *
    FROM jababa_crawl_origin
    WHERE id not in (SELECT id FROM jababa_preprocess);
"""

##          contents varchar(10000) DEFAULT NULL, 

jababa_preprocess_query = """ CREATE TABLE  jababa_preprocess(
                            id varchar(100); 
                            title varchar(100),
                            uri varchar(200),
                            apply_start timestamp NULL DEFAULT NULL,
                            apply_end   timestamp NuLL DEFAULT NULL,
                            start_age int(11) DEFAULT NULL,
                            end_age   int(11) DEFAULT NULL,
                            target varchar(1000),
                            use varchar(200),
                            category varchar(200),
                            location varchar(42),
                            crawl_date timestamp,
                            CONSTRAINT youth_origin_pk PRIMARY KEY (id)

);"""





pattern_date = re.compile("[0-9]{2,4}-[0-9]{2}-[0-9]{2}")
pattern_nums = re.compile("[0-9]+")
pattern_age = re.compile(r"[0-9][0-9]세") 
pattern_age_num = re.compile(r"[0-9][0-9]") 

pattern_age_se = re.compile(r"[0-9][0-9]\s?(?=세)")
pattern_age_wave = re.compile(r"[0-9][0-9]\s?(?=~)")
pattern_age_more = re.compile(r"[0-9][0-9]\s?세?\s?이상")
pattern_age_less = re.compile(r"[0-9][0-9]\s?세?\s?이하")

pattern_in_brace = re.compile(r'(?<=\[).*(?=\])')

id_url = "https://www.jobaba.net/sprtPlcy/info/view.do?seq="

date_col = 'sch'
age_col = 'target'
location_col = 'title'

def remove_dup_list(x):
    temp_set = set()
    res =[]
    for idx in x:
        if idx not in temp_set:
            res.append(idx)
            temp_set.add(idx)
    return res

def parse_wave(x):
    df_res = x.copy()
               
    df_res['apply_end'] = None
    df_res['apply_start'] = None

    split_res = str(df_res[date_col]).split("~")
        
    if len(split_res) > 0:
        df_res['apply_start'] = split_res[0]
    else:
        print(df_res[date_col])
    
    if len(split_res) > 1:
        df_res['apply_end'] = split_res[1]
    
    return df_res

def parse_date(x):
    if x in ['상시'] or x== None:
        return None
    elif pattern_date.search(x):
        nums = pattern_nums.findall(x)
        if len(nums) > 3:
            res = datetime.datetime(int(nums[0]),int(nums[1]),int(nums[2]),hour=int(nums[3]))
        else:
            res = datetime.datetime(int(nums[0]),int(nums[1]),int(nums[2]))
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
    
    
    for i in se:
        temp.extend(pattern_age_num.findall(i))
    for i in wave:
        start.extend(pattern_age_num.findall(i))
    for i in less:
        end.extend(pattern_age_num.findall(i))
    for i in more:
        start.extend(pattern_age_num.findall(i))
    
    ##start = list(set(start))
    ##temp = list(set(temp))
    start = remove_dup_list(start)
    temp = remove_dup_list(temp)    

    if len(temp)>1:
        start.append(temp[0])
        end.append(temp[1])
    
    if len(start)>0:
        df_res['start_age'] = start[0]
    
    if len(end)>0:
        df_res['end_age'] = end[0]
    
    return df_res


def jababa_preprocess():

    conn = engine.connect()

    df = pd.read_sql(origin_table_policy,con=conn)
   
    if len(df)==0:
        print("data already preprocessed")
        return ;

    df = df.apply(parse_wave,axis=1)

    df['apply_start_date'] = df['apply_start'].apply(lambda x : parse_date(x))

    df['apply_end_date'] = df['apply_end'].apply(lambda x : parse_date(x))

    df = df.apply(age_parse,axis=1)

    df['location'] = df[location_col].apply(lambda x : pattern_in_brace.search(x).group() if pattern_in_brace.search(x) else False)

    df = df.drop(columns=['apply_start','apply_end','index'])
    df = df.rename(columns = {'apply_start_date':'apply_start','apply_end_date':'apply_end'})
    df['uri'] = df['id'].apply(lambda x: id_url+str(x))

    try:
        conn.execute(jababa_preprocess_query)
    
    except SQLAlchemyError:
        print("exist table")
        pass

    print("data row len: "+ str(len(df)))

    for i in range(len(df)):
        try:
            df.iloc[i:i+1].to_sql(name="jababa_preprocess",if_exists='append',con=conn,index=False)
        except IntegrityError:
            pass



