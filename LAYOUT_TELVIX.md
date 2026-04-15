# Layout Telvix — Especificação Precisa

Fonte: análise completa do código-fonte Svelte legacy
(`LEGACY_SVELTE_TELVIX/src/routes/+page.svelte` + `src/app.css`)

---

## Estrutura Geral

```
┌──────────────────────────────────────────────────────────┐
│  SIDEBAR (70px)  │  VIEWPORT (flex: 1)                   │
│                  │  ┌─────────────────────────────────┐  │
│  z. (logo)       │  │ TOPBAR (72px, sticky, z:90)     │  │
│                  │  │ hidden quando focusZone=content  │  │
│  [home]          │  ├─────────────────────────────────┤  │
│  [browse]        │  │ HERO (44vh default)              │  │
│  [trending]      │  │   focused → 70vh                 │  │
│  [live]          │  │   collapsed → 50vh               │  │
│  [alien]         │  │   locked (row>0) → 50vh          │  │
│  [heart]         │  ├─────────────────────────────────┤  │
│                  │  │ ROWS SLIDER (translateY animado) │  │
│  [settings]      │  │   carousel-section × N           │  │
│  [avatar]        │  │                                  │  │
│                  │  └─────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## 1. CSS Variables

```css
--bg: #000000
--accent: #ff006e
--accent-glow: rgba(255, 0, 110, 0.4)
--surface: #0f0f0f
--surface-hover: #1a1a1a
--text: #ffffff
--text-muted: #a0a0a0
--sidebar-width: 70px
```

## 2. Fontes

```css
font-family: 'Outfit', sans-serif  /* principal */
font-family: 'Barlow Condensed', sans-serif  /* títulos de card */
```

---

## 3. Sidebar

```css
width: 70px
height: 100vh
background: #000
flex-direction: column
align-items: center
padding: 30px 0
border-right: 1px solid rgba(255,255,255,0.05)
z-index: 100
opacity: 0.3  /* inativo */
transition: opacity 300ms
```

**Ativo** (`focusZone === 'sidebar'`):
```css
opacity: 1
pointer-events: all
```

**Logo:**
```css
font-weight: 900
font-size: 24px
color: var(--accent)
margin-bottom: 60px
```
Texto: `z.`

**Ícones (sidebar-icon-btn):**
```css
width: 40px
height: 40px
color: var(--text-muted)
background: transparent
border: none
font-size: 1.2rem
```

**Ícone ativo** — barra rosa à esquerda:
```css
::before {
  position: absolute
  left: -20px
  width: 4px
  height: 20px
  background: var(--accent)
  border-radius: 0 4px 4px 0
  box-shadow: 0 0 15px var(--accent-glow)
}
```

**Links da sidebar:**
```
home     → mdi:home
browse   → mdi:view-grid
trending → mdi:trending-up
live     → mdi:television-play
alien    → mdi:alien
heart    → mdi:heart-outline
```

**Bottom:**
- `mdi:cog-outline` (settings)
- Avatar 32×32px circular

---

## 4. Topbar

```css
height: 72px
position: sticky, top: 0
z-index: 90
padding: 0 80px
background: rgba(0,0,0,0.1)
backdrop-filter: blur(12px)
border-bottom: 1px solid rgba(255,255,255,0.04)
transition: opacity 400ms, transform 400ms
```

**Oculta** quando `focusZone === 'content'`:
```css
opacity: 0
pointer-events: none
transform: translateY(-100%)
```

**Brand:**
```css
font-size: 0.85rem
font-weight: 900
letter-spacing: 1px
text-transform: lowercase
margin-right: 40px
```
Texto: `o melhor · ziiiTV!` (ziiiTV em `--accent`)

**Links:**
```css
font-size: 1.66rem
font-weight: 700
text-transform: lowercase
color: rgba(255,255,255,0.35)
padding: 6px 14px
border-radius: 20px
```

**Link ativo:**
```css
color: #fff
background: rgba(255,0,110,0.12)
```

**Links disponíveis:**
```
pagina principal | filmes | séries | esportes | tv ao vivo | youtube
```

---

## 5. Hero

```css
position: relative
width: 100%
height: 44vh  /* default */
display: flex
flex-direction: column
justify-content: center
padding: 0 80px
overflow: hidden
transition: height 400ms ease
```

**Estados de altura:**
```
default   → 44vh
focused   → 70vh
collapsed → 50vh
locked    → 50vh (quando contentRow > 0)
```

**Background:**
```css
/* overlay duplo */
background:
  linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 35%, transparent 65%),
  linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 40%)
