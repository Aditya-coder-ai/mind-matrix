import React from 'react';
import { useAuth } from '../AuthContext';
import { BrainCircuit } from 'lucide-react';

const Login: React.FC = () => {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-4">
      <div className="max-w-md w-full space-y-8 bg-slate-900/50 p-8 rounded-2xl border border-slate-800 backdrop-blur-sm">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
              <BrainCircuit className="w-12 h-12 text-indigo-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Mind Matrix</h2>
          <p className="mt-2 text-slate-400">
            Your Socratic STEM Mentor. Elevate your learning with AI.
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-colors"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/layout/google.svg" 
              alt="Google" 
              className="w-5 h-5"
            />
            Sign in with Google
          </button>
          
          <div className="text-center">
            <p className="text-xs text-slate-500">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
