





// 'use client';

// import React from 'react';
// import { useRouter } from 'next/navigation';
// import { useForm, Controller, SubmitHandler } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { ShieldCheck, Upload, Camera, Info, CheckCircle2 } from 'lucide-react';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';

// import { kycFormSchema, KycFormValues } from '@/constants/authValidation';
// import { useAppDispatch } from '@/store/hooks';
// import { submitLandlordKYC } from '@/features/kyc/kycThunks';
// import UploadBox from '@/components/auth/UploadBox';

// const ReadOnlyField = ({ label, value }: { label: string; value: string }) => (
//   <div className="space-y-2">
//     <label className="block text-[0.7rem] font-bold text-gray-500 uppercase">
//       {label}
//     </label>
//     <div className="h-12 px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-gray-900 font-medium text-sm">
//       {value}
//     </div>
//   </div>
// );

// const KycVerificationPage = () => {
//   const router = useRouter();
//   const dispatch = useAppDispatch();


//   const email = typeof window !== 'undefined' ? sessionStorage.getItem('signupEmail') || '' : '';
//   const fullName = typeof window !== 'undefined' ? sessionStorage.getItem('fullName') || '' : '';
//   const phone = typeof window !== 'undefined' ? sessionStorage.getItem('phone') || '' : '';

//   const form = useForm<KycFormValues>({
//     resolver: zodResolver(kycFormSchema),
//     defaultValues: {
//       email: email,
//       aadhaarNumber: '',
//       panNumber: '',
//       aadhaarFront:undefined ,
//       aadhaarBack: undefined,
//       panCard:undefined,
//       selfie: undefined,
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

//      const { kycId } = result.payload.kycId;

//     if (submitLandlordKYC.fulfilled.match(result)) {
//       sessionStorage.setItem('kycId',kycId)
//       router.push('/landlord/kyc-pending');
//     } else {
//       alert('KYC submission failed: ' + result.payload);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans">
     

//       <main className="flex-1 max-w-4xl mx-auto w-full py-12 px-6">
//         {/* Header */}
//         <div className="text-center mb-10">
//           <h1 className="text-2xl font-bold text-gray-900 mb-3">Verify Your Identity with KYC</h1>
//           <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed">
//             Complete automated KYC verification to activate your landlord account instantly.
//             Your documents will be verified securely using government databases.
//           </p>
//           <div className="mt-6 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-[0.7rem] font-bold border border-emerald-100">
//             <ShieldCheck className="w-4 h-4" />
//             Bank‑level Security | Government Database Verified
//           </div>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           {/* Account Information */}
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
//               <Info className="w-3 h-3" />
//               Information incorrect? Contact support before proceeding.
//             </p>
//           </section>

//           {/* 1. Aadhaar Card */}
//           <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center gap-2 text-gray-800 font-bold text-sm">
//                 <div className="w-5 h-5 bg-emerald-600 rounded flex items-center justify-center text-white text-[10px]">1</div>
//                 Aadhaar Card
//               </div>
//               <span className="bg-red-50 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded">REQUIRED</span>
//             </div>

//             <div className="space-y-4">
//               {/* Aadhaar Number */}
//               <div className="space-y-2">
//                 <label className="text-[0.7rem] font-bold text-gray-500 uppercase">Aadhaar Number</label>
//                 <Controller
//                   name="aadhaarNumber"
//                   control={control}
//                   render={({ field }) => (
//                     <Input
//                       {...field}
//                       placeholder="Enter your 12-digit Aadhaar number"
//                       className="h-12 bg-gray-50/50 border-gray-100 rounded-xl"
//                     />
//                   )}
//                 />
//                 {errors.aadhaarNumber && (
//                   <p className="text-red-500 text-xs">{errors.aadhaarNumber.message}</p>
//                 )}
//               </div>

//               {/* Aadhaar Front & Back */}
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

//           {/* 2. PAN Card */}
//           <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center gap-2 text-gray-800 font-bold text-sm">
//                 <div className="w-5 h-5 bg-emerald-600 rounded flex items-center justify-center text-white text-[10px]">2</div>
//                 PAN Card
//               </div>
//               <span className="bg-red-50 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded">REQUIRED</span>
//             </div>

