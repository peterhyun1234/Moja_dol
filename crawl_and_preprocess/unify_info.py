import pandas as pd
import datetime
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.exc import IntegrityError

engine = create_engine("mysql+pymysql://viewer:"+"moja"+"@localhost/crawl_db?host=localhost?port=3306", encoding='utf-8')


dup_table_query ="""
CREATE TABLE duplicated_date_table(
id1 varchar(100),
id2 varchar(100),
PRIMARY KEY(id1,id2)
)
"""

get_not_dup = """
select id2 
from combine_table 
group by id2 having avg(listing)!=2 or stddev(listing)!=0;
"""

get_dup ="""
select id1,id2,table2
from combine_table
where listing =1
"""

def dup_unify(id1,id2,conn):
    
    df1 = pd.read_sql("select * from concat_table where p_code ="+str(id1),con=conn)
    df2 = pd.read_sql("select * from concat_table where p_code ="+str(id2),con=conn)
    
    compare_dict = {}

    if df2['start_age'][0] != None:
        
        if df1['start_age'][0]==None:
            compare_dict['start_age']=df2['start_age'][0]
        elif df2['start_age'][0]<df1['start_age'][0]:
            compare_dict['start_age']=df2['start_age'][0]
    
    if df2['end_age'][0] != None:
        
        if df1['end_age'][0]==None:
            compare_dict['end_age']=df2['end_age'][0]
        elif df2['end_age'][0]>df1['end_age'][0]:
            compare_dict['end_age']=df2['end_age'][0]

    if df2['apply_start'][0]!= None or df2['apply_end'][0]!=None:
        print(df2['apply_start'][0])
        print(df1['p_code'][0]) 
        try: 
            conn.execute("Insert into concat_date (id,`table`,start_date,end_date) values ("+str(df1['p_code'][0])+","+"'unifyed', STR_TO_DATE('"+str(df2['apply_start'][0])+"','%%Y-%%m-%%d %%H:%%i:%%s'),STR_TO_DATE('"+str(df2['apply_end'][0]) +"','%%Y-%%m-%%d %%H:%%i:%%s'))")
        except Exception as e:
            print('???')
            print(e)        
            pass
    
    if list(compare_dict.keys()) == []:
        pass
    else:
        input_list = []
        for idx,kda in zip(compare_dict.keys(),compare_dict.values()):
            input_list.append(str(idx) + " = "+ str(kda))

        conn.execute("UPDATE mojadol_DB00.policy SET " + ",".join(input_list) +" where p_code = " + str(df1['p_code'][0]))


def unify_row():
    conn =  engine.connect()
    
    df_not_dup = pd.read_sql(get_not_dup,con=conn)
    df_dup = pd.read_sql(get_dup,con=conn)

    
    not_dup_list = list(df_not_dup['id2'])
    dup_list_id2 = list(df_dup['id2'])
    dup_list_id1 = list(df_dup['id1'])

    
    #df_nd_com = pd.read_sql("select * from concat_table where p_code in ("+",".join(not_dup_list)+")",con=conn)

    for idx,kda in zip(dup_list_id1,dup_list_id2):
        dup_unify(idx,kda,conn)

    
#unify_row()
