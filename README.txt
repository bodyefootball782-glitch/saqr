SAQR WEBSITE — FRONTEND PREPARATION
==================================

This is the existing SAQR site with the application entry flow prepared for a secure Python backend.

Files included:
- index.html
- style.css
- script.js
- background.jpg

Keep your existing logo.png, photo1.jpg ... photo5.jpg, music1.mp3 and music2.mp3 in this folder if you have them.

IMPORTANT
1) Do not put Discord Bot Token, OAuth Client Secret, or a Discord Webhook URL in script.js or any public GitHub repository.
2) The application form is intentionally not live until the Python backend is deployed and configured.
3) After deploying the backend, replace API_BASE_URL in script.js with its HTTPS base URL.
4) The backend must implement /auth/discord and /api/applications, validate OAuth state and session, verify the user's membership in the SAQR Discord server, enforce one application per Discord user in a persistent database, and send submissions to Discord using a server-side webhook or bot.
5) Configure Vercel to serve this folder as a static site. No Vercel environment secret is needed for this frontend; secrets belong only on the Python backend host.

Application types: MOD / ADMIN and EDITOR.
Discord invite: https://discord.gg/r7XgRWnNp
Applications channel ID: 1560666723525333032

This frontend alone does not yet perform OAuth or send applications. That requires the Python backend and Discord Developer Portal configuration.
