

delimiter |
CREATE TRIGGER before_click_priority_update 
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
delimiter ;


create table mylist_priority(         
    uID varchar(50) not null,         
    Employment_sup_priority double,         
    Startup_sup_priority double,         
    Life_welfare_priority double,         
    Residential_financial_priority double,         
    primary key(uID)     
    );


    delimiter |
CREATE TRIGGER before_click_priority_update 
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
delimiter ;