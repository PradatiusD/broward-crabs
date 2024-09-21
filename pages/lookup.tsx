import React from "react";

export default function LandingPage () {
    return (
        <>
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <form>
                    <div className="form-group zip-code pt-4">
                        <input type="text" className="form-control" id="Zipcode" aria-describedby="ZipcodeHelp"
                               placeholder="Enter Zipcode"/>
                    </div>
                    <div className="form-group pt-4">
                        <select className="form-control">
                            <option>Car Make</option>
                        </select>
                    </div>
                    <div className="car-model pt-4">
                        <select className="form-control">
                            <option>Car Model</option>
                        </select>
                    </div>
                </form>
            </div>
    </>
    );
}