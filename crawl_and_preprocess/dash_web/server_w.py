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

engine = create_engine("mysql+pymysql://viewer:"+"moja"+"@localhost/crawl_db?host=localhost?port=3306", encoding='utf-8')
#conn = engine.connect()
#conn_raw = engine.raw_connection()


app.css.append_css({
    'external_url': 'https://codepen.io/chriddyp/pen/bWLwgP.css'
})

merge_table = "combine_table"

app.layout=html.Div([
    html.Br(),
    
    dcc.Dropdown(
        id='table_dropdown' ,
        options=[
            {'label':'jababa + youth', 'value': 2},
            {'label': 'jababa', 'value': 1},
            {'label': 'gov + youth','value':3},
            #{'label': 'youth', 'value': ['youth_preprocess','youth_preprocess']}
        ],
        value= 1 ),

    html.Div(id = 'listing_table'),
    html.Br(),
    html.Button('SAME',id='same',n_clicks_timestamp=0),

    html.Button('NOT SAME',id='not_same',n_clicks_timestamp=0),
    html.Button('UNKNOWN',id='unknown',n_clicks_timestamp=0),
    html.Br(),
    html.Button('BACK',id='back',n_clicks_timestamp=0),
    html.Div(id='check_list_save'),
    html.Div(id = 'listing_table_df',style = {'display':'none'}),
    html.Div(id = 'listing_table_df2',style = {'display':'none'}),
    html.Div(id = 'merge_data',children=None),
    html.Div(id = 'page_num', children = 0),

])

def execute_by_cursor(query):
    conn = engine.connect()

#   conn_raw = engine.raw_connection()
#    cur = conn_raw.cursor()
#    cur.execute(query)
#    cur.commit() 
    conn.execute(query)
    print(query)
    conn.close()


@app.callback(
    Output('page_num','children'),
    [
        Input('same','n_clicks_timestamp'),
        Input('not_same','n_clicks_timestamp'),
        Input('unknown','n_clicks_timestamp'),
        Input('back','n_clicks_timestamp')
    ],
    [State('page_num','children'),
     State('merge_data','children'),
     State('table_dropdown','value')    
    ]
)
def page_num_count(ck1,ck2,ck3,ck4,page,data,drop):
    
    db_listing = -1
    page_num = page
    
    if drop == 1:
        table1 = "jababa_preprocess"
        table2 = "jababa_preprocess"
    elif drop ==2:
        table1 = "youth_preprocess"
        table2 = "jababa_preprocess"    
    elif drop ==3:
        table1 = "youth_preprocess"
        table2 = "gov_preprocess"


    max_val = max(ck1,ck2,ck3,ck4)
    #print(max_val)
    if max_val == 0:
        pass
    else:
        if max_val == ck4:
            if page == 0:
                pass
            else:
                page_num  = page_num -1
                back_listing = ('UPDATE '+merge_table
                +' SET listing = 0 '
                +'WHERE listing != 0 and table1 = "' + table1 +'" and table2 = "' + table2 +'" '
                +'ORDER BY id1 asc,id2 asc '
                +'LIMIT 1;'
                )
                print('back???')
                execute_by_cursor(back_listing)

        else:
            page_num  = page_num + 1
            if max_val == ck1:
                db_listing = 1  
            elif max_val == ck2:
                db_listing = 2  
            elif max_val == ck3:
                db_listing = 3

    if db_listing != -1 and data != None and max_val != ck4:
        df = pd.read_json(data, orient='split')
        update_listing =( 'update '+ merge_table + ' set listing = ' +str(db_listing) +
        ' where table1 = "' +str(df.iloc[0]['table1']) + 
        '" and id1 = "' + str(df.iloc[0]['id1']) + 
        '" and table2 = "' + str(df.iloc[0]['table2']) + 
        '" and id2 = "' + str(df.iloc[0]['id2']) +'";') 
        
        print(update_listing)
        execute_by_cursor(update_listing)
        print('excuted')

    return page_num
    
    
@app.callback(
    Output('merge_data','children'),
    [Input('page_num','children'),
     Input('table_dropdown','value')    
    ]
)
def get_merge_data(page_num,drop):
    print('merge')
    
    if drop == 1:
        table1 = "jababa_preprocess"
        table2 = "jababa_preprocess"
    elif drop ==2:
        table1 = "youth_preprocess"
        table2 = "jababa_preprocess"    
    elif drop ==3:
        table1 = "youth_preprocess"
        table2 = "gov_preprocess"

       

    get_merge_info = "select * from "+merge_table+" where listing = 0 and table1 ='"+ table1 +"' and table2 = '"+ table2 + "' order by id1 desc,id2 desc limit 1;"
    #conn_raw = engine.raw_connection()
     
    conn = engine.connect()

    merge_df = pd.read_sql(get_merge_info, con = conn)
    
    conn.close()
    #conn_row.close()
    print(merge_df)
    #print(type(merge_df.to_json(date_format='iso', orient='split')))

    return merge_df.to_json(date_format='iso', orient='split')


@app.callback(
    Output('listing_table_df','children'),
    [
        Input('merge_data','children'),
    ]
)
def get_df(data):
    
    try:
        df = pd.read_json(data, orient='split')
    except Exception as e:
        print(e)
        return None

    get_row = 'select * from '+str(df.iloc[0]['table1']) +' where id = '+str(df.iloc[0]['id1'])+' ;'
    conn = engine.connect()

    res = pd.read_sql(get_row, con = conn)
    
    conn.close()
    
    return res.to_json(date_format='iso', orient='split')


@app.callback(
    Output('listing_table_df2','children'),
    [Input('merge_data','children')]
)
def get_df2(data):

    try:
        df = pd.read_json(data, orient='split')
    except Exception as e:
        print(e)
        return None


    get_row = 'select * from '+str(df.iloc[0]['table2']) +' where id = '+str(df.iloc[0]['id2'])+' ;'
    conn = engine.connect()
    
    res = pd.read_sql(get_row, con = conn)
    
    conn.close()
    return res.to_json(date_format='iso', orient='split')


@app.callback(
    Output('listing_table','children'),
    [
        Input('listing_table_df','children'),
        Input('listing_table_df2','children')
    ]
)
def show_table(df1_in,df2_in):

    df1 = pd.read_json(df1_in, orient='split')
    df2 = pd.read_json(df2_in, orient='split')



    return html.Div([
        dt.DataTable(
            id='table',columns=[{"name": i, "id": i} for i in df1.columns],
            data=df1.to_dict('records'),
        ),
        html.Br(),
        dt.DataTable(
            id='table',
            columns=[{"name": i, "id": i} for i in df2.columns],
            data=df2.to_dict('records'),
        )   
        ])


if __name__ == '__main__':
    app.run_server(debug=True,port=7777,host='0.0.0.0')
