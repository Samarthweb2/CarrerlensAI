import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import authService from '../../services/authService';
import Input from './Input';
import LoadingButton from './LoadingButton';
import ErrorToast from './ErrorToast';

export default function VerifyEmail({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('signup_email') || 'your email';
    setEmail(savedEmail);
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code || code.length !== 6) {
      setError('Please enter a valid 6-digit OTP code.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await authService.verifyEmail(email, code);
      setSuccess(true);
      setTimeout(() => {
        onNavigate('/login');
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    try {
      await authService.forgotPassword(email); // Reuses forgot password code generation
      setResent(true);
      setTimeout(() => setResent(false), 3000);
    } catch (err) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-center w-full max-w-sm mx-auto">
      {error && <ErrorToast message={error} onClose={() => setError('')} />}

      {/* Mascot holding envelope */}
      <svg viewBox="0 0 160 160" fill="none" className="w-28 h-28 mb-4 select-none">
        <ellipse cx="80" cy="140" rx="35" ry="5" fill="#E8D5B0" opacity="0.4"/>
        
        {/* Arm holding envelope */}
        <path d="M 36 105 Q 15 115 22 128" stroke="#7C5CFF" strokeWidth="6.5" strokeLinecap="round"/>
        <path d="M 124 105 Q 140 120 120 130" stroke="#7C5CFF" strokeWidth="6.5" strokeLinecap="round"/>

        {/* Head */}
        <motion.g
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <rect x="35" y="25" width="90" height="70" rx="16" fill="#7C5CFF" stroke="#1F1F1F" strokeWidth="2"/>
          <rect x="41" y="31" width="78" height="58" rx="12" fill="white"/>
          <circle cx="63" cy="52" r="6" fill="#1F1F1F"/>
          <circle cx="97" cy="52" r="6" fill="#1F1F1F"/>
          <path d="M 68 68 Q 80 76 92 68" stroke="#1F1F1F" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        </motion.g>

        {/* Torso */}
        <rect x="50" y="95" width="60" height="40" rx="10" fill="#7C5CFF" stroke="#1F1F1F" strokeWidth="2"/>
        
        {/* Envelope in front */}
        <motion.g
          animate={{ y: [0, -2, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          transform="translate(55, 105)"
        >
          <rect width="50" height="34" rx="4" fill="white" stroke="#1F1F1F" strokeWidth="2.5"/>
          <path d="M0 4 L25 20 L50 4" stroke="#1F1F1F" strokeWidth="2.5" strokeLinejoin="round"/>
          <circle cx="25" cy="20" r="3.5" fill="#FFD54F"/>
        </motion.g>
      </svg>

      <h2 className="text-2xl font-black text-text mb-1">Verify Your Email</h2>
      
      {!success ? (
        <>
          <p className="text-xs sm:text-[13px] font-bold text-text-light mb-6 max-w-xs">
            We sent a 6-digit OTP code to <span className="text-secondary font-black">{email}</span>. Paste the code below to verify your account:
          </p>

          <form onSubmit={handleVerify} className="flex flex-col gap-4 w-full text-left">
            <Input
              label="6-Digit Verification Code"
              type="text"
              placeholder="123456"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            />

            <LoadingButton type="submit" loading={loading} className="mt-2 w-full">
              Verify Account
            </LoadingButton>
          </form>

          <div className="flex flex-col gap-3 w-full mt-4">
            <motion.button
              type="button"
              onClick={handleResend}
              disabled={resending}
              whileHover={resending ? {} : { y: -2, scale: 1.01 }}
              whileTap={resending ? {} : { scale: 0.98 }}
              className="w-full py-3 bg-white border-2 border-card-border hover:border-text text-text font-extrabold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {resending ? 'Sending...' : resent ? '✓ Verification OTP Resent!' : 'Resend Verification Code'}
            </motion.button>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center mt-4"
        >
          <div className="w-12 h-12 rounded-full bg-accent-green/10 border-2 border-accent-green flex items-center justify-center mb-3 text-accent-green font-bold text-lg select-none animate-bounce">
            ✓
          </div>
          <h3 className="text-lg font-black text-text mb-1">Email Verified!</h3>
          <p className="text-xs font-bold text-text-light max-w-xs">
            Your account is verified successfully! Redirecting you to login...
          </p>
        </motion.div>
      )}

      <p className="text-xs font-bold text-text-muted text-center mt-6 select-none">
        Back to{' '}
        <button
          onClick={() => onNavigate('/login')}
          className="text-secondary font-black hover:underline cursor-pointer"
        >
          Login
        </button>
      </p>
    </div>
  );
}
