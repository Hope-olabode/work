import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";

export default function Alldata() {
  const [filterCountry, setFilterCountry] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showData, setShowData] = useState(false);

  const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));
  const navigate = useNavigate();

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://server-zsg5.onrender.com/form/data"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        let result = await response.json();

        // Sort the data by date, then by name
        result = result.sort((a, b) => {
          // Parse dates
          const [dayA, monthA, yearA] = a.date?.split(" ").map(Number) || [];
          const [dayB, monthB, yearB] = b.date?.split(" ").map(Number) || [];
          const dateA = new Date(yearA, monthA - 1, dayA);
          const dateB = new Date(yearB, monthB - 1, dayB);

          // Compare dates first
          if (dateA - dateB !== 0) {
            return dateA - dateB;
          }

          // If dates are equal, compare names
          const nameA = a.name?.toLowerCase() || "";
          const nameB = b.name?.toLowerCase() || "";
          return nameA.localeCompare(nameB);
        });

        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
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
        if (value && typeof value === "string" && value.includes(":")) {
          // Handle time fields in hh:mm format
          const [hours, minutes] = value.split(":").map(Number);
          const totalMinutes = (totals[key] || 0) + hours * 60 + minutes;
          totals[key] = totalMinutes;
        } else if (!isNaN(value) && value !== "") {
          // Handle numeric fields
          totals[key] = (totals[key] || 0) + Number(value);
        }
      }
    });

    // Convert total minutes back to hh:mm format for specific fields
    if (totals["evangelism_hours"]) {
      totalEvangelismHours = `${Math.floor(totals["evangelism_hours"] / 60)}:${
        totals["evangelism_hours"] % 60
      }`;
    }
    if (totals["bible_reading_and_meditation"]) {
      totalBibleReadingAndMeditation = `${Math.floor(
        totals["bible_reading_and_meditation"] / 60
      )}:${totals["bible_reading_and_meditation"] % 60}`;
    }
    if (totals["prayer"]) {
      totalPrayer = `${Math.floor(totals["prayer"] / 60)}:${
        totals["prayer"] % 60
      }`;
    }
    if (totals["exercise"]) {
      totalExercise = `${Math.floor(totals["exercise"] / 60)}:${
        totals["exercise"] % 60
      }`;
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

  // Group data by week
  const groupDataByWeek = (dataToGroup) => {
    const groupedData = {};

    dataToGroup.forEach((item) => {
      const [day, month, year] = item.date.split(" ").map(Number);
      const dateObj = new Date(year, month - 1, day);

      // Get the week number
      const firstDayOfDecember = new Date(2024, 11, 1); // December 1, 2024
      const diff = Math.floor(
        (dateObj - firstDayOfDecember) / (7 * 24 * 60 * 60 * 1000)
      );
      const weekNumber = Math.max(0, diff);

      if (!groupedData[weekNumber]) {
        groupedData[weekNumber] = [];
      }

      groupedData[weekNumber].push(item);
    });

    return groupedData;
  };
  const weeklyData = groupDataByWeek(filteredData);

  const calculateWeeklyTotals = (weekData) => {
    const totals = {};

    weekData.forEach((item) => {
      for (const [key, value] of Object.entries(item)) {
        if (value && typeof value === "string" && value.includes(":")) {
          // Handle time fields in hh:mm format
          const [hours, minutes] = value.split(":").map(Number);
          const totalMinutes = (totals[key] || 0) + hours * 60 + minutes;
          totals[key] = totalMinutes;
        } else if (!isNaN(value) && value !== "") {
          // Handle numeric fields
          totals[key] = (totals[key] || 0) + Number(value);
        }
      }
    });

    // Convert total minutes back to hh:mm format
    Object.keys(totals).forEach((key) => {
      if (
        key.includes("hours") ||
        key.includes("prayer") ||
        key.includes("exercise") ||
        key === "bible_reading_and_meditation"
      ) {
        totals[key] = `${Math.floor(totals[key] / 60)}:${totals[key] % 60}`;
      }
    });

    return totals;
  };

  const excludedFields = [
    "sermon_reflection",
    "thanksgiving",
    "repentance_or_struggles",
    "prayer_requests",
    "overall_reflection_and_evaluation_on_the_day",
    "three_things_must_do_tomorrow",
    "_id",
    "createdAt",
    "updatedAt",
    "__v",
    "other_work_done_today"
  ];

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
      "Djibouti",
      "Eritrea",
      "Ethiopia",
      "Kenya",
      "Rwanda",
      "Seychelles",
      "Somalia",
      "South Sudan",
      "Tanzania",
      "Uganda",
    ],
    "Central Africa": [
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
      "Angola",
      "Botswana",
      "Comoros",
      "Eswatini",
      "Lesotho",
      "Madagascar",
      "Malawi",
      "Mauritius",
      "Mozambique",
      "Namibia",
      "South Africa",
      "Zambia",
      "Zimbabwe",
    ],
  };

  const downloadAsPDF = async () => {
    try {
      const table = document.querySelector("#ttt"); // Target your table element

      if (!table) {
        console.error("No table found with id 'ttt'!");
        return;
      }

      const pdf = new jsPDF("l", "mm", "a4");
      const margin = 10;
      const pdfWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
      const pdfHeight = pdf.internal.pageSize.getHeight() - 2 * margin;

      // Render the table as a canvas
      const canvas = await html2canvas(table);
      const imgData = canvas.toDataURL("image/png");

      const imgProps = pdf.getImageProperties(imgData);
      const imageWidth = pdfWidth; // Fit the image to the PDF width
      const imageHeight = (imgProps.height * imageWidth) / imgProps.width; // Maintain aspect ratio

      // Add image to PDF
      if (imageHeight <= pdfHeight) {
        // If the table fits within one page, center it
        const centerY = (pdfHeight - imageHeight) / 2 + margin;
        pdf.addImage(imgData, "PNG", margin, centerY, imageWidth, imageHeight);
      } else {
        // Handle multi-page scenario
        let position = margin;
        let remainingHeight = imageHeight;

        while (remainingHeight > 0) {
          const currentHeight = Math.min(remainingHeight, pdfHeight);

          pdf.addImage(
            imgData,
            "PNG",
            margin,
            position,
            imageWidth,
            currentHeight
          );

          remainingHeight -= pdfHeight;
          position += pdfHeight;

          if (remainingHeight > 0) {
            pdf.addPage();
            position = margin;
          }
        }
      }

      pdf.save(`${filterCountry}_data.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const exportToExcel = () => {
    if (!filterCountry) {
      alert("Please select a country before downloading.");
      return;
    }

    // Filter data for the selected country
    const selectedCountryData = data.filter(
      (item) => item.country === filterCountry
    );

    if (selectedCountryData.length === 0) {
      alert(`No data available for ${filterCountry}.`);
      return;
    }

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Add a sheet for all data for the selected country
    const filteredDataSheet = selectedCountryData.map((row) =>
      Object.fromEntries(
        Object.entries(row).filter(([key]) => !excludedFields.includes(key))
      )
    );

    const allDataSheetData = [
      Object.keys(filteredDataSheet[0]), // Headers
      ...filteredDataSheet.map((row) => Object.values(row)), // Rows
    ];

    const allDataWorksheet = XLSX.utils.aoa_to_sheet(allDataSheetData);
    XLSX.utils.book_append_sheet(
      workbook,
      allDataWorksheet,
      `All Data - ${filterCountry}`
    );

    // Group the filtered data by week
    const groupedData = groupDataByWeek(selectedCountryData);

    // Iterate through the grouped data to add weekly sheets
    Object.entries(groupedData).forEach(([week, weekData]) => {
      const weeklyFilteredData = weekData.map((row) =>
        Object.fromEntries(
          Object.entries(row).filter(([key]) => !excludedFields.includes(key))
        )
      );

      const sheetData = [
        Object.keys(weeklyFilteredData[0]), // Headers
        ...weeklyFilteredData.map((row) => Object.values(row)), // Rows
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        `Week ${Number(week) + 1} - ${filterCountry}`
      );
    });

    // Download the Excel file
    XLSX.writeFile(workbook, `${filterCountry}_Data.xlsx`);
  };

  return (
    <div className="overflow-scroll px-4">
      <h1 className="text-lg font-semibold text-center">All data for Africa</h1>
      <div className="space-y-6 flex flex-col mt-10 w-[150%]">
        {Object.entries(africanCountriesByRegion).map(
          ([region, countries], index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-2">{region}</h3>
              <div className="flex space-x-2 ">
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
          )
        )}
      </div>

      <div>
        {loading ? (
          <div className="fixed inset-0 bg-white bg-opacity-70 flex justify-center items-center z-50">
            <div className="relative w-24 h-24 border-[10px] border-black border-opacity-30 rounded-full animate-spin-slow flex justify-center items-center">
              <div className="absolute w-24 h-24 border-[10px] border-[#E2063A] border-t-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        ) : showData && filteredData.length > 0 ? (
          <>
            <div className="mt-10 text-lg text-md font-bold">
              {filterCountry} data
            </div>
            <table id="ttt">
              <th className="mt-10 text-lg text-md font-bold flex items-center justify-center">
                {filterCountry} data
              </th>

              <table
                id="tab"
                className="tab mt-10 w-full border-collapse border border-gray-300 mr-4"
              >
                <thead>
                  <tr className="bg-[#E2063A] text-white">
                    {Object.keys(filteredData[0])
                      .filter((key) => !excludedFields.includes(key))
                      .map((key) => (
                        <th
                          key={key}
                          className="border whitespace-nowrap text-center border-gray-300 px-4 py-2"
                        >
                          {key.charAt(0).toUpperCase() +
                            key.slice(1).replace(/_/g, " ")}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={index} className="even:bg-gray-50 odd:bg-gray-50">
                      {Object.entries(item)
                        .filter(([key]) => !excludedFields.includes(key))
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
                      .filter((key) => !excludedFields.includes(key))
                      .map((key) => (
                        <td
                          key={key}
                          className="border whitespace-nowrap text-center border-gray-300 px-4 py-2"
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

              <table
                id="tab"
                className="border-collapse w-full overflow-visible"
              >
                <th className="mt-10 text-lg text-md font-bold flex items-center justify-center">
                  Weekly Data
                </th>
                {Object.entries(weeklyData).map(([week, weekData], index) => (
                  <div key={index} className="mt-6">
                    <th className="mt-10 text-lg  flex items-center justify-center text-md font-bold">
                      Week {Number(week) + 1}
                    </th>

                    <table className="mt-2 w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-blue-600 text-white">
                          {Object.keys(weekData[0])
                            .filter((key) => !excludedFields.includes(key))
                            .map((key) => (
                              <th
                                key={key}
                                className="border whitespace-nowrap text-center border-gray-300 px-4 py-2"
                              >
                                {key.charAt(0).toUpperCase() +
                                  key.slice(1).replace(/_/g, " ")}
                              </th>
                            ))}
                        </tr>
                      </thead>
                      <tbody>
                        {weekData.map((item, idx) => (
                          <tr
                            key={idx}
                            className="even:bg-gray-50 odd:bg-white"
                          >
                            {Object.entries(item)
                              .filter(([key]) => !excludedFields.includes(key))
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
                        <tr className="bg-blue-600 text-white font-bold">
                          {Object.keys(weekData[0])
                            .filter((key) => !excludedFields.includes(key))
                            .map((key) => (
                              <td
                                key={key}
                                className="border whitespace-nowrap text-center border-gray-300 px-4 py-2"
                              >
                                {calculateWeeklyTotals(weekData)[key] || ""}
                              </td>
                            ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))}
              </table>
            </table>
          </>
        ) : showData ? (
          <p className="mt-10">No data found for the selected country.</p>
        ) : (
          <p className="mt-10">Select a country to view data.</p>
        )}
      </div>
      <button
        className="px-4 hover:border-black whitespace-nowrap py-2 rounded-full bg-[#E2063A] text-white mt-10"
        onClick={() => {
          navigate("/Reflect");
        }}
      >
        Reflection page
      </button>
      <button
        className="px-4 hover:border-black whitespace-nowrap py-2 rounded-full bg-[#E2063A] text-white mt-10"
        onClick={() => {
          navigate("/month");
        }}
      >
        monthly page
      </button>

      <button
        className="px-4 py-2 mt-4 bg-blue-600 text-white rounded-full hover:bg-blue-800"
        onClick={() => {
          downloadAsPDF();
        }}
      >
        download as PDF
      </button>

      <button
        onClick={exportToExcel}
        className="px-4 py-2 mt-4 bg-blue-600 text-white rounded-full hover:bg-blue-800"
      >
        Download CSV
      </button>
    </div>
  );
}
