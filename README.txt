SAQR Python Backend — setup skeleton
=====================================

This folder contains initial deployment settings only. Do not start accepting real applications until app.py is added/configured and tested.

1. Upload these files to your Python host.
2. Install dependencies from requirements.txt.
3. Set environment variables using .env.example as a guide. Do not upload a real .env to GitHub.
4. In Discord Developer Portal > OAuth2, set Redirect URI to the exact DISCORD_REDIRECT_URI.
5. Configure the bot's guild/server ID and assign it appropriate permissions.
6. Use persistent storage for the database; ephemeral disk may lose submissions on restart.

The frontend expects /auth/discord and /api/applications endpoints. Those must be implemented and tested before publishing live applications.
