# Build e Deploy para Tizen

## Stack de Build

### Ferramentas
- **Vite 4.5.14** — bundler (downgrade de Vite 8 por compatibilidade)
- **@vitejs/plugin-react 4.x** — React plugin
- **@vitejs/plugin-legacy** — polyfills + transpilação para Chromium 56+
- **TypeScript 5.6.2** — type checking
- **Terser** — minificação

### Por Que Vite 4?

#### Problema com Vite 8
- Rolldown (novo bundler) gera código incompatível com Chromium 63
- Mesmo com `target: 'chrome56'`, código usa features modernas
- TV não consegue parsear o bundle

#### Solução
```bash
# Downgrade para Vite 4
npm install vite@4.5.14 @vitejs/plugin-react@4.3.4
```

## Configuração Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['chrome >= 56'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    }),
  ],
  base: './',
  build: {
    target: ['es2015', 'chrome56'],
    cssCodeSplit: false,
    minify: 'terser',
    terserOptions: {
      compress: { ecma: 2015 },
      output: { ecma: 2015 },
    },
  },
})
```

### Explicação

- **`base: './'`** — paths relativos (funciona em qualquer diretório)
- **`target: ['es2015', 'chrome56']`** — transpila para ES2015 (Tizen 4.0+)
- **`cssCodeSplit: false`** — CSS inline (menos requests HTTP)
- **`minify: 'terser'`** — minificação compatível com ES2015

## Plugin Legacy

### O Que Faz?

1. Gera **2 bundles**:
   - Moderno (`index-xxx.js`) — ES6+ para browsers novos
   - Legacy (`index-legacy-xxx.js`) — ES2015 + polyfills para browsers antigos

2. Injeta **script de detecção**:
```html
<script type="module">
  // Browser moderno carrega bundle moderno
  import './assets/index-xxx.js'
</script>
<script nomodule>
  // Browser antigo carrega bundle legacy
  document.write('<script src="./assets/index-legacy-xxx.js"><\/script>')
</script>
```

3. Adiciona **polyfills**:
   - `regenerator-runtime` — async/await
   - `core-js` — Object.entries, Array.flat, etc

### Resultado

```
dist/
├── index.html                          # 2.32 KB
├── assets/
│   ├── index-xxx.js                    # 314 KB (moderno)
│   ├── index-legacy-xxx.js             # 321 KB (legacy + polyfills)
│   └── polyfills-legacy-xxx.js         # 102 KB (polyfills separados)
```

## Tizen Studio

### Instalação

```bash
# Download Tizen Studio
wget https://download.tizen.org/sdk/Installer/tizen-studio_5.5/web-cli_Tizen_Studio_5.5_ubuntu-64.bin

# Instalar
chmod +x web-cli_Tizen_Studio_5.5_ubuntu-64.bin
./web-cli_Tizen_Studio_5.5_ubuntu-64.bin

# Adicionar ao PATH
export PATH=$PATH:~/tizen-studio/tools/ide/bin
export PATH=$PATH:~/tizen-studio/tools
```

### Certificado

```bash
# Criar certificado
tizen certificate \
  --alias zi01 \
  --name "ziiiTV" \
  --password "sua_senha" \
  --country BR \
  --state SP \
  --city "Sao Paulo" \
  --organization "ziiiTV" \
  --unit "Dev"

# Adicionar DUID da TV
tizen security-profiles add \
  --name zi01 \
  --author ~/tizen-studio-data/keystore/author/zi01.p12 \
  --password "sua_senha"

# Registrar DUID
tizen security-profiles set-active --name zi01
```

### Package

```bash
# Empacotar .wgt
cd dist
tizen package \
  --type wgt \
  --sign zi01 \
  --output . \
  -- .

# Resultado: ziiiTV.wgt
```

### Deploy

```bash
# Conectar TV
sdb connect 10.0.0.100:26101

# Verificar conexão
sdb devices

# Instalar
tizen install \
  --name ziiiTV.wgt \
  --target UN50RU7100GXZD

# Desinstalar (se necessário)
tizen uninstall \
  --package-id 2TDndgJZyN.ziiiTV \
  --target UN50RU7100GXZD
```

## Script de Deploy Automatizado

```bash
#!/bin/bash
# scripts/deploy/deploy.sh

set -e

echo "▶ Build Vite..."
npm run build

echo "▶ Copiando config.xml e icon para dist..."
cp public/config.xml dist/
cp public/icon.png dist/

echo "▶ Empacotando .wgt..."
cd dist
rm -f ziiiTV.wgt
~/tizen-studio/tools/ide/bin/tizen package \
  --type wgt \
  --sign zi01 \
  --output . \
  -- .

echo "▶ Conectando TV..."
~/tizen-studio/tools/sdb connect 10.0.0.100:26101

echo "▶ Instalando na TV..."
~/tizen-studio/tools/ide/bin/tizen install \
  --name ziiiTV.wgt \
  --target UN50RU7100GXZD

echo "✅ Deploy concluído!"
```

## config.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<widget xmlns="http://www.w3.org/ns/widgets" 
        xmlns:tizen="http://tizen.org/ns/widgets"
        id="http://yourdomain.org/ziiiTV" 
        version="2.0.0">
    <tizen:application id="2TDndgJZyN.ziiiTV" 
                       package="2TDndgJZyN" 
                       required_version="4.0"/>
    <content src="index.html"/>
    <feature name="http://tizen.org/feature/screen.size.normal.1080.1920"/>
    <icon src="icon.png"/>
    <name>ziiiTV</name>
    <tizen:profile name="tv"/>
    
    <!-- CSP permissivo para IPTV -->
    <tizen:content-security-policy>
        default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;
        script-src * 'unsafe-inline' 'unsafe-eval';
        style-src * 'unsafe-inline';
        img-src * data: blob:;
        media-src * blob:;
        connect-src *;
    </tizen:content-security-policy>
</widget>
```

## Troubleshooting

### Erro: "Unknown output options: minify"
- **Causa:** Vite 4 + Rollup não reconhece opção
- **Solução:** Ignorar (warning apenas, não afeta build)

### Erro: "PLAYER_ERROR_INVALID_STATE"
- **Causa:** AVPlay em estado inconsistente
- **Solução:** Sempre chamar `stop()` + `close()` antes de `open()`

### Erro: "Certificate not found"
- **Causa:** Certificado não registrado ou expirado
- **Solução:** Recriar certificado com `tizen certificate`

### Bundle não carrega na TV
- **Causa:** Código incompatível com Chromium 63
- **Solução:** Verificar `target: 'chrome56'` no vite.config.ts

## Referências

- [Vite Documentation](https://vitejs.dev/)
- [Tizen Studio CLI](https://developer.samsung.com/smarttv/develop/getting-started/using-sdk/tv-device.html)
- [Samsung Certificate Guide](https://developer.samsung.com/smarttv/develop/getting-started/setting-up-sdk/creating-certificates.html)
