import React from "react";

export default function LandingPage () {
    return (
        <>
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 102px)' }}>
                <form>
                <h5 className="header-label">Where are you headed?</h5>
                    <div className="form-group zip-code pt-4">
                        <input type="text" className="form-control" id="Zipcode" aria-describedby="ZipcodeHelp"
                               placeholder="Enter Zipcode"/>
                    </div>
                    <div className="form-group pt-4">
                        <select className="form-select" aria-label="Default select example">
                            <option>Car Make</option>
                        </select>
                    </div>
                    <div className="car-model pt-4 pb-4">
                        <select className="form-select" aria-label="Default select example">
                            <option>Car Model</option>
                        </select>
                    </div>
                    <button type="button" className="btn btn-primary btn-md rounded-lg">Large button</button>
                </form>
            </div>
    </>
    );
}