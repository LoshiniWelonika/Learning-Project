import React, { useState } from "react";
import "../pages/css/FAQ.css";

function ContactForm() {
  // Step 1: Create state for form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");

  // Step 2: Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    const formData = { name, email, question };

    try {
      // Send form data to backend
      const res = await fetch("http://127.0.0.1:5000/faq/submit-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, question }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Question submitted successfully!");
        // Reset form after success
        setName("");
        setEmail("");
        setQuestion("");
      } else {
        alert(data.error || "Submission failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again later.");
    }
  };

  // Step 3: Render the form and connect inputs to state
  return (
    <section className="contact-form-container">
      <div className="contact-form-content">
        <h2>Still Have Questions ?</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <textarea
            placeholder="Describe your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </section>
  );
}

export default ContactForm;
