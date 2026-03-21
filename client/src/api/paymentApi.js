import axios from "axios"

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
})

export const createOrder = (deal_id, amount) =>
  API.post("/payment/create-order", { deal_id, amount })

export const verifyPayment = (data) =>
  API.post("/payment/verify", data)
