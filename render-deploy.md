Render Deployment Guide
=========================

This project (`akhilpro`) can be deployed to Render as a Web Service. Follow these steps to deploy the backend and connect it with the static frontend (hosted on GitHub Pages or any static host).

1. Push latest changes
----------------------
Make sure your local repo is up-to-date and push any new files (Procfile and render.yaml are included):

```bash
cd path/to/akhilpro
git add Procfile render.yaml
git commit -m "Add Render deployment files"
git push origin main
```

2. Create a Render account
--------------------------
- Go to https://render.com and sign up (GitHub login recommended).

3. Create a new Web Service
---------------------------
- Click "New" → "Web Service".
- Connect your GitHub account and select the `SaiCharanBodigay/akhilpro` repository.
- Use the `main` branch.
- For the build command, use: `npm install` (or leave blank, Render detects Node projects).
- For the start command, use: `npm start`.
- Environment: `Node` (Render will set `PORT` automatically).

4. Add Environment Variables
---------------------------
In the Render service settings (Environment → Environment Variables), add:

- `MONGODB_URI` = (your MongoDB Atlas connection string)
- `JWT_SECRET` = (strong secret string for JWT)
- `NODE_ENV` = `production` (optional)

Important: Do NOT commit your `.env` file to GitHub. Use Render's dashboard to set secrets.

5. Deploy
---------
- Click "Create Web Service". Render will build and deploy your project.
- After successful deployment you'll get a URL like `https://akhilpro-backend.onrender.com`.

6. Update frontend API endpoints
--------------------------------
If your frontend is hosted on GitHub Pages (or any static host), update the fetch URLs in `signin.html` and `signup.html` from `http://localhost:5000` to the deployed backend URL.

Search for occurrences of `http://localhost:5000` and replace with your Render URL, for example:

```js
// before
fetch('http://localhost:5000/api/signup', { ... })

// after
fetch('https://akhilpro-backend.onrender.com/api/signup', { ... })
```

Then push those changes and redeploy your frontend (GitHub Pages will publish automatically if configured).

7. Test
-------
- Open the deployed backend URL + `/api/health` to confirm the API returns `{ "success": true }`.
- Open your static frontend and test signup/signin.

Troubleshooting
---------------
- CORS: Server already uses `cors()` allowing all origins. If you want to restrict origins, update `server.js`.
- PORT: Render sets `PORT` env var automatically; `server.js` uses `process.env.PORT`.
- Logs: Use Render dashboard Logs to view build and runtime logs.

Security Notes
--------------
- Use a strong `JWT_SECRET` and keep it secret in Render.
- Consider using HTTPS for frontend and backend (Render provides HTTPS).
- Rotate secrets if leaked.

That's it—if you want, I can update the frontend files automatically to replace `localhost` with the deployed URL once you provide it.