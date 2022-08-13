#!/usr/bin/env bash
set -Eeuo pipefail
trap "echo '❌ Error'" ERR

thisPath="$(pwd)"
# projectName="$(basename "$thisPath")"
cd $thisPath;
ls -lahF;

echoStep () {
  echo "🔸 $1"
}

echoStep "Preparing..."

docker network create alwatr-private-network || echo "network exist"

[ ! -d _data ] && mkdir _data

docker-compose pull
# docker-compose build --pull

echoStep "Starting..."

docker-compose stop
mysqlPath=/var/lib/mysql
docker-compose run --rm --name 'fix-db' --user=root database \
  bash -c "ls -lahF $mysqlPath; chown -Rv mysql:mysql $mysqlPath; ls -lahF $mysqlPath;"

docker-compose up --detach --remove-orphans # --force-recreate

echoStep "Done"

docker-compose logs --tail=300 --follow || true