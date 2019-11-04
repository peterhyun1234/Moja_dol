import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
import sys
import datetime

def airflow_test():

    table_query = """CREATE TABLE airflow_test (
        test timestamp,
         
    );"""

    engine = create_engine("mysql+pymysql://HB_JEON:"+"page159!"+"@localhost/mojadol_DB00?host=localhost?port=3306", encoding='utf-8')
    try:
        conn = engine.connect()
        conn.execute(table_query)
    except SQLAlchemyError:
        print("err")
        pass    
    df = pd.DataFrame(columns=['test'])
    df=df.append({'test':datetime.datetime.now()},ignore_index=True)
    df.to_sql("airflow_test",con=conn,if_exists='append', index=False)
