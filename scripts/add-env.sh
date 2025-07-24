#Export Canister IDs for inter canister communication

export CANISTER_ID_fraktal_main=$(dfx canister id fraktal-main)
export CANISTER_ID_database=$(dfx canister id database)
export CANISTER_ID_execution_engine=$(dfx canister id execution-engine)

#!/bin/bash

# Load .env file and export variables
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
  echo "Environment variables loaded from .env"
else
  echo ".env file not found"
fi

