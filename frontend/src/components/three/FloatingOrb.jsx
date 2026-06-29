import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial, OrbitControls } from '@react-three/drei';

function Orb() {
  return (
    <Float speed={2.4} rotationIntensity={1.4} floatIntensity={2.2}>
      <mesh>
        <sphereGeometry args={[1.35, 64, 64]} />
        <MeshDistortMaterial color="#2D62ED" attach="material" distort={0.42} speed={2.5} roughness={0.18} metalness={0.35} />
      </mesh>
    </Float>
  );
}

export default function FloatingOrb() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-80">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={1.8} />
        <directionalLight position={[4, 4, 6]} intensity={2} />
        <Orb />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.5} />
      </Canvas>
    </div>
  );
}
