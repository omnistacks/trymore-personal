# 🚀 KEITHTECHPOS — 3D Personal Portfolio Website
## Ultra-Detailed Build Prompt for Trymore Kudyamukonde
### Site Name: **keithtechpos** | Creator: **trymore kudyamukonde**

---

## 🌐 OVERVIEW & VISION

Build a blazing-fast, jaw-dropping **3D personal/business portfolio website** for **Trymore Kudyamukonde**, the Zimbabwean software developer and founder of **Keith Tech** — a suite of POS, GPS tracking, fleet management, ride-hailing, and business software products based in Harare, Zimbabwe (1357 Epworth Jacha, Harare).

The site must feel like stepping into a **living, breathing tech universe** — part African tech hub, part futuristic software lab, part personal brand manifesto. It should be unmistakably **African in soul** (Ubuntu, innovation, vibrancy) yet globally competitive in execution (Three.js depth, GSAP motion, WebGL shaders).

**Core Mission:** "Empowering African businesses through intelligent, accessible technology."

---

## 🎨 VISUAL IDENTITY & AESTHETIC DIRECTION

### Color Palette
```
Primary:        #00FF88   (Electric Emerald — African savanna meets terminal green)
Secondary:      #0A0A12   (Deep Space Black — premium dark base)
Accent 1:       #FF6B35   (Burnt Sunset Orange — warmth, Africa)
Accent 2:       #00D4FF   (Cyan Neon — tech, data streams)
Surface:        #0F1525   (Dark Navy — card surfaces)
Glass:          rgba(255,255,255,0.04)  (Frosted glass panels)
Text:           #E8EAF6   (Cool near-white)
Muted:          #4A5568   (Subdued grey for secondary text)
```

### Typography
- **Display / Hero**: `Orbitron` (Google Fonts) — futuristic, bold, techy — used for "TRYMORE KUDYAMUKONDE" and section titles
- **Sub-headings**: `Space Mono` — monospaced, hacker aesthetic, Zimbabwean coder energy
- **Body**: `Sora` — humanist, readable, modern warmth
- **Accent/Labels**: `JetBrains Mono` — for code snippets, stats, metrics, terminal elements
- **Logo Wordmark**: Custom SVG lettering for "KEITH TECH" with circuit-board underline detail

### Overall Aesthetic
**Afrofuturist Cyberpunk** — Think: Great Zimbabwe ruins meeting a SpaceX launch control room. Geometric African patterns (Ndebele, Shona-inspired angular motifs) woven into UI backgrounds as subtle noise/shader textures. Neon glow against deep darkness. Data particles flowing like migrating birds. The feeling of **tech being built from the ground up, for Africa, by Africa**.

---

## 🏗️ SITE ARCHITECTURE & SECTIONS

### Section 1: HERO / LANDING (Full 3D Experience)
**Layout**: Full-viewport WebGL scene using **Three.js**

