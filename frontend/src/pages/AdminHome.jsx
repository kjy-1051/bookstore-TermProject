import { useNavigate } from "react-router-dom";

function AdminHome() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 24 }}>
      <h2>🛠 관리자 페이지</h2>

      <div style={{ marginTop: 24 }}>
        <button
          onClick={() => navigate("/admin/dashboard")}
          style={{ marginRight: 12 }}
        >
          📊 대시보드
        </button>

        <button
          onClick={() => navigate("/admin/users")}
        >
          👤 회원 관리
        </button>
      </div>
    </div>
  );
}

export default AdminHome;

