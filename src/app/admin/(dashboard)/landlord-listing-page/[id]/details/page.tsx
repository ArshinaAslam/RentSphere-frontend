// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { 
//   approveKycAsync, rejectKycAsync, toggleUserStatusAsync,
//   fetchSingleLandlordAsync // You'll need to create this thunk
// } from '@/features/users/usersThunks';
// import { Mail, Phone, ShieldCheck, Clock, AlertCircle, Ban, CheckCircle, ArrowLeft } from 'lucide-react';
// import {Loader2} from 'lucide-react';

// interface LandlordDetails {
//   id: string;
//   landlordId: string;
//   fullName: string;
//   email: string;
//   phone: string;
//   avatar: string;
//   status: 'active' | 'blocked';
//   kycStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
//   aadharNumber: string;
//   panNumber: string;
//   aadharFrontUrl: string;
//   aadharBackUrl: string;
//   panFrontUrl: string;
//   address: string;
//   dateJoined: string;
// }

// const LandlordDetailsPage = () => {
//   const params = useParams();
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//   const landlordId = params.id as string;
  
//   const { singleLandlord, isLoading } = useAppSelector((state) => state.users);
//   const [kycDocs, setKycDocs] = useState({
//     aadharFront: '/api/placeholder/300/200',
//     aadharBack: '/api/placeholder/300/200',
//     panFront: '/api/placeholder/300/200',
//   });

//   useEffect(() => {
//     if (landlordId) {
//       dispatch(fetchSingleLandlordAsync(landlordId));
//     }
//   }, [dispatch, landlordId]);

//   const handleApproveKyc = () => {
//     dispatch(approveKycAsync({ id: landlordId }));
//     router.back();
//   };

//   const handleRejectKyc = () => {
//     dispatch(rejectKycAsync({ id: landlordId }));
//     router.back();
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Loader2 className="w-8 h-8 animate-spin text-[#6A5ACD]" />
//       </div>
//     );
//   }

//   if (!singleLandlord) {
//     return (
//       <div className="flex items-center justify-center min-h-screen text-slate-500">
//         Landlord not found
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center gap-4 mb-12">
//           <button 
//             onClick={() => router.back()}
//             className="p-2 hover:bg-slate-200 rounded-xl transition-all"
//           >
//             <ArrowLeft size={20} className="text-slate-600" />
//           </button>
//           <div>
//             <h1 className="text-3xl font-black text-slate-900">Landlord Details</h1>
//             <p className="text-slate-500 mt-1">Complete profile and KYC information</p>
//           </div>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Left Column - Basic Info */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Profile Header */}
//             <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
//               <div className="flex items-start gap-6">
//                 <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
//                   {singleLandlord.avatar ? (
//                     <img 
//                       src={singleLandlord.avatar} 
//                       alt={singleLandlord.fullName}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-full h-full bg-[#6A5ACD]/10 text-[#6A5ACD] flex items-center justify-center font-bold text-xl">
//                       {singleLandlord.fullName.charAt(0).toUpperCase()}
//                     </div>
//                   )}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h2 className="text-2xl font-black text-slate-900 mb-2">
//                     {singleLandlord.fullName}
//                   </h2>
//                   <div className="flex items-center gap-2 mb-4">
//                     <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full">
//                       {singleLandlord.status}
//                     </span>
//                     <span className={`px-3 py-1 text-xs font-bold rounded-full ${
//                       singleLandlord.kycStatus === 'APPROVED' 
//                         ? 'bg-emerald-50 text-emerald-600' 
//                         : singleLandlord.kycStatus === 'REJECTED'
//                         ? 'bg-rose-50 text-rose-600'
//                         : 'bg-amber-50 text-amber-600'
//                     }`}>
//                       {singleLandlord.kycStatus}
//                     </span>
//                   </div>
//                   <p className="text-sm text-slate-500 mb-2">User ID: {singleLandlord.landlordId}</p>
//                   {/* <p className="text-sm text-slate-500">Joined: {singleLandlord.dateJoined}</p> */}
//                 </div>
//               </div>
//             </div>

