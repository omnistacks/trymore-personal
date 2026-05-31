# 🚀 KEITHTECHPOS — 3D Personal Portfolio Website
### Creator: Trymore Kudyamukonde | Location: Harare, Zimbabwe 🇿🇼

A high-performance, visually immersive **3D Afrofuturist Cyberpunk** personal and business portfolio website built using Three.js (WebGL), GSAP (ScrollTrigger), and Web Audio API synthesis.

---

## 🎨 Visual Aesthetics & Identity
- **Primary Emerald Green (`#00FF88`)**: Saving terminal vibes woven with Savannah colors.
- **Deep Space Black (`#0A0A12`)**: Premium dark surfaces and glassmorphic cards.
- **Burnt Sunset Orange (`#FF6B35`)**: Warm African sunset accents representing Shona identity.
- **Subtle Cultural Integration**: Repeat geometric lines inspired by Ndebele wall patterns, Shona proverbial proverbs ("Chara chimwe hachitswanyi inda"), and a loading state featuring "Kuita basa..." (doing work).

---

## 🚀 Key Functional Modules
1. **Interactive WebGL Hero Globe**: A low-poly globe focusing coordinates centered on Harare, Zimbabwe, with glowing curved connection lines pulsing to cities globally. It features an 8,000+ interactive mouse-reactive starfield and post-processing UnrealBloom glows.
2. **Holographic ID card**: CSS 3D perspectives tilt business card responding to pointer positions.
3. **Interactive 3D Carousel**: Perspective arc iOS-style product layout cards with smooth translation scroll transitions.
4. **Skills Neural Network**: A 3D floating network grid inside Three.js where skill nodes can be clicked to query database profiles and proficiencies.
5. **Harare Coordinates Pin**: A coordinate map visualizer in the Contact section that zooms and focuses camera rotations onto Zimbabwe upon scrolling in.
6. **Programmatic Afrobeat Synthesizer**: Built using native browser Web Audio API. Modulates deep space pads with a synthesized rhythm shaker/kick drum polyrhythm. Active beats speed up the WebGL particle speeds!
7. **Custom Trail Cursor**: An interactive particle comet cursor trail that grows and prints actionable text overlays on hover zones.
8. **Mobile Adaptive Layouts**: Graceful 60fps fallbacks on mobile screens (<768px), swapping WebGL tracks with swipe cards and injecting a sleek fixed bottom iOS-style tab bar.

---

## 🔧 Installation & Commands

To boot up the environment locally, make sure you have [Node.js](https://nodejs.org) installed and execute:

```bash
# Install package dependencies
npm install

# Boot up local development dev server
npm run dev

# Bundle production optimized build output
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 File Structure
- `index.html` — Base semantic page frame and layouts.
- `css/`
  - `main.css` — Global variables, dark styling models, stats counters.
  - `animations.css` — Custom neon keyframes, Ndebele background grids.
  - `mobile.css` — Screen size overrides, swipe viewports, and mobile tab bar.
- `js/`
  - `main.js` — Core pipeline orchestrator and viewport active tab highlight listeners.
  - `three-scene.js` — All WebGL pipelines: Icosphere globe, starfield, skills graph, and map coordinates.
  - `carousel.js` — iOS-style card translation animations.
  - `gsap-animations.js` — ScrollTriggers, count counters, tilt configurations.
  - `cursor.js` — Comet trail and pointer expansion.
  - `audio.js` — Programmatic synthesizers and BPM particle speed connections.
"# trymore-personal" 
