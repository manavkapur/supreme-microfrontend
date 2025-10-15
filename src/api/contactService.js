import api from "./axiosConfig";

export const submitContact = async (data) => api.post("/contact-service/api/contacts", data);
