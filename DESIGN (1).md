# Design System Inspired by Beehiiv

## 1. Visual Theme & Atmosphere

Beehiiv's design system embodies a modern, premium SaaS aesthetic built for growth-focused creators and publishers. The visual language combines deep, sophisticated dark backgrounds with vibrant accent colors that pulse with energy and possibility. This creates an atmosphere of innovation and accessibility—professional enough for enterprise publishers yet approachable for indie creators. The design emphasizes clarity through generous whitespace, precise typography, and carefully considered contrast. Glassmorphic cards and subtle gradient accents add depth without overwhelming. The overall mood is forward-looking, trustworthy, and creatively empowering.

**Key Characteristics**
- Deep, dark navy foundations with high-contrast text for readability and sophistication
- Vibrant magenta and electric blue accents that draw attention to growth and conversion
- Clean, modern sans-serif typography hierarchy with clear visual distinction
- Generous use of negative space and breathing room around content blocks
- Subtle transparency layers and soft borders creating depth without visual heaviness
- Polished, professional aesthetic that bridges creator tools and enterprise platforms

## 2. Color Palette & Roles

### Primary
- **Deep Navy Background** (`#060419`): Primary page background, establishes dark, premium tone
- **Near Black** (`#000000`): Text, typography, high-contrast elements
- **Rich Dark Surface** (`#0D0B28`): Card backgrounds, surface layers, component bases

### Accent Colors
- **Electric Magenta** (`#FF5EC4`): Primary brand accent, draws attention to key features and CTAs
- **Royal Blue** (`#2F39BA`): Secondary accent, used for interactive states and visual hierarchy
- **Bright Blue** (`#3843D0`): Tertiary accent, variations on primary interactive elements
- **Lavender Tint** (`#D4D7F5`): Subtle highlight color, used for accents within dark surfaces

### Interactive
- **Bright White** (`#FFFFFF`): Primary CTA buttons, high-contrast interactive states, sign-up flows
- **Magenta Glow** (`#FF5EC4`): Hover states, active selections, featured content highlights
- **Blue Interactive** (`#2F39BA`): Form focus states, secondary interaction targets

### Neutral Scale
- **Medium Gray** (`#C4C2D6`): Secondary text, disabled states, less prominent information
- **Light Gray** (`#D6D6E0`): Tertiary text, captions, footnotes
- **Very Light Gray** (`#E5E7EB`): Border definition, dividers between sections
- **Subtle Gray** (`#D1D5DB`): Minimal borders, soft separators
- **Faint Gray** (`#D9DBDF`): Hairline borders, very subtle definition

### Surface & Borders
- **Glass Border** (`#FFFFFF` at 6% opacity): Subtle card borders, transparent layer definition
- **Light Surface** (`#F7F5FF`): Light mode backgrounds, offscreen surfaces, accessible alternatives
- **Card Surface** (`#0D0B28`): Elevated card backgrounds with subtle transparency

### Semantic / Status
- **Error Red** (`#EB4F2B`): Error states, alerts, destructive actions, validation failures

## 3. Typography Rules

### Font Family
**Primary:** ClashGroteskFont (headings, display text) with fallback stack: `ClashGroteskFont, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

**Secondary:** SatoshiFont (body, UI text) with fallback stack: `SatoshiFont, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display / H1 | ClashGroteskFont | 60px | 700 | 60px | 0px | Hero headlines, primary page titles |
| Heading / H2 | ClashGroteskFont | 48px | 700 | 48px | 0px | Section headings, major content divisions |
| Subheading / H3 | SatoshiFont | 18px | 700 | 28px | 0px | Feature cards, subsection titles |
| Accent / Label | SatoshiFont | 16px | 700 | 24px | 0px | Prominent labels, button text, emphasis |
| Body Large | SatoshiFont | 16px | 400 | 24px | 0px | Feature descriptions, longer body copy |
| Body Regular | SatoshiFont | 14px | 500 | 20px | 0px | Standard body text, default paragraph |
| Caption / Small | SatoshiFont | 14px | 400 | 20px | 0px | Helper text, supporting information |
| Code / Mono | SatoshiFont | 12px | 500 | 18px | 0px | Technical text, inline code snippets |

