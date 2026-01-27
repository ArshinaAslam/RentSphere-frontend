// 'use client';

// import React from 'react';
// import {  useLocation } from 'react-router-dom';
// import { useForm, Controller, SubmitHandler } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { ShieldCheck, Upload, Camera, Info, CheckCircle2 } from 'lucide-react';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import AuthHeader from '@/components/auth/AuthHeader';
// import { kycFormSchema, KycFormValues } from '@/constants/validation';
// import { RootState } from '@/store';
// import { useAppDispatch } from '@/store/hooks';
// import { submitLandlordKYC } from '@/store/kycSlice';
// import { useRouter } from 'next/navigation';

// const KycVerificationPage = () => {
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//  const email = typeof window !== 'undefined' ? sessionStorage.getItem('signupEmail') || '' : '';
//   const fullName = typeof window !== 'undefined' ? sessionStorage.getItem('fullName') || '' : '';
//   const phone = typeof window !== 'undefined' ? sessionStorage.getItem('phone') || '' : '';

//   // ✅ 1. Use `form` variable (same as signup)
//   const form = useForm<KycFormValues>({
//     resolver: zodResolver(kycFormSchema),
//     defaultValues: {
//       email: email || '',
//       aadhaarNumber: '',
//       panNumber: '',
//       aadhaarFront: null,
//       aadhaarBack: null,
//       panCard: null,
//       selfie: null,
//       consent: false,
//     },
//   });

//   const { control, handleSubmit, formState: { errors, isSubmitting } } = form;

//   const onSubmit = async (data: KycFormValues) => {
//     const formData = new FormData();
//     formData.append('email', email);
//     formData.append('aadhaarNumber', data.aadhaarNumber);
//     formData.append('panNumber', data.panNumber);
//     formData.append('aadhaarFront', data.aadhaarFront);
//     formData.append('aadhaarBack', data.aadhaarBack);
//     formData.append('panCard', data.panCard);
//     formData.append('selfie', data.selfie);

//     const result = await dispatch(submitLandlordKYC(formData));
    
//     if (submitLandlordKYC.fulfilled.match(result)) {
//       router.push('/landlord/kyc/pending');
//     } else {
//       alert('KYC submission failed: ' + result.payload);
//     }
//   };


//   return (
//     <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans">
//       <AuthHeader authAction="signup" isAuthPage={true} />

//       <main className="flex-1 max-w-4xl mx-auto w-full py-12 px-6">
//         <div className="text-center mb-10">
//           <h1 className="text-2xl font-bold text-gray-900 mb-3">Verify Your Identity with KYC</h1>
//           <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed">
//             Complete automated KYC verification to activate your landlord account instantly.
//             Your documents will be verified securely using government databases.
//           </p>
//           <div className="mt-6 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-[0.7rem] font-bold border border-emerald-100">
//             <ShieldCheck className="w-4 h-4" />
//             Bank-level Security | Government Database Verified
//           </div>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
//             <div className="flex items-center gap-2 mb-6 text-gray-800 font-bold text-sm">
//               <CheckCircle2 className="w-4 h-4 text-emerald-600" />
//               Your Account Information
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <ReadOnlyField label="Full Name" value={fullName} />
//               <ReadOnlyField label="Email" value={email} />
//               <ReadOnlyField label="Phone Number" value={phone} />
//             </div>
//             <p className="mt-4 text-[0.65rem] text-gray-400 flex items-center gap-1.5">
//               <Info className="w-3 h-3" /> Information incorrect? Contact support before proceeding.
//             </p>
//           </section>

