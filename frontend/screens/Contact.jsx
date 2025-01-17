import React from 'react';
import '../src/styles/Contact.css';

const ContactUs = () => {
  return (
    <div className="contact-page">
      <header className="contact-header">
        <h1>Contact Me</h1>
        <p>Feel free to reach out to me if you have any querries!</p>
      </header>

      <section className="contact-team">
        <div className="contact-member">
          <img
            src='../src/assets/my-photo.jpg'
            alt="My Photo"
          />
          <h3>G.Araf Ahmed</h3>
          <p>📧 <a href="mailto:arafahmed541@gmail.com">arafahmed541@gmail.com</a></p>
          <p>🔗 <a href="https://www.linkedin.com/in/araf-ahmed-964a30252/" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
        </div>

      </section>
    </div>
  );
};

export default ContactUs;
