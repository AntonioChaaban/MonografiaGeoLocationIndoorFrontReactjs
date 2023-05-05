import { useState, useEffect } from 'react';
import axios from 'axios';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

const TesteContent = () =>{
    const [items, setItems] = useState([]);
    const [map, setMap] = useState([]);

    useEffect(() => {
        setInterval(() => {
            axios
            .get("http://localhost:5000/geoData") // faz uma chamada GET à API
            .then(({ data }) => setItems(data.features[0].geometry.coordinates))
            .catch((error) => {
                console.log(error); // lidando com possíveis erros de chamada à API
            });



        }, 5000)
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

    },[]);

    return  (
        <div>{map}
        </div>
    )

};

export default TesteContent;