// src/api/quoteService.js
import axios from "axios";

const API_BASE = `${process.env.REACT_APP_API_URL}/quote-service/api/quotes/create`;

export const createQuote = (data) => axios.post(API_BASE, data);
export const getAllQuotes = () => axios.get(API_BASE);



