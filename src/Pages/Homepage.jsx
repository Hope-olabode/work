import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { z } from "zod";
import hpas from "../assets/Images/hpas.svg";
import hpas2 from "../assets/Images/hpas2.svg";
import hpas3 from "../assets/Images/hpas3.svg";
import hpas4 from "../assets/Images/hpas4.svg";
import wc from "../assets/Images/wcircle.svg";
import ba from "../assets/Images/barrow.svg";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

const schema = z.object({
  fullname: z.string(),
  email: z.string() /* .email("Incorrect email") */,
  password:
    z.string() /* .min(8, "Password doesn’t meet requirement").regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[@$!%*?&]/, "Password must contain at least one special character (e.g., @, $, !, %, *, ?, &)") */,
  password2:
    z.string() /* .min(8, "Password doesn’t meet requirement").regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[@$!%*?&]/, "Password must contain at least one special character (e.g., @, $, !, %, *, ?, &)") */,
});

export default function Home() {
  const [duration, setDuration] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [date, setDate] = useState(() => {
    // Retrieve the initial value from localStorage
    const storedDate = localStorage.getItem("date");
    try {
      return storedDate ? JSON.parse(storedDate) : ""; // Parse only if a value exists
    } catch (error) {
      console.error("Error parsing date from localStorage:", error);
      return ""; // Fallback to an empty string if parsing fails
    }
  });
  

  const africanCountries = [
    "Algeria",
    "Angola",
    "Benin",
    "Botswana",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cameroon",
    "Central African Republic",
    "Chad",
    "Comoros",
    "Congo",
    "Democratic Republic of the Congo",
    "Djibouti",
    "Egypt",
    "Equatorial Guinea",
    "Eritrea",
    "Eswatini",
    "Ethiopia",
    "Gabon",
    "Gambia",
    "Ghana",
    "Guinea",
    "Guinea-Bissau",
    "Ivory Coast",
    "Kenya",
    "Lesotho",
    "Liberia",
    "Libya",
    "Madagascar",
    "Malawi",
    "Mali",
    "Mauritania",
    "Mauritius",
    "Morocco",
    "Mozambique",
    "Namibia",
    "Niger",
    "Nigeria",
    "Rwanda",
    "São Tomé and Príncipe",
    "Senegal",
    "Seychelles",
    "Sierra Leone",
    "Somalia",
    "South Africa",
    "South Sudan",
    "Sudan",
    "Togo",
    "Tunisia",
    "Uganda",
    "Zambia",
    "Zimbabwe",
  ];

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useForm(/* {
    resolver: zodResolver(schema),
  } */);

  const onSubmit = (data) => {
    const newData = {
      ...data,
      duration: duration,
      country: selectedCountry,
      date: date,
      email: localStorage.getItem("email"),
    };
    console.log(newData);
    axios
      .post("http://localhost:3002/form/data", newData)
      .then((result) => {
        if (result.status == 201) {
          console.log("Form submitted successfully");
          navigate("/Login");
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          window.alert("Email already exist. pleas use a different Email");
        } else {
          console.log(err);
        }
      });
  };

  const areAllFieldsFilled = () => {
    const fields = [
      watch("Name"),
      watch("Country"),
      watch("Church"),
      watch("People reached"),
      watch("Contacts Received"),
      watch("Bible Study sessions"),
      watch("Bible Study Attendants"),
      watch("Unique Bible Study Attendants"),
      watch("Newcomers"),
      watch("Bible Reading and Meditation"),
      watch("Prayer"),
      watch("Morning service attendance"),
      watch("Regular service attendance"),
      watch("Sermons or Bible study listened to"),
      watch("Articles Written"),
      watch("Exercise"),
      watch("Daily Reflection"),
      watch("Thanksgiving"),
      watch("Repentance/Struggles"),
      watch("Prayer Requests"),
      watch("Overall Reflection on the day"),
      watch("3 things must do tomorrow"),
    ];

    // Check if every field has a non-empty value
    return fields.every((value) => value && value.trim() !== "");
  };

  console.log(areAllFieldsFilled());
  console.log(2);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => {
        toast(
          <div className="h-[84px] w-[357px] mx-auto text-[#E2063A] text-center bg-[#DDDDDD] border-2 border-dashed border-[#E2063A]  flex flex-col rounded-[32px] justify-center items-center]">
            {error.message}
          </div>,
          {
            position: "top-center",
            classNames: {
              cancelButton: "bg-orange-400",
            },
            duration: 5000,
          }
        );
      });
    }
  }, [errors]);

  const handleInputChange = (e) => {
    const value = e.target.value;

    // Match valid HH:mm format (partial or complete)
    if (/^\d{0,2}(:\d{0,2})?$/.test(value)) {
      const [hours, minutes] = value.split(":");

      // Restrict hours to 0–24 and minutes to 0–59
      if (
        (hours === undefined || (Number(hours) >= 0 && Number(hours) <= 24)) &&
        (minutes === undefined ||
          (Number(minutes) >= 0 && Number(minutes) <= 59))
      ) {
        setDuration(value); // Update input state
        setValue("duration", value); // Update React Hook Form state
        clearErrors("duration"); // Clear previous errors while typing
      }
    }
  };

  return (
    <>
     {date ? <div className="mt-[96px] py-32 px-4 flex flex-col content-center items-center">
      
      <div className="">
        <Toaster
          expand
          visibleToasts={2}
          toastOptions={{
            unstyled: true,
            className: "class",
          }}
        />
        <form
          className="mt-10 lg:mt-14 lg:w-[800px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* register your input into the hook by invoking the "register" function */}
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10 gap-8">
            <div>
              <p>Name :</p>
              <input
                spellCheck="false"
                className="mt-2 w-full h-12 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                {...register("name")}
                placeholder="Full Name"
                type="string"
              />
            </div>

            <div className="div">
              <p>Country :</p>
              <select
                id="country"
                value={selectedCountry}
                onChange={handleCountryChange}
                className="mt-2 w-full h-12 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
              >
                <option value="" disabled>
                  Select a Country
                </option>
                {africanCountries.map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div className="div">
              <p>Church currently serving at :</p>
              <input
                spellCheck="false"
                className="mt-2 w-full h-12 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                {...register("church")}
                placeholder="Church Name"
                type="string"
              />
            </div>

            <div className="div">
              <p>Evangelism hours (only numbers) :</p>
              <input
                type="text"
                id="duration"
                value={duration}
                onChange={handleInputChange}
                placeholder="HH:MM"
                className="mt-2 w-full h-12 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
              />
            </div>

            <div className="div">
              <p>People reached :</p>
              <input
                spellCheck="false"
                className="mt-2 w-full h-12 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                {...register("people_reached")}
                placeholder="1,2,3...300"
                type="string"
              />
            </div>

            <div className="div">
              <p>Contacts Received :</p>
              <input
                spellCheck="false"
                className="mt-2 w-full h-12 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                {...register("contacts_received")}
                placeholder="1,2,3...300"
                type="string"
              />
            </div>

            <div className="div">
              <p>Bible Study sessions :</p>
              <input
                spellCheck="false"
                className="mt-2 w-full h-12 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                {...register("bible_study_sessions")}
                placeholder=""
                type="string"
              />
            </div>

            <div className="div">
              <p>Bible Study Attendants :</p>
              <input
                spellCheck="false"
                className="mt-2 w-full h-12 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                {...register("bible_study_attendants")}
                placeholder=""
                type="string"
              />
            </div>

            <div className="div">
              <p>Unique Bible Study Attendants :</p>
              <input
                spellCheck="false"
                className="mt-2 w-full h-12 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                {...register("unique_bible_study_attendants")}
                placeholder=""
                type="string"
              />
            </div>

            <div className="div">
              <p>Newcomers :</p>
              <input
                spellCheck="false"
                className="mt-2 w-full h-12 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                {...register("newcomers")}
                placeholder=""
                type="string"
              />
            </div>

            <div className="div">
              <p>Bible Reading and Meditation :</p>
              <input
                spellCheck="false"
                className="mt-2 w-full h-12 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                {...register("bible_reading_and_meditation")}
                placeholder=""
                type="string"
              />
            </div>

            <div className="div">
              <p>Prayer :</p>
              <input
                spellCheck="false"
                className="mt-2 w-full h-12 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                {...register("prayer")}
                placeholder=""
                type="string"
              />
            </div>

            <div className="div">
              <p>Morning service attendance :</p>
              <input
                spellCheck="false"
                className="mt-2 w-full h-12 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                {...register("morning_service_attendance")}
                placeholder=""
                type="string"
              />
            </div>

            <div className="div">
              <p>Regular service attendance :</p>
              <input
                spellCheck="false"
                className="mt-2 w-full h-12 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                {...register("regular_service_attendance")}
                placeholder=""
                type="string"
              />
            </div>

            <div className="div">
              <p>Sermons or Bible study listened to :</p>
              <input
                spellCheck="false"
                className="mt-2 w-full h-12 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                {...register("sermons_or_bible_study_listened_to")}
                placeholder=""
                type="string"
              />
            </div>

            <div className="div">
              <p>Articles Written :</p>
              <input
                spellCheck="false"
                className="mt-2 w-full h-12 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                {...register("articles_written")}
                placeholder=""
                type="string"
              />
            </div>

            <div className="div">
              <p>Exercise :</p>
              <input
                spellCheck="false"
                className="mt-2 w-full h-12 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                {...register("exercise")}
                placeholder=""
                type="string"
              />
            </div>

            <div className="div">
              <p>Daily Reflection :</p>
              <textarea
                spellCheck="false"
                className="mt-2 w-full h-32 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                {...register("daily_reflection")}
                placeholder=""
                type="string"
              />
            </div>

            <div className="div">
              <p>Thanksgiving :</p>
              <textarea
                spellCheck="false"
                className="mt-2 h-32 w-full  border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                {...register("thanksgiving")}
                placeholder=""
                type="string"
              />
            </div>

            <div className="div">
              <p>Repentance/Struggles :</p>
              <textarea
                spellCheck="false"
                className="mt-2 w-full h-32 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                {...register("repentance_or_struggles")}
                placeholder=""
                type="string"
              />
            </div>

            <div className="div">
              <p>Prayer Requests (no more than three) :</p>
              <textarea
                spellCheck="false"
                className="mt-2 w-full h-32 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                {...register("prayer_requests")}
                placeholder=""
                type="string"
              />
            </div>

            <div className="div">
              <p>Overall Reflection on the day :</p>
              <textarea
                spellCheck="false"
                className="mt-2 w-full h-32 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                {...register("overall_reflection_on_the_day")}
                placeholder=""
                type="string"
              />
            </div>

            <div className="div">
              <p>3 things must do tomorrow :</p>
              <textarea
                spellCheck="false"
                className="mt-2 w-full h-32 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                {...register("three_things_must_do_tomorrow")}
                placeholder=""
                type="string"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#E2063A] mt-4 text-white  rounded-full relative overflow-hidden group lg:h-[72px] lg:w-full  w-[100%]"
            /* disabled={areAllFieldsFilled() ? false : true} */
          >
            <div
              className={`${
                areAllFieldsFilled()
                  ? ""
                  : "inset-0 bg-[#ffffffd0] z-10 absolute w-100%"
              } relative  px-4 py-[13px] lg:py-[23px] lg:px-0  `}
            >
              <span className="relative z-10 ">
                <p className="font-nexa-bold text-[14px] leading-[22px] text-left lg:text-[16px] lg:leading-[26px] lg:pl-[40px]">
                  Submit
                </p>
              </span>
              <div className="absolute right-[10px] top-[50%] translate-y-[-50%] lg:right-[25px]">
                <img
                  src={wc}
                  className={`${areAllFieldsFilled() ? "hidden" : ""} lg:h-10`}
                />
                <img
                  src={ba}
                  className={`${
                    areAllFieldsFilled() ? "block" : "hidden"
                  } lg:h-10`}
                />
              </div>
            </div>
          </button>
        </form>
      </div>
    </div>:navigate("/Login")}
    </>
    
    
  );
}
