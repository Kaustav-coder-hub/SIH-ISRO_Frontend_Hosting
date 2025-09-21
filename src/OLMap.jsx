import React, { useRef, useEffect, useState, useImperativeHandle } from 'react';
import "./App.css";
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Text, Style, Fill, Stroke } from 'ol/style';

// Constants for layer URLs
const SATELLITE_URL = 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';
const THERMAL_URL = 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';
const GRAYSCALE_URL = 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';
const YELLOW_CHANNEL_URL = 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';

// Indian states data
const INDIAN_STATES = [
  { name: 'West Bengal', center: [88.3639, 22.5726] },
  { name: 'Maharashtra', center: [75.7139, 19.7515] },
  { name: 'Tamil Nadu', center: [78.6569, 11.1271] },
  { name: 'Karnataka', center: [76.1025, 14.2333] },
  { name: 'Gujarat', center: [71.1924, 22.2587] },
  { name: 'Rajasthan', center: [74.2179, 26.4499] },
  { name: 'Uttar Pradesh', center: [80.9462, 26.8467] },
  { name: 'Madhya Pradesh', center: [78.6569, 22.9734] },
  { name: 'Bihar', center: [85.3131, 25.0961] },
  { name: 'Telangana', center: [79.0193, 17.1124] },
  { name: 'Andhra Pradesh', center: [79.7400, 15.9129] },
  { name: 'Kerala', center: [76.2711, 10.8505] },
  { name: 'Odisha', center: [85.0985, 20.9517] },
  { name: 'Jharkhand', center: [85.2799, 23.6102] },
  { name: 'Punjab', center: [75.3412, 31.1471] },
  { name: 'Haryana', center: [76.0856, 29.0588] },
  { name: 'Chhattisgarh', center: [81.8661, 21.2787] },
  { name: 'Assam', center: [92.9376, 26.2006] },
  { name: 'Uttarakhand', center: [79.0193, 30.0668] },
  { name: 'Himachal Pradesh', center: [77.1734, 31.1048] },
  { name: 'Goa', center: [74.1240, 15.2993] }
];

// West Bengal districts and cities
const WB_LOCATIONS = [
  { name: 'Kolkata District', center: [88.3639, 22.5726], type: 'district' },
  { name: 'North 24 Parganas', center: [88.5124, 22.6168], type: 'district' },
  { name: 'South 24 Parganas', center: [88.3333, 22.1352], type: 'district' },
  { name: 'Howrah', center: [88.2636, 22.5958], type: 'district' },
  { name: 'Hooghly', center: [88.3917, 22.8858], type: 'district' },
  { name: 'Purba Medinipur', center: [87.9338, 22.2977], type: 'district' },
  { name: 'Paschim Medinipur', center: [87.3236, 22.4257], type: 'district' },
  { name: 'Darjeeling', center: [88.2627, 27.0360], type: 'district' },
  { name: 'Kolkata', center: [88.3639, 22.5726], type: 'city' },
  { name: 'Howrah', center: [88.2636, 22.5958], type: 'city' },
  { name: 'Durgapur', center: [87.3119, 23.5204], type: 'city' },
  { name: 'Asansol', center: [86.9833, 23.6833], type: 'city' },
  { name: 'Siliguri', center: [88.3952, 26.7271], type: 'city' },
  { name: 'Kharagpur', center: [87.3236, 22.3302], type: 'city' }
];

// Custom thermal color function
const applyThermalColor = (canvas) => {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const origR = data[i];
    const origG = data[i + 1];
    const origB = data[i + 2];
    const gray = (origR * 0.299 + origG * 0.587 + origB * 0.114);
    
    let thermalR, thermalG, thermalB;
    if (gray < 64) {
      thermalR = gray * 4;
      thermalG = 0;
      thermalB = 0;
    } else if (gray < 128) {
      thermalR = 255;
      thermalG = (gray - 64) * 4;
      thermalB = 0;
    } else {
      const whiteFactor = (gray - 128) * 2;
      thermalR = 255;
      thermalG = 255;
      thermalB = Math.min(255, whiteFactor);
    }
    
    const blendFactor = 0.7;
    data[i] = Math.min(255, (thermalR * blendFactor) + (origR * (1 - blendFactor)));
    data[i + 1] = Math.min(255, (thermalG * blendFactor) + (origG * (1 - blendFactor)));
    data[i + 2] = Math.min(255, (thermalB * blendFactor) + (origB * (1 - blendFactor)));
    
    const detail = (gray - 128) / 2;
    if (detail > 0) {
      data[i] = Math.min(255, data[i] + detail);
      data[i + 1] = Math.min(255, data[i + 1] + detail);
      data[i + 2] = Math.min(255, data[i + 2] + detail);
    }
    
    data[i + 3] = 255;
  }
  
  ctx.putImageData(imageData, 0, 0);
};

