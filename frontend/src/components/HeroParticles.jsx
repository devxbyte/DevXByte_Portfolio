import { useRef, useMemo, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

/* ─── simplex-style noise (fast, inline) ─── */
const PERM = new Uint8Array(512);
const GRAD3 = [
  [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
  [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
  [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1],
];
(() => { const p = []; for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [p[i],p[j]]=[p[j],p[i]]; }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
})();

function noise3D(x, y, z) {
  const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
  x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
  const u = x*x*(3-2*x), v = y*y*(3-2*y), w = z*z*(3-2*z);
  const dot = (g, a, b, c) => g[0]*a + g[1]*b + g[2]*c;
  const A = PERM[X]+Y, AA = PERM[A]+Z, AB = PERM[A+1]+Z;
  const B = PERM[X+1]+Y, BA = PERM[B]+Z, BB = PERM[B+1]+Z;
  return THREE.MathUtils.lerp(
    THREE.MathUtils.lerp(
      THREE.MathUtils.lerp(dot(GRAD3[PERM[AA]%12],x,y,z), dot(GRAD3[PERM[BA]%12],x-1,y,z), u),
      THREE.MathUtils.lerp(dot(GRAD3[PERM[AB]%12],x,y-1,z), dot(GRAD3[PERM[BB]%12],x-1,y-1,z), u), v),
    THREE.MathUtils.lerp(
      THREE.MathUtils.lerp(dot(GRAD3[PERM[AA+1]%12],x,y,z-1), dot(GRAD3[PERM[BA+1]%12],x-1,y,z-1), u),
      THREE.MathUtils.lerp(dot(GRAD3[PERM[AB+1]%12],x,y-1,z-1), dot(GRAD3[PERM[BB+1]%12],x-1,y-1,z-1), u), v), w);
}

/* ─── Vertex & Fragment shaders for glowing particles ─── */
const vertexShader = `
  attribute float aSize;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vAlpha;
  uniform float uTime;
  uniform float uPixelRatio;

  void main() {
    vColor = aColor;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    float dist = length(mvPos.xyz);
    vAlpha = smoothstep(18.0, 4.0, dist);
    gl_Position = projectionMatrix * mvPos;
    gl_PointSize = aSize * uPixelRatio * (8.0 / -mvPos.z);
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float glow = 1.0 - smoothstep(0.0, 0.5, d);
    glow = pow(glow, 1.5);
    gl_FragColor = vec4(vColor, glow * vAlpha * 0.85);
  }
`;

/* ─── Fixed particle count (no resizing) ─── */
const PARTICLE_COUNT = 2000;

/* ─── Main particle system ─── */
const MorphingParticles = () => {
  const pointsRef = useRef();
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const { theme } = useTheme();
  const { viewport } = useThree();

  // Generate all data with fixed count — never changes
  const { positions, sizes, colors, targets } = useMemo(() => {
    const count = PARTICLE_COUNT;
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const col = new Float32Array(count * 3);
    const tgt = { sphere: new Float32Array(count * 3), torus: new Float32Array(count * 3), helix: new Float32Array(count * 3) };

    const c1 = new THREE.Color('#455CE9'); // accent indigo
    const c2 = new THREE.Color('#7C3AED'); // violet
    const c3 = new THREE.Color('#06B6D4'); // cyan

    for (let i = 0; i < count; i++) {
      // Sphere
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = 4 + Math.random() * 1.5;
      tgt.sphere[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      tgt.sphere[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      tgt.sphere[i*3+2] = r * Math.cos(phi);

      // Torus
      const tAngle = Math.random() * Math.PI * 2;
      const tTube = Math.random() * Math.PI * 2;
      const tR = 4.5, tr = 1.8;
      tgt.torus[i*3]   = (tR + tr * Math.cos(tTube)) * Math.cos(tAngle);
      tgt.torus[i*3+1] = (tR + tr * Math.cos(tTube)) * Math.sin(tAngle);
      tgt.torus[i*3+2] = tr * Math.sin(tTube);

      // Helix
      const hT = (i / count) * Math.PI * 8;
      const hR2 = 3.5 + Math.random() * 0.8;
      tgt.helix[i*3]   = hR2 * Math.cos(hT);
      tgt.helix[i*3+1] = ((i / count) - 0.5) * 12;
      tgt.helix[i*3+2] = hR2 * Math.sin(hT);

      // Initial positions = sphere
      pos[i*3]   = tgt.sphere[i*3];
      pos[i*3+1] = tgt.sphere[i*3+1];
      pos[i*3+2] = tgt.sphere[i*3+2];

      sz[i] = 1.5 + Math.random() * 3.0;

      // Color gradient
      const t = Math.random();
      const color = t < 0.33 ? c1.clone().lerp(c2, t * 3) : t < 0.66 ? c2.clone().lerp(c3, (t - 0.33) * 3) : c3.clone().lerp(c1, (t - 0.66) * 3);
      col[i*3]   = color.r;
      col[i*3+1] = color.g;
      col[i*3+2] = color.b;
    }
    return { positions: pos, sizes: sz, colors: col, targets: tgt };
  }, []); // Empty deps — never recreate

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
  }), []);

  // Build geometry imperatively to avoid R3F declarative bufferAttribute issues
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [positions, sizes, colors]);

  // Cleanup
  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  // Track mouse
  const onPointerMove = useCallback((e) => {
    mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, []);

  // Animation loop
  useFrame((state) => {
    if (!pointsRef.current) return;
    const elapsed = state.clock.elapsedTime;
    uniforms.uTime.value = elapsed;

    const posArr = pointsRef.current.geometry.attributes.position.array;
    const count = PARTICLE_COUNT;

    // Determine morph targets based on time cycle (every 6 seconds)
    const cycle = elapsed * 0.15;
    const phase = cycle % 3;
    let fromTargets, toTargets, morphT;
    if (phase < 1) { fromTargets = targets.sphere; toTargets = targets.torus; morphT = phase; }
    else if (phase < 2) { fromTargets = targets.torus; toTargets = targets.helix; morphT = phase - 1; }
    else { fromTargets = targets.helix; toTargets = targets.sphere; morphT = phase - 2; }

    // Smooth easing
    const ease = morphT * morphT * (3 - 2 * morphT);

    const mx = mouseRef.current.x * viewport.width * 0.5;
    const my = mouseRef.current.y * viewport.height * 0.5;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Lerp between morph targets
      let tx = THREE.MathUtils.lerp(fromTargets[i3], toTargets[i3], ease);
      let ty = THREE.MathUtils.lerp(fromTargets[i3+1], toTargets[i3+1], ease);
      let tz = THREE.MathUtils.lerp(fromTargets[i3+2], toTargets[i3+2], ease);

      // Add noise displacement
      const noiseScale = 0.3;
      const nX = noise3D(tx * noiseScale + elapsed * 0.1, ty * noiseScale, tz * noiseScale) * 0.6;
      const nY = noise3D(tx * noiseScale, ty * noiseScale + elapsed * 0.1, tz * noiseScale + 100) * 0.6;
      const nZ = noise3D(tx * noiseScale + 200, ty * noiseScale, tz * noiseScale + elapsed * 0.1) * 0.6;
      tx += nX; ty += nY; tz += nZ;

      // Mouse repulsion
      const dx = tx - mx, dy = ty - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 3.0) {
        const force = (3.0 - dist) / 3.0;
        const pushStrength = force * force * 2.0;
        tx += (dx / (dist || 1)) * pushStrength;
        ty += (dy / (dist || 1)) * pushStrength;
      }

      // Smooth lerp to target
      posArr[i3]   += (tx - posArr[i3]) * 0.04;
      posArr[i3+1] += (ty - posArr[i3+1]) * 0.04;
      posArr[i3+2] += (tz - posArr[i3+2]) * 0.04;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y = elapsed * 0.015;
  });

  return (
    <points ref={pointsRef} onPointerMove={onPointerMove} geometry={geometry}>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

/* ─── Wrapper — skip on mobile to prevent WebGL overload ─── */
const HeroParticles = () => {
  const { theme } = useTheme();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  if (isMobile) return null;

  return (
    <div className="hero-canvas" id="hero-particles">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 55 }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <MorphingParticles />
      </Canvas>
    </div>
  );
};

export default HeroParticles;
