import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAdminUsers } from "../api/adminUsers";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const PAGE_SIZE = 10;

  const navigate = useNavigate();

  const loadUsers = async () => {
    const data = await fetchAdminUsers(page, PAGE_SIZE);
    setUsers(data.items);
    setTotal(data.total);
  };

  useEffect(() => {
    loadUsers();
  }, [page]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div style={{ padding: 24 }}>
      <h2>🛠 관리자 - 회원 목록</h2>

      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th><th>Email</th><th>Role</th><th>Status</th><th>관리</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.status}</td>
              <td>
                <button onClick={() => navigate(`/admin/users/${u.id}`)}>
                  상세
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      {totalPages > 1 && (
        <div style={{ marginTop: 16 }}>
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ◀ 이전
          </button>

          <span style={{ margin: "0 12px" }}>
            {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            다음 ▶
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;