### Principles
- **Hierarchy First:** Font size and weight work together to establish clear visual hierarchy; weight increases create emphasis without requiring larger sizes
- **Dark Text on Dark:** Primary text (`#000000`) achieves sufficient contrast on light accents; secondary gray (`#C4C2D6`) used for reduced emphasis
- **Generous Line Height:** All line heights exceed font size, ensuring readability and elegance in dark mode
- **Brand Personality:** ClashGroteskFont conveys modern confidence in display contexts; SatoshiFont provides geometric clarity for UI and body copy
- **No Decoration Needed:** Typography weight and size carry distinction; underlines and italics used sparingly

## 4. Component Stylings

### Buttons

#### Primary CTA
- **Background:** `#FFFFFF`
- **Text Color:** `#000000`
- **Font:** SatoshiFont, 16px, weight 400
- **Padding:** `12px 24px`
- **Border Radius:** `9999px`
- **Border:** `0px solid transparent`
- **Height:** `50px`
- **Line Height:** `24px`
- **Hover State:** Background `#F7F5FF`, text remains `#000000`
- **Active State:** Background `#E5E7EB`, text `#000000`
- **Disabled:** Background `#D1D5DB`, text `#C4C2D6`, opacity `0.6`

#### Secondary CTA
- **Background:** `transparent`
- **Text Color:** `#FFFFFF`
- **Font:** SatoshiFont, 16px, weight 500
- **Padding:** `12px 24px`
- **Border Radius:** `9999px`
- **Border:** `1px solid rgba(255, 255, 255, 0.3)`
- **Height:** `36px`
- **Line Height:** `24px`
- **Hover State:** Background `rgba(255, 255, 255, 0.1)`, border `rgba(255, 255, 255, 0.6)`
- **Active State:** Background `rgba(255, 255, 255, 0.15)`, border `#FFFFFF`
- **Disabled:** Opacity `0.5`, pointer-events `none`

#### Ghost Button
- **Background:** `transparent`
- **Text Color:** `#C4C2D6`
- **Font:** SatoshiFont, 14px, weight 400
- **Padding:** `8px 12px`
- **Border Radius:** `6px`
- **Border:** `1px solid rgba(255, 255, 255, 0.15)`
- **Height:** `auto`
- **Line Height:** `21px`
- **Hover State:** Background `rgba(255, 255, 255, 0.05)`, text `#FFFFFF`, border `rgba(255, 255, 255, 0.3)`
- **Active State:** Background `rgba(255, 255, 255, 0.1)`, text `#FFFFFF`

### Cards & Containers

#### Feature Card
- **Background:** `#0D0B28`
- **Border:** `1px solid rgba(255, 255, 255, 0.06)`
- **Border Radius:** `12px`
- **Padding:** `16px`
- **Text Color:** `#FFFFFF`
- **Font:** SatoshiFont, 16px, weight 400
- **Line Height:** `24px`
- **Min Height:** `329px`
- **Box Shadow:** `none`
- **Hover State:** Border `rgba(255, 255, 255, 0.12)`, background `rgba(13, 11, 40, 0.8)`
- **Active State:** Background `rgba(13, 11, 40, 1)`, border `rgba(255, 255, 255, 0.15)`

#### Content Card
- **Background:** `rgba(13, 11, 40, 0.6)`
- **Border:** `1px solid rgba(255, 255, 255, 0.06)`
- **Border Radius:** `12px`
- **Padding:** `24px`
- **Backdrop Filter:** `blur(10px)`
- **Text Color:** `#FFFFFF`
- **Line Height:** `24px`

### Inputs & Forms

#### Text Input
- **Background:** `rgba(255, 255, 255, 0.05)`
- **Border:** `1px solid rgba(255, 255, 255, 0.12)`
- **Border Radius:** `6px`
- **Padding:** `12px 16px`
- **Text Color:** `#FFFFFF`
- **Font:** SatoshiFont, 14px, weight 400
- **Line Height:** `20px`
- **Placeholder Color:** `#C4C2D6`
- **Focus State:** Border `#2F39BA`, background `rgba(47, 57, 186, 0.05)`, outline `none`
- **Error State:** Border `#EB4F2B`, background `rgba(235, 79, 43, 0.05)`
- **Disabled:** Background `rgba(255, 255, 255, 0.02)`, text `#C4C2D6`, pointer-events `none`

