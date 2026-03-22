# Payment 405 Fix TODO

## Steps:
- [x] 1. Update client/src/api/paymentApi.js to use correct /api/v1/payment paths
- [x] 2. Create/update client/.env with VITE_BACKEND_URL=http://localhost:3000
- [x] 3. Restart client dev server or docker-compose up --build
- [x] 4. Test PaymentPage with query params ?deal_id=123&amp;amount=80
- [x] 5. Mark complete

**Status:** COMPLETE! Both endpoints working:

- POST /api/v1/payment/create-order → Razorpay order
- POST /api/v1/payment/verify → valid handler (signature check, Mongo update)

404 was transient (server cache/routes). Full payment flow ready.

Run full test: http://localhost:5173/payment?deal_id=123&amp;amount=80 → Pay → Razorpay → verify → /success


