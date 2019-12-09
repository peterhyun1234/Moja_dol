from airflow import DAG
from airflow.operators.dummy_operator import DummyOperator
from airflow.operators.python_operator import PythonOperator
from datetime import datetime

from jababa_crawl import jababa_crawling
from jababa_preprocess import jababa_preprocess

from youth_crawl import youth_crawl_db_in
from youth_preprocess import preprocess_youth
#
from youth_local_crawl import youth_local_crawl
from youth_local_preprocess import preprocess_local_youth

from gov_crawl import gov_crawling
from gov_preprocess import gov_preprocess_d
#
from make_com_table import make_com_table
from combine_table_fir import com_data
from com_to_policy import com_to_pol

##
from unify_info import unify_row
from update_table import change_date

from make_knn_model import make_knn_model

from origin_table import to_origin

dag = DAG('integrate_dag', description='integrate',
          schedule_interval='0 0 * * *',
          start_date=datetime(2019, 11, 1), catchup=False)


jababa_crawl_operator = PythonOperator(task_id='jababa_crawl', python_callable=jababa_crawling, dag=dag)
jababa_preprocess_operator = PythonOperator(task_id = 'jababa_preprocess',python_callable=jababa_preprocess,dag=dag)

youth_crawl_operator = PythonOperator(task_id='youth_crawl', python_callable=youth_crawl_db_in, dag=dag)
uth_crawl_oper = PythonOperator(task_id = 'youth_preprocess',python_callable=preprocess_youth,dag =dag)

youth_local_crawl_oper = PythonOperator(task_id='youth_local_crawl', python_callable=youth_local_crawl, dag=dag)
youth_local_preprocess_oper = PythonOperator(task_id='youth_local_preprocess', python_callable=preprocess_local_youth, dag=dag)

gov_crawl_oper = PythonOperator(task_id='gov_crawl', python_callable=gov_crawling, dag=dag)
gov_preprocess_oper= PythonOperator(task_id='gov_preprocess', python_callable=gov_preprocess_d, dag=dag)


combine_table_oper =  PythonOperator(task_id = 'combine_table',python_callable=make_com_table,dag =dag)

integrate_table_oper =  PythonOperator(task_id = 'integrate_table',python_callable=com_data,dag =dag)

policy_table_oper =  PythonOperator(task_id = 'policy',python_callable=com_to_pol,dag =dag)

unify_oper = PythonOperator(task_id = 'listing_unify',python_callable=unify_row,dag =dag)

change_date_oper = PythonOperator(task_id = 'update_date',python_callable=change_date,dag =dag)

make_knn_model = PythonOperator(task_id = 'KNN_model',python_callable = make_knn_model,dag=dag )

make_origin_table = PythonOperator(task_id="origin_table",python_callable = to_origin, dag = dag)

jababa_crawl_operator >> jababa_preprocess_operator

youth_crawl_operator >> uth_crawl_oper

youth_local_crawl_oper >> youth_local_preprocess_oper

gov_crawl_oper >> gov_preprocess_oper

[jababa_preprocess_operator,uth_crawl_oper,youth_local_preprocess_oper,gov_preprocess_oper] >> combine_table_oper

combine_table_oper >> integrate_table_oper

integrate_table_oper>> policy_table_oper

policy_table_oper >> [unify_oper,change_date_oper] 

[unify_oper,change_date_oper] >> make_knn_model

make_knn_model >> make_origin_table