**3D Scene Components:**
- A **rotating 3D globe** (low-poly icosphere) centered on Zimbabwe/Africa, built with Three.js IcosahedronGeometry. Glowing connection lines (LineSegments) pulsing from Harare outward to world cities — representing Keith Tech's reach.
- Floating **3D hexagonal tiles** in the background — each hex face shows a micro-app icon (POS receipt, GPS pin, fleet truck icon, bus ticket, ride app icon) slowly rotating and drifting in parallax depth layers (z-axis spread: -200 to +100)
- **Particle field**: 8,000+ particles using THREE.Points, drifting like a starfield but tinted #00FF88 and #00D4FF, responding to mouse movement via raycasting (mousemove event rotates the entire particle cloud by ±15°)
- A **glowing 3D text mesh** ("TRYMORE KUDYAMUKONDE") built with THREE.TextGeometry using a JSON font, floating above the globe with a subtle metallic MeshStandardMaterial and emissive glow
- **Directional lighting** from below (upward rim light, Accent Orange #FF6B35) + a point light orbiting the globe slowly (cyan, intensity 2.0)
- Post-processing: **UnrealBloomPass** from Three.js postprocessing — heavy bloom (strength: 1.5, radius: 0.4, threshold: 0.2) on all emissive objects

**Overlay (HTML atop canvas):**
```
TRYMORE KUDYAMUKONDE              [typed with typewriter effect, cursor blinks]
Founder · Developer · Innovator
──────────────────────────────
Building Africa's Tech Stack      [subtitle, Sora font, muted]
From Harare, Zimbabwe 🇿🇼
```
- CTA Button: `[ EXPLORE MY WORK → ]` — outlined with neon green border, hover fills solid, triggers smooth scroll + canvas transition
- Secondary CTA: `[ DOWNLOAD CV ]` — ghost button
- Floating badge bottom-right: `4.8★ · 1K+ Downloads · Google Play` (pulses softly)

**Hero Animation Sequence (GSAP Timeline on load):**
1. t=0.0s: Canvas fades in from black (opacity 0→1, 1.2s ease)
2. t=0.5s: Globe materializes from center (scale 0→1, elastic ease)
3. t=0.8s: Hex tiles drift in from depth (z: -500→0, staggered 0.1s)
4. t=1.0s: Particle field activates with a "Big Bang" burst
5. t=1.2s: Name text drops from above (y: -80→0, GSAP bounce)
6. t=1.6s: Subtitle types itself character by character
7. t=2.0s: CTA buttons fade up (stagger 0.2s)
8. t=2.5s: Navigation bar slides in from top

---

### Section 2: ABOUT / IDENTITY

**Layout**: Split 50/50 — left is 3D portrait space, right is text

**Left Panel (3D):**
- A **floating 3D card** (like a holographic business card) that rotates on mouse hover using CSS `perspective` + `rotateX/Y` (tilt card effect, max ±20°)
- Card face: Profile silhouette avatar (geometric low-poly African mask aesthetic) + "TK" monogram logo
- Card emits holographic scanlines (CSS animation, linear-gradient moving downward)
- Card has `box-shadow: 0 0 40px rgba(0,255,136,0.4)` glow

**Right Panel (Text):**
```
WHO AM I
─────────────────────────────────────────
Full Name:    Trymore Kudyamukonde
Location:     Harare, Zimbabwe 🇿🇼
Role:         Mobile & Full-Stack Developer
Company:      Keith Tech (keithtechpos.com)
Contact:      tkudyamukonde@gmail.com
              +263 78 992 6928
```
Paragraph bio: "I build the tools African businesses need to grow. From point-of-sale systems for small shops to GPS fleet tracking for logistics companies — Keith Tech is my mission to make enterprise-grade software accessible to every business on the continent."

**Animated Stats Row** (counter animation via Intersection Observer):
```
[ 6+ ]          [ 1K+ ]         [ 4.8★ ]         [ 7+ ]
Apps Built    Downloads     Play Store Rating   Years Building
```
Each stat: large Orbitron number, small Sora label, underline in neon green

---

### Section 3: PRODUCTS / APPS SHOWCASE

**Layout**: Horizontal scroll track (CSS `overflow-x: scroll` with snap) OR a **3D carousel** using Three.js

**3D Card Carousel:**
- Each product gets a large 3D "device mockup card" rendered in Three.js (a flat BoxGeometry with the app screenshot as a texture map, tilted at 15° on the y-axis, floating)
- Cards arranged in a **perspective arc** (like carousel.3d on iOS) — clicking arrows animates the arc rotation with GSAP `.to({rotation}, {duration: 0.6, ease: "power3.inOut"})`
- Each card has a glow halo color-coded per product

**Products to Feature (with card details):**

#### 1. 🟢 KEITH TECH POS
```
Category:   Point of Sale & Inventory
Tagline:    "Run your shop from your phone"
Features:   Sales tracking · Inventory management · Receipt printing
            Multi-location · Dark mode · 4.8★ rated
Color Halo: #00FF88 (primary emerald)
Link:       com.keithtechpos.sale
```

#### 2. 🔵 KEITH GPS SYSTEM
```
Category:   Real-time GPS Tracking
Tagline:    "Know where every asset is, always"
Features:   Vehicle tracking · Live map · History playback
Color Halo: #00D4FF (cyan)
Link:       com.gps.keithgps.tracking
```

#### 3. 🟠 FLEET MANAGER ZW
```
Category:   Fleet Management
Tagline:    "Manage your entire fleet, one dashboard"
Features:   Driver management · Route optimization · Fuel tracking
Color Halo: #FF6B35 (orange)
Link:       com.fleet.manage.zw
```

#### 4. 🟣 TORA RIDE (+ DRIVER APP)
```
Category:   Ride-Hailing Platform
Tagline:    "Zimbabwe's own ride app"
Features:   Customer & driver apps · In-app payments · Route matching
Color Halo: #A855F7 (purple)
Links:      com.toraride.customer · com.toraride.driver
```

#### 5. 🔴 KEITH BUS TICKET PRINTING
```
Category:   Transport Ticketing
Tagline:    "Digital tickets for Zim's buses"
Features:   Seat selection · Thermal print · QR codes
Color Halo: #EF4444 (red)
Link:       com.keithtech.busticketing
```

#### 6. 🟡 AFRICA POS / ECOPOS
```
Category:   Lightweight POS
Tagline:    "POS built for Africa's realities"
Features:   Offline mode · Low-data · Multi-currency
Color Halo: #EAB308 (amber)
Links:      com.keithtech.ecopos
```

#### 7. 🩵 KEITH TRACK (BACK OFFICE)
```
Category:   Back-Office Management
Tagline:    "Your business brain in the cloud"
Features:   Web-based dashboard · Employee management · Sales reports
Color Halo: #06B6D4 (teal)
```

**Card Interaction:** Hovering a card lifts it forward (z-translate +50px), triggers a particle burst from the card edges, and a tooltip with key stats fades in below.

---

### Section 4: SKILLS & TECH STACK

**Layout**: Interactive 3D node graph (force-directed, Three.js or D3 + CSS 3D transforms)

**Visual Concept**: A glowing **neural network** visualization where each node is a skill/technology. Clicking a node expands it showing proficiency level and related projects.

**Skills to Map:**
```
Mobile Development:   Flutter · Android (Java/Kotlin) · React Native
Backend:              Node.js · Firebase · REST APIs · PHP
Frontend:             HTML5 · CSS3 · JavaScript · React
Database:             SQLite · MySQL · Firestore · PostgreSQL
Hardware/IoT:         Bluetooth Thermal Printers · POS Hardware Integration
Specializations:      POS Systems · GPS/Fleet · Ride-hailing · Ticketing
Business:             Product Management · Customer Support · SaaS
```

Each tech node: glowing sphere, colored by category, connected by animated dashed lines (flowing dash animation simulating data transfer)

---

### Section 5: TESTIMONIALS / REVIEWS

**Layout**: Floating glass-morphism cards in 3D stagger

Pull real reviews:
- **Moira Ndoro** (5★): "Keith Tech POS has been a game-changer for my business. The app is incredibly user-friendly..."
- **Prudance Mutimba**: "Very useful tool for managing sales and inventory... it has great potential to help many businesses."
- **Subhadeep Chowdhury**: "Very useful application for POS sales."

**Card Design:**
- `backdrop-filter: blur(16px)` glass panels
- Thin neon-green border (`border: 1px solid rgba(0,255,136,0.3)`)
- Star rating rendered as animated SVG stars (fill color: #00FF88)
- Avatar: geometric low-poly portrait generated from initials
- Cards arranged in a staggered 3D grid with `perspective: 800px` and `rotateY` transforms

---

### Section 6: CONTACT

**Layout**: Split — left is an interactive 3D map scene, right is a sleek contact form

**Left: 3D Map Globe Zoom**
- A Three.js globe that, when this section scrolls into view, **zooms/tilts to focus on Harare, Zimbabwe**
- A glowing pin drops onto the map at coordinates (-17.8187°, 31.0488°) with a pulsing ring animation
- Location label: "Harare, Zimbabwe 🇿🇼" floats beside the pin

**Right: Contact Form**
```
[ Your Name           ]
[ Your Email          ]
[ Subject             ]
[ Message             ________
                       ________
                       ________]
[ SEND MESSAGE → ]
```
- Inputs: dark glass style, green glow on focus, animated label transitions (float-up effect)
- Submit button: full-width, solid neon green, text turns white, hover triggers particle burst from the button edges
- Below form: direct contact icons (WhatsApp link with +263 78 992 6928, email badge for tkudyamukonde@gmail.com, Google Play developer page link)

---

### Section 7: FOOTER

**Full-width dark footer:**
```
KEITH TECH                                    keithtechpos.com
By Trymore Kudyamukonde
Harare, Zimbabwe 🇿🇼

[ Google Play ]  [ GitHub ]  [ WhatsApp ]  [ Email ]

"Empowering African businesses through intelligent technology"

© 2026 Keith Tech · All Rights Reserved
```
- Subtle animated African geometric pattern as footer background (CSS pattern, Ndebele-inspired angular repeating motif in #0F1525 against #0A0A12)
- Thin neon green top border (`border-top: 2px solid #00FF88`)

---

## ⚡ PERFORMANCE & TECHNICAL REQUIREMENTS

### Tech Stack
```
3D Engine:         Three.js r160+ (via CDN or npm)
Animation:         GSAP 3 + ScrollTrigger plugin
Post-processing:   @three.js/postprocessing (UnrealBloomPass, FilmPass)
Fonts:             Google Fonts (Orbitron, Space Mono, Sora, JetBrains Mono)
Icons:             Lucide Icons or custom SVG
Deployment:        Netlify / Vercel / GitHub Pages compatible (static HTML+JS)
Build:             Vite (if using npm) or pure CDN HTML (no build step option)
```

### Performance Targets
- **First Contentful Paint**: < 1.5s (lazy-load Three.js scene)
- **Time to Interactive**: < 3.0s
- **FPS**: Locked 60fps on desktop, graceful 30fps fallback on mobile
- **Mobile**: Disable heavy WebGL effects on `window.innerWidth < 768`, replace globe with CSS 3D card
- **Canvas**: Use `requestAnimationFrame` with delta-time clamping to prevent spiral of death
- **Texture compression**: All textures < 512KB, use WebP format
- **Code splitting**: Lazy import Three.js only after hero is in viewport

### Accessibility
- `aria-label` on all interactive canvas elements
- Keyboard-navigable product carousel (arrow keys)
- `prefers-reduced-motion` media query: disable all GSAP/Three.js animations, show static equivalents
- Color contrast ratio ≥ 4.5:1 for all text

---

## 🎬 SCROLL-DRIVEN ANIMATION SYSTEM (GSAP ScrollTrigger)

Define a scroll animation for each section transition:

```javascript
// Hero → About: Globe rotates and shrinks into the About card
ScrollTrigger.create({ trigger: "#about", onEnter: () => {
  gsap.to(globeMesh.rotation, { y: Math.PI * 2, duration: 1.5 });
  gsap.to(globeMesh.scale, { x: 0.3, y: 0.3, z: 0.3, duration: 1 });
}});

// About → Products: Stats counters fire
ScrollTrigger.create({ trigger: ".stats-row", onEnter: () => {
  // Animate counters 0 → final value
}});

// Products carousel: pin the section during horizontal scroll travel
ScrollTrigger.create({ trigger: "#products", pin: true, scrub: 1 });

// Skills graph: nodes fly in from outside viewport
ScrollTrigger.create({ trigger: "#skills", onEnter: () => {
  gsap.from(".skill-node", { scale: 0, opacity: 0, stagger: 0.05 });
}});

// Contact: Globe zooms to Zimbabwe
ScrollTrigger.create({ trigger: "#contact", onEnter: zoomToHarare });
```

---

## 🌍 AFRICAN IDENTITY DETAILS

These subtle touches make the site unmistakably Zimbabwean/African without being cliché:

1. **Geometric background pattern**: A repeating angular pattern inspired by Ndebele wall art, rendered as a faint `rgba(0,255,136,0.03)` SVG pattern fill on section backgrounds

2. **Loading screen**: A pulsing Shona-inspired geometric mandala (SVG, animated via CSS) with text: `"Loading Keith Tech..." / "Kuita basa..."` (Shona for "doing work")

3. **Subtle map Easter egg**: A very faint topographic-style Zimbabwe country outline is visible in the hero canvas starfield (just barely perceptible)

4. **Color philosophy**: The emerald green echoes both tech (matrix) and the Zimbabwe flag's green stripes. The orange echoes the Zimbabwe Bird's warmth.

5. **Footer quote**: Attribute a Shona proverb: *"Chara chimwe hachitswanyi inda"* — "One finger cannot kill a louse" (teamwork/community) — styled in Space Mono, muted color

---

## 📱 MOBILE EXPERIENCE

On screens < 768px:
- Replace Three.js globe with a **CSS-only 3D card stack** (perspective transforms, no WebGL overhead)
- Product carousel becomes a vertical scrollable feed with horizontal swipe snap
- Skills graph becomes a horizontal scrollable tag cloud
- Contact section: full-width form, WhatsApp button prominent (since primary contact in Zimbabwe is WhatsApp)
- Bottom tab bar (iOS-style): Home · Products · Contact — fixed, glass-morphism

---

## 🔧 CUSTOM CURSOR

On desktop:
- Replace default cursor with a **custom WebGL cursor**: a small neon-green dot (6px) that trails a decaying particle comet (10 ghost dots fading behind it)
- On hover over clickable elements: cursor expands to a 40px ring with pulsing glow, text "OPEN" or "CLICK" appears inside
- Implemented via a canvas overlay at `z-index: 9999`, `pointer-events: none`

---

## 🎵 OPTIONAL: AUDIO LAYER (Toggle)

Subtle background: looping ambient electronic track with Afrobeats percussion undertones (user-toggled, default OFF). A small speaker icon bottom-left toggles it. When ON, particle speeds synchronize loosely to BPM.

---

## 📦 DELIVERABLE STRUCTURE

```
keithtechpos/
├── index.html              (main page, all sections)
├── css/
│   ├── main.css            (global styles, variables, typography)
│   ├── animations.css      (keyframes, transitions)
│   └── mobile.css          (responsive overrides)
├── js/
│   ├── three-scene.js      (all Three.js: globe, particles, text mesh)
│   ├── gsap-animations.js  (all GSAP timelines + ScrollTrigger)
│   ├── carousel.js         (products 3D carousel logic)
│   ├── cursor.js           (custom cursor)
│   └── main.js             (init, event listeners, mobile detect)
├── assets/
│   ├── fonts/              (woff2 files if self-hosted)
│   ├── icons/              (SVG app icons)
│   └── textures/           (globe texture, any WebP images)
└── README.md
```

---

## ✅ FINAL QUALITY CHECKLIST

- [ ] 60fps on desktop Chrome/Firefox/Safari
- [ ] All GSAP animations use `will-change: transform` for GPU compositing
- [ ] `prefers-reduced-motion` respected
- [ ] Mobile fallback renders < 500ms without Three.js
- [ ] All external links open in `_blank` with `rel="noopener"`
- [ ] WhatsApp deep link: `https://wa.me/263789926928`
- [ ] Google Play link: `https://play.google.com/store/apps/details?id=com.keithtechpos.sale`
- [ ] Website link: `http://www.keithtechpos.com`
- [ ] Email: `tkudyamukonde@gmail.com`
- [ ] No placeholder lorem ipsum text — all real Keith Tech content
- [ ] Loading screen until Three.js fully initialized
- [ ] Error boundary: if WebGL unavailable, show elegant static fallback

---

*Prompt authored for: Trymore Kudyamukonde / Keith Tech POS / keithtechpos.com*
*Location: 1357 Epworth Jacha, Harare, Zimbabwe*
*Version: 1.0 · May 2026*