#### Checkbox / Radio
- **Default:** Border `1px solid #C4C2D6`, background `transparent`
- **Checked:** Background `#2F39BA`, border `#2F39BA`, checkmark `#FFFFFF`
- **Hover:** Border `#FFFFFF`
- **Focus:** Border `#FF5EC4`, box-shadow `0 0 0 3px rgba(255, 94, 196, 0.2)`

### Navigation

#### Top Navigation Bar
- **Background:** `#060419`
- **Height:** `64px`
- **Padding:** `8px 128px`
- **Border Bottom:** `1px solid rgba(255, 255, 255, 0.06)`
- **Display:** `flex`, `align-items: center`, `justify-content: space-between`

#### Navigation Link
- **Text Color:** `#FFFFFF`
- **Font:** SatoshiFont, 16px, weight 400
- **Line Height:** `24px`
- **Padding:** `8px 0px`
- **Hover State:** Text `#FF5EC4`, border-bottom `1px solid #FF5EC4`
- **Active State:** Text `#FF5EC4`, border-bottom `2px solid #FF5EC4`

#### Dropdown Menu
- **Background:** `#0D0B28`
- **Border:** `1px solid rgba(255, 255, 255, 0.12)`
- **Border Radius:** `8px`
- **Padding:** `8px 0px`
- **Box Shadow:** `0 10px 25px rgba(0, 0, 0, 0.3)`
- **Backdrop Filter:** `blur(20px)`

#### Dropdown Item
- **Padding:** `12px 16px`
- **Text Color:** `#FFFFFF`
- **Font:** SatoshiFont, 14px, weight 400
- **Hover:** Background `rgba(255, 94, 196, 0.1)`, text `#FF5EC4`

### Links

#### Inline Link
- **Text Color:** `#FF5EC4`
- **Font:** SatoshiFont, 14px, weight 400
- **Text Decoration:** `none`
- **Border Bottom:** `1px solid transparent`
- **Hover State:** Border-bottom `1px solid #FF5EC4`
- **Active State:** Opacity `0.8`
- **Visited:** Text `#D4D7F5`

#### External Link
- **Text Color:** `#2F39BA`
- **Font:** SatoshiFont, 14px, weight 500
- **Icon:** Add external-link icon after text

## 5. Layout Principles

### Spacing System

**Base Unit:** `4px`

**Scale:**
- **Micro:** `4px` — Gap between inline elements, tight spacing
- **Extra Small:** `8px` — Padding within components, small gaps
- **Small:** `12px` — Padding inside buttons, card gaps
- **Medium:** `16px` — Card padding, section margins
- **Large:** `20px` — Padding within cards, moderate spacing
- **Extra Large:** `24px` — Gap between feature cards, section spacing
- **XXL:** `32px` — Spacing between major sections
- **XXXL:** `48px` — Spacing between page sections
- **Hero Spacing:** `64px` — Between hero and content
- **Vertical Spacing:** `80px` — Between major vertical sections

**Usage Context:**
- Interior padding on buttons: `12px horizontal, 8px vertical`
- Card padding: `16px`
- Section margins: `48px top/bottom`
- Page margins: `64px horizontal, 80px vertical`

### Grid & Container

- **Max Width:** `1440px`
- **Desktop Columns:** `12 columns` with `16px` gutter
- **Tablet Columns:** `8 columns` with `12px` gutter
- **Mobile Columns:** `4 columns` with `8px` gutter
- **Standard Container:** `padding: 0 64px` (desktop), `0 32px` (tablet), `0 16px` (mobile)
- **Content Section:** Max width `1200px`, centered with auto margins
- **Hero Section:** Full width, padding `80px 64px 64px` (desktop)
- **Feature Grid:** 3 columns on desktop, 2 on tablet, 1 on mobile with `24px` gap

### Whitespace Philosophy

The design embraces generous whitespace as a core principle, avoiding visual clutter and allowing premium positioning of content. Each section is given breathing room; cards are intentionally separated by negative space rather than borders. Navigation has minimal density; text has substantial line height. This creates a sense of spaciousness and luxury, communicating confidence and accessibility. Dark mode benefits from this approach—more white space emphasizes the content within darker containers.

