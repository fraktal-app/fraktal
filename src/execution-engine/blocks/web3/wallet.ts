import { interpretTemplate } from "../../lib/lib";

// ===== Helpers for formatting =====

function formatTokenBalance(bigint: bigint, decimals: number, precision: number = 6): string {
  const base = 10n ** BigInt(decimals);
  const whole = bigint / base;
  const fractional = bigint % base;
  const fractionalStr = fractional.toString().padStart(decimals, '0').slice(0, precision);
  return `${whole.toString()}.${fractionalStr}`;
}

// ===== ETH Wallet Balance =====

async function getEthWalletBalance(walletAddress: string): Promise<string> {
  const CHAINBASE_API_KEY = process.env.CHAINBASE_API_KEY;

  if (!CHAINBASE_API_KEY) {
    throw new Error("CHAINBASE_API_KEY is not defined in environment variables.");
  }

  const response = await fetch(
    `https://api.chainbase.online/v1/account/balance?chain_id=1&address=${walletAddress}`, 
    {
      headers: { 
        'x-api-key': CHAINBASE_API_KEY, 
        'accept': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error(`ETH request failed with status ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.message !== "ok") {
    throw new Error(`ETH request returned unexpected message: ${data.message}`);
  }

  const rawBalance = BigInt(data.data); // balance in wei
  return formatTokenBalance(rawBalance, 18, 6); // Convert to ETH
}

// ===== SOL Wallet Balance =====

async function getSolWalletBalance(walletAddress: string): Promise<string> {
  const response = await fetch("https://api.mainnet-beta.solana.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getBalance",
      params: [walletAddress],
    }),
  });

  if (!response.ok) {
    throw new Error(`SOL request failed with status ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  const balanceLamports = BigInt(data.result.value);
  return formatTokenBalance(balanceLamports, 9, 6); // Convert to SOL
}

// ===== BTC Wallet Balance =====

async function getBTCWalletBalance(walletAddress: string): Promise<string> {
  const response = await fetch(`https://blockstream.info/api/address/${walletAddress}`);

  if (!response.ok) {
    throw new Error(`BTC request failed with status ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  const funded = BigInt(data.chain_stats.funded_txo_sum);
  const spent = BigInt(data.chain_stats.spent_txo_sum);
  const balanceSats = funded - spent;

  return formatTokenBalance(balanceSats, 8, 6); // Convert to BTC
}



// Sends a Telegram message using the Bot API
async function getWalletBalance(action: any, data: any){

  
  const blockchainNetwork = interpretTemplate(action.credentials.blockchainNetwork, data) || ""; 
  const walletAddress = interpretTemplate(action.credentials.walletAddress, data).trim() || ""

  try {

    let balance;

    switch(blockchainNetwork){
      case "ETH":
        balance = await getEthWalletBalance(walletAddress)
        break;
      
      case "SOL":
        balance = await getSolWalletBalance(walletAddress)
        break;

      case "BTC":
        balance = await getBTCWalletBalance(walletAddress)
        break;
    }    

    //Extract relevant message data
    const extractedData = {
      symbol: blockchainNetwork,
      current_wallet_balance: balance
    };

    return extractedData;

  } catch (error) {
    console.error('Error fetching Wallet data data:', error);
  }
}


export async function web3WalletActionsHandler(action, data){
    //TODO add fail/execution logging
    switch(action.event){
        case "get_wallet_balance":
            return await getWalletBalance(
                action,
                data
            );
            break;

        default:
            console.warn(`Unknown Web3 Token action event: ${action.event}`);
            break;
    }
}


