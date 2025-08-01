import { getURL, supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { Loader } from 'lucide-react';

import Aurora from "../components/Aurora"
import "../components/Aurora.css"
import { useEffect, useRef, useState } from 'react';

export default function Login() {

  const signupWindowRef = useRef<Window | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {

    setIsLoading(false);

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
          if (signupWindowRef.current) {
            signupWindowRef.current.close();
          }

          registerUserOnDB(session);

          setIsLoading(false);
          navigate('/dashboard');
        }
      }
    );



    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);

  //TODO: *Close Loading screen if popup closes
  // useEffect(() => {
  //   const signupWindow = signupWindowRef.current;
  //   if (!signupWindow) return;

  //   const handleClose = () => {
  //     setIsLoading(false);
  //   };

  //   signupWindow.addEventListener("close", handleClose);

  //   return () => {
  //     signupWindow.removeEventListener("close", handleClose);
  //   };
  // }, [signupWindowRef]);

  async function registerUserOnDB(session: any){
    try{
      const baseURL = `${window.location.protocol}//${window.location.host}`;

      await fetch(baseURL + "/create-user", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata.full_name,
          provider: session.user.app_metadata.provider,
          avatar_url: session.user.user_metadata.avatar_url
        })
      });

    }
    catch(e){
      alert(e)
    }
  }

  async function handleSignUp( provider: 'google' | 'github'){

    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithOAuth({ 
      provider,
      options: {    
        skipBrowserRedirect: true, 
        redirectTo: getURL()
      },
    })
    
    if(error){
      toast.error("Some error occured: " + error.message);
      return;
    }

    if (data.url) {
      signupWindowRef.current = window.open(data.url, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
    }


  }

  return (
    <>
    {isLoading ? (
    
    <div className='h-screen w-screen bg-black flex justify-center items-center'>
      <Loader className='animate-spin w-12 h-12' />
    </div>
    
    ): (
      <div className="h-screen w-screen flex">
    

    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      transition={Bounce}
      />
  <div className="w-1/2 relative h-full bg-black flex flex-col justify-end p-12 overflow-hidden ">

    <div className="absolute inset-0 z-0">
      <Aurora
        colorStops={["#1e1e73", "#6930c3", "#ff1e56"]}
        amplitude={1.0}
        blend={0.5}
        speed={0.1}
        time={0}
      />
    </div>
    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-transparent to-orange-500/30 pointer-events-none z-5" />
    <div className="text-white z-10">
      <h1 className="text-5xl font-light leading-tight">
        Automated Workflows
        <br />
        on the <span className="font-bold">Internet Computer</span>
      </h1>
    </div>
  </div>
      <div className="w-1/2 bg-black flex items-center justify-center p-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h2 className="text-white text-4xl font-semibold mb-3">Login</h2>
            <p className="text-gray-400 text-base">
              Start automating your workflows with Fraktal
            </p>
          </div>
          <div className="space-y-4">
            <button className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 text-white py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 hover:-translate-y-0.5" onClick={() => handleSignUp('google')}>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="font-medium">Sign in with Google</span>
            </button>
            <button className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 text-white py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 hover:-translate-y-0.5" onClick={() => handleSignUp('github')}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="font-medium">Sign in with GitHub</span>
            </button>
          </div>
          <div className="mt-6 text-gray-400 text-sm text-center">
            By signing in, you agree to our <a href="/#" className="text-white hover:underline">Terms of Service</a> and <a href="/#" className="text-white hover:underline">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
    )}

    
    </>
  )
}
