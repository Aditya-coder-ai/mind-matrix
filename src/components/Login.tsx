import React, { Suspense } from 'react';
import { useAuth } from '../AuthContext';

const NeuralBrain3D = React.lazy(() => import('./NeuralBrain3D'));

const Login: React.FC = () => {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="flex h-screen w-full bg-[#07091a] text-white font-sans overflow-hidden selection:bg-indigo-500/30">
      
      {/* Left Panel - 55% */}
      <div className="hidden lg:flex flex-col relative w-[55%] h-full justify-end p-16 lg:p-24 z-0">
        <Suspense fallback={null}>
          <NeuralBrain3D className="absolute inset-0 z-0" />
        </Suspense>
        
        {/* Overlay Content */}
        <div className="relative z-10 space-y-8 pointer-events-none">
          <h1 className="text-6xl xl:text-7xl font-display font-extrabold leading-[1.1] tracking-tight">
            Think. Learn.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] to-[#fb7185]">Evolve.</span>
          </h1>
          <div className="flex flex-wrap gap-4">
            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm font-medium tracking-wide">
              50k+ learners
            </div>
            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm font-medium tracking-wide">
              12 STEM topics
            </div>
            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm font-medium tracking-wide">
              Adaptive AI
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - 45% (Glassmorphism) */}
      <div className="w-full lg:w-[45%] h-full flex flex-col justify-center items-center relative z-10 bg-[#07091a]/40 backdrop-blur-3xl border-l border-white/10 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]">
        <div className="w-full max-w-sm px-8 lg:px-0 flex flex-col space-y-10">
          
          {/* Header */}
          <div className="space-y-3">
            <div className="text-4xl mb-6">🧠</div>
            <h2 className="text-3xl font-display font-bold tracking-tight text-white">Mind Matrix</h2>
            <p className="text-slate-400 font-sans text-base">Welcome back! Please enter your details.</p>
          </div>
          
          {/* Form */}
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Email</label>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#a855f7]/50 focus:border-[#a855f7]/50 transition-all font-sans"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#a855f7]/50 focus:border-[#a855f7]/50 transition-all font-sans"
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#a855f7] focus:ring-[#a855f7]/50" />
                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-sm text-[#c084fc] hover:text-[#fb7185] font-medium transition-colors">Forgot password?</a>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4 pt-2">
            <button 
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#c084fc] to-[#a855f7] hover:from-[#d8b4fe] hover:to-[#c084fc] text-white font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] active:scale-[0.98]"
            >
              Sign In
            </button>
            <button
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-transparent border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 transition-colors active:scale-[0.98]"
            >
              <img 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/layout/google.svg" 
                alt="Google" 
                className="w-5 h-5"
              />
              Sign in with Google
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-slate-400 text-sm font-sans pt-4">
            Don't have an account? <a href="#" className="text-white font-bold hover:text-[#fb7185] transition-colors">Sign up</a>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;
