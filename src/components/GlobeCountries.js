import React, { useEffect, useState } from 'react';
import Globe from 'globe.gl'; // Assuming you have the globe.gl package installed
import * as d3 from 'd3';
import * as polished from 'polished';

const GlobeCountries = () => {
  const [countriesData, setCountriesData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/countries.geojson'); // Fetch the GeoJSON file
        console.log(response);
        const data = await response.json(); // Parse the JSON response
        setCountriesData(data.features); // Set the GeoJSON features to state
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Call the async function to fetch data

    // Cleanup function
    return () => {
      // Perform any cleanup if necessary
    };
  }, []);

  useEffect(() => {
    if (countriesData) {
      // Create Globe instance once the data is fetched
      const globeInstance = Globe()
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
        .polygonsData(countriesData)
        .polygonAltitude(0.005)
        .polygonCapColor(() => "rgba(33,150,243,0.01)")
        .polygonSideColor(() => "rgba(0,188,212, 0.015)")
        .polygonsTransitionDuration(0)
        .polygonStrokeColor(() => "rgba(101, 31, 255,0.4)")
        .polygonLabel(({ properties: d }) => `
          <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
          Population: <i>${d.POP_EST}</i>
        `)
        // .onPolygonHover((hoverD) =>
        //     globeInstance.polygonStrokeColor((d) =>
        //     d === hoverD ? "#FFC107" : "rgba(101, 31, 255,0.4))"
        //   )
        // )
        (document.getElementById('globeViz'));
    }
  }, [countriesData]);

  return (
    <div id="globeViz" />
  );
};

export default GlobeCountries;
