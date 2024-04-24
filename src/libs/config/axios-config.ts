import axios from "axios";
import { getCookies } from "cookies-next";
import { TOKEN } from "../enums/constants";

/**
 * Basic axios config
 */
export const API = axios.create({
  baseURL: "/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/**
 * Interceptor added that will add Authorization header
 */
API.interceptors.request.use(function (config) {
  const token = getCookies()[`${TOKEN}`];
  if (token) config.headers.Authorization = `Bearer ${token}`;
  else config.headers.Authorization = null;
  return config;
});
