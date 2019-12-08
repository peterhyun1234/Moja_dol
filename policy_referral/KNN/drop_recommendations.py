import pandas as pd
from sqlalchemy import create_engine

engine = create_engine("mysql+pymysql://root:"+"page159!"+"@localhost/mojadol_DB00?host=localhost?port=3306", encoding='utf-8')

conn=engine.connect()

def drop_referral():

    SQL = "DROP table knn_recommendation"

    df = pd.read_sql(SQL, con=conn)
    print(df)
    print("table drop 완료")
    
drop_referral()
