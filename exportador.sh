mongoexport --db tp-web --collection users --out users.json --jsonArray
mongoexport --db tp-web --collection pubs --out pubs.json --jsonArray
mkdir dados
mv users.json dados
mv pubs.json dados
cp -r uploaded dados
tar -zcf dados.tar.gz dados
rm -r dados