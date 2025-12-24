import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchBookDetail } from "../api/books";
import {
  fetchRatingSummary,
  createRating,
  updateRating,
  deleteRating,
} from "../api/ratings";
import CommentSection from "../components/CommentSection";
import { deleteBook } from "../api/adminBooks";

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [ratingSummary, setRatingSummary] = useState(null);
  const [score, setScore] = useState(5);

  const isLoggedIn = !!localStorage.getItem("access_token");

  useEffect(() => {
    fetchBookDetail(id).then(setBook);
    fetchRatingSummary(id).then(setRatingSummary);
  }, [id]);

  const reloadSummary = () =>
    fetchRatingSummary(id).then(setRatingSummary);

  const handleSubmitRating = async () => {
  try {
    // 1️⃣ 먼저 신규 등록 시도
    await createRating(id, score);
    alert("평점 등록 완료");
  } catch {
    try {
      // 2️⃣ 이미 있으면 수정 시도
      await updateRating(id, score);
      alert("평점 수정 완료");
    } catch {
      alert("평점 처리 실패 (권한 없음)");
    }
  } finally {
    reloadSummary();
  }
  };


  const handleDelete = async () => {
    try {
      await deleteRating(id);
      alert("평점 삭제 완료");
      reloadSummary();
    } catch {
      alert("평점 삭제 실패");
    }
  };

 const isAdmin = localStorage.getItem("role") === "ADMIN";

if (!book) return <p>로딩 중...</p>;

return (
  <div style={{ padding: 24 }}>
    <button onClick={() => navigate("/books")}>← 목록으로</button>


    <h2>{book.title}</h2>

      <p><b>ISBN:</b> {book.isbn}</p>

      <p><b>저자:</b> {book.authors.join(", ")}</p>

      <p><b>출판일:</b> {book.publicationDate}</p>

      <p><b>출판사:</b> {book.publisher}</p>

      <p><b>가격:</b> {book.price.toLocaleString()}원</p>

    <hr />

    {ratingSummary && ratingSummary.reviewCount > 0 && (
      <p>
        ⭐ 평균 평점 {ratingSummary.averageRating} ({ratingSummary.reviewCount}명)
      </p>
    )}


    <hr />

    {/* ===== 평점 ===== */}
    {isLoggedIn && (
      <div>
        <select
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>

        <button onClick={handleSubmitRating}>
          평점 등록 / 수정
        </button>
        <button onClick={handleDelete}>평점 삭제</button>
      </div>
    )}

    <hr />

    <p>{book.summary}</p>

    <hr />

    {/* ===== 댓글 ===== */}
    <CommentSection bookId={id} />

    <hr />

    {/* ===== ADMIN 도서 관리 ===== */}
    {isAdmin && (
      <div
        style={{
          marginTop: 16,
          padding: 12,
          border: "1px solid #ddd",
          background: "#fafafa",
        }}
      >
        <h4>🛠 관리자 도서 관리</h4>

        <button
          onClick={() => navigate(`/admin/books/${id}/edit`)}
          style={{ marginRight: 8 }}
        >
          도서 수정
        </button>

        <button
          onClick={async () => {
            if (!window.confirm("도서를 삭제할까요?")) return;
            await deleteBook(id);
            alert("도서 삭제 완료");
            navigate("/books");
          }}
          style={{ color: "red" }}
        >
          도서 삭제
        </button>
      </div>
    )}
  </div>
);
}

export default BookDetail;
