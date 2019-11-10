# mojadol
청년정책 추천 서비스 - 나만의 청년 정책
-------------------------------------
## 1. Start node server
    node server adress : http://49.236.136.213:3000
### 1.1. install node and npm     (in ubuntu)
    sudo apt-get update 
    sudo apt-get install nodejs
    sudo apt-get install npm    
### 1.2. Start node server with exit state(background)    
    nohup npm start &
    exit
### 1.3. Start node server with auto_modifying state
    nodemon index.js
    superviser index.js
### 1.4. Start node server with auto_modifying state(Daemon process)
    nohup nodemon </dev/null &
----------------------------------------   


## 2. Android application
    Check SdkVersion 16
    Check Internet network service environment
    
    Run -> Run app

## 3. Web page
![web](https://user-images.githubusercontent.com/46476398/68107383-0a69ee80-ff28-11e9-9e6a-879444c84eb8.png)

## 4. Crawling with airflow

    airflow adress : http://49.236.136.213:8080
    
    중복제거
    Overlap coefficient 사용 
    https://wikimedia.org/api/rest_v1/media/math/render/svg/e131b74ad4940a763904822eed7b74a843d27ba0
   
