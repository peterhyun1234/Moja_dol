import pandas as pd
import dash
import dash_core_components as dcc
import dash_html_components as html
import dash_table as dt
from dash.dependencies import Input,Output,State
from sqlalchemy import create_engine
import sqlalchemy
import time
import json

app = dash.Dash(__name__)

app.config.suppress_callback_exceptions = True


engine = create_engine("mysql+pymysql://viewer:"+"moja"+"@localhost/mojadol_DB00?host=localhost?port=3306", encoding='utf-8')
app.css.append_css({
    'external_url': 'https://codepen.io/chriddyp/pen/bWLwgP.css'
})

def execute_by_cursor(query):
    conn = engine.connect()

#   conn_raw = engine.raw_connection()
#    cur = conn_raw.cursor()
#    cur.execute(query)
#    cur.commit() 
    conn.execute(query)
    conn.close()


app.layout=html.Div([
    html.Br(),
    html.Button('get_uID',id='get_uID',n_clicks_timestamp=0),
    dcc.Dropdown(id='table_dropdown'),

    html.Div(id = 'mylist_table'),
    html.Br(),

    html.Div(id='rec_table')
])

@app.callback(
    Output('table_dropdown','options'),
    [
        Input('get_uID','n_clicks_timestamp')
    ]
)
def get_uIDs(value):
    conn = engine.connect()
    query = """select distinct(uID) from knn_recommendation;"""

    df = pd.read_sql(query,con=conn)

    conn.close()

    option_list = []

    for idx,row in df.iterrows():
        temp_dict = {}
        temp_dict['label'] = row['uID']
        temp_dict['value'] = row['uID']
        option_list.append(temp_dict)

    return option_list

@app.callback(
    Output('rec_table','children'),
    [
        Input('table_dropdown','value')
    ]
)
def get_rec_table(value):
    
    query1 = "select * from policy where p_code = (select p_code1 from knn_recommendation where uID ='" + str(value) +"')"
    query2 = "select * from policy where p_code = (select p_code2 from knn_recommendation where uID ='"+str(value) +"')"
    query3 = "select * from policy where p_code = (select p_code3 from knn_recommendation where uID ='"+str(value)+ "')"
    query4 = "select * from policy where p_code = (select p_code4 from knn_recommendation where uID ='"+str(value)+ "')"
    query5 = "select * from policy where p_code = (select p_code5 from knn_recommendation where uID ='"+str(value)+"')"

    conn = engine.connect()

    df = pd.read_sql(query1,con=conn)
    df = df.append(pd.read_sql(query2,con=conn),ignore_index=True)
    df = df.append(pd.read_sql(query3,con=conn),ignore_index=True)
    df = df.append(pd.read_sql(query4,con=conn),ignore_index=True)
    df = df.append(pd.read_sql(query5,con=conn),ignore_index=True)
    conn.close()

    
    return html.Div([
        dt.DataTable(
            id='table',columns=[{"name": i, "id": i} for i in df.columns],
            data=df.to_dict('records'),
        )
    ])



@app.callback(
    Output('mylist_table','children'),
    [
        Input('table_dropdown','value')
    ]
)
def get_mylist(value):
    
    query = "select * from policy where p_code in (select s_p_code from stored_policy where uID ='"+str(value) +"')"

    conn = engine.connect()

    df = pd.read_sql(query,con=conn)

    conn.close()

    
    return html.Div([
        dt.DataTable(
            id='table',columns=[{"name": i, "id": i} for i in df.columns],
            data=df.to_dict('records'),
        )
    ])





if __name__ == '__main__':
    app.run_server(debug=True,port=7700,host='0.0.0.0')
