# App Style Guide

## Overview
The application uses a "Therapeutic Dark Mode" aesthetic, designed to be calming and non-intrusive for users in potentially dim environments (e.g., hospital break rooms). The design relies on glassmorphism, soft gradients, and smooth animations to create a premium, reassuring feel.

## Design Tokens (CSS Variables)

### Colors
- **Primary**: `hsl(200, 100%, 60%)` (Calming Blue)
- **Secondary**: `hsl(260, 100%, 65%)` (Soft Purple)
- **Accent**: `hsl(280, 100%, 70%)` (Lavender)
- **Background Dark**: `hsl(240, 15%, 8%)` (Deep Blue-Grey)
- **Background Glass**: `rgba(255, 255, 255, 0.05)` (Subtle Translucency)
- **Text Primary**: `hsl(0, 0%, 98%)` (Off-White)
- **Text Secondary**: `hsl(0, 0%, 70%)` (Light Grey)

### Typography
- **Font Family**: 'Inter', system-ui, sans-serif
- **Headings**: Font weight 600, line height 1.2
- **Body**: Font weight 400, line height 1.6

### Spacing
- **xs**: 0.5rem
- **sm**: 1rem
- **md**: 1.5rem
- **lg**: 2rem
- **xl**: 3rem

### Border Radius
- **sm**: 0.5rem
- **md**: 1rem
- **lg**: 1.5rem
- **full**: 9999px

## Component Styles

### Buttons
- **Primary Button (`.continue-btn`)**:
  - Background: Linear gradient (135deg, #22d3ee, #3b82f6)
  - Text: White, weight 600
  - Padding: `var(--space-md)`
  - Radius: `var(--radius-full)`
  - Hover: TranslateY -2px, increased shadow
  - Active: TranslateY 0
- **Crisis Button (`.crisis-btn`)**:
  - Background: Linear gradient (135deg, #ef4444, #b91c1c)
  - Same shape/hover effects as Primary Button

### Containers (`.checkpoint-content`)
- Max-width: 600px (typically)
- Centered horizontally (`margin: 0 auto`)
- Text alignment: Center (default), Left (for specific content like Disclaimer)

### Glassmorphism
- Used for cards and overlays
- Background: `var(--bg-glass)`
- Backdrop Filter: `blur(10px)`
- Border: `1px solid rgba(255, 255, 255, 0.1)`

## Animation Guidelines (Framer Motion)

### Page Transitions
- **Entry**: Slide up and fade in
  ```javascript
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  ```
- **Exit**: Slide down and fade out
  ```javascript
  exit={{ opacity: 0, y: 20 }}
  transition={{ duration: 0.6 }}
  ```

### Micro-interactions
- **Hover**: `whileHover={{ scale: 1.05 }}`
- **Tap**: `whileTap={{ scale: 0.95 }}`
- **Springs**: Use `type: 'spring', stiffness: 300` for bouncy elements like the SUDS score.

## Layout Consistency
- Ensure buttons in the same group have equal width (use a container if necessary).
- Use `clamp()` for responsive font sizes on titles.
- Always verify alignment on larger screens (ensure `max-width` containers are centered).
