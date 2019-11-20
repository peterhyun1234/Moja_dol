from airflow import DAG
from airflow.operators.dummy_operator import DummyOperator
from airflow.operators.python_operator import PythonOperator
from datetime import datetime
from youth_crawl import youth_crawl_db_in
from youth_preprocess import preprocess_youth

dag = DAG('youth_crawl', description='youth_crawl',
          schedule_interval='0 0 * * *',
          start_date=datetime(2019,10,1), catchup=False)

##dummy_operator = DummyOperator(task_id='dummy_task', retries=3, dag=dag)

youth_crawl_operator = PythonOperator(task_id='youth_crawl', python_callable=youth_crawl_db_in, dag=dag)

uth_crawl_oper = PythonOperator(task_id = 'youth_preprocess',python_callable=preprocess_youth,dag =dag)

youth_crawl_operator >> uth_crawl_oper
