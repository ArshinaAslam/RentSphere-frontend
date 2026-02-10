

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
  setRejectModal(true);  
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
