from airflow import DAG
from airflow.operators.dummy_operator import DummyOperator
from airflow.operators.python_operator import PythonOperator
from datetime import datetime
from jababa_crawl import jababa_crawling
from jababa_preprocess import jababa_preprocess

PATH ="./chromedriver"

dag = DAG('jababa_crawl', description='jababa crawling',
          schedule_interval='0 0 * * *',
          start_date=datetime(2019, 10, 1), catchup=False)

##dummy_operator = DummyOperator(task_id='dummy_task', retries=3, dag=dag)


jababa_crawl_operator = PythonOperator(task_id='jababa_crawl', python_callable=jababa_crawling, dag=dag)

jababa_preprocess_operator = PythonOperator(task_id = 'jababa_preprocess',python_callable=jababa_preprocess,dag=dag)

jababa_crawl_operator >> jababa_preprocess_operator
