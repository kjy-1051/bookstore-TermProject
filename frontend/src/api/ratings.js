import api from "./axios";

export const fetchRatingSummary = (bookId) =>
  api.get(`/ratings/summary/${bookId}`)
     .then(res => res.data);

export const createRating = (bookId, score) =>
  api.post(`/ratings/${bookId}`, { score });

export const updateRating = (bookId, score) =>
  api.patch(`/ratings/${bookId}`, { score });

export const deleteRating = (bookId) =>
  api.delete(`/ratings/${bookId}`);
