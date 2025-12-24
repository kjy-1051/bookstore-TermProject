// src/pages/AdminUserDetail.js
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchAdminUserDetail,
  fetchUserComments,
  fetchUserRatings,
  updateUserStatus,
  updateUserRole,
} from "../api/adminUsers";

function AdminUserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState([]);

  const load = async () => {
    const userData = await fetchAdminUserDetail(userId);
    const commentData = await fetchUserComments(userId);
    const ratingData = await fetchUserRatings(userId);

    setUser(userData);

    setComments(
      Array.isArray(commentData) ? commentData : commentData.items ?? []
    );

    setRatings(
      Array.isArray(ratingData) ? ratingData : ratingData.items ?? []
    );
  };


  useEffect(() => {
    load();
  }, [userId]);

  if (!user) return <p>로딩 중...</p>;

  return (
    <div style={{ padding: 24 }}>
      <h2>👤 관리자 - 회원 상세</h2>

      <p><b>ID:</b> {user.id}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Role:</b> {user.role}</p>
      <p><b>Status:</b> {user.status}</p>

      <div style={{ marginTop: 12 }}>
        <button onClick={async () => {
          await updateUserStatus(userId, "ACTIVE");
          await load();
        }}>
          활성화
        </button>

        <button onClick={async () => {
          await updateUserStatus(userId, "INACTIVE");
          await load();
        }}>
          비활성화
        </button>

        <button onClick={async () => {
          await updateUserRole(userId, "ADMIN");
          await load();
        }} style={{ marginLeft: 8 }}>
          ADMIN 지정
        </button>
      </div>

      <hr style={{ margin: "24px 0" }} />

      <h3>📝 댓글</h3>
      {comments.length === 0 ? (
        <p>댓글 없음</p>
      ) : (
        <ul>
          {comments.map((c) => (
            <li key={c.id}>{c.content}</li>
          ))}
        </ul>
      )}

      <h3>⭐ 평점</h3>
      {ratings.length === 0 ? (
        <p>평점 없음</p>
      ) : (
        <ul>
          {ratings.map((r) => (
            <li key={r.id}>
              Book #{r.book_id} – {r.score}점
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => navigate(-1)} style={{ marginTop: 16 }}>
        ← 목록으로
      </button>
    </div>
  );
}

export default AdminUserDetail;
