import React, { useState, useEffect } from 'react';
import './SavedGraphs.css';

function SavedGraphs({ isOpen, onClose }) {
  const [savedGraphs, setSavedGraphs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchSavedGraphs();
    }
  }, [isOpen]);

  const fetchSavedGraphs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/saved-graphs');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSavedGraphs(data);
    } catch (error) {
      console.error('Error fetching saved graphs:', error);
      setError('Failed to load saved graphs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (graphId, graphName) => {
    // Create a download link for the graph image
    const link = document.createElement('a');
    link.href = savedGraphs.find(graph => graph.id === graphId).visualization;
    link.download = `${graphName || 'graph'}-${graphId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="saved-graphs-overlay" onClick={onClose}>
      <div className="saved-graphs-content" onClick={(e) => e.stopPropagation()}>
        <h3>Saved Analysis Graphs</h3>
        
        {loading && <div className="loading-message">Loading saved graphs...</div>}
        
        {error && <div className="error-message">{error}</div>}
        
        {!loading && !error && savedGraphs.length === 0 && (
          <div className="no-graphs-message">
            No saved graphs found. Analyze an area and click "Save" to store graphs here.
          </div>
        )}
        
        {!loading && !error && savedGraphs.length > 0 && (
          <div className="saved-graphs-list">
            {savedGraphs.map((graph) => (
              <div key={graph.id} className="saved-graph-item">
                <div className="saved-graph-details">
                  <h4>{graph.location_name || 'Location'}</h4>
                  <p>
                    <strong>Coordinates:</strong> {graph.lat.toFixed(4)}, {graph.lon.toFixed(4)}
                  </p>
                  <p>
                    <strong>Date:</strong> {new Date(graph.timestamp).toLocaleString()}
                  </p>
                </div>
                
                <div className="saved-graph-images">
                  <div className="saved-graph-image-container">
                    <h5>RGB</h5>
                    <img src={graph.rgb} alt="RGB Analysis" className="saved-graph-image" />
                  </div>
                  <div className="saved-graph-image-container">
                    <h5>Infrared</h5>
                    <img src={graph.infrared} alt="Infrared Analysis" className="saved-graph-image" />
                  </div>
                  {graph.visualization && (
                    <div className="saved-graph-image-container full-width">
                      <h5>Visualization</h5>
                      <img src={graph.visualization} alt="Visualization" className="saved-graph-image" />
                    </div>
                  )}
                </div>
                
                <div className="saved-graph-actions">
                  <button 
                    onClick={() => handleDownload(graph.id, graph.location_name)}
                    className="download-button"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <button onClick={onClose} className="close-button">Close</button>
      </div>
    </div>
  );
}

export default SavedGraphs;