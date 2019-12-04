import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.exc import IntegrityError
import datetime

engine = create_engine("mysql+pymysql://viewer:"+"moja"+"@localhost/crawl_db?host=localhost?port=3306", encoding='utf-8')
engine2 = create_engine("mysql+pymysql://viewer:"+"moja"+"@localhost/mojadol_DB00?host=localhost?port=3306", encoding='utf-8')

policy_quer = """CREATE TABLE policy(
p_code bigint,
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
PRIMARY KEY(p_code)
)""" 

merge_table_query = """
select id2 from combine_table
group by id2 having avg(listing)!=2 or stddev(listing)!=0
"""

interest_qur = """
CREATE TABLE interest(
p_code bigint ,
Employment_sup tinyint(1),
Startup_sup tinyint(1), 
Life_welfare tinyint(1),
Residential_finance tinyint(1),
PRIMARY KEY(p_code)
)"""


def flag_check(df):
    print(df['apply_start'])
    if df['apply_start'] == datetime.datetime(1980,1,1):
        print('1980')
        df['expiration_flag'] =2
        df['apply_start'] = None
        df['apply_end'] = None
    elif df['apply_temp'] == pd._libs.tslibs.nattype.NaTType:
        pass
    elif datetime.datetime.now() > df['apply_temp'] :
        df['expiration_flag'] = 1
    
    return df

def com_to_pol():
    conn = engine.connect()
    conn2 = engine2.connect()

    com = pd.read_sql("select * from concat_table",con=conn)

    df_id2 = pd.read_sql(merge_table_query,con=conn)
    id2_list = list(df_id2['id2'].unique())
    com = com.loc[~com.p_code.isin(id2_list)]

    com['expiration_flag'] = 0
    com['apply_temp'] = pd.to_datetime(com['apply_end'],errors='coerce')
    com = com.apply(lambda x : flag_check(x),axis=1)

    res_com = com[['p_code','title','uri','apply_start','apply_end','start_age','end_age','contents','application_target','crawling_date','expiration_flag','si','dor']]
        

    res_com = res_com.loc[res_com['title']!='err']
    res_com = res_com.loc[res_com['title']!='dummy']  
    

    df_interest = pd.DataFrame(columns=['p_code','Employment_sup','Startup_sup','Life_welfare','Residential_finance'])
    df_interest['Employment_sup']=0
    df_interest['Startup_sup'] = 0
    df_interest['Life_welfare'] = 0
    df_interest['Residential_finance']=0

    for i,row in com.iterrows():
        temp_row = [0,0,0,0]
        if row['category'] == 'Employment_sup':
            temp_row[0] = 1
        if row['category'] == 'startup_sup':
            temp_row[1] = 1
        if row['category'] == 'Life_welfare':
            temp_row[2] = 1
        if row['category'] == 'Residential_finance':
            temp_row[3] = 1
        df_interest = df_interest.append({'p_code':row['p_code'],'Employment_sup':temp_row[0],'Startup_sup':temp_row[1],'Life_welfare':temp_row[2],'Residential_finance':temp_row[2]},ignore_index=True)
    
  

    try:
        conn2.execute(policy_quer)
    except SQLAlchemyError as e:
        print(e)
        pass

    try:
        conn2.execute(interest_qur)
    except SQLAlchemyError as e:
        print(e)
        pass


    for idx in range(len(res_com)):
        try:
            res_com.iloc[idx:idx+1].to_sql(name = "policy",if_exists='append',con=conn2,index=False)
        except IntegrityError:
            pass
    
    for idx in range(len(df_interest)):
        try:
            df_interest.iloc[idx:idx+1].to_sql(name = "interest",if_exists='append',con=conn2,index=False)
        except IntegrityError:
            pass


#com_to_pol()
