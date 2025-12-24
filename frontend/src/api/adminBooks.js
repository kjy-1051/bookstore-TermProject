import api from "./axios";

// 관리자 도서 등록
export const createBook = (data) =>
  api.post("/admin/books/", data);

// 관리자 도서 수정
export const updateBook = (bookId, data) =>
  api.patch(`/admin/books/${bookId}`, data);

// 관리자 도서 삭제
export const deleteBook = (bookId) =>
  api.delete(`/admin/books/${bookId}`);
