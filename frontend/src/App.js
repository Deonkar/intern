import React, { useState } from "react";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [similarity, setSimilarity] = useState(null);

  const handleFileUpload = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResult(null);
    setSimilarity(null);

    const formData = new FormData();
    formData.append("document", event.target.document.files[0]);

    try {
      const response = await fetch("http://localhost:5000/compare", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data.differences);
      setSimilarity(data.similarity);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">
        Document Comparison Tool
      </h1>

      <form
        className="bg-white shadow-md rounded-lg p-8 max-w-md w-full"
        onSubmit={handleFileUpload}
      >
        <input
          type="file"
          name="document"
          required
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Upload and Compare
        </button>
      </form>

      {loading && (
        <div className="flex items-center mt-6">
          <div className="spinner mr-2"></div>
          <p>Comparing documents...</p>
        </div>
      )}

      {similarity && (
        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold">
            Similarity Score: {similarity}
          </h2>
        </div>
      )}

      {result && (
        <div className="mt-8 w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Detailed Comparison
          </h2>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: result }}
          ></div>
        </div>
      )}
    </div>
  );
}

export default App;
