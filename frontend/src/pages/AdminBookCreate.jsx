import { useState } from "react";
import { createBook } from "../api/adminBooks";
import { useNavigate } from "react-router-dom";

function AdminBookCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    isbn: "",
    title: "",
    price: 0,
    publisher: "",
    summary: "",
    publicationDate: "",
    authors: "",
    categories: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await createBook({
        isbn: form.isbn,
        title: form.title,
        price: Number(form.price),
        publisher: form.publisher,
        summary: form.summary,
        publicationDate: form.publicationDate,
        authors: form.authors.split(",").map(s => s.trim()),
        categories: form.categories.split(",").map(s => s.trim()),
      });

      alert("도서 등록 완료");
      navigate("/books");
    } catch (e) {
      console.error(e.response?.data);
      alert("도서 등록 실패");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>📘 관리자 도서 등록</h2>

      <input name="isbn" placeholder="ISBN" onChange={handleChange} />
      <input name="title" placeholder="제목" onChange={handleChange} />
      <input name="price" type="number" placeholder="가격" onChange={handleChange} />
      <input name="publisher" placeholder="출판사" onChange={handleChange} />
      <input name="publicationDate" type="date" onChange={handleChange} />

      <textarea
        name="summary"
        placeholder="요약"
        onChange={handleChange}
      />

      <input
        name="authors"
        placeholder="저자 (쉼표로 구분)"
        onChange={handleChange}
      />

      <input
        name="categories"
        placeholder="카테고리 (쉼표로 구분)"
        onChange={handleChange}
      />

      <button onClick={handleSubmit}>등록</button>
    </div>
  );
}

export default AdminBookCreate;


