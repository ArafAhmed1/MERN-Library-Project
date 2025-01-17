import Book from './models/Book.js';
import BorrowRequest from './models/BorrowRequest.js';
import ReturnRequest from './models/ReturnRequest.js';
import User from './models/User.js';
import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import path from 'path';
// import bookRoutes from './routes/bookRoutes.js';
import cors from 'cors';
// import books from './books.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js'
import borrowRequestRoutes from "./routes/borrowRequestRoutes.js";
import borrowRoutes from "./routes/borrowRoutes.js";
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
dotenv.config();
const app = express();

app.use(express.json());

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  credentials: true, // Allow sending cookies if needed
}));


const port = process.env.PORT || 5000;
connectDB();


app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

app.use("/api/borrowRequests", borrowRequestRoutes);


app.get('/api', async (req, res) => {
  try {
    const HomePageBooks = await Book.aggregate([
      { $sample: { size: 6 } }, // Select 6 random books
      { $project: { title: 1, coverImageLink: 1, _id: 1 } } // Include only title, coverImageLink, and _id
    ]);

    res.json(HomePageBooks); // Send the filtered books as a JSON response
  } catch (error) {
    console.error('Error fetching homepage books:', error);
    res.status(500).json({ message: 'Error fetching homepage books' });
  }
});



app.get('/api/bookshelf', async (req, res) => {
  try {
    // const books = await Book.find({}, 'title coverImageLink'); // Fetch only specific fields
    const books = await Book.find();
    res.json(books); // Send the selected fields as the response
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Error fetching books' });
  }
});


app.get('/api/bookshelf/:id', async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId, 'title author pdfLink'); // Select specific fields

    if (!book) {
      return res.status(404).send({ message: "Book not found" });
    }
    
    res.json(book); // Send the book data as a response
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).send({ message: "Server error", error: error.message });
  }
});


app.get('/api/bookshelf/:id/details', async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId, 'title author genre publishedYear description pdfLink coverImageLink'); // Select specific fields

    if (!book) {
      return res.status(404).send({ message: "Book not found" });
    }
    
    res.json(book); // Send the book data as a response
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).send({ message: "Server error", error: error.message });
  }
});



app.get('/api/books/filter', async (req, res) => {
  try {
      const { author, genre } = req.query;
      const filter = {};

      if (author) {
          filter.author = new RegExp(author, 'i'); // Case-insensitive match
      }

      if (genre) {
          filter.genre = genre;
      }

      const books = await Book.find(filter);
      res.status(200).json(books);
  } catch (error) {
      res.status(500).json({ message: 'Error filtering books', error });
  }
});


app.get('/api/books/dropdown-options', async (req, res) => {
  try {
      const authors = await Book.distinct('author'); // Get unique authors
      const genres = await Book.distinct('genre');   // Get unique genres

      res.status(200).json({ authors, genres });
  } catch (error) {
      res.status(500).json({ message: 'Error fetching dropdown options', error });
  }
});


app.post("/api/borrow", async (req, res) => {
  const { bookId, userId } = req.body;

  try {
    if (!bookId || !userId) {
      return res.status(400).json({ message: "Missing bookId or userId" });
    }
    const borrowRecord = await BorrowRequest.findOne({ bookId, userId });
    if (borrowRecord){
      return res.status(403).json({ message: "User is banned and cannot borrow books." });
    }
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the user is banned
    if (user.isBanned) {
      return res.status(403).json({ message: "User is banned and cannot borrow books." });
    }

    // Create a new borrow request
    const borrowRequest = new BorrowRequest({
      bookId,
      userId,
      approved: false,
      rejected: false,
      requestDate: new Date(),
    });

    await borrowRequest.save(); // Save the request to the database

    res.status(201).json({ message: "Borrow request created successfully", borrowRequest });
  } catch (error) {
    console.error("Error creating borrow request:", error);
    res.status(500).json({ message: "Failed to create borrow request." });
  }
});


app.get('/api/borrow/:bookId/status', async (req, res) => {
  const { bookId } = req.params;
  const { userId } = req.query;
  
  const borrowRecord = await Borrow.findOne({ bookId, userId });
  if (borrowRecord) {
    res.json({ isBorrowed: true });
  } else {
    res.json({ isBorrowed: false });
  }
});

app.delete('/api/borrow/:bookId', async (req, res) => {
  const { bookId } = req.params;
  const { userId } = req.body;
  
  try {
    await Borrow.deleteOne({ bookId, userId });
    res.json({ message: "Borrow request canceled successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel borrow request." });
  }
});

