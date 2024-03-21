import React, { useEffect, useState } from 'react';
import Globe from 'globe.gl'; // Assuming you have the globe.gl package installed
import * as d3 from 'd3';
import * as polished from 'polished';
import volcanoesData from '../datasets/volcanoes.json'; // Importing the original JSON file

const GlobeVisualization = () => {
  const [displayedVolcanoes, setDisplayedVolcanoes] = useState(volcanoesData);
  let globeInstance = null;

  useEffect(() => {
    const catColor = d3.scaleOrdinal(d3.schemeCategory10.map(col => polished.transparentize(0.2, col)));

    const getAlt = d => d.elevation * 5e-5;

    const getTooltip = d => `
      <div style="text-align: center">
        <div><b>${d.name}</b>, ${d.country}</div>
        <div>(${d.type})</div>
        <div>Elevation: <em>${d.elevation}</em>m</div>
      </div>
    `;

    globeInstance = Globe()
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .heatmapPointLat('lat')
      .heatmapPointLng('lon')
      .heatmapPointWeight(d => d.elevation * 5e-5)
      .heatmapTopAltitude(0.2)
      .heatmapBandwidth(1.35)
      .heatmapColorSaturation(3.2)
      .enablePointerInteraction(true)
      .pointLabel(getTooltip)
      .pointLat('lat')
      .pointLng('lon')
      .pointAltitude(getAlt)
      .pointRadius(0.12)
      .pointColor(d => catColor(d.type))
      .pointLabel(getTooltip)
      .labelLat('lat')
      .labelLng('lon')
      .labelAltitude(d => getAlt(d) + 1e-6)
      .labelDotRadius(0.12)
      .labelDotOrientation(() => 'bottom')
      .labelColor(d => catColor(d.type))
      .labelText('name')
      .labelSize(0.15)
      .labelResolution(1)
      .labelLabel(getTooltip)
      (document.getElementById('globeViz'));

    // Pass the filtered volcanoes data to globe
    updateGlobe(displayedVolcanoes);

    // Cleanup function
    return () => {
      // Perform any cleanup if necessary
    };
  }, []);

  const updateGlobe = (data) => {
    globeInstance.heatmapsData([data]);
    globeInstance.pointsData(data);
    globeInstance.labelsData(data);
  };

  const handleDisplayVolcanoes = (filter) => {
    import(`../datasets/${filter}.json`)
      .then(data => {
        setDisplayedVolcanoes(data.default); // Assuming the data is exported as default
        updateGlobe(data.default); // Update the globe with new data
      })
      .catch(error => {
        console.error(`Error fetching ${filter} volcanoes:`, error);
      });
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div id="globeViz" style={{ width: '100%', height: '80vh' }} />
      <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button onClick={() => handleDisplayVolcanoes('top_10_highest_volcanoes')}>10 volcans les plus hauts</button>
        <button onClick={() => handleDisplayVolcanoes('top_10_lowest_volcanoes')}>10 volcans les plus bas</button>
        <button onClick={() => handleDisplayVolcanoes('recently_active_worldwide_volcanoes')}>10 volcans dernièrement actifs</button>
        <button onClick={() => handleDisplayVolcanoes('top_10_highest_stratovolcanoes')}>10 « strato-volcans » les plus hauts</button>
      </div>
    </div>
  );
};

export default GlobeVisualization;
