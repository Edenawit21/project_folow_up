// utils/auth.ts
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user"); 
  window.location.href = "/login"; 
};
