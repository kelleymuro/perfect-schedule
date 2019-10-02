import React, { Component } from 'react';
import axios from 'axios';
import './Form.css'

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
        sState: "",
        sZip: "",
        sPhone: "",
        sEmail: "",
        sSqFeet: "",
        customer: {}
      };
    
      createCustomer = () => {
        console.log("creating customer");
        let { sName, sAddress, sState, sZip, sPhone, sEmail, sSqFeet } = this.state;
    
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
                    <input className="inputFields side zip" type="number" name="sZip" placeholder="Zip" onChange={this.onChange} value={sZip} />
                    <input className="inputFields side state" type="text" name="sState" placeholder="State" onChange={this.onChange} value={sState} />
                    <input className="inputFields phone" type="tel" name="sPhone" placeholder="Cell Phone" onChange={this.onChange} value={sPhone}/>
                    <input className="inputFields email" type="email" name="sEmail" placeholder="Email Address" onChange={this.onChange} value={sEmail} />
                    <input className="inputFields sqft" type="text" name="sSqFeet" placeholder="Square Feet of Home" onChange={this.onChange} value={sSqFeet} />
                    <div className="btnContainer">
                        <p className="next">Next</p>
                        <button className="submitBtn" type="submit"  onClick={this.createCustomer} ><img alt="Arrow Button" src='https://denisealley.s3-us-west-2.amazonaws.com/Digital__Design_99-512.png'/></button>
                    </div>
                </form>
            </div>
        )
    }
}





export default Form;
