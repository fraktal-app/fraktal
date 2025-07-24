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

- Start execution engine by: `ngrok http 4943 --host-header="bkyz2-fmaaa-aaaaa-qaaaq-cai.raw.localhost" --url="readily-certain-ant.ngrok-free.app"`

- Start Discord bot in `services/discord-bot` using `ngrok http 5000 --host-header="bkyz2-fmaaa-aaaaa-qaaaq-cai.raw.localhost" --url="tiger-desired-airedale.ngrok-free.app"`


### TODO:
- Convert to Monolithic architechture 
- Increase type safety
- Increase documentation
- Use LLM canister
- Use Eth RPC canister
- Enable multiple data export