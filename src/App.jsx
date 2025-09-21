import React, { useRef, useState } from 'react';
import OLMap from './OLMap';
import MetricsDisplay from './MetricsDisplay';
import MetricsVisualization from './MetricsVisualization';
import SavedGraphs from './SavedGraphs';
import Docs from './Docs';

function App() {
  const mapRef = useRef();
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false);
  const [showSavedGraphs, setShowSavedGraphs] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const countries = ['INDIA', 'USA', 'CANADA', 'AUSTRALIA'];
  const states = {
    INDIA: ['DELHI', 'WEST BENGAL', 'MUMBAI'],
    USA: ['CALIFORNIA', 'NEW YORK', 'TEXAS'],
    CANADA: ['ONTARIO', 'QUEBEC', 'BRITISH COLUMBIA'],
    AUSTRALIA: ['NEW SOUTH WALES', 'VICTORIA', 'QUEENSLAND']
  };
  const districts = {
    'WEST BENGAL': ['NADIA', 'RANAGHAT', 'KOLKATA', 'HOWRAH'],
    // Add for others if needed
  };
  const cities = {
    NADIA: ['KALYANI', 'RANAGHAT', 'KRISHNANAGAR', 'CHAKDAHA'],
    RANAGHAT: ['RANAGHAT'],
    KOLKATA: ['KOLKATA'],
    HOWRAH: ['HOWRAH'],
    // Add more as needed
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setSelectedState('');
    setSelectedDistrict('');
    setSelectedCity('');
    setSearchResult(null);
  };

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedDistrict('');
    setSelectedCity('');
    setSearchResult(null);
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    setSelectedCity('');
    setSearchResult(null);
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setSearchResult(null);
  };

  // Simple geocoding using Nominatim
  const handleSearch = async (e) => {
    e.preventDefault();
    const country = selectedCountry;
    const state = selectedState;
    const district = selectedDistrict;
    const city = selectedCity;
    const query = [country, state, district, city].filter(Boolean).join(', ');
    if (!query) return;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.length > 0) {
        const result = data[0];
        const { lon, lat, display_name } = result;
        setSearchResult({ lat: parseFloat(lat), lon: parseFloat(lon), address: display_name });
        if (mapRef.current && mapRef.current.centerMap) {
          const label = selectedCity || selectedDistrict || selectedState || selectedCountry || 'Location';
          mapRef.current.centerMap(parseFloat(lon), parseFloat(lat), 12, label);
        }
      } else {
        alert('Location not found');
        setSearchResult(null);
      }
    } catch {
      alert('Error searching location');
      setSearchResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!searchResult) {
      alert('Please search for a location first');
      return;
    }
    
    try {
      console.log('🔍 Starting analysis...');
      setIsAnalyzing(true);
      setAnalysisResult(null);
      
      // Capture the current map view as an image
      console.log('📸 Capturing map image...');
      
      // Debug map status
      if (mapRef.current.debugMapStatus) {
        mapRef.current.debugMapStatus();
      }
      
      // Add a small delay to ensure map is fully rendered
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const satelliteImageData = await mapRef.current.captureMapImage();
      
      if (!satelliteImageData) {
        throw new Error('Unable to capture map image. Please ensure the map is fully loaded and try again.');
      }
      
      // Validate captured image
      if (!satelliteImageData.startsWith('data:image')) {
        throw new Error('Invalid image format captured from map');
      }
      
      console.log('📡 Sending analysis request to backend...');
      
      // Send the captured image along with coordinates to backend
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lat: parseFloat(searchResult.lat),
          lon: parseFloat(searchResult.lon),
          location_name: selectedCity || selectedDistrict || selectedState || selectedCountry || 'Location',
          satellite_image: satelliteImageData
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Analysis completed:', result);
      
      if (result.error || result.status === 'error') {
        throw new Error(result.message || result.error || 'Analysis failed');
      }
      
      if (!result.rgb || !result.infrared) {
        throw new Error('Incomplete analysis results received');
      }
      
      setAnalysisResult(result);
      setShowModal(true);
      
    } catch (error) {
      console.error('❌ Analysis failed:', error);
      alert(`Analysis failed: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveAnalysis = async () => {
    if (!analysisResult) {
      alert('No analysis result to save');
      return;
    }
    
    try {
      setIsSaving(true);
      const response = await fetch('http://localhost:5000/save-graph', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lat: analysisResult.coordinates?.lat,
          lon: analysisResult.coordinates?.lon,
          location_name: selectedCity || selectedDistrict || selectedState || selectedCountry || 'Location',
          rgb: analysisResult.rgb,
          infrared: analysisResult.infrared,
          visualization: analysisResult.visualization,
          metrics: analysisResult.metrics
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        alert('Analysis saved to database successfully!');
      } else {
        throw new Error(result.message || 'Failed to save analysis');
      }
    } catch (error) {
      console.error('Failed to save analysis:', error);
      alert(`Failed to save analysis: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="app-main">
      <OLMap ref={mapRef} />
      <div className="location-search">
        <h3>Search Location</h3>
        <form onSubmit={handleSearch}>
          <input type="text" list="countries" name="country" value={selectedCountry} onChange={handleCountryChange} className="search-input" placeholder="Select or type Country" />
          <datalist id="countries">
            {countries.map(country => <option key={country} value={country} />)}
          </datalist>
          <input type="text" list="states" name="state" value={selectedState} onChange={handleStateChange} className="search-input" placeholder="Select or type State" disabled={!selectedCountry} />
          <datalist id="states">
            {selectedCountry && states[selectedCountry]?.map(state => <option key={state} value={state} />)}
          </datalist>
          <input type="text" list="districts" name="district" value={selectedDistrict} onChange={handleDistrictChange} className="search-input" placeholder="Select or type District" disabled={!selectedState} />
          <datalist id="districts">
            {selectedState && districts[selectedState]?.map(district => <option key={district} value={district} />)}
          </datalist>
          <input type="text" list="cities" name="city" value={selectedCity} onChange={handleCityChange} className="search-input" placeholder="Select or type City" disabled={!selectedDistrict} />
          <datalist id="cities">
            {selectedDistrict && cities[selectedDistrict]?.map(city => <option key={city} value={city} />)}
          </datalist>
          <button type="submit" className="search-button">Search</button>
        </form>
        {searchResult && (
          <div className="search-result">
            <h4>Location Details</h4>
            <p><strong>Coordinates:</strong> Lat: {searchResult.lat.toFixed(6)}, Lon: {searchResult.lon.toFixed(6)}</p>
            <p><strong>Address:</strong> {searchResult.address}</p>
            <button 
              onClick={handleAnalyze} 
              className="analyze-button" 
              disabled={isAnalyzing || !searchResult}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        )}
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Analysis Results</h3>
            {analysisResult && (
              <div className="analysis-info">
                <p><strong>Location:</strong> {analysisResult.coordinates?.lat?.toFixed(4)}, {analysisResult.coordinates?.lon?.toFixed(4)}</p>
                <p><strong>Status:</strong> {analysisResult.message}</p>
                {analysisResult.enhancement_applied && (
                  <p><strong>Enhancement:</strong> {analysisResult.scale_factor} applied</p>
                )}
                <MetricsDisplay metrics={analysisResult.metrics} />
                <div className="metrics-actions">
                  <button 
                    onClick={() => setShowVisualization(true)} 
                    className="visualize-button"
                  >
                    📊 Visualize Metrics
                  </button>
                  <button 
                    onClick={handleSaveAnalysis} 
                    className="save-button"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : '💾 Save to Database'}
                  </button>
                </div>
              </div>
            )}
            <div className="images-container">
              <div className="image-item">
                <h4>🛰️ RGB Satellite Image</h4>
                <img src={analysisResult?.rgb || ''} alt="RGB Satellite" className="analysis-image" />
              </div>
              <div className="image-item">
                <h4>🌡️ Enhanced Infrared</h4>
                <img src={analysisResult?.infrared || ''} alt="Enhanced Infrared" className="analysis-image" />
              </div>
            </div>
            {analysisResult?.visualization && (
              <div className="visualization-container">
                <h4>📈 Comprehensive Analysis & Metrics</h4>
                <img src={analysisResult.visualization} alt="Analysis Visualization" className="visualization-image" />
              </div>
            )}
            <button onClick={() => setShowModal(false)} className="close-button">Close</button>
          </div>
        </div>
      )}
      {showVisualization && analysisResult && (
        <MetricsVisualization 
          metrics={analysisResult.metrics} 
          onClose={() => setShowVisualization(false)}
        />
      )}
      
      <button className="database-button" onClick={() => setShowSavedGraphs(true)}>
        🗄️
      </button>
      
      <button className="docs-button" onClick={() => setShowDocs(true)}>
        Documentation
      </button>
      
      <SavedGraphs 
        isOpen={showSavedGraphs} 
        onClose={() => setShowSavedGraphs(false)} 
      />
      
      {showDocs && (
        <div className="docs-page">
          <div className="docs-header">
            <button className="back-button" onClick={() => setShowDocs(false)}>
              ← Back to Application
            </button>
          </div>
          <Docs />
        </div>
      )}
    </div>
  );
}

export default App;
