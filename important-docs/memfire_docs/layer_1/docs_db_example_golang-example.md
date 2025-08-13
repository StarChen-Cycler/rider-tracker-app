# Golang示例 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/db/example/golang-example/
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

# Golang示例

MemFire Cloud 提供Python、Java、spring、golang、nodejs、小程序开发示例，讲述如何编译执行程序，帮助用户如何采用多种语言来使用连接MemFire Cloud的云数据库。

**示例下载地址**  
Golang示例下载地址：https://gitee.com/memfiredb/memfiredb-example-golang

**环境描述**   
• Go version 1.8 , or later  
• Go PostgreSQL driver 已经安装  
`go get github.com/lib/pq`

**创建示例应用**  
1、加密连接  
• 在MemFire Cloud平台上完成注册操作，并创建证书认证的数据库test  
• 点击数据库test的连接信息，下载访问证书，需要包括memfiredb.crt memfiredb.key root.crt，并拷贝到运行go程序的环境下；  
创建源码文件main.go，文件内容如下:

```
/**
Copyright (c) 2020, Nimblex Co .,Ltd.
Created on 2020-07-21 19:35
**/
package main

import (
	"database/sql"
	_ "github.com/lib/pq"
	"log"
)

func main() {
	db, err := sql.Open("postgres", "user=test password=test dbname=test host=192.168.80.161 port=5433 sslmode=require sslcert=./memfiredb.crt sslkey=./memfiredb.key sslrootcert=./ca.crt")
	if err != nil {
		log.Fatal("数据库连接失败" + err.Error())
	}

	defer db.Close()
	rows, err := db.Query("SELECT * FROM table_name WHERE id = 1")
	if err != nil {
		log.Fatal(err.Error())
	}
	println(rows)
}
```

2、无加密连接  
• 在MemFire Cloud平台上完成注册操作，并创建数据库非证书认证dbname数据库  
创建源码文件main.go，文件内容如下:

```
**
Copyright (c) 2020, Nimblex Co .,Ltd.
Created on 2020-12-10 11:59
**/

package main

import (
	"context"
	"flag"
	"fmt"
	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
	"strings"
	"sync"
)

var (
	addr   = flag.String("addr", "192.168.80.161:5433", "memfire address to connect")
	user   = flag.String("user", "test", "memfire user")
	passwd = flag.String("passwd", "test", "memfire password")
	dbname = flag.String("db", "dbname", "memfire database name to connect")
)

func panicIf(err error) {
	if err != nil {
		panic(err)
	}
}

func test_transaction_try_again(db *pg.DB) {
	incrInTx := func(db *pg.DB) error {
		// Transaction is automatically rolled back on error.
		return db.RunInTransaction(db.Context(), func(tx *pg.Tx) error {
			var counter int
			_, err := tx.QueryOne(
				pg.Scan(&counter), `SELECT counter FROM counters FOR UPDATE`)
			if err != nil {
				return err
			}

			counter++

			_, err = tx.Exec(`UPDATE counters SET counter = ?`, counter)
			return err
		})
	}

	var wg sync.WaitGroup
	for i := 0; i < 10; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for {
				err := incrInTx(db)
				if err != nil {
					if strings.Contains(err.Error(), "40001") ||
						strings.Contains(err.Error(), "Try again") ||
						strings.Contains(err.Error(), "Restart read required") {
						fmt.Println("Try again")
						continue
					}
					panic(err)
				}
				break
			}

		}()
	}
	wg.Wait()
}

type Counter struct {
	Counter int64
}

type User struct {
	Id     int64
	Name   string
	Emails []string
}

// createSchema creates database schema for Counter/ User
func createSchema(db *pg.DB) error {
	models := []interface{}{
		(*Counter)(nil),
		(*User)(nil),
	}

	for _, model := range models {
		err := db.Model(model).CreateTable(&orm.CreateTableOptions{
			Temp:        false,
			IfNotExists: true,
		})
		if err != nil {
			return err
		}
	}
	return nil
}

func main() {
	flag.Parse()

	opt := pg.Options{
		Addr:     *addr,
		User:     *user,
		Password: *passwd,
		Database: *dbname,
		OnConnect: func(ctx context.Context, cn *pg.Conn) error {
			println("new connection created")
			return nil
		},
	}

	db := pg.Connect(&opt)
	defer db.Close()

	err := createSchema(db)
	panicIf(err)

	_, err = db.Exec("delete from counters")
	panicIf(err)

	cnt := &Counter{
		Counter: 1,
	}
	_, err = db.Model(cnt).Insert()
	panicIf(err)

	test_transaction_try_again(db)
}
```

3、编译执行   
`go run main.go`

---

[*navigate\_before* Java示例](/docs/db/example/java-example/)

[Spring示例 *navigate\_next*](/docs/db/example/spring-example/)