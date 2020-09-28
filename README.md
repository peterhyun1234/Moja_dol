# mojadol
청년정책 추천 서비스 - 나만의 청년 정책
------------------------------------
## 1. SW development process
### 1.1. Product backlog (일부)
![백로그](https://user-images.githubusercontent.com/46476398/94428346-88338a00-01cb-11eb-9999-ec4376e0e28f.png)

### 1.2. Sequence Diagram
![시퀀스다이어그램](https://user-images.githubusercontent.com/46476398/94428338-85389980-01cb-11eb-9ad8-458608668cc8.png)

### 1.3. Burn Down Chart
![번다운차트](https://user-images.githubusercontent.com/46476398/94428349-88338a00-01cb-11eb-9c8e-6a67af4c00b3.png)
    
    각 Iteration은 2주, scrum은 매일 진행함


## 2. Android application
![앱2](https://user-images.githubusercontent.com/46476398/94428616-ed877b00-01cb-11eb-956b-fe57304790ae.png)

![앱](https://user-images.githubusercontent.com/46476398/94428343-87025d00-01cb-11eb-8e8b-365ad882e9f3.png)

    Check SdkVersion 16
    Check Internet network service environment
    
    Run -> Run app
---------------------------------------- 
## 3. Web page
![web](https://user-images.githubusercontent.com/46476398/68107383-0a69ee80-ff28-11e9-9e6a-879444c84eb8.png)
---------------------------------------- 
## 4. Crawling with airflow

    airflow adress : http://49.236.136.213:8080
    
    중복제거
    Overlap coefficient 사용 
    https://wikimedia.org/api/rest_v1/media/math/render/svg/e131b74ad4940a763904822eed7b74a843d27ba0
----------------------------------------    
## 5. API Server (Node + express, MySQL, firebase)
### 5.1. Node + express
#### 5.1.1. install node and npm (in ubuntu)
    $ sudo apt-get update 
    $ sudo apt-get install nodejs
    $ sudo apt-get install npm
    $ npm init --yes
    $ npm install express mysql --save --save-exact
> https://poiemaweb.com/nodejs-mysql
#### 5.1.2. Start node server with exit state(background)    
    $ nohup npm start &
    $ exit
#### 5.1.3. Start node server with auto_modifying state(Daemon process)
    $ nohup nodemon </dev/null &
    $ exit
### 5.2. DBMS

#### 5.2.1. MySQL ER Diagram
![ER다이어그램](https://user-images.githubusercontent.com/46476398/94428345-879af380-01cb-11eb-8fdb-12eeb3f17eb8.png)


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

#### 5.2.2. firebase for authentication 

    - 사용자에 대한 정보를 전달해서 서버의 역할을 줄임(인증)
    - 실시간으로 인증

----------------------------------------   
## 6. contact
    e-mail: peterhyun1234@gmail.com
