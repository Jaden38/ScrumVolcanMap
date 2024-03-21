// src/App.js
import React from 'react';
import GlobeVisualization from './components/GlobeComponent';
import './App.css';
import GlobeCountries from './components/GlobeCountries';

const App = () => {
  return (
    <div className="App">
      <GlobeCountries />
    </div>
  );
};

export default App;
