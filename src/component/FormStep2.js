import React, { Component } from 'react';
import './FormStep2.css'
import Date from './DatePicker';

class FormStep2 extends Component {
    render() {
        return (
            <div className="container">
                <h3 className="initial">Initial Service Price &#36;149</h3>
                <h3 className="plan">Choose Plan</h3>
                <div className="serviceTypeContainer">
                    <div className="serviceType selected">
                        <div className="textContainer">
                            <p className="serviceName">Bi-Monthly</p>
                            <p className="servicePrice">$99</p>
                        </div>
                       
                    </div>
                    <div className="serviceType">
                        <div className="textContainer">
                            <p className="serviceName">Quarterly</p>
                            <p className="servicePrice">$129</p>
                        </div>
                    </div>
                </div>
                
                <h3 className="title">Select Date/Time Window</h3>
                <Date/>
                <h3 className="title"><span className="light">Availability</span> Oct 12th</h3>
                <p className="light">When scheduling an appointment there is always a 2 hour arrival time window</p>

                <div className="appointmentContainer">
                    <h3 className="timeOfDay">Morning</h3>
                    <button className="appointmentBtn btnSelected">8:30am </button>
                    <button className="appointmentBtn ">10:30am</button>
                
                    <h3 className="timeOfDay">Afternoon</h3>
                    <button className="appointmentBtn ">1:00pm</button>
                    <button className="appointmentBtn ">2:30pm</button>
                    <button className="appointmentBtn ">4:30am</button>
                </div>

                <div className="appointmentNotesContainer">
                    <h3 className="timeOfDay">Appointment Notes (optional)</h3>
                    <textarea placeholder="Please provide any specific deta..." className="appointmentTextArea"/>
                </div>

                <div className="paymentsContainer">
                    <h3 className="paymentTitle">Reserve your appointment with a card</h3>
                    <input className="inputFields" type="number" placeholder="Enter your credit or debit card"/>
                    <input className="inputFields side" type="number" placeholder="Exp Date"/>
                    <input className="inputFields side" type="number" placeholder="CVV"/>
                </div>

               
            </div>
        )
    }
}

export default FormStep2