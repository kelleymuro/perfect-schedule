import React, { useState, Component } from 'react';
import DatePicker from 'react-datepicker';
import './DatePicker.css';
import "react-datepicker/dist/react-datepicker.css";




const Date = () => {
    const [startDate, setStartDate] = useState(null);
    return(
        <div className="dateContainer">
            <DatePicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                inline
            />
        </div>
      
    )
}

export default Date;