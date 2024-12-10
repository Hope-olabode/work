import React, { useState } from "react";
import axios from "axios";

export default function DataLoaderExample() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true); // Start the loader
    setError(null);   // Clear previous errors
    try {
      const response = await axios.get("https://jsonplaceholder.typicode.com/posts/1");
      setData(response.data); // Save received data
    } catch (err) {
      setError(err.message || "An error occurred"); // Handle errors
    } finally {
      setLoading(false); // Stop the loader
    }
  };

  const postData = async () => {
    setLoading(true); // Start the loader
    setError(null);   // Clear previous errors
    try {
      const response = await axios.post("https://jsonplaceholder.typicode.com/posts", {
        title: "foo",
        body: "bar",
        userId: 1,
      });
      setData(response.data); // Save posted data response
    } catch (err) {
      setError(err.message || "An error occurred"); // Handle errors
    } finally {
      setLoading(false); // Stop the loader
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={fetchData}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
      >
        Fetch Data
      </button>
      <button
        onClick={postData}
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Post Data
      </button>

      
      {/* <div className="fixed inset-0 bg-white bg-opacity-70 flex justify-center items-center z-50">
        <div className="outer-circle w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin-slow flex justify-center items-center">
          <div className="inner-circle w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin-fast"></div>
        </div>
      </div> */}

      <div className="fixed inset-0 bg-white bg-opacity-70 flex justify-center items-center z-50">
        <div className=" relative w-24 h-24 border-[10px] border-black border-opacity-30  rounded-full animate-spin-slow flex justify-center items-center">
          <div className=" absolute w-24 h-24 border-[10px] border-[#E2063A] border-t-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
      </div>
      

      {data && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-500">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
