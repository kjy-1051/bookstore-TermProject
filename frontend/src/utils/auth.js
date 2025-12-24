export const saveAuth = (data) => {
  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("refresh_token", data.refresh_token);
  localStorage.setItem("role", data.role);
};

export const logout = () => {
  localStorage.clear();
};
