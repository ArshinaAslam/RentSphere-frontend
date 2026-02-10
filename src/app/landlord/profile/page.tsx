'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import LandlordNavbar from '@/components/layout/LandlordNavbar';
import LandlordProfileSidebar from '@/components/layout/LandlordProfileSidebar';
import { editProfileSchema, EditProfileValues } from '@/constants/authValidation';
// import { editLandlordProfileAsync } from '@/features/auth/authThunks'; // ✅ Landlord thunk
import LandlordChangePasswordModal from './LandlordChangePasswordModal';
import LandlordEditProfile from './LandlordEditProfile';
import { toast } from 'sonner';
import { ProfileOverviewUser } from '@/types/user';
import { editLandlordProfileAsync } from '@/features/auth/authThunks';

export type LandlordProfileTab = 'basic' | 'edit' | 'settings' | 'kyc';

export default function LandlordProfilePage() {
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector((state) => state.auth);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [activeTab, setActiveTab] = useState<LandlordProfileTab>('basic');

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

  const handleEditSubmit = async (data: EditProfileValues, avatar: File | null) => {
    try {
      const formData = new FormData();
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('phone', data.phone);
      if (avatar) formData.append('avatar', avatar);

     await dispatch(editLandlordProfileAsync(formData)).unwrap(); 
      toast.success("Profile updated", {
        description: "Your changes have been saved successfully.",
        duration: 3000,
        className: `rounded-2xl bg-white border border-emerald-200 shadow-xl shadow-emerald-100`,
      });
      setTimeout(() => setActiveTab('basic'), 100);
    } catch (error) {
      toast.error("❌ Failed to update profile", { description: "Please try again." });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <LandlordNavbar />
      <div className="flex pt-16">
        <LandlordProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 lg:ml-64 px-6 py-8 max-w-5xl mx-auto w-full">
          <Header activeTab={activeTab} />
          
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm min-h-[600px]">
            {activeTab === 'basic' && <ProfileOverview user={userData} />}
            {activeTab === 'edit' && (
              <LandlordEditProfile user={userData} form={editForm} onSubmit={handleEditSubmit} />
            )}
            {activeTab === 'kyc' && <KycDetails user={userData} />} 
            {activeTab === 'settings' && <Settings onPasswordClick={() => setShowPasswordModal(true)} />}
          </div>
        </main>

        {showPasswordModal && (
          <LandlordChangePasswordModal 
            isOpen={showPasswordModal} 
            onClose={() => setShowPasswordModal(false)}
          />
        )}
      </div>
    </div>
  );
}

function Header({ activeTab }: { activeTab: LandlordProfileTab }) {
  const titles: Record<LandlordProfileTab, string> = {
    basic: 'Profile Overview',
    edit: 'Edit Profile',
    kyc: 'KYC Details',      // ✅ NEW
    settings: 'Account Settings',
  };

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-slate-900">{titles[activeTab]}</h1>
      <p className="text-slate-500 text-sm mt-2">
        {activeTab === 'kyc' 
          ? 'View your KYC verification documents' 
          : activeTab === 'settings' 
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
      {/* Avatar + Name */}
      <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center shadow-sm">
          {user?.avatar ? (
            <img
              key={avatarUrl} 
              src={avatarUrl}
              alt={`${user.fullName}'s profile`}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("Image load failed:", avatarUrl);
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <span className="text-emerald-700 text-3xl font-bold">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'L'}
            </span>
          )}
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900 leading-tight">
            {user?.fullName || 'Landlord'}
          </h3>
          <p className="text-sm text-emerald-600 font-semibold tracking-wide uppercase mt-1">
            {user?.role || 'LANDLORD'}
          </p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Info label="First Name" value={user?.fullName?.split(' ')[0] || '—'} />
        <Info label="Last Name" value={user?.fullName?.split(' ')[1] || '—'} />
        <Info label="Email Address" value={user?.email} />
        <Info label="Phone Number" value={user?.phone || '_'} />
        {/* {user?.kycStatus && <Info label="KYC Status" value={user.kycStatus} />} */}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">{label}</p>
      <p className="text-slate-800 font-semibold mt-1">{value || 'Not provided'}</p>
    </div>
  );
}