### Border Radius Scale

- **None:** `0px` — Sharp edges, typography, minimal borders
- **Extra Small:** `4px` — Link badges, very small UI elements
- **Small:** `6px` — Input fields, small buttons, secondary components
- **Medium:** `8px` — Dropdown menus, smaller cards
- **Large:** `12px` — Feature cards, main content containers
- **Extra Large:** `16px` — Large modals, prominent containers
- **Pill / Fully Rounded:** `9999px` — Primary buttons, toggle switches, rounded badges

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (0) | No shadow, flat background | Default buttons, inline text, base elements |
| Raised (1) | `0 2px 4px rgba(0, 0, 0, 0.1)` | Subtle cards, secondary components, hover states |
| Floating (2) | `0 4px 12px rgba(0, 0, 0, 0.2)` | Interactive cards, dropdowns, elevated surfaces |
| Modal (3) | `0 10px 25px rgba(0, 0, 0, 0.3)` | Modal backgrounds, overlays, dropdown menus |
| Prominent (4) | `0 20px 40px rgba(0, 0, 0, 0.4)` | Full-screen modals, floating elements, max elevation |

**Shadow Philosophy:** Shadows are used sparingly on dark backgrounds where contrast is naturally high. Elevation is primarily communicated through transparency layers, borders, and slight background color variation rather than shadow depth. This maintains the premium, subtle aesthetic while keeping the interface clean. When shadows are used, they employ soft, large blur radii with low opacity to create gentle depth rather than hard definition.

## 7. Do's and Don'ts

### Do

- **Prioritize contrast:** Text and interactive elements must maintain at least 4.5:1 contrast ratio against their backgrounds
- **Use semantic colors consistently:** Magenta for primary actions and brand moments; Blue for secondary interactions; Red only for errors
- **Embrace whitespace:** Let content breathe; generous padding and margins create premium feel and improve scannability
- **Maintain typography hierarchy:** Use the defined size and weight combinations; resist arbitrary font sizing that weakens hierarchy
- **Layer with transparency:** Use `rgba()` with opacity for depth and hover states rather than solid color changes
- **Respect the dark aesthetic:** Keep backgrounds dark (`#060419`, `#0D0B28`); ensure sufficient contrast on light text
- **Use border radius intentionally:** Buttons are fully rounded (`9999px`); cards use `12px`; inputs use `6px`
- **Group related elements:** Use consistent spacing to visually relate components; separation implies no relationship
- **Design for accessibility:** Test color combinations, ensure keyboard navigation, provide focus states on all interactive elements
- **Extend responsively:** Test layouts at breakpoints; maintain proportional spacing, never collapse below readable sizes

### Don't

- **Don't mix accent colors arbitrarily:** Magenta and Blue have specific semantic meanings; use one per interaction zone
- **Don't reduce contrast for aesthetic effect:** Text must remain readable; dark-on-dark or light-on-light combinations fail accessibility
- **Don't collapse spacing below defined minimums:** `8px` is the smallest usable padding; `16px` is standard for cards
- **Don't use shadows to create depth on dark backgrounds:** Rely on color, transparency, and borders instead; shadows become invisible
- **Don't override typography hierarchy:** Ignore the defined font sizes and weights; custom sizing creates visual confusion
- **Don't apply border radius inconsistently:** Follow the defined scale; arbitrary radius values fragment the design language
- **Don't use Red outside of errors:** Error Red (`#EB4F2B`) is reserved for validation failures and destructive actions only
- **Don't add transparency to text directly:** Use opacity only on containers and backgrounds; text should remain solid-colored for readability
- **Don't overcomplicate the component hierarchy:** Keep components simple; nesting too many layers breaks the clean aesthetic
- **Don't ignore focus states:** Every interactive element needs clear focus indication for keyboard navigation and accessibility

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|------------|
| Mobile | 320px–767px | Single column, `4px` gutter, `16px` padding, full-width cards |
| Tablet | 768px–1023px | 2–3 columns, `12px` gutter, `32px` padding, stacked navigation |
| Desktop | 1024px–1439px | 3–4 columns, `16px` gutter, `64px` padding, horizontal navigation |
| Large Desktop | 1440px+ | Max width constraint at `1440px`, centered with auto margins |

