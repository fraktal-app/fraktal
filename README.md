# Fraktal
No-code automation on-chain. Build powerful workflows on the Internet Computer. 

## Instructions for Running

- Clone the Repo
- `npm install`
- `cd src/frontend`
- create .env in `src/frontend`
- in .env paste: `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`

- `npm install`
- `cd ../..`
- `dfx start --clean`
- `dfx canister create --all`
- `source scripts/add-env.sh`
- `dfx deploy`