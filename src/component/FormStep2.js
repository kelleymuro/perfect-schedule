import React, { Component } from 'react';
import './FormStep2.css'
import Date from './DatePicker';

class FormStep2 extends Component {
    render() {
        return (
            <div className="container">
                <h3 className="initial">Initial Service Price &#36;149</h3>
                <h3>Choose Plan</h3>
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
                <h3 className="title">Availability Oct 12th</h3>
                <p className="title">When schedling an appoint there is always 2 hour arrival time window</p>

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
                    <textarea placeholder="Please provide any specific service requests..." className="appointmentTextArea"/>
                </div>

                <div className="paymentsContainer">
                    <h3 className="paymentTitle">Reserve your appointment with a card</h3>
    
                </div>

               
            </div>
        )
    }
}

export default FormStep2