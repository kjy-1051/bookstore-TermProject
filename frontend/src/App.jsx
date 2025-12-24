// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import BookList from "./pages/BookList";
import BookDetail from "./pages/BookDetail";
import AdminBookCreate from "./pages/AdminBookCreate";
import AdminBookEdit from "./pages/AdminBookEdit";
import AdminUsers from "./pages/AdminUsers";
import AdminUserDetail from "./pages/AdminUserDetail";
import Header from "./components/Header";
import AdminHome from "./pages/AdminHome";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import Health from "./pages/Health";
import MyPage from "./pages/MyPage";


function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* ===== Public ===== */}
        <Route path="/" element={<Login />} />
        <Route path="/books" element={<BookList />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/health" element={<Health />} />
        <Route path="/me" element={<MyPage />} />

        {/* ===== Admin ===== */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminHome />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />

        {/*관리자 회원 상세 */}
        <Route
          path="/admin/users/:userId"
          element={
            <AdminRoute>
              <AdminUserDetail />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/books/new"
          element={
            <AdminRoute>
              <AdminBookCreate />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/books/:id/edit"
          element={
            <AdminRoute>
              <AdminBookEdit />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;



