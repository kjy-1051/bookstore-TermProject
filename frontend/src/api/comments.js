import api from "./axios";

// 도서별 댓글 목록
export const fetchCommentsByBook = (bookId) =>
  api.get(`/comments/book/${bookId}`).then(res => res.data);

// 댓글 작성
export const createComment = (bookId, content) =>
  api.post("/comments/", {
    book_id: bookId,
    content,
  });

// 댓글 수정
export const updateComment = (commentId, content) =>
  api.patch(`/comments/${commentId}`, {
    content,
  });

// 댓글 삭제
export const deleteComment = (commentId) =>
  api.delete(`/comments/${commentId}`);
