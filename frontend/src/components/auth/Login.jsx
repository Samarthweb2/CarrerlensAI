import React, { useState } from 'react';
import Input from './Input';
import PasswordInput from './PasswordInput';
import Checkbox from './Checkbox';
import Divider from './Divider';
import SocialLoginButton from './SocialLoginButton';
import LoadingButton from './LoadingButton';
import SuccessModal from './SuccessModal';
import ErrorToast from './ErrorToast';
import authService from '../../services/authService';

export default function Login({ onNavigate, onSuccess, onActiveFieldChange, setStatus }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Error states
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toastError, setToastError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Oops! That email doesn't look valid.";
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setStatus('error');
      return;
    }

    setErrors({});
    setLoading(true);
    setToastError(null);
    setStatus('idle');

    authService.login(email, password)
      .then(data => {
        setSuccess(true);
        setStatus('success');
        setTimeout(() => {
          onSuccess();
        }, 1500);
      })
      .catch(err => {
        setLoading(false);
        const errMsg = err.response?.data?.detail || 'Wrong Password. Please double check your email and credentials.';
        setToastError(errMsg);
        setStatus('error');
      });
  };

  return (
    <div className="flex flex-col text-left relative">
      {success && <SuccessModal message="Welcome back to CareerLensAI!" />}
      {toastError && <ErrorToast message={toastError} onClose={() => { setToastError(null); setStatus('idle'); }} />}

      <h2 className="text-2xl font-black text-text mb-1">Welcome Back 👋</h2>
      <p className="text-xs sm:text-[13px] font-bold text-text-light mb-6 leading-relaxed">
        Ready to continue your career journey? Login to access your resume insights, ATS score, AI recommendations, and dashboard.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="samarth@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => onActiveFieldChange('email')}
          onBlur={() => onActiveFieldChange(null)}
          error={errors.email}
        />

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center select-none">
            <label className="text-[13px] font-black text-text uppercase tracking-wide">
              Password
            </label>
            <button
              type="button"
              onClick={() => { onNavigate('/forgot-password'); setStatus('forgot'); }}
              className="text-xs font-black text-secondary hover:underline cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>
          <PasswordInput
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => onActiveFieldChange('password')}
            onBlur={() => onActiveFieldChange(null)}
            error={errors.password}
          />
        </div>

        <Checkbox
          label="Remember Me"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />

        <LoadingButton type="submit" loading={loading} className="mt-2">
          Login
        </LoadingButton>
      </form>

      <Divider>OR</Divider>

      <div className="flex flex-col gap-3">
        <SocialLoginButton provider="google" />
        <SocialLoginButton provider="github" />
      </div>

      <p className="text-xs font-bold text-text-muted text-center mt-6 select-none">
        Don't have an account?{' '}
        <button
          onClick={() => { onNavigate('/signup'); setStatus('idle'); }}
          className="text-secondary font-black hover:underline cursor-pointer"
        >
          Create Account
        </button>
      </p>
    </div>
  );
}
