import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import './MetricsVisualization.css';

const MetricsVisualization = ({ metrics, onClose }) => {
  const [activeView, setActiveView] = useState('overview');

  if (!metrics) {
    return <div className="loading">Loading metrics...</div>;
  }

  const { quantitative_metrics, qualitative_metrics } = metrics;

  // Prepare data for different chart types
  const barChartData = [
    {
      name: 'PSNR',
      value: quantitative_metrics?.psnr || 0,
      unit: 'dB',
      color: '#8884d8'
    },
    {
      name: 'SSIM',
      value: (quantitative_metrics?.ssim || 0) * 100, // Scale for visibility
      unit: '%',
      color: '#82ca9d'
    },
    {
      name: 'RMSE',
      value: quantitative_metrics?.rmse_kelvin || 0,
      unit: 'K',
      color: '#ffc658'
    },
    {
      name: 'Edge Sharpness',
      value: (qualitative_metrics?.edge_sharpness || 0) * 10, // Scale for visibility
      unit: 'x10',
      color: '#ff7c7c'
    },
    {
      name: 'Alignment',
      value: (qualitative_metrics?.alignment_accuracy || 0) * 100,
      unit: '%',
      color: '#8dd1e1'
    },
    {
      name: 'Fusion Realism',
      value: (qualitative_metrics?.fusion_realism || 0) * 100,
      unit: '%',
      color: '#d084d0'
    }
  ];

  const radarData = [
    {
      subject: 'PSNR Quality',
      A: Math.min((quantitative_metrics?.psnr || 0) / 40 * 100, 100),
      fullMark: 100
    },
    {
      subject: 'SSIM',
      A: (quantitative_metrics?.ssim || 0) * 100,
      fullMark: 100
    },
    {
      subject: 'Temperature Accuracy',
      A: Math.max(100 - (quantitative_metrics?.rmse_kelvin || 0) / 10 * 100, 0),
      fullMark: 100
    },
    {
      subject: 'Edge Sharpness',
      A: Math.min((qualitative_metrics?.edge_sharpness || 0) * 50, 100),
      fullMark: 100
    },
    {
      subject: 'Alignment',
      A: (qualitative_metrics?.alignment_accuracy || 0) * 100,
      fullMark: 100
    },
    {
      subject: 'Fusion Quality',
      A: (qualitative_metrics?.fusion_realism || 0) * 100,
      fullMark: 100
    }
  ];

  const pieData = [
    { name: 'PSNR Score', value: quantitative_metrics?.psnr || 0, color: '#8884d8' },
    { name: 'SSIM Score', value: (quantitative_metrics?.ssim || 0) * 50, color: '#82ca9d' },
    { name: 'Edge Quality', value: (qualitative_metrics?.edge_sharpness || 0) * 25, color: '#ff7c7c' },
    { name: 'Alignment', value: (qualitative_metrics?.alignment_accuracy || 0) * 30, color: '#8dd1e1' }
  ];

  const timeSeriesData = Array.from({ length: 10 }, (_, i) => ({
    time: `T${i + 1}`,
    psnr: (quantitative_metrics?.psnr || 25) + Math.sin(i * 0.5) * 2,
    ssim: (quantitative_metrics?.ssim || 0.6) + Math.cos(i * 0.3) * 0.1,
    rmse: (quantitative_metrics?.rmse_kelvin || 5) + Math.sin(i * 0.7) * 1
  }));

  const ThreeDVisualization = () => {
    // Create 3D scatter plot data points for algorithm visualization
    const scatterData = [];
    const algorithms = ['PSNR', 'SSIM', 'RMSE', 'EdgeSharp', 'Alignment', 'Fusion'];
    
    algorithms.forEach((algo, i) => {
      for (let j = 0; j < 8; j++) {
        const angle = (j / 8) * 2 * Math.PI;
        const radius = 50 + Math.random() * 30;
        const height = (i + 1) * 20 + Math.random() * 15;
        
        scatterData.push({
          x: Math.cos(angle) * radius,
          y: height,
          z: Math.sin(angle) * radius,
          value: getMetricValue(algo),
          algorithm: algo,
          size: getMetricValue(algo) * 2 + 5
        });
      }
    });

    function getMetricValue(algo) {
      switch (algo) {
        case 'PSNR': return quantitative_metrics?.psnr || 25;
        case 'SSIM': return (quantitative_metrics?.ssim || 0.6) * 50;
        case 'RMSE': return Math.max(50 - (quantitative_metrics?.rmse_kelvin || 5) * 5, 10);
        case 'EdgeSharp': return (qualitative_metrics?.edge_sharpness || 1) * 25;
        case 'Alignment': return (qualitative_metrics?.alignment_accuracy || 0.8) * 40;
        case 'Fusion': return (qualitative_metrics?.fusion_realism || 0.7) * 35;
        default: return 20;
      }
    }

    return (
      <div className="three-d-container">
        <h4>🧬 AI Algorithm Performance Visualization</h4>
        <div className="algorithm-3d-viz">
          <div className="neural-network">
            <div className="network-layer input-layer">
              <div className="neuron" data-label="RGB Input">
                <div className="neuron-core"></div>
                <span className="neuron-label">RGB</span>
              </div>
              <div className="neuron" data-label="Infrared Input">
                <div className="neuron-core"></div>
                <span className="neuron-label">IR</span>
              </div>
              <div className="neuron" data-label="Thermal Input">
                <div className="neuron-core"></div>
                <span className="neuron-label">TH</span>
              </div>
            </div>
            
            <div className="network-layer hidden-layer">
              <div className="neuron processing" data-value={quantitative_metrics?.psnr?.toFixed(1)}>
                <div className="neuron-core psnr-neuron"></div>
                <span className="neuron-label">PSNR</span>
                <span className="neuron-value">{quantitative_metrics?.psnr?.toFixed(1)}dB</span>
              </div>
              <div className="neuron processing" data-value={quantitative_metrics?.ssim?.toFixed(3)}>
                <div className="neuron-core ssim-neuron"></div>
                <span className="neuron-label">SSIM</span>
                <span className="neuron-value">{quantitative_metrics?.ssim?.toFixed(3)}</span>
              </div>
              <div className="neuron processing" data-value={quantitative_metrics?.rmse_kelvin?.toFixed(1)}>
                <div className="neuron-core rmse-neuron"></div>
                <span className="neuron-label">RMSE</span>
                <span className="neuron-value">{quantitative_metrics?.rmse_kelvin?.toFixed(1)}K</span>
              </div>
            </div>
            
            <div className="network-layer output-layer">
              <div className="neuron result-neuron" data-value={qualitative_metrics?.edge_sharpness?.toFixed(2)}>
                <div className="neuron-core edge-neuron"></div>
                <span className="neuron-label">Edge</span>
                <span className="neuron-value">{qualitative_metrics?.edge_sharpness?.toFixed(2)}</span>
              </div>
              <div className="neuron result-neuron" data-value={qualitative_metrics?.alignment_accuracy?.toFixed(2)}>
                <div className="neuron-core align-neuron"></div>
                <span className="neuron-label">Align</span>
                <span className="neuron-value">{qualitative_metrics?.alignment_accuracy?.toFixed(2)}</span>
              </div>
              <div className="neuron result-neuron" data-value={qualitative_metrics?.fusion_realism?.toFixed(2)}>
                <div className="neuron-core fusion-neuron"></div>
                <span className="neuron-label">Fusion</span>
                <span className="neuron-value">{qualitative_metrics?.fusion_realism?.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Neural connections */}
            <svg className="connections" viewBox="0 0 600 400">
              {/* Input to Hidden connections */}
              <line x1="100" y1="100" x2="250" y2="80" className="connection active" strokeOpacity={quantitative_metrics?.psnr / 40} />
              <line x1="100" y1="200" x2="250" y2="140" className="connection active" strokeOpacity={quantitative_metrics?.ssim} />
              <line x1="100" y1="300" x2="250" y2="200" className="connection active" strokeOpacity={1 - (quantitative_metrics?.rmse_kelvin || 5) / 20} />
              
              {/* Hidden to Output connections */}
              <line x1="350" y1="80" x2="500" y2="100" className="connection output" strokeOpacity={qualitative_metrics?.edge_sharpness || 0.5} />
              <line x1="350" y1="140" x2="500" y2="200" className="connection output" strokeOpacity={qualitative_metrics?.alignment_accuracy || 0.5} />
              <line x1="350" y1="200" x2="500" y2="300" className="connection output" strokeOpacity={qualitative_metrics?.fusion_realism || 0.5} />
            </svg>
          </div>
          
          <div className="algorithm-metrics">
            <div className="metric-flow">
              <h5>🔄 Processing Pipeline</h5>
              <div className="flow-step">
                <div className="step-icon">📡</div>
                <div className="step-info">
                  <strong>Data Acquisition</strong>
                  <span>Multi-spectral imaging</span>
                </div>
              </div>
              <div className="flow-arrow">↓</div>
              <div className="flow-step">
                <div className="step-icon">🧮</div>
                <div className="step-info">
                  <strong>Feature Extraction</strong>
                  <span>PSNR: {quantitative_metrics?.psnr?.toFixed(2) || 'N/A'}dB</span>
                </div>
              </div>
              <div className="flow-arrow">↓</div>
              <div className="flow-step">
                <div className="step-icon">🎯</div>
                <div className="step-info">
                  <strong>Quality Assessment</strong>
                  <span>SSIM: {quantitative_metrics?.ssim?.toFixed(4) || 'N/A'}</span>
                </div>
              </div>
              <div className="flow-arrow">↓</div>
              <div className="flow-step">
                <div className="step-icon">✨</div>
                <div className="step-info">
                  <strong>Enhancement Output</strong>
                  <span>Fusion Score: {qualitative_metrics?.fusion_realism?.toFixed(2) || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="metrics-viz-overlay">
      <div className="metrics-viz-container">
        <div className="viz-header">
          <h2>📊 Metrics Visualization Dashboard</h2>
          <button className="close-viz-btn" onClick={onClose}>×</button>
        </div>

        <div className="viz-tabs">
          <button 
            className={`tab-btn ${activeView === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveView('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-btn ${activeView === 'charts' ? 'active' : ''}`}
            onClick={() => setActiveView('charts')}
          >
            2D Charts
          </button>
          <button 
            className={`tab-btn ${activeView === '3d' ? 'active' : ''}`}
            onClick={() => setActiveView('3d')}
          >
            3D Models
          </button>
        </div>

        <div className="viz-content">
          {activeView === 'overview' && (
            <div className="overview-grid">
              <div className="metric-card">
                <h3>Evaluation Metrics</h3>
                <div className="metrics-grid">
                  <div className="metric-section">
                    <h4>📊 Quantitative Metrics</h4>
                    <div className="metric-display">
                      <span className="metric-name">PSNR:</span>
                      <span className="metric-val psnr-val">{quantitative_metrics?.psnr?.toFixed(2) || 'N/A'} dB</span>
                    </div>
                    <div className="metric-display">
                      <span className="metric-name">SSIM:</span>
                      <span className="metric-val ssim-val">{quantitative_metrics?.ssim?.toFixed(4) || 'N/A'}</span>
                    </div>
                    <div className="metric-display">
                      <span className="metric-name">RMSE:</span>
                      <span className="metric-val rmse-val">{quantitative_metrics?.rmse_kelvin?.toFixed(2) || 'N/A'} K</span>
                    </div>
                  </div>
                  <div className="metric-section">
                    <h4>🎯 Qualitative Metrics</h4>
                    <div className="metric-display">
                      <span className="metric-name">Edge Sharpness:</span>
                      <span className="metric-val edge-val">{qualitative_metrics?.edge_sharpness?.toFixed(3) || 'N/A'}</span>
                    </div>
                    <div className="metric-display">
                      <span className="metric-name">Alignment Accuracy:</span>
                      <span className="metric-val align-val">{qualitative_metrics?.alignment_accuracy?.toFixed(2) || 'N/A'}</span>
                    </div>
                    <div className="metric-display">
                      <span className="metric-name">Fusion Realism:</span>
                      <span className="metric-val fusion-val">{qualitative_metrics?.fusion_realism?.toFixed(2) || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="chart-preview">
                <h4>Quick Radar View</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Metrics"
                      dataKey="A"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeView === 'charts' && (
            <div className="charts-grid">
              <div className="chart-container">
                <h4>📊 Metrics Comparison Bar Chart</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value, name, props) => [`${value.toFixed(2)} ${props.payload.unit}`, name]} />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8">
                      {barChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <h4>🎯 Quality Radar Chart</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Quality Score"
                      dataKey="A"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.4}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <h4>📈 Temporal Metrics Trends</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="psnr" stroke="#8884d8" name="PSNR" />
                    <Line type="monotone" dataKey="ssim" stroke="#82ca9d" name="SSIM (×50)" />
                    <Line type="monotone" dataKey="rmse" stroke="#ffc658" name="RMSE" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <h4>🥧 Metrics Distribution</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeView === '3d' && (
            <div className="three-d-grid">
              <ThreeDVisualization />
              
              <div className="three-d-stats">
                <h4>3D Metrics Analysis</h4>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Overall Quality Score:</span>
                    <span className="stat-value">
                      {(((quantitative_metrics?.psnr || 0) / 40 + 
                         (quantitative_metrics?.ssim || 0) + 
                         (qualitative_metrics?.alignment_accuracy || 0)) / 3 * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Enhancement Factor:</span>
                    <span className="stat-value">
                      {((qualitative_metrics?.edge_sharpness || 1) * (qualitative_metrics?.fusion_realism || 1)).toFixed(2)}x
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Temperature Precision:</span>
                    <span className="stat-value">
                      ±{quantitative_metrics?.rmse_kelvin?.toFixed(2) || 'N/A'} K
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricsVisualization;