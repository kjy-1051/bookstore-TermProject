import api from "./axios";

// 관리자 유저 목록
export const fetchAdminUsers = (page = 1, size = 10) =>
  api.get("/admin/users", { params: { page, size } })
     .then((res) => res.data);

// 관리자 유저 상세
export const fetchAdminUserDetail = (userId) =>
  api.get(`/admin/users/${userId}`).then((res) => res.data);

// 🔥 유저 상태 변경 (QUERY PARAMS)
export const updateUserStatus = (userId, status) =>
  api.patch(
    `/admin/users/${userId}/status`,
    null,                    // body 없음
    { params: { status } }   // ← 여기 핵심
  );

// 🔥 유저 권한 변경 (QUERY PARAMS)
export const updateUserRole = (userId, role) =>
  api.patch(
    `/admin/users/${userId}/role`,
    null,                   // body 없음
    { params: { role } }    // ← 여기 핵심
  );

// 유저 댓글 조회
export const fetchUserComments = (userId) =>
  api.get(`/admin/users/${userId}/comments`)
     .then((res) => res.data);

// 유저 평점 조회
export const fetchUserRatings = (userId) =>
  api.get(`/admin/users/${userId}/ratings`)
     .then((res) => res.data);
