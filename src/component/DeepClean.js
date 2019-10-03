import React, { Component } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import Cleave from "cleave.js/react";
import CleavePhone from "cleave.js/dist/addons/cleave-phone.i18n";
import "./UserForm.css";

class UserForm extends Component {
    state = {
        baseUrl: "https://clean.pestroutes.com/api/",
        authenticationToken:
            "b8ca67ecbcb431e55092e81a1e9f65de8652680709b2da5c751e4a085299e10a",
        authenticationKey:
            "13bf0b94c4affa784dbd9b7384039f077b71f0f87f774544381498b7a629ee54",
        maxDistance: 7,
        maxDistanceWhenDayIsClear: 30,
        sFirstName: "",
        sLastName: "",
        sName: "",
        sAddress: "",
        sCity: "",
        sState: "",
        sZip: "",
        sPhone: "",
        sEmail: "",
        sSqFeet: "",
        customer: {},
        customerCreated: false,
        serviceTypes: [],
        selectedService: {},
        currentDate: new Date(),
        futureDate: new Date(),
        futureDateMonthsAhead: 1,
        spotsObject: {},
        datesArray: [],
        availableTimesObject: {},
        availableTimesArray: [],
        monthNames: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ],
        selectedDateString: "",
        morningSpots: {},
        afternoonSpots: {}
    };

    createCustomer = () => {
        let {
            sName,
            sAddress,
            sCity,
            sState,
            sZip,
            sPhone,
            sEmail,
            sSqFeet
        } = this.state;

        if (sName === "") {
            console.log("invalid input");
        } else {
            let roundedSquareFeet = this.calculateSquareFoot(sSqFeet);
            //change Deep Clean to another serviceType description
            let description = `Deep Clean ${roundedSquareFeet}sf`;
            let dataObj = { includeData: 1, description: description };
            let postUrl = this.urlBuilder("serviceType/search", dataObj);

            //post to get service types
            axios
                .post(postUrl)
                .then(res => {
                    if (res.data.serviceTypes && res.data.serviceTypes.length > 0) {
                        console.log("Step 1 - got service type");
                        let service = res.data.serviceTypes[0];
                        //The ideal thing to do is to create a dataMain array and push customer info onto it
                        //then loop through it and set it into formData
                        //However, since we're only doing one customer at a time it would be redundant to have that extra code
                        //Solution: hardCode 'dataMain[0][variableName]' onto the variable name
                        var formData = new FormData();
                        formData.set(
                            "dataMain[0][CustomerID]",
                            Math.floor(Date.now() / 1000)
                        );
                        formData.set("dataMain[0][CustomerName]", sName);
                        formData.set("dataMain[0][CustomerAddress]", sAddress);
                        formData.set("dataMain[0][CustomerCity]", sCity);
                        formData.set("dataMain[0][CustomerZipCode]", sZip);
                        formData.set("dataMain[0][CustomerState]", sState);
                        formData.set("dataMain[0][CustomerPhone1]", sPhone);
                        formData.set("dataMain[0][CustomerEmail]", sEmail);
                        formData.set("dataMain[0][SquareFt]", roundedSquareFeet);
                        formData.set("dataMain[0][Frequency]", service.frequency);
                        formData.set("dataMain[0][ServiceType]", service.description);
                        formData.set("dataMain[0][Price]", service.defaultCharge);

                        //post to create customer
                        postUrl = this.urlBuilder("import/main");
                        return axios.post(postUrl, formData, {
                            headers: { "Content-Type": "multipart/form-data" }
                        });
                    }
                })
                .then(res => {
                    console.log("Step 2 - created customer");
                    console.log(res.data);
                    if (
                        res.data.customersImported &&
                        res.data.customersImported.length > 0
                    ) {
                        let customer = res.data.customersImported[0];
                        console.log(customer);
                        console.log(customer.PestRoutesCustomerID);

                        let dataObj = {
                            includeSubscriptions: 1
                        };

                        let postUrl = this.urlBuilder(
                            `customer/${customer.PestRoutesCustomerID}`,
                            dataObj
                        );
                        console.log(postUrl);
                        return axios.post(postUrl);
                    }
                })
                .then(res => {
                    console.log("Step 3 - retrieve customer");
                    if (res.data.customer) {
                        let customer = res.data.customer;
                        this.setState({ customer: customer, customerCreated: true });
                    }
                    console.log(res.data);
                })
                .finally(() => {
                    console.log("done");
                });
        }
    };

    getSpotsForDay = day => {
        console.log(`day: ${day}`);
        const { customer, maxDistance, maxDistanceWhenDayIsClear } = this.state;
        let dataObj = {
            date: day,
            apiCanSchedule: true
        };

        let postUrl = this.urlBuilder("spot/search", dataObj);
        axios
            .post(postUrl)
            .then(res => {
                console.log("Step 1 - retrieve spot IDs for selected day");
                if (res.data.spotIDs && res.data.spotIDs.length > 0) {
                    let spotIDs = res.data.spotIDs;
                    console.log(`spotIds size: ${spotIDs.length}`);
                    dataObj = {
                        spotIDs,
                        latitude: customer.lat,
                        longitude: customer.lng
                    };
                    return axios.post(this.urlBuilder("spot/get", dataObj));
                }
            })
            .then(res => {
                console.log("Step 2 - retrieve spot objects for selected day");
                let morningObj = {},
                    afternoonObj = {};
                if (res.data.spots && res.data.spots.length > 0) {
                    let spots = res.data.spots;
                    //currently working on displaying the correct times
                    spots.forEach(spot => {
                        if (this.isAfternoon(spot)) {
                            if (afternoonObj[spot.start]) {
                                afternoonObj[spot.start].push(spot);
                            } else {
                                let tmpArr = [];
                                tmpArr.push(spot);
                                afternoonObj[spot.start] = tmpArr;
                            }
                        } else {
                            if (morningObj[spot.start]) {
                                morningObj[spot.start].push(spot);
                            } else {
                                let tmpArr = [];
                                tmpArr.push(spot);
                                morningObj[spot.start] = tmpArr;
                            }
                        }
                    });
                    this.setState({
                        morningSpots: morningObj,
                        afternoonSpots: afternoonObj
                    });
                }
            });
    };

    getBulkSpots = spotsArrays => {
        const { maxDistance } = this.state;
        let tmpSpotsObject = {};
        let tmpDatesArr = [];
        spotsArrays.forEach(spotsArr => {
            let postUrl = this.urlBuilder("/spot/get", {
                spotIDs: spotsArr,
                maxDistance: maxDistance
            });
            axios
                .post(postUrl)
                .then(res => {
                    let spots = res.data.spots;
                    if (spots && spots.length > 0) {
                        console.log(spots.length);
                        spots.forEach(spot => {
                            if (spot.start.match(/[0-9]{2}:00:00/)) {
                                if (tmpSpotsObject[spot.date]) {
                                    tmpSpotsObject[spot.date].push(spot);
                                } else {
                                    let parsedDate = spot.date.split("-");
                                    var date = new Date(
                                        parsedDate[0],
                                        parsedDate[1] - 1,
                                        parsedDate[2]
                                    );
                                    tmpDatesArr.push(date);
                                    let tmpArr = [];
                                    tmpArr.push(spot);
                                    tmpSpotsObject[spot.date] = tmpArr;
                                }
                            }
                        });
                    }
                })
                .catch(err => console.log(err))
                .finally(() => {
                    this.setState({
                        spotsObject: tmpSpotsObject,
                        datesArray: tmpDatesArr
                    });
                    console.log(tmpSpotsObject);
                });
        });
    };

    calculateSquareFoot = squareFoot => {
        if (squareFoot < 1001) {
            return 1000;
        } else if (squareFoot > 7999) {
            return 8000;
        } else {
            let rounded = 250 * Math.round(squareFoot / 250);
            return rounded;
        }
    };

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    onDateChange = date => {
        let { monthNames } = this.state;
        this.setState({
            selectedDateString: `${monthNames[date.getMonth()]} ${date.getDate()}`
        });
        let month = (date.getMonth() + 1).toString();
        let day = date.getDate().toString();
        var dateString = `${date.getFullYear()}-${
            month.length === 1 ? `0${month}` : month
            }-${day.length === 1 ? `0${day}` : day}`;
        this.getSpotsForDay(dateString);
    };

    onTimeChange = e => {
        console.log("in here");
        console.log(e);
    };

    getAvailableTimeSlots = morning => {
        let { morningSpots, afternoonSpots } = this.state;
        let newTimesObj = morning ? morningSpots : afternoonSpots;
        let title = morning ? "Morning" : "Afternoon";
        let openSlotsArr = [];
        if (Object.keys(newTimesObj).length > 0) {
            console.log(newTimesObj);
            Object.entries(newTimesObj).forEach(timeSlotObj => {
                let timeSlotArr = timeSlotObj[1];
                if (timeSlotArr.length > 0) {
                    let index = 0;
                    for (index; index < timeSlotArr.length; index++) {
                        let timeSlot = timeSlotArr[index];
                        if (timeSlot.open === "1") {
                            openSlotsArr.push(timeSlot);
                        }
                        break;
                    }
                }
            });
            var compare = (a, b) => {
                const startA = a.start;
                const startB = b.start;
                let comparison = 0;
                if (startA > startB) {
                    comparison = 1;
                } else if (startA < startB) {
                    comparison = -1;
                }
                return comparison;
            };
            openSlotsArr.sort(compare);
            console.log(`array size: ${openSlotsArr.length}`);

            return (
                <div>
                    {openSlotsArr.length > 0 ? (
                        <h3 className="timeOfDay">{title}</h3>
                    ) : null}
                    {openSlotsArr.map((spot, index) => {
                        return (
                            <input
                                key={index}
                                type="button"
                                className="appointmentBtn"
                                value={this.getFormattedTime(spot)}
                                onClick={() => {
                                    this.onTimeChange(spot);
                                }}
                            />
                        );
                    })}
                </div>
            );
        }
        return <div />;
    };

    getFormattedTime = spot => {
        let splitTime = spot.start.split(":");
        let pm = this.isAfternoon(spot);
        let finalString = `${
            splitTime[0] > 12 ? splitTime[0] - 12 : splitTime[0]
            }:${splitTime[1]} ${pm ? "PM" : "AM"}`;
        return finalString;
    };

    isAfternoon = spot => {
        let splitTime = spot.start.split(":");
        let hours = splitTime[0];
        return hours > 11;
    };

    getAppointment = () => {
        let id = "23279";
        let postUrl = this.urlBuilder(`appointment/${id}`);
        axios
            .post(postUrl)
            .then(res => {
                console.log(res.data.appointment);
            })
            .catch(err => console.log(err));
    };

    getCustomer = () => {
        let id = "11117";
        //let id = "10269";
        // let id = "10079";

        let dataObj = {
            includeSubscriptions: 1
        };

        let postUrl = this.urlBuilder(`customer/${id}`, dataObj);

        axios.post(postUrl).then(
            res => {
                console.log(res.data.customer);
                this.setState({ customer: res.data.customer, customerCreated: true });
            },
            error => {
                console.log(error);
            }
        );
    };

    isWeekday = date => {
        const day = date.getDay();
        return day !== 0 && day !== 6;
    };

    urlBuilder = (subUrl, dataObj) => {
        const { baseUrl, authenticationToken, authenticationKey } = this.state;
        let finalUrl = `${baseUrl}${subUrl}?authenticationToken=${authenticationToken}&authenticationKey=${authenticationKey}`;

        if (dataObj) {
            let dataArr = Object.entries(dataObj);
            dataArr.forEach((entry, index) => {
                if (entry[1] !== "") {
                    if (index === 0) {
                        finalUrl += "&";
                    }
                    finalUrl += `${entry[0]}=${entry[1]}`;

                    if (index < dataArr.length - 1) {
                        finalUrl += "&";
                    }
                }
            });
        }

        return finalUrl;
    };

    render() {
        const {
            sName,
            sAddress,
            sCity,
            sState,
            sZip,
            sPhone,
            sEmail,
            sSqFeet,
            customerCreated,
            customer,
            selectedDateString
        } = this.state;

        return (
            <div className="container">
                <h1 className="header">Hello <span className="customerName">{customer.fname}</span></h1>
                {customerCreated ? null : <p className="paragraph">Lets Get Started</p>}
                <form className="formEl">
                    {customerCreated ? (
                        <div className="container">
                            <h3 className="initial">Initial Service Price &#36;149</h3>
                            <h3 className="title">Select Date/Time Window</h3>
                            <div className="appointmentContainer">
                                <DatePicker
                                    inline
                                    filterDate={this.isWeekday}
                                    onChange={this.onDateChange}
                                />
                            </div>
                            {selectedDateString !== "" ? (
                                <div className="appointmentContainer">
                                    <h3 className="title">
                                        <span className="light">Availability</span>{" "}
                                        {selectedDateString}
                                    </h3>
                                    <p className="lightNote">
                                        When scheduling an appointment there is always a 2 hour
                                        arrival time window
                                     </p>
                                    {this.getAvailableTimeSlots(true)}
                                    {this.getAvailableTimeSlots(false)}
                                </div>
                            ) : (
                                    <div />
                                )}

                            <div className="appointmentNotesContainer">
                                <h3 className="timeOfDay">Appointment Notes (optional)</h3>
                                <textarea
                                    placeholder="Please provide any specific deta..."
                                    className="appointmentTextArea"
                                />
                            </div>
                            <div className="paymentsContainer">
                                <h3 className="paymentTitle">
                                    Reserve your appointment with a card
                               </h3>
                                <Cleave
                                    className="inputFields cc card"
                                    placeholder="Credit Card or Debit"
                                    type="tel"
                                    options={{ creditCard: true }}
                                    onChange={this.onChange.bind(this)}
                                />
                                <Cleave
                                    className="inputFields cc side"
                                    placeholder="Exp Date"
                                    type="tel"
                                    options={{ date: true, datePattern: ["m", "y"] }}
                                    onChange={this.onChange.bind(this)}
                                />
                                <Cleave
                                    className="inputFields cc side"
                                    placeholder="CVV"
                                    type="tel"
                                    options={{ blocks: [4] }}
                                    onChange={this.onChange.bind(this)}
                                />
                                {/* <input className="inputFields cc side" type="number" placeholder="Exp Date"/> */}
                                {/* <input className="inputFields cc side" type="number" placeholder="CVV"/> */}
                            </div>
                            <div className="checkboxContainer">
                                <label className="agreementCheckbox">
                                    {" "}
                                    I authorize Clean to store this card for future service until
                                    I cancel this authorization
                  <input type="checkbox" />
                                    <span className="checkmark" />
                                </label>

                                <label className="agreementCheckbox">
                                    {" "}
                                    I have read and agree to the cancellation policy.
                  <input type="checkbox" />
                                    <span className="checkmark" />
                                </label>
                            </div>
                            <div className="completeContainer">
                                <input
                                    className="completeOrder"
                                    type="button"
                                    value="Book Appointment"
                                />
                            </div>
                        </div>
                    ) : (
                            <div className="container">
                                <input
                                    className="inputFields name"
                                    type="text"
                                    name="sName"
                                    placeholder="Full Name"
                                    onChange={this.onChange}
                                    value={sName}
                                />
                                <input
                                    className="inputFields address"
                                    type="text"
                                    name="sAddress"
                                    placeholder="Address"
                                    onChange={this.onChange}
                                    value={sAddress}
                                />
                                <input
                                    className="inputFields address"
                                    type="text"
                                    name="sCity"
                                    placeholder="City"
                                    onChange={this.onChange}
                                    value={sCity}
                                />
                                <input
                                    className="inputFields side zip"
                                    type="tel"
                                    name="sZip"
                                    placeholder="Zip"
                                    maxLength="5"
                                    onChange={this.onChange}
                                    value={sZip}
                                />
                                <select className="inputFields side">
                                    <option
                                        className="inputFields side state"
                                        type="text"
                                        name="sState"
                                        onChange={this.onChange}
                                        value="0"
                                    >
                                        State
                                    </option>
                                    <option
                                        className="inputFields side state"
                                        type="text"
                                        name="sState"
                                        onChange={this.onChange}
                                        value={sState}
                                    >
                                        AZ
                                </option>
                                </select>
                                <Cleave
                                    className="inputFields phone"
                                    placeholder="Enter phone number"
                                    type="tel"
                                    name="sPhone"
                                    value={sPhone}
                                    options={{ phone: true, phoneRegionCode: "US" }}
                                    onChange={this.onChange}
                                />
                                {/* <input className="inputFields phone" type="tel" name="sPhone" placeholder="Cell Phone" onChange={this.onChange} value={sPhone}/> */}
                                <input
                                    className="inputFields email"
                                    type="email"
                                    name="sEmail"
                                    placeholder="Email Address"
                                    onChange={this.onChange}
                                    value={sEmail}
                                />
                                <Cleave
                                    className="inputFields sqft"
                                    placeholder="Square Feet Of Home"
                                    name="sSqFeet"
                                    type="tel"
                                    value={sSqFeet}
                                    options={{
                                        numeral: true,
                                        numeralThousandsGroupStyle: "thousand"
                                    }}
                                    onChange={this.onChange}
                                />
                                {/* <input className="inputFields sqft" type="text" name="sSqFeet" placeholder="Square Feet of Home" onChange={this.onChange} value={sSqFeet} /> */}
                                <div className="btnContainer">
                                    <p className="next">Next</p>
                                    <input
                                        className="submitBtn"
                                        type="button"
                                        onClick={this.createCustomer}
                                    />
                                    <input
                                        type="button"
                                        value="Create Test Customer"
                                        onClick={this.getCustomer}
                                    />
                                </div>
                            </div>
                        )}
                </form>
            </div>
        );
    }
}

export default UserForm;
