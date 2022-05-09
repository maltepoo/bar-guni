import datetime

import pymysql

# 테스트를 위한 아이템 가데이터를 넣는 파이썬 파일입니다.


# db와 python연결
conn=pymysql.connect(host='3.38.166.106', port=7777, user='ssafy', password='ssafy', db='barguni', charset='utf8')
curs = conn.cursor()
conn.commit()

# 테이블에 컬럼을 지정해 넣는 sql문
insert_sql = "INSERT INTO item (item_id, dday, alert_by, content, name, reg_date, shelf_life, used, used_date, bkt_id, cate_id, pic_id) values(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"



for i in range(100):
    next_id = 500+i



    if i%2:
        alert_by = "D_DAY"
        dday = 5
        shelf_life = None
    else:
        alert_by = "SHELF_LIFE"
        shelf_life = datetime.date.today()
        dday = None

    content = ''
    name = str(i) + "번째 테스트 데이터"
    reg_date = datetime.date.today()
    used = False
    used_date = None
    bkt_id = 40
    cate_id = 1345
    pic_id = 3
    curs.execute(insert_sql, (next_id, dday, alert_by, content, name, reg_date, shelf_life, used, used_date, bkt_id, cate_id, pic_id))
    conn.commit()


conn.close()