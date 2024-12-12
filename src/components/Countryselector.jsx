import { useState } from "react";

export default function CountrySelector({ onCountrySelect }) {
  const [filterCountry, setFilterCountry] = useState("");

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

  const handleCountrySelect = (country) => {
    setFilterCountry(country);
    onCountrySelect(country); // Pass selected country to the parent component
  };

  return (
    <div className="space-y-6 flex flex-col mt-10 w-[150%]">
      {Object.entries(africanCountriesByRegion).map(
        ([region, countries], index) => (
          <div key={index}>
            <h3 className="text-lg font-semibold mb-2">{region}</h3>
            <div className="flex space-x-2 flex-wrap">
              {countries.map((country, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCountrySelect(country)}
                  className={`px-4 whitespace-nowrap py-2 rounded-full ${
                    filterCountry === country
                      ? "bg-[#E2063A] text-white"
                      : "border-gray-200 bg-white border-2"
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
  );
}
