#!/bin/bash
set -e

TIZEN=~/tizen-studio/tools/ide/bin/tizen
SDB=~/tizen-studio/tools/sdb
TV=UN50RU7100GXZD
CERT=IptvFinal

echo "▶ Build Vite..."
npm run build

echo "▶ Copiando config.xml e icon para dist..."
cp public/config.xml dist/config.xml
cp public/icon.png dist/icon.png
# Shaka Player é copiado automaticamente de public/ pelo Vite,
# mas confirmamos a existência por segurança
[ -f dist/shaka-player.js ] || cp public/shaka-player.js dist/shaka-player.js

echo "▶ Empacotando .wgt..."
cd dist
rm -f ziiiTV.wgt
$TIZEN package -t wgt -s $CERT -o . -- .

echo "▶ Conectando TV..."
$SDB connect 10.0.0.101:26101

echo "▶ Instalando na TV..."
$TIZEN install -n ziiiTV.wgt -t $TV

echo "✅ Deploy concluído!"
