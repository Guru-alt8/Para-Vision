import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, MapPin, Phone, Briefcase, Edit2, Save, X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setProfile(data);
      setFormData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setProfile(formData);
        setIsEditing(false);
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium animate-pulse">Loading Profile...</p>
      </div>
    </div>
  );

  if (!profile) return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-6">
      <div className="card max-w-md w-full p-8 text-center bg-white shadow-xl border border-red-100 rounded-3xl">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <X className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Profile</h2>
        <p className="text-gray-600 mb-8 text-sm leading-relaxed">
          We couldn't retrieve your profile information. This might be due to a session timeout or a server error.
        </p>
        <button 
          onClick={fetchProfile}
          className="btn-primary w-full py-3 shadow-lg shadow-primary/25"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-background min-h-[calc(100vh-64px)] p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-textPrimary">User Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your personal information and accessibility profile.</p>
          </div>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="btn-secondary flex items-center gap-2 hover:bg-gray-100 transition-all border border-gray-200"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="font-medium text-sm">{message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Summary Card */}
          <div className="card p-8 flex flex-col items-center text-center bg-white shadow-sm border border-gray-100 rounded-2xl">
            <div className="w-24 h-24 bg-primary/5 text-primary rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-sm ring-1 ring-gray-100">
              <User className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{profile.name}</h2>
            <p className="text-sm text-gray-500 mb-6">{profile.email}</p>
            <div className="inline-flex items-center px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100">
              {profile.role}
            </div>
            
            <div className="mt-8 w-full pt-6 border-t border-gray-50 flex justify-center gap-8">
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">{profile.age || '-'}</p>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-0.5">Age</p>
              </div>
              <div className="text-center border-l border-gray-50 pl-8">
                <p className="text-xl font-bold text-gray-900">{profile.city || '-'}</p>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-0.5">City</p>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="card lg:col-span-2 p-8 bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden relative">
            <div className={`transition-all duration-300 ${isEditing ? 'opacity-100' : 'opacity-100'}`}>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name || ''} 
                        onChange={handleChange}
                        className="input-field border-gray-200 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all text-sm py-2.5"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Age</label>
                      <input 
                        type="number" 
                        name="age"
                        value={formData.age || ''} 
                        onChange={handleChange}
                        className="input-field border-gray-200 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all text-sm py-2.5"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Gender</label>
                      <select 
                        name="gender"
                        value={formData.gender || ''} 
                        onChange={handleChange}
                        className="input-field border-gray-200 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all text-sm py-2.5 bg-white"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-binary">Non-binary</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Disability Type</label>
                      <input 
                        type="text" 
                        name="disability_type"
                        placeholder="e.g. Visual, Mobility, Hearing"
                        value={formData.disability_type || ''} 
                        onChange={handleChange}
                        className="input-field border-gray-200 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all text-sm py-2.5"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Phone Number</label>
                      <input 
                        type="text" 
                        name="phone"
                        value={formData.phone || ''} 
                        onChange={handleChange}
                        className="input-field border-gray-200 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all text-sm py-2.5"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">City</label>
                      <input 
                        type="text" 
                        name="city"
                        value={formData.city || ''} 
                        onChange={handleChange}
                        className="input-field border-gray-200 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all text-sm py-2.5"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">About You</label>
                    <textarea 
                      name="bio"
                      rows="4"
                      placeholder="Share a little something about yourself..."
                      value={formData.bio || ''} 
                      onChange={handleChange}
                      className="input-field border-gray-200 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all text-sm"
                    ></textarea>
                  </div>
                  <div className="flex justify-end gap-3 pt-6 border-t border-gray-50 flex-col sm:flex-row">
                    <button 
                      type="button" 
                      onClick={() => { setIsEditing(false); setFormData(profile); }}
                      className="btn-secondary text-gray-500 hover:bg-gray-50 hover:text-gray-700 py-2.5"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={saving}
                      className="btn-primary flex items-center justify-center gap-2 py-2.5 min-w-[140px] shadow-md shadow-primary/20"
                    >
                      {saving ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {saving ? 'Updating...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-gray-50 rounded-lg text-gray-400 mt-0.5 transition-colors group-hover:bg-primary/5 group-hover:text-primary">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Age</p>
                        <p className="text-gray-900 font-medium">{profile.age || <span className="text-gray-300 italic">Not set</span>}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-gray-50 rounded-lg text-gray-400 mt-0.5">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Gender</p>
                        <p className="text-gray-900 font-medium">{profile.gender || <span className="text-gray-300 italic">Not set</span>}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-gray-50 rounded-lg text-gray-400 mt-0.5">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Disability</p>
                        <p className="text-gray-900 font-medium">{profile.disability_type || <span className="text-gray-300 italic">Not set</span>}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-gray-50 rounded-lg text-gray-400 mt-0.5">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Phone</p>
                        <p className="text-gray-900 font-medium text-sm">{profile.phone || <span className="text-gray-300 italic">Not set</span>}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-gray-50 rounded-lg text-gray-400 mt-0.5">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">City</p>
                        <p className="text-gray-900 font-medium">{profile.city || <span className="text-gray-300 italic">Not set</span>}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-gray-50 rounded-lg text-gray-400 mt-0.5">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email</p>
                        <p className="text-gray-900 font-medium text-sm">{profile.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-8 border-t border-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">About You</p>
                      <div className="h-0.5 flex-1 bg-gray-50 mx-4"></div>
                    </div>
                    <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-50">
                      <p className={`text-sm leading-relaxed ${profile.bio ? 'text-gray-700 italic' : 'text-gray-400 italic'}`}>
                        {profile.bio || "No description provided yet. Click 'Edit Profile' to share more about yourself!"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center pt-4">
                    <p className="text-[10px] text-gray-300 font-medium uppercase tracking-[0.2em]">Para Vision Access Profile</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
