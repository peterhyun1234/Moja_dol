# mojadol
청년정책 추천 서비스 - 나만의 청년 정책
------------------------------------

## 1. Android application
    Check SdkVersion 16
    Check Internet network service environment
    
    Run -> Run app
---------------------------------------- 
## 2. Web page
![web](https://user-images.githubusercontent.com/46476398/68107383-0a69ee80-ff28-11e9-9e6a-879444c84eb8.png)
---------------------------------------- 
## 3. Crawling with airflow

    airflow adress : http://49.236.136.213:8080
    
    중복제거
    Overlap coefficient 사용 
    https://wikimedia.org/api/rest_v1/media/math/render/svg/e131b74ad4940a763904822eed7b74a843d27ba0
----------------------------------------    
## 4. API Server (Node + express, MySQL, firebase)
### 4.1. Node + express
#### 4.1.1. install node and npm (in ubuntu)
    $ sudo apt-get update 
    $ sudo apt-get install nodejs
    $ sudo apt-get install npm
    $ npm init --yes
    $ npm install express mysql --save --save-exact
> https://poiemaweb.com/nodejs-mysql
#### 4.1.2. Start node server with exit state(background)    
    $ nohup npm start &
    $ exit
#### 4.1.3. Start node server with auto_modifying state(Daemon process)
    $ nohup nodemon </dev/null &
    $ exit
### 4.2. DBMS

#### 4.2.1. MySQL for policy and 

exmaple query: SQL with added ability to sort by search goodness   
```java
SELECT keywords,
  (
    ((LENGTH(keywords) - LENGTH((REPLACE(keywords, '이효리', '')))) / LENGTH('이효리'))
    + ((LENGTH(keywords) - LENGTH((REPLACE(keywords, '한예슬', '')))) / LENGTH('한예슬'))
    + ((LENGTH(keywords) - LENGTH((REPLACE(keywords, '전지현', '')))) / LENGTH('전지현'))
  ) AS score
FROM sentence
WHERE keywords LIKE '%이효리%'
  OR keywords LIKE '%한예슬%'
  OR keywords LIKE '%전지현%'
ORDER BY score DESC
```
> 중복된 단어를 제외한 단어 적합도(카운트)에 따라 정렬하는 쿼리  <br>

#### 4.2.2. firebase for authentication 

    - 사용자에 대한 정보를 전달해서 서버의 역할을 줄임(인증)
    - 실시간으로 인증

----------------------------------------   
