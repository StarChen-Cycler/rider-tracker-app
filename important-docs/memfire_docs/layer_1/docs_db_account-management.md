# 账号管理 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/db/account-management/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

创建账号

# 账号管理

MemFire Cloud用户可以根据需要自助的进行账号管理，包括创建账号、删除账号、重置账号密码等功能，便于管理与维护。

## 创建账号 [*link*](#%e5%88%9b%e5%bb%ba%e8%b4%a6%e5%8f%b7)

1. 用户登录MemFire Cloud后，进入左侧导航栏账号管理页面；
2. 单击“创建账号”按钮，弹出“创建账号弹框；

![图片名称](../_media/createaccount.png)

3. 设置参数如下：

   * 由小写字母、大写字母、数字、下划线组成，以字母开头，以字母或数字结尾，最多16个字符，且不能以pg开头;
   * 小写字母、大写字母、数字、特殊字符占三种，长度为8－32位；特殊字符为! @ # $ % ^ & \* () \_ + - = ;
4. 单击“确定”按钮，完成账号创建操作，可以在账号列表中查看新建的账号信息；

## 删除账号 [*link*](#%e5%88%a0%e9%99%a4%e8%b4%a6%e5%8f%b7)

### 前置条件 [*link*](#%e5%89%8d%e7%bd%ae%e6%9d%a1%e4%bb%b6)

删除账号的前提条件：

* 当且仅当该数据库账号名下无绑定的数据库资源后，才能删除该账号；
* 数据库账号名下的资源包括，①平台中存在其名下的数据库资源，②名下有备份的数据库资源；

### 操作步骤 [*link*](#%e6%93%8d%e4%bd%9c%e6%ad%a5%e9%aa%a4)

1. 用户登录MemFire Cloud后，进入账号管理页面；
2. 选中要删除账号列表中所在行，单击“删除”按钮，弹出“删除账号”弹框；

3. 单击“确定”按钮，完成账号的删除操作；

## 重置账号密码 [*link*](#%e9%87%8d%e7%bd%ae%e8%b4%a6%e5%8f%b7%e5%af%86%e7%a0%81)

1. 用户登录MemFire Cloud后，进入账号管理页面；
2. 选中要删除账号列表中所在行，单击“重置密码”按钮，弹出“重置密码”弹框；
3. 在输入框内输入新的账号密码，并进行二次确认；
   * 密码必须是小写字母、大写字母、数字、特殊字符占三种，长度为8－32位；特殊字符为! @ # $ % ^ & \* () \_ + - =；
   * 说明：两次输入密码必须一致;
4. 单击“确定”按钮，完成账号的密码重置操作；

---

[*navigate\_before* 数据库管理](/docs/db/database-management/)

[备份恢复 *navigate\_next*](/docs/db/backup-and-recovery/)