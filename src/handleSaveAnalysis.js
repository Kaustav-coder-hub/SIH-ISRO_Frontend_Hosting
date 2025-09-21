  const handleSaveAnalysis = async () => {
    if (!analysisResult) {
      alert('No analysis result to save');
      return;
    }
    
    try {
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
    }
  };