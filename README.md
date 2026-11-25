# Pinak Chauhan — Personal Portfolio Website

An original, production-ready, single-page personal portfolio for **Pinak Chauhan** — Computer Engineering Student focusing on Machine Learning, Deep Learning, Data Science, AI, and Python software engineering.

Designed around modern editorial design, the **Swiss International Typographic Style**, minimalist grid systems, and custom abstract computational vector artwork.

---

- **Live**: [Live Link](https://pinak-portfolio.onrender.com)

---

## 🏛️ Personal Brand & Positioning

- **Name**: Pinak Chauhan
- **Role**: Computer Engineering Student | Machine Learning | Data Science | AI Developer | Python Developer
- **Main Brand Statement**: *"CURIOUS ABOUT INTELLIGENCE. PASSIONATE ABOUT BUILDING IT."*
- **Supporting Statement**: *"I turn data into intelligence and ideas into useful software. Exploring machine learning, deep learning, and intelligent applications through experimentation, engineering, and real-world projects."*
- **Location**: Vadodara, Gujarat, India
- **Education**: Bachelor of Engineering in Computer Engineering, Sardar Patel College of Engineering, Gujarat Technological University (GTU), Expected Graduation: 2027 (CGPA: 7.22)
- **Contact**: [pc000060@gmail.com](mailto:pc000060@gmail.com)
- **GitHub**: [https://github.com/p1nak](https://github.com/p1nak)
- **LinkedIn**: [https://www.linkedin.com/in/pinak-chauhan-12ab92328](https://www.linkedin.com/in/pinak-chauhan-12ab92328)

---

## 🎨 Visual Identity & Color System

| Token | Hex | Role |
|---|---|---|
| **Warm Ivory** | `#F3EFE6` | Main editorial background & body surfaces |
| **Ink Charcoal** | `#202321` | High-contrast typography & dark sections |
| **Cobalt Blue** | `#315BE8` | Primary links, interactive buttons, neural highlights |
| **Sage Green** | `#9CAF88` | Secondary badges, telemetry vectors & status indicators |
| **Burnt Amber** | `#CC6A42` | Metric callouts & critical alerts |
| **Mocha Beige** | `#D8C9B5` | Subtle surface borders & secondary chips |

### Typography
- **Headings / Display**: *Space Grotesk*
- **Editorial Headings**: *DM Serif Display*
- **Body & Prose**: *Inter*
- **Technical & Coordinates**: *JetBrains Mono*

---

## 🛠️ Technical Stack & Architecture

- **Markup & Semantic DOM**: HTML5 with ARIA landmark roles and accessibility compliance.
- **Styling**: Modular CSS3 (tokens, layouts, sections, animations), 12-column Swiss grid system.
- **Client Logic**: Vanilla JavaScript (ES6+ modular closures, zero heavy framework overhead).
- **3D Visualization**: **Three.js** interactive abstract neural network sphere with dynamic node physics, pointer parallax, and a non-WebGL 2D vector fallback.
- **Motion & Interactions**: GSAP + ScrollTrigger, dynamic scroll-driven SVG journey timeline, expandable project showcase drawer, and live Vadodara IST clock.
- **Structured Data**: `js/projects-data.js` centralizes project specifications, architecture pipelines, and verified metrics.

---

## 📁 Project Structure

```
Port/
├── index.html                   # Main single-page application
├── 404.html                     # Custom Swiss 404 error page
├── robots.txt                   # Search crawler directives
├── sitemap.xml                  # SEO indexing map
├── render.yaml                  # Render Static Site deployment configuration
├── README.md                    # Project documentation
├── css/
│   ├── tokens.css               # Design tokens (colors, typography, grid, spacing)
│   ├── main.css                 # Base resets, navigation, buttons, accessibility
│   ├── sections.css             # Section-specific styles (Hero, About, Projects, etc.)
│   └── animations.css           # Motion keyframes, reveals, and reduced-motion rules
├── js/
│   ├── projects-data.js         # Structured data for all 11 verified projects
│   ├── three-hero.js            # Three.js 3D neural network sphere centerpiece
│   ├── journey.js               # Scroll-driven SVG path and milestone activation
│   ├── projects.js              # Category filtering and expandable modal drawer
│   ├── animations.js            # Preloader word transitions and section reveals
│   └── main.js                  # Nav spy, mobile drawer, copy email, live IST clock
└── assets/
    ├── Pinak_Chauhan_AI_ML_Resume.pdf  # Verified resume document
    ├── favicon.svg                     # Geometric monogram icon
    └── illustrations/                  # Custom Swiss vector artwork
        ├── moodline.svg                # BiGRU recurrent wave & 6 emotion classes
        ├── credit-ledger.svg           # ROC-AUC 0.939 curve & SHAP attribution
        ├── nyc-airbnb.svg              # Geospatial listing cluster mesh
        ├── gearbox.svg                 # 4-channel accelerometer FFT harmonics
        ├── student-wellness.svg        # 12-factor lifestyle radar & regression
        ├── gyan-prapti.svg             # Gemini GenAI & human review workflow
        ├── lstm-next-word.svg          # LSTM memory cell gates & tokens
        ├── global-placement.svg        # Salary quantiles & international flows
        ├── amazon-stock.svg            # Candlesticks, SMA 20/50/200, volume
        ├── ml-work.svg                 # PCA eigenvectors & GridSearchCV matrix
        ├── industrial-internship.svg   # Digital QC checklist & InfluxDB telemetry
        ├── about-transformation.svg    # Data → Tensors → Intelligence pipeline
        └── education-cap.svg           # Geometric engineering graduation emblem
```

---

## 🚀 Deployment on Render

This project is configured for instantaneous deployment as a **Render Static Site**:

1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: Pinak Chauhan personal portfolio"
   git remote add origin https://github.com/p1nak/<repo-name>.git
   git push -u origin main
   ```
2. Log in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** → **Static Site**.
4. Select your GitHub repository.
5. Configuration settings:
   - **Build Command**: *(leave empty)*
   - **Publish Directory**: `.` (root directory)
6. Click **Create Static Site**.
