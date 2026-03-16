# BlogSpace

BlogSpace is a full-stack blog platform with user authentication, blog publishing, comments, likes, profile updates, and image uploads.

This repository contains:
- `Frontend`: React + Vite + Tailwind client
- `Backend`: Node.js + Express + MongoDB API

## Project Structure

```text
BlogProject/
  Backend/
    index.js
    package.json
    Controller/
    Middleware/
    Model/
    Route/
    Services/
  Frontend/
    index.html
    package.json
    vite.config.js
    public/
    src/
```

## Tech Stack

- Frontend: React, React Router, Axios, Tailwind CSS, Vite
- Backend: Node.js, Express, Mongoose, JWT, Cookie Parser, Multer
- Database: MongoDB Atlas
- Deployment: Single Azure VM + Nginx reverse proxy

---

## Deployment Overview (Single VM)

This project is deployed on one VM with one public IP.

Recommended traffic flow:
- `http://<VM-IP>/` -> serves frontend static files
- `http://<VM-IP>/api/*` -> proxied to backend (`http://127.0.0.1:5001/*`)

Important update implemented in code:
- Frontend API base URL is centralized in `Frontend/src/api.js`
- Backend CORS origin and port are env-driven in `Backend/index.js`

---

## Prerequisites on VM

Install:
- Node.js 18+
- npm
- Nginx
- Git

Optional but recommended for process management:
- PM2

```bash
sudo apt update
sudo apt install -y nginx git curl
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

---

## 1) Clone Project

```bash
git clone <your-repo-url>
cd BlogProject
```

---

## 2) Backend Setup

```bash
cd Backend
npm install
```

Create `Backend/.env`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/<db>
JWT_SECRET=<strong-random-secret>
PORT=5001
FRONTEND_URL=http://<VM-IP>
```

Notes:
- Keep `FRONTEND_URL` exactly equal to what browser uses (same protocol + host).
- If you use a domain or HTTPS, update `FRONTEND_URL` accordingly.

Start backend:

```bash
npm start
```

Recommended with PM2:

```bash
pm2 start index.js --name blogspace-backend
pm2 save
pm2 startup
```

---

## 3) Frontend Build for Production

```bash
cd ../Frontend
npm install
```

Create `Frontend/.env.production`:

```env
VITE_API_BASE_URL=/api
```

Build:

```bash
npm run build
```

Build output is generated in:
- `Frontend/dist`

---

## 4) Nginx Configuration

Create or edit Nginx site config:

```bash
sudo nano /etc/nginx/sites-available/blogspace
```

Use this config:

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name _;

    root /home/azureuser/BlogProject/Frontend/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:5001/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site and reload Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/blogspace /etc/nginx/sites-enabled/blogspace
sudo nginx -t
sudo systemctl reload nginx
```

If default site conflicts, disable it:

```bash
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

## Critical Proxy Rule (Important)

In `location /api/`, this is mandatory:

```nginx
proxy_pass http://127.0.0.1:5001/;
```

The trailing `/` is required.

Without it, backend receives `/api/user/signup` and returns:
- `Cannot POST /api/user/signup`

With it, `/api/user/signup` is forwarded as `/user/signup`, which matches Express routes.

---

## 5) Verify Deployment

### Health checks

Check backend direct:

```bash
curl -i http://127.0.0.1:5001/blog/getblogs
```

Check through Nginx public route:

```bash
curl -i http://<VM-IP>/api/blog/getblogs
```

Test signup through public route:

```bash
curl -i -X POST http://<VM-IP>/api/user/signup \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","password":"password123"}'
```

Expected:
- 200/201 for success paths
- JSON response from backend

---

## Local Development

### Backend

`Backend/.env`:

```env
MONGO_URI=<your-local-or-atlas-uri>
JWT_SECRET=<your-dev-secret>
PORT=5001
FRONTEND_URL=http://localhost:5173
```

Run:

```bash
cd Backend
npm install
npm run dev
```

### Frontend

`Frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5001
```

Run:

```bash
cd Frontend
npm install
npm run dev
```

---

## Common Deployment Issues and Fixes

### 1) Blogs fetch but signup/signin fails

Cause:
- Nginx forwarding `/api/...` without stripping `/api` prefix.

Fix:
- Use `proxy_pass http://127.0.0.1:5001/;` with trailing slash.

### 2) CORS error in browser

Cause:
- `FRONTEND_URL` does not match real frontend origin.

Fix:
- Set `FRONTEND_URL` exactly to deployed frontend origin and restart backend.

### 3) Frontend calling wrong backend URL

Cause:
- `VITE_API_BASE_URL` missing during production build.

Fix:
- Set `VITE_API_BASE_URL=/api` in `.env.production`, rebuild frontend, redeploy `dist`.

### 4) `Token cookie value: undefined` in logs

Meaning:
- Normal for unauthenticated requests.

Only a problem if:
- it appears for authenticated endpoints right after successful signin.

### 5) SPA routes like `/signin` return 404 on refresh

Cause:
- Missing SPA fallback.

Fix:
- Ensure Nginx `location /` uses `try_files $uri /index.html;`

---

## Security Checklist

- Never commit `.env` files.
- Rotate secrets immediately if exposed.
- Use strong random `JWT_SECRET`.
- Restrict MongoDB Atlas network access to required IPs.
- Prefer HTTPS in production and set cookie policy accordingly.

---

## Useful Commands

Backend logs (PM2):

```bash
pm2 logs blogspace-backend
```

Restart backend:

```bash
pm2 restart blogspace-backend
```

Nginx status:

```bash
sudo systemctl status nginx
```

Nginx error logs:

```bash
sudo tail -f /var/log/nginx/error.log
```

Nginx access logs:

```bash
sudo tail -f /var/log/nginx/access.log
```

---

## Current Route Map (Backend)

- User routes mounted at `/user`
  - `POST /user/signup`
  - `POST /user/signin`
  - `GET /user/auth`
  - `GET /user/logout`
  - `GET /user/profile`
  - `PUT /user/updateprofile`

- Blog routes mounted at `/blog`
  - `GET /blog/getblogs`
  - `POST /blog/postblog`
  - `PUT /blog/updateblog/:blogid`
  - `DELETE /blog/deleteblog/:blogid`
  - `POST /blog/postcomment/:blogid`
  - `GET /blog/getcomments/:blogid`
  - `POST /blog/postlike/:blogid`
  - `POST /blog/postdislike/:blogid`
  - `GET /blog/getlikes/:blogid`

When called from frontend in production, these become:
- `/api/user/...`
- `/api/blog/...`

through Nginx proxy mapping.

---

Build with ❤️ by om

Email: iomgholap123@gmail.com

GitHub: omgholap11


