from airflow import DAG
from airflow.operators.dummy_operator import DummyOperator
from airflow.operators.python_operator import PythonOperator
from datetime import datetime

from jababa_crawl import jababa_crawling
from jababa_preprocess import jababa_preprocess

from youth_crawl import youth_crawl_db_in
from youth_preprocess import preprocess_youth

from make_com_table import make_com_table
from combine_table_fir import com_data
from com_to_policy import com_to_pol

dag = DAG('integrate_dag', description='integrate',
          schedule_interval='0 0 * * *',
          start_date=datetime(2019, 11, 1), catchup=False)


jababa_crawl_operator = PythonOperator(task_id='jababa_crawl', python_callable=jababa_crawling, dag=dag)

jababa_preprocess_operator = PythonOperator(task_id = 'jababa_preprocess',python_callable=jababa_preprocess,dag=dag)

youth_crawl_operator = PythonOperator(task_id='youth_crawl', python_callable=youth_crawl_db_in, dag=dag)

uth_crawl_oper = PythonOperator(task_id = 'youth_preprocess',python_callable=preprocess_youth,dag =dag)

combine_table_oper =  PythonOperator(task_id = 'combine_table',python_callable=make_com_table,dag =dag)

integrate_table_oper =  PythonOperator(task_id = 'integrate_table',python_callable=com_data,dag =dag)

policy_table_oper =  PythonOperator(task_id = 'policy',python_callable=com_to_pol,dag =dag)

jababa_crawl_operator >> jababa_preprocess_operator

youth_crawl_operator >> uth_crawl_oper

[jababa_preprocess_operator,uth_crawl_oper] >> combine_table_oper

combine_table_oper >> integrate_table_oper

integrate_table_oper>> policy_table_oper
