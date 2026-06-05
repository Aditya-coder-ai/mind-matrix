import React, { Suspense } from 'react';
import { useAuth } from '../AuthContext';
import { BrainCircuit } from 'lucide-react';

// Lazy load the heavy 3D background
const NeuralBrain3D = React.lazy(() => import('./NeuralBrain3D'));

const Login: React.FC = () => {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 text-white p-4 overflow-hidden">
      {/* 3D Background - Loaded asynchronously so it doesn't block UI */}
      <Suspense fallback={null}>
        <NeuralBrain3D />
      </Suspense>

      {/* Login Card overlay */}
      <div className="relative z-10 max-w-md w-full space-y-8 bg-slate-900/60 p-8 rounded-2xl border border-slate-800 backdrop-blur-xl shadow-2xl">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
              <BrainCircuit className="w-12 h-12 text-indigo-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Mind Matrix</h2>
          <p className="mt-2 text-slate-300 font-medium">
            Your Socratic STEM Mentor. Elevate your learning with AI.
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/layout/google.svg" 
              alt="Google" 
              className="w-5 h-5"
            />
            Sign in with Google
          </button>
          
          <div className="text-center">
            <p className="text-xs text-slate-400">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
