import React, { useState, useEffect } from 'react';
import authService from '../../services/authService';
import apiClient from '../../services/api';
import ErrorToast from '../auth/ErrorToast';

export default function UserProfile({ onNavigate }) {
  const [user, setUser] = useState({});
  const [resumes, setResumes] = useState([]);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Settings
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [targetRole, setTargetRole] = useState('Software Developer');

  const fetchProfile = async () => {
    try {
      const u = await authService.me();
      setUser(u);
      setFullName(u.full_name);
      setEmail(u.email);
      setProfilePic(u.profile_pic || '');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch user profile.');
    }
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await apiClient.get('/resume');
      setResumes(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchHistory();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const payload = {
        full_name: fullName,
        email: email,
        profile_pic: profilePic
      };
      if (password) {
        payload.password = password;
      }
      await authService.updateProfile(payload);
      setSuccessMsg('Profile details updated successfully! ✨');
      setPassword('');
      fetchProfile();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile details.');
    } finally {
      setLoading(false);
    }
  };

  const handlePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteResume = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume? This will delete all associated ATS analyses.')) return;
    try {
      await apiClient.delete(`/resume/${id}`);
      fetchHistory();
    } catch (err) {
      setError('Failed to delete resume record.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('⚠️ WARNING: This will permanently delete your CareerLensAI account, all uploaded resumes, and ATS scan history. This action cannot be undone. Do you want to proceed?')) return;
    setLoading(true);
    try {
      await authService.deleteAccount();
      alert('Your account has been deleted successfully.');
      onNavigate('/');
    } catch (err) {
      setError('Failed to delete account.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border-3 border-text p-6 sm:p-8 rounded-3xl shadow-[6px_6px_0px_#1F1F1F] text-left w-full flex flex-col gap-8">
      {error && <ErrorToast message={error} onClose={() => setError('')} />}
      {successMsg && (
        <div className="bg-accent-green/10 border-2 border-accent-green p-3 rounded-xl text-xs font-black text-accent-green">
          {successMsg}
        </div>
      )}

      {/* Header Grid Profile Card */}
      <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-card-border/60">
        {/* Profile Picture Avatar */}
        <div className="relative group shrink-0">
          <div className="w-24 h-24 rounded-full border-3 border-text overflow-hidden bg-primary/10 flex items-center justify-center font-black text-2xl text-text">
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span>{fullName ? fullName[0].toUpperCase() : 'U'}</span>
            )}
          </div>
          <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-secondary hover:bg-secondary/95 border-2 border-text flex items-center justify-center cursor-pointer shadow text-white text-xs select-none">
            📷
            <input type="file" accept="image/*" className="hidden" onChange={handlePictureUpload} />
          </label>
        </div>

        <div>
          <h2 className="text-xl font-black text-text">{fullName || 'Samarth'}</h2>
          <p className="text-xs font-bold text-text-light">{email || 'samarth@example.com'}</p>
          <span className="bg-primary/25 border border-primary/45 px-2.5 py-0.5 rounded-full text-[10px] font-black text-secondary inline-block mt-2 select-none">
            {user.is_verified ? '✓ Verified Account' : '⚠️ Unverified Account'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Edit details form (7 cols) */}
        <form onSubmit={handleUpdateProfile} className="lg:col-span-7 flex flex-col gap-4">
          <h3 className="text-xs font-black text-text uppercase tracking-wider mb-2">Edit Details</h3>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-text-light uppercase tracking-wider">Full Name:</label>
            <input
              type="text"
              className="w-full p-3 bg-cream/15 border-2 border-card-border hover:border-text focus:border-secondary rounded-xl text-xs font-bold text-text outline-none transition-all"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-text-light uppercase tracking-wider">Email Address:</label>
            <input
              type="email"
              className="w-full p-3 bg-cream/15 border-2 border-card-border hover:border-text focus:border-secondary rounded-xl text-xs font-bold text-text outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-text-light uppercase tracking-wider">Change Password (leave blank to keep current):</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-3 bg-cream/15 border-2 border-card-border hover:border-text focus:border-secondary rounded-xl text-xs font-bold text-text outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 bg-primary border-2 border-text text-xs font-black rounded-xl text-text shadow-[3px_3px_0px_#1F1F1F] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer w-fit"
          >
            {loading ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>

        {/* Settings options (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <h3 className="text-xs font-black text-text uppercase tracking-wider mb-2">Settings</h3>

          <div className="flex flex-col gap-4 bg-cream/15 border-2 border-card-border p-4 rounded-2xl text-xs font-bold text-text">
            <label className="flex items-center gap-3.5 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="w-4 h-4 rounded text-secondary"
              />
              <span>Enable AI Notification Tips</span>
            </label>

            <label className="flex items-center gap-3.5 cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="w-4 h-4 rounded text-secondary"
              />
              <span>High Contrast Glassmorphism</span>
            </label>

            <div className="flex flex-col gap-1.5 mt-1">
              <span className="text-[10px] font-black text-text-light uppercase tracking-wider">Default Target Career Role:</span>
              <select
                className="w-full p-2.5 bg-white border border-card-border font-bold text-[11px] rounded-lg outline-none"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              >
                <option value="Software Developer">Software Developer</option>
                <option value="Frontend Engineer">Frontend Engineer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
                <option value="Data Analyst">Data Analyst</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Resume History List */}
      <div className="border-t border-card-border/60 pt-6 mt-2 flex flex-col gap-4">
        <h3 className="text-xs font-black text-text uppercase tracking-wider">Uploaded Resumes History</h3>
        
        <div className="flex flex-col gap-3">
          {resumes.map(r => (
            <div
              key={r.id}
              className="flex items-center justify-between border-2 border-card-border hover:border-text p-3.5 rounded-xl bg-cream/5"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">📄</span>
                <div>
                  <h4 className="text-xs font-black text-text">{r.filename}</h4>
                  <p className="text-[10px] font-bold text-text-light">Uploaded: {r.uploaded_at} | Score: {r.atsScore ? `${r.atsScore}% ATS` : 'N/A'}</p>
                </div>
              </div>

              <div className="flex gap-2">
                {r.analysisId && (
                  <button
                    onClick={() => onNavigate(`/dashboard?id=${r.analysisId}`)}
                    className="px-3 py-1.5 border border-text text-[10px] font-black rounded-lg bg-primary cursor-pointer hover:bg-primary/90"
                  >
                    View Report
                  </button>
                )}
                <button
                  onClick={() => handleDeleteResume(r.id)}
                  className="px-3 py-1.5 border border-text text-[10px] font-black rounded-lg bg-accent-orange text-white hover:bg-accent-orange/95 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {resumes.length === 0 && !loadingHistory && (
            <span className="text-xs font-bold text-text-light text-center py-6 italic select-none">No resumes uploaded yet.</span>
          )}
        </div>
      </div>

      {/* Delete Account card */}
      <div className="border-t border-card-border/60 pt-8 mt-4 flex flex-col gap-3 bg-accent-orange/5 border-2 border-accent-orange/20 p-5 rounded-2xl text-left">
        <h3 className="text-xs font-black text-accent-orange uppercase tracking-wider">Danger Zone</h3>
        <p className="text-xs font-bold text-text-light max-w-xl">
          Once you delete your account, there is no going back. All of your user details, resume documents, and ATS analysis logs will be deleted immediately from our SQLite volumes.
        </p>
        <button
          type="button"
          onClick={handleDeleteAccount}
          className="px-4 py-2.5 bg-accent-orange text-white border-2 border-text text-xs font-black rounded-xl shadow-[2px_2px_0px_#1F1F1F] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer w-fit"
        >
          Delete Account Permanently
        </button>
      </div>
    </div>
  );
}
