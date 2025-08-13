# Python2示例 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/db/example/python-example/
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

# Python2示例

MemFire Cloud 提供Python、Java、spring、golang、nodejs、小程序开发示例，讲述如何编译执行程序，帮助用户如何采用多种语言来使用连接MemFire Cloud的云数据库。

**示例下载地址**  
python示例下载地址：https://gitee.com/memfiredb/memfiredb-example-python

**环境描述**  
• python 2.7  
• pip install sqlalchemy==1.3.23  
• pip install psycopg2-binary

**创建示例应用**  
1、加密连接  
• 登录cloud.memfiredb.com创建证书认证数据库test，并下载证书，python程序请选择“DER”类型的证书  
• 下载证书时，会下载三个文件，有的浏览器可能会进行拦截，取消拦截即可  
• 证书下载后上传到linux服务器之后，要确保memfiredb.key文件的权限是0600，否则程序会抛出异常  
• sslmode选择“verify-ca”  
（1）编辑代码文件main.py，文件内容如下：

```
# -*- coding: utf-8 -*-
"""
Copyright (c) 2020, Nimblex Co .,Ltd.

Created on 2020-12-11 11:28
"""
import sys

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sqlalchemy.engine.url as url

Base = declarative_base()

class Counter(Base):
    __tablename__ = 'counters'

    id = Column(Integer, primary_key=True)
    counter = Column(Integer)

engine = None

def init_db_engine(host, port, dbname, user, passwd, ssl_ca, ssl_cert, ssl_key):
    global engine
    uri = url.URL(
        drivername="postgresql",
        host=host,
        port=port,
        username=user,
        password=passwd,
        database=dbname,
    )

    ssl_args = {
        "sslmode": "verify-ca",
        "sslrootcert": ssl_ca,
        "sslcert": ssl_cert,
        "sslkey": ssl_key
    }
    engine = create_engine(uri, connect_args=ssl_args, encoding='utf-8', echo=False,
                           pool_size=100, pool_recycle=3600, pool_pre_ping=True)

def get_session():
    global engine
    SessionCls = sessionmaker(bind=engine)
    return SessionCls()

def main():
    host = sys.argv[1]
    port = int(sys.argv[2])

    init_db_engine(host, port, 'test', 'test', 'test', './root.crt', './memfiredb.crt', './memfiredb.key')
    Base.metadata.create_all(engine)

    session = get_session()
    session.execute('delete from counters')
    cnt = Counter(counter=1)
    session.add(cnt)
    session.commit()
    session.close()

if __name__ == '__main__':
    main()
```

（2）执行程序
python main.py

2、非加密连接  
• 登录cloud.memfiredb.com创建非证书认证数据库test，点击“连接信息”按钮，获取数据库的连接信息。  
（1）编辑代码文件main.py，文件内容如下：

```
# -*- coding: utf-8 -*-
"""
Copyright (c) 2020, Nimblex Co .,Ltd.

Created on 2020-12-10 15:42
"""
import threading
import sys

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError
import sqlalchemy.engine.url as url

Base = declarative_base()

class Counter(Base):
    __tablename__ = 'counters'

    id = Column(Integer, primary_key=True)
    counter = Column(Integer)

engine = None

def init_db_engine(host, port, dbname, user, passwd):
    global engine
    uri = url.URL(
        drivername="postgresql",
        host=host,
        port=port,
        username=user,
        password=passwd,
        database=dbname,
    )
    engine = create_engine(uri, encoding='utf-8', echo=False,
                           pool_size=100, pool_recycle=3600,
                           pool_pre_ping=True)

def get_session():
    global engine
    SessionCls = sessionmaker(bind=engine)
    return SessionCls()

def test_transaction_try_again():
    def incrInTx():
        session = get_session()
        try:
            cnt = session.query(Counter).first()
            cnt.counter = cnt.counter + 1
            session.add(cnt)
            session.commit()
        finally:
            session.rollback()
            session.close()

    def retryer():
        while 1:
            try:
                incrInTx()
            except OperationalError as e:
                message = repr(e)
                if ('Try again' in message or '40001' in message or 'Restart read required' in message):
                    print('try again')
                    continue

                # 其他异常
                raise e

            return

    threads = []
    for x in range(5):
        t = threading.Thread(target=retryer)
        t.start()
        threads.append(t)

    for t in threads:
        t.join()

def main():
    host = sys.argv[1]
    port = int(sys.argv[2])
    dbname = sys.argv[3]
    dbuser = sys.argv[4]
    dbpassword = sys.argv[5]

    init_db_engine(host, port, dbname, dbuser, dbpassword)
    Base.metadata.create_all(engine)

    session = get_session()
    session.execute('delete from counters')
    cnt = Counter(counter=1)
    session.add(cnt)
    session.commit()
    session.close()

    test_transaction_try_again()

if __name__ == '__main__':
    main()
```

（2）执行程序

`python main.py`

---

[*navigate\_before* SQL操作入门](/docs/db/introduction-to-sql-operation/)

[Python3示例 *navigate\_next*](/docs/db/example/python3-example/)