```

**Conteúdo (max-width: 800px):**

Badge:
```css
font-size: 12px
font-weight: 700
letter-spacing: 2px
text-transform: uppercase
color: var(--accent)
margin-bottom: 16px
```
Dot animado: `8px × 8px`, `background: var(--accent)`, `animation: pulse-glow 1.5s infinite`

Título:
```css
font-size: clamp(40px, 4vw, 64px)
font-weight: 900
line-height: 0.9
letter-spacing: -0.05em
text-transform: lowercase
margin-bottom: 16px
```
Estrutura: `linha1 / <span class="text-pink glow-pink">accent</span> / linha3`

Meta (visível só em `heroState === 'focused'`):
```css
display: flex
gap: 20px
margin-bottom: 32px
font-size: 14px
font-weight: 600
color: var(--text-muted)
```
Rating badge: `background: rgba(255,255,255,0.1)`, `padding: 4px 10px`, `border-radius: 6px`

Descrição:
```css
font-size: 20px
color: rgba(255,255,255,0.9)
line-height: 1.6
max-width: 600px
margin-bottom: 24px
font-weight: 400
text-shadow: 0 2px 8px rgba(0,0,0,0.8)
```

**Botões:**

Primário:
```css
background: var(--accent)
color: white
padding: 16px 40px
border-radius: 100px
font-weight: 800
font-size: 16px
box-shadow: 0 10px 30px var(--accent-glow)
text-transform: lowercase
```

Outline:
```css
background: rgba(255,255,255,0.05)
color: white
padding: 16px 40px
border-radius: 100px
font-weight: 800
font-size: 16px
border: 1px solid rgba(255,255,255,0.1)
text-transform: lowercase
```

**Stats card** (canto superior direito):
```css
position: absolute
top: 15%
right: 10%
background: white
color: black
padding: 30px
border-radius: 24px
z-index: 20
box-shadow: 0 30px 60px rgba(0,0,0,0.5)
max-width: 200px
```
Valor: `font-size: 40px`, `font-weight: 900`
Label: `font-size: 12px`, `opacity: 0.6`
Botão seta: `40×40px`, `background: var(--accent)`, `border-radius: 50%`

**Hero Dots** (bottom center, só quando sem previewCard):
```css
position: absolute
bottom: 28px
left: 0; right: 0
display: flex
gap: 10px
justify-content: center
z-index: 20
```

Dot:
```css
width: 36px; height: 36px
border-radius: 50%
border: 1px solid rgba(255,255,255,0.15)
background: rgba(0,0,0,0.4)
backdrop-filter: blur(6px)
color: rgba(255,255,255,0.3)
transition: all 350ms cubic-bezier(0.34,1.56,0.64,1)
```

Dot ativo:
```css
background: var(--accent)
border-color: var(--accent)
color: #fff
box-shadow: 0 0 16px var(--accent-glow)
transform: scale(1.2)
```

**Slides do hero:**
```
{ title: 'ziiiTV',    accent: 'o melhor',  rest: 'player',  icon: mdi:television-play }
{ title: 'invasão',   accent: 'cerebral',  rest: 'ziiiTV',  icon: mdi:alien }
{ title: 'domínio',   accent: 'digital',   rest: 'ziiiTV',  icon: mdi:television-play }
{ title: 'visão',     accent: 'infinita',  rest: 'ziiiTV',  icon: mdi:infinity }
{ title: 'universo',  accent: 'ziiiTV',    rest: 'é seu',   icon: mdi:rocket-launch }
```
Auto-slide: `setInterval 8000ms`

---

## 6. Rows Slider

```css
/* translateY animado para scroll vertical entre rows */
transform: translateY({contentOffset}px)
transition: transform 500ms cubic-bezier(0.4,0,0.2,1)
```

Quando `focusZone !== 'content'`: `translateY(0)`

---

## 7. Carousel Section

```css
padding: 40px 0
overflow: visible  /* glow não é cortado */
transition: all 200ms
```

**Header:**
```css
padding: 0 80px
display: flex
justify-content: space-between
align-items: center
margin-bottom: 24px
```

**Título:**
```css
font-size: 24px
font-weight: 800
text-transform: lowercase
```
Estrutura: `texto normal <span class="text-pink">texto rosa</span>`

---

## 8. Wide Card (Top 10 / Continuar)

```css
/* Container */
position: relative
display: flex
align-items: flex-end
min-width: 480px
flex-shrink: 0
cursor: pointer
transition: all 280ms cubic-bezier(0.34,1.56,0.64,1)
```

**Número gigante** (só no Top 10):
```css
font-size: 10.9rem
font-weight: 900
line-height: 1
color: transparent
-webkit-text-stroke: 2px rgba(255,255,255,0.15)
font-family: 'Outfit'
width: 180px
text-align: right
margin-bottom: -24px
margin-right: -3px
z-index: 2
```

Ativo:
```css
-webkit-text-stroke-color: var(--accent)
text-shadow: 0 0 20px var(--accent-glow)
```

**Imagem:**
```css
width: 378px
height: 213px
object-fit: cover
object-position: center 30%
border-radius: 14px
border: 1px solid rgba(255,255,255,0.07)
opacity: 0.8
```

**Focado** (`.card-focused .wide-card-img`):
```css
border: 3px solid var(--accent)
box-shadow: 0 0 0 2px var(--accent), 0 0 28px var(--accent-glow), 0 0 40px var(--accent-glow)
```

**Tag** (canto superior esquerdo):
```css
position: absolute
top: 10px; left: 10px
font-size: 0.58rem
font-weight: 900
letter-spacing: 1.5px
text-transform: uppercase
padding: 3px 8px
border-radius: 6px
backdrop-filter: blur(6px)
```

Variantes:
```
novo-ep    → background: rgba(255,0,110,0.85), color: #fff
novo-filme → background: rgba(77,124,254,0.85), color: #fff
lancamento → background: rgba(251,191,36,0.85), color: #000
top10      → background: rgba(0,0,0,0.7), color: var(--accent), border: 1px solid var(--accent)
```

**Ano** (canto inferior direito):
```css
position: absolute
bottom: 8px; right: 8px
background: rgba(0,0,0,0.75)
backdrop-filter: blur(4px)
color: rgba(255,255,255,0.8)
font-size: 0.62rem
font-weight: 700
font-family: 'Barlow Condensed'
letter-spacing: 1px
padding: 3px 7px
border-radius: 6px
border: 1px solid rgba(255,255,255,0.15)
```

**Título do card:**
```css
font-size: 1.5525rem
font-weight: 700
font-family: 'Barlow Condensed'
letter-spacing: 0.5px
text-transform: uppercase
white-space: nowrap
overflow: hidden
text-overflow: ellipsis
padding: 6px 4px 0
```

**Wide Row:**
```css
display: flex
gap: 8px
overflow-x: scroll
overflow-y: visible
padding: 12px 0 20px 80px
align-items: flex-start
scroll-behavior: smooth
padding-right: calc(100vw - 480px)
scrollbar-width: none
```

---

## 9. Portrait Card (Comédias / Filmes)

```css
position: relative
width: 395px
min-width: 395px
height: 593px
border-radius: 12px
overflow: hidden
cursor: pointer
flex-shrink: 0
transition: all 280ms cubic-bezier(0.34,1.56,0.64,1)
```

**Imagem:**
```css
width: 395px
height: 593px
object-fit: cover
object-position: center 30%
opacity: 0.85
```

**Focado:**
```css
transform: scale(1.05)
z-index: 10
/* imagem: */
border: 3px solid var(--accent)
box-shadow: 0 0 0 2px var(--accent), 0 0 28px var(--accent-glow), 0 0 40px var(--accent-glow)
```

**Título:**
```css
font-size: 0.675rem
font-weight: 700
font-family: 'Barlow Condensed'
text-transform: uppercase
white-space: nowrap
overflow: hidden
text-overflow: ellipsis
margin-top: 6px
padding: 8px 4px 0
```

**Portrait Row:**
```css
display: flex
gap: 14px
overflow-x: scroll
overflow-y: visible
padding: 12px 0 20px 30px
scroll-behavior: smooth
padding-right: calc(100vw - 300px)
```

---

## 10. Category Grid

```css
display: grid
grid-template-columns: repeat(4, 1fr)
gap: 24px
```

**Category Card:**
```css
height: 140px
background: rgba(255,255,255,0.03)
border: 1px dashed rgba(255,255,255,0.1)
border-radius: 24px
display: flex
flex-direction: column
align-items: center
justify-content: center
gap: 12px
font-size: 1.1rem
font-weight: 700
text-transform: lowercase
backdrop-filter: blur(10px)
```

**Focado:**
```css
background: var(--accent)
border-style: solid
border-color: var(--accent)
transform: translateY(-8px)
box-shadow: 0 15px 30px var(--accent-glow)
```

**Ícones por categoria:**
```
🔥 Mais Vistos         → mdi:fire,               #ff6b35
⚽ Futebol & Esportes  → mdi:soccer,             #4ade80
🎬 Filmes & Séries     → mdi:movie-open,         #a78bfa
📺 Canais Abertos      → mdi:television-classic, #60a5fa
🎮 Infantil            → mdi:gamepad-variant,    #f472b6
📰 Notícias            → mdi:newspaper-variant,  #94a3b8
🎵 Música & Variedades → mdi:music-note,         #fbbf24
🌍 Documentários       → mdi:earth,              #34d399
```

---

## 11. Glow Frame (foco fixo na posição 1)

```css
position: absolute
top: 12px
left: 277px  /* top10: padding(100) + num-width(180) - margin(3) */
width: 320px
height: 180px
border-top: 2px solid var(--accent)
border-bottom: 2px solid var(--accent)
border-left: none; border-right: none
box-shadow: 0 -8px 24px var(--accent-glow), 0 8px 24px var(--accent-glow)
pointer-events: none
z-index: 20
```

Para `row-simple` (sem número): `left: 0`

---

## 12. Loading Screen

```css
position: fixed; inset: 0
background: #000
display: flex
flex-direction: column
align-items: center
justify-content: center
gap: 20px
z-index: 9999
```

Logo: `font-size: 5rem`, `font-weight: 900`, `color: var(--accent)`, `animation: pulse-glow 1.5s infinite`
Sub: `font-size: 0.75rem`, `color: rgba(255,255,255,0.25)`, `letter-spacing: 2px`
Spinner: `28×28px`, `border: 2px solid rgba(255,0,110,0.15)`, `border-top-color: var(--accent)`, `animation: spin 600ms linear infinite`

---

## 13. Exit Dialog

```css
/* overlay */
position: fixed; inset: 0
background: rgba(0,0,0,0.85)
display: flex; align-items: center; justify-content: center
z-index: 9999

