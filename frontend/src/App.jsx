import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import AllBooks from "../screens/AllBooks.jsx";
import HomePage from "../screens/HomePage.jsx";
import PdfReader from '../screens/PdfReader.jsx';
import BookDetails from "../screens/BookDetails.jsx";
import RegisterScreen from "../screens/RegisterScreen.jsx";
import LoginScreen from "../screens/LoginScreen.jsx";
import UserDashboard from "../screens/UserDashboard.jsx";
import FilterBooks from "../screens/FilterBooks.jsx";
import BookList from "../screens/admin/BookList.jsx"
import UserList from "../screens/admin/UserList.jsx";
import BorrowingScreen from "../screens/BorrowingScreen.jsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "./slices/authSlice.js";
import AdminBorrowRequests from "../screens/admin/AdminBorrowRequest.jsx";
import UserReturnBook from "../screens/UserReturnBook.jsx";
import AdminApproveReturns from "../screens/admin/AdminApproveReturns.jsx";
import UserWishlistAndFinishRead from "../screens/UserWishlistAndFinishRead.jsx";
import Contract from "../screens/Contact.jsx";
import AboutPage from "../screens/About.jsx";
import BorrowList from "../screens/admin/BorrowList.jsx";


const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const expirationTime = localStorage.getItem('expirationTime');
    if (expirationTime) {
      const currentTime = new Date().getTime();

      if (currentTime > expirationTime) {
        dispatch(logout());
      }
    }
  }, [dispatch]);


  return (
    <Router>
      <div className="App">
        <Header />
        {/* <SearchBar /> */}

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/book/:id" element={<PdfReader />} />
          <Route path="/allbooks" element={<AllBooks />} />
          <Route path="/book/:id/details" element={<BookDetails />} />
          <Route path="/login" element={<LoginScreen/>} />
          <Route path='/register' element={<RegisterScreen />} />
          <Route path='/filterBooks' element={<FilterBooks />} />
          <Route path='/admin/bookList' element={<BookList />} />
          <Route path='/admin/userList' element={<UserList />} />
          <Route path='/admin/borrowRequest' element={<AdminBorrowRequests />} />
          <Route path='/profile' element={<UserDashboard />} />
          <Route path="/history" element={<BorrowingScreen />} />
          <Route path="/returnBook" element={<UserReturnBook />} />
          <Route path="/admin/approveReturn" element={<AdminApproveReturns />} />
          <Route path="/wishlist-finishRead" element={<UserWishlistAndFinishRead />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/admin/borrowList" element={<BorrowList />} />
          <Route path="/contract" element={<Contract />} />
        </Routes>


        <Footer />
      </div>
    </Router>
  );
};

export default App;
