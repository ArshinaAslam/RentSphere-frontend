// 2. GlobalSpinner.tsx (create this)
// 'use client';
// import { useAppSelector } from '@/store/hooks';

// export default function GlobalSpinner() {
//   const { loading,userData } = useAppSelector(state => state.auth);

//   // ✅ Show spinner when loading OR no userData (your condition)
//   if (loading ) {
//     return (
//       <div className="fixed inset-0 z-[9999] bg-slate-50 flex items-center justify-center">
//         <div className="w-12 h-12">
//           <div className="w-full h-full border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin"></div>
//         </div>
//       </div>
//     );
//   }

//   return null;
// }


//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
//       <div className="flex flex-col items-center gap-3 bg-white/95 p-6 rounded-2xl shadow-2xl border max-w-sm">
//         <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
//         <p className="text-sm font-medium text-slate-900 text-center">Loading...</p>
//       </div>
//     </div>
//   );

// if (loading || !userData) {
//   return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center">
//       <div className="w-12 h-12">
//         <div className="w-full h-full border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin"></div>
//       </div>
//     </div>
//   );
// }

