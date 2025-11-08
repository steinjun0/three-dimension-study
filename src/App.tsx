import { Canvas } from "@react-three/fiber";
import "./App.css";
import { Box, PointerLockControls, Sky } from "@react-three/drei";
import { Physics } from "@react-three/rapier";

function App() {
  return (
    <>
      <div style={{ width: "100vw", height: "100vh" }}>
        <Canvas>
          <mesh>
            <boxGeometry />
            <meshBasicMaterial color="red" />

            <Sky sunPosition={[100, 20, 100]} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />

            {/* Optional: Add physics for more realistic movement */}
            <Physics gravity={[0, -9.8, 0]}>
              <Box position={[0, 1, 0]} args={[1, 1, 1]} />
              {/* Your other 3D objects */}
            </Physics>

            <PointerLockControls />
          </mesh>
        </Canvas>
      </div>
    </>
  );
}

export default App;
