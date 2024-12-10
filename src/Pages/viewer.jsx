import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import axios from "axios";
import { Toaster, toast } from 'sonner'

function CustomDateForm() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [error, setError] = useState("");
  const [date, setDate] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("date", JSON.stringify(date));
  }, [date]);

  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(typeof selectedDate);

    const D = new Date(selectedDate);
    const MM = D.getMonth() + 1;
    const YYYY = D.getFullYear();
    const DD = D.getDay() + 1;
    const realDate = (`${DD} ${MM} ${YYYY}`)

    const data = {
      date: realDate,
      email: localStorage.getItem("email")
    }
     
    console.log(typeof realDate);

    if (!selectedDate) {
      setError("Please select a date.");
      return;
    }

    if (selectedDate < firstDayOfMonth || selectedDate > today) {
      setError("Please select a valid date within this month.");
      return;
    }

    setError("");

    axios
      .post("http://localhost:3002/form/check", data)
      .then((result) => {
        if (result.data==="b") {
          console.log("user created successfully");
          navigate("/");
          setDate(realDate);
        } else {
          toast(<div className="h-[84px] w-[357px] mx-auto text-[#E2063A] text-center bg-[#DDDDDD] border-2 border-dashed border-[#E2063A]  flex flex-col rounded-[32px] justify-center items-center]">Data for this day already exist, pick another day</div>, {
            position: 'top-center',
            classNames: {
              cancelButton: 'bg-orange-400'
            },
            duration: 5000,
          })
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
        } else {
          console.log(err);
        }
      });
  };

  return (
    <div className="flex flex-col items-center h-[100vh] justify-center">
      <h1>Pick Date to fill Data</h1>
      <Toaster 
          expand visibleToasts={2}
          toastOptions={{
            unstyled: true,
            className: 'class',
          }}
        
        />
      <form onSubmit={handleSubmit}>
        <label className="flex flex-col">
          Select Date:
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd-MM-yyyy" // Enforce DD-MM-YYYY format
            minDate={firstDayOfMonth}
            maxDate={today}
            placeholderText="DD-MM-YYYY"
            className="mt-2 w-full h-12 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
          />
        </label>
        <button
          className="bg-[#E2063A] mt-4 text-white  rounded-full relative overflow-hidden group lg:h-[72px] lg:w-full  w-[100%]"
          type="submit"
        >
          Submit
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default CustomDateForm;
