# Changelog - Video Preview nos Cards (21/04/2026)

## 🎯 OBJETIVO
Implementar preview de vídeo **dentro do card** (estilo Netflix) que toca instantaneamente quando o card é focado, com som e começando em 4 minutos.

---

## ✅ IMPLEMENTAÇÕES

### 1. **Video Preview no Card Focado**
**Arquivo:** `src/screens/HomeScreen/HomeScreen.tsx` (linha ~824)

**O que foi feito:**
- Adicionado elemento `<video>` que renderiza **somente quando card está focado**
- Configurado para tocar automaticamente com som
- Posicionado com `zIndex: 5` (acima do backdrop e poster)
- Usa `#t=240` na URL para começar em 4 minutos (240 segundos)

**Código:**
```tsx
{/* Video preview — toca quando focado */}
{isFocused && ch.activeStream?.url && (
  <video
    src={`${ch.activeStream.url}#t=240`}
    autoPlay
    loop
    playsInline
    style={{
      position: 'absolute', left: 0, top: 0,
      width: WIDE_W, height: CARD_H, objectFit: 'cover',
      zIndex: 5, display: 'block',
    }}
  />
)}
```

**Comportamento:**
- **Card desfocado:** mostra poster (portrait)
- **Card focado:** 
  - Expande para wide
  - Poster some (`visibility: hidden`)
  - Backdrop aparece (zIndex 1)
  - **Vídeo toca por cima** (zIndex 5) com som, começando em 4min
- **Troca de card:** React desmonta o `<video>` anterior automaticamente (para instantaneamente)

---

### 2. **Desabilitado Hero Banner Preview**
**Arquivo:** `src/components/HeroBanner/HeroBanner.tsx` (linha ~60)

**O que foi feito:**
- Desativado `useStreamPreview` do Hero Banner para eliminar "piscada" na home
- Hero agora mostra apenas imagens estáticas (sem AVPlay)

**Código:**
```tsx
// Hero autoplay: DESABILITADO temporariamente para evitar piscada
const heroAutoplayActive = false;

const { videoStyle, backdropStyle, activePlayerId } = useStreamPreview(
  null, // activeChannel desabilitado
  null, // nextSlideValid desabilitado
  false, // preview desabilitado
  {
    idleDelay: 800,
    fadeDuration: 350,
    // ...
  }
);
```

**Motivo:** O AVPlay do Hero estava causando re-renders e "piscadas" na tela quando a home já estava carregada.

---

## 🔧 DETALHES TÉCNICOS

### **Por que `#t=240` em vez de `currentTime`?**
- `#t=240` é um **fragmento de URL** que instrui o navegador a pedir o stream já a partir de 4 minutos
- **Mais rápido:** não precisa baixar os primeiros 4 minutos
- **Instantâneo:** o seek acontece no servidor, não no cliente

### **Gerenciamento de Memória**
- React desmonta o `<video>` automaticamente quando `isFocused = false`
- Navegador para o download e libera recursos
- Sem memory leaks ou vídeos rodando em background

### **Autoplay com Som**
- Removido atributo `muted`
- Tizen 4.0+ permite autoplay com som (não tem restrição de navegador web)
- Se houver problema, o navegador bloqueia e o vídeo não toca (fallback para backdrop)

---

## 📁 ARQUIVOS MODIFICADOS

1. **`src/screens/HomeScreen/HomeScreen.tsx`**
   - Adicionado `<video>` condicional no card focado (linha ~824)
   - Removido refs de autoplay timer (não eram mais necessários)

2. **`src/components/HeroBanner/HeroBanner.tsx`**
   - Desabilitado `useStreamPreview` (linha ~60)
   - Hero agora só mostra imagens estáticas

---

## 🎬 RESULTADO FINAL

### **Antes:**
- Card focado: só expandia e mostrava backdrop
- Usuário precisava apertar Enter para ver o vídeo
- Hero Banner causava piscadas na home

### **Depois:**
- Card focado: vídeo toca **instantaneamente** com som, começando em 4min
- Troca de card: vídeo anterior para, novo começa (gestão automática)
- Hero Banner: sem piscadas, apenas imagens estáticas
- Performance: sem memory leaks, React gerencia lifecycle

---

## 🚀 DEPLOY

```bash
npm run build
bash deploy.sh
```

**Build:** 14.13s  
**Bundle:** 290.91 kB (legacy) + 285.24 kB (modern)  
**Deploy:** Sucesso na TV 10.0.0.101:26101

---

## 📝 PRÓXIMOS PASSOS (SUGESTÕES)

1. **Ajustar tempo de início:** Se 4min não for ideal, mudar `#t=240` para outro valor
2. **Volume inicial:** Adicionar controle de volume (começar baixo, aumentar gradualmente)
3. **Fallback para streams sem seek:** Alguns streams não suportam `#t=`, adicionar fallback
4. **Loading state:** Mostrar spinner enquanto vídeo carrega (se demorar)
5. **Reabilitar Hero Preview:** Investigar causa da piscada e reativar com fix
