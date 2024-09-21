import MapComponent from "@/app/map";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "FloodFlow",
  description: "Real time alert for real time safety",
};

export default function Home() {
  return(
    <>
      <div>
        <div className="container-fluid">
          <MapComponent/>
        </div>
      </div>
    </>
  )
}