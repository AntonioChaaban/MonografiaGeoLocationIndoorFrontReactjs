import React, { useEffect, useState } from 'react';
import Feature from 'ol/Feature.js';
import Map from 'ol/Map.js';
import Point from 'ol/geom/Point.js';
import Polyline from 'ol/format/Polyline.js';
import VectorSource from 'ol/source/Vector.js';
import axios from "axios";
import View from 'ol/View.js';
import proj4 from 'proj4';
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

    // ambientes 
    //const polylineQuarto1 = [[-48.311853553377034,-10.188820238354564],[-48.31185621104716,-10.188806838582943], [-48.311866965648704,-10.188803034590341]];
    const polyQuarto1 = [[-5378050.936841136,-1140239.8477179788],[-5378051.2326916205,-1140238.3321621572],[-5378052.429888388,-1140237.9019187817]];

    //const polylineQuarto2 = [[-48.311891750320996,-10.188802218734788],[-48.31189845584573,-10.188806838578994],[-48.31189778529648,-10.188820698114359]];
    //const polylineCorredor = [[-48.31188102148288,-10.188797598890739],[-48.31188171779696,-10.188774655545258]];
    const polyCorredor = [[-5378053.994576692,-1140237.287124286],[-5378054.0720900195,-1140234.6921608197]];

    //const polylineSala =[[-48.311895103078,-10.188773839685714],[-48.31191390307445,-10.18877139999899],[-48.311940725162195,-10.188777999777214],[-48.31194273681877,-10.188793179266597]];
    const polySala = [[-5378055.56213269,-1140234.5998845808],[-5378057.654938721,-1140234.3239484641],[-5378060.640759871,-1140235.0704038048],[-5378060.864696457,-1140236.7872510862]];
    
    
    //const polylineCozinha = [[-48.31192463190955,-10.188760840353561],[-48.31194206626658,-10.188760180375704],[-48.3119306668793,-10.188745660862638]];
    const polyCozinha = [[-5378058.849267181,-1140233.129619921],[-5378060.7900509285,-1140233.0549743862],[-5378059.521076941,-1140231.4127726392]];

    // transação de ambientes
    //const polylineCorredorQuarto1 = [[-48.311866965648704,-10.188803034590341],[-48.31188102148288,-10.188797598890739]];
    const polyCorredorQuarto1 = [[-5378052.429888388,-1140237.9019187817],[-5378053.994576692,-1140237.287124286]];

    //const polylineCorredorQuarto2 = [[-48.311891750320996,-10.188802218734788],[-48.31188102148288,-10.188797598890739]];
    //const polylineQuarto1CorredorQuarto2 = [[-48.311866965648704,-10.188803034590341],[-48.31188102148288,-10.188797598890739],[-48.311891750320996,-10.188802218734788]];
    //const polylineQuarto2CorredorQuarto1 = [[-48.311891750320996,-10.188802218734788],[-48.31188102148288,-10.188797598890739],[-48.311866965648704,-10.188803034590341]];
    //const polylineCorredorSala = [[-48.31188171779696,-10.188774655545258],[-48.311895103078,-10.188773839685714]];
    const polyCorredorSala = [[-5378054.0720900195,-1140234.6921608197],[-5378055.56213269,-1140234.5998845808]];

    //const polylineSalaCorredor = [[-48.311895103078,-10.188773839685714],[-48.31188171779696,-10.188774655545258]];
    //const polylineSalaCozinha = [[-48.31191390307445,-10.18877139999899],[-48.31192463190955,-10.188760840353561]];
    const polySalaCozinha = [[-5378055.56213269,-1140234.5998845808],[-5378057.654938721,-1140234.3239484641],[-5378058.849267181,-1140233.129619921]];
    //const polylineCozinhaSala = [[-48.31192463190955,-10.188760840353561],[-48.31191390307445,-10.18877139999899]];
    //-5378057.654938721,-1140234.3239484641
    const fromProjection = proj4.defs('EPSG:4326'); // WGS84 (Latitude e Longitude)
    const toProjection = proj4.defs('EPSG:3857'); // Web Mercator

    //const route2 = new LineString(polylineSala).transform('EPSG:4326', 'EPSG:3857');
    let route3 = new LineString(polyQuarto1);

    let cordenadasInicias = proj4(fromProjection, toProjection, polyQuarto1[0] );
    let cordenadasFinal = proj4(fromProjection, toProjection, polyQuarto1[2] );
    let routeCoords = [];
    for (let index = 0; index < polyQuarto1.length; index++) {
      const cordenadass = proj4(fromProjection, toProjection, polyQuarto1[index] );
      routeCoords.push(cordenadass);
    }

    function inicializaçãoDoPonto(cordenadasAtuaisRecebidas){
      //Definir um padrao de inicialização para o ponto do marcador
      route3 = new LineString(caminhos);

      cordenadasInicias =  caminhos[0] 
      cordenadasFinal = caminhos[caminhos.length - 1];
      routeCoords = [];
      for (let index = 0; index < polyQuarto1.length; index++) {
        const cordenadass =  caminhos[index];
        routeCoords.push(cordenadass);
      }
    }
    
    const routeFeature = new Feature({
      type: 'route',
      geometry: route3,
    });
    const startMarker = new Feature({
      type: 'icon',
      geometry: new Point(cordenadasInicias),
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

    const cordenadasApUno = [-48.311850200616064,-10.188823538243186];
    const cordenadasAp2 = [-48.31191256197007,-10.18882287826547];
    const cordenadasAp3 = [-48.3119501128929,-10.188795819177706];
    const cordenadasAp4 = [-48.3119493339827,-10.18875248706955];
    const cordenadasAp5 = [-48.311891104299875,-10.188767440131986];

    const cordenadasApUm = proj4(fromProjection, toProjection, cordenadasApUno );
    const cordenadasApDois = proj4(fromProjection, toProjection, cordenadasAp2 );
    const cordenadasApTres = proj4(fromProjection, toProjection, cordenadasAp3 );
    const cordenadasApQuatro = proj4(fromProjection, toProjection, cordenadasAp4 );
    const cordenadasApCinco = proj4(fromProjection, toProjection, cordenadasAp5 );

    const featureApUm = new Feature({
      type: 'boardMarker',
      geometry: new Point(cordenadasApUm)
    });
    const featureApDois = new Feature({
      type: 'boardMarker',
      geometry: new Point(cordenadasApDois)
    });
    const featureApTres = new Feature({
      type: 'boardMarker',
      geometry: new Point(cordenadasApTres)
    });
    const featureApQuatro = new Feature({
      type: 'boardMarker',
      geometry: new Point(cordenadasApQuatro)
    });
    const featureApCinco = new Feature({
      type: 'boardMarker',
      geometry: new Point(cordenadasApCinco)
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
    
    function endLine(distance){

      const cordenadaFinalQuarto1 = JSON.stringify(polyQuarto1[polyQuarto1.length - 1]);
      const cordenadaInicioDoCorredor = JSON.stringify(polyCorredorQuarto1[0]);
      const cordenadaFinalDoCorredor = JSON.stringify(polyCorredor[polyCorredor.length - 1]);
      const cordenadaFinalSalaCorredor = JSON.stringify(polyCorredorSala[polyCorredorSala.length - 1]);
      const cordenadaFinalSalaCozinha = JSON.stringify(polySalaCozinha[polySalaCozinha.length - 1]);
      //const segundaCordenadaSala = JSON.stringify(polyCorredorSala[1]);

      
      let ultimaCordenadaNoTrajeto = JSON.stringify(route3.getLastCoordinate());
      //let segundaCordenadaNoTrajeto = JSON.stringify(route3.getCoordinates()[1]);
      let primeiraCordenadaNoTrajeto = JSON.stringify(route3.getFirstCoordinate());


      if(distance >= 1){
        //console.log(ultimaCordenadaNoTrajeto);

       if(ultimaCordenadaNoTrajeto === cordenadaFinalQuarto1){
        route3 = new LineString(polyCorredorQuarto1);
        console.log(ultimaCordenadaNoTrajeto);
        distance = 0;
        routeFeature.setGeometry(route3);
        return distance;
       }
       if(primeiraCordenadaNoTrajeto === cordenadaInicioDoCorredor){
        console.log("sjkdcaskjncsaçjkdcnkjçsanscakjdcnsakj");
        route3 = new LineString(polyCorredor);
        distance = 0;
        routeFeature.setGeometry(route3);
        return distance;
       }
       if(ultimaCordenadaNoTrajeto === cordenadaFinalDoCorredor){
        console.log("sjkdcaskjncsaçjkdcnkjçsanscakjdcnsakj");
        route3 = new LineString(polyCorredorSala);
        distance = 0;
        routeFeature.setGeometry(route3);
        return distance;
       }
       if(ultimaCordenadaNoTrajeto === cordenadaFinalSalaCorredor){
        console.log("sjkdcaskjncsaçjkdcnkjçsanscakjdcnsakj");
        route3 = new LineString(polySalaCozinha);
        distance = 0;
        routeFeature.setGeometry(route3);
        return distance;
       }
       if(ultimaCordenadaNoTrajeto === cordenadaFinalSalaCozinha){
        console.log("sjkdcaskjncsaçjkdcnkjçsanscakjdcnsakj");
        route3 = new LineString(polyCozinha);
        distance = 0;
        routeFeature.setGeometry(route3);
        return distance;
       }
      }
      return distance;
    }

    function moveFeature(event) {
    
      const speed = Number(speedInput);
      const time = event.frameState.time;
      const elapsedTime = time - lastTime;
      distance = (distance + (speed * elapsedTime) / 1000000) % 2;
      lastTime = time;

      let currentCoordinate = route3.getCoordinateAt(
        distance > 1 ? 2 - distance : distance
      );
      distance = endLine(distance);

      if(distance >= 1.01){
        geoMarker.setGeometry(position);
        vectorLayer.un('postrender', moveFeature);
      }

      position.setCoordinates(currentCoordinate);
      const vectorContext = getVectorContext(event);
      vectorContext.setStyle(styles.geoMarker);
      vectorContext.drawGeometry(position);
      // tell OpenLayers to continue the postrender animation
      newMap.render();
    }

    
    let posicaoAtual = [];
    let caminhos = [];

    const updateMarkerPosition = () => {
      //Mover o piao pra onde eu quero q ele mova
      vectorLayer.on('postrender', moveFeature);
      lastTime = Date.now();
      geoMarker.setGeometry(null);


      axios
        .get("http://localhost:3000/geoData")
        .then(({ data }) => {
          posicaoAtual.push(data);
          const posicao = posicaoAtual.length;

          if(posicao === 1){
            // O array so tem uma posição então é a primeira posição no programa então seta ela em uma cordenada
            const coordinates = proj4(fromProjection, toProjection, posicaoAtual[0].cordenadas );
            position.setCoordinates(coordinates);
          }

          if(posicao > 1){

            if(posicaoAtual[posicao - 1].nome === posicaoAtual[posicao - 2].nome){
              // Se o objeto atual foi no mesmo ambiente que o do anterior
              
              if(posicaoAtual[posicao - 1].cordenadas !== posicaoAtual[posicao - 2].cordenadas){
                // Verifica se ele mudou de posição no mesmo ambiente
                const coordinatesLugarAtual =  posicaoAtual[posicao - 1].cordenadas;
                const coordinatesLugarAnterior =  posicaoAtual[posicao - 2].cordenadas;

                caminhos = posicaoAtual[posicao - 1].caminhoDoAmbiente;
                inicializaçãoDoPonto(caminhos);
                vectorLayer.on('postrender', moveFeature);
                lastTime = Date.now();
                geoMarker.setGeometry(null);
              }
            }else{
              // Se o objeto atual não foi no mesmo ambiente que o do anterior
              
              if(posicaoAtual[posicao - 2].nome === "Quarto1" || posicaoAtual[posicao - 2].nome === "Quarto2" || posicaoAtual[posicao - 2].nome === "Cozinha" ){
                // faz a animação de movimento até a primeira posição da poliline se for o quarto1,quarto2 ou cozinha
  
                if(posicaoAtual[posicao - 2].nome === "Quarto1" || posicaoAtual[posicao - 2].nome === "Quarto2"){
                  // Faz a animação até o ponto do centro do corredor
  
                  if(posicaoAtual[posicao - 1].nome === "Corredor"){
                    // Verifica se é no corredor o ponto da localização atual
  
                    // Verifica se a posição é igual a do cento, se n for faz o deslocamente até a segunda posição do corredor
                  }
                  if(posicaoAtual[posicao - 1].nome === "Quarto1"){
                    // Verifica se é no Quarto1 o ponto da localização atual
  
                    // Faz o deslocamento do centro até a primeira posição do quarto1, então faz o deslocamento até a posição atual do quarto 1
                  }
                  if(posicaoAtual[posicao - 1].nome === "Quarto2"){
                    // Verifica se é no Quarto2 o ponto da localização atual
  
                    // Faz o deslocamento do centro até a primeira posição do quarto2, então faz o deslocamento até a posição atual do quarto 2
                  }
                  if(posicaoAtual[posicao - 1].nome === "Sala"){
                    // Verifica se é na Sala o ponto da localização atual
  
                    // Faz o deslocamente do centro até o ponto final do centro
                    // Faz o deslocamento do centro para o ponto inicial da sala
                    // Verifica se é no ponto inicial da Sala a posição atual. 
                    // Se não for Faz o deslocamento do ponto inicial da Sala até o ponto real na Sala
                  }
  
                }else{
                  // Faz a animação da cozinha até o centro da sala
  
                  if(posicaoAtual[posicao - 1].nome === "Corredor"){
                    // Verifica se é no corredor o ponto da localização atual
  
                    // Faz o deslocamento do ponto do centro da sala até o inicial da Sala
                    // Faz o deslocamento do ponto inicial da Sala até o final do Corredor
                    // Verifica se é no ponto final do corredor a localização atual 
                    // se não for faz o deslocamento do ponto final do Corredor até o ponto inicial do Corredor
                  }
                  if(posicaoAtual[posicao - 1].nome === "Sala"){
                    // Verifica se é na Sala o ponto da localização atual
  
                    // Faz o deslocamento do ponto do centro da sala até o ponto real da Sala
                  }
                }
              }
                
              if(posicaoAtual[posicao - 2].nome === "Corredor"){
                // Se a posição anterior foi no Corredor
  
                if(posicaoAtual[posicao - 1].nome === "Quarto1"){
                  // Verifica se é no Quarto1 o ponto da localização atual
  
                  // Faz o deslocamento até o ponto inicial do Corredor e depois até a primeira posição do quarto1, então faz o deslocamento até a posição atual do quarto 1
                }
                if(posicaoAtual[posicao - 1].nome === "Quarto2"){
                  // Verifica se é no Quarto2 o ponto da localização atual
  
                  // Faz o deslocamento até o ponto inicial do Corredor e depois até a primeira posição do quarto2, então faz o deslocamento até a posição atual do quarto 2
                }
                if(posicaoAtual[posicao - 1].nome === "Sala"){
                  // Verifica se é na Sala o ponto da localização atual
  
                  // Faz o deslocamento até o ponto final do Corredor
                  // Faz o deslocamento do ponto final do Corredor até o ponto inicial da Sala
                  // Verifica se é no ponto inicial da Sala a posição atual
                  // se não for faz o deslocamento até a posição atual na Sala
      
                }
                if(posicaoAtual[posicao - 1].nome === "Cozinha"){
                  // Verifica se é na Sala o ponto da localização atual
  
                  // Faz o deslocamento até o ponto final do Corredor
                  // Faz o deslocamento do ponto final do Corredor até o ponto inicial da Sala
                  // Faz o deslocamento até o centro da Sala 
                  // faz o deslocamento do centro da Sala até o ponto inicial da Cozinha
                  // Verifica se é no ponto inicial da Cozinha
                  // Se não for faz o deslocamento até o ponto real da Cozinha
                }
              }
  
              if(posicaoAtual[posicao - 2].nome === "Sala"){
                // Se a posição anterior foi na Sala
  
                if(posicaoAtual[posicao - 1].nome === "Corredor"){
                  // Verifica se é no corredor o ponto da localização atual
  
                  // Faz o deslocamento até o ponto inicial da Sala
                  // Faz o deslocamento do ponto inicial da Sala até o ponto final do Corredor
                  // Verifica se é no ponto final do Corredor
                  // Se não Faz o deslocamento até o ponto real no corredor
                }
                if(posicaoAtual[posicao - 1].nome === "Cozinha"){
                  // Verifica se é na Sala o ponto da localização atual
  
                  // Faz o deslocamento ate o ponto do centro da Sala 
                  // Faz o deslocamento do Ponto do centro da Sala ate o inicial da Cozinha
                  // Verifica se é no ponto inicial da Cozinha
                  // Se não Faz o deslocamento ate o ponto real da Cozinha
                }
                if(posicaoAtual[posicao - 1].nome === "Quarto1"){
                  // Verifica se é no Quarto1 o ponto da localização atual
  
                  // Faz o deslocamento até o ponto inicial da Sala
                  // Faz o deslocamento do ponto inicial da Sala até o ponto final do Corredor
                  // Faz o deslocamento do ponto final do Corredor até o ponto inicial do Corredor
                  // Faz o deslocamento do ponto inicial do Corredor até o ponto inicial do Quarto1
                  // Verifica se é no ponto inicial do Quarto 1 a posição atual
                  // Se não Faz o deslocamento até o ponto real no Quarto 1
                }
                if(posicaoAtual[posicao - 1].nome === "Quarto2"){
                  // Verifica se é no Quarto2 o ponto da localização atual
  
                  // Faz o deslocamento até o ponto inicial da Sala
                  // Faz o deslocamento do ponto inicial da Sala até o ponto final do Corredor
                  // Faz o deslocamento do ponto final do Corredor até o ponto inicial do Corredor
                  // Faz o deslocamento do ponto inicial do Corredor até o ponto inicial do Quarto2
                  // Verifica se é no ponto inicial do Quarto 2 a posição atual
                  // Se não Faz o deslocamento até o ponto real no Quarto 2
                }
              }
            }
          }
        })
        .catch(error => {
          console.error(error);
        });
    }

    // A chamada desse metodo que faz a animação toda acontecer
    updateMarkerPosition();

  }, []);

  
  return <div id="map" style={{ width: "100%", height: "100vh" }}></div>;
}

export default MapWithAnimatedPoint;
