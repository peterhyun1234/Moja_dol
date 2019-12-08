# -*- coding: UTF-8 -*-
import pandas as pd
import re
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError,IntegrityError
import re


engine = create_engine("mysql+pymysql://viewer:"+"moja"+"@localhost/crawl_db?host=localhost?port=3306", encoding='utf-8')
conn = engine.connect()

pattern_not_num = re.compile(r'[^0-9]')

merge_table = "select * from combine_table"

com_table = """CREATE TABLE concat_table(
p_code bigint NOT NULL,
id1 varchar(50),
id2 varchar(50),
id3 varchar(50),
title varchar(200),
uri varchar(150),
apply_start timestamp NULL DEFAULT NULL,
apply_end timestamp NULL DEFAULT NULL,
start_age int,
end_age int,
contents varchar(10000),
application_target text,
dor varchar(50),
si varchar(50),
crawling_date timestamp NULL DEFAULT NULL,
expiration_flag tinyint(1),
category varchar(100),
PRIMARY KEY(p_code),
UNIQUE INDEX `id1_idx` (id1),
UNIQUE INDEX `id2_idx` (id2),
UNIQUE INDEX `id3_idx` (id3)
)""" 

com_table_date = """
CREATE TABLE concat_date(
`table` varchar(100),
id varchar(100),
start_date timestamp NULL DEFAULT NULL,
end_date timestamp NULL DEFAULT NULL,
PRIMARY KEY(`table`,id) 
)
""" 

youth_date = """
select *
from  youth_preprocess_date
"""

gov_table_query = """
select * 
from gov_preprocess
"""
#where id not in 
#(
#select id2
#from combine_table
#where table2 = 'gov_preprocess'
#)
#"""

location_diction = {'경기':['경기도'],'전북':['전라북도'],'강원':['강원도'],'충남':['충청남도'],'경북':['경상북도'],'전남':['전라남도'],'서울':['서울특별시'],'경남':['경상남도'],'충북':['충청북도','층청북도']}


def category_match_youth(x):
    if x in ['교육훈련·체험·인턴','전문분야 취업지원', '해외진출','중소기업 취업지원']:
        return "Employment_sup"
    if x in ['R&D 지원','경영 지원', '자본금 지원']:
        return "startup_sup"
    if x in ['건강','문화']:
        return "Life_welfare"
    if x in ['생활비 지원 및 금융 혜택 ','주거 지원','학자금 지원']:
        return "Residential_finance"

def category_match_jababa(x):
    if x == "ReEmployment" or x=="Employment":
        return "Employment_sup"
    if x == "Residential":
        return "Residential_finance"
    if x=="Life":
        return "Life_welfare"
    if x=="Company":
        return "startup_sup"

id_lists = ['id1','id2','id3']
def make_p_code(df):
   
    for idx in id_lists:
        if type(df[idx]) == str:
            if pattern_not_num.search(df[idx]): 
                pass
            else:
                return int(df[idx])
        else:
            pass

def make_short_location(x):

    for idx in location_diction.keys():
        if x in location_diction[idx]:
            return idx

    return x


def com_data():
    df_m = pd.read_sql(merge_table,con=conn)
    id2_list=list(df_m['id2'].unique())
    df_j = pd.read_sql("select * from jababa_preprocess",con=conn)
    df_y = pd.read_sql("select * from youth_preprocess",con=conn)
    df_g = pd.read_sql(gov_table_query,con=conn)
    

#    df_g['apply_start'] = None
#    df_g['apply_end'] = None
    
        
 
    df_y['target'] = None
    for idx,row in df_y.iterrows():
        df_y.loc[idx,'target'] = " 전공 : " + str(row['major'])+"\n직업 : "+ str(row['job_status']) + "\n학교 : " +  str(row['school'])

    df_j['category']=df_j.category.apply(lambda x: category_match_jababa(x))
    df_y['category']=df_y.hash_tag.apply(lambda x: category_match_youth(x))

    df_jr = df_j[['id','title','uri','apply_start','apply_end','start_age','end_age','target','dor','si','crawl_date','category',"use"]] #use 
    df_yr = df_y[['id','title','uri','start_date','end_date','start_age','end_age','contents','target','dor','si','crawl_date','category']]#location 
    df_g = df_g.drop(columns=['use'])    

    df_yr = df_yr.rename(columns={'id':'id1','start_date':'apply_start','end_date':'apply_end','target':'application_target','crawl_date':'crawling_date'})
    df_jr = df_jr.rename(columns={'id':'id2','use':'contents','target':'application_target','crawl_date':'crawling_date'})
    df_g = df_g.rename(columns={'id':'id3','target':'application_target','crawl_date':'crawling_date'})    

    all_df_list = [df_jr,df_yr,df_g]
    for idx in all_df_list:
        idx['apply_start'] = pd.to_datetime(idx['apply_start'])
        idx['apply_end'] = pd.to_datetime(idx['apply_end'])

    print(df_g.columns)    

    print(len(df_g))
    #df_jr = df_jr.loc[~df_jr.id2.isin(id2_list)]
   
    res_df = pd.concat([df_jr,df_yr],sort=False)
    
    print(len(res_df))
    res_df = pd.concat([res_df,df_g],sort=False)    
    print(len(res_df))    

    res_df['p_code'] = res_df.apply(lambda x : make_p_code(x),axis=1)
    
    res_df['dor'] = res_df['dor'].apply(lambda x: make_short_location(x))   
   
    res_df['si'] = res_df['si'].apply(lambda x : '전체' if x=='본청' else x)  
    
    print(len(res_df))
    #res_df = res_df.reset_index(drop=True,inplace=True)   
    print(len(res_df))
    #res_df['apply_start'] = pd.to_datetime(res_df['apply_start'])
    #res_df['apply_end'] = pd.to_datetime(res_df['apply_end'])
  
    try:
        conn.execute(com_table)
    except SQLAlchemyError as e:
        print(e)
        pass

    try:
        conn.execute(com_table_date)
    except SQLAlchemyError as e:
        print(e)
        pass
    
    df_y_date = pd.read_sql(youth_date,con=conn)
    df_y_date['table'] = 'youth'    

    for i in range(len(res_df)):
        try:
            res_df.iloc[i:i+1].to_sql(name = "concat_table",if_exists='append',con=conn,index=False)
        except IntegrityError:
            pass

    for i in range(len(df_y_date)):
        try:
            df_y_date.iloc[i:i+1].to_sql(name = "concat_date",if_exists='append',con=conn,index=False)
        except IntegrityError:
            pass





#com_data()
