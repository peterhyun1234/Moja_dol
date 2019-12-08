from airflow import DAG
from airflow.operators.dummy_operator import DummyOperator
from airflow.operators.python_operator import PythonOperator
from datetime import datetime

from make_com_table import make_com_table
from combine_table_fir import com_data
from com_to_policy import com_to_pol

dag = DAG('policy_sce', description='grate',
          schedule_interval='0 0 * * *',
          start_date=datetime(2019, 11, 1), catchup=False)

combine_table_oper = PythonOperator(task_id = 'combine_table',python_callable=make_com_table,dag=dag)

integrate_table_oper =  PythonOperator(task_id = 'integrate_table',python_callable=com_data,dag =dag)

policy_table_oper =  PythonOperator(task_id = 'policy',python_callable=com_to_pol,dag =dag)

combine_table_oper >> integrate_table_oper >> policy_table_oper
