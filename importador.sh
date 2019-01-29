tar xvzf dados.tar.gz
cd dados
mongoimport -h localhost:27017 -d tp-web -c users --file users.json --jsonArray
mongoimport -h localhost:27017 -d tp-web -c pubs --file pubs.json --jsonArray
mv uploaded ../