import React from "react";
import Navbar from "../components/Navbar";
import SectionHeader from "../components/SectionHeader";
import OurValues from "../components/OurValues";
import CoreFeatures from "../components/CoreFeatures";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import "../pages/css/About.css";

const About = () => {
  return (
    <>
      <Navbar />
      <SectionHeader />
      <OurValues />
      <CoreFeatures />
      <CTASection />
      <Footer />
    </>
  );
};

export default About;
