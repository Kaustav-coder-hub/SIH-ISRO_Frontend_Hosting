import React from 'react';
import './MetricsDisplay.css';

const MetricsDisplay = ({ metrics }) => {
  if (!metrics) {
    return <div className="metrics-container">Loading metrics...</div>;
  }

  const { quantitative_metrics, qualitative_metrics } = metrics;

  return (
    <div className="metrics-container">
      <h3 className="metrics-title">Evaluation Metrics</h3>
      <div className="metrics-section">
        <h4>Quantitative Metrics</h4>
        <div className="metric-item">
          <span className="metric-label">PSNR:</span>
          <span className="metric-value">{quantitative_metrics?.psnr.toFixed(2) ?? 'N/A'} dB</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">SSIM:</span>
          <span className="metric-value">{quantitative_metrics?.ssim.toFixed(4) ?? 'N/A'}</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">RMSE:</span>
          <span className="metric-value">{quantitative_metrics?.rmse_kelvin.toFixed(2) ?? 'N/A'} K</span>
        </div>
      </div>
      <div className="metrics-section">
        <h4>Qualitative Metrics</h4>
        <div className="metric-item">
          <span className="metric-label">Edge Sharpness:</span>
          <span className="metric-value">{qualitative_metrics?.edge_sharpness.toFixed(3) ?? 'N/A'}</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Alignment Accuracy:</span>
          <span className="metric-value">{qualitative_metrics?.alignment_accuracy.toFixed(2) ?? 'N/A'}</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Fusion Realism:</span>
          <span className="metric-value">{qualitative_metrics?.fusion_realism.toFixed(2) ?? 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default MetricsDisplay;
