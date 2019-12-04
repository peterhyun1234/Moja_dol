from bs4 import BeautifulSoup
import time
from selenium import webdriver
import re
import pandas as pd
from selenium.common.exceptions import UnexpectedAlertPresentException

from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.exc import IntegrityError

import datetime
from test_slack import slack_chat


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

pattern_get_id = re.compile(r"(?<=(bizId\=))[0-9]*")

youth_crawl_local = """ CREATE TABLE  youth_crawl_local(
                            id varchar(1000),
                            title varchar(100),
                            hash_tag varchar(20),
                            `contents` varchar(1000),
                            age varchar(2000),
                            school varchar(2000),
                            major varchar(2000),
                            job_status varchar(2000),
                            `specific` varchar(2000),
                            company varchar(1000),
                            apply_date varchar(1000),
                            `else` varchar(1000),
			    crawl_date timestamp NULL DEFAULT NULL,
			    policy_uri text,
                            PRIMARY KEY (id)
);"""

id_sql = "select id from youth_crawl_local"

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
    col_list = ['id','title','hash_tag','contents','age','school','major','job_status','specific','company','apply_date','else','policy_uri']
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
        
        idx = soup.select('a.link',target = '_black')
        
        link_p = ""
        for k in idx:
            if k == idx[0]:
                try:
                    link_p = k['href']
                except KeyError:
                    print("id : "+ str(i) + "KEY ERR")
                    break
            else:
                link_p = ','.join([link_p,k['href']])
        exp.append(link_p)

        info_table.loc[num_df]=exp
        num_df = num_df+1
    return info_table

def youth_local_crawl():
    driver = webdriver.Chrome(PATH,options=option_ch)
    
    conn=engine.connect()

    id_list = id_crawl(driver)
    id_list2 = del_up_dot(id_list)

    try:
        id_df = pd.read_sql(id_sql,con=conn)
        pre_list = list(id_df['id'])
        id_list2 = list(set(id_list2)-set(pre_list))
        print('len of id 2 ???')
        print(str(len(id_list2)))
    except Exception as e:
        print('pre id is npt exist?????')
        print(e)
        pass


    href_list = href_crawl(id_list2,driver)

    res_href_list = []
    for idx in href_list:
        res_href_list.append(pattern_amp.sub("",idx))

    

    df = chung_crawl(res_href_list,driver)
    driver.quit()    

    df['crawl_date'] = datetime.datetime.now()
    
    df['id'] = df['id'].apply(lambda x : pattern_get_id.search(x).group())

    try:
  
        conn.execute(youth_crawl_local)
    except SQLAlchemyError as e:
        print("exist")
        print(e)
        pass

    #slack_chat('youth local crawl len : '+str(len(df)))
    n = len(df)
    for i in range(len(df)):
        try:
            df.iloc[i:i+1].to_sql(name="youth_crawl_local",if_exists='append',con=conn,index=False)
        except IntegrityError:
            n = n -1
            pass
    slack_chat('youth local crawl len : '+str(n))

#youth_local_crawl()
