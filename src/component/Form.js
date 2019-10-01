import React, { Component } from 'react';
import './Form.css'

class Form extends Component {
    render() {
        return (
            <div className="container">
                <h1 className="header">Hello</h1>
                <p className="paragraph">Lets Get Started</p>
                <form className="formEl">
                    <input className="inputFields name" type="text" name="name" placeholder="Full Name"/>
                    <input className="inputFields address" type="text" name="address" placeholder="Address"/>
                    <input className="inputFields side" type="text" name="zip" placeholder="Zip Code"/>
                    <input className="inputFields side" type="text" name="state" placeholder="State"/>
                    <input className="inputFields phone" type="tel" name="phone1" placeholder="Cell Phone"/>
                    <input className="inputFields email" type="email" name="email" placeholder="Email Address" />
                    <input className="inputFields" type="text" name="sqft" placeholder="Square Feet of Home"/>
                    <div className="btnContainer">
                        <p className="next">Next</p>
                        <button className="submitBtn" type="submit"><img alt="Arrow Button" src='https://denisealley.s3-us-west-2.amazonaws.com/Digital__Design_99-512.png'/></button>
                    </div>
                </form>
            </div>
        )
    }
}





export default Form;
