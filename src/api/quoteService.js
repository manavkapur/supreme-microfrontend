// src/api/quoteService.js
import axios from "axios";

const API_BASE = "http://localhost:8080/quote-service/api/quotes";

export const createQuote = (data) => axios.post(API_BASE, data);
export const getAllQuotes = () => axios.get(API_BASE);
