#!/bin/sh
# wait-for-db.sh

set -e
  
echo "waiting db"
shift
mysql_user=root
mysql_pass=userpass
target_db=smart_home

until  { "`mysql -u${mysql_user} -p${mysql_pass} -e 'show databases;' | grep ${target_db}`" == "${target_db}" }; do
  >&2 echo "db is unavailable - sleeping"
  sleep 1
done
  
>&2 echo "db is up - executing command"
exec "$@"