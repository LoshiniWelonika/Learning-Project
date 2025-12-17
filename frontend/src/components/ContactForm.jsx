import React from "react";
import "../pages/css/FAQ.css";

function ContactForm() {
  return (
    <section className="contact-form-container">
      <div className="contact-form-content">
        <h2>Still Have Questions ?</h2>
        <form className="contact-form">
          <input type="text" placeholder="Your name" required />
          <input type="email" placeholder="Email address" required />
          <textarea placeholder="Describe your question here..." required></textarea>
          <button type="submit">Submit</button>
        </form>
      </div>
    </section>
  );
}

export default ContactForm;
