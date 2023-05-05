import React, { useState, useEffect } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Point from 'ol/geom/Point';
import { fromLonLat } from "ol/proj";
import axios from "axios";
import proj4 from 'proj4';
import { Feature } from "ol";
import ImageLayer from 'ol/layer/Image';
import ImageStatic from 'ol/source/ImageStatic';
import { Fill,Stroke, Style } from 'ol/style';

function TesteDois() {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    // cria um novo mapa com camada de fundo OSM
    const center = [-5378054.0720900195, -1140234.6921608197];
    const newMap = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        new ImageLayer({
          source: new ImageStatic({
            url: require('./images/casa.png'),
            imageSize: [217, 326],
            projection: 'EPSG:4326',
            imageExtent: [-48.31184472784051, -10.18867328971559, -48.31196006281779, -10.188830364448446],
          }),
        }),
      ],
      view: new View({
        center: center,
        zoom: 22
      })
    });
    setMap(newMap);

    // cria uma nova fonte de dados vetor para o marcador

    const markerSourceApUm = new VectorSource({
      features: []
    });
    const markerSourceApDois = new VectorSource({
      features: []
    });
    const markerSourceApTres = new VectorSource({
      features: []
    });

    const apUm = new VectorLayer({
      source: markerSourceApUm
    });
    const apDois = new VectorLayer({
      source: markerSourceApDois
    });
    const apTres = new VectorLayer({
      source: markerSourceApTres
    });

    const fromProjection = proj4.defs('EPSG:4326'); // WGS84 (Latitude e Longitude)
    const toProjection = proj4.defs('EPSG:3857'); // Web Mercator
    
    const cordenadasApUno = [-48.31188102148288,-10.188796938911105];
    const cordenadasAp2 = [-48.31190910085108,-10.188805285294608];
    const cordenadasAp3 = [-48.311892470526736,-10.188767333791656];
    const cordenadaDOMarcador = [-48.3119493339827,-10.18875248706955];
    
    const cordenadasApUm = proj4(fromProjection, toProjection, cordenadasApUno );
    const cordenadasApDois = proj4(fromProjection, toProjection, cordenadasAp2 );
    const cordenadasApTres = proj4(fromProjection, toProjection, cordenadasAp3 );
    const cordenadainicialMarcador = proj4(fromProjection, toProjection, cordenadaDOMarcador);

    const feature = new Feature({
      geometry: new Point(cordenadainicialMarcador),
      name: "DispositivoMovel"
    });

    const markerSource = new VectorSource({
      features: []
    });
    markerSource.addFeature(feature);

    const featureApUm = new Feature({
      geometry: new Point(cordenadasApUm),
      name: "AP-1",
    });
    const featureApDois = new Feature({
      geometry: new Point(cordenadasApDois),
      name: "AP2"
    });
    const featureApTres = new Feature({
      geometry: new Point(cordenadasApTres),
      name: "AP3"
    });

    markerSourceApUm.addFeature(featureApUm);
    markerSourceApDois.addFeature(featureApDois);
    markerSourceApTres.addFeature(featureApTres);

    // cria uma nova camada vetor para o marcador
    const markerLayer = new VectorLayer({
      source: markerSource
    });
    newMap.addLayer(markerLayer);

    newMap.addLayer(apUm);
    newMap.addLayer(apDois);
    newMap.addLayer(apTres);

    setMarker(markerSource);

    let cordenadas;
    let id;
    // define a função de atualização de posição do marcador
    const updateMarkerPosition = () => {
      axios
        .get("http://localhost:3000/geoData")
        .then(({ data }) => {

            cordenadas = data.features[0].geometry.coordinates;
            const coordinates = proj4(fromProjection, toProjection, cordenadas );
            console.log(coordinates);

            const name = 'Point 1';

            const feature = new Feature({
                geometry: new Point(coordinates),
                name: name
              });
            id++;
            feature.setId(id);
            
            console.log(feature);
            // adiciona a feature à fonte de dados do marcador
            markerSource.clear();
            //markerSource.getFeatures[0].setGeometry(new Point(coordinates));
            //markerSource.getFeatureById(0).setGeometry(new Point(coordinates));
            markerSource.addFeature(feature);
            console.log(feature);
            // move o mapa para a nova posição do marcador
            const [x, y] = feature.getGeometry().getCoordinates();
            newMap.getView().setCenter([x, y]);
        })
        .catch(error => {
          console.error(error);
        });
    };

    // atualiza a posição do marcador a cada segundo
    const intervalId = setInterval(updateMarkerPosition, 1000);

    // limpa o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, []);

  return <div id="map" style={{ width: "100%", height: "100vh" }}></div>;
}

export default TesteDois;
