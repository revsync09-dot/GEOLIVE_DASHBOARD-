# GeoLive Dashboard Design Guidelines

## Design Approach
**Reference-Based**: Inspired by premium dark dashboards with glassmorphic aesthetics. The design must match the reference screenshot: dark, premium, glossy, card-based with gradient backgrounds, rounded tiles, glowing buttons, and polished modern UI.

## Core Design Principles

### Dark Mode + Glassmorphism Foundation
- **Primary style**: `backdrop-blur-lg`, `bg-white/5`, `rounded-2xl`, `shadow-xl`
- **Background**: Deep dark base with soft neon gradients (purple/blue/orange)
- **Glass effect**: Semi-transparent cards with blur for depth and premium feel
- **Borders**: Subtle, soft borders on glass containers

### Typography System

**Primary Font**: Inter or similar modern sans-serif via Google Fonts CDN

**Hierarchy**:
- **Page Titles**: Use thin Unicode styling - 𝙂𝙚𝙤𝙇𝙞𝙫𝙚 𝘿𝙖𝙨𝙝𝙗𝙤𝙖𝙧𝙙, 𝙂𝙚𝙤𝙇𝙞𝙫𝙚 𝙎𝙚𝙧𝙫𝙚𝙧𝙨, 𝙂𝙚𝙤𝙇𝙞𝙫𝙚 𝙎𝙚𝙩𝙩𝙞𝙣𝙜𝙨
- **Section Headers**: font-light, text-lg to text-2xl
- **Card Titles**: font-medium, text-base
- **Body Text**: font-normal, text-sm
- **Labels**: font-medium, text-xs, uppercase tracking

### Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, and 8 consistently
- Component padding: `p-6` to `p-8`
- Section spacing: `gap-6` to `gap-8`
- Page margins: `px-8`, `py-6`

**Responsive Grid**:
- Server cards grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- Settings page: Two-column layout on desktop (`lg:grid-cols-2`), single column mobile

## Component Library

### Navigation Components

**Sidebar** (Left):
- Fixed width ~240px on desktop, collapsible on mobile
- Dark glass background with blur
- Navigation items: Dashboard, Servers, Bot Settings, Support, Premium
- Each item with icon (Lucide React) + label
- Active state: gradient background accent
- Icons: House, Server, Settings, HelpCircle, Crown

**Navbar** (Top):
- Sticky positioning
- Glass background with blur
- Right-aligned user section: Avatar (rounded-full) + Username + Logout button
- Height: ~64px

### Guild/Server Cards

**Specifications**:
- Dimensions: `200x200px` tiles
- `rounded-2xl` corners
- Blurred glass background
- Gradient overlay (purple to blue)
- **Structure**:
  - Guild icon: Centered circular avatar (96px)
  - Guild name: Bottom section, centered, truncated
  - "Setup" button: Gradient button at bottom
- **Hover effect**: Glow shadow + `scale-105` transform
- **Card background**: `bg-gradient-to-br from-purple-500/20 to-blue-500/20`

### Buttons

**Primary Style**: `rounded-full`, gradient background with glow
- Default: `bg-gradient-to-r from-indigo-500 to-purple-500`
- Sizing: `px-5 py-2` for normal, `px-6 py-3` for large
- Hover: `hover:scale-105` transform
- Shadow: `shadow-lg` with colored glow matching gradient
- Text: `text-white font-medium`

**Secondary Style**: Glass button with border
- `bg-white/10 border border-white/20 rounded-full`

### Form Components

**Input Fields**:
- `bg-white/5 border border-white/20 rounded-lg`
- Focus: `focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50`
- Padding: `px-4 py-2.5`

**Toggle Switches**: Gradient when enabled, gray when disabled
**Color Picker**: Rounded with preview swatch
**Select Dropdowns**: Glass style matching inputs

### Widget Cards

**Live Data Widgets** (Weather, Earthquakes, ISS, Aurora):
- Glass card: `backdrop-blur-lg bg-white/5 rounded-xl p-6`
- Icon at top (64px, gradient colored)
- Data value: Large, bold display
- Label: Small, muted text below
- Border: `border border-white/10`

**Embed Preview Card**:
- Shows live preview of Discord embed styling
- Updates in real-time as user changes color/icon/banner
- Matches Discord's embed structure with user's custom primary color

### Content Sections

**Login Page**:
- Centered card layout
- Large GeoLive logo at top (150px height)
- Purple glow effect behind logo
- "Login with Discord" gradient button
- Minimalistic glass card container

**Dashboard Page**:
- Welcome message with username
- Search bar for guild filtering (glass style, magnifying glass icon)
- Grid of server cards with generous spacing

**Guild Settings Page**:
- Two-column layout (desktop):
  - **Left**: Settings forms (Feed toggles, interval selector, embed customization)
  - **Right**: Live geo widgets stacked vertically
- Each settings section in glass card
- Clear section headers with icons

### Notifications

**Toast Notifications**:
- Position: Top-right
- Style: Glass with colored left border (green for success, red for error)
- Animation: Slide in from right
- Duration: 3-5 seconds auto-dismiss

## Visual Effects

**Gradients**:
- Hero/Background: Radial purple to blue
- Cards: Subtle purple/blue/orange overlays
- Buttons: Indigo to purple, pink to orange variations

**Shadows & Glows**:
- Standard cards: `shadow-xl`
- Hover effects: `shadow-2xl` with colored glow
- Buttons: Glow matching gradient color

**Animations**: Minimal, only for:
- Button hover scale (0.2s ease)
- Card hover glow (0.3s ease)
- Toast slide-in (0.3s ease)

## Icons
**Library**: Lucide React via CDN
**Usage**: Consistent 20px-24px sizing, matched to text color or gradient overlays