import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

export default function Alldata() {
  const [filterCountry, setFilterCountry] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showData, setShowData] = useState(false);

  const isAdmin = JSON.parse(localStorage.getItem("isAdmin"))
  const navigate = useNavigate()

  if (isAdmin){
    

  } else {
    console.log('yes')
    return <Navigate to="/Login" />
  }

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetch("https://server-zsg5.onrender.com/form/data"); // Replace with your API URL
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        let result = await response.json();
  
        // Sort the data alphabetically by 'name' (or any desired field)
        result = result.sort((a, b) => {
          const nameA = a.name?.toLowerCase() || ""; // Handle case where 'name' might be undefined
          const nameB = b.name?.toLowerCase() || "";
          return nameA.localeCompare(nameB);
        });
  
        setData(result); // Save the sorted data
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // End loading state
      }
    };
  
    fetchData();
  }, []);

  const filteredData = filterCountry
    ? data.filter((item) => item.country === filterCountry)
    : [];

  // Helper function to calculate totals
  const calculateTotals = () => {
    let totals = {};
    let totalEvangelismHours = 0;
    let totalBibleReadingAndMeditation = 0;
    let totalPrayer = 0;
    let totalExercise = 0;

    filteredData.forEach((item) => {
      for (const [key, value] of Object.entries(item)) {
        // Add numeric values to their corresponding total
        if (!isNaN(value) && value !== "") {
          totals[key] = (totals[key] || 0) + Number(value);
        }

        // Handle time fields (hh:mm) conversion
        if (
          [
            "evangelism_hours",
            "bible_reading_and_meditation",
            "prayer",
            "exercise",
          ].includes(key)
        ) {
          const [hours, minutes] = value.split(":").map(Number);
          const totalMinutes = (totals[key] || 0) + hours * 60 + minutes;
          totals[key] = totalMinutes;
        }
      }
    });

    // Convert totals from minutes to hh:mm format
    if (totals["evangelism_hours"]) {
      totalEvangelismHours = `${Math.floor(totals["evangelism_hours"] / 60)}h ${
        totals["evangelism_hours"] % 60
      }m`;
    }
    if (totals["bible_reading_and_meditation"]) {
      totalBibleReadingAndMeditation = `${Math.floor(
        totals["bible_reading_and_meditation"] / 60
      )}h ${totals["bible_reading_and_meditation"] % 60}m`;
    }
    if (totals["prayer"]) {
      totalPrayer = `${Math.floor(totals["prayer"] / 60)}h ${
        totals["prayer"] % 60
      }m`;
    }
    if (totals["exercise"]) {
      totalExercise = `${Math.floor(totals["exercise"] / 60)}h ${
        totals["exercise"] % 60
      }m`;
    }

    return {
      totals,
      totalEvangelismHours,
      totalBibleReadingAndMeditation,
      totalPrayer,
      totalExercise,
    };
  };

  const {
    totals,
    totalEvangelismHours,
    totalBibleReadingAndMeditation,
    totalPrayer,
    totalExercise,
  } = calculateTotals();

  const africanCountriesByRegion = {
    "West Africa": [
      "Benin",
      "Burkina Faso",
      "Cabo Verde",
      "Ivory Coast",
      "Gambia",
      "Ghana",
      "Guinea",
      "Guinea-Bissau",
      "Liberia",
      "Mali",
      "Mauritania",
      "Niger",
      "Nigeria",
      "Senegal",
      "Sierra Leone",
      "Togo",
    ],
    "East Africa": [
      "Burundi",
      "Comoros",
      "Djibouti",
      "Eritrea",
      "Ethiopia",
      "Kenya",
      "Madagascar",
      "Malawi",
      "Mauritius",
      "Mozambique",
      "Rwanda",
      "Seychelles",
      "Somalia",
      "South Sudan",
      "Tanzania",
      "Uganda",
      "Zambia",
      "Zimbabwe",
    ],
    "Central Africa": [
      "Angola",
      "Cameroon",
      "Central African Republic",
      "Chad",
      "Congo",
      "Democratic Republic of the Congo",
      "Equatorial Guinea",
      "Gabon",
      "São Tomé and Príncipe",
    ],
    "Southern Africa": [
      "Botswana",
      "Eswatini",
      "Lesotho",
      "Namibia",
      "South Africa",
    ],
  };

  

  const excludedFields = [
    "daily_reflection",
    "thanksgiving",
    "repentance_or_struggles",
    "prayer_requests",
    "overall_reflection_on_the_day",
    "three_things_must_do_tomorrow",
  ];
  
  return (
    <div>
      <h1 className="text-lg font-semibold text-center">All data for Africa</h1>
      <div className="space-y-6 flex flex-col mt-10 w-[150%]">
        {Object.entries(africanCountriesByRegion).map(([region, countries], index) => (
          <div key={index}>
            <h3 className="text-lg font-semibold mb-2">{region}</h3>
            <div className="flex space-x-2 flex-wrap">
              {countries.map((country, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setFilterCountry(country);
                    setShowData(true);
                  }}
                  className={`px-4 whitespace-nowrap py-2 rounded-full ${
                    filterCountry === country
                      ? "bg-[#E2063A] text-white"
                      : "border-gray-200 bg-white border-2 hover:border-black"
                  }`}
                >
                  {country}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
  
      <div>
        {loading ? (
          <div className="fixed inset-0 bg-white bg-opacity-70 flex justify-center items-center z-50">
            <div className="relative w-24 h-24 border-[10px] border-black border-opacity-30 rounded-full animate-spin-slow flex justify-center items-center">
              <div className="absolute w-24 h-24 border-[10px] border-[#E2063A] border-t-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        ) : showData && filteredData.length > 0 ? (
          <table className="mt-10 w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#E2063A] text-white">
                {Object.keys(filteredData[0])
                  .filter((key) => !excludedFields.includes(key)) // Exclude unwanted fields
                  .map((key) => (
                    <th
                      key={key}
                      className="border whitespace-nowrap text-center border-gray-300 px-4 py-2"
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index} className="even:bg-gray-50 odd:bg-gray-50">
                  {Object.entries(item)
                    .filter(([key]) => !excludedFields.includes(key)) // Exclude unwanted fields
                    .map(([key, value], i) => (
                      <td
                        key={i}
                        className="border whitespace-nowrap text-center border-gray-300 px-4 py-2"
                      >
                        {value}
                      </td>
                    ))}
                </tr>
              ))}
              <tr className="bg-[#E2063A] text-white font-bold">
                {Object.keys(filteredData[0])
                  .filter((key) => !excludedFields.includes(key)) // Exclude unwanted fields
                  .map((key) => (
                    <td
                      key={key}
                      className="border text-center border-gray-300 px-4 py-2"
                    >
                      {key === "evangelism_hours"
                        ? totalEvangelismHours
                        : key === "bible_reading_and_meditation"
                        ? totalBibleReadingAndMeditation
                        : key === "prayer"
                        ? totalPrayer
                        : key === "exercise"
                        ? totalExercise
                        : totals[key] || ""}
                    </td>
                  ))}
              </tr>
            </tbody>
          </table>
        ) : showData ? (
          <p className="mt-10">No data found for the selected country.</p>
        ) : (
          <p className="mt-10">Select a country to view data.</p>
        )}
      </div>
      <button className="px-4 hover:border-black whitespace-nowrap py-2 rounded-full bg-[#E2063A] text-white mt-10"
      
      onClick={()=> {navigate("/Reflect")}}>Reflection page</button>
    </div>
  );
}  