# Server Memory

## Stack
- Node.js ESM, Express v5, Mongoose, port 3000
- All routes under `/ido_shop_api/`

## Auth
- JWT in httpOnly cookie (`token`)
- `verifyToken` middleware → sets `req.user = { id, user_role }`
- Roles: `admin` / `manager` / `user`
- Google OAuth: `google-auth-library` + `googleapis`

## Models
| File | Collection | Key fields |
|---|---|---|
| `user.model.js` | `Users` | `user_role`, `google_id`, email verification token, reset password token |
| `product.model.js` | `Products` | numeric `id` (not `_id`), `category` enum, `stock` |
| `order.model.js` | `Orders` | `orderNumber` (auto), embeds `products[]` with `product_rtp` snapshot |
| `SupportTicket.model.js` | `SupportTickets` | `ticketNumber` (auto), `priority` enum, `status` enum |
| `order.counter.model.js` | counter for orderNumber | |
| `ticket.counter.model.js` | counter for ticketNumber | |

## Services
- `cloudinaryProvider.js` — Cloudinary image upload
- `mailer.js` — Nodemailer (two Gmail accounts in `.env`)
- `payment.service.js` — PayPal Sandbox REST: `generateAccessToken`, `createOrder`, `capturePayment`

## Middlewares
- `verifyToken.js` — JWT cookie auth
- `validateDto.js` — Zod validation
- `uploadFiles.js` — Multer memory/disk storage

## Email Templates
- `templets/email.template.js` — `emailValidationTemplate`, `resetPasswordTemplate`

## Utilities
- `util/importdata.js` + `util/storedb.json` — seed script (run manually)
- `util/getNextOrderNumber.js` — atomic counter for orders
- `util/getnextTicketNumber.js` — atomic counter for tickets

## CORS Origins
`localhost:5173`, `localhost:5174`, `idoeladclient.onrender.com`, `idofinalprojectdhshboard.onrender.com`

## Env Vars Needed
`MONGO_URI`, `PORT`, `JWT_SECRET`, `FRONT_URL`, `SERVER_URL`, `cloudinary_*`, `GOOGLE_CLIENT_ID/SECRET/REDIRECT_URI`, `EMAIL_USER/PASS`, `PAYPAL_CLIENT_ID/SECRET`
