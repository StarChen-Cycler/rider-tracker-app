# Java示例 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/db/example/java-example/
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

# Java示例

MemFire Cloud 提供Python、Java、spring、golang、nodejs、小程序开发示例，讲述如何编译执行程序，帮助用户如何采用多种语言来使用连接MemFire Cloud的云数据库。

**示例下载地址**  
Java示例下载地址：https://gitee.com/memfiredb/memfiredb-example-java

**环境描述**  
• Java Development Kit (JDK) 1.8, or later  
• Apache Maven 3.3 or later

**创建示例应用**  
1、创建POM

```
<?xml version="1.0"?>
<project
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd"
  xmlns="http://maven.apache.org/POM/4.0.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <modelVersion>4.0.0</modelVersion>

  <groupId>cn.nimblex.apps</groupId>
  <artifactId>mfsample</artifactId>
  <version>1.0</version>
  <packaging>jar</packaging>

  <dependencies>
    <dependency>
      <groupId>org.postgresql</groupId>
      <artifactId>postgresql</artifactId>
      <version>42.2.5</version>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <version>3.7.0</version>
        <configuration>
          <source>1.8</source>
          <target>1.8</target>
        </configuration>
      </plugin>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-dependency-plugin</artifactId>
        <version>2.1</version>
        <executions>
          <execution>
            <id>copy-dependencies</id>
            <phase>prepare-package</phase>
            <goals>
              <goal>copy-dependencies</goal>
            </goals>
            <configuration>
              <outputDirectory>${project.build.directory}/lib</outputDirectory>
              <overWriteReleases>true</overWriteReleases>
              <overWriteSnapshots>true</overWriteSnapshots>
              <overWriteIfNewer>true</overWriteIfNewer>
            </configuration>
          </execution>
        </executions>
      </plugin>
    </plugins>
  </build>
</project>
```

**执行如下命令，创建目录**  
`mkdir -p src/main/java/com/memfire/sample/apps`

2、加密连接   
• 在MemFire Cloud平台上完成注册操作，并创建证书认证的数据库test   
• 点击数据库test的连接信息，下载jdbc访问证书，需要包括memfiredb.crt memfiredb.key root.crt，并拷贝到运行java程序的环境下；

（1）编辑源码文件MFSSLSample.java：`src/main/java/com/memfire/sample/apps/MFSSLSample.java`

```
package com.memfire.sample.apps;
import java.util.Properties;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

class SSLCandidate extends Thread {

    private String _name;
    private Connection connection = null;
    public static String _host = "101.132.186.106:5433";
    public static String _dbname = "d0000001ccbdf7df0ba54c6990b881d9cert_test";
    public static String _dbuser = "cert_test";
    public static String _dbpassword = "test_123";
    SSLCandidate(String name) {
        _name = name;
    }

    public void say() {
        //System.out.println(_name + " say: I am president");
        int wait = 0;
        while (true) {
            try {
            if (wait != 0) {
                Thread.sleep(wait);
            }
            wait = 0;
            String insertStmt = "UPDATE president set name='" + _name +
                                                "' WHERE term=" + 46;
            connection.createStatement().executeUpdate(insertStmt);
            System.out.println(_name + " say: I am president");
            } catch (Exception e) {
                System.err.println("say Error: " + e.getMessage());
                if (e.getMessage().contains("Restart read required") ||
                        e.getMessage().contains("40001") ||
                        e.getMessage().contains("Try again")) {
                    System.err.println("retry soon");
                    wait = 1000;
                    continue;
                }
            }
            break;
        }
    }
    public void run() {
        try {
            String url = "jdbc:postgresql://" + _host + "/" + _dbname;
            Properties properties = new Properties();
            properties.setProperty("user", _dbuser);
            properties.setProperty("password", _dbpassword);
            properties.setProperty("ssl", "true");
            properties.setProperty("sslrootcert", "/root/.memfiredb/root.crt");
            properties.setProperty("sslkey", "/root/.memfiredb/memfiredb.key");
            properties.setProperty("sslcert", "/root/.memfiredb/memfiredb.crt");
            properties.setProperty("sslmode", "verify-ca");

            connection = DriverManager.getConnection(
                 url,properties );

            int i = 0;
            while(i < 1000) {
                say();
                Thread.sleep(1000);
            }

            connection.close();

        } catch (Exception e) {
            System.err.println("run Error: " + e.getMessage());
        }
    }
}

public class MFSSLSample {
  public static void main(String[] args) {
    try {
      // Create the DB connection
      Class.forName("org.postgresql.Driver");
      Connection connection = null;
      String url = "jdbc:postgresql://" + SSLCandidate._host + "/" + SSLCandidate._dbname;
      Properties properties = new Properties();
      properties.setProperty("user", SSLCandidate._dbuser);
      properties.setProperty("password", SSLCandidate._dbpassword);
      properties.setProperty("ssl", "true");
      properties.setProperty("sslrootcert", "/root/.memfiredb/root.crt");
      properties.setProperty("sslkey", "/root/.memfiredb/memfiredb.key");
      properties.setProperty("sslcert", "/root/.memfiredb/memfiredb.crt");
      properties.setProperty("sslmode", "verify-ca");

      System.out.println("url:" + url );
      connection = DriverManager.getConnection(
                 url,properties);

      // Create table 'president'
      String createStmt = "CREATE TABLE IF NOT EXISTS president (name varchar, " +
                                                 "term int);";
      connection.createStatement().execute(createStmt);

      // Insert a row.
      String insertStmt = "INSERT INTO president (name, term)" +
                                                " VALUES ('Joseph Robinette Biden', 46);";
      connection.createStatement().executeUpdate(insertStmt);

      // Close the client.
      connection.close();
    } catch (Exception e) {
        System.err.println("main Error: " + e.getMessage());
    }

    SSLCandidate p1 = new SSLCandidate("Joseph Robinette Biden");
    SSLCandidate p2 = new SSLCandidate("Robert Trump");
    p1.start();
    p2.start();
  }
}
```

