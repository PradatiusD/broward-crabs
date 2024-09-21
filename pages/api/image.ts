import type { NextApiRequest, NextApiResponse } from 'next'
import  { extractColors } from 'extract-colors'
import getPixels from "get-pixels";
import proj4 from 'proj4';
import {FinalColor} from "extract-colors/lib/types/Color";
import {callChatGPT} from "./utils";

const getImageAsync = async (url: string, type: string) => {
  return new Promise((resolve, reject) => {
    getPixels(url, type, (err, pixels) => {
      if (err) {
        reject(err)
      }
      resolve(pixels)
    })
  })
}


function createArgSisCoordinates (lat, lng) {
  const wgs84 = 'EPSG:4326'; // WGS84 Lat/Lng
  const webMercator = 'EPSG:3857'; // ArcGIS Web Mercator
  const arcGISCoords = proj4(wgs84, webMercator, [lng, lat]);
  console.log('ArcGIS Web Mercator Coordinates:', arcGISCoords);
  return arcGISCoords
}

type APIResponse = {
  userLocation: {
    lat: number,
    lng: number
  },
  latLngCoordinates: {
    northeast: number[],
    southwest: number[]
  },
  argSisCoordinates: {
    northeast: number[],
    southwest: number[]
  },
  url: string,
  data: FinalColor[],
  result: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<APIResponse>) {
  const userLocation = {
    lat: 25.761681,
    lng: -80.191788
  }

  const xSize = 0.01
  const ySize = 0.01
  const latLngCoordinates = {
    northeast: [userLocation.lat + xSize, userLocation.lng - ySize],
    southwest: [userLocation.lat - xSize, userLocation.lng + ySize]
  }
  const argSisCoordinates = {
    northeast: createArgSisCoordinates(latLngCoordinates.northeast[0], latLngCoordinates.northeast[1]),
    southwest: createArgSisCoordinates(latLngCoordinates.southwest[0], latLngCoordinates .southwest[1])
  }

  const url = 'https://gisweb.miamidade.gov/arcgis/rest/services/VulnerabilityViewer/MD_Groundwater/MapServer/export?dpi=96&transparent=true&format=png32&layers=show%3A0&bbox='+[argSisCoordinates.northeast[0],argSisCoordinates.northeast[1], argSisCoordinates.southwest[0], argSisCoordinates.southwest[1]]+'&bboxSR=102100&imageSR=102100&size=1368%2C843&f=image'
  const pixels = await getImageAsync(url, 'image/png')
  const colors = await extractColors(pixels as ImageData)

  const badColor = '#3e1aa8'
  const safeColor = '#afddf0'
  const result = await callChatGPT(`
  You are a flood advisory tool that helps drivers know if they are at risk of being underwater.  
  I am supplying you with hex colors of the image you are analyzing.
  If you are at risk of flooding, you will see the color ${badColor}.
  If you are safe, you will see the color ${safeColor}.
  Tell me how safe the user based off these hexes ` + colors.map(color => color.hex).join(' '));

  res.status(200).json({
    userLocation,
    latLngCoordinates: latLngCoordinates,
    argSisCoordinates: argSisCoordinates,
    url,
    data: colors,
    result: result
  })
}