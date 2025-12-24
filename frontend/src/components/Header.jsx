import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const isAdmin = role === "ADMIN";
  const isLoggedIn = !!localStorage.getItem("access_token");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={{
      padding: 12,
      borderBottom: "1px solid #ddd",
      display: "flex",
      gap: 12,
      alignItems: "center"
    }}>
      <Link to="/books"><b>📚 Bookstore</b></Link>

      <Link to="/books">도서목록</Link>
      <Link to="/health">헬스체크</Link>

      {/*마이페이지 */}
      {isLoggedIn && (
        <Link to="/me">마이페이지</Link>
      )}

      {/* 관리자 */}
      {isAdmin && (
        <Link to="/admin/">관리자</Link>
      )}

      <div style={{ marginLeft: "auto" }}>
        {isLoggedIn ? (
          <button onClick={handleLogout}>로그아웃</button>
        ) : (
          <Link to="/">로그인</Link>
        )}
      </div>
    </div>
  );
}

export default Header;

