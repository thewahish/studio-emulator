# 🎵 Studio Emulator

**Professional Audio Studio Designer & Acoustic Room Planner**

A comprehensive 3D studio design tool combining sound engineering expertise with cutting-edge web technology. Design your perfect recording studio with real-time visualization, acoustic calculations, and professional equipment placement.

---

## 🌟 Overview

Studio Emulator is a web-based 3D studio design tool that allows audio professionals, podcasters, musicians, and home studio builders to:

- Design studio spaces with customizable room dimensions
- Place professional audio equipment in 3D space
- Add and position acoustic treatments
- Visualize room acoustics and calculations
- Plan optimal listening positions and speaker placement
- Control studio lighting and ambiance

Built with React and Three.js, this tool brings professional studio design capabilities to your browser.

---

## ✨ Key Features

### 🏗️ 3D Room Design
- **Customizable Dimensions**: Width, length, and height adjustable from 3-20m
- **Real-time 3D Visualization**: Interactive camera controls with drag-to-rotate and zoom
- **Professional Materials**: Realistic studio floor, walls, and ceiling rendering
- **Grid System**: Precision placement with visual grid helper

### 🎛️ Studio Equipment Library
- **Mixing Console**: Full-size recording console (2m x 1m)
- **Studio Monitors**: Professional nearfield/midfield monitors
- **Equipment Racks**: Standard 19" equipment racks (2m height)
- **Microphone Stands**: Adjustable boom and straight stands
- **Studio Desk**: Producer/engineer workstation (1.8m x 0.8m)
- **Studio Chair**: Ergonomic producer chair
- **Keyboard Stand**: Synthesizer/piano stand
- **Guitar Stand**: Instrument storage

### 🎨 Acoustic Treatment System
- **Bass Traps**: Corner and flat-panel bass absorption (purple)
- **Absorber Panels**: Mid/high frequency absorption (blue)
- **Diffusers**: Sound diffusion panels (red)
- **Ceiling Clouds**: Overhead acoustic treatment (gray)

### 📊 Acoustic Calculations
- **Room Volume**: Automatic cubic meter calculation
- **Fundamental Frequency**: Lowest room mode calculation
- **Treatment Coverage**: Real-time treatment tracking
- **Equipment Count**: Studio inventory management

### 💡 Studio Lighting Control
- **Ambient Lighting**: Adjustable global illumination (0-100%)
- **Point Lights**: Dedicated equipment highlighting
- **Shadows**: Realistic shadow rendering
- **Studio Ambiance**: Professional mood lighting

### ⚙️ Advanced Controls
- **Equipment Positioning**: Precise XYZ coordinate control
- **Rotation System**: 360-degree equipment rotation
- **Drag & Drop**: Intuitive placement workflow
- **Edit Mode**: Detailed equipment adjustment panel
- **Remove/Delete**: Easy equipment and treatment management

---

## 🎯 Use Cases

### 🎙️ Recording Studios
- Design control rooms with optimal monitoring setups
- Plan tracking rooms with proper acoustic treatment
- Position equipment racks and outboard gear
- Calculate room modes for bass management

### 🎧 Podcasting Spaces
- Create intimate podcast recording environments
- Plan microphone placement for multiple hosts
- Design acoustic treatment for voice clarity
- Optimize desk and chair ergonomics

### 🎸 Home Studios
- Maximize small space efficiency
- Plan multi-purpose music production rooms
- Budget equipment placement before purchase
- Visualize before committing to renovations

### 📻 Broadcast Facilities
- Design radio station studios
- Plan DJ booth layouts
- Coordinate multiple workstation setups
- Ensure proper acoustic isolation

---

## 🚀 Getting Started

### Installation

No installation required! Studio Emulator runs entirely in your browser.

#### Option 1: Open Directly
```bash
# Simply open the index.html file in any modern browser
open public/index.html
```

#### Option 2: Local Server (Recommended)
```bash
# Navigate to project directory
cd studio-emulator

# Start Python HTTP server
python3 -m http.server 8000

# Open browser to http://localhost:8000/public/
```

