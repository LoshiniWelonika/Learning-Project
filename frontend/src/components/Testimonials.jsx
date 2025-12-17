import React from "react";
import "../pages/css/Home.css";

const Testimonials = () => {
  const users = [
    {
      name: "Sarah Johnson",
      role: "Journalist",
      feedback:
        "TRUTHLAB has become an essential tool in my reporting workflow. It helps me verify facts quickly and ensure my stories are accurate.",
    },
    {
      name: "Michael Chen",
      role: "Teacher",
      feedback:
        "TRUTHLAB makes it easy to verify the credibility of news articles before sharing them with students.",
    },
    {
      name: "Aisha Patel",
      role: "Social Media Manager",
      feedback:
        "It helps me quickly verify online claims, so I can share only accurate content with my audience.",
    },
  ];

  return (
    <section className="testimonials">
      <h2>What Our Users Say</h2>
      <p>Hear from people who use TRUTHLAB to verify information.</p>

      <div className="testimonial-cards">
        {users.map((user, index) => (
          <div key={index} className="t-card">
            <div className="avatar-circle">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="name-role">
            <h4>{user.name}</h4>
            <p className="role">{user.role}</p>
            <p className="feedback">“{user.feedback}”</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
