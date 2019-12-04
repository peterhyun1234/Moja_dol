import pandas as pd
import re
import numpy as np
import datetime
import calendar
from datetime import date
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.exc import IntegrityError

engine = create_engine("mysql+pymysql://viewer:"+"moja"+"@localhost/crawl_db?host=localhost?port=3306", encoding='utf-8')

pattern_age = re.compile(r"[0-9][0-9]세") 
pattern_age_num = re.compile(r"[0-9][0-9]") 
pattern_age_se = re.compile(r"[0-9][0-9]\s?(?=세)")
pattern_age_wave = re.compile(r"[0-9][0-9]\s?(?=~)")
pattern_age_more = re.compile(r"[0-9][0-9]\s?세?\s?이상")
pattern_age_less = re.compile(r"[0-9][0-9]\s?세?\s?이하")
pattern_age_less2 = re.compile(r"[0-9][0-9]\s?세?\s?미만")

pattern_ymd_dot = re.compile("\s?[0-9]{0,4}\s?\.?\s?[0-9]{1,2}\s?\.\s?[0-9]{1,2}")
pattern_ymd_dash = re.compile("\s?[0-9]{0,4}\s?-?\s?[0-9]{1,2}\s?-\s?[0-9]{1,2}")
pattern_ymd_korean = re.compile(r"\s?[0-9]{0,4}년?\s?[0-9]{1,2}\s?월\s?[0-9]{0,2}일?")
pattern_d_wave = re.compile(r'[~∼～]')
pattern_buter = re.compile(r"부터")
pattern_kkagi = re.compile(r"까지")
pattern_end_num = re.compile(r"[0-9]{1,2}\s?$")
pattern_hakgi = re.compile(r"[0-9]{1,2}\.[0-9]{1,2}학기")
pattern_ymd_korean_wild_card = re.compile(r"\s?[0-9]{0,4}\s?년?\s?[0-9]{0,2}\s?월?\s?[0-9]{0,2}일?") ##for speicfic case
pattern_d_korean = re.compile(r"^\s?[0-9]{1,2}일")
pattern_refine = re.compile(r"([0-9]\.[0-9])|([0-9]일)|([0-9]월)")
pattern_nums = re.compile(r"[0-9]+")
pattern_y = re.compile(r"[0-9]{0,4}(?=년)")
pattern_m = re.compile(r"[0-9]{0,2}(?=월)")
pattern_d = re.compile(r"[0-9]{0,2}(?=일)")
pattern_not_num = re.compile(r"[^0-9]")

jababa_preprocess_query = """ CREATE TABLE  youth_preprocess(
                            id varchar(100),
                            uri varchar(200),
                            title varchar(100),
                            hash_tag varchar(200),
                            contents varchar(1000),
                            school varchar(200),
                            job_status varchar(200),
                            major varchar(200),
                            `specific` varchar(200),
                            company varchar(200),
                            start_age int(11) DEFAULT NULL,
                            end_age   int(11) DEFAULT NULL,
                            start_date timestamp NULL DEFAULT NULL,
                            end_date   timestamp NULL DEFAULT NULL,
                            crawl_date timestamp NULL DEFAULT NULL,
                            policy_uri text,
			    dor varchar(50),
			    si varchar(50),
                            CONSTRAINT pk_youth_preprocess PRIMARY KEY(id)
);"""

jababa_crawl_get_query = """
    SELECT *
    FROM youth_crawl_origin
    WHERE id not in (SELECT id FROM youth_preprocess)
"""

jababa_crawl_get_query_1st = """
    SELECT *
    FROM youth_crawl_origin;
"""

jababa_crawl_id_query = """
    SELECT id
    FROM youth_crawl_origin
   
"""

jababa_preprocess_date = """
    CREATE TABLE  youth_preprocess_date(
    id varchar(100),
    start_date timestamp,
    end_date timestamp,
    INDEX ID_IDX(id)
"""



url_id_base = "https://www.youthcenter.go.kr/jynEmpSptNew/jynEmpSptGuide.do?bizId="
age_col = 'age'
date_col = 'apply_date'

def add_years(d,years):
    try:
        return d.replace(year = d.year + years)
    except ValueError:
        return d + (date(d.year + years,1,1) - date(d.year,1,1) )

def remove_dup_list(x):

    temp_set = set()
    res = []
    for idx in x:
        if idx not in temp_set:
            res.append(idx)
            temp_set.add(idx)
    return res

def list_minus_list(x,y):
    res = x.copy()
    for idx in y:
        if idx in x:
            res.remove(idx)
    return res

