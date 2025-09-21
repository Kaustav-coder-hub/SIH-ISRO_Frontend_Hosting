import React, { useState } from 'react';
import './Docs.css';

function Docs() {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="docs-container">
      <div className="docs-sidebar">
        <h3>Documentation</h3>
        <ul>
          <li 
            className={activeSection === 'overview' ? 'active' : ''} 
            onClick={() => setActiveSection('overview')}
          >
            Project Overview
          </li>
          <li 
            className={activeSection === 'features' ? 'active' : ''} 
            onClick={() => setActiveSection('features')}
          >
            Features
          </li>
          <li 
            className={activeSection === 'model' ? 'active' : ''} 
            onClick={() => setActiveSection('model')}
          >
            Model Architecture
          </li>
          <li 
            className={activeSection === 'api' ? 'active' : ''} 
            onClick={() => setActiveSection('api')}
          >
            API Reference
          </li>
          <li 
            className={activeSection === 'usage' ? 'active' : ''} 
            onClick={() => setActiveSection('usage')}
          >
            Usage Guide
          </li>
          <li 
            className={activeSection === 'technology' ? 'active' : ''} 
            onClick={() => setActiveSection('technology')}
          >
            Technology Stack
          </li>
        </ul>
      </div>
      
      <div className="docs-content">
        {activeSection === 'overview' && (
          <div>
            <h2>Project Overview</h2>
            <p>
              This application is designed for the ISRO (Indian Space Research Organization) to analyze and visualize
              geographical data. It provides tools for location analysis, data visualization, and saving analysis results
              for future reference.
            </p>
            <p>
              Users can select locations through a hierarchical selection (Country, State, District, City) and
              perform detailed analysis on the selected areas using satellite imagery and data.
            </p>
          </div>
        )}
        
        {activeSection === 'features' && (
          <div>
            <h2>Features</h2>
            <ul className="feature-list">
              <li>
                <h3>Location Selection</h3>
                <p>Choose locations through a hierarchical dropdown system (Country → State → District → City)</p>
              </li>
              <li>
                <h3>Interactive Map</h3>
                <p>OpenLayers-based map for visualization and interaction with geographical data</p>
              </li>
              <li>
                <h3>Data Analysis</h3>
                <p>Run analysis on selected locations to get detailed metrics</p>
              </li>
              <li>
                <h3>Data Visualization</h3>
                <p>View analysis results in graphical format with various chart types</p>
              </li>
              <li>
                <h3>Save & Retrieve Results</h3>
                <p>Save analysis results and retrieve them later for comparison or reference</p>
              </li>
            </ul>
          </div>
        )}
        
        {activeSection === 'model' && (
          <div>
            <h2>Model Architecture</h2>
            <div className="model-workflow">
              <h3>Processing Pipeline</h3>
              <div className="pipeline-diagram">
                <div className="pipeline-step">Input: Thermal Image + Optical Image</div>
                <div className="pipeline-arrow">↓</div>
                <div className="pipeline-step">Multi-scale SIFT Alignment</div>
                <div className="pipeline-arrow">↓</div>
                <div className="pipeline-step">Edge-Preserving Interpolation</div>
                <div className="pipeline-arrow">↓</div>
                <div className="pipeline-step">Bicubic Upsampling</div>
                <div className="pipeline-arrow">↓</div>
                <div className="pipeline-step">Thermal Physics Correction</div>
                <div className="pipeline-arrow">↓</div>
                <div className="pipeline-step">Output: Enhanced Thermal Image</div>
              </div>
            </div>
            
            <div className="neural-networks">
              <h3>Neural Network Models</h3>
              
              <div className="model-card">
                <h4>SRCNN (Super-Resolution CNN)</h4>
                <p>A simple 3-layer CNN based on the paper "Image Super-Resolution Using Deep Convolutional Networks"</p>
                <p>Used for basic super-resolution tasks</p>
              </div>
              
              <div className="model-card">
                <h4>ProfessionalThermalSR</h4>
                <p>The primary deep learning model for thermal image enhancement</p>
                <h5>Architecture features:</h5>
                <ul>
                  <li>Initial feature extraction with 9×9 convolution</li>
                  <li>4 residual blocks for feature learning</li>
                  <li>Upsampling using pixel shuffle for 2× or 4× resolution increase</li>
                  <li>Final reconstruction layer</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {activeSection === 'api' && (
          <div>
            <h2>API Reference</h2>
            <div className="api-endpoint">
              <h3>GET /api/status</h3>
              <p>Check if the API is running and get version information</p>
              <pre>
                <code>
{`{
  "status": "ok",
  "version": "1.0"
}`}
                </code>
              </pre>
            </div>
            
            <div className="api-endpoint">
              <h3>POST /analyze</h3>
              <p>Analyze a specific location and get metrics</p>
              <h4>Request Body:</h4>
              <pre>
                <code>
{`{
  "country": "INDIA",
  "state": "WEST BENGAL",
  "district": "KOLKATA",
  "city": "KOLKATA"
}`}
                </code>
              </pre>
              <h4>Response:</h4>
              <pre>
                <code>
{`{
  "metrics": {
    "greenCoverPercent": 23.5,
    "urbanDensity": 85.2,
    "waterBodies": 12.3,
    ...
  },
  "timestamp": "2025-09-20T12:34:56"
}`}
                </code>
              </pre>
            </div>
            
            <div className="api-endpoint">
              <h3>POST /save-graph</h3>
              <p>Save an analysis result for future reference</p>
            </div>
            
            <div className="api-endpoint">
              <h3>GET /saved-graphs</h3>
              <p>Retrieve all saved analysis results</p>
            </div>
            
            <div className="api-endpoint">
              <h3>GET /graph/:id</h3>
              <p>Retrieve a specific saved analysis by ID</p>
            </div>
            
            <div className="api-endpoint">
              <h3>DELETE /graph/:id</h3>
              <p>Delete a saved analysis by ID</p>
            </div>
          </div>
        )}
        
        {activeSection === 'usage' && (
          <div>
            <h2>Usage Guide</h2>
            <div className="usage-section">
              <h3>Location Analysis</h3>
              <ol>
                <li>Select a country from the dropdown menu</li>
                <li>Choose a state/province from the available options</li>
                <li>Select a district (if applicable)</li>
                <li>Choose a city or specific location</li>
                <li>Click "Analyze" to run the analysis process</li>
                <li>View the results in the metrics display section</li>
              </ol>
            </div>
            
            <div className="usage-section">
              <h3>Visualizing Data</h3>
              <ol>
                <li>After running an analysis, click "View Visualization" to see charts and graphs</li>
                <li>Explore different visualization types using the available options</li>
                <li>Save visualizations for future reference by clicking "Save Analysis"</li>
              </ol>
            </div>
            
            <div className="usage-section">
              <h3>Managing Saved Analysis</h3>
              <ol>
                <li>Click "Saved Graphs" to view previously saved analyses</li>
                <li>Select any saved analysis to view its details</li>
                <li>Delete unwanted analyses using the delete button</li>
              </ol>
            </div>
          </div>
        )}
        
        {activeSection === 'technology' && (
          <div>
            <h2>Technology Stack</h2>
            <div className="tech-section">
              <h3>Frontend</h3>
              <ul>
                <li>React 19.1.1</li>
                <li>OpenLayers (ol) for mapping</li>
                <li>Recharts for data visualization</li>
                <li>Three.js with React Three Fiber for 3D visualization</li>
                <li>Vite as the build tool and development server</li>
              </ul>
            </div>
            
            <div className="tech-section">
              <h3>Backend</h3>
              <ul>
                <li>Flask (Python) REST API</li>
                <li>PyTorch for machine learning and inference</li>
                <li>OpenCV for image processing</li>
                <li>NumPy, SciPy, and Matplotlib for scientific computing</li>
                <li>SQLite database for storage</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Docs;