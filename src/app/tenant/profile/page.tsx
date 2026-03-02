   'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Phone, User, Lock, Shield, LogOut, Smartphone, Settings as SettingsIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
 
import Navbar from '@/components/layout/Navbar';
import ProfileSidebar from '@/components/layout/ProfileSidebar';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import type { EditProfileValues } from '@/constants/authValidation';
import { editProfileSchema } from '@/constants/authValidation';
import { editTenantProfileAsync } from '@/features/auth/authThunks';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { ProfileOverviewUser } from '@/types/user';

import ChangePasswordModal from './ChangePasswordModal';
import EditProfile from './EditProfile';


export type ProfileTab = 'basic' | 'edit' | 'settings';



export default function ProfileSettingsPage() {
  const dispatch = useAppDispatch();
 const { userData } = useAppSelector((state) => state.auth) 
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  const [activeTab, setActiveTab] = useState<ProfileTab>('basic');
  
  
  const editForm = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: { firstName: '', lastName: '', phone: '' },
  });


  
  useEffect(() => {
    if (userData) {
      editForm.reset({
        firstName: userData.fullName?.split(' ')[0] || '',
        lastName: userData.fullName?.split(' ')[1] || '',
        phone: userData.phone || '',
      });
    }
  }, [userData, editForm]);

  const handleEditSubmit = async (data: EditProfileValues,avatar: File | null) => {
    // await dispatch(editTenantProfileAsync(data)).unwrap();
    // setTimeout(() => setActiveTab('basic'), 100);


    try {

         const formData = new FormData();

  formData.append('firstName', data.firstName);
  formData.append('lastName', data.lastName);
  formData.append('phone', data.phone);

  if (avatar) {
    formData.append('avatar', avatar);
  }
    await dispatch(editTenantProfileAsync(formData)).unwrap();
 toast.success("Profile updated", {
  description: "Your changes have been saved successfully.",
  duration: 3000,
  className: `
    rounded-2xl 
    bg-white 
    border border-emerald-200 
    shadow-xl shadow-emerald-100
  `,
  descriptionClassName: `
    text-slate-600 text-sm
  `,
  icon: "✅",
});



    setTimeout(() => setActiveTab('basic'), 100);
  } catch (error) {
    toast.error("❌ Failed to update profile", {
      description: "Please try again.",
    });
  }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex pt-16">
       
        <ProfileSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        <main className="flex-1 lg:ml-64 px-6 py-8 max-w-5xl mx-auto w-full">
          <Header activeTab={activeTab} />

          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm min-h-[600px]">
            {activeTab === 'basic' && <ProfileOverview user={userData} />}
            {activeTab === 'edit' && (
              <EditProfile user={userData} form={editForm} onSubmit={handleEditSubmit} />
            )}

      
            {activeTab === 'settings' && <Settings onPasswordClick={() => setShowPasswordModal(true)} />}
          </div>
        </main>

        {showPasswordModal && (
  <ChangePasswordModal 
    isOpen={showPasswordModal} 
    onClose={() => setShowPasswordModal(false)} 
    onSubmit={(data: PasswordFormData) => { 
      console.log(data); 
      alert('✅ Done!'); 
      setShowPasswordModal(false); 
    }} 
  />
)}
      </div>
    </div>
  );
}


function Header({ activeTab }: { activeTab: ProfileTab }) {
  const titles: Record<ProfileTab, string> = {
    basic: 'Profile Overview',
    edit: 'Edit Profile', 
    settings: 'Account Settings',
  };

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-slate-900">{titles[activeTab]}</h1>
      <p className="text-slate-500 text-sm mt-2">
        {activeTab === 'settings' 
          ? 'Manage your account preferences and security' 
          : 'Update and manage your account information'
        }
      </p>
    </div>
  );
}



function ProfileOverview({ user }: { user: ProfileOverviewUser | null }) {

  const avatarUrl = user?.avatar 
    ? `${user.avatar}${user.avatar.includes('?') ? '&' : '?'}t=${new Date().getTime()}` 
    : undefined;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
     
      <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center shadow-sm">
          {user?.avatar ? (
            <img
              key={avatarUrl} 
              src={avatarUrl}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("Image load failed:", avatarUrl);
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <span className="text-emerald-700 text-3xl font-bold">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          )}
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900 leading-tight">
            {user?.fullName || 'User'}
          </h3>
          <p className="text-sm text-emerald-600 font-semibold tracking-wide uppercase mt-1">
            {user?.role || 'Tenant'}
          </p>
        </div>
      </div> 

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Info label="First Name" value={user?.fullName?.split(' ')[0] || '—'} />
        <Info label="Last Name" value={user?.fullName?.split(' ')[1] || '—'} />
        <Info label="Email Address" value={user?.email} />
        <Info label="Phone Number" value={user?.phone || undefined} />
      </div>
    </div>
  );
}


interface SettingsProps {
  onPasswordClick: () => void;
}

function Settings({ onPasswordClick }: SettingsProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div 
        className="p-6 border border-slate-100 rounded-2xl bg-slate-50/50 hover:shadow-sm transition-all cursor-pointer group"
        onClick={onPasswordClick}  
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-white/50 rounded-xl shadow-sm group-hover:shadow-md group-hover:bg-white transition-all">
              <Lock className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">Change Password</h3>
              <p className="text-sm text-slate-500">Update your account password securely</p>
            </div>
          </div>
          <div className="text-emerald-600 font-semibold text-sm flex items-center gap-1 hover:text-emerald-700">
            Change
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border border-slate-100 rounded-2xl bg-emerald-50/50">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-6 h-6 text-emerald-600" />
            <span className="font-bold text-emerald-800 text-sm uppercase tracking-wider">Secure</span>
          </div>
          <h4 className="text-lg font-bold text-slate-900 mb-2">Account Security</h4>
          <p className="text-slate-600 text-sm">Your account is fully verified and protected with 2FA enabled.</p>
        </div>
        
        <div className="p-6 border border-slate-100 rounded-2xl bg-amber-50/50">
          <div className="flex items-center gap-3 mb-3">
            <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"/>
            </svg>
            <span className="font-bold text-amber-800 text-sm uppercase tracking-wider">Reminder</span>
          </div>
          <h4 className="text-lg font-bold text-slate-900 mb-2">Password Age</h4>
          <p className="text-slate-600 text-sm">Your password is 45 days old. Consider updating for better security.</p>
        </div>
      </div>

      {/* Delete Account */}
      <div className="pt-6 border-t border-slate-200">
        <div className="bg-gradient-to-r from-rose-50 to-red-50 p-6 rounded-2xl border border-rose-200">
          <h4 className="text-lg font-bold text-rose-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2h8a2 2 0 012 2v11a3 3 0 00-3 3H7a3 3 0 00-3-3V5zm3 4a1 1 0 000 2h6a1 1 0 100-2H7z"/>
            </svg>
            Delete Account
          </h4>
          <p className="text-rose-800 text-sm mb-4">Permanently delete your RentShare account and all associated data.</p>
          <button className="bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 py-2 px-4 rounded-xl font-semibold text-sm transition-all">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}


function SessionItem({ device, location, lastActive }: { 
  device: string; 
  location: string; 
  lastActive: string 
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-slate-100 hover:bg-white hover:shadow-sm transition-all">
      <div>
        <p className="font-medium text-slate-900 text-sm">{device}</p>
        <p className="text-xs text-slate-500">{location} • {lastActive}</p>
      </div>
      <button className="text-slate-500 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}


interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}




function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">{label}</p>
      <p className="text-slate-800 font-semibold mt-1">{value || 'Not provided'}</p>
    </div>
  );
}