def age_parse(df):
    
    df_res = df.copy()
    
    x = df_res[age_col]
    
    df_res['start_age'] = None
    df_res['end_age'] =None
    
    more = []
    less = []
    wave = []
    se = []
    less2=[]
    
    temp = []
    start = []
    end = []
    
    if pattern_age_more.search(x):
        more.extend(pattern_age_more.findall(x))
    
    if pattern_age_less.search(x):
        less.extend(pattern_age_less.findall(x))
    
    if pattern_age_wave.search(x):
        wave.extend(pattern_age_wave.findall(x))
    
    if pattern_age_se.search(x):
        se.extend(pattern_age_se.findall(x))
    
    if pattern_age_less2.search(x):
        less2.extend(pattern_age_less2.findall(x))
    
    
    for i in se:
        temp.extend(pattern_age_num.findall(i))
    for i in wave:
        start.extend(pattern_age_num.findall(i))
    for i in less:
        end.extend(pattern_age_num.findall(i))
    for i in more:
        start.extend(pattern_age_num.findall(i))
    for i in less2:
        end.extend(pattern_age_num.findall(i))
    
    start = remove_dup_list(start)
    temp = remove_dup_list(temp)
    
    #temp = list(set(temp)-set(start))
    #temp = list(set(temp)-set(end))
     
    temp = list_minus_list(temp,start)
    temp = list_minus_list(temp,end)
   
    if len(temp)>1:
        start.append(temp[0])
        end.append(temp[1])

    elif len(temp)==1:
        if temp[0] not in start and temp[0] not in end:
            if len(start) == 0:
                start.append(temp[0])
            elif len(end) == 0:
                end.append(temp[0])
    
    if len(start)>0:
        df_res['start_age'] = start[0]
    
    if len(end)>0:
        df_res['end_age'] = end[0]
    
    return df_res

def find_date_type(string,flag=1):
    ## flag if 0 then not use wild card 
    
    x = pattern_hakgi.sub("",string)
    
    temp = []
    res = []
    
    if pattern_d_korean.search(x):
        res.extend(pattern_d_korean.findall(x))
    
    if pattern_ymd_dot.search(x):
        res.extend(pattern_ymd_dot.findall(x))
    elif pattern_ymd_dash.search(x):
        res.extend(pattern_ymd_dash.findall(x))
    elif pattern_ymd_korean.search(x):
        res.extend(pattern_ymd_korean.findall(x))
    elif pattern_ymd_korean_wild_card.search(x) and flag!=0:
        res.extend(pattern_ymd_korean_wild_card.findall(x))
        res=list(set(res))
        try:
            res.remove('')
        except Exception:
            pass
    
    if pattern_end_num.search(x):
        temp = pattern_end_num.findall(x)
    
        if pattern_end_num.search(res[-1]):
            temp2 = pattern_end_num.findall(res[-1])
            
            ## useless code?
            if temp[-1] == temp2[-1] or temp[-1] == temp2[-1]+" ":
                pass
            else:
                res.extend(temp)
                
            ## untill this
        else:
            res.extend(temp)
    
    return res
        
def preprocess_date(parsed_list):
    
    date_pair_list = []
    temp_pair_date = []
    
    if len(parsed_list)<2:
        date_pair_list = find_date_type(parsed_list[0],flag=0)
    else:
        for idx in parsed_list:
            temp_pair_date = find_date_type(idx)
            date_pair_list.append(temp_pair_date)
    
    return date_pair_list

def preprocess_date_refine(x):
    
    res_pair = []
    temp_pair = []
    
    if len(x) == 0 :
        return []
    elif type(x[0]) == list:
        n = 0
        for idx in x:
            if len(idx) == 2:
                if pattern_refine.search(idx[0]):
                    temp_pair.append(idx[0])
                    res_pair.append(temp_pair)
                    temp_pair = []
                    temp_pair.append(idx[1])
                else:
                    temp_pair.append('')
                    pass
            elif len(idx) == 1:
                temp_pair.append(idx[0])
            n = n+1
    elif type(x[0]) == str:
        for idx in x:
            res_pair.append([idx])
    
    if temp_pair!=[]:
        res_pair.append(temp_pair)
    
    return res_pair

def refine_string_to_date_time(x,flag,year=None,month=None,day=None):
    # x is string
    # flag 0 startdate 1 enddate
    
    y=year
    m=month
    d=day
    
    Now = datetime.datetime.now()
    
    split_list = []
    temp_list = []
    
    split_list = x.split(" ")
    for idx in split_list:
        temp_list.extend(idx.split("."))
    
    split_list = temp_list
    
    for idx in split_list:

        if idx =='':
            pass
        elif pattern_not_num.search(idx):
            if pattern_y.search(x):
                y = pattern_y.search(x).group()
            if pattern_m.search(x):
                m = pattern_m.search(x).group()
            if pattern_d.search(x):
                d = pattern_d.search(x).group()
        else:
            temp = int(idx)
            if temp == 0:
                pass
            elif temp > 12 and y == None:
                y = temp
            elif m==None and temp<13:
                m = temp
            elif m !=None and d==None:
                d=temp
    
    
    if y == None or y == '':
        y = Now.year
    else:
        if int(y) < 100:
            y = int(y) + 2000
    
    if m ==None or m =='':
        m=Now.month
    if d ==None or d =='':
        if flag ==0:
            d = 1
        elif flag ==1:
            d=calendar.monthrange(int(y),int(m))[1]
        
    return datetime.datetime(int(y),int(m),int(d))

