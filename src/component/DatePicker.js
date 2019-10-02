import React, { useState } from 'react';
import DatePicker, { format } from 'react-datepicker';
import { isValid } from 'date-fns';
import './DatePicker.css';
import "react-datepicker/dist/react-datepicker.css";




const Date = () => {
    const [startDate, setStartDate] = useState(null);

    const handleOnBlur = ({ target: { value } }) => {
        const date = new Date(value);
        if (isValid(date)) {
          console.log("date: %s", format(date, "yyyy/MM/dd"));
        } else {
          console.log("value: %s", date);
        }
      };

    return(
        <div className="dateContainer">
            <DatePicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                onBlur={handleOnBlur}
                inline
            />
        </div>
      
    )
}

export default Date;