3、无加密连接  
• 在MemFire Cloud平台上完成注册操作，并创建数据库非证书认证pass\_test数据库  
编辑源码文件MFSample.java：`src/main/java/com/memfire/sample/apps/MFSample.java`

```
package com.memfire.sample.apps;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

class Candidate extends Thread {

    private String _name;
    private Connection connection = null;
    public static String _host = "101.132.254.29:5433";
    public static String _dbname = "d0000001ccbdf7df0ba54c6990b881d9pass_test";
    public static String _dbuser = "pass_test";
    public static String _dbpassword = "test_123";
    Candidate(String name) {
        _name = name;
    }

    public void say() {
        System.out.println(_name + " say: I am president");
        int wait = 100;
        while (true) {
            try {
            Thread.sleep(wait);
            wait = 100;
            String insertStmt = "UPDATE president set name='" + _name +
                                                "' WHERE term=" + 46;
            connection.createStatement().executeUpdate(insertStmt);
            } catch (Exception e) {
                System.err.println("Error: " + e.getMessage());
                if (e.getMessage().contains("Restart read required") ||
                        e.getMessage().contains("40001") ||
                        e.getMessage().contains("Try again")) {
                    System.err.println("retry soon");
                    wait = 1000;
                    continue;
                }
            }
            break;
        }
    }
    public void run() {
        try {
            connection = DriverManager.getConnection(
                 "jdbc:postgresql://"+ _host + "/" + _dbname ,_dbuser, _dbpassword);

            int i = 0;
            while(i < 1000) {
                say();
                Thread.sleep(100);
            }

            connection.close();

        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
}

public class MFSample {
  public static void main(String[] args) {
    try {
      // Create the DB connection
      Class.forName("org.postgresql.Driver");
      Connection connection = null;
      connection = DriverManager.getConnection(
                 "jdbc:postgresql://"+ Candidate._host + "/" + Candidate._dbname ,Candidate._dbuser, Candidate._dbpassword);

      // Create table 'president'
      String createStmt = "CREATE TABLE IF NOT EXISTS president (name varchar, " +
                                                 "term int);";
      connection.createStatement().execute(createStmt);

      // Insert a row.
      String insertStmt = "INSERT INTO president (name, term)" +
                                                " VALUES ('Joseph Robinette Biden', 46);";
      connection.createStatement().executeUpdate(insertStmt);

      // Close the client.
      connection.close();
    } catch (Exception e) {
        System.err.println("Error: " + e.getMessage());
    }

    Candidate p1 = new Candidate("Joseph Robinette Biden");
    Candidate p2 = new Candidate("Robert Trump");
    p1.start();
    p2.start();
  }
}
```

4、编译操作  
`mvn package`

5、执行  
加密连接执行操作：  
`java -cp postgresql-42.2.18.jar:target/mfsample-1.0.jar com.memfire.sample.apps.MFSSLSample`

无加密连接执行操作：  
`java -cp postgresql-42.2.18.jar:target/mfsample-1.0.jar com.memfire.sample.apps.MFSample`

---

[*navigate\_before* Python3示例](/docs/db/example/python3-example/)

[Golang示例 *navigate\_next*](/docs/db/example/golang-example/)