import axios from "axios"

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
})

export const createOrder = (booking_id) =>
  API.post("/payment/create-order", { booking_id })

export const verifyPayment = (data) =>
  API.post("/payment/verify", data)