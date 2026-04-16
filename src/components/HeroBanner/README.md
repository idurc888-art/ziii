# HeroBanner - Componente Apple TV Style

Componente de banner hero inspirado no design Apple TV, adaptado para Samsung Tizen 4.0+.

## Características

✅ **Efeitos Apple TV adaptados:**
- Carrossel com parallax (background se move mais devagar)
- Filtros de brilho e escala: `brightness(0.5) scale(0.97)` para slides inativos
- Transições suaves: `cubic-bezier(0.22,1,0.36,1)`
- Gradientes overlay para legibilidade
- Progress bar automática (7s por slide)
- Dots de navegação com animação

✅ **Compatível com Tizen:**
- Remove `backdrop-filter` (não suportado no Chromium 56)
- Navegação por D-pad (setas, Enter, F1)
- Otimizado para performance no Chromium 56+

✅ **Navegação:**
- Setas esquerda/direita: navega entre slides
- Enter: seleciona slide atual
- F1: adiciona à lista
- Auto-play com timer de 7s
- Controle de pause/play

## Uso Básico

```tsx
import { HeroBanner, mockHeroSlides } from './HeroBanner';

function HomeScreen() {
  return (
    <HeroBanner
      slides={mockHeroSlides}
      autoPlayInterval={7000}
      onSelect={(slide) => {
        console.log('Slide selecionado:', slide.title);
        // Implementar reprodução
      }}
      onAddToList={(slide) => {
        console.log('Adicionar à lista:', slide.title);
        // Implementar favoritos
      }}
    />
  );
}
```

## Dados Personalizados

```tsx
const mySlides = [
  {
    id: '1',
    title: 'Meu Filme',
    subtitle: 'Filme Original',
    description: 'Descrição do conteúdo.',
    badge: 'Novo · Filme',
    backgroundImage: 'https://exemplo.com/backdrop.jpg',
    type: 'movie' // 'movie' | 'series' | 'live'
  }
  // ...
];
```

## Integração com Canais

```tsx
import { getHeroSlidesFromChannels } from './heroData';

// Converter canais em slides do hero
const heroSlides = getHeroSlidesFromChannels(channels);
```

## CSS Adaptado

O CSS foi adaptado para remover recursos não suportados:
- `backdrop-filter: blur()` → substituído por `background: rgba()`
- Suporte a `gap` no flexbox testado
- Foco visual para navegação D-pad
- Performance otimizada para Chromium 56

## Próximos Passos

1. **Integrar com TMDB** - buscar backdrops automáticos
2. **Vídeo background** - suporte a trailers em autoplay
3. **Animações mais complexas** - quando validado na TV
4. **Controles de volume** - para vídeos
