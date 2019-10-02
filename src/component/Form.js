import React, { Component } from 'react';
import axios from 'axios';
import './Form.css'
import Cleave from 'cleave.js/react';
import CleavePhone from 'cleave.js/dist/addons/cleave-phone.i18n';

class Form extends Component {
    state = {
        baseUrl: "https://clean.pestroutes.com/api/",
        authenticationToken:
          "b8ca67ecbcb431e55092e81a1e9f65de8652680709b2da5c751e4a085299e10a",
        authenticationKey:
          "13bf0b94c4affa784dbd9b7384039f077b71f0f87f774544381498b7a629ee54",
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
        customer: {}
      };
    
      createCustomer = (e) => {
        e.preventDefault();
        console.log("creating customer");
        let { sName, sAddress, sCity, sState, sZip, sPhone, sEmail, sSqFeet } = this.state;
    
        if (sName === "") {
          console.log("invalid input");
        } else {
          //The ideal thing to do is to create a dataMain array and push customer info onto it
          //then loop through it and set it into formData
          //However, since we're only doing one customer at a time it would be redundant to have that extra code
          //Solution: hardCode 'dataMain[0][variableName]' onto the variable name
          var formData = new FormData();
          formData.set("dataMain[0][CustomerID]", Math.floor(Date.now() / 1000));
          formData.set("dataMain[0][CustomerName]", sName);
          formData.set("dataMain[0][CustomerAddress]", sAddress);
          formData.set("dataMain[0][CustomerCity]", sCity);
          formData.set("dataMain[0][CustomerZipCode]", sZip);
          formData.set("dataMain[0][CustomerState]", sState);
          formData.set("dataMain[0][CustomerPhone1]", sPhone);
          formData.set("dataMain[0][CustomerEmail]", sEmail);
          formData.set("dataMain[0][SquareFt]", sSqFeet);
    
          let postUrl = this.urlBuilder("import/main");
    
          axios
            .post(postUrl, formData, {
              headers: { "Content-Type": "multipart/form-data" }
            })
            .then(
              res => {
                console.log(res.data);
              },
              error => {
                console.log(error);
              }
            );
        }
      };

      onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
      };


      urlBuilder = (subUrl, dataObj) => {
        const { baseUrl, authenticationToken, authenticationKey } = this.state;
        let finalUrl = `${baseUrl}${subUrl}?authenticationToken=${authenticationToken}&authenticationKey=${authenticationKey}`;
    
        if (dataObj) {
          let dataArr = Object.entries(dataObj);
          dataArr.forEach((entry, index) => {
            if (entry[1] !== "") {
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
        sSqFeet
     } = this.state;

        return (
            <div className="container">
                <h1 className="header">Hello</h1>
                <p className="paragraph">Lets Get Started</p>
                <form className="formEl">
                    <input className="inputFields name" type="text" name="sName" placeholder="Full Name" onChange={this.onChange} value={sName}/>
                    <input className="inputFields address" type="text" name="sAddress" placeholder="Address" onChange={this.onChange} value={sAddress} />
                    <input className="inputFields address" type="text" name="sCity" placeholder="City" onChange={this.onChange} value={sCity} />
                    {/* <input className="inputFields side zip" type="tel" name="sZip" placeholder="Zip" onChange={this.onChange} value={sZip} /> */}
                    <Cleave className="inputFields side zip"
                      placeholder="Enter phone number"
                      type="tel"
                      name="sZip"
                      value={sZip}
                      options={{ blocks: [5] }}
                      onChange={this.onChange}
                    />
                    <select>
                        <option className="inputFields side state" type="text" name="sState"  onChange={this.onChange} value="0">Select State</option>
                        <option className="inputFields side state" type="text" name="sState"  onChange={this.onChange} value={sState}>AZ</option>
                    </select>
                       <Cleave className="inputFields phone" 
                       placeholder="Enter phone number"
                       type="tel"
                       name="sPhone" 
                       value={sPhone} 
                       options={{ phone: true, phoneRegionCode: 'US' }}
                      onChange={this.onChange} 
                      />
                    {/* <input className="inputFields phone" type="tel" name="sPhone" placeholder="Cell Phone" onChange={this.onChange} value={sPhone}/> */}
                    <input className="inputFields email" type="email" name="sEmail" placeholder="Email Address" onChange={this.onChange} value={sEmail} />
                    <Cleave className="inputFields sqft"
                      placeholder="Square Feet Of Home"
                      name="sSqFeet"
                      type="tel"
                      value={sSqFeet}
                      options={{ numeral: true, numeralThousandsGroupStyle: 'thousand' }}
                      onChange={this.onChange}
                    />
                    {/* <input className="inputFields sqft" type="text" name="sSqFeet" placeholder="Square Feet of Home" onChange={this.onChange} value={sSqFeet} /> */}
                    <div className="btnContainer">
                        <p className="next">Next</p>
                        <input className="submitBtn" type="button"  onClick={this.createCustomer} />
                    </div>
                </form>
            </div>
        )
    }
}





export default Form;