function KycDetails({ user }: { user: ProfileOverviewUser | null }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header with Status */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-1">KYC Verification</h3>
          <p className="text-slate-600">Your identity documents and verification status</p>
        </div>
        {/* <div className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${
          user?.kycStatus === 'APPROVED' 
            ? 'bg-emerald-100 text-emerald-800' 
            : user?.kycStatus === 'PENDING' 
            ? 'bg-amber-100 text-amber-800' 
            : 'bg-slate-100 text-slate-800'
        }`}>
          {user?.kycStatus === 'APPROVED' && '✅ Verified'}
          {user?.kycStatus === 'PENDING' && '⏳ Pending Review'}
          {user?.kycStatus === 'REJECTED' && '❌ Rejected'}
          {!user?.kycStatus && 'Not Submitted'}
        </div> */}
      </div>

     
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        
        <div className="border rounded-xl overflow-hidden bg-slate-50 group">
          <div className="h-44 bg-slate-100">
            {user?.aadharFrontUrl ? (
              <img
                src={user.aadharFrontUrl}
                alt="Aadhaar Front"
                className="w-full h-full object-cover"  
                onError={(e) => {
                  e.currentTarget.src = '/api/placeholder/300/200';
                }}
              />
            ) : (
              <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          <div className="p-4">
            <p className="text-sm font-medium text-slate-900 mb-1">Aadhaar Front</p>
            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded">
              {user?.aadharNumber ? `${user.aadharNumber.slice(0,4)}****${user.aadharNumber.slice(-4)}` : 'Not Available'}
            </span>
          </div>
        </div>

        {/* Aadhaar Back - FIXED */}
        <div className="border rounded-xl overflow-hidden bg-slate-50 group">
          <div className="h-44 bg-slate-100">
            {user?.aadharBackUrl ? (
              <img
                src={user.aadharBackUrl}
                alt="Aadhaar Back"
                className="w-full h-full object-cover"  // ✅ FIXED: object-cover
                onError={(e) => {
                  e.currentTarget.src = '/api/placeholder/300/200';
                }}
              />
            ) : (
              <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          <div className="p-4">
            <p className="text-sm font-medium text-slate-900 mb-1">Aadhaar Back</p>
          </div>
        </div>

        {/* PAN Card - FIXED */}
        <div className="border rounded-xl overflow-hidden bg-slate-50 group">
          <div className="h-44 bg-slate-100">
            {user?.panFrontUrl ? (
              <img
                src={user.panFrontUrl}
                alt="PAN Card"
                className="w-full h-full object-cover"  // ✅ FIXED: object-cover
                onError={(e) => {
                  e.currentTarget.src = '/api/placeholder/300/200';
                }}
              />
            ) : (
              <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          <div className="p-4">
            <p className="text-sm font-medium text-slate-900 mb-1">PAN Card</p>
            <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs font-semibold rounded">
              {user?.panNumber || 'Not Available'}
            </span>
          </div>
        </div>
      </div>

      {/* Summary */}
      {/* <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
        <h4 className="text-lg font-bold text-slate-900 mb-4">Verification Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white rounded-xl border">
            <div className="text-2xl font-bold text-emerald-600 mb-1">3/3</div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Documents</p>
          </div>
          <div className="text-center p-4 bg-white rounded-xl border">
            <div className={`text-2xl font-bold mb-1 ${
              user?.kycStatus === 'APPROVED' ? 'text-emerald-600' : 
              user?.kycStatus === 'PENDING' ? 'text-amber-600' : 'text-slate-600'
            }`}>
              {user?.kycStatus === 'APPROVED' ? '✅' : user?.kycStatus === 'PENDING' ? '⏳' : '⚪'}
            </div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Status</p>
          </div>
        </div>
      </div> */}
    </div>
  );
}




// 2. Settings Component
function Settings({ onPasswordClick }: { onPasswordClick: () => void }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div 
        className="p-6 border border-slate-100 rounded-2xl bg-slate-50/50 hover:shadow-sm transition-all cursor-pointer group"
        onClick={onPasswordClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-white/50 rounded-xl shadow-sm group-hover:shadow-md group-hover:bg-white transition-all">
              <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"/>
              </svg>
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
    </div>
  );
}
