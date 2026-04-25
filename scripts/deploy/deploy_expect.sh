#!/usr/bin/expect -f
set timeout -1
spawn /home/carneiro888/tizen-studio/tools/ide/bin/tizen package -t wgt -s ziii01 -o . -- .
expect "Author password:"
send "2801Z1k*\r"
expect "Save author password"
send "Y\r"
expect "Distributor1 password:"
send "2801Z1k*\r"
expect "Save distributor1 password"
send "Y\r"
expect eof
