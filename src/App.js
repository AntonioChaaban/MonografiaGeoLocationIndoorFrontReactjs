import React, { useState, useRef, useEffect } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import OSM from 'ol/source/OSM';
import axios from 'axios';
import proj4 from 'proj4';

const MapComponent = () => {
  const [map, setMap] = useState([]);

  useEffect(() => {
    const initialMap = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });
    setMap(initialMap);
  }, []);

  useEffect(() => {
    if (map) {
      const vectorSource = new VectorSource();
      const vectorLayer = new VectorLayer({
        source: vectorSource
      });
      map.addLayer(vectorLayer);

      let cordenadas;
      setInterval(() => {
        axios
        .get("http://localhost:5000/geoData") // faz uma chamada GET à API
        .then(({ data }) => cordenadas = data.features[0].geometry.coordinates )
        .catch((error) => {
            console.log(error); // lidando com possíveis erros de chamada à API
        });
        const fromProjection = proj4.defs('EPSG:4326'); // WGS84 (Latitude e Longitude)
        const toProjection = proj4.defs('EPSG:3857'); // Web Mercator

        const coordinates = proj4(fromProjection, toProjection, cordenadas );

        const dataDois =  {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: coordinates,
              },
              properties: {
                name: 'My Point',
              },
            },
          ],
        };

        const features = new GeoJSON().readFeatures(dataDois);
        vectorSource.addFeatures(features);
        map.getView().fit(vectorSource.getExtent(), { padding: [50, 50, 50, 50] });

      }, 1000);
    }
  }, [map]);

  return (
    <div id="map" style={{ width: '100%', height: '100%' }}>
      <p>Carregando mapa...</p>
    </div>
  );
};

export default MapComponent;
