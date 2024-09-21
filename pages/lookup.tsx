import React, {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import background from "./background.svg";

const carInfo =[
    {
        "make": "Toyota",
        "models": ["Camry", "Corolla", "Prius", "RAV4", "Highlander"]
    },
    {
        "make": "Honda",
        "models": ["Civic", "Accord", "CR-V", "Pilot", "Fit"]
    },
    {
        "make": "Ford",
        "models": ["F-150", "Mustang", "Escape", "Explorer", "Fusion"]
    },
    {
        "make": "Chevrolet",
        "models": ["Silverado", "Malibu", "Equinox", "Tahoe", "Camaro"]
    },
    {
        "make": "BMW",
        "models": ["3 Series", "5 Series", "X5", "X3", "M4"]
    },
    {
        "make": "Mercedes-Benz",
        "models": ["C-Class", "E-Class", "GLC", "GLE", "S-Class"]
    },
    {
        "make": "Tesla",
        "models": ["Model S", "Model 3", "Model X", "Model Y", "Cybertruck"]
    },
    {
        "make": "Audi",
        "models": ["A4", "A6", "Q5", "Q7", "e-tron"]
    },
    {
        "make": "Nissan",
        "models": ["Altima", "Sentra", "Maxima", "Rogue", "Murano"]
    },
    {
        "make": "Hyundai",
        "models": ["Elantra", "Sonata", "Tucson", "Santa Fe", "Palisade"]
    }
];
export default function LandingPage () {
   const [make,setMake] = useState("")
    const brandModels = carInfo.find(function (carData) {
        return carData.make === make
    })
    return (
        <>
            <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 102px)' }}>
                <div className="mb-4 lookup-background">
                    <Image src={background}  alt="instagram logo"/>
                </div>
                <form>
                <h5 className="header-label">Where are you headed?</h5>
                    <div className="form-group zip-code pt-4">
                        <input type="text" className="form-control" id="Zipcode" aria-describedby="ZipcodeHelp"
                               placeholder="Enter Zipcode"/>
                    </div>
                    <div className="form-group pt-4">
                        <select className="form-select" aria-label="Default select example" onChange={(e)=>{
                            setMake(e.target.value)
                        }}>
                            <option>Car Make</option>
                            {carInfo.map((brand) =>{
                                return (
                                    <option key={make} value={brand.make}>{brand.make}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="car-model pt-4 pb-4">
                        <select className="form-select" aria-label="Default select example">
                            <option>Car Model</option>
                            {brandModels && brandModels.models.map((modelName) =>{
                                return(
                                    <option key={modelName} value={modelName}>{modelName}</option>
                                )
                            })}
                        </select>
                    </div>
                    <Link href="/results">
                        <button type="button" className="btn btn-primary btn-md rounded-lg">Search</button>
                    </Link>
                </form>
            </div>
    </>
    );
}