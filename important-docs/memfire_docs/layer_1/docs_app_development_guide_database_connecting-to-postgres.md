# 数据库连接 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/database/connecting-to-postgres/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

直接连接

# 数据库连接

MemFire Cloud 提供了几种连接Postgres数据库的方式:

1. 直接连接：使用Postgres标准连接系统直接与数据库进行连接和交互。
2. [无服务器API连接](/docs/app/development_guide/api/api/)：使用无服务器API以编程方式来访问数据库。

## 直接连接 [*link*](#%e7%9b%b4%e6%8e%a5%e8%bf%9e%e6%8e%a5)

每个MemFire Cloud 应用内置一个完整的Postgres数据库，你可以使用任何支持Postgres的工具来连接到数据库。你可以在控制台内的数据库设置中获取连接信息：

1. 来到左侧菜单栏的 `设置`部分
2. 点击`数据库`
3. 启用数据库直连
4. 找到应用的`连接信息`

![](../../../../img/guides/database/数据库连接-步骤.png)

### 白名单 [*link*](#%e7%99%bd%e5%90%8d%e5%8d%95)

MemFire Cloud内置白名单功能，开启白名单后，只允许白名单内的IP地址段访问你的数据库。关闭白名单后，访问你数据库的IP地址不受限制，即任何IP地址只要有连接信息都可以与你的数据库进行直连。
在进行白名单配置时，要遵循CIDR规则。MemFire Cloud中白名单功能 默认是关闭的，需用户手动开启。

![](../../../../img/guides/database/数据库连接-白名单.png)

## 无服务器API连接 [*link*](#%e6%97%a0%e6%9c%8d%e5%8a%a1%e5%99%a8api%e8%bf%9e%e6%8e%a5)

MemFire Cloud 提供了自动更新API，极大简化了操作数据库中数据的步骤（包括数据查询、插入、更新等等）。同时我们也提供了一些不同类型的API来满足你的业务需求。

