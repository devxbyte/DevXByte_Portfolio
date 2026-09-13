import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

/* ─── Individual shape components ─── */
const IcosaShape = ({ position, rotationSpeed, floatSpeed, floatAmp, scale, color, opacity }) => {
  const meshRef = useRef();
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x += rotationSpeed[0];
    meshRef.current.rotation.y += rotationSpeed[1];
    meshRef.current.rotation.z += rotationSpeed[2];
    meshRef.current.position.y = position[1] + Math.sin(t * floatSpeed) * floatAmp;
    meshRef.current.position.x = position[0] + Math.cos(t * floatSpeed * 0.7) * floatAmp * 0.3;
  });
  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <icosahedronGeometry args={[1.8, 1]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
};

const OctaShape = ({ position, rotationSpeed, floatSpeed, floatAmp, scale, color, opacity }) => {
  const meshRef = useRef();
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x += rotationSpeed[0];
    meshRef.current.rotation.y += rotationSpeed[1];
    meshRef.current.rotation.z += rotationSpeed[2];
    meshRef.current.position.y = position[1] + Math.sin(t * floatSpeed) * floatAmp;
    meshRef.current.position.x = position[0] + Math.cos(t * floatSpeed * 0.7) * floatAmp * 0.3;
  });
  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <octahedronGeometry args={[1.5, 0]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
};

const TorusKnotShape = ({ position, rotationSpeed, floatSpeed, floatAmp, scale, color, opacity }) => {
  const meshRef = useRef();
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x += rotationSpeed[0];
    meshRef.current.rotation.y += rotationSpeed[1];
    meshRef.current.rotation.z += rotationSpeed[2];
    meshRef.current.position.y = position[1] + Math.sin(t * floatSpeed) * floatAmp;
    meshRef.current.position.x = position[0] + Math.cos(t * floatSpeed * 0.7) * floatAmp * 0.3;
  });
  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <torusKnotGeometry args={[1, 0.3, 64, 8, 2, 3]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
};

const DodecaShape = ({ position, rotationSpeed, floatSpeed, floatAmp, scale, color, opacity }) => {
  const meshRef = useRef();
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x += rotationSpeed[0];
    meshRef.current.rotation.y += rotationSpeed[1];
    meshRef.current.rotation.z += rotationSpeed[2];
    meshRef.current.position.y = position[1] + Math.sin(t * floatSpeed) * floatAmp;
    meshRef.current.position.x = position[0] + Math.cos(t * floatSpeed * 0.7) * floatAmp * 0.3;
  });
  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <dodecahedronGeometry args={[1.2, 0]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
};

/* ─── Shapes collection ─── */
const ShapesScene = () => {
  const { theme } = useTheme();
  const o = theme === 'dark' ? 0.25 : 0.12;

  return (
    <>
      <IcosaShape position={[-5, 0, -3]} rotationSpeed={[0.003, 0.005, 0.002]} floatSpeed={0.6} floatAmp={0.8} scale={1} color="#455CE9" opacity={o} />
      <OctaShape position={[5.5, 1, -4]} rotationSpeed={[0.004, 0.003, 0.005]} floatSpeed={0.8} floatAmp={1.0} scale={1.2} color="#7C3AED" opacity={o} />
      <TorusKnotShape position={[0, -1.5, -5]} rotationSpeed={[0.002, 0.004, 0.001]} floatSpeed={0.5} floatAmp={0.6} scale={0.9} color="#06B6D4" opacity={o} />
      <DodecaShape position={[-3, 2, -6]} rotationSpeed={[0.005, 0.002, 0.003]} floatSpeed={0.7} floatAmp={0.9} scale={0.8} color="#8B5CF6" opacity={o} />
    </>
  );
};

/* ─── Wrapper — skip on mobile to prevent WebGL overload ─── */
const FloatingShapes = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  if (isMobile) return null;

  return (
    <div className="floating-shapes-canvas" id="floating-shapes">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        frameloop="always"
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ShapesScene />
      </Canvas>
    </div>
  );
};

export default FloatingShapes;
