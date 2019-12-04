import datetime
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.exc import IntegrityError


engine = create_engine("mysql+pymysql://viewer:"+"moja"+"@localhost/crawl_db?host=localhost?port=3306", encoding='utf-8')

engine2 = create_engine("mysql+pymysql://viewer:"+"moja"+"@localhost/mojadol_DB00?host=localhost?port=3306", encoding='utf-8')


query_cat = """
select distinct(id)
from concat_date;
"""

def compare_date(x):
    res = datetime.timedelta(days=3000)
    res_date =None
    for idx in x:
        if datetime.timedelta(days=0) < idx-datetime.datetime.now():
            if idx-datetime.datetime.now() < res:
                res = idx-datetime.datetime.now()
                res_date = idx
                
    return res_date



def list_str_to_datetime(x):
    res_list = []
    for idx in x:
        if type(idx) == str:
            res_list.append(datetime.datetime.strptime(idx,'%Y-%m-%d %H:%M:%S'))
    return res_list



def change_date():
    
    conn = engine.connect()
    
    conn2 = engine2.connect()


    df_ids = pd.read_sql(query_cat,con=conn)

    ids_list=list(df_ids['id'])

    for idx in ids_list:
        df1 = pd.read_sql("select end_date,start_date from concat_date where id = "+str(idx),con=conn)
        df2 = pd.read_sql("select apply_end,apply_start from concat_table where p_code ="+str(idx),con=conn)

        date_list = list(df1['end_date'])
        date_list.extend(list(df2['apply_end']))
        
        date_list_d = list_str_to_datetime(date_list)

        res_date = compare_date(date_list_d)

        if res_date != None:
            print('in in id = ' + str(idx))
            start_date_idx = df1.loc[df1['end_date']==str(res_date)]['start_date']

            if list(start_date_idx)==[]:
                start_date_idx = df2.loc[df2['apply_end']==str(res_date)]['apply_start']
            df_index = start_date_idx.index[0] 
            conn2.execute("UPDATE policy SET apply_start = "+ start_date_idx[df_index] +" , apply_end = "+ str(res_date)+" where p_code = "+str(idx),con=conn)



#change_date()
