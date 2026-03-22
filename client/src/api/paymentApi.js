import axios from "axios"

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
})


export const createOrder = (data) =>
  API.post("/payment/create-order", data)

export const verifyPayment = (data) =>
  API.post("/payment/verify", data)
