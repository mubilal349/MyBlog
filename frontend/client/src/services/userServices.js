import api from "./api";

export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const searchUsers = async (query) => {
  const response = await api.get(`/users/search?q=${query}`);
  return response.data;
};
