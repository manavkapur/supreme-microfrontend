// src/api/quoteService.js
import axios from "axios";

const API_BASE = "http://localhost:8087/api/quotes/create";

export const createQuote = (data) => axios.post(API_BASE, data);
export const getAllQuotes = () => axios.get(API_BASE);
