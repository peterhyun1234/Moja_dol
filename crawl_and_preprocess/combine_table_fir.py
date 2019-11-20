# -*- coding: UTF-8 -*-
import pandas as pd
import re
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError,IntegrityError

engine = create_engine("mysql+pymysql://viewer:"+"moja"+"@localhost/crawl_db?host=localhost?port=3306", encoding='utf-8')
conn = engine.connect()

merge_table = "select * from combine_table"

com_table = """CREATE TABLE concat_table(
p_code int NOT NULL AUTO_INCREMENT,
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
application_target varchar(1000),
dor varchar(50),
si varchar(50),
crawling_date timestamp NULL DEFAULT NULL,
expiration_flag tinyint(1),
category varchar(100),
PRIMARY KEY(p_code),
INDEX `id1_idx` (id1),
INDEX `id2_idx` (id2),
INDEX `id3_idx` (id3)
)""" 



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


def com_data():
    df_m = pd.read_sql(merge_table,con=conn)
    id2_list=list(df_m['id2'].unique())
    df_j = pd.read_sql("select * from jababa_preprocess",con=conn)
    df_y = pd.read_sql("select * from youth_preprocess",con=conn)

    df_y['target'] = None
    for idx,row in df_y.iterrows():
        df_y.loc[idx,'target'] = " 전공 : " + str(row['major'])+"\n직업 : "+ str(row['job_status']) + "\n학교 : " +  str(row['school'])

    df_j['category']=df_j.category.apply(lambda x: category_match_jababa(x))
    df_y['category']=df_y.hash_tag.apply(lambda x: category_match_youth(x))

    df_jr = df_j[['id','title','uri','apply_start','apply_end','start_age','end_age','use','target','dor','si','crawl_date','category']]
    df_yr = df_y[['id','title','uri','start_date','end_date','start_age','end_age','contents','target','dor','si','crawl_date','category']]#location 

    df_yr = df_yr.rename(columns={'id':'id1','start_date':'apply_start','end_date':'apply_end','target':'application_target','crawl_date':'crawling_date'})
    df_jr = df_jr.rename(columns={'id':'id2','use':'contents','target':'application_target','crawl_date':'crawling_date'})
    
    df_jr = df_jr.loc[~df_jr.id2.isin(id2_list)]
    res_df = pd.concat([df_jr,df_yr],sort=False)

    try:
        conn.execute(com_table)
    except SQLAlchemyError as e:
        print(e)
        pass
    
    
    for i in range(len(res_df)):
        try:
            res_df.iloc[i:i+1].to_sql(name = "concat_table",if_exists='append',con=conn,index=False)
        except IntegrityError:
            pass
#com_data()
