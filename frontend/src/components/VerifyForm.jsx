import React, { useState } from "react";
import OptionButton from "./OptionButton";
import VerificationResult from "./VerificationResult";
import "./css/VerifyForm.css";
import { Newspaper, TypeOutline, Link } from "lucide-react";

function VerifyForm() {
  const [selected, setSelected] = useState("URL");
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(null);
  const [result, setResult] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const handleVerify = async () => {
    if (!inputValue.trim()) {
      alert("Please enter content to verify.");
      return;
    }

    try {
      const token = localStorage.getItem("access_token") || localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:5000/verify/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          text: inputValue,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Backend returns { prediction: "REAL"|"FAKE", confidence: 0.0-1.0 }
        const confidence = typeof data.confidence === "number" ? data.confidence : parseFloat(data.confidence) || 0;

        // Build a result object compatible with VerificationResult expectations
        const mappedResult = {
          label: data.prediction || (confidence >= 0.5 ? "REAL" : "FAKE"),
          real_probability: data.prediction === "REAL" ? confidence : 1 - confidence,
          fake_probability: data.prediction === "FAKE" ? confidence : 1 - confidence,
          content: inputValue,
          category: data.prediction || null,
          raw: data,
        };

        const scorePercent = Math.round(confidence * 100);

        setScore(scorePercent);
        setResult(mappedResult);
        setShowResult(true);
      } else {
        alert(data.error || "Verification failed");
      }
    } catch (error) {
      console.error("Error verifying:", error);
      alert("Server error. Try again later.");
    }
  };

  const handleVerifyAnother = () => {
    setShowResult(false);
    setScore(null);
    setResult(null);
    setInputValue("");
  };

  return (
    <div className="formCard">
      {!showResult ? (
        <>
          <p className="text-sm text-gray-600 mb-4">
            What would you like to verify?
          </p>

          <div className="flex gap-8 justify-between mb-6">
            <OptionButton
              label="Full Article"
              active={selected === "Full Article"}
              onClick={() => setSelected("Full Article")}
              icon={<Newspaper />}
            />
            <OptionButton
              label="Headline"
              active={selected === "Headline"}
              onClick={() => setSelected("Headline")}
              icon={<TypeOutline />}
            /> 
            <OptionButton
              label="URL"
              active={selected === "URL"}
              onClick={() => setSelected("URL")}
              icon={<Link />}
            />
          </div>

          <div className="verifySection">
            <label className="block text-sm mb-2 text-gray-700">
              Enter the {selected.toLowerCase()}:
            </label>

            {selected === "Full Article" ? (
              <textarea
                placeholder="Enter the full article..."
                className="w-9/10 border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-400"
                rows="15"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            ) : (
              <input
                type="text"
                placeholder={`Enter the ${selected.toLowerCase()}...`}
                className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-400"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            )}

            <button
              onClick={handleVerify}
              className="bg-teal-500 text-white px-5 py-2 rounded hover:bg-teal-600"
            >
              Verify Content
            </button>
          </div>
        </>
      ) : (
        <VerificationResult
          score={score}
          result={result}
          contentType={selected}
          onVerifyAnother={handleVerifyAnother}
        />
      )}
    </div>
  );
}

export default VerifyForm;