//           <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center gap-2 text-gray-800 font-bold text-sm">
//                 <div className="w-5 h-5 bg-emerald-600 rounded flex items-center justify-center text-white text-[10px]">1</div>
//                 Aadhaar Card
//               </div>
//               <span className="bg-red-50 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded">REQUIRED</span>
//             </div>
//             <div className="space-y-4">
//               <label className="text-[0.7rem] font-bold text-gray-500 uppercase">Aadhaar Number</label>
//               <Controller
//                 name="aadhaarNumber"
//                 control={control}
//                 render={({ field }) => (
//                   <Input
//                     {...field}
//                     placeholder="Enter your 12-digit Aadhaar number"
//                     className="h-12 bg-gray-50/50 border-gray-100 rounded-xl"
//                     error={!!errors.aadhaarNumber}
//                   />
//                 )}
//               />
//               {errors.aadhaarNumber && (
//                 <p className="text-red-500 text-xs">{errors.aadhaarNumber.message}</p>
//               )}
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-[0.7rem] font-bold text-gray-500 uppercase">Front Side</label>
//                   <Controller
//                     name="aadhaarFront"
//                     control={control}
//                     render={({ field }) => (
//                       <UploadBox
//                         title="Upload Aadhaar Front"
//                         subtitle="Front photo of Aadhaar | Max 5MB"
//                         onChange={(file) => field.onChange(file)}
//                         error={!!errors.aadhaarFront}
//                       />
//                     )}
//                   />
//                   {errors.aadhaarFront && (
//                     <p className="text-red-500 text-xs">{errors.aadhaarFront.message}</p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="text-[0.7rem] font-bold text-gray-500 uppercase">Back Side</label>
//                   <Controller
//                     name="aadhaarBack"
//                     control={control}
//                     render={({ field }) => (
//                       <UploadBox
//                         title="Upload Aadhaar Back"
//                         subtitle="Back photo of Aadhaar | Max 5MB"
//                         onChange={(file) => field.onChange(file)}
//                         error={!!errors.aadhaarBack}
//                       />
//                     )}
//                   />
//                   {errors.aadhaarBack && (
//                     <p className="text-red-500 text-xs">{errors.aadhaarBack.message}</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </section>

//           <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center gap-2 text-gray-800 font-bold text-sm">
//                 <div className="w-5 h-5 bg-emerald-600 rounded flex items-center justify-center text-white text-[10px]">2</div>
//                 PAN Card
//               </div>
//               <span className="bg-red-50 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded">REQUIRED</span>
//             </div>
//             <div className="space-y-4">
//               <label className="text-[0.7rem] font-bold text-gray-500 uppercase">PAN Number</label>
//               <Controller
//                 name="panNumber"
//                 control={control}
//                 render={({ field }) => (
//                   <Input
//                     {...field}
//                     placeholder="Enter your 10-character PAN number"
//                     className="h-12 bg-gray-50/50 border-gray-100 rounded-xl"
//                     error={!!errors.panNumber}
//                   />
//                 )}
//               />
//               {errors.panNumber && (
//                 <p className="text-red-500 text-xs">{errors.panNumber.message}</p>
//               )}
//               <Controller
//                 name="panCard"
//                 control={control}
//                 render={({ field }) => (
//                   <UploadBox
//                     title="Upload PAN Card"
//                     subtitle="Clear photo of PAN card | Max 5MB"
//                     onChange={(file) => field.onChange(file)}
//                     error={!!errors.panCard}
//                   />
//                 )}
//               />
//               {errors.panCard && (
//                 <p className="text-red-500 text-xs">{errors.panCard.message}</p>
//               )}
//             </div>
//           </section>

//           <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-2 text-gray-800 font-bold text-sm">
//                 <div className="w-5 h-5 bg-emerald-600 rounded flex items-center justify-center text-white text-[10px]">3</div>
//                 Live Selfie
//               </div>
//             </div>
//             <p className="text-gray-400 text-[0.7rem] mb-6">Take or upload a clear selfie for AI-powered face verification.</p>

//             <Controller
//               name="selfie"
//               control={control}
//               render={({ field }) => (
//                 <UploadBox
//                   title="Upload Selfie"
//                   subtitle="Clear face photo | Max 5MB"
//                   onChange={(file) => field.onChange(file)}
//                   error={!!errors.selfie}
//                 />
//               )}
//             />
//             {errors.selfie && (
//               <p className="text-red-500 text-xs">{errors.selfie.message}</p>
//             )}
//           </section>

//           <div className="space-y-4 pt-6">
//             <div className="flex items-start gap-3">
//               <Controller
//                 name="consent"
//                 control={control}
//                 render={({ field }) => (
//                   <input
//                     type="checkbox"
//                     className="mt-1 accent-emerald-600"
//                     id="consent"
//                     checked={field.value}
//                     onChange={field.onChange}
//                   />
//                 )}
//               />
//               <label htmlFor="consent" className="text-[0.65rem] text-gray-500 leading-relaxed">
//                 I authorize RentSphere to verify my Aadhaar and PAN with government databases (UIDAI and Income Tax Department) for KYC compliance and identity verification purposes.
//               </label>
//             </div>
//             {errors.consent && (
//               <p className="text-red-500 text-xs">{errors.consent.message}</p>
//             )}
//             <Button
//               type="submit"
//               className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-xl shadow-emerald-100"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? 'Submitting KYC...' : 'Start Instant Verification'}
//             </Button>
//             <Button
//               variant="ghost"
//               className="w-full text-gray-400 text-xs font-bold hover:bg-transparent"
//               onClick={() => {
//                 alert('Draft saved! You can resume KYC later.');
//               }}
//             >
//               Save Progress & Complete Later
//             </Button>
//           </div>
//         </form>
//       </main>
//     </div>
//   );
// };

