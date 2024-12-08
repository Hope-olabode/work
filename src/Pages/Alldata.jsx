import { useState, useEffect } from "react";

export default function Alldata() {
  const [filterCountry, setFilterCountry] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showData, setShowData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3002/form/data"); // Replace with your API URL
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result); // Save the fetched data
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
    let totalDuration = 0;
    let totalExercise = 0;

    filteredData.forEach((item) => {
      for (const [key, value] of Object.entries(item)) {
        // Add numeric values to their corresponding total
        if (!isNaN(value) && value !== "") {
          totals[key] = (totals[key] || 0) + Number(value);
        }

        // Handle duration and exercise as time fields (hh:mm)
        if (key === "duration" || key === "exercise") {
          const [hours, minutes] = value.split(":").map(Number);
          const totalMinutes = (totals[key] || 0) + hours * 60 + minutes;
          totals[key] = totalMinutes;
        }
      }
    });

    // Convert duration and exercise totals from minutes to hh:mm format
    if (totals["duration"]) {
      totalDuration = `${Math.floor(totals["duration"] / 60)}h ${
        totals["duration"] % 60
      }m`;
    }
    if (totals["exercise"]) {
      totalExercise = `${Math.floor(totals["exercise"] / 60)}h ${
        totals["exercise"] % 60
      }m`;
    }

    return { totals, totalDuration, totalExercise };
  };

  const { totals, totalDuration, totalExercise } = calculateTotals();

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

  return (
    <div>
      <div className="flex space-x-2 mb-6 flex-wrap">
        {africanCountries.map((country, index) => (
          <button
            key={index}
            onClick={() => {
              setFilterCountry(country);
              setShowData(true);
            }}
            className={`px-4 whitespace-nowrap py-2 rounded ${
              filterCountry === country
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {country}
          </button>
        ))}
      </div>

      <div>
        {loading ? (
          <p>Loading...</p>
        ) : showData && filteredData.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {Object.keys(filteredData[0]).map((key) => (
                  <th
                    key={key}
                    className="border border-gray-300 px-4 py-2 text-left"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index} className="even:bg-gray-50">
                  {Object.values(item).map((value, i) => (
                    <td key={i} className="border border-gray-300 px-4 py-2">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="bg-gray-200 font-bold">
                {Object.keys(filteredData[0]).map((key) => (
                  <td key={key} className="border border-gray-300 px-4 py-2">
                    {key === "duration"
                      ? totalDuration
                      : key === "exercise"
                      ? totalExercise
                      : totals[key] || ""}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        ) : showData ? (
          <p>No data found for the selected country.</p>
        ) : (
          <p>Select a country to view data.</p>
        )}
      </div>
    </div>
  );
}
