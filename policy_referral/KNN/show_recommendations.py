import sys
import pandas as pd
from sqlalchemy import create_engine

                                  
uID = sys.argv[1]

engine = create_engine("mysql+pymysql://root:"+"page159!"+"@localhost/mojadol_DB00?host=localhost?port=3306", encoding='utf-8')

conn=engine.connect()

def show_referral(recv_uID):

    SQL = "SELECT title FROM policy, stored_policy WHERE (p_code = s_p_code) AND uID = '" + recv_uID + "'"
   
    print("---- < " + recv_uID + "가 저장한 정책들 > ----")
    df = pd.read_sql(SQL, con=conn)
    print(df)

    print()
    
    print("---- < " + recv_uID + "에게 추천된 정책들 > ----")
    SQL = "SELECT title FROM policy, knn_recommendation WHERE (p_code = p_code1) AND uID = '" + recv_uID + "'"
    df = pd.read_sql(SQL, con=conn)
    print(df)
    SQL = "SELECT title FROM policy, knn_recommendation WHERE (p_code = p_code2) AND uID = '" + recv_uID + "'"
    df = pd.read_sql(SQL, con=conn)
    print(df)
    SQL = "SELECT title FROM policy, knn_recommendation WHERE (p_code = p_code3) AND uID = '" + recv_uID + "'"
    df = pd.read_sql(SQL, con=conn)
    print(df)
    SQL = "SELECT title FROM policy, knn_recommendation WHERE (p_code = p_code4) AND uID = '" + recv_uID + "'"
    df = pd.read_sql(SQL, con=conn)
    print(df)
    SQL = "SELECT title FROM policy, knn_recommendation WHERE (p_code = p_code5) AND uID = '" + recv_uID + "'"
    df = pd.read_sql(SQL, con=conn)
    print(df)
    
show_referral(uID)
