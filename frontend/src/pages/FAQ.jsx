import React from "react";
import { Container, Accordion } from "react-bootstrap";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FAQHeader from "../components/FAQHeader";
import ContactForm from "../components/ContactForm";
import "../pages/css/FAQ.css";

function FAQ() {
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Header Section */}
      <FAQHeader />

      {/* FAQ Content */}
      <Container className="faq-container my-5">
        {/* GENERAL QUESTIONS */}
        <Accordion alwaysOpen className="faq-category">
          <Accordion.Item eventKey="0">
            <Accordion.Header>General Questions</Accordion.Header>
            <Accordion.Body>
              <Accordion flush>
                <Accordion.Item eventKey="0-1">
                  <Accordion.Header>What is TRUTHLAB ?</Accordion.Header>
                  <Accordion.Body>
                    TruthLab is an AI-powered platform designed to help users
                    verify the credibility of news articles, social media posts,
                    and other information sources. Our technology analyzes
                    content across multiple dimensions to provide a
                    comprehensive assessment of its reliability.
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="0-2">
                  <Accordion.Header>How accurate is TRUTHLAB ?</Accordion.Header>
                  <Accordion.Body>
                    TruthLab’s accuracy is grounded in advanced AI models and
                    large-scale datasets. We continuously update our algorithms
                    and validate performance to ensure objective and reliable
                    results.
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="0-3">
                  <Accordion.Header>Who is behind TRUTHLAB ?</Accordion.Header>
                  <Accordion.Body>
                    TruthLab is developed by a multidisciplinary team of AI
                    engineers, data scientists, and media researchers focused on
                    transparency and fighting misinformation.
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="0-4">
                  <Accordion.Header>
                    Is TRUTHLAB politically biased ?
                  </Accordion.Header>
                  <Accordion.Body>
                    No. TRUTHLAB is committed to impartiality. Our models are
                    regularly reviewed to minimize bias and ensure fair,
                    data-driven outcomes.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* USING TRUTHLAB */}
        <Accordion alwaysOpen className="faq-category mt-3">
          <Accordion.Item eventKey="1">
            <Accordion.Header>Using TRUTHLAB</Accordion.Header>
            <Accordion.Body>
              Learn how to submit content, interpret credibility scores, and
              access reports through the TRUTHLAB dashboard.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* ACCOUNTS & PRICING */}
        <Accordion alwaysOpen className="faq-category mt-3">
          <Accordion.Item eventKey="2">
            <Accordion.Header>Accounts & Pricing</Accordion.Header>
            <Accordion.Body>
              TRUTHLAB offers free and premium plans. Premium users gain access
              to advanced analytics, export tools, and priority AI processing.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* TECHNICAL QUESTIONS */}
        <Accordion alwaysOpen className="faq-category mt-3">
          <Accordion.Item eventKey="3">
            <Accordion.Header>Technical Questions</Accordion.Header>
            <Accordion.Body>
              Explore topics like AI transparency, API integration, and how we
              handle data securely in compliance with privacy standards.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>

      {/* Contact Form Section */}
        <ContactForm />

      {/* Footer */}
      <Footer />
    </>
  );
}

export default FAQ;
