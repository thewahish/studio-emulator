const { useState, useEffect, useRef } = React;

const StudioEmulator = () => {
    // Theme state
    const [theme, setTheme] = useState('dark'); // 'light' or 'dark'

    // Room dimensions state
    const [roomDimensions, setRoomDimensions] = useState({
        width: 6,
        length: 8,
        height: 3
    });

    // Equipment state
    const [equipment, setEquipment] = useState([]);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [hoveredEquipment, setHoveredEquipment] = useState(null);
    const [isDraggingObject, setIsDraggingObject] = useState(false);

    // Acoustic treatments state
    const [treatments, setTreatments] = useState([]);

    // Lighting state
    const [lighting, setLighting] = useState({
        ambient: 0.4,
        spotlights: []
    });

    // Context menu state
    const [contextMenu, setContextMenu] = useState(null);

    // Canvas ref
    const canvasRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const raycasterRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const selectedMeshRef = useRef(null);
    const outlineRef = useRef(null);

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

    // Theme colors
    const themeColors = {
        light: {
            background: 0xf5f5f5,
            floor: 0xe0e0e0,
            wall: 0xf0f0f0,
            grid1: 0xcccccc,
            grid2: 0xe0e0e0,
            fog: 0xf5f5f5,
            ambient: 0.7
        },
        dark: {
            background: 0x0a0a0a,
            floor: 0x1a1a1a,
            wall: 0x2a2a2a,
            grid1: 0x444444,
            grid2: 0x222222,
            fog: 0x0a0a0a,
            ambient: 0.4
        }
    };

    // Initialize Three.js scene
    useEffect(() => {
        if (!canvasRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        const colors = themeColors[theme];
        scene.background = new THREE.Color(colors.background);
        scene.fog = new THREE.Fog(colors.fog, 10, 50);
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

        // Raycaster for object picking
        const raycaster = new THREE.Raycaster();
        raycasterRef.current = raycaster;

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, colors.ambient);
        ambientLight.name = 'ambientLight';
        scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
        mainLight.position.set(5, 10, 5);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        mainLight.name = 'mainLight';
        scene.add(mainLight);

        // Grid helper
        const gridHelper = new THREE.GridHelper(20, 20, colors.grid1, colors.grid2);
        gridHelper.name = 'gridHelper';
        scene.add(gridHelper);

        // Mouse controls state
        let isRotating = false;
        let previousMousePosition = { x: 0, y: 0 };
        let cameraRotation = { x: 0, y: 0 };
        let dragPlane = null;
        let dragOffset = new THREE.Vector3();

        // Create invisible drag plane
        const planeGeometry = new THREE.PlaneGeometry(100, 100);
        const planeMaterial = new THREE.MeshBasicMaterial({
            visible: false,
            side: THREE.DoubleSide
        });
        dragPlane = new THREE.Mesh(planeGeometry, planeMaterial);
        dragPlane.rotation.x = -Math.PI / 2;
        dragPlane.name = 'dragPlane';
        scene.add(dragPlane);

        const onMouseDown = (e) => {
            e.preventDefault();

            // Update mouse position for raycasting
            const rect = canvasRef.current.getBoundingClientRect();
            mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            // Check for equipment click
            raycaster.setFromCamera(mouseRef.current, camera);
            const equipmentGroup = scene.getObjectByName('equipment-group');

            if (equipmentGroup) {
                const intersects = raycaster.intersectObjects(equipmentGroup.children, true);

                if (intersects.length > 0) {
                    const clickedMesh = intersects[0].object;
                    const equipmentId = clickedMesh.userData.id;
                    const equipmentItem = equipment.find(eq => eq.id === equipmentId);

                    if (equipmentItem) {
                        setSelectedEquipment(equipmentItem);
                        selectedMeshRef.current = clickedMesh;
                        setIsDraggingObject(true);

                        // Calculate drag offset
                        const planeIntersects = raycaster.intersectObject(dragPlane);
                        if (planeIntersects.length > 0) {
                            dragOffset.copy(planeIntersects[0].point).sub(clickedMesh.position);
                        }
                        return;
                    }
                }
            }

            // Start camera rotation
            isRotating = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        };

        const onMouseMove = (e) => {
            e.preventDefault();

            // Update mouse position
            const rect = canvasRef.current.getBoundingClientRect();
            mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            // Handle object dragging
            if (isDraggingObject && selectedMeshRef.current) {
                raycaster.setFromCamera(mouseRef.current, camera);
                const intersects = raycaster.intersectObject(dragPlane);

                if (intersects.length > 0) {
                    const newPos = intersects[0].point.sub(dragOffset);

                    // Update equipment position in state
                    const equipmentId = selectedMeshRef.current.userData.id;
                    setEquipment(prev => prev.map(item =>
                        item.id === equipmentId
                            ? { ...item, x: newPos.x, z: newPos.z }
                            : item
                    ));
                }
                return;
            }

            // Handle camera rotation
            if (isRotating) {
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
                return;
            }

            // Handle hover effect
            raycaster.setFromCamera(mouseRef.current, camera);
            const equipmentGroup = scene.getObjectByName('equipment-group');

            if (equipmentGroup) {
                const intersects = raycaster.intersectObjects(equipmentGroup.children, true);

                if (intersects.length > 0) {
                    const hoveredMesh = intersects[0].object;
                    setHoveredEquipment(hoveredMesh.userData.id);
                    canvasRef.current.style.cursor = 'pointer';
                } else {
                    setHoveredEquipment(null);
                    canvasRef.current.style.cursor = isRotating ? 'grabbing' : 'grab';
                }
            }
        };

        const onMouseUp = () => {
            isRotating = false;
            setIsDraggingObject(false);
            selectedMeshRef.current = null;
            canvasRef.current.style.cursor = 'grab';
        };

        const onContextMenu = (e) => {
            e.preventDefault();

            // Update mouse position
            const rect = canvasRef.current.getBoundingClientRect();
            mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            // Check for equipment right-click
            raycaster.setFromCamera(mouseRef.current, camera);
            const equipmentGroup = scene.getObjectByName('equipment-group');

            if (equipmentGroup) {
                const intersects = raycaster.intersectObjects(equipmentGroup.children, true);

                if (intersects.length > 0) {
                    const clickedMesh = intersects[0].object;
                    const equipmentId = clickedMesh.userData.id;
                    const equipmentItem = equipment.find(eq => eq.id === equipmentId);

                    if (equipmentItem) {
                        setContextMenu({
                            x: e.clientX,
                            y: e.clientY,
                            equipment: equipmentItem
                        });
                    }
                }
            }
        };

        const onWheel = (e) => {
            e.preventDefault();
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
        canvasRef.current.addEventListener('contextmenu', onContextMenu);
        canvasRef.current.addEventListener('wheel', onWheel);
        canvasRef.current.style.cursor = 'grab';

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
            canvasRef.current?.removeEventListener('contextmenu', onContextMenu);
            canvasRef.current?.removeEventListener('wheel', onWheel);
            renderer.dispose();
        };
    }, [equipment, isDraggingObject]);

    // Update theme colors
    useEffect(() => {
        if (!sceneRef.current) return;

        const colors = themeColors[theme];
        sceneRef.current.background = new THREE.Color(colors.background);
        sceneRef.current.fog = new THREE.Fog(colors.fog, 10, 50);

        const ambientLight = sceneRef.current.getObjectByName('ambientLight');
        if (ambientLight) {
            ambientLight.intensity = colors.ambient;
        }

        const gridHelper = sceneRef.current.getObjectByName('gridHelper');
        if (gridHelper) {
            sceneRef.current.remove(gridHelper);
            const newGrid = new THREE.GridHelper(20, 20, colors.grid1, colors.grid2);
            newGrid.name = 'gridHelper';
            sceneRef.current.add(newGrid);
        }

        // Update room colors
        const room = sceneRef.current.getObjectByName('room');
        if (room) {
            room.children.forEach(child => {
                if (child.material) {
                    if (child.name === 'floor') {
                        child.material.color.setHex(colors.floor);
                    } else {
                        child.material.color.setHex(colors.wall);
                    }
                }
            });
        }
    }, [theme]);

    // Update room when dimensions change
    useEffect(() => {
        if (!sceneRef.current) return;

        const colors = themeColors[theme];

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
            color: colors.floor,
            roughness: 0.8,
            metalness: 0.2
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        floor.name = 'floor';
        roomGroup.add(floor);

        // Walls
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: colors.wall,
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
    }, [roomDimensions, theme]);

    // Update equipment in scene
    useEffect(() => {
        if (!sceneRef.current) return;

        // Remove old equipment
        const oldEquipment = sceneRef.current.getObjectByName('equipment-group');
        if (oldEquipment) {
            sceneRef.current.remove(oldEquipment);
        }

        // Remove old outline
        if (outlineRef.current) {
            sceneRef.current.remove(outlineRef.current);
            outlineRef.current = null;
        }

        // Create equipment group
        const equipmentGroup = new THREE.Group();
        equipmentGroup.name = 'equipment-group';

        equipment.forEach((item) => {
            const catalog = equipmentCatalog[item.type];
            if (!catalog) return;

            const geometry = new THREE.BoxGeometry(catalog.width, catalog.height, catalog.depth);

            // Check if this item is selected or hovered
            const isSelected = selectedEquipment?.id === item.id;
            const isHovered = hoveredEquipment === item.id;

            const material = new THREE.MeshStandardMaterial({
                color: catalog.color,
                roughness: 0.7,
                metalness: 0.3,
                emissive: isSelected ? 0x8a2be2 : (isHovered ? 0x444444 : 0x000000),
                emissiveIntensity: isSelected ? 0.3 : (isHovered ? 0.1 : 0)
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(item.x, item.y + catalog.height / 2, item.z);
            mesh.rotation.y = item.rotation;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.userData = { id: item.id, type: item.type };

            equipmentGroup.add(mesh);

            // Add outline for selected equipment
            if (isSelected) {
                const outlineGeometry = new THREE.BoxGeometry(
                    catalog.width * 1.05,
                    catalog.height * 1.05,
                    catalog.depth * 1.05
                );
                const outlineMaterial = new THREE.MeshBasicMaterial({
                    color: 0x8a2be2,
                    wireframe: true,
                    transparent: true,
                    opacity: 0.5
                });
                const outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
                outline.position.copy(mesh.position);
                outline.rotation.copy(mesh.rotation);
                equipmentGroup.add(outline);
                outlineRef.current = outline;
            }
        });

        sceneRef.current.add(equipmentGroup);
    }, [equipment, selectedEquipment, hoveredEquipment]);

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

    // Close context menu on click
    useEffect(() => {
        const closeContextMenu = () => setContextMenu(null);
        document.addEventListener('click', closeContextMenu);
        return () => document.removeEventListener('click', closeContextMenu);
    }, []);

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
        setSelectedEquipment(newEquipment);
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
        setContextMenu(null);
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
        <div style={{ display: 'flex', width: '100vw', height: '100vh' }} data-theme={theme}>
            <div className="header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>🎵 Studio Emulator</h1>
                        <p>Professional Audio Studio Designer - by Obai Sukar</p>
                    </div>
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        style={{
                            padding: '10px 20px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '8px',
                            color: '#fff',
                            cursor: 'pointer',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
                    </button>
                </div>
            </div>

            <div className="canvas-container">
                <canvas ref={canvasRef} id="studio-canvas" />
            </div>

            {/* Context Menu */}
            {contextMenu && (
                <div
                    style={{
                        position: 'fixed',
                        left: contextMenu.x,
                        top: contextMenu.y,
                        background: 'rgba(0, 0, 0, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(138, 43, 226, 0.5)',
                        borderRadius: '8px',
                        padding: '8px',
                        zIndex: 1000,
                        minWidth: '150px'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div style={{ padding: '8px', color: '#aaa', fontSize: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        {equipmentCatalog[contextMenu.equipment.type]?.name}
                    </div>
                    <button
                        onClick={() => {
                            setSelectedEquipment(contextMenu.equipment);
                            setContextMenu(null);
                        }}
                        style={{
                            width: '100%',
                            padding: '8px',
                            background: 'transparent',
                            border: 'none',
                            color: '#fff',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontSize: '13px',
                            marginBottom: '4px'
                        }}
                    >
                        ✏️ Edit
                    </button>
                    <button
                        onClick={() => removeEquipment(contextMenu.equipment.id)}
                        style={{
                            width: '100%',
                            padding: '8px',
                            background: 'transparent',
                            border: 'none',
                            color: '#ff6b6b',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontSize: '13px'
                        }}
                    >
                        🗑️ Delete
                    </button>
                </div>
            )}

            <div className="controls-panel">
                <div className="instructions">
                    <p><strong>🎛️ Controls:</strong></p>
                    <p>• <strong>Left-click + drag</strong> to rotate view</p>
                    <p>• <strong>Left-click object</strong> to select & drag</p>
                    <p>• <strong>Right-click object</strong> for menu</p>
                    <p>• <strong>Mouse wheel</strong> to zoom in/out</p>
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
                            <div key={item.id} className="equipment-item" style={{
                                background: selectedEquipment?.id === item.id ? 'rgba(138, 43, 226, 0.2)' : 'rgba(255, 255, 255, 0.08)'
                            }}>
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
                    <div className="control-section" style={{ border: '2px solid rgba(138, 43, 226, 0.5)' }}>
                        <h2>✏️ Edit {equipmentCatalog[selectedEquipment.type]?.name}</h2>
                        <div className="input-group">
                            <label>X Position (drag to move)</label>
                            <input
                                type="number"
                                step="0.1"
                                value={selectedEquipment.x.toFixed(2)}
                                onChange={(e) => updateEquipmentPosition(selectedEquipment.id, 'x', e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label>Y Position (height)</label>
                            <input
                                type="number"
                                step="0.1"
                                value={selectedEquipment.y.toFixed(2)}
                                onChange={(e) => updateEquipmentPosition(selectedEquipment.id, 'y', e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label>Z Position (drag to move)</label>
                            <input
                                type="number"
                                step="0.1"
                                value={selectedEquipment.z.toFixed(2)}
                                onChange={(e) => updateEquipmentPosition(selectedEquipment.id, 'z', e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label>Rotation: {((selectedEquipment.rotation * 180) / Math.PI).toFixed(0)}°</label>
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
