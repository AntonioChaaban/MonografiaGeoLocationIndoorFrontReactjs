import React, { useEffect, useState } from 'react';
import Feature from 'ol/Feature.js';
import Map from 'ol/Map.js';
import Point from 'ol/geom/Point.js';
import VectorSource from 'ol/source/Vector.js';
import axios from "axios";
import View from 'ol/View.js';
import {
  Circle as CircleStyle,
  Fill,
  Icon,
  Stroke,
  Style,
} from 'ol/style.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import LineString from 'ol/geom/LineString.js';
import OSM from "ol/source/OSM";
import ImageLayer from 'ol/layer/Image';
import ImageStatic from 'ol/source/ImageStatic';
import {getVectorContext} from 'ol/render.js';

function MapWithAnimatedPoint({ lat, lon }) {
  const [map, setMap] = useState(null);

  useEffect(() => {
    const center = [-5378054.0720900195, -1140234.6921608197];
    const centerPoint = [center,center];
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

    const cordenadasApUno = [-5378050.563613492,-1140240.220945649];
    const cordenadasAp2 = [-5378057.505647665,-1140240.1463001154];
    const cordenadasAp3 = [-5378061.685797273,-1140237.0858332205];
    const cordenadasAp4 = [-5378061.599089387,-1140232.184837703];
    const cordenadasAp5 = [-5378055.116990745,-1140233.8760752594];

    const featureApUm = new Feature({
      type: 'boardMarker',
      geometry: new Point(cordenadasApUno)
    });
    const featureApDois = new Feature({
      type: 'boardMarker',
      geometry: new Point(cordenadasAp2)
    });
    const featureApTres = new Feature({
      type: 'boardMarker',
      geometry: new Point(cordenadasAp3)
    });
    const featureApQuatro = new Feature({
      type: 'boardMarker',
      geometry: new Point(cordenadasAp4)
    });
    const featureApCinco = new Feature({
      type: 'boardMarker',
      geometry: new Point(cordenadasAp5)
    });

    let route3 = new LineString(centerPoint);
    let cordenadasIniciais =  centerPoint[0];
    let cordenadasFinal = centerPoint[1];

    //const route2 = new LineString(polylineSala).transform('EPSG:4326', 'EPSG:3857');      
    const routeFeature = new Feature({
      type: 'route',
      geometry: route3,
    });
    const startMarker = new Feature({
      type: 'icon',
      geometry: new Point(cordenadasIniciais),
    });
    const endMarker = new Feature({
      type: 'icon',
      geometry: new Point(cordenadasFinal),
    });
    const position = startMarker.getGeometry().clone();
    const geoMarker = new Feature({
      type: 'geoMarker',
      geometry: position,
    });
    //https://openlayers.org/en/v3.20.1/examples/data/icon.png
    const styles = {
      'route': new Style({
        stroke: new Stroke({
          width: 6,
          color: [160, 178, 223, 0.0],
        }),
      }),
      'icon': new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'data/icon.png',
        }),
      }),
      'geoMarker': new Style({
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({color: 'blue'}),
          stroke: new Stroke({
            color: 'white',
            width: 2,
          }),
        }),
      }),
      'boardMarker': new Style({
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({color: 'red'}),
          stroke: new Stroke({
            color: 'white',
            width: 2,
          }),
        }),
      })
    };

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [routeFeature,geoMarker, startMarker, 
          endMarker,featureApUm,featureApDois,featureApTres,
          featureApQuatro,featureApCinco],
      }),
      style: function (feature) {
        return styles[feature.get('type')];
      },
    });

    // Vou somente fazer a incersão do vectorLayer na aplicação apartir da primeira leitura
    newMap.addLayer(vectorLayer);
    
    const speedInput = 350;
    let distance = 0;
    let lastTime;

    function moveFeature(event) {
    
      const speed = Number(speedInput);
      const time = event.frameState.time;
      const elapsedTime = time - lastTime;
      distance = (distance + (speed * elapsedTime) / 1000000) % 2;
      lastTime = time;

      let currentCoordinate = route3.getCoordinateAt(
        distance > 1 ? 2 - distance : distance
      );
      //distance = endLine(distance);

      if(distance >= 1.01){
        geoMarker.setGeometry(position);
        vectorLayer.un('postrender', moveFeature);
        distance = 0;
      }
      
      position.setCoordinates(currentCoordinate);
      const vectorContext = getVectorContext(event);
      vectorContext.setStyle(styles.geoMarker);
      vectorContext.drawGeometry(position);
      // tell OpenLayers to continue the postrender animation
      newMap.render();
    }
    let caminhos = [];

    const atualizarMarcador = () => {
      axios
        .get("http://localhost:3000/geoData")
        .then(({ data }) => {
          //verificar se o objeto está vindo inteiro
          if(data.cordenadas.length > 0){
            if(caminhos.length === 0){
              caminhos.push(data);
              position.setCoordinates(data.cordenadas[0]);
            }
            // se o data recebido for diferente adicionar
            if(!caminhos.some(objeto => objeto.bloco === data.bloco)){
              caminhos.push(data);
              if(data.deslocamento){

                cordenadasIniciais = data.lineString[0];
                cordenadasFinal = data.lineString[data.lineString.length - 1];

                route3 = new LineString(data.lineString);
                routeFeature.setGeometry(route3);

                startMarker.getGeometry().setCoordinates(cordenadasIniciais);
                endMarker.getGeometry().setCoordinates(cordenadasFinal);

                vectorLayer.on('postrender', moveFeature);
                lastTime = Date.now();
                geoMarker.setGeometry(null);

                caminhos.splice(0,1);
                console.log(caminhos);
              }
            }
          }
        })
        .catch(error => {
            console.error(error);
        });
    };
    // atualiza a posição do marcador a cada segundo
    const intervalId = setInterval(atualizarMarcador, 3000);

    // limpa o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);

  }, []);

  
  return <div id="map" style={{ width: "100%", height: "100vh" }}></div>;
}

export default MapWithAnimatedPoint;
