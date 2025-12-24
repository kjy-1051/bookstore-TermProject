import api from "./axios";

//일반 로그인
export const login = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

//회원가입
export const register = async (email, password, name) => {
  const res = await api.post("/users/", {
    email,
    password,
    name,
  });
  return res.data;
};

//로그아웃
export const logout = async () => {
  await api.post("/auth/logout");
};

//회원 탈퇴 (본인)
export const deleteMe = async () => {
  await api.delete("/users/me");
};