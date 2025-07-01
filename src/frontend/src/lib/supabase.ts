import { createClient } from '@supabase/supabase-js'

const supabaseURL = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(
  supabaseURL,
  supabaseAnonKey
)

export const getURL = () => {  
  let url = import.meta.env.VITE_CANISTER_ORIGIN 
  
  url = url.startsWith('http') ? url : `https://${url}`  
  url = url.endsWith('/') ? url : `${url}/`  

  return url
}
