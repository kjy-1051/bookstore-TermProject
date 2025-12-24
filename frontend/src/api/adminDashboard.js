import api from "./axios";

export const fetchAdminStats = async () => {
  const res = await api.get("/admin/dashboard/stats");
  return res.data;
};
