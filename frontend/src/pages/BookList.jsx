import { useEffect, useState } from "react";
import {
  fetchBooks,
  searchBooks,
  fetchLatestBooks,
  fetchPopularBooksByRatings,
  fetchPopularBooksByComments,
  fetchRandomBook,
  fetchBooksByPrice,   // ✅ 추가
} from "../api/books";
import "./BookList.css";
import { useNavigate } from "react-router-dom";

function BookList() {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [mode, setMode] = useState("normal");
  // normal | latest | ratings | comments | random | price

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // ✅ 가격 필터 상태
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const isAdmin = localStorage.getItem("role") === "ADMIN";

  /* =========================
     일반 목록 / 검색
  ========================= */
  useEffect(() => {
    if (mode !== "normal") return;

    const load = async () => {
      const data = isSearching
        ? await searchBooks({ keyword, category, page, size: 9 })
        : await fetchBooks(page, 9);

      setBooks(data.content ?? []);
      setTotalPages(data.totalPages ?? 1);
    };

    load();
  }, [mode, page, isSearching, keyword, category]);

  /* =========================
     가격 필터 페이지 이동
  ========================= */
  useEffect(() => {
    if (mode !== "price") return;

    const load = async () => {
      const data = await fetchBooksByPrice({
        minPrice: minPrice || null,
        maxPrice: maxPrice || null,
        page,
        size: 9,
      });

      setBooks(data.content ?? []);
      setTotalPages(data.totalPages ?? 1);
    };

    load();
  }, [mode, page]);

  /* =========================
     버튼 핸들러
  ========================= */
  const resetToNormal = () => {
    setMode("normal");
    setPage(1);
  };

  const handleLatest = async () => {
    setMode("latest");
    setBooks(await fetchLatestBooks());
  };

  const handleRatings = async () => {
    setMode("ratings");
    setBooks(await fetchPopularBooksByRatings());
  };

  const handleComments = async () => {
    setMode("comments");
    setBooks(await fetchPopularBooksByComments());
  };

  const handleRandom = async () => {
    setMode("random");
    setBooks(await fetchRandomBook()); // 배열
  };

  const handlePriceFilter = async () => {
    setMode("price");
    setPage(1);

    const data = await fetchBooksByPrice({
      minPrice: minPrice || null,
      maxPrice: maxPrice || null,
      page: 1,
      size: 9,
    });

    setBooks(data.content ?? []);
    setTotalPages(data.totalPages ?? 1);
  };

  /* =========================
     렌더
  ========================= */
  return (
    <div className="book-list-container">
      {/* 🔍 검색 */}
      <div style={{ marginBottom: 16 }}>
        <input
          placeholder="검색어"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input
          placeholder="카테고리"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button
          onClick={() => {
            setIsSearching(true);
            setPage(1);
            setMode("normal");
          }}
        >
          🔍 검색
        </button>

        {isSearching && (
          <button
            onClick={() => {
              setKeyword("");
              setCategory("");
              setIsSearching(false);
              resetToNormal();
            }}
          >
            ❌ 초기화
          </button>
        )}
      </div>

      {/* 💰 가격 필터 */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="number"
          placeholder="최소 가격"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="최대 가격"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <button onClick={handlePriceFilter}>💰 가격 필터</button>
      </div>

      {/* 정렬 버튼 */}
      <div style={{ marginBottom: 16 }}>
        <button onClick={resetToNormal}>전체</button>
        <button onClick={handleLatest}>최신</button>
        <button onClick={handleRatings}>평점 TOP</button>
        <button onClick={handleComments}>댓글 TOP</button>
        <button onClick={handleRandom}>랜덤</button>
      </div>

      <h2>📚 도서 목록</h2>

      {isAdmin && (
        <button onClick={() => navigate("/admin/books/new")}>
          ➕ 도서 등록 (ADMIN)
        </button>
      )}

      {books.length === 0 ? (
        <p>도서가 없습니다.</p>
      ) : (
        <div className="book-grid">
          {books.map((b) => (
            <div
              key={b.id ?? b.book_id}
              className="book-card"
              onClick={() => navigate(`/books/${b.id ?? b.book_id}`)}
            >
              <h3>{b.title}</h3>

              {(mode === "normal" ||
                mode === "latest" ||
                mode === "random" ||
                mode === "price") && (
                <>
                  <p>저자: {b.authors?.join(", ") ?? "정보 없음"}</p>
                  <p>가격: {b.price?.toLocaleString() ?? "-"}</p>
                </>
              )}

              {mode === "ratings" && (
                <p>⭐ 평균 {b.avg_score}점 ({b.rating_count}명)</p>
              )}

              {mode === "comments" && (
                <p>💬 댓글 {b.comment_count}개</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {(mode === "normal" || mode === "price") && (
        <div style={{ marginTop: 24 }}>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            ◀ 이전
          </button>
          <span>{page} / {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            다음 ▶
          </button>
        </div>
      )}
    </div>
  );
}

export default BookList;


