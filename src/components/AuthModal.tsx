import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Lock, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-md z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 p-6"
          >
            <div className="bg-surface border border-white p-8 md:p-10 rounded-3xl shadow-float relative overflow-hidden">
              <button 
                onClick={onClose} 
                className="absolute top-4 right-4 p-2 bg-background shadow-inner-3d rounded-full text-muted hover:text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-surface shadow-3d-soft flex items-center justify-center border border-white">
                  <User className="w-6 h-6 text-accent-blue" />
                </div>
                <div>
                  <h2 className="text-3xl font-display font-bold text-primary tracking-tight">
                    {isLogin ? 'Welcome Back' : 'Join Quizzo'}
                  </h2>
                  <p className="text-sm font-bold text-muted mt-1">
                    {isLogin ? 'Access your telemetry.' : 'Create your operative profile.'}
                  </p>
                </div>
              </div>

              <div className="space-y-5 mb-8">
                {!isLogin && (
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                      type="text"
                      placeholder="Operative Name"
                      className="w-full bg-background shadow-inner-3d rounded-xl pl-12 pr-4 py-4 text-primary font-bold placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent-blue/40 transition-all font-sans text-sm border-none"
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full bg-background shadow-inner-3d rounded-xl pl-12 pr-4 py-4 text-primary font-bold placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent-blue/40 transition-all font-sans text-sm border-none"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full bg-background shadow-inner-3d rounded-xl pl-12 pr-4 py-4 text-primary font-bold placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent-blue/40 transition-all font-sans text-sm border-none"
                  />
                </div>
              </div>

              <button className="w-full py-4 bg-accent-blue text-white font-display font-bold text-lg rounded-2xl shadow-float hover:-translate-y-1 transition-all flex items-center justify-center gap-2 mb-6">
                {isLogin ? 'Authenticate' : 'Initialize Account'} <ArrowRight className="w-5 h-5" />
              </button>

              <div className="text-center">
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm font-bold text-muted hover:text-accent-blue transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already registered? Sign in"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}