//             {/* Contact Info */}
//             <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
//               <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
//                 <Mail className="w-5 h-5 text-slate-400" />
//                 Contact Information
//               </h3>
//               <div className="space-y-4">
//                 <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
//                   <Mail className="w-5 h-5 text-slate-400 flex-shrink-0" />
//                   <span className="font-medium text-slate-900">{singleLandlord.email}</span>
//                 </div>
//                 <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
//                   <Phone className="w-5 h-5 text-slate-400 flex-shrink-0" />
//                   <span className="font-medium text-slate-900">{singleLandlord.phone || '—'}</span>
//                 </div>
//                 <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
//                   <div className="w-5 h-5 text-slate-400 flex-shrink-0">📍</div>
//                   {/* <span className="font-medium text-slate-900">{singleLandlord.address || '—'}</span> */}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Column - KYC Documents */}
//           <div className="space-y-6">
//             {/* KYC Status */}
//             <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
//               <h3 className="text-xl font-bold text-slate-900 mb-6">KYC Verification</h3>
//               <div className={`p-4 rounded-2xl text-center ${
//                 singleLandlord.kycStatus === 'APPROVED' 
//                   ? 'bg-emerald-50 border-2 border-emerald-100' 
//                   : singleLandlord.kycStatus === 'REJECTED'
//                   ? 'bg-rose-50 border-2 border-rose-100'
//                   : 'bg-amber-50 border-2 border-amber-100'
//               }`}>
//                 {singleLandlord.kycStatus === 'APPROVED' && <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />}
//                 {singleLandlord.kycStatus === 'PENDING' && <Clock className="w-12 h-12 text-amber-500 mx-auto mb-3" />}
//                 {singleLandlord.kycStatus === 'REJECTED' && <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />}
//                 <p className="text-2xl font-black capitalize">{singleLandlord.kycStatus}</p>
//               </div>
//             </div>

//             {/* Documents */}
//             <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
//               <h3 className="text-xl font-bold text-slate-900 mb-6">Documents</h3>
//               <div className="space-y-4">
//                 <div>
//                   <p className="font-medium text-slate-900 mb-2">Aadhar Card</p>
//                   <p className="text-sm text-slate-500 mb-3">{singleLandlord.aadharNumber}</p>
//                   <div className="grid grid-cols-2 gap-2">
//                     <img src={kycDocs.aadharFront} alt="Aadhar Front" className="w-full h-24 object-cover rounded-xl border-2 border-slate-100 hover:border-[#6A5ACD] transition-all cursor-pointer" />
//                     <img src={kycDocs.aadharBack} alt="Aadhar Back" className="w-full h-24 object-cover rounded-xl border-2 border-slate-100 hover:border-[#6A5ACD] transition-all cursor-pointer" />
//                   </div>
//                 </div>
//                 <div>
//                   <p className="font-medium text-slate-900 mb-2">PAN Card</p>
//                   <p className="text-sm text-slate-500 mb-3">{singleLandlord.panNumber}</p>
//                   <img src={kycDocs.panFront} alt="PAN Card" className="w-full h-24 object-cover rounded-xl border-2 border-slate-100 hover:border-[#6A5ACD] transition-all cursor-pointer" />
//                 </div>
//               </div>
//             </div>

//             {/* Actions */}
//             {singleLandlord.kycStatus === 'PENDING' && (
//               <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
//                 <div className="flex gap-3">
//                   <button 
//                     onClick={handleRejectKyc}
//                     className="flex-1 px-6 py-3 bg-rose-50 text-rose-600 border-2 border-rose-100 rounded-2xl font-bold text-sm hover:bg-rose-100 transition-all shadow-lg hover:shadow-xl"
//                   >
//                     <Ban className="w-4 h-4 inline mr-2" />
//                     Reject KYC
//                   </button>
//                   <button 
//                     onClick={handleApproveKyc}
//                     className="flex-1 px-6 py-3 bg-emerald-50 text-emerald-600 border-2 border-emerald-100 rounded-2xl font-bold text-sm hover:bg-emerald-100 transition-all shadow-lg hover:shadow-xl"
//                   >
//                     <CheckCircle className="w-4 h-4 inline mr-2" />
//                     Approve KYC
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LandlordDetailsPage;


'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  approveKycAsync,
  rejectKycAsync,
  fetchSingleLandlordAsync,
} from '@/features/users/usersThunks';
import {
  ArrowLeft,
  Mail,
  Phone,
  ShieldCheck,
  Clock,
  AlertCircle,
  Ban,
  CheckCircle,
  Eye,
} from 'lucide-react';
import { Loader2 } from 'lucide-react';

const LandlordDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const landlordId = params.id as string;
  const [rejectModal, setRejectModal] = useState(false);     
const [rejectReason, setRejectReason] = useState('');
  const { singleLandlord, singleLoading } = useAppSelector(
    (state) => state.users
  );

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (landlordId) {
      dispatch(fetchSingleLandlordAsync(landlordId));
    }
  }, [dispatch, landlordId]);

  const handleApprove = () => {
    dispatch(approveKycAsync({ id: landlordId }));

    // console.log("idRi",result.payload.data.id)
    //   console.log("statusRi",result.data.status)
    //     sessionStorage.setItem('kycId', result.data.kycId);
    //   sessionStorage.setItem('kycStatus', result.data.kycStatus);
    //   console.log("KYC approve result:", result);
    router.back();
  };

  // const handleReject = () => {
  //   dispatch(rejectKycAsync({ id: landlordId }));
  //   router.back();
  // };

  const handleReject = () => {
  setRejectModal(true);  // ✅ Opens modal
};