/* dialog */
background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)
border: 2px solid rgba(255,0,110,0.3)
border-radius: 16px
padding: 60px 80px
text-align: center
max-width: 600px
box-shadow: 0 0 60px rgba(255,0,110,0.4)
```

Título: `font-size: 40px`, `font-weight: 700`
Texto: `font-size: 22px`, `color: var(--text-muted)`

Botão cancelar: `background: rgba(255,255,255,0.1)`, `padding: 16px 48px`, `font-size: 24px`
Botão confirmar: `background: var(--accent)`, `padding: 16px 48px`, `font-size: 24px`
Focado: `transform: scale(1.08)`, `box-shadow: 0 0 24px var(--accent-glow)`, `border: 3px solid var(--accent)`

---

## 14. Navegação D-pad (4 Zonas)

```
focusZone: 'sidebar' | 'topbar' | 'hero' | 'content'
```

### Transições:
```
sidebar  → ArrowRight → topbar
topbar   → ArrowLeft (no início) → sidebar
topbar   → ArrowDown → hero (heroState = 'focused')
hero     → ArrowUp → topbar (heroState = 'default')
hero     → ArrowDown → content (heroState = 'collapsed')
content  → ArrowUp (row 0) → hero (heroState = 'focused')
```

### Back (keyCode 10009 / Backspace):
```
topbar/sidebar → showExitDialog = true
hero           → focusZone = 'topbar', heroState = 'default'
content        → focusZone = 'hero', heroState = 'focused'
```

### Content navigation:
```
ArrowRight → contentCols[row]++, scrollCardIntoView
ArrowLeft  → contentCols[row]--, scrollCardIntoView
ArrowDown  → contentRow++, scrollToRow
ArrowUp    → contentRow-- (ou volta pro hero se row === 0)
Enter      → play(channel)
```

### Estado salvo por row:
```typescript
contentCols: [0, 0, 0, 0, 0, 0]  // 6 rows
```

### Scroll:
- `scrollToRow(row)` → `translateY` no rows-slider
- `scrollCardIntoView(row, col)` → `scrollTo` horizontal no `.wide-row`

---

## 15. Telas Disponíveis

```
activeScreen: 'home' | 'filmes' | 'series'
```

### Home:
- Row 0: Top 10 (wide-card com número)
- Row 1: Continuar Assistindo (simple-card sem número)
- Row 2: Comédias (portrait-card)
- Row 3: Categorias (category-grid 4×2)

### Filmes:
- Row 0: Top 10 Filmes (wide-card)
- Row 1: Continuar Assistindo (simple-card)
- Row 2: Ação & Aventura (portrait-card)
- Row 3: Comédia & Romance (portrait-card)
- Row 4: Drama & Suspense (portrait-card)
- Row 5: Ficção Científica (portrait-card)

---

## 16. Preview Dinâmico no Hero

Quando `focusZone === 'content'` e `contentRow === 0 ou 1`:
- `previewCard` = card focado
- Hero mostra backdrop/poster do card
- Título, rating, descrição do card
- Botão "assistir agora" → `play(ch)`

Quando `previewCard === null`:
- Hero mostra slide padrão com auto-slide

---

## 17. Animações

```css
/* Pulse glow */
@keyframes pulse-glow {
  0%,100% { text-shadow: 0 0 20px var(--accent-glow); }
  50% { text-shadow: 0 0 60px rgba(255,0,110,1); }
}

/* Spinner */
@keyframes spin { to { transform: rotate(360deg); } }
```

Transições de card: `cubic-bezier(0.34,1.56,0.64,1)` (spring effect)
Transições de hero: `cubic-bezier(0.4,0,0.2,1)` (ease)
Rows slider: `cubic-bezier(0.4,0,0.2,1) 500ms`

---

## 18. Regras Globais

```css
* { outline: none !important; scrollbar-width: none; }
::-webkit-scrollbar { display: none; }
body { overflow: hidden; max-width: 1920px; }
viewport: width=1920, initial-scale=1
```

---

**Última atualização:** 15/04/2026 12:36  
**Fonte:** Análise completa do código-fonte Svelte legacy
