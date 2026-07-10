import React, { useState } from 'react';
import { motion } from 'framer-motion';
import authService from '../../services/authService';
import Input from './Input';
import PasswordInput from './PasswordInput';
import LoadingButton from './LoadingButton';
import ErrorToast from './ErrorToast';

export default function ForgotPassword({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = request code, 2 = verify and reset
  const [success, setSuccess] = useState(false);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email address is required');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Oops! That email doesn't look valid.");
      return;
    }

    setError('');
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send reset code. Verify email and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!code || code.length !== 6) {
      setError('Please enter a 6-digit OTP code.');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await authService.resetPassword(email, code, newPassword);
      setSuccess(true);
      setTimeout(() => {
        onNavigate('/login');
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Reset failed. Verify code and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col text-left w-full max-w-sm mx-auto">
      {error && <ErrorToast message={error} onClose={() => setError('')} />}

      <h2 className="text-2xl font-black text-text mb-1">Reset Password</h2>
      
      {!success ? (
        <>
          {step === 1 ? (
            <>
              <p className="text-xs sm:text-[13px] font-bold text-text-light mb-6">
                Enter your email address and we'll send you a 6-digit password reset OTP code.
              </p>

              <form onSubmit={handleRequestCode} className="flex flex-col gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="samarth@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <LoadingButton type="submit" loading={loading} className="mt-2">
                  Send Reset Code
                </LoadingButton>
              </form>
            </>
          ) : (
            <>
              <p className="text-xs sm:text-[13px] font-bold text-text-light mb-6">
                Enter the 6-digit OTP code sent to <span className="text-secondary font-black">{email}</span> and your new password.
              </p>

              <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                <Input
                  label="6-Digit Reset Code"
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                />

                <PasswordInput
                  label="New Password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <PasswordInput
                  label="Confirm New Password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <LoadingButton type="submit" loading={loading} className="mt-2">
                  Reset Password
                </LoadingButton>
              </form>
            </>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center mt-4"
        >
          <div className="w-12 h-12 rounded-full bg-accent-green/10 border-2 border-accent-green flex items-center justify-center mb-3 text-accent-green font-bold text-lg select-none">
            ✓
          </div>
          <h3 className="text-base font-black text-text mb-1">Password Reset Successful!</h3>
          <p className="text-xs font-bold text-text-light max-w-xs mb-6">
            Your password has been reset successfully. Redirecting you to login...
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
