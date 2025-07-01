import type { useNavigate } from "react-router-dom";
import { supabase } from "./supabase"


export async function getUserData() {
    const { data } = await supabase.auth.getUser()
    return (data.user ? data.user : null)
}

export async function signOutCurrentUser(navigate: ReturnType<typeof useNavigate>){
    await supabase.auth.signOut();
    navigate('/login')
}
