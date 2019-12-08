import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.exc import IntegrityError
import subprocess

engine = create_engine("mysql+pymysql://viewer:"+"moja"+"@localhost/mojadol_DB00?host=localhost?port=3306", encoding='utf-8')

def rec_all():
    conn = engine.connect()
    df_id = pd.read_sql('select distinct(uID) from stored_policy',con=conn)
    for uID in list(df_id['uID']):
        subprocess.call('python3.7 knn_base_rec.py '+str(uID),shell = True)

rec_all()
        