const handleConfirmReject = () => {
  dispatch(rejectKycAsync({ id: landlordId, reason: rejectReason }));
  setRejectModal(false);
  setRejectReason('');
  router.back();
};


  if (singleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!singleLandlord) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Landlord not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg bg-white border hover:bg-slate-50"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Landlord Details
            </h1>
            <p className="text-sm text-slate-500">
              Review profile and KYC documents
            </p>
          </div>
        </div>

        {/* Profile */}
        <div className="bg-white rounded-2xl border p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">
              {singleLandlord.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-semibold text-lg">
                {singleLandlord.fullName}
              </h2>
              <p className="text-sm text-slate-500">
                {singleLandlord.landlordId}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail size={16} />
              {singleLandlord.email}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone size={16} />
              {singleLandlord.phone || '—'}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <StatusBadge
              label={singleLandlord.status}
              type={singleLandlord.status === 'active' ? 'success' : 'danger'}
            />
            <StatusBadge
              label={singleLandlord.kycStatus}
              type={
                singleLandlord.kycStatus === 'APPROVED'
                  ? 'success'
                  : singleLandlord.kycStatus === 'REJECTED'
                  ? 'danger'
                  : 'warning'
              }
            />
          </div>
        </div>

        {/* Identity Info */}
        <div className="bg-white rounded-2xl border p-6">
          <h3 className="font-semibold text-lg mb-4">Identity Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-slate-500">Aadhaar Number</p>
              <p className="font-medium">{singleLandlord.aadharNumber}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">PAN Number</p>
              <p className="font-medium">{singleLandlord.panNumber}</p>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-2xl border p-6">
          <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
            <ShieldCheck size={20} />
            KYC Documents
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DocumentCard
              title="Aadhaar Front"
              src={singleLandlord.aadharFrontUrl}
              onView={() => setPreviewImage(singleLandlord.aadharFrontUrl)}
            />
            <DocumentCard
              title="Aadhaar Back"
              src={singleLandlord.aadharBackUrl}
              onView={() => setPreviewImage(singleLandlord.aadharBackUrl)}
            />
            <DocumentCard
              title="PAN Card"
              src={singleLandlord.panFrontUrl}
              onView={() => setPreviewImage(singleLandlord.panFrontUrl)}
            />
          </div>
        </div>

 {singleLandlord.kycStatus === 'PENDING' && (
  <div className="mt-8 flex flex-col sm:flex-row gap-4">
  <button
    onClick={handleApprove}
    className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
  >
    <CheckCircle size={18} />
    Approve KYC
  </button>

  <button
    onClick={handleReject}
    className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
  >
    <Ban size={18} />
    Reject KYC
  </button>
</div>
)}



 {rejectModal && (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle size={24} className="text-red-500" />
              Reject KYC
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Please provide reason for rejection
            </p>
          </div>

          {/* Reason Selection */}
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Rejection Reason
              </label>
              
              {/* Preset Reasons */}
              <div className="space-y-2 mb-4">
                {[
                  'Documents unclear/illegible',
                  'Information mismatch',
                  'Expired documents',
                  'Invalid address proof',
                  'Photo quality issues'
                ].map((reason) => (
                  <button
                    key={reason}
                    onClick={() => setRejectReason(reason)}
                    className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                      rejectReason === reason
                        ? 'border-red-500 bg-red-50 text-red-800 shadow-md'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>

              {/* Custom Reason */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Or type custom reason
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter custom rejection reason..."
                  rows={3}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setRejectModal(false);
                  setRejectReason('');
                }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-4 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={!rejectReason.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Ban size={18} />
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl max-w-4xl w-full p-4 relative">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 text-slate-600"
            >
              ✕
            </button>
            <img
              src={previewImage}
              alt="Document Preview"
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------------- COMPONENTS ---------------- */

const StatusBadge = ({
  label,
  type,
}: {
  label: string;
  type: 'success' | 'warning' | 'danger';
}) => {
  const styles = {
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-rose-100 text-rose-700',
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${styles[type]}`}
    >
      {label}
    </span>
  );
};

const DocumentCard = ({
  title,
  src,
  onView,
}: {
  title: string;
  src: string;
  onView: () => void;
}) => (
  <div className="border rounded-xl overflow-hidden bg-slate-50">
    <div className="h-44 bg-slate-100">
      <img
        src={src}
        alt={title}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.src = '/api/placeholder/300/200';
        }}
      />
    </div>
    <div className="p-4 flex items-center justify-between">
      <p className="text-sm font-medium">{title}</p>
      <button
        onClick={onView}
        className="flex items-center gap-1 text-indigo-600 text-sm font-medium hover:underline"
      >
        <Eye size={14} />
        View
      </button>
    </div>
  </div>
);

export default LandlordDetailsPage;
