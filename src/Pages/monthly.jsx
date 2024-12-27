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

        result = result.sort((a, b) => {
          const [dayA, monthA, yearA] = a.date?.split(" ").map(Number) || [];
          const [dayB, monthB, yearB] = b.date?.split(" ").map(Number) || [];
          const dateA = new Date(yearA, monthA - 1, dayA);
          const dateB = new Date(yearB, monthB - 1, dayB);
          if (dateA - dateB !== 0) return dateA - dateB;
          return a.name?.localeCompare(b.name);
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
    : data;

  const groupDataByMonth = (dataToGroup) => {
    const groupedData = {};
    dataToGroup.forEach((item) => {
      const [day, month, year] = item.date.split(" ").map(Number);
      const monthKey = `${year}-${month.toString().padStart(2, "0")}`;

      if (!groupedData[monthKey]) {
        groupedData[monthKey] = [];
      }
      groupedData[monthKey].push(item);
    });
    return groupedData;
  };

  const monthlyData = groupDataByMonth(filteredData);

  console.log(monthlyData)

  const calculateMonthlyTotals = (monthData) => {
    const totals = {};
    monthData.forEach((item) => {
      for (const [key, value] of Object.entries(item)) {
        if (value && typeof value === "string" && value.includes(":")) {
          const [hours, minutes] = value.split(":").map(Number);
          totals[key] = (totals[key] || 0) + hours * 60 + minutes;
        } else if (!isNaN(value) && value !== "") {
          totals[key] = (totals[key] || 0) + Number(value);
        }
      }
    });
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
    "daily_reflection",
    "thanksgiving",
    "repentance_or_struggles",
    "prayer_requests",
    "overall_reflection_on_the_day",
    "three_things_must_do_tomorrow",
    "_id",
    "createdAt",
    "updatedAt",
    "__v",
  ];

  const africanCountries = [
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
    "Madagascar",
    "Malawi",
    "Mali",
    "Mauritania",
    "Mauritius",
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
    "Tanzania",
    "Togo",
    "Uganda",
    "Zambia",
    "Zimbabwe"
  ];


  const downloadAsPDF = async () => {
    try {
      const table = document.querySelector("#ta"); // Target your table element

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
  
    // Group data by month
    const groupDataByMonth = (dataToGroup) => {
      const groupedData = {};
      dataToGroup.forEach((item) => {
        const [day, month, year] = item.date.split(" ").map(Number);
        const monthKey = `${year}-${month.toString().padStart(2, "0")}`;
  
        if (!groupedData[monthKey]) {
          groupedData[monthKey] = [];
        }
        groupedData[monthKey].push(item);
      });
      return groupedData;
    };
  
    const monthlyData = groupDataByMonth(selectedCountryData);
  
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
  
    // Add a sheet for each month
    Object.entries(monthlyData).forEach(([month, monthData]) => {
      const filteredDataSheet = monthData.map((row) =>
        Object.fromEntries(
          Object.entries(row).filter(([key]) => !excludedFields.includes(key))
        )
      );
  
      const sheetData = [
        Object.keys(filteredDataSheet[0]), // Headers
        ...filteredDataSheet.map((row) => Object.values(row)), // Rows
      ];
  
      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, `Month ${month}`);
    });
  
    // Download the Excel file
    XLSX.writeFile(workbook, `${filterCountry}_Monthly_Data.xlsx`);
  };
  
  
  return (
    <div className="overflow-scroll px-4">
      <h1 className="text-lg font-semibold text-center">All data for Africa</h1>
      <div className="mt-4">
        <label htmlFor="countryFilter" className="mr-2 font-semibold">
          Select Country:
        </label>
        <select
          id="countryFilter"
          value={filterCountry}
          onChange={(e) => setFilterCountry(e.target.value)}
          className="mt-2 w-[200px] h-12 border-2 border-[#DDDDDD] rounded-[8px] focus:border-[#E2063A] focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px]"
        >
          <option value="">All Countries</option>
          {africanCountries.map((country, index) => (
                    <option key={index} value={country}>
                      {country}
                    </option>
                  ))}
        </select>
      </div>
      <div className="space-y-6 flex flex-col mt-10 w-[150%]">
        {Object.entries(monthlyData).map(([month, monthData], index) => (
          <table id="ta" key={index} className="mt-6">
            <h2 className="text-lg font-bold">Month: {month}</h2>
            <table className="mt-2 w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-blue-600 whitespace-nowrap text-center text-white">
                  {Object.keys(monthData[0])
                    .filter((key) => !excludedFields.includes(key))
                    .map((key) => (
                      <th key={key} className="border px-4 py-2">
                        {key.replace(/_/g, " ")}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {monthData.map((item, idx) => (
                  <tr key={idx} className="even:bg-gray-50 text-center odd:bg-white">
                    {Object.entries(item)
                      .filter(([key]) => !excludedFields.includes(key))
                      .map(([key, value], i) => (
                        <td key={i} className="border px-4 py-2">
                          {value}
                        </td>
                      ))}
                  </tr>
                ))}
                <tr className="bg-blue-600 text-center text-white font-bold">
                  {Object.keys(monthData[0])
                    .filter((key) => !excludedFields.includes(key))
                    .map((key) => (
                      <td key={key} className="border px-4 py-2">
                        {calculateMonthlyTotals(monthData)[key] || ""}
                      </td>
                    ))}
                </tr>
              </tbody>
            </table>
          </table>
        ))}
      </div>

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
