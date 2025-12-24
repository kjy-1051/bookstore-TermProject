import api from "./axios";

export const fetchMe = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

export const updateMe = async (data) => {
  const res = await api.patch("/users/me", data);
  return res.data;
};
