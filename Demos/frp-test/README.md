https://www.jianshu.com/p/00c79df1aaf0
https://blog.csdn.net/u013144287/article/details/78589643/

- 下载
```
// linux
curl -OL https://github.com/fatedier/frp/releases/download/v0.15.1/frp_0.15.1_linux_amd64.tar.gz

// mac
curl -OL https://github.com/fatedier/frp/releases/download/v0.15.1/frp_0.15.1_darwin_amd64.tar.gz
```

- 安装
```
// 解压
tar xzvf frp_0.15.1_darwin_amd64.tar.gz
```


- 配置服务端(公网)
```
// cd 到解压好的目录
vim ./frps.ini

[common]
bind_port = 5051  #与客户端绑定的进行通信的端口
vhost_http_port = 5050 #访问客户端web服务自定义的端口号


./frps -c ./frps.ini

```

- 配置客户端(私网)
```
// cd 到解压好的目录
vim ./frpc.ini

[common]
server_addr = 134.175.142.42  #服务端ip地址
server_port = 5051 #与服务端中的bind_port一致

[web]
type = http
local_ip = 127.0.0.1
local_port = 5050 #内网web服务的端口号
custom_domains = www.zhangyucheng1207.cn #所绑定的公网服务器域名，一级、二级域名都可以

./frpc -c ./frpc.ini

```


例2
```
// 服务端
vim ./frps.ini

[common]
bind_port = 8080
vhost_http_port = 80

./frps -c ./frps.ini


// 客户端

vim ./frpc.ini

[common]
server_addr = 134.175.142.42
server_port = 8080

[web]
type = http
local_ip = 127.0.0.1
local_port = 3000
custom_domains = www.zhangyucheng1207.cn

./frpc -c ./frpc.ini

```



可以使用screen后台运行
```
==========screen============
screen -S  name 创建screen
screen -ls
screen -r   name   回到screen
Ctrl+A+D   分离screen
```