* [REST](/docs/app/development_guide/api/api/#rest-api-overview)：通过REST接口与你的数据库进行交互。
* [GraphQL](/docs/app/development_guide/api/api/#graphql-api-overview)：通过GraphQL接口与你的数据库互动。
* [Realtime](/docs/app/development_guide/api/api/#realtime-api)：通过websockets监听数据库变化。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 使用Navicat连接 [*link*](#%e6%a1%88%e4%be%8b1-%e4%bd%bf%e7%94%a8navicat%e8%bf%9e%e6%8e%a5)

Navicat是一个用于管理Postgres数据库的图形用户界面（GUI）工具。你可以使用它连接到你的数据库：

#### 步骤1 [*link*](#%e6%ad%a5%e9%aa%a41)

新建一个连接，选择:PostgreSQL
![](../../../../img/guides/database/数据库连接-navicat1.png)

#### 步骤2 [*link*](#%e6%ad%a5%e9%aa%a42)

在你的MemFire Cloud控制台中找到“连接信息”，并添加此处。点击“测试连接”，若返回成功弹窗则表明连接建立成功。
![](../../../../img/guides/database/数据库连接-navicat2.png)

连接成功后即可管理和查询你的数据。
![](../../../../img/guides/database/数据库连接-navicat结果.png)

### 案例2 使用python连接 [*link*](#%e6%a1%88%e4%be%8b2-%e4%bd%bf%e7%94%a8python%e8%bf%9e%e6%8e%a5)

配置：本例中选用pycharm编辑器，python3.8版本。

#### 步骤1 [*link*](#%e6%ad%a5%e9%aa%a41-1)

在 MemFire Cloud 控制台中启用数据库直连，找到python的“连接字符串”。
![](../../../../img/guides/database/数据库连接-python.png)

#### 步骤2 [*link*](#%e6%ad%a5%e9%aa%a42-1)

在pycharm编辑器中，导入第三方库 `psycopg2`，`psycopg2`是一个流行的Python库，用于连接和操作PostgreSQL数据库。如果尚未安装此库，请通过以下命令进行安装：

```
pip install psycopg2
```

*或者*在pycharm的 Python Interpreter中进行设置，步骤如下：

![](../../../../img/guides/database/数据库连接-python库安装1.png)
![](../../../../img/guides/database/数据库连接-python库安装2.png)

#### 步骤3 [*link*](#%e6%ad%a5%e9%aa%a43)

完成`psycopg2`的安装后，将连接字符串中的`[YOUR-PASSWORD]`替换为数据库的实际密码。`[YOUR-HOST]`替换为数据库的主机地址。
`[USER-NAME]`替换为你的用户名。端口号默认为：`10010`，数据库名称默认为：`postgres`。建立与MemFire Cloud应用数据库连接，然后对数据库进行操作。

代码如下：

```
import psycopg2

# 定义连接字符串
connection_string = "user=[USER-NAME] password=[YOUR-PASSWORD] host=[YOUR-HOST] port=5432 dbname=postgres"

try:
    # 连接到数据库
    connection = psycopg2.connect(connection_string)

    # 创建一个游标对象
    cursor = connection.cursor()

    # 执行SQL查询或其他数据库操作
    # 注：city是本次数据库中想要操作的表名
    cursor.execute("SELECT * FROM city;")
    rows = cursor.fetchall()

    # 输出查询结果
    for row in rows:
        print(row)

    # 关闭游标和连接
    cursor.close()
    connection.close()

except psycopg2.Error as error:
    print("Error connecting to the database:", error)
```

这段代码返回数据库中表“city”的全部内容。可以看出，返回结果与表中数据一致。

![](../../../../img/guides/database/数据库连接-python结果.png)
![](../../../../img/guides/database/数据库连接-本地表.png)

*注*:如编译不通过，尝试将python连接字符串中参数`database`改为`dbname`。因为`psycopg2`库并不认可`database`这个参数

### 案例3 使用Nodejs连接 [*link*](#%e6%a1%88%e4%be%8b3--%e4%bd%bf%e7%94%a8nodejs%e8%bf%9e%e6%8e%a5)

配置：本例中选用VScode编辑器，node.js版本v16.19.0

#### 步骤1 [*link*](#%e6%ad%a5%e9%aa%a41-2)

在 MemFire Cloud 控制台中启用数据库直连，找到nodejs的“连接字符串”。
![](../../../../img/guides/database/数据库连接-nodejs.png)

#### 步骤2 [*link*](#%e6%ad%a5%e9%aa%a42-2)

确保你的系统上已经安装了Node.js和npm。创建一个新的Node.js项目或使用现有项目。进入项目目录并安装pg库，这是Node.js中常用的PostgreSQL客户端。

```
npm install pg
```

#### 步骤3 [*link*](#%e6%ad%a5%e9%aa%a43-1)

创建一个JavaScript文件（本例`app.js`）并在文件开头导入`pg`库，使用连接字符串建立数据库连接：
将连接字符串中的`[YOUR-PASSWORD]`替换为数据库的实际密码。`[YOUR-HOST]`替换为数据库的主机地址。`[USER-NAME]`替换为你的用户名。端口号默认为：`10010`，数据库名称默认为：`postgres`。然后对数据库进行操作。

代码如下：

```
const { Client } = require('pg');

const connectionString = 'postgresql://[USER-NAME]:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres';

const client = new Client({
  connectionString: connectionString,
});

// 连接数据库
client.connect()
  .then(() => {
    console.log('已连接到数据库');
    // 现在你可以使用 'client' 对象执行查询
  })
  .catch((err) => {
    console.error('连接数据库出错', err);
  });

//查询数据库
  client.query('SELECT * FROM city;')
  .then((result) => {
    console.log('查询结果:', result.rows);
  })
  .catch((err) => {
    console.error('执行查询出错:', err);
  });
```

到 `app.js` 文件所在的目录下执行 node app.js，运行`app.js`文件，可得到返回结果

```
node app.js
```

这段代码返回数据库中表“city”的全部内容。可以看出，返回结果与表中数据一致。

![](../../../../img/guides/database/数据库连接-nodejs结果.png)
![](../../../../img/guides/database/数据库连接-本地表.png)

---

[*navigate\_before* 概述](/docs/app/development_guide/database/database/)

[关联查询 *navigate\_next*](/docs/app/development_guide/database/associated-query/)