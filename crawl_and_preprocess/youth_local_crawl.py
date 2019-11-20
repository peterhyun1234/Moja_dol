from bs4 import BeautifulSoup
import time
from selenium import webdriver
import re
import pandas as pd
from selenium.common.exceptions import UnexpectedAlertPresentException

from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.exc import IntegrityError

engine = create_engine("mysql+pymysql://viewer:"+"moja"+"@localhost/crawl_db?host=localhost?port=3306", encoding='utf-8')


PATH = "/root/airflow/dags/chromedriver"
option_ch = webdriver.ChromeOptions()
option_ch.add_argument('--headless')
option_ch.add_argument('--no-sandbox')
option_ch.add_argument('--disable-dev-shm-usage')

url1='https://www.youthcenter.go.kr/jynEmpSptNew/jynEmpSptList.do?pageIndex='
url_id_base = "https://www.youthcenter.go.kr/jynEmpSptNew/jynEmpSptGuide.do?bizId="

regex_digit = re.compile("\'\d+\'")
regex_digit2 = re.compile("\d+")
pattern_href = re.compile(r'(?<=href\=\").*(?=\"\>)')
pattern_amp = re.compile("amp\;")
pattern = re.compile(r'[^\t\n]+')

def id_crawl(driver):
    
    res_list=[]
    page_num=1
    while(1):
        driver.get(url1 + str(page_num))
        html = driver.page_source
        soup = BeautifulSoup(html, "html.parser")
        res_ids = regex_digit.findall(str(soup.select('#jynEmpSptList2')))
        
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

def href_crawl(id_list,driver):
    
    res_list=[]
    for idx in id_list:
        driver.get(url_id_base + str(idx))
        html = driver.page_source
        soup = BeautifulSoup(html, "html.parser")
        res_list.extend(pattern_href.findall(str(soup.select('.tbl_step > tbody'))))
    return res_list

def chung_crawl(uri_list,driver):
    num_df = 0
    col_list = ['id','title','hash tag','설명','연령','학력','전공','취업상태','특화분야','기업','신청기간','기타내용']
    index_list = ['연령','학력','전공','취업상태','특화분야','기업','신청기간','기타내용']
    info_table=pd.DataFrame(columns=col_list)
    for i in uri_list:
        try:
            driver.get(i)
        except Exception as e:
            print("driver get err :")
            print(e)
            print(i)
            continue
        
        try:
            html = driver.page_source
            soup = BeautifulSoup(html, "html.parser")
        except UnexpectedAlertPresentException:
            print("alter exception")
            print(i)
            continue
        except Exception as e:
            print("html or soup err:")
            print(e)
            print(i)
            continue
    
        sample_list=[]
        exp=[]
        exp.append(i)
        try:
            idx=soup.select('h3.doc_tit02')[0].text
        except Exception as e:
            print("no attribute h3.doc_tit02")
            print(e)
            print(i)
            continue
            
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
            try:
                exp.append(remove_space[num+1])
            except Exception as e:
                print(i)
                print(str(remove_space))
                exp.append(None)
                pass
    

        info_table.loc[num_df]=exp
        num_df = num_df+1
    return info_table

def youth_local_crawl():
    driver = webdriver.Chrome(PATH,options=option_ch)
    
    conn=engine.connect()

    id_list = id_crawl(driver)
    id_list2 = del_up_dot(id_list)
    href_list = href_crawl(id_list2,driver)

    res_href_list = []
    for idx in href_list:
        res_href_list.append(pattern_amp.sub("",idx))

    

    df = chung_crawl(res_href_list,driver)
    for i in range(len(df)):
        try:
            df.iloc[i:i+1].to_sql(name="youth_crawl_local",if_exists='append',con=conn,index=False)
        except IntegrityError:
            pass

youth_local_crawl()
