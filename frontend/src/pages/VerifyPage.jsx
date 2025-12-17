import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VerifyForm from "../components/VerifyForm";
import './css/VerifyPage.css';

function VerifyPage() {
  return (
    <div>
      <Navbar />
      <main className="text-center bg-white py-12">
        <div className="hero">
            <h1 className="text-3xl font-bold mb-2">Verify News Content</h1>
            <p className="text-gray-600 mb-10">
              Submit news articles and get instant<br></br>credibility verification
            </p>
        </div>
        
        <VerifyForm />
      </main>
      <Footer />
    </div>
  );
}

export default VerifyPage;
