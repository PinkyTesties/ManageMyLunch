import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MapWithControls = () => {
    const [startPoint, setStartPoint] = useState('');
    const [endPoint, setEndPoint] = useState('');
    const [map, setMap] = useState(null);

    useEffect(() => {
        loadGoogleMaps();
    }, []);

    const loadGoogleMaps = () => {
        const existingScript = document.querySelector('script[src*="googleapis"]');
        if (!existingScript) {
            const script = document.createElement('script');
            script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCitl6yX_uVB95MJzBdlACmT5sy5j0vcZc&callback=initMap';
            script.async = true;
            document.body.appendChild(script);

            script.onload = () => {
                if (window.initMap) initMap();
            };

            script.onerror = () => {
                console.error('Google Maps script failed to load.');
            };
        }
    };

    window.initMap = () => {
        const mapContainer = document.getElementById('map');
        if (mapContainer && !map) {
            const initialMap = new window.google.maps.Map(mapContainer, {
                zoom: 15,
                center: { lat: -36.8485, lng: 174.7633 } // Auckland CBD
            });
            setMap(initialMap);
        }
    };

    const planRoute = () => {
      // 检查并解析经纬度字符串为对象
      const parseCoordinates = (coord) => {
          if (coord.includes(',')) {
              const [lat, lng] = coord.split(',').map(Number);
              return { lat, lng };
          }
          return coord.trim();
      };
  
      const origin = parseCoordinates(startPoint);
      const destination = parseCoordinates(endPoint);
  
      console.log('Planning route from:', origin, 'to', destination); // Debugging line
  
      axios.post('http://localhost:8082/api/route', { origin, destination })
      .then(response => {
          console.log('Received route data:', response.data); // Debugging line
  
          const directionsService = new window.google.maps.DirectionsService();
          directionsService.route({
              origin, // 使用解析后的 origin
              destination, // 使用解析后的 destination
              travelMode: 'DRIVING'
          }, (result, status) => {
              if (status === 'OK') {
                  const directionsDisplay = new window.google.maps.DirectionsRenderer();
                  directionsDisplay.setMap(map);
                  directionsDisplay.setDirections(result);
              } else {
                  console.error('Directions request failed due to ' + status);
              }
          });
      })
      .catch(error => {
          console.error('Error planning route:', error);
CBD      });
  };

    const locateCurrentPosition = () => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setStartPoint(`${latitude}, ${longitude}`);
            console.log('Current location:', `${latitude}, ${longitude}`); // Debugging line
        }, error => {
            console.error("Error Accessing Location: ", error);
        });
    };

    return (
      <div>
          <div id="controls" style={{ padding: '20px', backgroundColor: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.3)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px' }}>
              <label style={{fontSize:'25px'}}>Currennt Location</label>
              <input type="text" value={startPoint} onChange={e => setStartPoint(e.target.value)} placeholder="Enter your start location" style={{ width: '90%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc' }} />
              <label style={{fontSize:'25px'}}>Destination</label>
              <input type="text" value={endPoint} onChange={e => setEndPoint(e.target.value)} placeholder="Enter your destination" style={{ width: '90%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc' }} />
              <button onClick={planRoute} style={{ width: '90%', padding: '10px', backgroundColor: '#1a73e8', color: 'white', border: 'none', borderRadius: '5px', margin: '5px 0', cursor: 'pointer' }}>Plan Route</button>
              <button onClick={locateCurrentPosition} style={{ width: '90%', padding: '10px', backgroundColor: '#34a853', color: 'white', border: 'none', borderRadius: '5px', margin: '5px 0', cursor: 'pointer' }}>Locate Me</button>
          </div>
          <div id="map-container" style={{ width: '80%', height: '500px', margin: '20px auto' }}>
              <div id="map" style={{ width: '100%', height: '100%' }}></div>
          </div>
      </div>
  );
};


export default MapWithControls;



