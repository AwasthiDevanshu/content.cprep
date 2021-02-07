#!/bin/sh
current_time=$(date "+%Y.%m.%d-%H.%M.%S")
echo "Current Time : $current_time"
npm run build
rm -rf pushed-build/*
cp -rf dist/* pushed-build/
cd pushed-build
git add *
git commit -m "$current_time"
git push origin master 
sshpass -p MacBook1# ssh devanshu@161.97.79.118 /bin/bash << EOF
pwd
cd /var/www/html/admin2.cprep.in/
git pull origin master
EOF