#### Option 3: Deploy to Web Server
Upload the `public` and `src` directories to any web hosting service:
- GitHub Pages
- DigitalOcean App Platform
- Netlify
- Vercel
- AWS S3

### Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- WebGL support (enabled by default in most browsers)
- Mouse or trackpad for 3D navigation

---

## 📖 User Guide

### Navigation Controls
- **Rotate View**: Click and drag anywhere on the canvas
- **Zoom In/Out**: Use mouse wheel or trackpad pinch
- **Reset View**: Refresh the page

### Adding Equipment
1. Navigate to the "Studio Equipment" section in the right panel
2. Click on any equipment button (Console, Monitor, Rack, etc.)
3. Equipment appears at the center of the room (0,0,0)
4. Use the "Edit" button to adjust position and rotation

### Positioning Equipment
1. Select equipment from the "Equipment in Studio" list
2. Click "Edit" to open the adjustment panel
3. Adjust X, Y, Z coordinates using number inputs
4. Use the rotation slider for 360° rotation
5. Click "Done" to finish editing

### Adding Acoustic Treatments
1. Navigate to "Acoustic Treatments" section
2. Choose treatment type:
   - **Bass Trap** (Purple): For corner/wall bass absorption
   - **Absorber** (Blue): For mid/high frequency control
   - **Diffuser** (Red): For sound diffusion
   - **Ceiling Cloud** (Gray): For overhead treatment
3. Treatments appear on walls/ceiling automatically

### Adjusting Room Dimensions
1. Navigate to "Room Dimensions" section
2. Adjust Width, Length, and Height sliders
3. Watch real-time calculations update:
   - Room Volume (m³)
   - Fundamental Frequency (Hz)

### Lighting Control
1. Navigate to "Studio Lighting" section
2. Adjust ambient light intensity (0-100%)
3. See real-time lighting changes in 3D view

---

## 🏗️ Project Structure

```
studio-emulator/
│
├── public/
│   └── index.html          # Main HTML file with UI styles
│
├── src/
│   └── StudioEmulator.js   # React + Three.js application
│
├── docs/
│   └── (future documentation)
│
└── README.md              # This file
```

---

## 🛠️ Technical Stack

### Core Technologies
- **React 18**: Component-based UI framework
- **Three.js r128**: 3D graphics and WebGL rendering
- **Babel Standalone**: In-browser JSX transformation
- **Vanilla CSS**: Custom styling with gradients and animations

### Key Libraries
- `react`: ^18.0.0
- `react-dom`: ^18.0.0
- `three.js`: r128
- `@babel/standalone`: ^7.0.0

### Features Implemented
- Real-time 3D rendering with WebGL
- Shadow mapping for realistic lighting
- Interactive camera controls
- State management with React Hooks
- Responsive design principles
- Custom materials and textures

---

## 🎨 Design Philosophy