def refine_to_datetime(df_in):
    df = df_in.copy()
    x=df['date_refine']
    n1 = 0
    n2 = 0
    res_list = []
    start_date = None
    end_date = None
    
    if len(x) == 0:
        res_list = [] 
    else:
        for idx in x:
            start_date = None
            end_date = None

            if len(idx)==2:
                n1 = len(pattern_nums.findall(idx[0]))
                n2 = len(pattern_nums.findall(idx[1]))
                
                if n1 == 0 and n2 == 0:
                    pass
                elif n1 == 0:
                    start_date =None
                    end_date = refine_string_to_date_time(idx[1],0)
                elif n2 ==0:
                    start_date = refine_string_to_date_time(idx[0],1)
                    end_date = None
                else:
                    if n1==n2:
                        start_date = refine_string_to_date_time(idx[0],0)
                        end_date = refine_string_to_date_time(idx[1],1)
                    elif n1>n2:
                        if n1==3:
                            start_date = refine_string_to_date_time(idx[0],0)
                            end_date = refine_string_to_date_time(idx[1],1,year = start_date.year)
                        elif n1==2:
                            
                            start_date = refine_string_to_date_time(idx[0],0)
                            end_date = start_date = refine_string_to_date_time(idx[1],1,month= start_date.month)

                    elif n2>n1:
                        if n2==3:
                            end_date  = refine_string_to_date_time(idx[1],1)
                            start_date = refine_string_to_date_time(idx[0],0,year = end_date.year)
                        elif n2 ==2:
                            end_date = refine_string_to_date_time(idx[1],1)
                            start_date = refine_string_to_date_time(idx[0],0,month = end_date.month)
            elif len(idx) == 1:
                if df['date_buter']==True:
                    start_date = refine_string_to_date_time(idx[0],0)
                elif df['date_ggagi']==True:
                    end_date  = refine_string_to_date_time(idx[0],1)
                else:
                    start_date = refine_string_to_date_time(idx[0],0)
                    end_date = refine_string_to_date_time(idx[0],1)
            elif len(idx) ==0:
                pass
            res_list.append([start_date,end_date])
            
                    
    df['res_date'] = res_list
    
    return df

def date_extract(source_df):
    df = pd.DataFrame(columns = ['id','start_date','end_date'])
    n = 0
    for idx,row in source_df.iterrows():
        if len(row['res_date'])>1:
            for idx in row['res_date']:
                df=df.append({'id':row['id'],'start_date':idx[0],'end_date':idx[1]},ignore_index=True)
            n = n + 1
    return df

def date_list_parse(df_in):
    ## df_in == row of df
    df = df_in.copy()
    df['start_date'] = None
    df['end_date'] = None
    
    if len(df['res_date'])==0:
        if df[date_col]=='상시':
            df['start_date'] = datetime.datetime(1980,1,1)
        else:
            pass
    else:
        df['start_date'] = df['res_date'][0][0]
        df['end_date'] = df['res_date'][0][1]
        
    return df

def preprocess_youth():
    
    conn = engine.connect()
    
    try:
        df = pd.read_sql(jababa_crawl_get_query, con=conn)
    except SQLAlchemyError:
        df = pd.read_sql(jababa_crawl_get_query_1st,con=conn)
        pass

    if len(df)==0:
        print("data already preprocessed")
        return

    df = df.apply(age_parse,axis=1)

    df['split_date'] = df[date_col].apply(lambda x: pattern_d_wave.split(x))

    df['date_pair'] = df['split_date'].apply(lambda x :preprocess_date(x) )

    df['date_refine'] = df['date_pair'].apply(lambda x:preprocess_date_refine(x))

    df['date_buter']=df[date_col].apply(lambda x: True if pattern_buter.search(x) else False)

    df['date_ggagi']=df[date_col].apply(lambda x: True if pattern_kkagi.search(x) else False)

    df['res_date'] = None

    df = df.apply(refine_to_datetime, axis = 1)

    df_date = date_extract(df)

    df = df.apply(date_list_parse,axis=1)
   
    df['uri'] = df['id'].apply(lambda x: url_id_base + str(x))

    df = df[['id','title','hash_tag','contents','school','major','job_status','specific','company','start_date','end_date','start_age','end_age','crawl_date','uri','policy_uri']]
    df['dor'] = '전국'
    df['si'] = '전체'
    
    for idx,row in df.iterrows():
        if row['start_date']!= None and row['end_date'] !=None:
            if row['start_date'] > row['end_date']:
                df.loc[idx,'end_date'] = add_years(row['end_date'],1)

    try:
        conn.execute(jababa_preprocess_query)
    
    except SQLAlchemyError as e:
        print('exist table')
        print(e)
        pass
    
    try:
        conn.execute(jababa_preprocess_date)
    except SQLAlchemyError:
        print('exist table')
        pass


    print("data row len: " ,str(len(df)))

    for i in range(len(df)):
        try:
            df.iloc[i:i+1].to_sql(name='youth_preprocess',if_exists='append',con=conn,index=False)
        except IntegrityError:
            pass
    
    print("date_part")
    for i in range(len(df)):
        try:
            df_date.iloc[i:i+1].to_sql(name='youth_preprocess_date',if_exists='append',con=conn,index=False)
        except IntegrityError:
            pass

#preprocess_local_youth()