### Touch Targets

- **Minimum Interactive Size:** `48px × 48px` (WCAG standard)
- **Comfortable Button:** `50px × 50px` (primary CTAs)
- **Small Button/Link:** `36px × 36px` (secondary, sufficient for touch)
- **Padding Around Targets:** `8px` minimum gap between adjacent clickable elements
- **Text Link Padding:** `8px 4px` to expand tap area without visual enlargement
- **Icon Button:** `44px × 44px` with internal icon scaling

### Collapsing Strategy

**Typography:**
- H1: 60px (desktop) → 48px (tablet) → 36px (mobile)
- H2: 48px (desktop) → 36px (tablet) → 28px (mobile)
- H3: 18px (desktop) → 16px (tablet) → 14px (mobile)
- Body: 16px (desktop) → 15px (tablet) → 14px (mobile)

**Spacing:**
- Section margins: 80px (desktop) → 48px (tablet) → 32px (mobile)
- Card padding: 16px (desktop) → 12px (tablet) → 8px (mobile)
- Navigation padding: 128px horizontal (desktop) → 64px (tablet) → 16px (mobile)

**Layouts:**
- Feature grid: 3 columns (desktop) → 2 columns (tablet) → 1 column (mobile)
- Navigation: Horizontal menu (desktop/tablet) → Hamburger menu (mobile, drawer slides from left)
- Hero section: Side-by-side text/image (desktop) → Stacked (mobile)
- Buttons: Full width or side-by-side depending on space; stack vertically on mobile

**Images & Icons:**
- Illustrations scale proportionally; maintain aspect ratio
- Icons: 24px (standard), 32px (large buttons), 16px (small inputs)
- Hero images: 100% width on mobile, constrained max-width on desktop

## 9. Agent Prompt Guide

### Quick Color Reference

- **Primary CTA:** Bright White (`#FFFFFF`) on backgrounds `#0D0B28` or `#060419`
- **Brand Accent:** Electric Magenta (`#FF5EC4`) for highlights, hover, featured content
- **Secondary Interactive:** Royal Blue (`#2F39BA`) for form focus, secondary CTAs
- **Background:** Deep Navy (`#060419`) for page background; `#0D0B28` for cards
- **Text / Heading:** Near Black (`#000000`) for light surfaces; Bright White (`#FFFFFF`) for dark
- **Secondary Text:** Medium Gray (`#C4C2D6`) for muted information
- **Error:** Error Red (`#EB4F2B`) for validation failures and alerts
- **Border:** Transparent White (`rgba(255, 255, 255, 0.06)`) for subtle card borders

### Iteration Guide

1. **Start with a dark background:** Use `#060419` for page background or `#0D0B28` for card surfaces; ensure all text is light enough for contrast
2. **Apply semantic colors to interactive elements:** Magenta (`#FF5EC4`) for primary CTAs and brand moments; Blue (`#2F39BA`) for secondary interactions; Red (`#EB4F2B`) only for errors
3. **Use consistent spacing from the defined scale:** Minimum `8px`, standard `16px` for padding, `24px` gaps between cards, `48px` between sections
4. **Define typography hierarchy with ClashGroteskFont (headings) and SatoshiFont (body):** H1 60px weight 700, body 14px weight 500; never deviate from defined sizes
5. **Apply border radius consistently:** Buttons `9999px`, cards `12px`, inputs `6px`, dropdowns `8px`
6. **Layer depth with transparency, not shadow:** Use `rgba()` overlays and subtle border changes; reserve shadows for dropdowns and modals only
7. **Ensure all interactive elements have hover, active, and focus states:** Hover typically lightens or adds color; focus adds a colored outline or border
8. **Test contrast ratios:** Text on background must achieve 4.5:1 minimum WCAG AA compliance
9. **Maintain whitespace discipline:** Don't collapse spacing below breakpoint minimums; generous breathing room is part of the brand
10. **Verify responsive scaling:** Typography and spacing adapt per breakpoint; layouts collapse to single column on mobile, maintain 3-column grids on desktop