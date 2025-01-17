import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../src/styles/PdfReader.css";
import { getCurrentUserId } from "../globalUser";

const PdfReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const iframeRef = useRef(null);
  const [hasMarkedAsFinished, setHasMarkedAsFinished] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`/api/bookshelf/${id}`);
        setBook(response.data);
      } catch (error) {
        console.error("Error fetching book data:", error);
      }
    };

    fetchBook();
  }, [id]);


  const adjustIframeSize = () => {
    if (iframeRef.current) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const containerHeight = viewportHeight * 0.9; // 90% of viewport height
      const containerWidth = viewportWidth * 0.9;  // 90% of viewport width

      const aspectRatio = 8.5 / 11; // US Letter aspect ratio

      if (containerWidth / containerHeight > aspectRatio) {
        iframeRef.current.style.height = `${containerHeight}px`;
        iframeRef.current.style.width = `${containerHeight * aspectRatio}px`;
      } else {
        iframeRef.current.style.width = `${containerWidth}px`;
        iframeRef.current.style.height = `${containerWidth / aspectRatio}px`;
      }
    }
  };

  useEffect(() => {
    adjustIframeSize(); // Adjust size on component mount
    window.addEventListener("resize", adjustIframeSize); // Re-adjust on window resize

    return () => window.removeEventListener("resize", adjustIframeSize); // Clean up event listener
  }, []);

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleBookDetails = () => {
    navigate(`/book/${book._id}/details`);
  };

  const handleIframeLoad = () => {
    adjustIframeSize(); // Adjust size once the iframe content is fully loaded
  };

  const handleFinishedReading = async () => {
    try {
      const response = await axios.post("/api/finished-reading", {
        bookId: id,
        userId: getCurrentUserId(), // Fetch current user ID
      });
      alert(response.data.message || "Book marked as finished!");
    } catch (err) {
      console.error("Error marking book as finished:", err);
      alert("Failed to mark book as finished. Please try again.");
    }
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pdf-reader-container">
      {/* Book Title and Author */}
      <div className="book-info">
        <h2>{book.title}</h2>
        <h3>{book.author}</h3>
      </div>

      {/* PDF Viewer */}
      <div className="iframe-container">
        <iframe
          ref={iframeRef}
          src={book.pdfLink}
          title="PDF Viewer"
          onLoad={adjustIframeSize}
        ></iframe>
      </div>

      {/* Buttons Section */}
      <div className="buttons-section">
        <button onClick={handleGoBack} className="button">
          Go Back
        </button>
        <button onClick={handleBookDetails} className="button">
          Book Details
        </button>
        <button onClick={handleFinishedReading} className="button">
          Mark Finished Reading
        </button>
      </div>
    </div>
  );
};

export default PdfReader;
