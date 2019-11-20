import pandas as pd
import datetime
from sqlalchemy import create_engine


engine = create_engine("mysql+pymysql://viewer:"+"moja"+"@localhost/mojadol_DB00?host=localhost?port=3306", encoding='utf-8')


def check_exp():

    conn = engine.connect()

    df = pd.read_sql("select p_code,apply_end from policy",con=conn)

    conn.close()

    #f = "%Y-%m-%d %H:%M:%S"

    df['apply_end_date'] = pd.to_datetime(df['apply_end'], errors='coerce')

    df['check']=df['apply_end_date'].apply(lambda x : False if x==pd._libs.tslibs.nattype.NaTType else (datetime.datetime.now() > x))

    
    conn = engine.connect()


    for idx,row in df.loc[df.check==True].iterrows():
        try:
            conn.execute("update policy set expiration_flag = 1 where p_code = "+str(row['p_code']))
        except Exception as e:
            print(e)
            pass
    
    conn.close()

check_exp()
