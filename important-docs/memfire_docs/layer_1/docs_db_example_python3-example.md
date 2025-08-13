# Python3示例 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/db/example/python3-example/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

Table of Contents

# Python3示例

MemFire Cloud 提供Python、Java、spring、golang、nodejs、小程序开发示例，讲述如何编译执行程序，帮助用户如何采用多种语言来使用连接MemFire Cloud的云数据库。

**示例下载地址**  
python3示例代码下载地址：https://gitee.com/memfiredb/memfiredb-example-python3

**环境描述**

* python 3.8.9
* pip install sqlalchemy==2.0.29
* pip install psycopg2-binary==2.9.9

**创建示例应用**  
1、加密连接

* 登录cloud.memfiredb.com创建“证书认证”数据库，并下载证书，选择“DER”或“PEM”类型的证书均可
* 下载证书时，会下载三个文件，有的浏览器可能会进行拦截，取消拦截即可
* 证书下载后上传到linux服务器之后，要确保memfiredb.key文件的权限是0600，否则程序会抛出异常
* sslmode选择“verify-ca”

（1）编辑代码文件main.py，文件内容如下：

```
# -*- coding: utf-8 -*-
"""
Copyright (c) 2024, Nimblex Co .,Ltd.
Created on 2024-05-14 11:42
"""
import threading
import sys

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, text
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError, SQLAlchemyError

Base = declarative_base()

class Counter(Base):
    __tablename__ = 'counters'

    id = Column(Integer, primary_key=True)
    counter = Column(Integer)

engine = None

def init_db_engine(host, port, dbname, user, password, ssl_ca, ssl_cert, ssl_key):
    global engine
    uri = f"postgresql://{user}:{password}@{host}:{port}/{dbname}"

    ssl_args = {
            "sslmode": "verify-ca",
            "sslrootcert": ssl_ca,
            "sslcert": ssl_cert,
            "sslkey": ssl_key
        }

    engine = create_engine(uri, connect_args=ssl_args, echo=False,
                           pool_size=100, pool_recycle=3600,
                           pool_pre_ping=True)

def get_session():
    global engine
    SessionCls = sessionmaker(bind=engine)
    return SessionCls()

def test_transaction_try_again():
    def retryer():
        while 1:
            try:
                session = get_session()
                cnt = session.query(Counter).first()
                cnt.counter = cnt.counter + 1
                session.add(cnt)
                session.commit()
            except OperationalError as e:
                message = repr(e)
                if ('Try again' in message or '40001' in message or 'Restart read required' in message):
                    print('try again')
                    continue

            except SQLAlchemyError as e:
                message = repr(e)
                print("An error occurred: ", message)
                session.rollback()
                raise e

            finally:
                session.close()
            return

    threads = []
    for x in range(5):
        t = threading.Thread(target=retryer)
        t.start()
        threads.append(t)

    for t in threads:
        t.join()

def main():
    host = ""
    port = ""
    dbname = ""
    user = ""
    password = ""
    ssl_ca = "./root.crt"
    ssl_cert = "./memfiredb.crt"
    # 注意 memfiredb.key文件的读写权限要为600
    ssl_key = "./memfiredb.key"

    init_db_engine(host, port, dbname, user, password, ssl_ca, ssl_cert, ssl_key)
    Base.metadata.create_all(engine)

    session = get_session()
    try:
        # 删除并新增数据
        session.execute(text('delete from counters'))
        cnt = Counter(counter=999)
        session.add(cnt)
        session.commit()

        # 查询数据
        # res = session.execute(text('select * from counters;'))
        # rows = res.fetchall()
        # for row in rows:
        #     print(row)
    except SQLAlchemyError as e:
        print("An error occurred: ", e)
        session.rollback()
    finally:
        session.close()

    test_transaction_try_again()

if __name__ == '__main__':
    main()
```

（2）执行程序

`python main.py`

2、非加密连接

* 登录cloud.memfiredb.com创建认证方式为“密码认证”的数据库，点击“连接信息”按钮，获取数据库的连接信息。

（1）编辑代码文件main.py，文件内容如下：

```
# -*- coding: utf-8 -*-
"""
Copyright (c) 2024, Nimblex Co .,Ltd.
Created on 2024-05-14 11:42
"""
import threading
import sys

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, text
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError, SQLAlchemyError

Base = declarative_base()

class Counter(Base):
    __tablename__ = 'counters'

    id = Column(Integer, primary_key=True)
    counter = Column(Integer)

engine = None

def init_db_engine(host, port, dbname, user, password):
    global engine
    uri = f"postgresql://{user}:{password}@{host}:{port}/{dbname}"
    engine = create_engine(uri, echo=False,
                           pool_size=100, pool_recycle=3600,
                           pool_pre_ping=True)

def get_session():
    global engine
    SessionCls = sessionmaker(bind=engine)
    return SessionCls()

def test_transaction_try_again():
    def retryer():
        while 1:
            try:
                session = get_session()
                cnt = session.query(Counter).first()
                cnt.counter = cnt.counter + 1
                session.add(cnt)
                session.commit()
            except OperationalError as e:
                message = repr(e)
                if ('Try again' in message or '40001' in message or 'Restart read required' in message):
                    print('try again')
                    continue

            except SQLAlchemyError as e:
                message = repr(e)
                print("An error occurred: ", message)
                session.rollback()
                raise e

            finally:
                session.close()
            return

    threads = []
    for x in range(5):
        t = threading.Thread(target=retryer)
        t.start()
        threads.append(t)

    for t in threads:
        t.join()

def main():
    host = ""
    port = ""
    dbname = ""
    user = ""
    password = ""

    init_db_engine(host, port, dbname, user, password)
    Base.metadata.create_all(engine)

    session = get_session()
    try:
        # 删除并新增数据
        session.execute(text('delete from counters'))
        cnt = Counter(counter=999)
        session.add(cnt)
        session.commit()

        # 查询数据
        # res = session.execute(text('select * from counters;'))
        # rows = res.fetchall()
        # for row in rows:
        #     print(row)
    except SQLAlchemyError as e:
        print("An error occurred: ", e)
        session.rollback()
    finally:
        session.close()

    test_transaction_try_again()

if __name__ == '__main__':
    main()
```

（2）执行程序

`python main.py`

---

[*navigate\_before* Python2示例](/docs/db/example/python-example/)

[Java示例 *navigate\_next*](/docs/db/example/java-example/)