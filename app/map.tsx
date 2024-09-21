'use client'
import React from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

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

  const [, setMap] = React.useState(null)
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

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
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