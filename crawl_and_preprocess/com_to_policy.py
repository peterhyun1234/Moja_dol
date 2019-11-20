import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.exc import IntegrityError

engine = create_engine("mysql+pymysql://viewer:"+"moja"+"@localhost/crawl_db?host=localhost?port=3306", encoding='utf-8')
engine2 = create_engine("mysql+pymysql://viewer:"+"moja"+"@localhost/mojadol_DB00?host=localhost?port=3306", encoding='utf-8')

policy_quer = """CREATE TABLE policy(
p_code int,
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

interest_qur = """
CREATE TABLE interest(
p_code int ,
Employment_sup tinyint(1),
Startup_sup tinyint(1), 
Life_welfare tinyint(1),
Residential_finance tinyint(1),
PRIMARY KEY(p_code)
)"""



def com_to_pol():
    conn = engine.connect()
    conn2 = engine2.connect()

    com = pd.read_sql("select * from concat_table",con=conn)
    com['expiration_flag'] = 0
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
