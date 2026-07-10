import React, { useState, useEffect } from 'react';
import Input from './Input';
import PasswordInput from './PasswordInput';
import Checkbox from './Checkbox';
import Divider from './Divider';
import SocialLoginButton from './SocialLoginButton';
import LoadingButton from './LoadingButton';
import SuccessModal from './SuccessModal';
import ErrorToast from './ErrorToast';
import authService from '../../services/authService';

export default function Signup({ onNavigate, onSuccess, onActiveFieldChange, setStatus }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  // Validation errors
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toastError, setToastError] = useState(null);

  // Live password checklist rules state
  const [rules, setRules] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false
  });

  // Track password changes for live rules checklist
  useEffect(() => {
    setRules({
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    });
  }, [password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Oops! That email doesn't look valid.";
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else {
      const isStrong = rules.length && rules.upper && rules.lower && rules.number && rules.special;
      if (!isStrong) {
        newErrors.password = 'Please complete all password checklist rules.';
      }
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms & Privacy Policy.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setStatus('error');
      return;
    }

    // Reset errors and simulate loading state
    setErrors({});
    setLoading(true);
    setStatus('idle');

    authService.signup(fullName, email, password)
      .then(data => {
        setSuccess(true);
        setStatus('success');
        localStorage.setItem('signup_email', email);
        setTimeout(() => {
          onSuccess();
        }, 1500);
      })
      .catch(err => {
        setLoading(false);
        const errMsg = err.response?.data?.detail || 'Registration failed. Please try again.';
        setToastError(errMsg);
        setStatus('error');
      });
  };

  return (
    <div className="flex flex-col text-left">
      {success && <SuccessModal message="Your CareerLensAI account has been created!" />}
      {toastError && <ErrorToast message={toastError} onClose={() => { setToastError(null); setStatus('idle'); }} />}

      <h2 className="text-2xl font-black text-text mb-1">Create Your Account</h2>
      <p className="text-xs sm:text-[13px] font-bold text-text-light mb-6">
        Start your AI-powered career journey today.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Full Name"
          placeholder="Samarth"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          onFocus={() => onActiveFieldChange('name')}
          onBlur={() => onActiveFieldChange(null)}
          error={errors.fullName}
        />

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

        <PasswordInput
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => onActiveFieldChange('password')}
          onBlur={() => onActiveFieldChange(null)}
          error={errors.password}
        />

        {/* Live Password Rules Checklist */}
        <div className="bg-cream-dark/40 border border-card-border/60 p-3 rounded-xl flex flex-col gap-1.5 text-xs font-bold text-text-light select-none">
          <span className="text-[11px] font-black text-text-muted uppercase tracking-wider mb-0.5">Password Rules</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
            {[
              { rule: 'length', text: 'Min 8 characters' },
              { rule: 'upper', text: 'Uppercase Letter' },
              { rule: 'lower', text: 'Lowercase Letter' },
              { rule: 'number', text: 'Contains Number' },
              { rule: 'special', text: 'Special Character' }
            ].map((r) => (
              <div key={r.rule} className="flex items-center gap-1.5">
                <span className={`text-[13px] leading-none ${rules[r.rule] ? 'text-accent-green font-bold' : 'text-text-muted'}`}>
                  {rules[r.rule] ? '✓' : '○'}
                </span>
                <span className={rules[r.rule] ? 'text-accent-green' : 'text-text-light'}>{r.text}</span>
              </div>
            ))}
          </div>
        </div>

        <PasswordInput
          label="Confirm Password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onFocus={() => onActiveFieldChange('password')}
          onBlur={() => onActiveFieldChange(null)}
          error={errors.confirmPassword}
        />

        <div className="flex flex-col gap-1">
          <Checkbox
            label="I agree to the Terms & Privacy Policy"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
          />
          {errors.agreeTerms && (
            <span className="text-xs font-bold text-accent-orange block mt-0.5">
              {errors.agreeTerms}
            </span>
          )}
        </div>

        <LoadingButton type="submit" loading={loading} className="mt-2">
          Create Account
        </LoadingButton>
      </form>

      <Divider>OR</Divider>

      <div className="flex flex-col gap-3">
        <SocialLoginButton provider="google" />
        <SocialLoginButton provider="github" />
      </div>

      <p className="text-xs font-bold text-text-muted text-center mt-6 select-none">
        Already have an account?{' '}
        <button
          onClick={() => { onNavigate('/login'); setStatus('idle'); }}
          className="text-secondary font-black hover:underline cursor-pointer"
        >
          Login
        </button>
      </p>
    </div>
  );
}