### Professional Aesthetics
- Dark theme optimized for extended use
- Purple accent colors (#8a2be2) for studio vibe
- High-contrast UI for visibility
- Smooth animations and transitions

### User Experience
- Intuitive controls requiring no tutorial
- Instant visual feedback
- Progressive disclosure of features
- Clear visual hierarchy
- Accessible design patterns

### Acoustic Focus
- Industry-standard room dimensions
- Real acoustic calculations
- Professional equipment sizing
- Accurate treatment placement

---

## 📊 Acoustic Calculations Explained

### Room Volume
```
Volume = Width × Length × Height
```
Indicates the total cubic space. Larger rooms (>50m³) generally have better bass response.

### Fundamental Frequency
```
F0 = Speed of Sound / (2 × Longest Dimension)
F0 = 343 m/s / (2 × Max(W, L, H))
```
The lowest room mode frequency. Rooms with F0 below 40Hz are ideal for mixing.

### Room Modes
Standing waves occur at multiples of F0. Critical for bass management and treatment placement.

---

## 🔮 Future Enhancements

### Phase 1 (Planned)
- [ ] RT60 reverberation time calculation
- [ ] Detailed room mode visualization
- [ ] Equipment cost estimation
- [ ] Save/Load studio configurations
- [ ] Export to PNG/PDF floor plans

### Phase 2 (Roadmap)
- [ ] Cable routing and management
- [ ] HVAC and ventilation planning
- [ ] Electrical outlet placement
- [ ] Door and window positioning
- [ ] Multi-room studio design

### Phase 3 (Advanced)
- [ ] Acoustic simulation (raytracing)
- [ ] Frequency response prediction
- [ ] SPL calculations
- [ ] Optimal listening position solver
- [ ] Budget optimizer

### Phase 4 (Professional)
- [ ] Collaboration features
- [ ] Cloud storage integration
- [ ] Equipment marketplace links
- [ ] Contractor export formats
- [ ] Mobile app version

---

## 👨‍💻 Developer

**Obai Sukar**
- LA Film School Sound Engineering Graduate
- Professional Audio Engineer
- Full-Stack Developer
- Studio Design Consultant

### Background
Combining decades of professional audio production experience with modern software development expertise. From recording Radio Al-Kul productions to building enterprise IT infrastructure at Synergy Senior Management, this project represents the intersection of audio engineering and technology.

---

## 🤝 Contributing

This is currently a personal project, but suggestions and feedback are welcome!

### How to Contribute
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### Areas for Contribution
- Additional equipment models
- Acoustic calculation improvements
- UI/UX enhancements
- Performance optimizations
- Documentation improvements

---

## 📝 License

Copyright © 2024 Obai Sukar

This project is currently unlicensed. All rights reserved.

For commercial use or licensing inquiries, please contact the developer.

---

## 🙏 Acknowledgments

### Inspiration
- **Milad Kawas**: Original 3D apartment builder concept
- **LA Film School**: Sound engineering foundations
- **Professional Audio Community**: Industry standards and best practices

### Technologies
- React Team: For the amazing UI framework
- Three.js Contributors: For powerful 3D graphics
- Open Source Community: For endless inspiration

---

## 📞 Support

### Getting Help
- Check the User Guide section above
- Review acoustic calculations explanations
- Ensure WebGL is enabled in your browser

### Known Issues
- Performance may vary on older hardware
- Mobile touch controls are optimized for desktop
- Very large rooms (>20m) may affect camera positioning

### Browser Compatibility
- ✅ Chrome/Chromium (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ Internet Explorer (not supported)

---

## 🎓 Learning Resources

### Audio Engineering
- Room acoustics fundamentals
- Studio design principles
- Equipment placement best practices
- Acoustic treatment strategies

### Web Development
- React Hooks and component patterns
- Three.js 3D programming
- WebGL rendering techniques
- State management strategies

---

## 📈 Project Stats

- **Lines of Code**: ~1,200+
- **Equipment Types**: 8
- **Treatment Types**: 4
- **Acoustic Calculations**: 2+
- **Development Time**: Built with AI assistance in 10 minutes
- **Technology Stack**: React + Three.js + Babel

---

## 🌐 Deployment

### GitHub Pages
```bash
# Build for GitHub Pages
git add .
git commit -m "Deploy Studio Emulator"
git push origin main
```

### DigitalOcean App Platform
1. Create new app from GitHub repo
2. Select `public` as document root
3. Deploy automatically on push

### Custom Domain
Point your domain to the deployed app for professional access:
```
studio-emulator.yourdomain.com
```

---

## 🔐 Security

No data is collected or transmitted. Everything runs locally in your browser:
- No server-side processing
- No analytics or tracking
- No cookies or local storage
- No external API calls

Your studio designs are completely private.

---

## ⚡ Performance

### Optimization Tips
- Limit equipment count to <50 items for best performance
- Use moderate room dimensions (6x8x3m typical)
- Close other browser tabs for smoother rendering
- Use hardware acceleration if available

### Rendering Statistics
- 60 FPS target on modern hardware
- ~2048px shadow map resolution
- Anti-aliasing enabled
- Soft shadows (PCF)

---

**Built with ❤️ and decades of audio engineering experience**

*Studio Emulator - Design. Visualize. Create.*
