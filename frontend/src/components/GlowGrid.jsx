import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

/* ─── Custom shader grid ─── */
const gridVertexShader = `
  varying vec3 vWorldPos;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const gridFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec3 vWorldPos;

  float grid(vec2 p, float spacing) {
    vec2 grid = abs(fract(p / spacing - 0.5) - 0.5) / fwidth(p / spacing);
    return 1.0 - min(min(grid.x, grid.y), 1.0);
  }

  void main() {
    float g1 = grid(vWorldPos.xz, 1.0) * 0.3;
    float g2 = grid(vWorldPos.xz, 5.0) * 0.6;

    float combined = max(g1, g2);

    // Distance fade
    float dist = length(vWorldPos.xz);
    float fade = 1.0 - smoothstep(5.0, 25.0, dist);

    // Pulse wave
    float pulse = sin(dist * 0.5 - uTime * 1.5) * 0.5 + 0.5;
    pulse = pulse * 0.3 + 0.7;

    float alpha = combined * fade * pulse * uOpacity;

    if (alpha < 0.01) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

const GlowGridMesh = () => {
  const meshRef = useRef();
  const { theme } = useTheme();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#455CE9') },
    uOpacity: { value: 0.4 },
  }), []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uOpacity.value = theme === 'dark' ? 0.5 : 0.25;
    uniforms.uColor.value.set(theme === 'dark' ? '#5a6ef0' : '#455CE9');
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[60, 60, 1, 1]} />
      <shaderMaterial
        vertexShader={gridVertexShader}
        fragmentShader={gridFragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
};

/* ─── Floating accent dots along the grid ─── */
const GridDots = () => {
  const pointsRef = useRef();
  const { theme } = useTheme();

  const count = 60;

  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const c = new THREE.Color('#455CE9');

    for (let i = 0; i < count; i++) {
      pos[i*3]   = (Math.random() - 0.5) * 40;
      pos[i*3+1] = -1.9;
      pos[i*3+2] = (Math.random() - 0.5) * 40;
      col[i*3]   = c.r;
      col[i*3+1] = c.g;
      col[i*3+2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const arr = pointsRef.current.geometry.attributes.position.array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      arr[i*3+1] = -1.9 + Math.sin(t * 0.8 + i * 0.5) * 0.3;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={theme === 'dark' ? 0.6 : 0.3}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

/* ─── Wrapper — skip on mobile to prevent WebGL overload ─── */
const GlowGrid = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  if (isMobile) return null;

  return (
    <div className="glow-grid-canvas" id="glow-grid">
      <Canvas
        camera={{ position: [0, 5, 15], fov: 50, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        frameloop="always"
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <GlowGridMesh />
        <GridDots />
      </Canvas>
    </div>
  );
};

export default GlowGrid;
