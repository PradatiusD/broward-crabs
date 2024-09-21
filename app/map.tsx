'use client'
import React from 'react'
import {GoogleMap, GroundOverlay, Marker, TrafficLayer, useJsApiLoader} from '@react-google-maps/api';
import Switch from "react-switch";

const containerStyle = {
  width: '100%',
  height: '600px'
};

const center = {
  lat: 25.7617,
  lng: -80.1918
};

type TrafficData = {
  CreateTime: string,
  Signal: string,
  Address: string,
  Location: string,
  Grid: string,
  MapX: null,
  MapY: null,
  Longitude: number,
  Latitude: number
}

declare global {
  interface Window {
    trafficData: TrafficData[];
  }
}

// Function to convert from WGS84 (lat/lng) to Web Mercator (EPSG:102100)
function latLngToWebMercator(lat: number, lng: number): { x: number, y: number } {
  const R_MAJOR = 6378137.0;

  const x = (lng * R_MAJOR * Math.PI) / 180.0;
  const y = Math.log(Math.tan((Math.PI / 4) + (lat * Math.PI / 360.0))) * R_MAJOR;

  return { x, y };
}

// Function to update the URL with new bounding box coordinates
function interpolateBoundingBoxInUrl(url: string, mercatorBbox: { xMin: number, yMin: number, xMax: number, yMax: number }): string {
  // Interpolating the bbox into the URL
  const bboxString = `${mercatorBbox.xMin},${mercatorBbox.yMin},${mercatorBbox.xMax},${mercatorBbox.yMax}`;

  // Replace the existing bbox parameter in the URL
  return url.replace(/bbox=[^&]+/, `bbox=${encodeURIComponent(bboxString)}`);
}

function MapComponent() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string
  })

  const [,setMap] = React.useState(null)
  const [trafficData, setTrafficData] = React.useState([] as TrafficData[])

  React.useEffect(() => {
    setTrafficData(window.trafficData as TrafficData[])
  }, [])

  const onLoad = React.useCallback(function callback(map) {
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback() {
    setMap(null)
  }, [])

  const [groundWaterOverlay, setGroundWaterOverlay] = React.useState(false)
  const [stormSurgeOverlay, setStormSurgeOverlay] = React.useState(false)
  const [accidentPins, setAccidentPins] = React.useState(false)
  const [traffic, setTraffic] = React.useState(false)

  if (!isLoaded) {
    return <></>
  }

  // https://imageserverintra.miamidade.gov/arcgis/rest/services/DEMs/2021_5ft_DEM/ImageServer/exportImage?f=image&bandIds=&renderingRule=%7B%22rasterFunction%22%3A%22Stretched_5ftDEMRender_BlueToBrown_2021%22%7D&bbox=-8996916.243885973%2C2926329.1924757934%2C-8886006.115844334%2C2992523.6589706666&imageSR=102100&bboxSR=102100&size=1451%2C866
  // const bounds = {
  //   north: 25.7877,   // Northern latitude (near Omni area)
  //   south: 25.7651,   // Southern latitude (near Brickell area)
  //   east: -80.1845,   // Eastern longitude (near Biscayne Bay)
  //   west: -80.2017,   // Western longitude (near I-95)
  // };

  // -8996916.243885973%2C2926329.1924757934%2C-8886006.115844334%2C2992523.6589706666


  // Approximate Latitude/Longitude Bounding Box for Miami-Dade County
  // Example Latitude/Longitude Bounding Box (WGS84)
  const latLngBbox = {
    south: 25.1374, // southwest latitude
    west: -80.8784, // southwest longitude
    north: 25.9565, // northeast latitude
    east: -80.1246  // northeast longitude
  };

// Convert the southwest and northeast points from Latitude/Longitude to Web Mercator
  const southwestMercator = latLngToWebMercator(latLngBbox.south, latLngBbox.west);
  const northeastMercator = latLngToWebMercator(latLngBbox.north, latLngBbox.east);

// Create the Web Mercator bounding box
  const mercatorBbox = {
    xMin: southwestMercator.x,
    yMin: southwestMercator.y,
    xMax: northeastMercator.x,
    yMax: northeastMercator.y
  };

  const xShift = 0.29
  const yShift = 0
  const latLngBoxShifted = {
    south: latLngBbox.south + yShift,
    west: latLngBbox.west + xShift - 0.4,
    north: latLngBbox.north + yShift,
    east: latLngBbox.east + xShift
  }

  console.log(mercatorBbox)

// The original URL with a bbox to replace
//   const originalUrl = "https://gisweb.miamidade.gov/arcgis/rest/services/VulnerabilityViewer/MD_Groundwater/MapServer/export?dpi=96&transparent=true&format=png32&layers=show%3A0&bbox=-9056422.470406085%2C2897053.810642499%2C-8847290.761017762%2C3025926.6403313554&bboxSR=102100&imageSR=102100&size=1368%2C843&f=image"

  return (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {
          groundWaterOverlay && (
            <GroundOverlay
              url={interpolateBoundingBoxInUrl("https://gisweb.miamidade.gov/arcgis/rest/services/VulnerabilityViewer/MD_Groundwater/MapServer/export?dpi=96&transparent=true&format=png32&layers=show%3A0&bbox=-9056422.470406085%2C2897053.810642499%2C-8847290.761017762%2C3025926.6403313554&bboxSR=102100&imageSR=102100&size=1368%2C843&f=image", mercatorBbox)}
              bounds={latLngBoxShifted}
              opacity={0.5}
            />
          )
        }

        {
          stormSurgeOverlay && (
            <GroundOverlay
              url={interpolateBoundingBoxInUrl('https://gisweb.miamidade.gov/arcgis/rest/services/VulnerabilityViewer/MD_StormSurge/MapServer/export?dpi=96&transparent=true&format=png32&layers=show%3A6&bbox=-8990763.063109012%2C2911080.005332882%2C-8886197.208415033%2C2975516.4201771985&bboxSR=102100&imageSR=102100&size=1368%2C843&f=image', mercatorBbox)}
              bounds={latLngBoxShifted}
              opacity={0.5}
            />
          )
        }

        {
          traffic && <TrafficLayer/>
        }

        {
          accidentPins && trafficData.map((trafficDataItem, index) => {
            return (
              <Marker key={index} label={trafficDataItem.Signal}
                      position={{lat: trafficDataItem.Latitude, lng: trafficDataItem.Longitude}}/>
            )
          })
        }

      </GoogleMap>
      <section className="map-controls">
        <div>
          <label>
            <span>Traffic</span>
            <Switch onChange={() => {
              setTraffic(!traffic)
            }} checked={traffic}/>
          </label>
        </div>
        <div>
          <label>
            <span>Accidents</span>
            <Switch onChange={() => {
              setAccidentPins(!accidentPins)
            }} checked={accidentPins}/>
          </label>
        </div>
        <div>
          <label>
            <span>Ground Water</span>
            <Switch onChange={() => {
              setGroundWaterOverlay(!groundWaterOverlay)
            }} checked={groundWaterOverlay}/>
          </label>
        </div>
        <div>
          <label>
            <span>Storm Surge</span>
            <Switch onChange={() => {
              setStormSurgeOverlay(!stormSurgeOverlay)
            }} checked={stormSurgeOverlay}/>
          </label>
        </div>
      </section>
    </>
  )
}


export default MapComponent