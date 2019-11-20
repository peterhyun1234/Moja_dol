from bs4 import BeautifulSoup
import time
import os
import urllib.request
from urllib.error import URLError, HTTPError

from selenium import webdriver
import re
import pandas as pd

from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.exc import IntegrityError

import datetime

path = "/root/airflow/dags/chromedriver"
option_ch = webdriver.ChromeOptions()
option_ch.add_argument('--headless')
option_ch.add_argument('--no-sandbox')
option_ch.add_argument('--disable-dev-shm-usage')


engine = create_engine("mysql+pymysql://viewer:"+"moja"+"@localhost/crawl_db?host=localhost?port=3306", encoding='utf-8')



youth_crawl_origin = """ CREATE TABLE  youth_crawl_origin(
                            id varchar(100),
                            title varchar(100),
                            hash_tag varchar(20),
                            contents varchar(1000),
                            age varchar(200),
                            school varchar(200),
                            major varchar(200),
                            job_status varchar(200),
                            `specific` varchar(200),
                            company varchar(100),
                            apply_date varchar(1000),
                            `else` varchar(1000),
			    crawl_date timestamp NULL DEFAULT NULL,
			    policy_uri text,
                            PRIMARY KEY (id)
);"""

youth_id = """
	SELECT id
	FROM youth_crawl_origin;
"""

regex_digit = re.compile("\'\d+\'")
regex_digit2 = re.compile("\d+")
pattern = re.compile(r'[^\t\n]+')

url1='https://www.youthcenter.go.kr/jynEmpSptNew/jynEmpSptList.do?pageIndex=1&currentPage='
url2='&sortField=exprRnkn&setZzimBusiId=&bizId=&plcySel=&chargerOrgCdSel=&sortField2=exprRnkn&higdBlowAccrYnSel=&hiscEnrlYnSel=&hiscGrdnPrerYnSel=&higdAccrYnSel=&univEnrlYnSel=&univGrdnAccrYnSel=&drAccrYnSel=&majrSglSersYnSel=&majrSocySersYnSel=&majrBsflSersYnSel=&majrNtssSersYnSel=&majrEngrSersYnSel=&majrEnspSersYnSel=&splzRlmSmpzEmpmYnSel=&splzRlmFmleYnSel=&splzRlmLigYnSel=&splzRlmDspnYnSel=&splzRlmSdrYnSel=&splzRlmFrmlYnSel=&empnHffcYnSel=&empyBsmgYnSel=&empmUnpnYnSel=&scroll=1&btnSearchTxt=&srchAge=&higdBlowAccrYn=on&hiscEnrlYn=on&hiscGrdnPrerYn=on&higdAccrYn=on&univEnrlYn=on&univGrdnAccrYn=on&drAccrYn=on&majrSglSersYn=on&majrSocySersYn=on&majrBsflSersYn=on&majrNtssSersYn=on&majrEngrSersYn=on&majrEnspSersYn=on&splzRlmSmpzEmpmYn=on&splzRlmFmleYn=on&splzRlmLigYn=on&splzRlmDspnYn=on&splzRlmSdrYn=on&splzRlmFrmlYn=on&empnHffcYn=on&empyBsmgYn=on&empmUnpnYn=on'


url_id_base = "https://www.youthcenter.go.kr/jynEmpSptNew/jynEmpSptGuide.do?bizId="

def id_crawl(driver):
    
    res_list=[]
    page_num=1
    while(1):
        driver.get(url1 + str(page_num)+url2)
        html = driver.page_source
        soup = BeautifulSoup(html, "html.parser")
        res_ids = regex_digit.findall(str(soup.select('#jynEmpSptList1')))
        
        if len(res_ids)==0:
            break
            
        res_list.extend(res_ids)
        page_num = page_num + 1
        
    return res_list

def del_up_dot(ids_list):
    res = []
    for i in ids_list:
        x=regex_digit2.findall(i)
        res.extend(x)
        
    return res

def chung_crawl(ids_list,driver):
    num_df = 0
    col_list = ['id','title','hash_tag','contents','age','school','major','job_status','specific','company','apply_date','else','policy_uri']
    index_list = ['연령','학력','전공','취업상태','특화분야','기업','신청기간','기타내용']
    info_table=pd.DataFrame(columns=col_list)
    for i in ids_list:
        driver.get(url_id_base+str(i))
        html = driver.page_source
        soup = BeautifulSoup(html, "html.parser")
    
        sample_list=[]
        exp=[]
        exp.append(i)
        idx=soup.select('h3.doc_tit02')[0].text
        string1 = pattern.findall(str(idx))
        exp.append(string1[0])
        if len(string1)>=3:
            exp.append(string1[2])
        else:
            exp.append('-')
    
    
        idx=soup.select('h4.bullet-arrow1')[0].text
        string2=pattern.findall(str(idx))
        if len(string2)!=0:
            exp.append(string2[0])
        else:
            exp.append('-')
  
    
        idx=soup.select('ul.common_table02')[0].text
        string=pattern.findall(str(idx))

        remove_space = list(filter(lambda x: x!=' ', string))
    
        for kda in index_list:
            num=remove_space.index(kda)
            exp.append(remove_space[num+1])
        
        idx = soup.select('a.link',target = '_black')
        
        link_p = ""
        for k in idx:
            if k == idx[0]:
                try:
                    link_p = k['href']
                except KeyError:
                    print("id : "+ str(i) + "KEY ERR")
                    break;
            else:
                link_p = ','.join([link_p,k['href']])
        exp.append(link_p)
        info_table.loc[num_df]=exp
        num_df = num_df+1
    return info_table


def youth_crawl_db_in():

    driver = webdriver.Chrome(path,chrome_options=option_ch)
    conn = engine.connect()

    id_list = id_crawl(driver)
    id_list2 = del_up_dot(id_list)
    
    print(str(len(id_list2)))
    
    try:
        
        id_df = pd.read_sql(youth_id,con=conn)
        pre_id_list = list(id_df['id'])
        id_list2 = list(set(id_list2)-set(pre_id_list))
        print(str(len(id_list2)))
    except SQLAlchemyError:
        print('id err')
        pass
    
    df = chung_crawl(id_list2,driver)
    df['crawl_date'] = datetime.datetime.now()

    driver.quit()     

    try:
  
        conn.execute(youth_crawl_origin)
    except SQLAlchemyError as e:
        print("exist")
        print(e)
        pass
    
    for i in range(len(df)):
        try:
            df.iloc[i:i+1].to_sql(name="youth_crawl_origin",if_exists='append',con=conn,index = False)
        except IntegrityError:
            pass
            


