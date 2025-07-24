root@iZj6chpfmwmvtoixyrokvzZ:~# history
    1  uptime
    2  htop
    3  free -h
    4  df -h
    5  ps aux
    6  ss -tulnp
    7  lsb_release -a
    8  hostname
    9  ip addr
   10  cat /etc/resolv.conf
   11  lscpu
   12  lsblk
   13  systemctl status sshd
   14  wget https://github.com/fatedier/frp/releases/download/v0.62.0/frp_0.62.0_linux_amd64.tar.gz
   15  ls
   16  tar -xzf frp_0.62.0_linux_amd64.tar.gz
   17  cd frp_0.62.0_linux_amd64
   18  ls
   19  nano frps.toml
   20  cd frp_0.62.0_linux_amd64
   21  nano frps.toml
   22  /root/frp_0.62.0_linux_amd64/frps -c /root/frp_0.62.0_linux_amd64/frps.toml
   23  systemctl start frps
   24  q
   25  systemctl start frps
   26  apt update
   27  apt install -y nginx certbot python3-certbot-nginx
   28  nano /etc/nginx/sites-available/frp-proxy
   29  ln -s /etc/nginx/sites-available/frp-proxy /etc/nginx/sites-enabled/
   30  nginx -t
   31  systemctl reload nginx
   32  openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt
   33  nano /etc/nginx/sites-available/frp-proxy
   34  nginx -t
   35  systemctl reload nginx
   36  systemctl status nginx
   37  nginx -t
   38  systemctl stop nginx
   39  nginx -t
   40  systemctl reload nginx
   41  systemctl start nginx
   42  systemctl reload nginx
   43  nginx -t
   44  systemctl reload nginx
   45  nano /etc/nginx/sites-available/frp-proxy
   46  cd frp_0.62.0_linux_amd64
   47  systemctl status frps
   48  \
   49  echo 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDYlHY6ULXnchK2k1xez0GvI6W9hqFQiwyNXRxXBd1/sjShZrmnkYUUqPm29mOrNDTiKvsGZfOVJ91bnR4NqgycpM1skHXSdBChsIy8dlmQT2/6wO7Y538cj4vzP/eeisXa3ygLieVsbatbo1/opvvNOZgdopO8dowgoJA4ovkx0WyAFtYBmqZQN6WufpxESQLf6hb4It0UEkEDvjF8KkyRYZwwclPyho41/apjZmBkCMNQ82ahiwVc+nBswq0H+S3PkBS2ZqAq/udbm4lXddllUqUlzJtHYKrSRYSDVJTf8naMsjdeyYmlA+VgxqvEQb1c8CynSr80lVpsfN4fzkft' >> ~/.ssh/authorized_keys
   50  . "\root\.cursor-server\cli\servers\Stable-0781e811de386a0c5bcb07ceb259df8ff8246a50\server\out\vs\workbench\contrib\terminal\common\scripts\shellIntegration-bash.sh"
   51  nginx -t
   52  ls -la /etc/nginx/sites-enabled/
   53  cat /etc/nginx/sites-available/frp-proxy
   54  nginx -t
   55  systemctl restart nginx
   56  systemctl status nginx
   57  sudo systemctl restart frps
   58  sudo systemctl status frps
   59  sudo systemctl restart frps
   60  sudo systemctl status frps
   61  sudo systemctl restart frps
   62  sudo systemctl status frps
   63  sudo systemctl status nginx
   64  systemctl restart nginx
   65  cd frp_0.62.0_linux_amd64
   66  sudo systemctl restart frps
   67  sudo systemctl status frps
   68  sudo systemctl restart frps
   69  sudo systemctl restart nginx
   70  sudo systemctl status frps
   71  sudo systemctl restart frps
   72  sudo systemctl status frps
   73  sudo systemctl restart frps
   74  sudo systemctl status frps
   75  sudo systemctl status nginx
   76  sudo systemctl restart frps
   77  sudo systemctl status frps
   78  sudo systemctl restart frps
   79  sudo systemctl restart nginx
   80  sudo systemctl status nginx
   81  sudo systemctl restart nginx
   82  . "\root\.cursor-server\cli\servers\Stable-0781e811de386a0c5bcb07ceb259df8ff8246a50\server\out\vs\workbench\contrib\terminal\common\scripts\shellIntegration-bash.sh"
   83  ls -la ~/frp_0.62.0_linux_amd64/
   84  cat ~/frp_0.62.0_linux_amd64/frps.toml
   85  cat ~/frp_0.62.0_linux_amd64/frpc.toml
   86  ps aux | grep frps
   87  netstat -tulpn | grep 7000
   88  ufw status
   89  pkill frps && cd ~/frp_0.62.0_linux_amd64/ && ./frps -c frps.toml > /dev/null 2>&1 &
   90  sudo systemctl status nginx
   91  sudo systemctl status frps
   92  systemctl status frps
   93  sudo systemctl restart frps
   94  systemctl daemon-reload
   95  systemctl enable frps
   96  systemctl status frps
   97  tar -xzf frp_0.62.0_linux_amd64.tar.gz
   98  systemctl daemon-reload
   99  systemctl enable frps
  100  systemctl restart frps
  101  systemctl status frps
  102  wget https://github.com/fatedier/frp/releases/download/v0.62.0/frp_0.62.1_linux_amd64.tar.gz
  103  wget https://github.com/fatedier/frp/releases/download/v0.62.1/frp_0.62.1_linux_amd64.tar.gz
  104  tar -xzf frp_0.62.1_linux_amd64.tar
  105  tar -xzf frp_0.62.1_linux_amd64.tar.gz
  106  systemctl restart frps
  107  systemctl status frps
  108  systemctl restart nginx
  109  systemctl status nginx
  110  nginx -t
  111  systemctl restart nginx
  112  systemctl status nginx
  113  systemctl restart nginx
  114  nginx -t
  115  systemctl restart nginx
  116  netstat -tulpn | grep 7000
  117  pkill frps && cd ~/frp_0.62.0_linux_amd64/ && ./frps -c frps.toml > /dev/null 2>&1 &
  118  netstat -tulpn | grep 7000
  119  nginx -t
  120  systemctl restart nginx
  121  systemctl status nginx
  122  systemctl restart frps
  123  systemctl status frps
  124  systemctl restart frps
  125  systemctl status frps
  126  lsof -i :7500
  127  systemctl status frps
  128  ./frps -c frps.toml
  129  cd frp
  130  cd frp_0.62.
  131  cd frp_0.62.1_linux_amd64
  132  ./frps -c frps.toml
  133  systemctl stop frps
  134  ./frps -c frps.toml
  135  systemctl start frps
  136  systemctl status frps
  137  lsof -i :7500
  138  systemctl start frps
  139  systemctl status frps
  140  systemctl start frps
  141  systemctl status frps
  142  systemctl daemon-reload
  143  systemctl status frps
  144  systemctl start frps
  145  systemctl status frps
  146  systemctl status nginx
  147  q
  148  systemctl status nginx
  149  q
  150  systemctl restart nginx
  151  systemctl status nginx
  152  systemctl status frps
  153  nginx -t
  154  lsof -i :7500
  155  systemctl start frps
  156  systemctl status frps
  157  systemctl restart nginx
  158  /etc/nginx/sites-available/frp-proxy
  159  . "\root\.cursor-server\cli\servers\Stable-0781e811de386a0c5bcb07ceb259df8ff8246a50\server\out\vs\workbench\contrib\terminal\common\scripts\shellIntegration-bash.sh"
  160  journalctl -u frps.service --no-pager -n 20
  161  lsof -i :7500
  162  kill -9 324606
  163  ls -la ~/frp_0.62*
  164  cat /etc/systemd/system/frps.service
  165  sudo nginx -t
  166  sudo systemctl reload nginx
  167  curl -I https://47.239.138.185
  168  sudo nginx -t
  169  sudo systemctl reload nginx
  170  systemctl restart nginx
  171  sudo nginx -t
  172  systemctl restart nginx
  173  sudo systemctl reload nginx
  174  systemctl restart nginx
  175  sudo ln -s /etc/nginx/sites-available/frp-proxy /etc/nginx/sites-enabled/frp-proxy
  176  sudo nginx -t
  177  sudo systemctl restart nginx
  178  systemctl status nginx.service
  179  sudo systemctl restart nginx
  180  sudo nginx -t
  181  sudo systemctl restart nginx
  182  sudo nginx -t
  183  sudo systemctl restart nginx
  184  systemctl status nginx.service
  185  sudo systemctl restart nginx
  186  sudo nginx -t
  187  sudo systemctl restart nginx
  188  systemctl restart nginx
  189  sudo nginx -t
  190  . "\root\.cursor-server\cli\servers\Stable-0781e811de386a0c5bcb07ceb259df8ff8246a50\server\out\vs\workbench\contrib\terminal\common\scripts\shellIntegration-bash.sh"
  191  nginx -t
  192  systemctl restart nginx
  193  . "\root\.cursor-server\cli\servers\Stable-0781e811de386a0c5bcb07ceb259df8ff8246a50\server\out\vs\workbench\contrib\terminal\common\scripts\shellIntegration-bash.sh"
  194  nginx -t
  195  systemctl restart nginx
  196  nginx -t
  197  systemctl restart nginx
  198  tar -zxvf frp_0.63.0_linux_amd64.tar.gz
  199  wget https://github.com/fatedier/frp/releases/download/v0.63.0/frp_0.63.0_linux_amd64.tar.gz
  200  tar -zxvf frp_0.63.0_linux_amd64.tar.gz
  201  nohup ./frps -c ./frps.toml &
  202  tail -f nohup.out
  203  ps -ef | grep frps | grep -v grep
  204  history