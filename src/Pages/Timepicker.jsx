import React, { useState } from "react";
import { useForm } from "react-hook-form";

function MultiInputForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  const [durations, setDurations] = useState(["", "", ""]);

  const handleDurationChange = (index, value) => {
    if (/^\d{0,2}(:\d{0,2})?$/.test(value)) {
      const [hours, minutes] = value.split(":");
      if (
        (hours === undefined || (Number(hours) >= 0 && Number(hours) <= 24)) &&
        (minutes === undefined || (Number(minutes) >= 0 && Number(minutes) <= 59))
      ) {
        const updatedDurations = [...durations];
        updatedDurations[index] = value;
        setDurations(updatedDurations);
        setValue(`duration_${index}`, value);
        clearErrors(`duration_${index}`);
      }
    }
  };

  const onSubmit = (data) => {
    const durationValues = [
      data.duration_0,
      data.duration_1,
      data.duration_2,
    ];

    // Validate each duration
    durationValues.forEach((duration, index) => {
      const [hours, minutes] = duration?.split(":").map(Number) || [0, 0];
      if (hours > 24 || (hours === 24 && minutes > 0)) {
        setError(`duration_${index}`, {
          type: "manual",
          message: "Time cannot exceed 24:00",
        });
        throw new Error("Validation failed");
      }
    });

    console.log("Name:", data.name);
    console.log("Durations:", durationValues);
    alert(
      `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nDurations: ${durationValues.join(", ")}`
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name Input */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          {...register("name", { required: "Name is required" })}
          placeholder="Enter your name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Duration 1 */}
      <div>
        <label
          htmlFor="duration_0"
          className="block text-sm font-medium text-gray-700"
        >
          Enter Duration 1 (HH:MM)
        </label>
        <input
          type="text"
          id="duration_0"
          value={durations[0]}
          onChange={(e) => handleDurationChange(0, e.target.value)}
          placeholder="HH:MM"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.duration_0 && (
          <p className="text-sm text-red-600">{errors.duration_0.message}</p>
        )}
      </div>

      {/* Duration 2 */}
      <div>
        <label
          htmlFor="duration_1"
          className="block text-sm font-medium text-gray-700"
        >
          Enter Duration 2 (HH:MM)
        </label>
        <input
          type="text"
          id="duration_1"
          value={durations[1]}
          onChange={(e) => handleDurationChange(1, e.target.value)}
          placeholder="HH:MM"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.duration_1 && (
          <p className="text-sm text-red-600">{errors.duration_1.message}</p>
        )}
      </div>

      {/* Duration 3 */}
      <div>
        <label
          htmlFor="duration_2"
          className="block text-sm font-medium text-gray-700"
        >
          Enter Duration 3 (HH:MM)
        </label>
        <input
          type="text"
          id="duration_2"
          value={durations[2]}
          onChange={(e) => handleDurationChange(2, e.target.value)}
          placeholder="HH:MM"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.duration_2 && (
          <p className="text-sm text-red-600">{errors.duration_2.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Submit
      </button>
    </form>
  );
}

export default MultiInputForm;
