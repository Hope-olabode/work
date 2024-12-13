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

export default function Home() {
  const [durations, setDurations] = useState(["", "", "", ""]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const mqd = false;
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
    setLoading(true);
    console.log(durations);
    const newData = {
      ...data,
      evangelism_hours: durations[0],
      bible_reading_and_meditation: durations[1],
      prayer: durations[2],
      exercise: durations[3],
      country: data.country,
      date: date,
      email: localStorage.getItem("email"),
    };
    console.log(newData);
    axios
      .post("https://server-zsg5.onrender.com/form/data", newData)
      .then((result) => {
        if (result.status == 201) {
          console.log("Form submitted successfully");
          localStorage.removeItem("date");
          localStorage.removeItem("email");
          localStorage.removeItem("isLogin");
          toast(
            <div className="h-[84px] px-4 w-[280px] mx-auto text-[#00A86B] text-center bg-[#DDDDDD] border-2 border-dashed border-[#00A86B] flex flex-col rounded-[32px] justify-center items-center">
              User created successfully. Redirecting to login...
            </div>,
            {
              position: "top-center",
              duration: 2000,
            }
          );
          setTimeout(() => navigate("/"), 2000);
        }
      })
      .catch((err) => {
        // Extract error details, if available
        const errorMessage = err.response ? err.response.data : err.message;

        // Show the error in an alert
        toast(
          <div className="h-[84px] px-4 w-[280px] mx-auto text-[#E2063A] text-center bg-[#DDDDDD] border-2 border-dashed border-[#E2063A]  flex flex-col rounded-[32px] justify-center items-center]">
            {errorMessage}
          </div>,
          {
            position: "top-center",
            classNames: {
              cancelButton: "bg-orange-400",
            },
            duration: 2000,
          }
        );
      })
      .finally(() => {
        setLoading(false); // Hide spinner
      });
  };

  console.log(2);

  useEffect(() => {
    if (date) {
    } else {
      navigate("/");
    }
  }, [date]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => {
        toast(
          <div className="h-[84px] px-4 w-[280px] mx-auto text-[#E2063A] text-center bg-[#DDDDDD] border-2 border-dashed border-[#E2063A]  flex flex-col rounded-[32px] justify-center items-center]">
            {error.message}
          </div>,
          {
            position: "top-center",
            classNames: {
              cancelButton: "bg-orange-400",
            },
            duration: 2000,
          }
        );
      });
    }
  }, [errors]);

  const handleDurationChange = (index, value) => {
    if (/^\d{0,2}(:\d{0,2})?$/.test(value)) {
      const [hours, minutes] = value.split(":");
      if (
        (hours === undefined || (Number(hours) >= 0 && Number(hours) <= 24)) &&
        (minutes === undefined ||
          (Number(minutes) >= 0 && Number(minutes) <= 59))
      ) {
        const updatedDurations = [...durations];
        updatedDurations[index] = value;
        setDurations(updatedDurations);
        setValue(`duration_${index}`, value);
        clearErrors(`duration_${index}`);
      }
    }
  };

  const areAllFieldsFilled = () => {
    const fields = watch();
    const allDurationsFilled = durations.every((duration) => duration !== "");
    return (
      allDurationsFilled &&
      Object.values(fields).every(
        (value) => value !== "" && value !== undefined
      )
    );
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-70 flex justify-center items-center z-50">
          <div className=" relative w-24 h-24 border-[10px] border-black border-opacity-30  rounded-full animate-spin-slow flex justify-center items-center">
            <div className=" absolute w-24 h-24 border-[10px] border-[#E2063A] border-t-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      <div className="mt-[96px] py-32 px-4 flex flex-col content-center items-center">
        <div className="">
          <Toaster
            expand
            visibleToasts={1}
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
                  placeholder="Name"
                  type="string"
                />
              </div>

              <div className="div">
                <p>Country :</p>
                <select
                  id="country"
                  className="mt-2 w-full h-12 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                  {...register("country")} // Adding validation
                >
                  <option value="" >
                    Select a Country
                  </option>
                  {africanCountries.map((country, index) => (
                    <option key={index} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-sm text-red-600">
                    {errors.country.message}
                  </p>
                )}
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
                  id="duration_0"
                  value={durations[0]}
                  onChange={(e) => handleDurationChange(0, e.target.value)}
                  placeholder="HH:MM"
                  className="mt-2 w-full h-12 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                />
                {errors.duration_0 && (
                  <p className="text-sm text-red-600">
                    {errors.duration_0.message}
                  </p>
                )}
              </div>

              <div className="div">
                <p>People reached :</p>
                <input
                  spellCheck="false"
                  className="mt-2 w-full h-12 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                  {...register("people_reached")}
                  placeholder="Input Number"
                  type="number"
                />
              </div>

              <div className="div">
                <p>Contacts Received :</p>
                <input
                  spellCheck="false"
                  className="mt-2 w-full h-12 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                  {...register("contacts_received")}
                  placeholder="Input Number"
                  type="number"
                />
              </div>

              <div className="div">
                <p>Bible Study sessions :</p>
                <input
                  spellCheck="false"
                  className="mt-2 w-full h-12 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                  {...register("bible_study_sessions")}
                 placeholder="Input Number"
                  type="number"
                />
              </div>

              <div className="div">
                <p>Bible Study Attendants :</p>
                <input
                  spellCheck="false"
                  className="mt-2 w-full h-12 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                  {...register("bible_study_attendants")}
                 placeholder="Input Number"
                  type="number"
                />
              </div>

              <div className="div">
                <p>Unique Bible Study Attendants :</p>
                <input
                  spellCheck="false"
                  className="mt-2 w-full h-12 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                  {...register("unique_bible_study_attendants")}
                 placeholder="Input Number"
                  type="number"
                />
              </div>

              <div className="div">
                <p>Newcomers :</p>
                <input
                  spellCheck="false"
                  className="mt-2 w-full h-12 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                  {...register("newcomers")}
                 placeholder="Input Number"
                  type="number"
                />
              </div>

              <div className="div">
                <p>Bible Reading and Meditation :</p>
                <input
                  type="text"
                  id="duration_1"
                  value={durations[1]}
                  onChange={(e) => handleDurationChange(1, e.target.value)}
                  placeholder="HH:MM"
                  className="mt-2 w-full h-12 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                />
                {errors.duration_1 && (
                  <p className="text-sm text-red-600">
                    {errors.duration_1.message}
                  </p>
                )}
              </div>

              <div className="div">
                <p>Prayer :</p>
                <input
                  type="text"
                  id="duration_2"
                  value={durations[2]}
                  onChange={(e) => handleDurationChange(2, e.target.value)}
                  placeholder="HH:MM"
                  className="mt-2 w-full h-12 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                />
                {errors.duration_2 && (
                  <p className="text-sm text-red-600">
                    {errors.duration_2.message}
                  </p>
                )}
              </div>

              <div className="div">
                <p>Morning service attendance :</p>
                <input
                  spellCheck="false"
                  className="mt-2 w-full h-12 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                  {...register("morning_service_attendance")}
                 placeholder="Input Number"
                  type="number"
                />
              </div>

              <div className="div">
                <p>Regular service attendance :</p>
                <input
                  spellCheck="false"
                  className="mt-2 w-full h-12 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                  {...register("regular_service_attendance")}
                 placeholder="Input Number"
                  type="string"
                />
              </div>

              <div className="div">
                <p>Sermons or Bible study listened to :</p>
                <input
                  spellCheck="false"
                  className="mt-2 w-full h-12 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                  {...register("sermons_or_bible_study_listened_to")}
                 placeholder="Input Number"
                  type="number"
                />
              </div>

              <div className="div">
                <p>Articles Written :</p>
                <input
                  spellCheck="false"
                  className="mt-2 w-full h-12 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                  {...register("articles_written")}
                 placeholder="Input Number"
                  type="number"
                />
              </div>

              <div className="div">
                <p>Exercise :</p>
                <input
                  type="text"
                  id="duration_3"
                  value={durations[3]}
                  onChange={(e) => handleDurationChange(3, e.target.value)}
                  placeholder="HH:MM"
                  className="mt-2 w-full h-12 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
                />
                {errors.duration_3 && (
                  <p className="text-sm text-red-600">
                    {errors.duration_3.message}
                  </p>
                )}
              </div>

              <div className="div">
                <p>Daily Reflection :</p>
                <textarea
                  spellCheck="false"
                  className="mt-2 w-full h-32 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px]  lg:text-[16px] lg:leading-[26px]"
                  {...register("daily_reflection")}
                 placeholder=""
                  type="string"
                />
              </div>

              <div className="div">
                <p>Thanksgiving :</p>
                <textarea
                  spellCheck="false"
                  className="mt-2 h-32 w-full  border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px]  lg:text-[16px] lg:leading-[26px]"
                  {...register("thanksgiving")}
                 placeholder=""
                  type="string"
                />
              </div>

              <div className="div">
                <p>Repentance/Struggles :</p>
                <textarea
                  spellCheck="false"
                  className="mt-2 w-full h-32 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px]  lg:text-[16px] lg:leading-[26px]"
                  {...register("repentance_or_struggles")}
                 placeholder=""
                  type="string"
                />
              </div>

              <div className="div">
                <p>Prayer Requests (no more than three) :</p>
                <textarea
                  spellCheck="false"
                  className="mt-2 w-full h-32 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px]  lg:text-[16px] lg:leading-[26px]"
                  {...register("prayer_requests")}
                 placeholder=""
                  type="string"
                />
              </div>

              <div className="div">
                <p>Overall Reflection on the day :</p>
                <textarea
                  spellCheck="false"
                  className="mt-2 w-full h-32 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px]  lg:text-[16px] lg:leading-[26px]"
                  {...register("overall_reflection_on_the_day")}
                 placeholder=""
                  type="string"
                />
              </div>

              <div className="div">
                <p>3 things must do tomorrow :</p>
                <textarea
                  spellCheck="false"
                  className="mt-2 w-full h-32 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px]  lg:text-[16px] lg:leading-[26px]"
                  {...register("three_things_must_do_tomorrow")}
                 placeholder=""
                  type="string"
                />
              </div>
            </div>
                <p className="mt-10">Button will be active when all input boxes are filled</p>
            <button
              type="submit"
              className="bg-[#E2063A] mt-4 text-white  rounded-full relative overflow-hidden group lg:h-[72px] lg:w-full  w-[100%]"
              disabled={!areAllFieldsFilled()}
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
                    className={`${
                      areAllFieldsFilled() ? "hidden" : ""
                    } lg:h-10`}
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
      </div>
    </>
  );
}
