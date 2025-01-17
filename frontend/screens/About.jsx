import React from 'react';
import '../src/styles/About.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <header className="about-header">
        <h1>About Us</h1>
        <p>Learn more about our team and mission</p>
      </header>

      <section className="about-section">
        <div className="about-image">
          <img src="https://pics.craiyon.com/2023-11-07/331bc7aee1b84bff94c978a5dda6391b.webp" alt="About Us" />
        </div>
        <div className="about-info">
          <h2>Our Mission</h2>
          <p>
            We aim to revolutionize the way people connect with books, creating a platform that allows users to easily manage and discover their favorite literature. Our goal is to provide a seamless, user-friendly experience while helping people grow their reading journey.
          </p>
        </div>
      </section>

      <section className="team-section">
        <h2>Meet the Team</h2>
        <div className="team-members">
          <div className="team-member">
            <img src="../src/assets/my-photo.jpg" alt="G.Araf Ahmed" />
            <h3>G.Araf Ahmed</h3>
            <p>CSE Undergraduate at Brac University</p>
          </div>
          
        </div>
      </section>

      <footer className="about-footer">
        <p>&copy; 2024 Your Company Name. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default AboutPage;
