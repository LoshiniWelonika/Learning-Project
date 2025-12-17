import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import CallToAction from "../components/CallToAction";
import Footer from "../components/Footer";
import "./css/Home.css"; 

const Home = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
      <Footer />
    </>
  );
};

export default Home;
