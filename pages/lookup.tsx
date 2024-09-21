import React from "react";

export default function Lookup () {
    return (
      <>
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <form className="p-4 border rounded bg-light" style={{ width: '300px' }}>
                    <div className="form-group">
                        <label htmlFor="Zipcode">ZipCode</label>
                        <input type="text" className="form-control" id="Zipcode" aria-describedby="ZipcodeHelp"
                               placeholder="Enter Zipcode"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="CarMake">Make</label>
                        <input type="text" className="form-control" id="CarMake" aria-describedby="CarMakeHelp"
                               placeholder="Enter Car Make"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="CarMode">Model</label>
                        <input type="text" className="form-control" id="CarMode" aria-describedby="CarModeHelp"
                               placeholder="Enter Car Model "/>
                    </div>
                </form>
            </div>
      </>
    );
}