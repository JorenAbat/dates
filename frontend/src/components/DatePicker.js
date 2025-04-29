import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import '../styles/DatePicker.css';

const CustomDatePickerComponent = ({ value, onChange }) => {
  return (
    <div className="date-picker-container">
      <DatePicker
        selected={value ? new Date(value) : null}
        onChange={(date) => onChange(date)}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        timeCaption="Time"
        dateFormat="MMMM d, yyyy h:mm aa"
        placeholderText="Select date and time"
        className="date-picker-input"
      />
    </div>
  );
};

export default CustomDatePickerComponent; 