// Grayscale view transformation
const applyGrayscale = (canvas) => {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const origR = data[i];
    const origG = data[i + 1];
    const origB = data[i + 2];
    const gray = (origR * 0.299 + origG * 0.587 + origB * 0.114);
    
    // Pure grayscale
    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
    
    // Enhance contrast slightly
    if (gray > 128) {
      const enhance = (gray - 128) / 2;
      data[i] = Math.min(255, data[i] + enhance);
      data[i + 1] = Math.min(255, data[i + 1] + enhance);
      data[i + 2] = Math.min(255, data[i + 2] + enhance);
    }
    
    data[i + 3] = 255;
  }
  
  ctx.putImageData(imageData, 0, 0);
};

// Yellow channel visualization
const applyYellowChannel = (canvas) => {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const origR = data[i];
    const origG = data[i + 1];
    const origB = data[i + 2];
    const gray = (origR * 0.299 + origG * 0.587 + origB * 0.114);
    
    // Yellow channel (red + green)
    data[i] = Math.min(255, gray * 1.2); // Red
    data[i + 1] = Math.min(255, gray * 1.1); // Green
    data[i + 2] = Math.max(0, gray * 0.2); // Minimal blue
    
    // Add intensity to highlighted areas
    if (gray > 180) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = Math.min(200, data[i + 2] + 50);
    }
    
    data[i + 3] = 255;
  }
  
  ctx.putImageData(imageData, 0, 0);
};

