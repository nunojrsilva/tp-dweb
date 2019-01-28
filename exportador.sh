mongoexport --db tp-web --collection users --out users.json
mongoexport --db tp-web --collection pubs --out pubs.json
mkdir dados
mv users.json dados
mv pubs.json dados
cp -r uploaded dados
tar -zcvf dados.tar.gz dados