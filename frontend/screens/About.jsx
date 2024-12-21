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
          <img src="https://media.makeameme.org/created/no-text-is-596883.jpg" alt="About Us" />
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
            <img src="https://scontent.fdac138-2.fna.fbcdn.net/v/t39.30808-1/334288449_532942038978859_264772094911593132_n.jpg?stp=c61.0.1885.1884a_dst-jpg_s200x200_tt6&_nc_cat=102&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeGFSznovQCMeYwU16uqKtkwiXsXvKQiPLSJexe8pCI8tCgYw7pX-nHugyCARQjnUTs9iKjI6V2QJRWZle73ILeQ&_nc_ohc=OxbvAiITCkUQ7kNvgEniQTj&_nc_zt=24&_nc_ht=scontent.fdac138-2.fna&_nc_gid=AexI3oIh__VQEhf9kXoQXnx&oh=00_AYC-BVr06bpo1kj4a6vUK0PWrhNmb8WKwE9q6gauo6cdZA&oe=676B25C2" alt="G.Araf Ahmed" />
            <h3>G.Araf Ahmed</h3>
            <p>Student ID: 22101532</p>
          </div>
          <div className="team-member">
            <img src="https://scontent.fdac138-2.fna.fbcdn.net/v/t39.30808-6/466359554_1097832878800076_4928405843025380823_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeG28i66os5hn0qR2QnO2994eA7dEUQ9fWp4Dt0RRD19atHD0aTrjQiyKuejJdG_uvUYfpapuoJoLG6JXQLyVbiT&_nc_ohc=Zujo9OsoGqMQ7kNvgG_oqqt&_nc_zt=23&_nc_ht=scontent.fdac138-2.fna&_nc_gid=AdCZ0YRRMsHO8Kzv-p1Jo6T&oh=00_AYCx6Ic7VXMLDm_DQAd-2OxkhVTFAMThPubaxRasASnKDw&oe=676B0F68" alt="Fahim Foysal Abir" />
            <h3>Fahim Foysal Abir</h3>
            <p>Student ID: 22101543</p>
          </div>
          <div className="team-member">
            <img src="https://scontent.fdac138-2.fna.fbcdn.net/v/t39.30808-1/448471589_1544579986468166_1969027409123432063_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=105&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeFCVVLg0SIKJJvns-e-P8WIxIi_uglciwbEiL-6CVyLBt0folaI_704yjSQIwF_nWAIJZtK_p5fYcvHdzeDTT4M&_nc_ohc=bB2DjBgJx7kQ7kNvgEoYU9r&_nc_zt=24&_nc_ht=scontent.fdac138-2.fna&_nc_gid=AhY-xJgX8qUwquvNdYRNnT-&oh=00_AYBGDet126bRc9qgld17tgLYRJgHXcvU6RYFgdX-TJSBaQ&oe=676B1C8A" alt="Md. Shihab Sarker" />
            <h3>Md. Shihab Sarker</h3>
            <p>Student ID: 22101516</p>
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
