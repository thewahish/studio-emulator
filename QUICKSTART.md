# 🚀 Quick Start Guide

Get Studio Emulator running in under 2 minutes!

---

## ⚡ 30-Second Start

### Option 1: Direct Open (Fastest)
```bash
# Just open the HTML file
open public/index.html
```

That's it! The app will open in your default browser.

---

## 🖥️ 2-Minute Start (Recommended)

### Step 1: Start Local Server
```bash
# Navigate to project
cd studio-emulator

# Start Python server
python3 -m http.server 8000
```

### Step 2: Open Browser
Visit: `http://localhost:8000/public/`

---

## 🎮 First Steps Tutorial

### 1. Explore the 3D View (30 seconds)
- **Click and drag** on the dark canvas to rotate the view
- **Mouse wheel** to zoom in and out
- You'll see an empty studio room with grid floor

### 2. Add Your First Equipment (30 seconds)
- Look at the right panel under **"🎛️ Studio Equipment"**
- Click **"Console"** button
- A mixing console appears in the center of the room
- Click **"Monitor"** to add studio monitors

### 3. Position Equipment (1 minute)
- In the **"📦 Equipment in Studio"** section
- Click **"Edit"** on any equipment
- Adjust **X, Y, Z** positions (try different values)
- Use the **Rotation** slider to turn equipment
- Click **"Done"** when finished

### 4. Add Acoustic Treatment (30 seconds)
- Scroll to **"🎨 Acoustic Treatments"**
- Click **"Bass Trap"** (adds purple panels)
- Click **"Absorber"** (adds blue panels)
- Watch the treatment counter update

### 5. Customize Room (30 seconds)
- Scroll to **"📐 Room Dimensions"**
- Adjust **Width**, **Length**, **Height**
- Watch the room resize in real-time
- See calculations update automatically

---

## 📱 Controls Reference

| Action | Control |
|--------|---------|
| Rotate View | Click + Drag |
| Zoom In/Out | Mouse Wheel |
| Add Equipment | Click Equipment Button |
| Edit Equipment | Click "Edit" in List |
| Remove Item | Click "Remove" Button |
| Adjust Position | Use X/Y/Z Inputs |
| Rotate Item | Use Rotation Slider |

---

## 🎯 Try These Scenarios

### Scenario 1: Podcast Studio (2 minutes)
1. Set room to: 4m × 5m × 2.8m
2. Add: Studio Desk
3. Add: 2× Mic Stand
4. Add: Studio Chair
5. Add: 4× Absorber (for walls)
6. Position mics across desk from each other

### Scenario 2: Home Recording Studio (3 minutes)
1. Set room to: 5m × 6m × 3m
2. Add: Studio Desk
3. Add: Mixing Console
4. Add: 2× Studio Monitor
5. Add: Equipment Rack
6. Add: Keyboard Stand
7. Add: Bass Traps in corners
8. Add: Diffusers on rear wall

### Scenario 3: Professional Mix Room (5 minutes)
1. Set room to: 6m × 8m × 3.2m
2. Add: Large Studio Desk
3. Add: Mixing Console
4. Add: 2× Studio Monitor (position wide)
5. Add: 2× Equipment Rack
6. Add: Studio Chair
7. Add: 4× Bass Trap (corners)
8. Add: 8× Absorber (walls)
9. Add: 2× Ceiling Cloud
10. Add: Diffusers on rear wall

---

## 🔧 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Scroll | Zoom In/Out |
| Drag | Rotate View |
| F5 | Refresh/Reset |

*Note: More shortcuts coming in future versions*

---

## 💡 Pro Tips

1. **Start Small**: Begin with basic room dimensions and add equipment gradually
2. **Use Grid**: The floor grid helps with spacing and alignment
3. **Symmetric Setup**: Most studios benefit from symmetrical monitor placement
4. **Corner Traps**: Always add bass traps to room corners first
5. **Zoom Out**: Zoom out to see full room, zoom in for detail work
6. **Rotation**: Use rotation slider for precise equipment angling
7. **Room Modes**: Keep fundamental frequency below 40Hz for best bass

---

## ❓ Common Questions

### Q: Equipment not visible?
**A:** Zoom out - it might be at (0,0,0) center position.

### Q: Can't rotate view?
**A:** Make sure you're clicking on the black canvas area, not the controls panel.

### Q: How do I save my design?
**A:** Currently manual - take screenshots. Save/Load feature coming in v1.1.

### Q: Room too small/large?
**A:** Adjust dimensions in "Room Dimensions" section (3-20m range).

### Q: Wrong equipment added?
**A:** Click "Remove" button next to the equipment in the list.

### Q: How to move equipment?
**A:** Click "Edit", adjust X/Y/Z values, then click "Done".

---

## 🆘 Troubleshooting

### Black screen?
- Ensure WebGL is enabled in your browser
- Try Chrome/Firefox if using Safari
- Update your graphics drivers

### Slow performance?
- Close other browser tabs
- Limit equipment count to <30 items
- Use smaller room dimensions
- Disable shadows in browser settings

### Can't see controls?
- Scroll down in the right panel
- Try full-screen browser mode
- Zoom out your browser (Cmd/Ctrl + -)

---

## 📚 Next Steps

Once comfortable with basics:

1. Read the full [README.md](README.md) for advanced features
2. Check [CHANGELOG.md](CHANGELOG.md) for version history
3. Explore acoustic calculations section
4. Experiment with lighting controls
5. Try building real-world studio layouts

---

## 🎓 Learning Resources

### Acoustic Design
- Room modes and standing waves
- Bass trap placement strategies
- Absorption vs. diffusion
- Optimal listening positions

### Studio Layout
- Equipment ergonomics
- Cable management planning
- Workflow optimization
- Multi-purpose room design

---

## 🌟 Example Workflows

### Workflow 1: Quick Concept
1. Open app (30s)
2. Set rough dimensions (30s)
3. Add main equipment (1m)
4. Take screenshot (10s)
**Total: 2 minutes**

### Workflow 2: Detailed Plan
1. Measure real room (5m)
2. Enter exact dimensions (1m)
3. Add all equipment (5m)
4. Position precisely (10m)
5. Add all treatments (5m)
6. Document with screenshots (2m)
**Total: 28 minutes**

### Workflow 3: Client Presentation
1. Build multiple variants (30m)
2. Screenshot each version (5m)
3. Add annotations in image editor (10m)
4. Present options to client (meeting)
**Total: 45 minutes + meeting**

---

## 🎪 Demo Projects

Check out the `docs/examples/` folder (coming soon) for:
- Sample studio layouts
- Pre-configured setups
- Industry-standard designs
- Genre-specific studios

---

## 🔗 Quick Links

- [Full Documentation](README.md)
- [Feature Roadmap](CHANGELOG.md#unreleased)
- [GitHub Issues](https://github.com/obaisukar/studio-emulator/issues)
- [Developer Info](README.md#-developer)

---

**Ready to design? Let's build your perfect studio! 🎵**

*Studio Emulator - Design. Visualize. Create.*
