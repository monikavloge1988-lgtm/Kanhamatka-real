import { useState, FormEvent } from 'react';
import { auth, googleProvider } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailAuth = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use.');
      } else {
        setError(err.message || 'Authentication failed');
      }
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError(err.message || 'Google authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#09090b] rounded-[2rem] p-8 border border-[#1a1a1c] shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#facc15] opacity-[0.03] rounded-full blur-3xl"></div>
        
        <div className="text-center mb-10 relative z-10">
          <h1 className="text-4xl font-bold text-[#facc15] tracking-tight mb-2">GoldSpinner</h1>
          <p className="text-zinc-500 text-sm tracking-wider uppercase">{isLogin ? 'Welcome Back' : 'Create Account'}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4 relative z-10">
          <div>
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#151516] border border-[#2a2a2d] rounded-xl h-14 px-4 text-white focus:outline-none focus:border-[#facc15]/50 transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#151516] border border-[#2a2a2d] rounded-xl h-14 px-4 text-white focus:outline-none focus:border-[#facc15]/50 transition-colors"
              placeholder="Enter your password"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#facc15] text-black font-bold py-4 rounded-xl mt-4 hover:bg-[#eab308] transition-colors"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="my-8 flex items-center justify-center gap-4 relative z-10">
          <div className="h-px bg-[#2a2a2d] flex-1"></div>
          <span className="text-zinc-600 text-xs font-medium uppercase tracking-widest">OR</span>
          <div className="h-px bg-[#2a2a2d] flex-1"></div>
        </div>

        <button 
          onClick={handleGoogleAuth}
          className="w-full bg-[#151516] border border-[#2a2a2d] text-white font-medium py-3.5 rounded-xl hover:bg-[#1a1a1c] transition-colors flex items-center justify-center gap-3 relative z-10"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="mt-8 text-center relative z-10">
          <p className="text-zinc-500 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#facc15] hover:text-white transition-colors font-medium ml-1"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
