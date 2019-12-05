import pandas as pd

from sqlalchemy import create_engine

engine = create_engine("mysql+pymysql://root:page159!@localhost/mojadol_DB00?host=localhost?port=3306", encoding='utf-8')

conn = engine.connect()

df_policy = pd.read_sql("SELECT * FROM policy",con=conn)
df_user = pd.read_sql("SELECT * FROM user",con=conn)
df_click = pd.read_sql("SELECT * FROM click",con=conn)
df_interest = pd.read_sql("SELECT * FROM interest",con=conn)
df_stored_policy = pd.read_sql("SELECT * FROM stored_policy",con=conn)
df_click_priority = pd.read_sql("SELECT * FROM click_priority",con=conn)
df_mylist_priority = pd.read_sql("SELECT * FROM mylist_priority",con=conn)

df_policy.to_csv("policy.csv",encoding="utf-8-sig",index=False) 
df_user.to_csv("user.csv",encoding="utf-8-sig",index=False) 
df_click.to_csv("click.csv",encoding="utf-8-sig",index=False) 
df_interest.to_csv("interest.csv",encoding="utf-8-sig",index=False) 
df_stored_policy.to_csv("stored_policy.csv",encoding="utf-8-sig",index=False) 
df_click_priority.to_csv("click_priority.csv",encoding="utf-8-sig",index=False) 
df_mylist_priority.to_csv("mylist_priority.csv",encoding="utf-8-sig",index=False) 
