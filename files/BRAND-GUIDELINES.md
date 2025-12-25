# VoteRank Brand Guidelines

## Brand Overview
VoteRank is a modern, accessible ranked-choice voting platform. The brand conveys trust, clarity, and democratic participation through clean design and vibrant colors.

---

## Logo

### Primary Logo
Use `logo-primary.svg` for light backgrounds. Features the icon mark (ranking bars + checkmark) alongside the wordmark.

### Dark Mode Logo
Use `logo-dark.svg` for dark backgrounds. Lighter color palette optimized for contrast.

### White Logo
Use `logo-white.svg` for overlays on images or colored backgrounds.

### Icon Mark
Use `icon-mark.svg` when space is limited. Square format works well for app icons and favicons.

### Clear Space
Maintain clear space around the logo equal to the height of the checkmark circle.

---

## Colors

### Primary Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Indigo 500 | `#6366F1` | Primary brand color |
| Violet 500 | `#8B5CF6` | Gradient end, accents |
| Indigo 600 | `#4F46E5` | Darker variant, hover states |

### Accent Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Emerald 500 | `#10B981` | Success, checkmarks, confirmations |
| Emerald 400 | `#34D399` | Gradient end for success elements |

### Neutral Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Gray 900 | `#111827` | Primary text (light mode) |
| Gray 800 | `#1F2937` | Secondary text |
| Gray 50 | `#F9FAFB` | Primary text (dark mode) |
| White | `#FFFFFF` | Backgrounds, logo on dark |

### Gradients

**Brand Gradient**
```css
background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
```

**Success Gradient**
```css
background: linear-gradient(135deg, #10B981 0%, #34D399 100%);
```

---

## Typography

### Primary Font
**System Font Stack**
```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Font Weights
- **Bold (700-800)**: Headlines, logo wordmark
- **Medium (500)**: Subheadings, buttons
- **Regular (400)**: Body text

---

## Icon System

The VoteRank icon consists of:
1. **Three horizontal bars** - Representing ranked choices (1st, 2nd, 3rd)
2. **Decreasing widths** - Visual hierarchy of preference
3. **Checkmark circle** - Confirming vote submission

### Opacity Levels
- First choice bar: 100%
- Second choice bar: 70%
- Third choice bar: 40%

---

## Asset Files

| File | Dimensions | Usage |
|------|------------|-------|
| `logo-primary.svg` | 400×100 | Website header, documents |
| `logo-dark.svg` | 400×100 | Dark mode interfaces |
| `logo-white.svg` | 400×100 | Colored backgrounds |
| `icon-512.svg` | 512×512 | App stores, high-res icons |
| `icon-mark.svg` | 100×100 | Compact icon usage |
| `favicon.svg` | 32×32 | Browser tabs |
| `og-image.svg` | 1200×630 | Social media sharing |
| `twitter-banner.svg` | 1500×500 | Twitter/X profile header |

---

## Usage Guidelines

### Do
- ✅ Use appropriate logo variant for background color
- ✅ Maintain minimum clear space
- ✅ Use brand gradients for primary UI elements
- ✅ Keep the icon mark proportions intact

### Don't
- ❌ Stretch or distort the logo
- ❌ Change brand colors
- ❌ Add effects like shadows or outlines
- ❌ Place logo on busy backgrounds without contrast
- ❌ Rotate or flip the logo

---

## Contact
For brand asset requests or questions, contact the VoteRank team.
