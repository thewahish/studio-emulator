# Studio Emulator

**Domain:** Research-Development
**Status:** Active
**Priority:** Medium

Professional 3D audio studio designer and acoustic room planner. Interactive web application for designing recording studios, control rooms, and acoustic spaces with real-time 3D visualization.

---

## Overview

Studio Emulator is a browser-based 3D design tool for audio professionals to plan and visualize recording studio layouts. Features equipment placement, room acoustics simulation, and lighting configuration with Three.js WebGL rendering.

## Live Demo

**Open:** [https://thewahish.github.io/studio-emulator](https://thewahish.github.io/studio-emulator)

---

## Features

### Room Design
- Configurable room dimensions (width, length, height)
- 3D visualization with orbit controls
- Light/dark theme toggle
- Real-time rendering

### Equipment Library
- **Mixing Console** - 2m x 1m control surface
- **Studio Monitors** - Reference speakers
- **Equipment Rack** - 19" rack units
- **Microphone Stand** - Adjustable positioning
- **Studio Desk** - Production furniture
- **Studio Chair** - Ergonomic seating

### Interactive Features
- Drag-and-drop equipment placement
- Equipment selection and highlighting
- Context menu for object actions
- Hover preview system

### Acoustic Design
- Acoustic treatment placement
- Room absorption configuration
- Treatment zone visualization

### Lighting System
- Ambient lighting control (0-100%)
- Spotlight positioning
- Real-time lighting preview

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.0.0 | UI components and state |
| **Three.js** | 0.128.0 | 3D WebGL rendering |
| **JavaScript** | ES6+ | Application logic |
| **HTML5/CSS3** | - | Interface styling |
| **Python** | 3.x | Local development server |

---

## Project Structure

```
studio-emulator/
├── public/
│   └── index.html            # Application entry point
│
├── src/
│   └── StudioEmulator.js     # Main React component (1500+ lines)
│       ├── Room rendering
│       ├── Equipment catalog
│       ├── Drag-and-drop system
│       ├── Lighting controls
│       └── Acoustic treatments
│
├── package.json              # Dependencies and scripts
├── package-lock.json         # Dependency lock
├── QUICKSTART.md             # Quick start guide
├── CHANGELOG.md              # Version history
├── LICENSE                   # License file
│
├── CLAUDE.md                 # AI project instructions
├── quest-status.json         # Progress tracking
└── README.md                 # This file
```

---

## Architecture

### State Management
```javascript
// Room configuration
const [roomDimensions, setRoomDimensions] = useState({
    width: 6,   // meters
    length: 8,
    height: 3
});

// Equipment tracking
const [equipment, setEquipment] = useState([]);
const [selectedEquipment, setSelectedEquipment] = useState(null);

// Lighting configuration
const [lighting, setLighting] = useState({
    ambient: 0.4,
    spotlights: []
});
```

### Equipment Catalog
Each equipment item defines:
- `name` - Display name
- `width`, `depth`, `height` - Dimensions in meters
- `color` - Three.js hex color

### 3D Rendering
- Canvas-based Three.js scene
- Orbit controls for camera navigation
- Raycaster for object selection
- Real-time mesh updates

---

## Getting Started

### Quick Start
```bash
# Clone repository
git clone https://github.com/thewahish/studio-emulator.git
cd studio-emulator

# Start development server
npm start
# or
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

### Development Scripts
```bash
npm start    # Start local server on port 8000
npm run dev  # Development mode (same as start)
```

---

## Usage Guide

### Designing a Studio
1. **Set Room Size** - Configure width, length, height
2. **Add Equipment** - Select from catalog and place
3. **Position Items** - Drag equipment to desired locations
4. **Configure Lighting** - Adjust ambient and spotlights
5. **Add Treatments** - Place acoustic panels

### Controls
- **Left Click** - Select equipment
- **Right Click** - Context menu
- **Drag** - Move equipment
- **Scroll** - Zoom camera
- **Click + Drag (empty)** - Orbit camera

---

## Equipment Specifications

| Equipment | Dimensions (m) | Color |
|-----------|---------------|-------|
| Mixing Console | 2.0 x 1.0 x 0.2 | #2c3e50 |
| Studio Monitor | 0.3 x 0.25 x 0.4 | #1a1a1a |
| Equipment Rack | 0.6 x 0.6 x 2.0 | #34495e |
| Mic Stand | 0.3 x 0.3 x 1.5 | #7f8c8d |
| Studio Desk | 1.8 x 0.8 x 0.75 | #8b4513 |
| Studio Chair | (variable) | (variable) |

---

## Related Projects

| Project | Relationship |
|---------|-------------|
| `syria-ministry-pa-system` | Audio system design |
| `obai-ai-platform` | AI-assisted design |

---

## GitHub Repository

[https://github.com/thewahish/studio-emulator](https://github.com/thewahish/studio-emulator)

---

**Developer:** Obai Sukar
**Last Updated:** December 27, 2025
