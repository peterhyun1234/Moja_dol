import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.exc import IntegrityError

engine = create_engine("mysql+pymysql://viewer:"+"moja"+"@localhost/crawl_db?host=localhost?port=3306", encoding='utf-8')

engine2 = create_engine("mysql+pymysql://viewer:"+"moja"+"@localhost/mojadol_DB00?host=localhost?port=3306", encoding='utf-8')


origin_table = ['gov_table','jababa_crawl_origin','youth_crawl_local','youth_crawl_origin']

origin_table_create = """

CREATE TABLE origin_policy(
    p_code varchar(1000),
    Ucontents text,
    PRIMARY KEY(p_code)
)

"""

def to_origin():
    conn = engine.connect()
    conn2 = engine2.connect()
    
    try:
        conn2.execute(origin_table_create)
    except SQLAlchemyError as e:
        print('exist table')
        print(e)
        pass

    for idx in origin_table:
        res_df = pd.DataFrame(columns=['p_code','Ucontents'])
        df = pd.read_sql('select * from ' + idx,con=conn)
        
        temp_list = list(df.columns)
        temp_list.remove('id')
        
        for inx,row in df.iterrows():
            temp_dict = {}
            temp_dict['p_code'] = row['id']
            temp_str =""
            
            for idx in temp_list:
               try:
                   temp_str = temp_str + str(idx) + " == " + str(row[idx]) + "\n"
               except Exception as e:
                   print(e)
                   pass
            #print(type(temp_str))
            temp_dict['Ucontents'] = temp_str
            
            res_df = res_df.append(temp_dict,ignore_index=True)
            
        print(len(res_df))
        print(res_df.columns)
        for i in range(len(res_df)):
            try:
                res_df.iloc[i:i+1].to_sql(name='origin_policy',if_exists='append',con=conn2,index=False)
            except IntegrityError:
                pass


#to_origin()            
