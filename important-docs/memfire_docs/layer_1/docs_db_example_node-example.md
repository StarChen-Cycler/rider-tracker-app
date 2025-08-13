# Node示例 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/db/example/node-example/
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

# Node示例

MemFire Cloud 提供Python、Java、spring、golang、nodejs、小程序开发示例，讲述如何编译执行程序，帮助用户如何采用多种语言来使用连接MemFire Cloud的云数据库。

**示例下载地址**   
Node示例下载地址：https://gitee.com/memfiredb/memfiredb-example-nodejs

**环境描述**   
• node 12

**创建示例应用**   
1、非加密连接   
• 登录cloud.memfiredb.com创建非证书认证数据库test，点击“连接信息”按钮，获取数据库的连接信息。   
（1）编辑代码文件，文件内容如下：   
controller.js:

```
const { Client } = require("pg");

let dbUrl = ''

exports.configuration = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(200).send({
      message: "Req body is empty!"
    });
    return;
  }

  const d = req.body;
  // console.log(d)

  dbUrl = `postgresql://${d.username}:${d.passwd}@${d.host}:${d.port}/${d.dbname}`;
  res.status(200).send({
    message: dbUrl
  });
  return;
}

exports.sync = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(200).send({
      message: "Req body is empty!"
    });
    return;
  }

  const data = req.body[0];
  const table = 'dac' + new Date().getTime();

  delete data._timestamp;
  delete data._url;

  const attr = Object.keys(data);
  let columns = '';
  let sentence = '';
  for (let i = 0; i < attr.length; i++) {
    columns = columns + `${attr[i]},`
    sentence = sentence + `${attr[i]} text,`
  }
  columns = columns.substr(0, columns.length - 1);
  sentence = sentence.substr(0, sentence.length - 1);

  const valLen = data[attr[0]].length;
  let values = '';
  for (let i = 0; i < valLen; i++) {
    let val = '(';
    for (let j = 0; j < attr.length; j++) {
      val = val + `'${data[attr[j]][i]}'` + ','
    }
    val = val.substr(0, val.length - 1) + ')';
    values = values + val + ','
  }
  values = values.substr(0, values.length - 1);

  const createTable = `CREATE TABLE ${table} (${sentence});`
  const insertTable = `INSERT INTO ${table}(${columns}) VALUES ${values};`

  const client = new Client({
    connectionString: dbUrl
  })

  await client.connect()

  await client.query(
    createTable,
    (err, result) => {
      if (err) {
        res.status(200).send('db create failed');
      }
      res.status(200).send('ok')
    }
  )

  await client.query(
    insertTable,
    (err, result) => {
      client.end();
      if (err) {
        res.status(200).send('db update failed');
      }
      res.status(200).send('ok')
    }
  )

};
```

routes.js

```
module.exports = app => {
  const ctl = require("../controllers/controller.js");

  const router = require("express").Router();

  router.post("/config", ctl.configuration);

  router.post("/sync", ctl.sync);

  app.use("/api", router);
};
```

server.js

```
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to memfire dac api" });
});

require("./app/routes/routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
```

2、执行程序

`node server.js`

---

[*navigate\_before* Spring示例](/docs/db/example/spring-example/)

[C++示例 *navigate\_next*](/docs/db/example/c++-example/)