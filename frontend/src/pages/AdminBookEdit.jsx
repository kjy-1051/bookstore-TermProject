import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchBookDetail } from "../api/books";
import { updateBook } from "../api/adminBooks";

function AdminBookEdit() {
  const { id } = useParams();
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

  useEffect(() => {
    fetchBookDetail(id).then((book) => {
      setForm({
        isbn: book.isbn,
        title: book.title,
        price: book.price,
        publisher: book.publisher,
        summary: book.summary,
        publicationDate: book.publicationDate,
        authors: book.authors.join(", "),
        categories: book.categories.join(", "),
      });
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await updateBook(id, {
        isbn: form.isbn,
        title: form.title,
        price: Number(form.price),
        publisher: form.publisher,
        summary: form.summary,
        publicationDate: form.publicationDate,
        authors: form.authors.split(",").map(s => s.trim()),
        categories: form.categories.split(",").map(s => s.trim()),
      });

      alert("도서 수정 완료");
      navigate(`/books/${id}`);
    } catch (e) {
      console.error(e.response?.data);
      alert("도서 수정 실패");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>📘 관리자 도서 수정</h2>

      <input name="isbn" value={form.isbn} onChange={handleChange} />
      <input name="title" value={form.title} onChange={handleChange} />
      <input name="price" type="number" value={form.price} onChange={handleChange} />
      <input name="publisher" value={form.publisher} onChange={handleChange} />
      <input name="publicationDate" type="date" value={form.publicationDate} onChange={handleChange} />

      <textarea name="summary" value={form.summary} onChange={handleChange} />

      <input name="authors" value={form.authors} onChange={handleChange} />
      <input name="categories" value={form.categories} onChange={handleChange} />

      <button onClick={handleSubmit}>수정 저장</button>
    </div>
  );
}

export default AdminBookEdit;
