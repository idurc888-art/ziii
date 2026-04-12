#!/bin/bash
set -e

TIZEN=~/tizen-studio/tools/ide/bin/tizen
SDB=~/tizen-studio/tools/sdb
TV=UN50RU7100GXZD
CERT=IptvFinal

echo "▶ Construindo Tizen Vanilla (Pulo do Vite)..."
cp testes-tv/test-12-player-moderno.html dist/index.html

echo "▶ Copiando config.xml e icon para dist..."
cp public/config.xml dist/config.xml
cp public/icon.png dist/icon.png

echo "▶ Empacotando .wgt..."
cd dist
rm -f ziiiTV.wgt
$TIZEN package -t wgt -s $CERT -o . -- .

echo "▶ Conectando TV..."
$SDB connect 10.0.0.100:26101

echo "▶ Instalando na TV..."
$TIZEN install -n ziiiTV.wgt -t $TV

echo "✅ Deploy concluído!"