//             <div className="space-y-4">
//               {/* PAN Number */}
//               <div className="space-y-2">
//                 <label className="text-[0.7rem] font-bold text-gray-500 uppercase">PAN Number</label>
//                 <Controller
//                   name="panNumber"
//                   control={control}
//                   render={({ field }) => (
//                     <Input
//                       {...field}
//                       placeholder="Enter your 10-character PAN number"
//                       className="h-12 bg-gray-50/50 border-gray-100 rounded-xl"
//                     />
//                   )}
//                 />
//                 {errors.panNumber && (
//                   <p className="text-red-500 text-xs">{errors.panNumber.message}</p>
//                 )}
//               </div>

//               {/* PAN Card Upload */}
//               <div>
//                 <Controller
//                   name="panCard"
//                   control={control}
//                   render={({ field }) => (
//                     <UploadBox
//                       title="Upload PAN Card"
//                       subtitle="Clear photo of PAN card | Max 5MB"
//                       onChange={(file) => field.onChange(file)}
//                       error={!!errors.panCard}
//                     />
//                   )}
//                 />
//                 {errors.panCard && (
//                   <p className="text-red-500 text-xs">{errors.panCard.message}</p>
//                 )}
//               </div>
//             </div>
//           </section>

//           {/* 3. Selfie */}
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

//           {/* 4. Consent */}
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

//             {/* Action Buttons */}
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
//               Save Progress &amp; Complete Later
//             </Button>
//           </div>
//         </form>
//       </main>
//     </div>
//   );
// };

// export default KycVerificationPage;

'use client';

import React, { useDebugValue, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck, Info, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { kycFormSchema, KycFormValues } from '@/constants/authValidation';
import { useAppDispatch } from '@/store/hooks';
import { submitLandlordKYC } from '@/features/kyc/kycThunks';
import UploadBox from '@/components/auth/UploadBox';


const ReadOnlyField = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
      {label}
    </label>
    <div className="h-11 px-4 flex items-center bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium text-sm">
      {value || '—'}
    </div>
  </div>
);

const KycVerificationPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
     const [userData, setUserData] = useState({
    email: '',
    fullName: '',
    phone: ''
  });

 
   useEffect(() => {
    if (typeof window !== 'undefined') {
     const email = sessionStorage.getItem('signupEmail') || '';
    const fullName = sessionStorage.getItem('fullName') || '';
    const phone = sessionStorage.getItem('phone') || '';

    setUserData({ email, fullName, phone });

      
    }
  }, []);

  const form = useForm<KycFormValues>({
    resolver: zodResolver(kycFormSchema),
    defaultValues: {
     
      aadhaarNumber: '',
      panNumber: '',
      aadhaarFront: undefined,
      aadhaarBack: undefined,
      panCard: undefined,
      selfie: undefined,
      consent: false,
    },
  });


  const { 
  control, 
  handleSubmit, 
  formState: { errors, isSubmitting }, 
  getValues  
} = form;

  // const onSubmit: SubmitHandler<KycFormValues> = async (data) => {
  //   const formData = new FormData();
  //   formData.append('email', email);
  //   formData.append('aadhaarNumber', data.aadhaarNumber);
  //   formData.append('panNumber', data.panNumber);
  //   if (data.aadhaarFront) formData.append('aadhaarFront', data.aadhaarFront);
  //   if (data.aadhaarBack)  formData.append('aadhaarBack',  data.aadhaarBack);
  //   if (data.panCard)      formData.append('panCard',      data.panCard);
  //   if (data.selfie)       formData.append('selfie',       data.selfie);

  //   const result = await dispatch(submitLandlordKYC(formData));

  //   if (submitLandlordKYC.fulfilled.match(result)) {
  //     const { kycId } = result.payload;
  //     sessionStorage.setItem('kycId', kycId);
  //     router.push('/landlord/kyc-pending');
  //   } else {
  //     alert('KYC submission failed: ' + (result.payload?.message || 'Unknown error'));
  //   }
  // };
