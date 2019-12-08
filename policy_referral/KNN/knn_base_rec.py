import pandas as pd
from sqlalchemy import create_engine
from sklearn.neighbors import NearestNeighbors
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.exc import IntegrityError

from joblib import load
import sys
from vector_list import category_diction
from vectorize import vectorize_by_world

import pickle

engine = create_engine("mysql+pymysql://viewer:"+"moja"+"@localhost/mojadol_DB00?host=localhost?port=3306", encoding='utf-8')

#category_diction = {'관광':
#['관광'],'청소년':['청소년'],'청년':['청년'],'창업':['창업'],'취업':['취업'],'대학':['대학'],'주택':['주택','기숙사'],'채용':['채용'],
#                   '교육':['교육'],'문화':['문화'],'해외':['해외'],'융자':['융자','대출'],'정장':['정장'],'인턴십':['인턴십','멘토링'], '심리':['심리','흥미'],'프로그램':['프로그램'],'여성':['여성'],'근로자':['근로자'],'장애인':['장애인'],'통장':['통장'],'장학금':['장학금'],'면접':['면접']}


knn_rec_table = """

CREATE TABLE knn_recommendation(
uID varchar(50) PRIMARY KEY,
p_code1 bigint(20),
p_code2 bigint(20),
p_code3 bigint(20),
p_code4 bigint(20),
p_code5 bigint(20)
)
"""

category_weight = "0.5"
mylist_weight = "0.5"
click_weight = "0.5"

def none_query_func(recv_uID):
	return ("SELECT p_code, " +
        "DATE_SUB(apply_start, INTERVAL -9 HOUR) AS apply_start, " +
        "DATE_SUB(apply_end, INTERVAL -9 HOUR) AS apply_end, " +
        "(Employment_sup*user.Employment_sup_priority + " +
        "Startup_sup*user.Startup_sup_priority + " +
        "Life_welfare*user.Life_welfare_priority + " +
        "Residential_finance*user.Residential_financial_priority)*" + category_weight + " " +
        "AS cg_priority, " +
        "(Employment_sup*mylist_priority.Employment_sup_priority + " +
        "Startup_sup*mylist_priority.Startup_sup_priority + " +
        "Life_welfare*mylist_priority.Life_welfare_priority + " +
        "Residential_finance*mylist_priority.Residential_financial_priority)*" + mylist_weight + " " +
        "AS ml_priority, " +
        "(Employment_sup*click_priority.Employment_sup_priority + " +
        "Startup_sup*click_priority.Startup_sup_priority + " +
        "Life_welfare*click_priority.Life_welfare_priority + " +
        "Residential_finance*click_priority.Residential_financial_priority)*" + click_weight + " " +
        "AS cl_priority " +
        "FROM policy NATURAL JOIN interest, user, mylist_priority, click_priority " +
        "WHERE (user.uID = mylist_priority.uID) AND " +
        "(user.uID = click_priority.uID) AND " +
        "(mylist_priority.uID = click_priority.uID) AND " +
        "(user.uID = '" + recv_uID + "') AND " +
        "((policy.dor = '전국') OR (policy.dor = user.dor AND policy.si = '전체') OR (policy.dor = user.dor AND policy.si = user.si)) AND " +
        "((start_age <= user.age AND user.age <= end_age) OR (end_age is null AND start_age is null) ) AND " +
        "((expiration_flag = 2) OR (apply_end >= NOW())) " +
        "ORDER BY (cg_priority + ml_priority + cl_priority) DESC, apply_end ASC " +
        "LIMIT 5")




#vectored_word = []


#def vectorize_by_world(df):
#    word_dict = category_diction.copy()
#    res = [0]*(4+len(word_dict))
#    key_list = list(word_dict.keys())
    
#    if df['Employment_sup'] == 1:
#        res[0] = 1
#    if df['Startup_sup'] == 1:
#        res[1] = 1
#    if df['Life_welfare'] == 1:
#        res[2] = 1
#    if df['Residential_finance'] == 1:
#        res[3] = 1
#    for idx in word_dict:
#         for kda in word_dict[idx]:
#                if kda in df['title']:
#                    res[4+key_list.index(idx)] = 1
#                    print(kda)
#                    vectored_word.append(kda)
#    df['vector'] = res
#    return df

#def return_word_count(input_list):
#
#    with open("word_dict.pickle",'wb') as fw:
#        word_count_dict = pickle.load(fw)
#    
#    res = 0
#    for idx in input_list:
#        res =res + word_count_dict[idx]
#   
#    return res


