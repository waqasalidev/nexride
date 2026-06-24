import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function VehicleViewer3D({ category }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 400;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.05);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(6, 4, 8);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Don't go below ground
    controls.minDistance = 3;
    controls.maxDistance = 20;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);

    // Main studio light
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight1.position.set(5, 10, 7);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 1024;
    dirLight1.shadow.mapSize.height = 1024;
    scene.add(dirLight1);

    // Cyan accent light
    const pointLight = new THREE.PointLight(0x00f2ff, 3, 10);
    pointLight.position.set(0, 0.5, 0);
    scene.add(pointLight);

    // Secondary soft light
    const dirLight2 = new THREE.DirectionalLight(0x005a9c, 0.8);
    dirLight2.position.set(-5, 5, -5);
    scene.add(dirLight2);

    // 6. Ground Grid & Shadow plane
    const grid = new THREE.GridHelper(20, 20, 0x00f2ff, 0x222222);
    grid.position.y = -0.01;
    scene.add(grid);

    const floorGeo = new THREE.PlaneGeometry(20, 20);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      roughness: 0.8,
      metalness: 0.2,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // 7. Create Procedural Model based on category
    const group = new THREE.Group();
    scene.add(group);

    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.2,
      metalness: 0.9,
    });

    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f2ff,
    });

    const carbonMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.5,
      metalness: 0.4,
    });

    if (category === "car") {
      // Sleek Cyber Car Chassis
      const bodyGeo = new THREE.BoxGeometry(3.5, 0.6, 1.6);
      const body = new THREE.Mesh(bodyGeo, metalMaterial);
      body.position.y = 0.45;
      group.add(body);

      // Cabin
      const cabinGeo = new THREE.BoxGeometry(1.6, 0.5, 1.2);
      const cabin = new THREE.Mesh(cabinGeo, new THREE.MeshStandardMaterial({
        color: 0x050505,
        roughness: 0.1,
        metalness: 1.0,
      }));
      cabin.position.set(-0.2, 0.9, 0);
      group.add(cabin);

      // Spoiler
      const wingGeo = new THREE.BoxGeometry(0.3, 0.05, 1.5);
      const wing = new THREE.Mesh(wingGeo, carbonMaterial);
      wing.position.set(-1.6, 0.8, 0);
      group.add(wing);

      const wingStrutL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.3, 0.1), carbonMaterial);
      wingStrutL.position.set(-1.5, 0.65, 0.5);
      group.add(wingStrutL);

      const wingStrutR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.3, 0.1), carbonMaterial);
      wingStrutR.position.set(-1.5, 0.65, -0.5);
      group.add(wingStrutR);

      // Wheels
      const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.3, 24);
      wheelGeo.rotateX(Math.PI / 2);
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.7 });

      const positions = [
        [1.0, 0.35, 0.85],
        [1.0, 0.35, -0.85],
        [-1.0, 0.35, 0.85],
        [-1.0, 0.35, -0.85]
      ];

      positions.forEach(([x, y, z]) => {
        const wheel = new THREE.Mesh(wheelGeo, wheelMat);
        wheel.position.set(x, y, z);
        group.add(wheel);
        
        // Shiny rim
        const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.32, 12), metalMaterial);
        rim.rotateX(Math.PI / 2);
        rim.position.set(x, y, z);
        group.add(rim);
      });

      // Headlights (neon cyan bars)
      const headlightGeo = new THREE.BoxGeometry(0.05, 0.08, 0.4);
      const headlightL = new THREE.Mesh(headlightGeo, glowMaterial);
      headlightL.position.set(1.75, 0.5, 0.5);
      group.add(headlightL);

      const headlightR = new THREE.Mesh(headlightGeo, glowMaterial);
      headlightR.position.set(1.75, 0.5, -0.5);
      group.add(headlightR);

    } else if (category === "bike") {
      // Superbike Frame
      const frameGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.0);
      frameGeo.rotateZ(Math.PI / 3);
      const frame = new THREE.Mesh(frameGeo, metalMaterial);
      frame.position.set(0, 0.8, 0);
      group.add(frame);

      // Engine block
      const engineGeo = new THREE.BoxGeometry(0.6, 0.5, 0.4);
      const engine = new THREE.Mesh(engineGeo, carbonMaterial);
      engine.position.set(0.1, 0.6, 0);
      group.add(engine);

      // Gas tank
      const tankGeo = new THREE.BoxGeometry(0.8, 0.4, 0.5);
      const tank = new THREE.Mesh(tankGeo, metalMaterial);
      tank.position.set(0.1, 1.1, 0);
      group.add(tank);

      // Seat
      const seatGeo = new THREE.BoxGeometry(0.6, 0.1, 0.3);
      const seat = new THREE.Mesh(seatGeo, new THREE.MeshStandardMaterial({ color: 0x111111 }));
      seat.position.set(-0.5, 1.15, 0);
      group.add(seat);

      // Wheels (Thick Torus shapes)
      const wheelGeo = new THREE.TorusGeometry(0.5, 0.12, 12, 32);
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0d0d0d, roughness: 0.8 });

      const frontWheel = new THREE.Mesh(wheelGeo, wheelMat);
      frontWheel.position.set(1.2, 0.5, 0);
      group.add(frontWheel);

      const backWheel = new THREE.Mesh(wheelGeo, wheelMat);
      backWheel.position.set(-1.2, 0.5, 0);
      group.add(backWheel);

      // Front Fork
      const forkGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.3);
      forkGeo.rotateZ(-Math.PI / 7);
      const fork = new THREE.Mesh(forkGeo, metalMaterial);
      fork.position.set(0.8, 1.0, 0);
      group.add(fork);

      // Handlebars
      const handlebarGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.8);
      handlebarGeo.rotateX(Math.PI / 2);
      const bars = new THREE.Mesh(handlebarGeo, carbonMaterial);
      bars.position.set(0.6, 1.5, 0);
      group.add(bars);

    } else {
      // Private Jet Fuselage
      const fuselageGeo = new THREE.CylinderGeometry(0.4, 0.4, 4.5, 16);
      fuselageGeo.rotateX(Math.PI / 2);
      const fuselage = new THREE.Mesh(fuselageGeo, metalMaterial);
      fuselage.position.y = 1.0;
      group.add(fuselage);

      // Nose Cone
      const noseGeo = new THREE.ConeGeometry(0.4, 1.0, 16);
      noseGeo.rotateX(Math.PI / 2);
      const nose = new THREE.Mesh(noseGeo, metalMaterial);
      nose.position.set(0, 1.0, 2.75);
      group.add(nose);

      // Wings
      const wingGeo = new THREE.BoxGeometry(5.0, 0.05, 1.0);
      const wings = new THREE.Mesh(wingGeo, metalMaterial);
      wings.position.set(0, 0.9, -0.2);
      wings.rotation.y = Math.PI / 12; // Swept back
      group.add(wings);

      // Wingtips (winglets)
      const tipL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.3, 0.4), glowMaterial);
      tipL.position.set(2.5, 1.0, -0.4);
      group.add(tipL);

      const tipR = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.3, 0.4), glowMaterial);
      tipR.position.set(-2.5, 1.0, -0.4);
      group.add(tipR);

      // Engines (mounted on rear sides)
      const engineGeo = new THREE.CylinderGeometry(0.22, 0.2, 1.0, 12);
      engineGeo.rotateX(Math.PI / 2);
      
      const engineL = new THREE.Mesh(engineGeo, carbonMaterial);
      engineL.position.set(0.6, 1.1, -1.5);
      group.add(engineL);

      const engineR = new THREE.Mesh(engineGeo, carbonMaterial);
      engineR.position.set(-0.6, 1.1, -1.5);
      group.add(engineR);

      // Tail fins
      const tailVert = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.2, 0.6), metalMaterial);
      tailVert.position.set(0, 1.8, -2.1);
      tailVert.rotation.x = Math.PI / 8;
      group.add(tailVert);

      const tailHoriz = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 0.5), metalMaterial);
      tailHoriz.position.set(0, 1.0, -2.1);
      group.add(tailHoriz);
    }

    // Centering group and lifting above grid
    group.position.y = 0.2;

    // 8. Animation loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Auto-rotation when there's no user interaction
      if (!controls.state === -1) {
        group.rotation.y += 0.005;
      } else {
        group.rotation.y += 0.002;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 9. Resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement && containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [category]);

  return (
    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border border-white/10 bg-neutral-950">
      <div ref={containerRef} className="w-full h-full" />
      {/* HUD InfoOverlay */}
      <div className="absolute top-4 left-4 pointer-events-none font-mono text-[9px] text-cyan-glow bg-black/40 px-3 py-1.5 rounded-full border border-cyan-glow/20 uppercase tracking-widest backdrop-blur-sm">
        3D Precision scan active
      </div>
      <div className="absolute bottom-4 right-4 pointer-events-none font-mono text-[9px] text-white/40 bg-black/40 px-3 py-1.5 rounded-full border border-white/5 uppercase tracking-widest backdrop-blur-sm">
        Rotate / Zoom to inspect
      </div>
    </div>
  );
}