const OLMap = React.forwardRef((props, ref) => {
  const mapRef = useRef();
  const [viewType, setViewType] = useState('rgb');
  const mapInstance = useRef(null);
  const rgbLayer = useRef(null);
  const thermalLayer = useRef(null);
  const grayscaleLayer = useRef(null);
  const yellowChannelLayer = useRef(null);
  const labelsLayer = useRef(null);
  const markerLayer = useRef(null);
  
  const [loadingTiles, setLoadingTiles] = useState(0);
  const tileLoadEndPromise = useRef(null);
  const tileLoadEndPromiseResolve = useRef(null);

  const createLabelStyle = (text, type = 'state') => {
    let fontSize, fontWeight, offsetY;
    
    switch(type) {
      case 'state':
        fontSize = '14px';
        fontWeight = 'bold';
        offsetY = -15;
        break;
      case 'district':
        fontSize = '12px';
        fontWeight = 'normal';
        offsetY = -10;
        break;
      case 'city':
        fontSize = '11px';
        fontWeight = 'normal';
        offsetY = -5;
        break;
      default:
        fontSize = '12px';
        fontWeight = 'normal';
        offsetY = -10;
    }
    
    return new Style({
      text: new Text({
        text: text,
        font: `${fontWeight} ${fontSize} Arial`,
        fill: new Fill({ color: type === 'state' ? '#FFFFFF' : '#F0F0F0' }),
        stroke: new Stroke({ color: '#000000', width: 2 }),
        offsetY: offsetY,
        padding: [5, 5, 5, 5]
      })
    });
  };

  useEffect(() => {
    const setupTileTracking = (source) => {
      source.on('tileloadstart', () => {
        setLoadingTiles(prev => prev + 1);
      });
      source.on('tileloadend', () => {
        setLoadingTiles(prev => prev - 1);
      });
      source.on('tileloaderror', () => {
        setLoadingTiles(prev => prev - 1);
      });
    };

    if (!rgbLayer.current) {
      const source = new XYZ({
        url: SATELLITE_URL,
        attributions: '© Google Maps',
        maxZoom: 20,
        crossOrigin: 'anonymous'
      });
      setupTileTracking(source);
      rgbLayer.current = new TileLayer({ source, visible: true });
    }

    if (!thermalLayer.current) {
        const source = new XYZ({
            url: THERMAL_URL,
            attributions: '© Google Maps',
            maxZoom: 20,
            crossOrigin: 'anonymous',
            tileLoadFunction: (imageTile, src) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    applyThermalColor(canvas);
                    imageTile.getImage().src = canvas.toDataURL();
                };
                img.src = src;
            }
        });
        setupTileTracking(source);
        thermalLayer.current = new TileLayer({
            source,
            visible: false,
            className: 'thermal-layer'
        });
    }

    if (!grayscaleLayer.current) {
        const source = new XYZ({
            url: GRAYSCALE_URL,
            attributions: '© Google Maps',
            maxZoom: 20,
            crossOrigin: 'anonymous',
            tileLoadFunction: (imageTile, src) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    applyGrayscale(canvas);
                    imageTile.getImage().src = canvas.toDataURL();
                };
                img.src = src;
            }
        });
        setupTileTracking(source);
        grayscaleLayer.current = new TileLayer({
            source,
            visible: false,
            className: 'grayscale-layer'
        });
    }

    if (!yellowChannelLayer.current) {
        const source = new XYZ({
            url: YELLOW_CHANNEL_URL,
            attributions: '© Google Maps',
            maxZoom: 20,
            crossOrigin: 'anonymous',
            tileLoadFunction: (imageTile, src) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    applyYellowChannel(canvas);
                    imageTile.getImage().src = canvas.toDataURL();
                };
                img.src = src;
            }
        });
        setupTileTracking(source);
        yellowChannelLayer.current = new TileLayer({
            source,
            visible: false,
            className: 'yellow-channel-layer'
        });
    }

    if (!labelsLayer.current) {
      const features = [
        ...INDIAN_STATES.map(state => new Feature({ geometry: new Point(state.center), name: state.name })),
        ...WB_LOCATIONS.map(loc => new Feature({ geometry: new Point(loc.center), name: loc.name, type: loc.type }))
      ];
      features.forEach(feature => {
        feature.setStyle(createLabelStyle(feature.get('name'), feature.get('type') || 'state'));
      });
      labelsLayer.current = new VectorLayer({
        source: new VectorSource({ features }),
        minZoom: 4,
        maxZoom: 19,
        zIndex: 1
      });
    }

    if (!markerLayer.current) {
      markerLayer.current = new VectorLayer({
        source: new VectorSource(),
        zIndex: 2
      });
    }

    if (!mapInstance.current && mapRef.current) {
      mapInstance.current = new Map({
        target: mapRef.current,
        layers: [rgbLayer.current, thermalLayer.current, grayscaleLayer.current, yellowChannelLayer.current, labelsLayer.current, markerLayer.current],
        view: new View({
          center: [78.9629, 20.5937],
          zoom: 4,
          maxZoom: 19,
          minZoom: 2,
          projection: 'EPSG:4326'
        }),
      });
    }
  }, []);

  useEffect(() => {
    if (rgbLayer.current && thermalLayer.current && grayscaleLayer.current && yellowChannelLayer.current) {
      console.log(`🔄 Switching to ${viewType} view mode`);
      rgbLayer.current.setVisible(viewType === 'rgb');
      thermalLayer.current.setVisible(viewType === 'thermal');
      grayscaleLayer.current.setVisible(viewType === 'grayscale');
      yellowChannelLayer.current.setVisible(viewType === 'yellowchannel');
      if (mapInstance.current) {
        setTimeout(() => mapInstance.current.render(), 100);
      }
    }
  }, [viewType]);

  useEffect(() => {
    if (loadingTiles === 0 && tileLoadEndPromiseResolve.current) {
      console.log('✅ All tiles finished loading.');
      tileLoadEndPromiseResolve.current();
      tileLoadEndPromise.current = null;
      tileLoadEndPromiseResolve.current = null;
    }
  }, [loadingTiles]);

  useEffect(() => {
    return () => {
      if (mapInstance.current) {
        mapInstance.current.dispose();
        mapInstance.current = null;
      }
    };
  }, []);

  useImperativeHandle(ref, () => ({
    centerMap: (lon, lat, zoom = 10, label = 'Location') => {
      if (mapInstance.current) {
        const view = mapInstance.current.getView();
        view.setCenter([lon, lat]);
        view.setZoom(zoom);
        
        if (markerLayer.current) {
          const source = markerLayer.current.getSource();
          source.clear();
          const marker = new Feature({ geometry: new Point([lon, lat]) });
          marker.setStyle(new Style({
            text: new Text({
              text: label,
              offsetY: -20,
              fill: new Fill({ color: 'black' }),
              stroke: new Stroke({ color: 'white', width: 3 }),
              font: '12px Arial'
            })
          }));
          source.addFeature(marker);
        }
      }
    },
    
    debugMapStatus: () => {
      if (!mapInstance.current) {
        console.log('❌ Map instance not available');
        return;
      }
      console.log('🔍 Map Debug Status:');
      console.log(`- View type: ${viewType}, Tiles loading: ${loadingTiles}`);
      const mapElement = mapInstance.current.getTargetElement();
      if (mapElement) {
        const canvases = mapElement.querySelectorAll('canvas');
        console.log(`- Found ${canvases.length} canvas elements`);
        canvases.forEach((canvas, i) => {
          const style = window.getComputedStyle(canvas);
          console.log(`  Canvas ${i}: ${canvas.width}x${canvas.height}, display: ${style.display}, visibility: ${style.visibility}`);
        });
      }
    },
    
    captureMapImage: () => {
      return new Promise((resolve) => {
        if (!mapInstance.current) {
          console.error('❌ Cannot capture: Map instance not available.');
          return resolve(null);
        }
        console.log('🖼️ Starting intelligent map capture...');
        
        const doCapture = () => {
          try {
            const mapElement = mapInstance.current.getTargetElement();
            const canvases = mapElement.querySelectorAll('canvas');
            if (canvases.length === 0) {
              console.error('❌ No canvas elements found for capture.');
              return resolve(null);
            }
            
            const canvas = document.createElement('canvas');
            const mapSize = mapInstance.current.getSize();
            canvas.width = mapSize[0];
            canvas.height = mapSize[1];
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            let drawnCanvases = 0;
            canvases.forEach(c => {
              if (c.width > 0 && c.height > 0 && window.getComputedStyle(c).display !== 'none') {
                ctx.drawImage(c, 0, 0, canvas.width, canvas.height);
                drawnCanvases++;
              }
            });

            if (drawnCanvases > 0) {
              console.log(`✅ Capture successful, drew ${drawnCanvases} canvases.`);
              resolve(canvas.toDataURL('image/png'));
            } else {
              console.error('❌ Capture failed: No visible canvases were drawn.');
              resolve(null);
            }
          } catch (e) {
            console.error('❌ Error during canvas capture:', e);
            resolve(null);
          }
        };

        mapInstance.current.once('rendercomplete', () => {
          console.log('🗺️ Map render complete. Checking tile status...');
          if (loadingTiles === 0) {
            console.log('Tiles already loaded. Capturing now.');
            setTimeout(doCapture, 150); // Short delay for final paint
          } else {
            console.log(`⏳ Waiting for ${loadingTiles} tiles to load...`);
            tileLoadEndPromise.current = new Promise(res => {
              tileLoadEndPromiseResolve.current = res;
            });
            Promise.race([
              tileLoadEndPromise.current,
              new Promise(res => setTimeout(res, 8000)) // 8s timeout
            ]).then(() => {
              console.log('Wait complete. Capturing now.');
              setTimeout(doCapture, 150);
            });
          }
        });

        mapInstance.current.render();
      });
    }
  }));

  return (
    <div className="map-container">
      <div ref={mapRef} className="ol-map" />
      <div className="view-toggle">
        <select 
          value={viewType} 
          onChange={(e) => setViewType(e.target.value)}
          className="view-select"
        >
          <option value="rgb">Satellite View (RGB)</option>
          <option value="thermal">Infrared View</option>
          <option value="grayscale">Grayscale View</option>
          <option value="yellowchannel">Yellow Channel View</option>
        </select>
      </div>
      {viewType === 'thermal' && (
        <div className="thermal-legend">
          <div className="thermal-gradient"></div>
          <div className="thermal-labels">
            <span>Cold</span>
            <span>Hot</span>
          </div>
        </div>
      )}
      {viewType === 'grayscale' && (
        <div className="grayscale-legend">
          <div className="grayscale-gradient"></div>
          <div className="grayscale-labels">
            <span>Dark</span>
            <span>Light</span>
          </div>
        </div>
      )}
      {viewType === 'yellowchannel' && (
        <div className="yellow-channel-legend">
          <div className="yellow-channel-gradient"></div>
          <div className="yellow-channel-labels">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      )}
    </div>
  );
});

export default OLMap;
