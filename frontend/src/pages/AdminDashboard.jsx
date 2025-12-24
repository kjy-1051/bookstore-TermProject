import { useEffect, useState } from "react";
import { fetchAdminStats } from "../api/adminDashboard";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchAdminStats().then((data) => {
      setStats(data.payload);
    });
  }, []);

  if (!stats) return <p>로딩 중...</p>;

  return (
    <div style={{ padding: 24 }}>
      <h2>📊 관리자 대시보드</h2>

      <ul style={{ lineHeight: "2em" }}>
        <li>📚 전체 도서 수: {stats.books}</li>
        <li>👤 전체 사용자 수: {stats.users}</li>
        <li>💬 전체 댓글 수: {stats.comments}</li>
        <li>⭐ 전체 평점 수: {stats.ratings}</li>
      </ul>

      <hr />

      <div style={{ marginTop: 16 }}>
        <button
          onClick={() => navigate("/admin/users")}
          style={{ marginRight: 12 }}
        >
          👤 회원 관리
        </button>

        <button onClick={() => navigate("/admin")}>
          🔙 관리자 홈
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;



