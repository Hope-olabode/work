import React, { useState } from "react";
import { useForm } from "react-hook-form";

function CustomDurationInput() {
  const { 
    register, 
    handleSubmit, 
    setValue, 
    formState: { errors }, 
    setError, 
    clearErrors 
  } = useForm();
  const [duration, setDuration] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;

    // Match valid HH:mm format (partial or complete)
    if (/^\d{0,2}(:\d{0,2})?$/.test(value)) {
      const [hours, minutes] = value.split(":");

      // Restrict hours to 0–24 and minutes to 0–59
      if (
        (hours === undefined || (Number(hours) >= 0 && Number(hours) <= 24)) &&
        (minutes === undefined || (Number(minutes) >= 0 && Number(minutes) <= 59))
      ) {
        setDuration(value); // Update input state
        setValue("duration", value); // Update React Hook Form state
        clearErrors("duration"); // Clear previous errors while typing
      }
    }
  };

  const onSubmit = (data) => {
    const [hours, minutes] = data.duration.split(":").map(Number);

    // Validate that the time is not greater than 24:00
    if (hours > 24 || (hours === 24 && minutes > 0)) {
      setError("duration", {
        type: "manual",
        message: "Time cannot exceed 24:00",
      });
      return;
    }

    const totalMinutes = (hours || 0) * 60 + (minutes || 0);
    console.log(`Name: ${data.name}`);
    console.log(`Total time in minutes: ${totalMinutes}`);
    alert(`Name: ${data.name}\nTotal time in minutes: ${totalMinutes}`);
    console.log(data)
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

      {/* Duration Input */}
      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
          Enter Duration (HH:MM)
        </label>
        <input
          type="text"
          id="duration"
          value={duration}
          onChange={handleInputChange}
          placeholder="HH:MM"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.duration && (
          <p className="text-sm text-red-600">{errors.duration.message}</p>
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

export default CustomDurationInput;
