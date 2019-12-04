from bs4 import BeautifulSoup
import time

from selenium import webdriver
import re
import pandas as pd
import numpy as np
import datetime

from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.exc import IntegrityError

from test_slack import slack_chat 

PATH = "/root/airflow/dags/chromedriver"
option_ch = webdriver.ChromeOptions()
option_ch.add_argument('--headless')
option_ch.add_argument('--no-sandbox')
option_ch.add_argument('--disable-dev-shm-usage')

engine = create_engine("mysql+pymysql://viewer:"+"moja"+"@localhost/crawl_db?host=localhost?port=3306", encoding='utf-8')

url_1='https://www.gov.kr/portal/recomendThemaSvc?srchRecomendSvcAstCd=03030000&srchRecomendSvcAstCd2=03030'
url_href1="https://www.gov.kr"
pattern = re.compile(r'[^\s]+')

pattern_uri = re.compile(r"(?<=(Mcode\=)).*")

url_2_list=['100','200','300','400']
category_list = ['Employment_sup','Employment_sup','startup_sup','Life_welfare']

gov_crawl_origin = """ CREATE TABLE  gov_table(
                            id varchar(100),
                            title varchar(100),
                            uri text,
                            category varchar(50),
                            contents text,
                            target text,
                            `use` varchar(200),
                            crawl_date timestamp NULL DEFAULT NULL,
                            PRIMARY KEY (id)
);
"""

id_sql = "select id from gov_table "

def crawl_24_href(driver):
    href_list=[]
    for idx in url_2_list:
        temp_list = []
        driver.get(url_1 + idx)
        html = driver.page_source
        soup = BeautifulSoup(html, "html.parser")
        selected = soup.findAll("span",{"class":'lc-tit'})
        for kda in selected:
            for diy in kda.find_all('a',href=True):
                temp_list.append(diy['href'])
        href_list.append(temp_list)
                
    return href_list

def crawl_24_text(driver,href_list):
    crawl_dict_list=[]
    n=0
    for wyz in href_list:
        for idx in wyz:
            crawl_dict={}
            crawl_col=[]

            driver.get(url_href1 + idx)
            html = driver.page_source
            soup = BeautifulSoup(html, "html.parser")

            crawl_dict['title']=soup.find('div',{'id':'pageCont'}).find('h1').text

            selected = soup.findAll("ul",{"class":'cont-box-lst'})

            for kda in selected:
                for diy in kda.find_all('p',{'class':'tt'}):
                    crawl_col.append(diy.text)

            iii=0
            for kda in selected:
                for diy in kda.find_all('div',{'class':'tx'}):

                    string=pattern.findall(str(diy.text))
                    res = " ".join(string)

                    crawl_dict[crawl_col[iii]] = res

                    iii = iii + 1
            
            crawl_dict['category'] = category_list[n]
            
            crawl_dict['uri'] = url_href1 + idx
            
            crawl_dict_list.append(crawl_dict)
        n=n+1
    
    return crawl_dict_list

use_list = ['문의처'] # ['구비서류','문의처','절차/방법','접수기관','중복불가서비스']
target_list = ['선정기준','지원대상']
content_list = ['지원내용']

def make_col(df):
    
    use = ''
    target = ''
    content = ''
    
    for idx in use_list:
        if df[idx] =='':
            pass
        else:
            use = use + idx +' : ' + df[idx] + '\n'
    
    for idx in target_list:
        if df[idx] =='':
            pass
        else:
            target = target + idx +' : ' + df[idx] + '\n'

    for idx in content_list:
        if df[idx] =='':
            pass
        else:
            content = content + idx +' : ' + df[idx] + '\n'

    
        
    df['use'] = use
    df['target'] = target
    df['contents'] = content
    
    return df

def gov_crawling():
    driver = webdriver.Chrome(PATH,options=option_ch)

    h_list = crawl_24_href(driver)
    
    
    crawl_res = crawl_24_text(driver,h_list)
    df = pd.DataFrame(crawl_res)
    df = df[df['title']!="민원안내 및 신청"]

    driver.quit()


    df = df.fillna(value='')
    
    df = df.apply(lambda x : make_col(x),axis=1)
    df['id'] = df['uri'].apply(lambda x : pattern_uri.search(x).group())
    df['crawl_date'] = datetime.datetime.now()
    
    df = df[['id','title','uri','category','use','target','contents','crawl_date']]
    
    conn = engine.connect()

    try:
        df_id = pd.read_sql(id_sql,con=conn)
        df_id_len = len(df_id['id'])
        slack_chat('gov table : '+ str(len(df) - len(df_id_len)))   
    except Exception as e:
        print('id err')
        pass
    



    try:
        conn.execute(gov_crawl_origin)
    except SQLAlchemyError as e:
        print("exist table")
        print(e)
        pass


    print("data row len: "+ str(len(df)))
   
    #slack_chat('gov table : '+ str(len(df)))    
    n= len(df)
    for i in range(len(df)):
        try:

            df.iloc[i:i+1].to_sql(name="gov_table",if_exists='append',con=conn,index=False)
        except IntegrityError:
            n=n-1
            pass
    slack_chat('gov table : '+str(n))



#gov_crawling()
