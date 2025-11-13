const { useState, useEffect, useRef } = React;

const StudioEmulator = () => {
    // Room dimensions state
    const [roomDimensions, setRoomDimensions] = useState({
        width: 6,
        length: 8,
        height: 3
    });

    // Equipment state
    const [equipment, setEquipment] = useState([]);
    const [selectedEquipment, setSelectedEquipment] = useState(null);

    // Acoustic treatments state
    const [treatments, setTreatments] = useState([]);

    // Lighting state
    const [lighting, setLighting] = useState({
        ambient: 0.4,
        spotlights: []
    });

    // Canvas ref
    const canvasRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const controlsRef = useRef(null);

    // Equipment catalog
    const equipmentCatalog = {
        'mixing-console': {
            name: 'Mixing Console',
            width: 2,
            depth: 1,
            height: 0.2,
            color: 0x2c3e50
        },
        'studio-monitor': {
            name: 'Studio Monitor',
            width: 0.3,
            depth: 0.25,
            height: 0.4,
            color: 0x1a1a1a
        },
        'equipment-rack': {
            name: 'Equipment Rack',
            width: 0.6,
            depth: 0.6,
            height: 2,
            color: 0x34495e
        },
        'mic-stand': {
            name: 'Microphone Stand',
            width: 0.3,
            depth: 0.3,
            height: 1.5,
            color: 0x7f8c8d
        },
        'studio-desk': {
            name: 'Studio Desk',
            width: 1.8,
            depth: 0.8,
            height: 0.75,
            color: 0x8b4513
        },
        'studio-chair': {
            name: 'Studio Chair',
            width: 0.6,
            depth: 0.6,
            height: 1.2,
            color: 0x2c3e50
        },
        'keyboard-stand': {
            name: 'Keyboard Stand',
            width: 1.4,
            depth: 0.4,
            height: 1,
            color: 0x34495e
        },
        'guitar-stand': {
            name: 'Guitar Stand',
            width: 0.4,
            depth: 0.4,
            height: 1.2,
            color: 0x2c3e50
        }
    };

    // Treatment catalog
    const treatmentCatalog = {
        'bass-trap': {
            name: 'Bass Trap',
            color: 0x8e44ad,
            size: 0.6
        },
        'absorber': {
            name: 'Absorber Panel',
            color: 0x3498db,
            size: 0.6
        },
        'diffuser': {
            name: 'Diffuser',
            color: 0xe74c3c,
            size: 0.6
        },
        'cloud': {
            name: 'Ceiling Cloud',
            color: 0x95a5a6,
            size: 1.2
        }
    };

    // Initialize Three.js scene
    useEffect(() => {
        if (!canvasRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a0a);
        scene.fog = new THREE.Fog(0x0a0a0a, 10, 50);
        sceneRef.current = scene;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            75,
            canvasRef.current.clientWidth / canvasRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.set(8, 6, 8);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true
        });
        renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        rendererRef.current = renderer;

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, lighting.ambient);
        scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
        mainLight.position.set(5, 10, 5);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        scene.add(mainLight);

        // Grid helper
        const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
        scene.add(gridHelper);

        // Mouse controls
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        let cameraRotation = { x: 0, y: 0 };

        const onMouseDown = (e) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;

            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;

            cameraRotation.y += deltaX * 0.005;
            cameraRotation.x += deltaY * 0.005;

            cameraRotation.x = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, cameraRotation.x));

            const radius = Math.sqrt(
                camera.position.x ** 2 + camera.position.y ** 2 + camera.position.z ** 2
            );

            camera.position.x = radius * Math.sin(cameraRotation.y) * Math.cos(cameraRotation.x);
            camera.position.z = radius * Math.cos(cameraRotation.y) * Math.cos(cameraRotation.x);
            camera.position.y = radius * Math.sin(cameraRotation.x);

            camera.lookAt(0, 0, 0);

            previousMousePosition = { x: e.clientX, y: e.clientY };
        };

        const onMouseUp = () => {
            isDragging = false;
        };

        const onWheel = (e) => {
            const zoomSpeed = 0.001;
            const radius = Math.sqrt(
                camera.position.x ** 2 + camera.position.y ** 2 + camera.position.z ** 2
            );
            const newRadius = Math.max(5, Math.min(20, radius + e.deltaY * zoomSpeed * radius));

            camera.position.multiplyScalar(newRadius / radius);
            camera.lookAt(0, 0, 0);
        };

        canvasRef.current.addEventListener('mousedown', onMouseDown);
        canvasRef.current.addEventListener('mousemove', onMouseMove);
        canvasRef.current.addEventListener('mouseup', onMouseUp);
        canvasRef.current.addEventListener('wheel', onWheel);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        // Handle resize
        const handleResize = () => {
            if (!canvasRef.current) return;
            camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            canvasRef.current?.removeEventListener('mousedown', onMouseDown);
            canvasRef.current?.removeEventListener('mousemove', onMouseMove);
            canvasRef.current?.removeEventListener('mouseup', onMouseUp);
            canvasRef.current?.removeEventListener('wheel', onWheel);
            renderer.dispose();
        };
    }, []);

    // Update room when dimensions change
    useEffect(() => {
        if (!sceneRef.current) return;

        // Remove old room
        const oldRoom = sceneRef.current.getObjectByName('room');
        if (oldRoom) {
            sceneRef.current.remove(oldRoom);
        }

        // Create room group
        const roomGroup = new THREE.Group();
        roomGroup.name = 'room';

        // Floor
        const floorGeometry = new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.length);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.8,
            metalness: 0.2
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        roomGroup.add(floor);

        // Walls
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a2a,
            roughness: 0.9,
            metalness: 0.1,
            side: THREE.DoubleSide
        });

        // Back wall
        const backWall = new THREE.Mesh(
            new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.height),
            wallMaterial
        );
        backWall.position.z = -roomDimensions.length / 2;
        backWall.position.y = roomDimensions.height / 2;
        backWall.receiveShadow = true;
        roomGroup.add(backWall);

        // Front wall
        const frontWall = new THREE.Mesh(
            new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.height),
            wallMaterial
        );
        frontWall.position.z = roomDimensions.length / 2;
        frontWall.position.y = roomDimensions.height / 2;
        frontWall.rotation.y = Math.PI;
        frontWall.receiveShadow = true;
        roomGroup.add(frontWall);

        // Left wall
        const leftWall = new THREE.Mesh(
            new THREE.PlaneGeometry(roomDimensions.length, roomDimensions.height),
            wallMaterial
        );
        leftWall.position.x = -roomDimensions.width / 2;
        leftWall.position.y = roomDimensions.height / 2;
        leftWall.rotation.y = Math.PI / 2;
        leftWall.receiveShadow = true;
        roomGroup.add(leftWall);

        // Right wall
        const rightWall = new THREE.Mesh(
            new THREE.PlaneGeometry(roomDimensions.length, roomDimensions.height),
            wallMaterial
        );
        rightWall.position.x = roomDimensions.width / 2;
        rightWall.position.y = roomDimensions.height / 2;
        rightWall.rotation.y = -Math.PI / 2;
        rightWall.receiveShadow = true;
        roomGroup.add(rightWall);

        // Ceiling
        const ceiling = new THREE.Mesh(floorGeometry, wallMaterial);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.y = roomDimensions.height;
        ceiling.receiveShadow = true;
        roomGroup.add(ceiling);

        sceneRef.current.add(roomGroup);
    }, [roomDimensions]);

    // Update equipment in scene
    useEffect(() => {
        if (!sceneRef.current) return;

        // Remove old equipment
        const oldEquipment = sceneRef.current.getObjectByName('equipment-group');
        if (oldEquipment) {
            sceneRef.current.remove(oldEquipment);
        }

        // Create equipment group
        const equipmentGroup = new THREE.Group();
        equipmentGroup.name = 'equipment-group';

        equipment.forEach((item) => {
            const catalog = equipmentCatalog[item.type];
            if (!catalog) return;

            const geometry = new THREE.BoxGeometry(catalog.width, catalog.height, catalog.depth);
            const material = new THREE.MeshStandardMaterial({
                color: catalog.color,
                roughness: 0.7,
                metalness: 0.3
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(item.x, item.y + catalog.height / 2, item.z);
            mesh.rotation.y = item.rotation;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.userData = { id: item.id, type: item.type };

            equipmentGroup.add(mesh);
        });

        sceneRef.current.add(equipmentGroup);
    }, [equipment]);

    // Update treatments in scene
    useEffect(() => {
        if (!sceneRef.current) return;

        // Remove old treatments
        const oldTreatments = sceneRef.current.getObjectByName('treatments-group');
        if (oldTreatments) {
            sceneRef.current.remove(oldTreatments);
        }

        // Create treatments group
        const treatmentsGroup = new THREE.Group();
        treatmentsGroup.name = 'treatments-group';

        treatments.forEach((item) => {
            const catalog = treatmentCatalog[item.type];
            if (!catalog) return;

            const geometry = item.type === 'cloud'
                ? new THREE.BoxGeometry(catalog.size, 0.1, catalog.size)
                : new THREE.BoxGeometry(catalog.size, catalog.size, 0.1);

            const material = new THREE.MeshStandardMaterial({
                color: catalog.color,
                roughness: 0.9,
                metalness: 0.1
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(item.x, item.y, item.z);
            mesh.userData = { id: item.id, type: item.type };

            treatmentsGroup.add(mesh);
        });

        sceneRef.current.add(treatmentsGroup);
    }, [treatments]);

    // Add equipment
    const addEquipment = (type) => {
        const newEquipment = {
            id: Date.now(),
            type: type,
            x: 0,
            y: 0,
            z: 0,
            rotation: 0
        };
        setEquipment([...equipment, newEquipment]);
    };

    // Add treatment
    const addTreatment = (type) => {
        const newTreatment = {
            id: Date.now(),
            type: type,
            x: roomDimensions.width / 2 - 0.5,
            y: roomDimensions.height / 2,
            z: 0
        };
        setTreatments([...treatments, newTreatment]);
    };

    // Remove equipment
    const removeEquipment = (id) => {
        setEquipment(equipment.filter(item => item.id !== id));
        if (selectedEquipment?.id === id) {
            setSelectedEquipment(null);
        }
    };

    // Remove treatment
    const removeTreatment = (id) => {
        setTreatments(treatments.filter(item => item.id !== id));
    };

    // Update equipment position
    const updateEquipmentPosition = (id, axis, value) => {
        setEquipment(equipment.map(item =>
            item.id === id ? { ...item, [axis]: parseFloat(value) } : item
        ));
    };

    // Update equipment rotation
    const updateEquipmentRotation = (id, value) => {
        setEquipment(equipment.map(item =>
            item.id === id ? { ...item, rotation: (parseFloat(value) * Math.PI) / 180 } : item
        ));
    };

    // Calculate room volume
    const roomVolume = (roomDimensions.width * roomDimensions.length * roomDimensions.height).toFixed(2);

    // Calculate fundamental frequency
    const fundamentalFreq = (343 / (2 * Math.max(roomDimensions.width, roomDimensions.length, roomDimensions.height))).toFixed(1);

    return (
        <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
            <div className="header">
                <h1>🎵 Studio Emulator</h1>
                <p>Professional Audio Studio Designer - by Obai Sukar</p>
            </div>

            <div className="canvas-container">
                <canvas ref={canvasRef} id="studio-canvas" />
            </div>

            <div className="controls-panel">
                <div className="instructions">
                    <p><strong>🎛️ Controls:</strong></p>
                    <p>• Click and drag to rotate view</p>
                    <p>• Mouse wheel to zoom in/out</p>
                    <p>• Add equipment and acoustic treatments</p>
                    <p>• Customize room dimensions</p>
                </div>

                {/* Room Dimensions */}
                <div className="control-section">
                    <h2>📐 Room Dimensions</h2>
                    <div className="input-group">
                        <label>Width (m)</label>
                        <input
                            type="number"
                            min="3"
                            max="20"
                            step="0.5"
                            value={roomDimensions.width}
                            onChange={(e) => setRoomDimensions({ ...roomDimensions, width: parseFloat(e.target.value) })}
                        />
                    </div>
                    <div className="input-group">
                        <label>Length (m)</label>
                        <input
                            type="number"
                            min="3"
                            max="20"
                            step="0.5"
                            value={roomDimensions.length}
                            onChange={(e) => setRoomDimensions({ ...roomDimensions, length: parseFloat(e.target.value) })}
                        />
                    </div>
                    <div className="input-group">
                        <label>Height (m)</label>
                        <input
                            type="number"
                            min="2.4"
                            max="6"
                            step="0.1"
                            value={roomDimensions.height}
                            onChange={(e) => setRoomDimensions({ ...roomDimensions, height: parseFloat(e.target.value) })}
                        />
                    </div>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <label>Volume</label>
                            <div className="value">{roomVolume} m³</div>
                        </div>
                        <div className="stat-item">
                            <label>Fund. Freq</label>
                            <div className="value">{fundamentalFreq} Hz</div>
                        </div>
                    </div>
                </div>

                {/* Add Equipment */}
                <div className="control-section">
                    <h2>🎛️ Studio Equipment</h2>
                    <div className="equipment-grid">
                        <button onClick={() => addEquipment('mixing-console')}>Console</button>
                        <button onClick={() => addEquipment('studio-monitor')}>Monitor</button>
                        <button onClick={() => addEquipment('equipment-rack')}>Rack</button>
                        <button onClick={() => addEquipment('mic-stand')}>Mic Stand</button>
                        <button onClick={() => addEquipment('studio-desk')}>Desk</button>
                        <button onClick={() => addEquipment('studio-chair')}>Chair</button>
                        <button onClick={() => addEquipment('keyboard-stand')}>Keyboard</button>
                        <button onClick={() => addEquipment('guitar-stand')}>Guitar Stand</button>
                    </div>
                </div>

                {/* Equipment List */}
                {equipment.length > 0 && (
                    <div className="control-section">
                        <h2>📦 Equipment in Studio <span className="badge">{equipment.length}</span></h2>
                        {equipment.map((item) => (
                            <div key={item.id} className="equipment-item">
                                <div>
                                    <span>{equipmentCatalog[item.type]?.name}</span>
                                    <span className="equipment-type">{item.type}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <button
                                        onClick={() => setSelectedEquipment(item)}
                                        className="secondary"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => removeEquipment(item.id)}
                                        className="danger"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Edit Equipment */}
                {selectedEquipment && (
                    <div className="control-section">
                        <h2>✏️ Edit {equipmentCatalog[selectedEquipment.type]?.name}</h2>
                        <div className="input-group">
                            <label>X Position</label>
                            <input
                                type="number"
                                step="0.1"
                                value={selectedEquipment.x}
                                onChange={(e) => updateEquipmentPosition(selectedEquipment.id, 'x', e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label>Y Position</label>
                            <input
                                type="number"
                                step="0.1"
                                value={selectedEquipment.y}
                                onChange={(e) => updateEquipmentPosition(selectedEquipment.id, 'y', e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label>Z Position</label>
                            <input
                                type="number"
                                step="0.1"
                                value={selectedEquipment.z}
                                onChange={(e) => updateEquipmentPosition(selectedEquipment.id, 'z', e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label>Rotation (degrees)</label>
                            <input
                                type="range"
                                min="0"
                                max="360"
                                value={(selectedEquipment.rotation * 180) / Math.PI}
                                onChange={(e) => updateEquipmentRotation(selectedEquipment.id, e.target.value)}
                            />
                        </div>
                        <button onClick={() => setSelectedEquipment(null)}>Done</button>
                    </div>
                )}

                {/* Acoustic Treatments */}
                <div className="control-section">
                    <h2>🎨 Acoustic Treatments</h2>
                    <div className="equipment-grid">
                        <button onClick={() => addTreatment('bass-trap')}>Bass Trap</button>
                        <button onClick={() => addTreatment('absorber')}>Absorber</button>
                        <button onClick={() => addTreatment('diffuser')}>Diffuser</button>
                        <button onClick={() => addTreatment('cloud')}>Ceiling Cloud</button>
                    </div>
                    {treatments.length > 0 && (
                        <>
                            <h3>Applied Treatments ({treatments.length})</h3>
                            {treatments.map((item) => (
                                <div key={item.id} className="equipment-item">
                                    <span>{treatmentCatalog[item.type]?.name}</span>
                                    <button
                                        onClick={() => removeTreatment(item.id)}
                                        className="danger"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {/* Lighting */}
                <div className="control-section">
                    <h2>💡 Studio Lighting</h2>
                    <div className="input-group">
                        <label>Ambient Light Intensity</label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={lighting.ambient}
                            onChange={(e) => setLighting({ ...lighting, ambient: parseFloat(e.target.value) })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Render app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<StudioEmulator />);
