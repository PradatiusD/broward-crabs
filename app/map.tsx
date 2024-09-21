'use client'
import React from 'react'
import { GoogleMap, useJsApiLoader, Marker, TrafficLayer, GroundOverlay } from '@react-google-maps/api';

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
  const boundEast = -79.79
  const heightDiff = 1.1
  const bounds2 = {
    north: 26.0,   // Northern latitude (near Omni area)
    south: 25.5,   // Southern latitude (near Brickell area)
    east: boundEast,   // Eastern longitude (near Biscayne Bay)
    west: boundEast - heightDiff,   // Western longitude (near I-95)
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <GroundOverlay
        url={'https://imageserverintra.miamidade.gov/arcgis/rest/services/DEMs/2021_5ft_DEM/ImageServer/exportImage?f=image&bandIds=&renderingRule=%7B%22rasterFunction%22%3A%22Stretched_5ftDEMRender_BlueToBrown_2021%22%7D&bbox=-8996916.243885973%2C2926329.1924757934%2C-8886006.115844334%2C2992523.6589706666&imageSR=102100&bboxSR=102100&size=1451%2C866'}
        bounds={bounds2}
        opacity={0.5}
      />
      <TrafficLayer />
      {
        trafficData.map((trafficDataItem, index) => {
          return (
            <Marker key={index} label={trafficDataItem.Signal} position={{lat: trafficDataItem.Latitude, lng: trafficDataItem.Longitude}}/>
          )
        })
      }
    </GoogleMap>
  )
}

export default MapComponent