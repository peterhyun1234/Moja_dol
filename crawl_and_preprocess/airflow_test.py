from airflow import DAG
from airflow.operators.dummy_operator import DummyOperator
from airflow.operators.python_operator import PythonOperator
from datetime import datetime
from airflow_db_in import airflow_test


dag = DAG('air_flow_test', description='Simple tutorial DAG',
          schedule_interval='0 12 * * *',
          start_date=datetime(2019, 10, 27), catchup=False)

dummy_operator = DummyOperator(task_id='dummy_task', retries=3, dag=dag)

test_operator = PythonOperator(task_id='air_flow_test', python_callable=airflow_test, dag=dag)

dummy_operator >> test_operator
