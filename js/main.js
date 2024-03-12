import * as THREE from './three.module.js';
import { OrbitControls } from './OrbitControls.js';

function init() {
    // Set up scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; 
    document.getElementById('container').appendChild(renderer.domElement);

    /* Ambient light
    const ambientLight = new THREE.AmbientLight(0xabcdef, -0); 
    scene.add(ambientLight); */

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xabcdef, 0.25); 
    directionalLight.position.set(-2.5, -1, -2.5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Shadow properties
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 10;

    // Camera position
    camera.position.set(0, 5, 5);  

    // Create OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;

    // ---ADDING FURNITURE---
    // Carpet
    const carpetRadius = 1.65;
    const carpetSegments = 32;
    const carpetGeometry = new THREE.CircleGeometry(carpetRadius, carpetSegments);
    const carpetTextureLoader = new THREE.TextureLoader();
    const carpetTexture = carpetTextureLoader.load('/img/green_carpet.jpg'); 
    const carpetMaterial = new THREE.MeshPhongMaterial({ map: carpetTexture, side: THREE.DoubleSide });
    const carpet = new THREE.Mesh(carpetGeometry, carpetMaterial);
    carpet.rotation.x = -Math.PI / 2;
    carpet.position.y = -0.84;
    scene.add(carpet);

    // Lamp (stand)
    const standHeight = 3;
    const standRadiusTop = 0.05;
    const standRadiusBottom = 0.10;
    const standSegments = 32;
    const standGeometry = new THREE.CylinderGeometry(standRadiusTop, standRadiusBottom, standHeight, standSegments);
    const standMaterial = new THREE.MeshPhongMaterial({ color: 0x000039 });
    const stand = new THREE.Mesh(standGeometry, standMaterial);
    stand.position.y = 0.65;
    // Lamp (shade)
    const shadeHeight = 0.5;
    const shadeRadiusTop = 0.15;
    const shadeRadiusBottom = 0.35;
    const shadeSegments = 32;
    const shadeGeometry = new THREE.CylinderGeometry(shadeRadiusTop, shadeRadiusBottom, shadeHeight, shadeSegments);
    const shadeMaterial = new THREE.MeshPhongMaterial({ color: 0xb0c4de, side: THREE.DoubleSide, emissive: 0xb0c4de, emissiveIntensity: 0.75 });
    const shade = new THREE.Mesh(shadeGeometry, shadeMaterial);
    shade.position.y = 1.85;
    // Lamp (light source)
    const sphere1Geometry = new THREE.SphereGeometry(0.025, 32, 32);
    const sphere1Material = new THREE.MeshPhongMaterial({ color: 0xb0c4de });
    const sphere1 = new THREE.Mesh(sphere1Geometry, sphere1Material);
    const sphere1Light = new THREE.PointLight(0xe7feff, 1, 15);
    sphere1Light.position.set(0, 0, 0);
    // Lamp (group)
    shade.add(sphere1);
    shade.add(sphere1Light);
    const lamp = new THREE.Group();
    lamp.add(stand);
    lamp.add(shade);
    scene.add(lamp);

    // Side Table (top)
    const tabletopRadius = 0.75; 
    const tabletopHeight = 0.05; 
    const tabletopSegments = 32;
    const tabletopMaterial = new THREE.MeshBasicMaterial({ color: 0x18453b, side: THREE.DoubleSide, transparent: true, opacity: 0.75 });
    const tabletopGeometry = new THREE.CylinderGeometry(tabletopRadius, tabletopRadius, tabletopHeight, tabletopSegments);
    const tabletop = new THREE.Mesh(tabletopGeometry, tabletopMaterial);
    tabletop.rotation.x = 0;
    tabletop.position.y = -0.33; 
    // Side Table (4 legs) 
    const tablelegHeight = 0.5; 
    const tablelegRadius = 0.04;
    const tablelegGeometry = new THREE.CylinderGeometry(tablelegRadius, tablelegRadius, tablelegHeight, 32);
    const tablelegMaterial = new THREE.MeshPhongMaterial({ color: 0x987654 });
    const tablelegs = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const tableleg = new THREE.Mesh(tablelegGeometry, tablelegMaterial);
        const angle = (i / 4) * Math.PI * 2;
        const x = Math.cos(angle) * tabletopRadius * 0.8;
        const z = Math.sin(angle) * tabletopRadius * 0.8;
        tableleg.position.set(x, -0.35 - tablelegHeight / 2, z); 
        tablelegs.add(tableleg);
    }
    // Side Table (group)
    const sidetable = new THREE.Group();
    sidetable.add(tabletop);
    sidetable.add(tablelegs);
    scene.add(sidetable);

    // Couch (seat)
    const seatWidth = 2.25;
    const seatHeight = 0.25;
    const seatDepth = 0.75;
    const seatGeometry = new THREE.BoxGeometry(seatWidth, seatHeight, seatDepth);
    const seatMaterial = new THREE.MeshPhongMaterial({ color: 0x08457e });
    const seat = new THREE.Mesh(seatGeometry, seatMaterial);
    seat.position.y = 0.12; 
    // Couch (backseat)
    const backseatWidth = 2.25;
    const backseatHeight = 0.75;
    const backseatDepth = 0.25;
    const backseatGeometry = new THREE.BoxGeometry(backseatWidth, backseatHeight, backseatDepth);
    const backseatMaterial = new THREE.MeshPhongMaterial({ color: 0x08457e });
    const backseat = new THREE.Mesh(backseatGeometry, backseatMaterial);
    const backseatYPosition = 0.37; 
    backseat.position.set(0, backseatYPosition, -seatDepth / 2);
    // Couch (legs)
    const couchlegHeight = 0.15;
    const couchlegRadius = 0.09;
    const couchlegGeometry = new THREE.CylinderGeometry(couchlegRadius, couchlegRadius, couchlegHeight, 32);
    const couchlegMaterial = new THREE.MeshPhongMaterial({ color: 0x987654 });
    const couchlegs = new THREE.Group();
    const legPositions = [
    { x: seatWidth / 2 - couchlegRadius, z: seatDepth / 2 - couchlegRadius },  // Front right leg
    { x: -seatWidth / 2 + couchlegRadius, z: seatDepth / 2 - couchlegRadius }, // Front left leg
    { x: -seatWidth / 2 + couchlegRadius, z: -seatDepth / 1.55 + couchlegRadius }, // Back left leg
    { x: seatWidth / 2 - couchlegRadius, z: -seatDepth / 1.55 + couchlegRadius },  // Back right leg
    ];
    for (let i = 0; i < 4; i++) {
        const couchleg = new THREE.Mesh(couchlegGeometry, couchlegMaterial);
        couchleg.position.set(legPositions[i].x, -couchlegHeight / 2, legPositions[i].z);
        couchlegs.add(couchleg);
    }
    // Couch (group)
    const couch = new THREE.Group();
    couch.add(seat);
    couch.add(backseat);
    couch.add(couchlegs);
    scene.add(couch);
    const couchRotationAngle = Math.PI / 2; 
    couch.rotation.y = couchRotationAngle;

    // TV Table (top)
    const tvTableWidth = 2.5;
    const tvTableHeight = 0.10;
    const tvTableDepth = 0.75;
    const tvTableGeometry = new THREE.BoxGeometry(tvTableWidth, tvTableHeight, tvTableDepth);
    const tvTableMaterial = new THREE.MeshPhongMaterial({ color: 0x987654 });
    const tvTable = new THREE.Mesh(tvTableGeometry, tvTableMaterial);
    tvTable.position.y = 0.05;
    // TV Table (legs)
    const tvTablelegHeight = 0.15;
    const tvTablelegWidth = 0.1; 
    const tvTablelegDepth = 0.1; 
    const tvTablelegGeometry = new THREE.BoxGeometry(tvTablelegWidth, tvTablelegHeight, tvTablelegDepth);
    const tvTablelegMaterial = new THREE.MeshPhongMaterial({ color: 0x987654 });
    const tvTablelegs = new THREE.Group();
    const tvTablelegPositions = [
        { x: tvTableWidth / 2 - tvTablelegWidth / 2, z: tvTableDepth / 2 - tvTablelegWidth / 2 },  // Front right leg
        { x: -tvTableWidth / 2 + tvTablelegWidth / 2, z: tvTableDepth / 2 - tvTablelegWidth / 2 }, // Front left leg
        { x: -tvTableWidth / 2 + tvTablelegWidth / 2, z: -tvTableDepth / 2 + tvTablelegWidth / 2 }, // Back left leg
        { x: tvTableWidth / 2 - tvTablelegWidth / 2, z: -tvTableDepth / 2 + tvTablelegWidth / 2 },  // Back right leg
    ];
    for (let i = 0; i < 4; i++) {
        const tvTableleg = new THREE.Mesh(tvTablelegGeometry, tvTablelegMaterial);
        tvTableleg.position.set(tvTablelegPositions[i].x, -tvTablelegHeight / 2, tvTablelegPositions[i].z);
        tvTablelegs.add(tvTableleg);
    }
    // TV Table (group)
    const tableTV = new THREE.Group();
    tableTV.add(tvTable);
    tableTV.add(tvTablelegs);
    scene.add(tableTV);
    const tvTableRotationAngle = Math.PI / 2;
    tableTV.rotation.y = tvTableRotationAngle;

    // Snow Globe (globe)
    const globeRadius = 0.15;
    const globeGeometry = new THREE.SphereGeometry(globeRadius, 32, 32);
    const globeMaterial = new THREE.MeshPhongMaterial({  color: 0xb0c4de, transparent: true, opacity: 0.5 });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);
    // Snow Globe (base)
    const globeBaseHeight = 0.10;
    const globeBaseRadiusTop = 0.10;
    const globeBaseRadiusBottom = 0.15;
    const globeBaseGeometry = new THREE.CylinderGeometry(globeBaseRadiusTop, globeBaseRadiusBottom, globeBaseHeight, 32);
    const globeBaseMaterial = new THREE.MeshPhongMaterial({ color: 0x000039 });
    const globeBase = new THREE.Mesh(globeBaseGeometry, globeBaseMaterial);
    globeBase.position.y = -0.15;
    scene.add(globeBase);
    // Snow Globe (light source)
    const sphere2Geometry = new THREE.SphereGeometry(0.10, 32, 32);
    const sphere2Material = new THREE.MeshPhongMaterial({ color: 0xb0c4de, side: THREE.DoubleSide, emissive: 0xb0c4de, emissiveIntensity: 1 });
    const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
    const sphere2Light = new THREE.PointLight(0xe7feff, 1, 5);
    // Snow Globe (group)
    globe.add(sphere2);
    globe.add(sphere2Light);
    const snowglobe = new THREE.Group();
    snowglobe.add(globe);
    snowglobe.add(globeBase);
    scene.add(snowglobe);
    
    // TV (body)
    const tvWidth = 2;
    const tvHeight = 1.25;
    const tvDepth = 0.10;
    const tvGeometry = new THREE.BoxGeometry(tvWidth, tvHeight, tvDepth);
    const tvMaterial = new THREE.MeshPhongMaterial({ color: 0x242124 });
    const tv = new THREE.Mesh(tvGeometry, tvMaterial);
    scene.add(tv);
    // TV (Screen)
    const tvScreenWidth = 1.85;
    const tvScreenHeight = 1.05;
    const tvScreenGeometry = new THREE.PlaneGeometry(tvScreenWidth, tvScreenHeight);
    const tvScreenTextureLoader = new THREE.TextureLoader();
    const tvScreenMaterial = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, emissive: 0xffffff, emissiveIntensity: 0.05 });    
    tvScreenTextureLoader.load('img/tv_screen.png', function (texture) {
        tvScreenMaterial.map = texture;
        tvScreenMaterial.needsUpdate = true;
    });
    const tvScreen = new THREE.Mesh(tvScreenGeometry, tvScreenMaterial);
    tv.add(tvScreen);
    tvScreen.position.z = -0.051;
    const tvRotationAngle = Math.PI / 2;
    tv.rotation.y = tvRotationAngle;
    // TV (light source)
    const tvScreenLight = new THREE.PointLight(0xffffff, 1, 10);
    tvScreenLight.position.set(0, 1, 0); 
    tv.add(tvScreenLight);

    // Positions
    lamp.position.set(-1.5, 0, -1.5);
    sidetable.position.set(0, 0, 0);
    couch.position.set(-1.4, -0.70, 0);
    tableTV.position.set(1.4, -0.70, 0);
    snowglobe.position.set(0, -0.10, 0);
    tv.position.set(1.35, 0, 0);

    // Cast Shadows
    const objectsWithShadow = [lamp, sidetable, couch, tableTV, snowglobe, tv]; 
    objectsWithShadow.forEach((object) => {
        object.castShadow = true;
        object.receiveShadow = true;
    });

    // ---ADDING FLOOR & WALLS---
    // Create floor
    const floorGeometry = new THREE.BoxGeometry(4, 4, 0.15);
    const floorMaterial = new THREE.MeshPhongMaterial({ color: 0xffffcc });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.92;
    floor.receiveShadow = true;
    scene.add(floor);

    const floorTextureLoader = new THREE.TextureLoader();
    floorTextureLoader.load('/img/blue_floor.jpg',
        function (texture) {
            const floorTextureMaterial = new THREE.MeshPhongMaterial({ map: texture, opacity: 0.5 });
            floor.material = floorTextureMaterial;
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.error('Error loading texture:', error);
        }
    );
    // Create walls
    const wallMaterial = new THREE.MeshPhongMaterial({ color: 0xffffcc });
    const wallGeometry = new THREE.BoxGeometry(4, 4, 0.15);

    // Wall position
    const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall1.position.set(0, 1, -2.07);
    wall1.receiveShadow = true;
    scene.add(wall1);

    const wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall2.position.set(-2.07, 1, 0);
    wall2.rotation.y = Math.PI / 2;
    wall2.receiveShadow = true;
    scene.add(wall2);

    const wallTextureLoader = new THREE.TextureLoader();
    wallTextureLoader.load('/img/green_wall.jpg',
        function (texture) {
            const wallTextureMaterial = new THREE.MeshPhongMaterial({ map: texture, opacity: 0.5 });
            wall1.material = wallTextureMaterial;
            wall2.material = wallTextureMaterial;
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.error('Error loading texture:', error);
        }
    );

    // Picture on wall
    const wallPictureGeometry = new THREE.PlaneGeometry(2, 2);
    const wallPicturetextureLoader = new THREE.TextureLoader();
    wallPicturetextureLoader.load('/img/MCpic_skull.png',
      function (texture) {
        const wallPictureMaterial = new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide });
        const wallPicture = new THREE.Mesh(wallPictureGeometry, wallPictureMaterial);
        wallPicture.position.set(0, 0, 0.08);
        wall1.add(wallPicture);
        renderer.render(scene, camera);
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      function (error) {
        console.error('Error loading texture:', error);
      }
    );

    function render() {
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    // Start rendering
    render();
}

// Run
window.onload = init;