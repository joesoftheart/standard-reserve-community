# Connect X OAuth 2.0

## 1. Supabase project

Create a Supabase account at https://supabase.com/dashboard, then create a project named standard-reserve-community. Choose a suitable region (Singapore is near Thailand). The account owner creates and retains the database password. Do not send it to the app or commit it.

Run supabase/schema.sql once in the SQL Editor before the first sign-in. The script creates user profiles, results, read policies, and the profile trigger. It is a first-time schema, not an idempotent migration. Do not rerun against populated tables.

Under Authentication → URL Configuration set:

- Site URL: http://localhost:3000
- Redirect URL: http://localhost:3000/auth/callback

From project settings copy the project URL and publishable key to .env.local:

NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY

These two values are intended for the public client. Do not use a secret or service-role key. Keep .env.local ignored by Git.

## 2. X developer application

Use https://developer.x.com and create an application. Configure OAuth 2.0 user authentication as a Web App / confidential client. Request only the sign-in access needed by Supabase; no posting or direct-message access is needed. Follow Supabase's current instructions regarding email access.

Copy the exact callback shown by Supabase Authentication → Sign In / Providers → X / Twitter (OAuth 2.0). It has this form:

https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback

This is the X application's callback, not the localhost app callback. Supply the required website, terms and privacy URLs for the community hub. The owner must review those policies before publication. Do not use another service's policy as this app's policy.

The owner creates the X Client ID and Client Secret, then enters them directly in the Supabase X / Twitter (OAuth 2.0) provider settings and enables that provider. Neither value is needed in the browser app. Do not put the Client Secret in a NEXT_PUBLIC variable, Git, or chat.

## 3. Verify

Rebuild and restart the application after changing .env.local. Use the same browser and origin from login start through callback. The client uses PKCE and a single Supabase client, automatically exchanges the callback code, restores the originating route, and supports local sign-out.

Test a successful X sign-in, cancelled consent, reload persistence, sign-out, then a saved quiz result and its leaderboard entry. Remote auth and database checks remain pending until the accounts and provider are configured.

## Later deployment

Add the public HTTPS app origin and its exact /auth/callback URL to Supabase before using the deployed app. Set the production environment variables and rebuild. Publication is currently deferred.

Reference: https://supabase.com/docs/guides/auth/social-login/auth-twitter