//Dashboard routes
// Get user profile by ID
app.get('/api/users/profile/:id', async (req, res) => {
  const { id } = req.params; // Extract ID from route parameters
  try {
    const user = await User.findById(id); // Fetch user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Return relevant user information
    res.json({
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isBanned: user.isBanned,
      borrowedBooks: user.borrowedBooks,
      wishlist: user.wishlist,
      finishedBooks: user.finishedBooks,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Update user profile
// Update user profile by ID
app.put('/api/users/profile/:id', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    
    // Hash password if it's being updated
    // if (password) {
    //   const salt = await bcrypt.genSalt(10);
    //   user.password = await bcrypt.hash(password, salt);
    // }
    
    const updatedUser = await user.save();
    res.status(200).json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      isGodAdmin: updatedUser.isGodAdmin,
      isBanned: updatedUser.isBanned,
      createdAt: updatedUser.createdAt,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

//change password
app.put('/api/users/change-password/:userId', async (req, res) => {
  const { userId } = req.params;
  const { currentPassword, newPassword, confirmPassword } = req.body;
  
  try {
    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword; // The 'pre-save' hook will handle hashing
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

//Dashboard routes end


//borrow history
app.use("/api/borrow", borrowRoutes);


//overdue book notification
app.get('/api/users/overdueBooks/:id', async (req, res) => {
  const userId = req.params.id; // Fetch the user ID from the route parameter
  // console.log('User ID from params:', userId);
  
  try {
    // Find the user by ID and populate borrowed books
    const user = await User.findById(userId).populate('borrowedBooks.bookId');
    // console.log('Fetched User:', user); // Debugging log for fetched user

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter for overdue books
    const currentDate = new Date();
    const overdueBooks = user.borrowedBooks.filter((borrowedBook) => {
      // console.log('Borrowed Book:', borrowedBook); // Log each borrowed book
      if (!borrowedBook.dueDate) {
        console.log('No due date for this book, skipping...');
        return false; // Skip if dueDate is not set
      }

      const dueDate = new Date(borrowedBook.dueDate);
      const isOverdue = dueDate < currentDate && !borrowedBook.isReturned;
      // console.log(`Book ${borrowedBook.bookId}: Due Date: ${dueDate}, Is Overdue: ${isOverdue}`);
      return isOverdue;
    });

    // console.log('Overdue Books:', overdueBooks); // Debugging log for overdue books
    res.json({ overdueBooks });
  } catch (error) {
    console.error('Error in /api/users/overdueBooks/:id:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Return book apis
//get user borrowed books
app.get('/api/borrowed-books/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('borrowedBooks.bookId', 'title author coverImageLink');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user.borrowedBooks);
  } catch (err) {
    res.status(500).send('Failed to fetch borrowed books');
  }
});

// Submit return request
app.post("/api/return-request", async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    
    if (!userId || !bookId) {
      return res.status(400).json({ message: "User ID and Book ID are required." });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the book is already in return request for the user
    const borrowedBook = user.borrowedBooks.find((book) => book.bookId.toString() === bookId.toString());
    if (!borrowedBook) {
      return res.status(404).json({ message: "This book is not borrowed by the user." });
    }

    // Create a new return request
    const returnRequest = new ReturnRequest({
      userId,
      bookId,
    });
    await returnRequest.save();

    res.status(200).json({ message: "Return request submitted successfully!" });
  } catch (error) {
    console.error("Error in return-request endpoint:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});




//get all return request
// Get all return requests
app.get('/api/return-requests', async (req, res) => {
  try {
    const requests = await ReturnRequest.find()
      .populate('userId', 'name')
      .populate('bookId', 'title author coverImageLink');
      
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching return requests:', error);
    res.status(500).json({ message: "Failed to fetch return requests." });
  }
});



// Approve return request
app.put('/api/return-requests/:id/approve', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Step 1: Find the return request
    const returnRequest = await ReturnRequest.findById(id);
    if (!returnRequest) {
      return res.status(404).json({ message: 'Return request not found' });
    }

    // Step 2: Find the user who made the request
    const user = await User.findById(returnRequest.userId).populate('borrowedBooks.bookId');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Step 3: Find the specific borrowed book in the user's borrowedBooks array
    const borrowedBookIndex = user.borrowedBooks.findIndex(
      (book) => book.bookId._id.toString() === returnRequest.bookId.toString()
    );

    if (borrowedBookIndex === -1) {
      return res.status(404).json({ message: 'Book not found in user\'s borrowed books' });
    }

    // Step 4: Remove the book from the user's borrowedBooks
    user.borrowedBooks.splice(borrowedBookIndex, 1);
    await user.save();

    // Step 5: Remove the return request from the ReturnRequest collection
    await ReturnRequest.findByIdAndDelete(id);
    
    // Step 6: Optional: Update the book's available copies count if you have this field
    const book = await Book.findById(returnRequest.bookId);
    if (book) {
      book.availableCopies += 1; // Assuming a field 'availableCopies' exists in the Book model
      await book.save();
    }

    res.status(200).json({ message: 'Return request approved and book removed from borrowed list' });
  } catch (error) {
    console.error('Error handling return approval:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// Reject return request
app.delete('/api/return-requests/:id/reject', async (req, res) => {
  const { id } = req.params;

  try {
    const request = await ReturnRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Return request not found." });
    }

    // Use deleteOne() instead of remove()
    await request.deleteOne();
    res.status(200).json({ message: "Return request rejected." });
  } catch (error) {
    console.error('Error rejecting return request:', error);
    res.status(500).json({ message: "Failed to reject return request." });
  }
});


// Get all borrowed books with user and book details
app.get('/api/borrowedBooks/all', async (req, res) => {
  try {
    const users = await User.find({ 'borrowedBooks.0': { $exists: true } })
      .populate('borrowedBooks.bookId', 'title') // Populate book title
      .select('name email borrowedBooks'); // Select necessary fields

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


//wishlist and finished reading routes
//add to wishlist
app.post("/api/wishlist", async (req, res) => {
  const { bookId, userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.wishlist.includes(bookId)) {
      return res.status(400).json({ message: "Book already in wishlist" });
    }

    user.wishlist.push(bookId);
    await user.save();
    
    res.status(200).json({ message: "Book added to wishlist" });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Mark a book as finished reading
// Mark a book as finished reading
app.post('/api/finished-reading', async (req, res) => {
  const { bookId, userId } = req.body;

  if (!bookId || !userId) {
    return res.status(400).json({ error: 'Missing bookId or userId' });
  }

  try {
    const user = await User.findById(userId);
    const book = await Book.findById(bookId);
    
    if (!user || !book) {
      return res.status(404).json({ error: 'User or book not found' });
    }
    
    // Create a finished book object
    const finishedBook = {
      bookId: book._id,
      finishedAt: new Date(),
    };

    // Check if the book already exists in the finishedBooks array
    const isBookAlreadyFinished = user.finishedBooks.some((item) => item.bookId.toString() === bookId);
    if (isBookAlreadyFinished) {
      return res.status(400).json({ error: 'Book already in finished reading list' });
    }

    // Add the book to the user's finishedBooks array
    user.finishedBooks.push(finishedBook);

    // Remove the book from the user's wishlist
    user.wishlist = user.wishlist.filter((item) => item.toString() !== bookId);

    await user.save();
    
    // Respond with the updated finishedBooks array
    res.status(201).json(user.finishedBooks);
  } catch (error) {
    console.error('Error saving finished book:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//fetch user wishlist and finish reading book
app.get("/api/users/:userId/books", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId)
      .populate("wishlist")
      .populate("finishedBooks.bookId"); // Populate bookId inside finishedBooks
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      wishlist: user.wishlist,
      finishedBooks: user.finishedBooks,
    });
  } catch (error) {
    console.error("Error fetching user books:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// remove from wishlist
app.post("/api/wishlist/remove", async (req, res) => {
  const { bookId, userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Remove the bookId from wishlist
    const updatedWishlist = user.wishlist.filter((id) => id.toString() !== bookId);
    
    // Update the wishlist field in the database
    user.wishlist = updatedWishlist;
    await user.save();
    
    res.status(200).json({ message: "Book removed from wishlist" });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// remove from finished reading
app.post("/api/finished-reading/remove", async (req, res) => {
  const { bookId, userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    // Filter out the bookId from finishedBooks
    const updatedFinishedBooks = user.finishedBooks.filter((book) => book.bookId.toString() !== bookId);
    
    // Update the finishedBooks field in the database
    user.finishedBooks = updatedFinishedBooks;
    await user.save();
    
    res.status(200).json({ message: "Book removed from finished reading" });
  } catch (error) {
    console.error("Error removing from finished reading:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// app.post("/api/finished-reading-timer", async (req, res) => {
//   const { bookId, userId } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Check if the book is already marked as finished
//     const alreadyFinished = user.finishedBooks.some(
//       (entry) => entry.bookId.toString() === bookId
//     );

//     if (!alreadyFinished) {
//       user.finishedBooks.push({ bookId });
//       await user.save();
//     }

//     res.json({ message: "Book marked as finished!" });
//   } catch (error) {
//     console.error("Error marking book as finished:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });


const __dirname = path.resolve();

// Serve static files from frontend/dist in production
if (process.env.NODE_ENV === 'production') {
  // Static folder
  app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

  // Serve the index.html file for all other routes
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}


app.use(notFound);
app.use(errorHandler);


app.listen(port, () => console.log(`Server running on port ${port}`));
