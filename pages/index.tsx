import MapComponent from "@/app/map";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "FloodFlow",
  description: "Real time alert for real time safety",
};

export async function getServerSideProps() {
  let trafficData = null;

  try {
    const res = await fetch('https://traffic.mdpd.com/api/traffic');
    if (res.ok) {
      trafficData = await res.json();
    } else {
      console.error('Error fetching traffic data:', res.statusText);
    }
  } catch (error) {
    console.error('Error fetching traffic data:', error);
  }

  return {
    props: {
      trafficData,
    },
  };
}

export default function Home({ trafficData }) {

  return(
    <>
      <div>
        <div className="container-fluid">
          <MapComponent/>
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.trafficData = ${JSON.stringify(trafficData)};`,
          }}
        />
      </div>
    </>
  )
}