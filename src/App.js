import React, { useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AssetBrowser from './AssetBrowser';
import ImportedModel from './ImportedModel';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import './App.css';

function App() {
  const [assets, setAssets] = useState([]);
  const [activeAsset, setActiveAsset] = useState(null);
  const [hdrBackground, setHdrBackground] = useState(null); // HDR background state

  const addAsset = (assetName, assetFile, type) => {
    if (type === 'Lighting Profile') {
      setHdrBackground(assetFile); // Set HDR as the background
    } else {
      setAssets((prevAssets) => [...prevAssets, { name: assetName, file: assetFile }]);
      setActiveAsset({ name: assetName, file: assetFile });
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="app-container">
              <div className="canvas-container">
                <Canvas
                  camera={{
                    position: [5, 5, 10],
                    fov: 45,
                  }}
                >
                  <ambientLight intensity={0.5} />
                  <directionalLight intensity={50} />
                  <Suspense fallback={null}>
                    {activeAsset && <ImportedModel assetPath={activeAsset.file} isHDR={activeAsset.file.endsWith('.hdr')} />}
                    {hdrBackground && <Environment files={hdrBackground} background />} {/* Render HDR background */}
                  </Suspense>
                  <OrbitControls />
                </Canvas>
              </div>
              <div className="asset-browser-container">
                <Link to="/asset-browser" className="asset-store-btn">
                  Asset Store
                </Link>
                <hr />
                <div className="asset-list">
                  <h3>Assets</h3>
                  <hr />
                  {assets.length > 0 ? (
                    assets.map((asset, index) => (
                      <div key={index} className="asset-item">
                        <button onClick={() => setActiveAsset(asset)} className='asset_btn'>{asset.name}</button>
                        <hr />
                      </div>
                    ))
                  ) : null}
                </div>
              </div>
            </div>
          }
        />
        <Route path="/asset-browser" element={<AssetBrowser addAsset={addAsset} />} />
      </Routes>
    </Router>
  );
}

export default App;