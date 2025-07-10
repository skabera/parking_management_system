import  { useState } from 'react';
import { User, Camera, CheckCircle, AlertCircle } from 'lucide-react';

const Settings = () => {
  const [tab, setTab] = useState('profile');
  const [profile, setProfile] = useState({ firstName: '', lastName: '', avatar: null });
  const [msg, setMsg] = useState({ success: '', error: '' });

  const handleChange = (e: { target: { name: string; value: string; }; }) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleAvatar = (e: { target: { files: FileList | null; }; }) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfile({ ...profile });
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = () => {
    setMsg({ success: '', error: '' });
    setTimeout(() => setMsg({ success: 'Profile updated', error: '' }), 500);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Settings</h2>

      {msg.success && (
        <div className="flex items-center gap-2 text-green-600"><CheckCircle size={16} />{msg.success}</div>
      )}
      {msg.error && (
        <div className="flex items-center gap-2 text-red-600"><AlertCircle size={16} />{msg.error}</div>
      )}

      <div className="flex gap-6">
        <aside className="w-48 space-y-2">
          {['profile', 'security', 'notifications', 'preferences'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`block w-full text-left px-3 py-2 rounded ${tab === t ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}>
              {/* {t === 'profile' && <User className="inline mr-2" />}  */}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </aside>

        <main className="flex-1">
       
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="avatar" className="h-16 w-16 rounded-full" />
                ) : (
                  <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <User />
                  </div>
                )}
                <div>
                  <label htmlFor="avatar" className="flex items-center cursor-pointer text-sm text-blue-600">
                    <Camera size={16} className="mr-1" /> Change Photo
                  </label>
                  <input id="avatar" type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
                </div>
              </div>

              <input name="firstName" placeholder="First Name" value={profile.firstName} onChange={handleChange} className="block w-full border p-2 rounded" />
              <input name="lastName" placeholder="Last Name" value={profile.lastName} onChange={handleChange} className="block w-full border p-2 rounded" />

              <button onClick={saveProfile} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
            </div>

        </main>
      </div>
    </div>
  );
};

export default Settings;
