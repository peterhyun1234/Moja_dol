
-- before_click_priority_update
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

-- create table mylist_priority
create table mylist_priority(         
    uID varchar(50) not null,         
    Employment_sup_priority double,         
    Startup_sup_priority double,         
    Life_welfare_priority double,         
    Residential_financial_priority double,         
    primary key(uID)     
    );
 
 -- before_mylist_priority_update
delimiter |
CREATE TRIGGER before_mylist_priority_update 
AFTER INSERT ON stored_policy 
FOR EACH ROW 
BEGIN 
    INSERT INTO mylist_priority (
    uID,
    Employment_sup_priority,
    Startup_sup_priority,
    Life_welfare_priority, 
    Residential_financial_priority 
    )
    SELECT mi.uID, mi.Employment_sup_priority, mi.Startup_sup_priority, mi.Life_welfare_priority, mi.Residential_financial_priority 
    FROM 
    (SELECT uID, 
sum(Employment_sup)/(sum(Employment_sup) + sum(Startup_sup) + sum(Life_welfare) + sum(Residential_finance))*20 AS Employment_sup_priority, 
sum(Startup_sup)/(sum(Employment_sup) + sum(Startup_sup) + sum(Life_welfare) + sum(Residential_finance))*20 AS Startup_sup_priority, 
sum(Life_welfare)/(sum(Employment_sup) + sum(Startup_sup) + sum(Life_welfare) + sum(Residential_finance))*20 AS Life_welfare_priority, 
sum(Residential_finance)/(sum(Employment_sup) + sum(Startup_sup) + sum(Life_welfare) + sum(Residential_finance))*20 AS Residential_financial_priority
FROM stored_policy, interest
WHERE 
(uID = stored_policy.uID) AND (p_code = s_p_code)
GROUP BY uID) AS mi
    ON DUPLICATE KEY UPDATE 
    uID = mi.uID, 
    Employment_sup_priority = mi.Employment_sup_priority, 
    Startup_sup_priority = mi.Startup_sup_priority,  
    Life_welfare_priority = mi.Life_welfare_priority,  
    Residential_financial_priority = mi.Residential_financial_priority;
END|
delimiter ;


 -- before_mylist_priority_delete 
delimiter |
CREATE TRIGGER before_mylist_priority_delete 
AFTER DELETE ON stored_policy 
FOR EACH ROW 
BEGIN 
    INSERT INTO mylist_priority (
    uID,
    Employment_sup_priority,
    Startup_sup_priority,
    Life_welfare_priority, 
    Residential_financial_priority 
    )
    SELECT mi.uID, mi.Employment_sup_priority, mi.Startup_sup_priority, mi.Life_welfare_priority, mi.Residential_financial_priority 
    FROM 
    (SELECT uID, 
sum(Employment_sup)/(sum(Employment_sup) + sum(Startup_sup) + sum(Life_welfare) + sum(Residential_finance))*20 AS Employment_sup_priority, 
sum(Startup_sup)/(sum(Employment_sup) + sum(Startup_sup) + sum(Life_welfare) + sum(Residential_finance))*20 AS Startup_sup_priority, 
sum(Life_welfare)/(sum(Employment_sup) + sum(Startup_sup) + sum(Life_welfare) + sum(Residential_finance))*20 AS Life_welfare_priority, 
sum(Residential_finance)/(sum(Employment_sup) + sum(Startup_sup) + sum(Life_welfare) + sum(Residential_finance))*20 AS Residential_financial_priority
FROM stored_policy, interest
WHERE 
(uID = stored_policy.uID) AND (p_code = s_p_code)
GROUP BY uID) AS mi
    ON DUPLICATE KEY UPDATE 
    uID = mi.uID, 
    Employment_sup_priority = mi.Employment_sup_priority, 
    Startup_sup_priority = mi.Startup_sup_priority,  
    Life_welfare_priority = mi.Life_welfare_priority,  
    Residential_financial_priority = mi.Residential_financial_priority;
END|
delimiter ;






