import api from "./axiosConfig";

export const registerUser = async (data) => api.post("/user-service/api/users/register", data);
export const loginUser = async (data) => api.post("/user-service/api/users/login", data);
export const registerFcmToken = async (data) => api.post("/user-service/api/users/register-fcm", data);
export const getFcmToken = async (userId) => api.get(`/user-service/api/users/fcm-token/${userId}`);