def predict_by_knn():
    clf = load('/root/mojadol_server/KNN/knn.joblib')
    uID = sys.argv[1]
    

    #with open("/root/mojadol_server/KNN/word_count_dict.pickle",'rb') as fw:
    #    word_count_dict = pickle.load(fw)

    conn = engine.connect()

    df = pd.read_sql('select s_p_code from stored_policy where uID = "'+str(uID)+'"',con=conn)
    print(uID)
    policy_ids = list(df['s_p_code'])
    
    temp = []
    for idx in policy_ids:
        temp.append("'"+str(idx)+"'")
        print(str(idx))
    policy_ids = temp
    
    if len(temp) == 0:
        print('mylist_none')
        
    if len(policy_ids) == 0:
        return   

    policy_df = pd.read_sql('select * from policy where p_code in ('+",".join(policy_ids) +')',con=conn)

    interest_df = pd.read_sql('select * from interest where p_code in ('+",".join((policy_ids)) +')',con=conn)

    policy_df = pd.merge(policy_df, interest_df, on='p_code')

    policy_df = policy_df.apply(vectorize_by_world,axis =1)
 
    compare = [0]*(4+len(category_diction))
    for idx,row in policy_df.iterrows():
        for kda in range(len(row['vector'])):
            compare[kda] = compare[kda] + row['vector'][kda]

    #temp_comp = [0]*(4+len(category_diction)) 
    #for idx in range(len(compare)):
    #    if compare[idx] == 1:
    #        temp_comp[idx] = 1
    #    else:
    #        temp_comp[idx] = 0
    #print("compare")    
    #for idx in range(len(compare)):
    #    if compare[idx] >0 and idx>4:
    #        inx = list(category_diction.keys())[idx-4]
    #        print(inx)
    #        division = word_count_dict[inx]
    #        compare[idx] = compare[idx]/division
        
 
    
    print("compare")
    #print(str(temp_comp))
    print(str(compare))
    
    #compare = temp_comp.copy()
    
    res_neigbor = clf.kneighbors([compare],5)[1]
    print(str(clf.kneighbors([compare],5)[0]))
    
    rec = []

    try:
        conn.execute(knn_rec_table)
    except SQLAlchemyError as e:
        print('exist table')
        print(e)
        pass
    print(clf.kneighbors([compare],5)[0][0]) 
    if clf.kneighbors([compare],5)[0][0][4] != 0 and sum(compare)!=0:

        for kda in res_neigbor:
            for idx in kda:
                temp_df = pd.read_sql("select p_code from policy where expiration_flag=2 or apply_end >= NOW() limit "+ str(idx)+",1",con=conn)
                rec.append(temp_df['p_code'][0])
    
        res_dict = {'uID':uID,'p_code1':rec[0],'p_code2':rec[1],'p_code3':rec[2],'p_code4':rec[3],'p_code5':rec[4]}
        rec_df = pd.DataFrame(columns=['uID','p_code1','p_code2','p_code3','p_code4','p_code5'])

        rec_df = rec_df.append(res_dict,ignore_index=True)
    
    elif clf.kneighbors([compare],5)[0][0][4] == 0 or sum(compare)==0:
        
        rec_pd = pd.read_sql(none_query_func(uID),con=conn)
        #print(none_query)
        rec_p_code = list(rec_pd['p_code'])
        print(rec_p_code)
        if len(rec_p_code)==0:
            rec_p_code = [0]*5
        res_dict = {'uID':uID,'p_code1':rec_p_code[0],'p_code2':rec_p_code[1],'p_code3':rec_p_code[2],'p_code4':rec_p_code[3],'p_code5':rec_p_code[4]}
        rec_df = pd.DataFrame(columns=['uID','p_code1','p_code2','p_code3','p_code4','p_code5'])
        rec_df = rec_df.append(res_dict,ignore_index=True)
    

    

    try:
        rec_df.to_sql(name='knn_recommendation',if_exists='append',con=conn,index=False)
    except IntegrityError:
        conn.execute("update knn_recommendation set p_code1 ='"+str(rec_df['p_code1'][0])+"',p_code2 ='"+str(rec_df['p_code2'][0])+"',p_code3 ='"+ str(rec_df['p_code3'][0]) +"',p_code4='"+str(rec_df['p_code4'][0]) +"',p_code5='"+str(rec_df['p_code5'][0]) +"' where uID ='"+str(rec_df['uID'][0]) +"'")
        pass

predict_by_knn()
