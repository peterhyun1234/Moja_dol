-- after_click_priority_insert
delimiter |
CREATE TRIGGER after_click_priority_insert 
AFTER INSERT ON click 
FOR EACH ROW 
BEGIN 
    INSERT INTO click_priority (
    uID,
    Employment_sup_priority,
    Startup_sup_priority,
    Life_welfare_priority, 
    Residential_financial_priority 
    )
    SELECT ci.uID, ci.Employment_sup_priority, ci.Startup_sup_priority, ci.Life_welfare_priority, ci.Residential_financial_priority 
    FROM 
    (SELECT uID, 
        sum(Employment_sup)/(sum(Employment_sup) + sum(Startup_sup) + sum(Life_welfare) + sum(Residential_finance))*20 AS Employment_sup_priority, 
        sum(Startup_sup)/(sum(Employment_sup) + sum(Startup_sup) + sum(Life_welfare) + sum(Residential_finance))*20 AS Startup_sup_priority, 
        sum(Life_welfare)/(sum(Employment_sup) + sum(Startup_sup) + sum(Life_welfare) + sum(Residential_finance))*20 AS Life_welfare_priority, 
        sum(Residential_finance)/(sum(Employment_sup) + sum(Startup_sup) + sum(Life_welfare) + sum(Residential_finance))*20 AS Residential_financial_priority
        FROM click natural join interest
        WHERE 
        (uID = click.uID)
        GROUP BY uID) AS ci
    ON DUPLICATE KEY UPDATE 
    uID = ci.uID, 
    Employment_sup_priority = ci.Employment_sup_priority, 
    Startup_sup_priority = ci.Startup_sup_priority,  
    Life_welfare_priority = ci.Life_welfare_priority,  
    Residential_financial_priority = ci.Residential_financial_priority;
END|
delimiter;

-- user_based_refferal
SELECT p_code, title, uri, 
DATE_SUB(apply_start, INTERVAL -9 HOUR) AS apply_start, 
DATE_SUB(apply_end, INTERVAL -9 HOUR) AS apply_end, 
count(*) AS policy_hits
FROM user NATURAL JOIN stored_policy, policy  
WHERE 
(p_code = s_p_code) AND
(age BETWEEN ((SELECT age FROM user WHERE uID = recv_uID) - age_gap) AND ((SELECT age FROM user WHERE uID = recv_uID) + age_gap)) AND
(start_age <= (SELECT age FROM user WHERE uID = recv_uID) AND (SELECT age FROM user WHERE uID = recv_uID) <= end_age) AND 
((expiration_flag = 2) OR (apply_start <= NOW() AND apply_end >= NOW()))
GROUP BY p_code
ORDER BY policy_hits DESC
LIMIT 5

-- refferal
SELECT p_code, title, uri, 
DATE_SUB(apply_start, INTERVAL -9 HOUR) AS apply_start, 
DATE_SUB(apply_end, INTERVAL -9 HOUR) AS apply_end, 
(Employment_sup*user.Employment_sup_priority + 
Startup_sup*user.Startup_sup_priority + 
Life_welfare*user.Life_welfare_priority + 
Residential_finance*user.Residential_financial_priority)*0.5 AS cg_priority, 
(Employment_sup*mylist_priority.Employment_sup_priority + 
Startup_sup*mylist_priority.Startup_sup_priority + 
Life_welfare*mylist_priority.Life_welfare_priority + 
Residential_finance*mylist_priority.Residential_financial_priority)*0.5 AS ml_priority, 
(Employment_sup*click_priority.Employment_sup_priority + 
Startup_sup*click_priority.Startup_sup_priority + 
Life_welfare*click_priority.Life_welfare_priority + 
Residential_finance*click_priority.Residential_financial_priority)*0.5 AS cl_priority 
FROM policy NATURAL JOIN interest, user, mylist_priority, click_priority 
WHERE 
(user.uID = mylist_priority.uID = click_priority.uID) AND 
(user.uID = 'peterhyun1234@gmail.com') AND 
(start_age <= user.age AND user.age <= end_age) AND 
((expiration_flag = 2) OR (apply_start <= NOW() AND apply_end >= NOW()))
ORDER BY (cg_priority + ml_priority + cl_priority) DESC, apply_end ASC 
LIMIT 5