const onSubmit: SubmitHandler<KycFormValues> = async (data) => {
  console.log("reached")
  const formData = new FormData();
  
  
  formData.append('email', userData.email);
  formData.append('aadhaarNumber', data.aadhaarNumber);
  formData.append('panNumber', data.panNumber);
  
  
  const values = form.getValues();
  
  
  if (values.aadhaarFront) formData.append('aadhaarFront', values.aadhaarFront);
  if (values.aadhaarBack) formData.append('aadhaarBack', values.aadhaarBack);
  if (values.panCard) formData.append('panCard', values.panCard);
  if (values.selfie) formData.append('selfie', values.selfie);

  
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]); 
  }

  const result = await dispatch(submitLandlordKYC(formData));
   console.log('KYC Result:', result);
    if (submitLandlordKYC.fulfilled.match(result)) {
      console.log("yesss",result.payload)
       const { kycId,kycStatus } = result.payload;
      sessionStorage.setItem('kycId', result.payload.data.kycId);
      sessionStorage.setItem('kycStatus', result.payload.data.kycStatus);
      
  console.log('Retrieved KYC ID:', result.payload.data.kycId);  
  console.log('Retrieved Status:', result.payload.data.kycStatus);
      router.push('/landlord/kyc-pending');
    } else {
       console.error('KYC FAILED:', result.payload || result.error);
       alert('KYC submission failed')
    }
};

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-start justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl">
        {/* Header (outside card for emphasis) */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Landlord KYC Verification
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Complete secure identity verification to activate your landlord account. 
            All data is encrypted and verified against official government sources.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-5 py-2 rounded-full text-sm font-semibold border border-emerald-100 shadow-sm">
            <ShieldCheck className="w-5 h-5" />
            Bank-grade Security • UIDAI & Income Tax Verified
          </div>
        </div>

        {/* ── Single Big Card ──────────────────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100/80 overflow-hidden">
          <form
  onSubmit={handleSubmit(
    onSubmit,
    (errors) => {
      debugger;
      console.log("❌ FORM VALIDATION ERRORS:", errors);
    }
  )}
  className="divide-y divide-gray-100"
>

            {/* 0. Account Information */}
            <div className="p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-7">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ReadOnlyField label="Full Name" value={userData.fullName || '—'}  />
                <ReadOnlyField label="Email Address" value={userData.email || '—'} />
                <ReadOnlyField label="Phone Number" value={userData.phone || '—'}  />
              </div>

              <p className="mt-5 text-xs text-gray-500 flex items-center gap-2">
                <Info className="w-4 h-4 flex-shrink-0" />
                If any information is incorrect, please contact support before continuing.
              </p>
            </div>

            {/* 1. Aadhaar */}
            <div className="p-8 lg:p-10">
              <div className="flex items-center justify-between mb-7">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                    1
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Aadhaar Card</h2>
                </div>
                <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full">
                  REQUIRED
                </span>
              </div>

              <div className="space-y-7">
                {/* Aadhaar Number */}
                <div className="max-w-md">
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                    Aadhaar Number
                  </label>
                  <Controller
                    name="aadhaarNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="XXXX XXXX XXXX"
                        className="h-12 rounded-xl border-gray-200 bg-gray-50/70"
                      />
                    )}
                  />
                  {errors.aadhaarNumber && (
                    <p className="mt-1.5 text-xs text-red-600">{errors.aadhaarNumber.message}</p>
                  )}
                </div>

                {/* Front + Back */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                      Front Side
                    </label>
                  <Controller
  name="aadhaarFront"
  control={control}
  render={({ field }) => (
    <UploadBox
      title="Aadhaar Front"
      subtitle="JPG / PNG • Max 5 MB"
      onChange={field.onChange}
      value={field.value}
      error={!!errors.aadhaarFront}
    />
  )}
/>
                   {errors.aadhaarFront && (
  <p className="mt-1.5 text-xs text-red-600">
    {String(errors.aadhaarFront?.message || 'PAN card photo is required')}
  </p>
)}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                      Back Side
                    </label>
                    <Controller
                      name="aadhaarBack"
                      control={control}
                      render={({ field }) => (
                        <UploadBox
                          title="Aadhaar Back"
                          subtitle="JPG / PNG • Max 5 MB"
                          onChange={field.onChange}
      value={field.value}
                          error={!!errors.aadhaarBack}
                        />
                      )}
                    />
                   {errors.aadhaarBack && (
  <p className="mt-1.5 text-xs text-red-600">
    {String(errors.aadhaarBack?.message || 'PAN card photo is required')}
  </p>
)}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. PAN */}
            <div className="p-8 lg:p-10">
              <div className="flex items-center justify-between mb-7">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                    2
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">PAN Card</h2>
                </div>
                <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full">
                  REQUIRED
                </span>
              </div>

              <div className="space-y-7 max-w-2xl">
                {/* PAN Number */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                    PAN Number
                  </label>
                  <Controller
                    name="panNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="ABCDE1234F"
                        className="h-12 rounded-xl border-gray-200 bg-gray-50/70"
                      />
                    )}
                  />
                  {errors.panNumber && (
                    <p className="mt-1.5 text-xs text-red-600">{errors.panNumber.message}</p>
                  )}
                </div>

                {/* PAN Upload */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                    PAN Card Photo
                  </label>
                  <Controller
                    name="panCard"
                    control={control}
                    render={({ field }) => (
                      <UploadBox
                        title="Upload PAN Card"
                        subtitle="Clear front side • JPG / PNG • Max 5 MB"
                        onChange={field.onChange}
      value={field.value}
                        error={!!errors.panCard}
                      />
                    )}
                  />
{errors.panCard && (
  <p className="mt-1.5 text-xs text-red-600">
    {String(errors.panCard?.message || 'PAN card photo is required')}
  </p>
)}


                </div>
              </div>
            </div>

            {/* 3. Selfie */}
            <div className="p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                  3
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Live Selfie Verification</h2>
              </div>

              <p className="text-gray-600 text-sm mb-6">
                Upload a clear, well-lit selfie of your face. This helps us match your identity securely.
              </p>

              <Controller
                name="selfie"
                control={control}
                render={({ field }) => (
                  <UploadBox
                    title="Take or Upload Selfie"
                    subtitle="Face clearly visible • Max 5 MB"
                   onChange={field.onChange}
      value={field.value}
                    error={!!errors.selfie}
                  />
                )}
              />
             {errors.selfie && (
  <p className="mt-1.5 text-xs text-red-600">
    {String(errors.selfie?.message || 'PAN card photo is required')}
  </p>
)}
            </div>

            {/* Consent + Submit */}
            <div className="p-8 lg:p-10 bg-gray-50/40">
              <div className="space-y-6 max-w-3xl mx-auto">
                <div className="flex items-start gap-3">
                  <Controller
                    name="consent"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        id="consent"
                        className="mt-1.5 w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <label htmlFor="consent" className="text-sm text-gray-600 leading-relaxed">
                    I authorize RentSphere to verify my Aadhaar and PAN details with UIDAI and Income Tax Department 
                    databases solely for KYC compliance and identity verification. I confirm all uploaded documents are mine.
                  </label>
                </div>

                {errors.consent && (
                  <p className="text-xs text-red-600">{errors.consent.message}</p>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base rounded-2xl shadow-lg shadow-emerald-200/40 transition-all"
                >
                  {isSubmitting ? 'Verifying...' : 'Submit KYC & Start Verification'}
                </Button>

                {/* <button
                  type="button"
                  className="w-full text-gray-500 hover:text-gray-700 text-sm font-medium underline underline-offset-4"
                  onClick={() => alert('Draft saved. You can continue later from your dashboard.')}
                >
                  Save as Draft & Complete Later
                </button> */}
              </div>
            </div>
          </form>
        </div>

        {/* Optional footer note */}
        <p className="text-center text-xs text-gray-500 mt-8">
          Your information is encrypted and never shared without consent. © RentSphere 2026
        </p>
      </div>
    </div>
  );
};

export default KycVerificationPage;