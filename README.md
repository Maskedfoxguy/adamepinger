# adamepinger
A personal resume website showcasing my professional journey, portfolio, and projects (both completed and in progress). Features include a dynamic gallery, project updates, and an overview of my skills and experiences.
# My Personal Resume Website

A personal resume website showcasing my professional journey, portfolio, and projects (both completed and in progress). This project is a core part of my journey in learning web development.

**Live Demo:** [Not available yet]



## 🚀 Technologies Used

*   **Frontend:** HTML, CSS, JavaScript, React
*   **Backend:** (e.g., Node.js, Express 
*   **Deployment:** (e.g., GitHub Pages, Netlify)

## ✨ Key Features

*   **Dynamic Gallery:** A section to showcase my projects visually.
*   **Project Updates:** See what I am currently working on.
*   **Skills Overview:** A summary of my technical skills and experiences.
*   **(Add more features as you build them!)**

## 🔧 Getting Started

To run this project locally on your machine, follow these steps:

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Maskedfoxguy/adamepinger.git
    ```

2.  **Navigate to the client directory:**
    ```sh
    cd adamepinger/resumesite/client
    ```

3.  **Install dependencies:**
    ```sh
    npm install
    ```

4.  **Start the development server:**
    ```sh
    npm start
    ```
    The application will be available at `http://localhost:3000`.

## Build, tests, and deployment routing

Run these commands from the repository root with Node.js and npm available.

```sh
npm ci
npm ci --prefix client
npm ci --prefix server
npm test
npm run build --prefix client
```

The client build goes to `client/build`. Create React App copies the
Netlify-style fallback from `client/public/_redirects` into that directory.
The npm `proxy` setting in `client/package.json` applies to the development
server only. The production client calls Express through same-origin URLs.

Configure the production frontend host or reverse proxy in this order:

1. Forward `/api` and `/api/*`, plus `/auth` and `/auth/*`, to Express.
   Preserve the path, query string, HTTP method, body, and authorization
   header. Return the upstream status and response.
2. Serve files from `client/build`.
3. Serve `index.html` for client-side navigation paths such as `/about`,
   `/login`, and `/admin/dashboard`.

On a Netlify-style host, put the Express proxy rewrites above
`/* /index.html 200` in the effective redirect rules. Use the deployed
Express origin and preserve the prefix in the destination, for example
`/api/* https://<express-host>/api/:splat 200` and
`/auth/* https://<express-host>/auth/:splat 200`, with separate entries for
the bare paths. On other hosts, configure equivalent routing in the host or
reverse proxy. The active production host settings and Express origin are
external to this checkout and need to be verified before deployment.

Node 24 LTS is the runtime candidate. Confirm support on both the frontend
build host and the Express runtime before adding a repository-wide pin.

### Admin access

- `/login` is public. `/admin/dashboard` is the existing protected screen.
  The client checks `GET /auth/verify` before mounting the dashboard and
  requesting account information.
- Express protects `/auth/verify`, `/auth/heartbeat`, `/auth/logout`, and
  `/api/admin/*` with a bearer JWT and an active MongoDB session. The admin
  router additionally checks the admin role before serving account, profile,
  or content operations. Public content reads keep their existing URLs.
- Login creates a session with a six-hour maximum lifetime. A session also
  expires after 60 minutes of inactivity. Heartbeats update activity within
  that window and leave the six-hour limit in place.
- A protected 401 clears the matching browser session and returns a protected
  screen to `/login`. Verification and account-load failures offer retry.
  Protected client requests time out after eight seconds. Logout attempts
  server revocation and clears the local session even if the network fails.
- Account, profile, and auth responses use `Cache-Control: no-store`.

## 🚧 Project Status

This project is currently **in progress**. I am actively developing it to learn and apply new web development skills.

## 📫 Contact

I'm open to connecting and collaborating. Feel free to reach out!

*   **LinkedIn:** www.linkedin.com/in/adamepinger



