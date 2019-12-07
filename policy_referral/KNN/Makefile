RECOMMEND = knn_base_rec.py
MODEL = make_knn_model.py
SHOW = show_recommendations.py
DROP = drop_recommendations.py

UID1 = wjsgusqls123@gmail.com
UID2 = q@q.com
UID3 = sunstar04@ajou.ac.kr
UID4 = test1@rr.com
UID5 = wjsgusqls1234@gmail.com

PORT = 3306
IP_ADD = 127.0.0.1

all:
	python3.7 $(RECOMMEND) $(UID1)
	python3.7 $(RECOMMEND) $(UID2)
	python3.7 $(RECOMMEND) $(UID3)
	python3.7 $(RECOMMEND) $(UID4)
	python3.7 $(RECOMMEND) $(UID5)

model:
	python3.7 $(MODEL)

test:
	python3.7 $(SHOW) $(UID1)
	python3.7 $(SHOW) $(UID2)
	python3.7 $(SHOW) $(UID3)
	python3.7 $(SHOW) $(UID4)
	python3.7 $(SHOW) $(UID5)

clean:
	python3.7 $(DROP)