// export default KycVerificationPage;





'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck, Upload, Camera, Info, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AuthHeader from '@/components/auth/AuthHeader';
import { kycFormSchema, KycFormValues } from '@/constants/validation';
import { useAppDispatch } from '@/store/hooks';
import { submitLandlordKYC } from '@/features/kyc/kycThunks';
import UploadBox from '@/components/auth/UploadBox';

// Reusable readonly field for Account Info
const ReadOnlyField = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-2">
    <label className="block text-[0.7rem] font-bold text-gray-500 uppercase">
      {label}
    </label>
    <div className="h-12 px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-gray-900 font-medium text-sm">
      {value}
    </div>
  </div>
);

const KycVerificationPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Read from sessionStorage
  const email = typeof window !== 'undefined' ? sessionStorage.getItem('signupEmail') || '' : '';
  const fullName = typeof window !== 'undefined' ? sessionStorage.getItem('fullName') || '' : '';
  const phone = typeof window !== 'undefined' ? sessionStorage.getItem('phone') || '' : '';

  const form = useForm<KycFormValues>({
    resolver: zodResolver(kycFormSchema),
    defaultValues: {
      email: email,
      aadhaarNumber: '',
      panNumber: '',
      aadhaarFront:undefined ,
      aadhaarBack: undefined,
      panCard:undefined,
      selfie: undefined,
      consent: false,
    },
  });

  const { control, handleSubmit, formState: { errors, isSubmitting } } = form;

  const onSubmit = async (data: KycFormValues) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('aadhaarNumber', data.aadhaarNumber);
    formData.append('panNumber', data.panNumber);
    formData.append('aadhaarFront', data.aadhaarFront);
    formData.append('aadhaarBack', data.aadhaarBack);
    formData.append('panCard', data.panCard);
    formData.append('selfie', data.selfie);

    const result = await dispatch(submitLandlordKYC(formData));

     const { kycId } = result.payload.kycId;

    if (submitLandlordKYC.fulfilled.match(result)) {
      sessionStorage.setItem('kycId',kycId)
      router.push('/landlord/kyc-pending');
    } else {
      alert('KYC submission failed: ' + result.payload);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans">
      <AuthHeader authAction="signup" isAuthPage={true} />

      <main className="flex-1 max-w-4xl mx-auto w-full py-12 px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Verify Your Identity with KYC</h1>
          <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed">
            Complete automated KYC verification to activate your landlord account instantly.
            Your documents will be verified securely using government databases.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-[0.7rem] font-bold border border-emerald-100">
            <ShieldCheck className="w-4 h-4" />
            Bank‑level Security | Government Database Verified
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Account Information */}
          <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-gray-800 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Your Account Information
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ReadOnlyField label="Full Name" value={fullName} />
              <ReadOnlyField label="Email" value={email} />
              <ReadOnlyField label="Phone Number" value={phone} />
            </div>
            <p className="mt-4 text-[0.65rem] text-gray-400 flex items-center gap-1.5">
              <Info className="w-3 h-3" />
              Information incorrect? Contact support before proceeding.
            </p>
          </section>

          {/* 1. Aadhaar Card */}
          <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-gray-800 font-bold text-sm">
                <div className="w-5 h-5 bg-emerald-600 rounded flex items-center justify-center text-white text-[10px]">1</div>
                Aadhaar Card
              </div>
              <span className="bg-red-50 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded">REQUIRED</span>
            </div>

            <div className="space-y-4">
              {/* Aadhaar Number */}
              <div className="space-y-2">
                <label className="text-[0.7rem] font-bold text-gray-500 uppercase">Aadhaar Number</label>
                <Controller
                  name="aadhaarNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter your 12-digit Aadhaar number"
                      className="h-12 bg-gray-50/50 border-gray-100 rounded-xl"
                    />
                  )}
                />
                {errors.aadhaarNumber && (
                  <p className="text-red-500 text-xs">{errors.aadhaarNumber.message}</p>
                )}
              </div>

              {/* Aadhaar Front & Back */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[0.7rem] font-bold text-gray-500 uppercase">Front Side</label>
                  <Controller
                    name="aadhaarFront"
                    control={control}
                    render={({ field }) => (
                      <UploadBox
                        title="Upload Aadhaar Front"
                        subtitle="Front photo of Aadhaar | Max 5MB"
                        onChange={(file) => field.onChange(file)}
                        error={!!errors.aadhaarFront}
                      />
                    )}
                  />
                  {errors.aadhaarFront && (
                    <p className="text-red-500 text-xs">{errors.aadhaarFront.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-[0.7rem] font-bold text-gray-500 uppercase">Back Side</label>
                  <Controller
                    name="aadhaarBack"
                    control={control}
                    render={({ field }) => (
                      <UploadBox
                        title="Upload Aadhaar Back"
                        subtitle="Back photo of Aadhaar | Max 5MB"
                        onChange={(file) => field.onChange(file)}
                        error={!!errors.aadhaarBack}
                      />
                    )}
                  />
                  {errors.aadhaarBack && (
                    <p className="text-red-500 text-xs">{errors.aadhaarBack.message}</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* 2. PAN Card */}
          <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-gray-800 font-bold text-sm">
                <div className="w-5 h-5 bg-emerald-600 rounded flex items-center justify-center text-white text-[10px]">2</div>
                PAN Card
              </div>
              <span className="bg-red-50 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded">REQUIRED</span>
            </div>

            <div className="space-y-4">
              {/* PAN Number */}
              <div className="space-y-2">
                <label className="text-[0.7rem] font-bold text-gray-500 uppercase">PAN Number</label>
                <Controller
                  name="panNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter your 10-character PAN number"
                      className="h-12 bg-gray-50/50 border-gray-100 rounded-xl"
                    />
                  )}
                />
                {errors.panNumber && (
                  <p className="text-red-500 text-xs">{errors.panNumber.message}</p>
                )}
              </div>

              {/* PAN Card Upload */}
              <div>
                <Controller
                  name="panCard"
                  control={control}
                  render={({ field }) => (
                    <UploadBox
                      title="Upload PAN Card"
                      subtitle="Clear photo of PAN card | Max 5MB"
                      onChange={(file) => field.onChange(file)}
                      error={!!errors.panCard}
                    />
                  )}
                />
                {errors.panCard && (
                  <p className="text-red-500 text-xs">{errors.panCard.message}</p>
                )}
              </div>
            </div>
          </section>

          {/* 3. Selfie */}
          <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-gray-800 font-bold text-sm">
                <div className="w-5 h-5 bg-emerald-600 rounded flex items-center justify-center text-white text-[10px]">3</div>
                Live Selfie
              </div>
            </div>
            <p className="text-gray-400 text-[0.7rem] mb-6">Take or upload a clear selfie for AI-powered face verification.</p>

            <Controller
              name="selfie"
              control={control}
              render={({ field }) => (
                <UploadBox
                  title="Upload Selfie"
                  subtitle="Clear face photo | Max 5MB"
                  onChange={(file) => field.onChange(file)}
                  error={!!errors.selfie}
                />
              )}
            />
            {errors.selfie && (
              <p className="text-red-500 text-xs">{errors.selfie.message}</p>
            )}
          </section>

          {/* 4. Consent */}
          <div className="space-y-4 pt-6">
            <div className="flex items-start gap-3">
              <Controller
                name="consent"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    className="mt-1 accent-emerald-600"
                    id="consent"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <label htmlFor="consent" className="text-[0.65rem] text-gray-500 leading-relaxed">
                I authorize RentSphere to verify my Aadhaar and PAN with government databases (UIDAI and Income Tax Department) for KYC compliance and identity verification purposes.
              </label>
            </div>
            {errors.consent && (
              <p className="text-red-500 text-xs">{errors.consent.message}</p>
            )}

            {/* Action Buttons */}
            <Button
              type="submit"
              className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-xl shadow-emerald-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting KYC...' : 'Start Instant Verification'}
            </Button>

            <Button
              variant="ghost"
              className="w-full text-gray-400 text-xs font-bold hover:bg-transparent"
              onClick={() => {
                alert('Draft saved! You can resume KYC later.');
              }}
            >
              Save Progress &amp; Complete Later
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default KycVerificationPage;

