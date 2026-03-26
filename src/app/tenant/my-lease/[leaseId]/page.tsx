'use client';

import { useEffect, useState } from 'react';

import { useParams, useRouter } from 'next/navigation';

import {
  ArrowLeft, FileText, CheckCircle,
  Users, PawPrint, Cigarette,
  Loader2, AlertTriangle, Pen,
  Clock, XCircle, Send, Eye, X, Download,
  User,
  MapPin,
  Home,
} from 'lucide-react';
import { toast } from 'sonner';

import Navbar  from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { clearActiveLease } from '@/features/lease/leaseSlice';
import {
  fetchTenantLeaseById,
  markLeaseAsViewedThunk,
  signLeaseThunk,
} from '@/features/lease/leaseThunk';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const UTILITY_LABELS: Record<string, string> = {
  electricity: 'Electricity',
  water:       'Water',
  wifi:        'WiFi',
  gas:         'Gas',
  maintenance: 'Maintenance',
};

const STATUS_CONFIG = {
  draft:      { label: 'Draft',          color: 'bg-slate-100 text-slate-600',     icon: FileText    },
  sent:       { label: 'Pending Review', color: 'bg-amber-100 text-amber-700',     icon: Send        },
  viewed:     { label: 'Reviewed',       color: 'bg-blue-100 text-blue-700',       icon: Eye         },
  signed:     { label: 'Signed',         color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  active:     { label: 'Active',         color: 'bg-green-100 text-green-700',     icon: CheckCircle },
  expired:    { label: 'Expired',        color: 'bg-orange-100 text-orange-700',   icon: Clock       },
  terminated: { label: 'Terminated',     color: 'bg-red-100 text-red-700',         icon: XCircle     },
};


export default function TenantLeaseDetailPage() {
  const { leaseId } = useParams<{ leaseId: string }>();
  const dispatch    = useAppDispatch();
  const router      = useRouter();
  const { activeLease, isLoading, isSubmitting } = useAppSelector(s => s.lease);

  const [showSignModal,   setShowSignModal]   = useState(false);
  const [signatureName,   setSignatureName]   = useState('');
  const [signatureError,  setSignatureError]  = useState('');
  const [hasMarkedViewed, setHasMarkedViewed] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const propertyData = typeof activeLease?.propertyId === 'object' && activeLease.propertyId !== null
  ? activeLease.propertyId : null;

const landlordData = typeof activeLease?.landlordId === 'object' && activeLease.landlordId !== null
  ? activeLease.landlordId : null;

const tenantData = typeof activeLease?.tenantId === 'object' && activeLease.tenantId !== null
  ? activeLease.tenantId : null;


  useEffect(() => {
    if (leaseId) void dispatch(fetchTenantLeaseById(leaseId));
    return () => { dispatch(clearActiveLease()); };
  }, [leaseId, dispatch]);


  useEffect(() => {
    if (activeLease && activeLease.status === 'sent' && !hasMarkedViewed) {
      setHasMarkedViewed(true);
      void dispatch(markLeaseAsViewedThunk(activeLease._id));
    }
  }, [activeLease, hasMarkedViewed, dispatch]);

  const formatDate     = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const formatCurrency = (n: number) => `₹${n.toLocaleString('en-IN')}`;
  const getDuration    = () => {
    if (!activeLease) return '';
    const months =
      (new Date(activeLease.endDate).getFullYear()  - new Date(activeLease.startDate).getFullYear()) * 12 +
      (new Date(activeLease.endDate).getMonth()     - new Date(activeLease.startDate).getMonth());
    return months > 0 ? `${months} month${months > 1 ? 's' : ''}` : 'Less than a month';
  };
  const ordinal = (n: number) =>
    n + (['th','st','nd','rd'][(n % 100 > 10 && n % 100 < 14) ? 0 : Math.min(n % 10, 4)] ?? 'th');

  // ── Sign handler ──
  const handleSign = async () => {
    if (!signatureName.trim()) { setSignatureError('Please enter your full name to sign'); return; }
    if (!activeLease) return;
    const result = await dispatch(signLeaseThunk({ leaseId: activeLease._id, signatureName: signatureName.trim() }));
    if (signLeaseThunk.fulfilled.match(result)) {
      toast.success('Lease signed successfully!');
      setShowSignModal(false);
      setSignatureName('');
    } else {
      toast.error(typeof result.payload === 'string' ? result.payload : 'Failed to sign lease');
    }
  };

  // ── PDF download handler ──
   const handleDownloadPDF = async () => {
   if (!activeLease) return;
   setIsGeneratingPDF(true);
   const toastId = toast.loading('Generating PDF...');
 
   try {
     const { jsPDF } = await import('jspdf');
     const pdf = new jsPDF('p', 'mm', 'a4');
     const w   = pdf.internal.pageSize.getWidth();
     let   y   = 20;
 
     const rule = () => {
       pdf.setDrawColor('#e2e8f0');
       pdf.line(20, y, w - 20, y);
       y += 6;
     };
 
     const newPageIfNeeded = () => {
       if (y > 265) { pdf.addPage(); y = 20; }
     };
 
     const drawBox = (label: string, value: string, xOffset: number, boxW: number) => {
       pdf.setFillColor('#f8fafc');
       pdf.roundedRect(20 + xOffset, y, boxW, 18, 2, 2, 'F');
       pdf.setFontSize(8); pdf.setTextColor('#94a3b8'); pdf.setFont('helvetica', 'normal');
       pdf.text(label, 24 + xOffset, y + 6);
       pdf.setFontSize(10); pdf.setTextColor('#1e293b'); pdf.setFont('helvetica', 'bold');
       pdf.text(String(value), 24 + xOffset, y + 14);
     };
 
     // Header
     pdf.setFillColor('#1e293b');
     pdf.rect(0, 0, w, 35, 'F');
     pdf.setFontSize(18); pdf.setFont('helvetica', 'bold'); pdf.setTextColor('#ffffff');
     pdf.text('LEASE AGREEMENT', w / 2, 18, { align: 'center' });
     pdf.setFontSize(10); pdf.setFont('helvetica', 'normal');
     pdf.text(activeLease.leaseType === 'fixed' ? 'Fixed Term Tenancy' : 'Month-to-Month Tenancy', w / 2, 27, { align: 'center' });
     y = 45;
 
     // Parties & Property
     rule();
     pdf.setFontSize(11); pdf.setFont('helvetica', 'bold'); pdf.setTextColor('#64748b');
     pdf.text('PARTIES & PROPERTY', 20, y); y += 8;
 
     if (propertyData) {
       pdf.setFillColor('#f8fafc');
       pdf.roundedRect(20, y, w - 40, 16, 2, 2, 'F');
       pdf.setFontSize(8); pdf.setTextColor('#94a3b8'); pdf.setFont('helvetica', 'normal');
       pdf.text('PROPERTY', 24, y + 6);
       pdf.setFontSize(10); pdf.setTextColor('#1e293b'); pdf.setFont('helvetica', 'bold');
       pdf.text(`${propertyData.title}  —  ${propertyData.city}, ${propertyData.state}`, 24, y + 13);
       y += 20;
     }
 
     const colW = (w - 45) / 2;
     if (landlordData) {
       drawBox('Landlord', `${landlordData.firstName} ${landlordData.lastName}  `, 0, colW);
     }
     if (tenantData) {
       drawBox('Tenant', `${tenantData.firstName} ${tenantData.lastName}  `, colW + 5, colW);
     }
     y += 22;
 
     // Intro
 
 pdf.setFillColor('#f8fafc');
 const intro1 = `This Lease Agreement is for a monthly rent of ${formatCurrency(activeLease.rentAmount)}, running from `;
 const intro2 = `${formatDate(activeLease.startDate)} to ${formatDate(activeLease.endDate)}.`;
 pdf.setFontSize(9);
 const introH = 26; 
 pdf.roundedRect(20, y, w - 40, introH, 2, 2, 'F');
 pdf.setTextColor('#475569'); pdf.setFont('helvetica', 'normal');
 pdf.text(intro1, 25, y + 8);
 pdf.text(intro2, 25, y + 18);
 y += introH + 8;
 
     // Financial
     rule();
     pdf.setFontSize(11); pdf.setFont('helvetica', 'bold'); pdf.setTextColor('#64748b');
     pdf.text('FINANCIAL TERMS', 20, y); y += 8;
     drawBox('Monthly Rent',     formatCurrency(activeLease.rentAmount),     0,        colW);
     drawBox('Security Deposit', formatCurrency(activeLease.securityDeposit), colW + 5, colW);
     y += 22;
     const dueSuffix = activeLease.paymentDueDay === 1 ? 'st' : activeLease.paymentDueDay === 2 ? 'nd' : activeLease.paymentDueDay === 3 ? 'rd' : 'th';
     drawBox('Payment Due', `${activeLease.paymentDueDay}${dueSuffix} of month`, 0, colW);
     drawBox('Late Fee',    activeLease.lateFee > 0 ? formatCurrency(activeLease.lateFee) : 'None', colW + 5, colW);
     y += 22;
 
     if (activeLease.utilitiesIncluded.length > 0) {
       y += 4;
       pdf.setFontSize(9); pdf.setTextColor('#64748b'); pdf.setFont('helvetica', 'bold');
       pdf.text('UTILITIES INCLUDED', 20, y); y += 6;
       pdf.setFont('helvetica', 'normal'); pdf.setTextColor('#1e293b');
       pdf.text(activeLease.utilitiesIncluded.map((u: string) => UTILITY_LABELS[u] ?? u).join('   •   '), 20, y);
       y += 10;
     }
 
     // Duration
     newPageIfNeeded(); y += 4; rule();
     pdf.setFontSize(11); pdf.setFont('helvetica', 'bold'); pdf.setTextColor('#64748b');
     pdf.text('LEASE DURATION', 20, y); y += 8;
     drawBox('Start Date', formatDate(activeLease.startDate), 0,        colW);
     drawBox('End Date',   formatDate(activeLease.endDate),   colW + 5, colW);
     y += 22;
     drawBox('Duration',      getDuration(),                      0,        colW);
     drawBox('Notice Period', `${activeLease.noticePeriod} days`, colW + 5, colW);
     y += 22;
 
     // Rules
     newPageIfNeeded(); y += 4; rule();
     pdf.setFontSize(11); pdf.setFont('helvetica', 'bold'); pdf.setTextColor('#64748b');
     pdf.text('RULES & RESTRICTIONS', 20, y); y += 8;
     const rW = (w - 50) / 3;
     drawBox('Max Occupants', String(activeLease.maxOccupants),              0,            rW);
     drawBox('Pets',          activeLease.petsAllowed    ? 'Allowed' : 'Not Allowed', rW + 5,       rW);
     drawBox('Smoking',       activeLease.smokingAllowed ? 'Allowed' : 'Not Allowed', (rW + 5) * 2, rW);
     y += 22;
 
     // Terms
     if (activeLease.termsAndConditions) {
       newPageIfNeeded(); y += 4; rule();
       pdf.setFontSize(11); pdf.setFont('helvetica', 'bold'); pdf.setTextColor('#64748b');
       pdf.text('TERMS & CONDITIONS', 20, y); y += 8;
       pdf.setFillColor('#f8fafc');
       const termsLines = pdf.splitTextToSize(activeLease.termsAndConditions, w - 50);
       const termsH = termsLines.length * 5 + 10;
       pdf.roundedRect(20, y, w - 40, termsH, 2, 2, 'F');
       pdf.setFontSize(9); pdf.setTextColor('#475569'); pdf.setFont('helvetica', 'normal');
       pdf.text(termsLines, 25, y + 7);
       y += termsH + 6;
     }
 
     // Signatures
     newPageIfNeeded(); y += 4; rule();
     pdf.setFontSize(11); pdf.setFont('helvetica', 'bold'); pdf.setTextColor('#64748b');
     pdf.text('SIGNATURES', 20, y); y += 8;
     const sigW = (w - 45) / 2;
 
     // Landlord box
     pdf.setFillColor(activeLease.landlordSignature ? '#dbeafe' : '#f8fafc');
     pdf.roundedRect(20, y, sigW, 30, 2, 2, 'F');
     pdf.setFontSize(8); pdf.setTextColor('#64748b'); pdf.setFont('helvetica', 'bold');
     pdf.text('LANDLORD', 25, y + 7);
     if (activeLease.landlordSignature) {
       pdf.setFontSize(12); pdf.setTextColor('#1e40af'); pdf.setFont('helvetica', 'bolditalic');
       pdf.text(activeLease.landlordSignature.name, 25, y + 18);
       pdf.setFontSize(8); pdf.setFont('helvetica', 'normal'); pdf.setTextColor('#2563eb');
       pdf.text(`Signed on ${formatDate(activeLease.landlordSignature.signedAt)}`, 25, y + 25);
     } else {
       pdf.setDrawColor('#cbd5e1'); pdf.setLineWidth(0.5);
       pdf.line(25, y + 22, 20 + sigW - 5, y + 22);
       pdf.setFontSize(8); pdf.setTextColor('#94a3b8'); pdf.setFont('helvetica', 'normal');
       pdf.text('Awaiting landlord signature', 25, y + 28);
     }
 
     // Tenant box
     pdf.setFillColor(activeLease.tenantSignature ? '#d1fae5' : '#f8fafc');
     pdf.roundedRect(25 + sigW, y, sigW, 30, 2, 2, 'F');
     pdf.setFontSize(8); pdf.setTextColor('#64748b'); pdf.setFont('helvetica', 'bold');
     pdf.text('TENANT', 30 + sigW, y + 7);
     if (activeLease.tenantSignature) {
       pdf.setFontSize(12); pdf.setTextColor('#065f46'); pdf.setFont('helvetica', 'bolditalic');
       pdf.text(activeLease.tenantSignature.name, 30 + sigW, y + 18);
       pdf.setFontSize(8); pdf.setFont('helvetica', 'normal'); pdf.setTextColor('#059669');
       pdf.text(`Signed on ${formatDate(activeLease.tenantSignature.signedAt)}`, 30 + sigW, y + 25);
     } else {
       pdf.setDrawColor('#cbd5e1'); pdf.setLineWidth(0.5);
       pdf.line(30 + sigW, y + 22, 25 + sigW * 2, y + 22);
       pdf.setFontSize(8); pdf.setTextColor('#94a3b8'); pdf.setFont('helvetica', 'normal');
       pdf.text('Awaiting tenant signature', 30 + sigW, y + 28);
     }
 
     pdf.save(`lease-${activeLease._id.slice(-8).toUpperCase()}.pdf`);
     toast.dismiss(toastId);
     toast.success('PDF downloaded!');
   } catch (err) {
     console.error('PDF error:', err);
     toast.dismiss(toastId);
     toast.error('Failed to generate PDF');
   } finally {
     setIsGeneratingPDF(false);
   }
 };

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar /><Sidebar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)] pt-16 pl-64">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      </div>
    );
  }

  // ── Not found state ──
  if (!activeLease) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar /><Sidebar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] pt-16 pl-64">
          <FileText className="w-12 h-12 text-slate-300 mb-3" />
          <p className="text-slate-500 font-medium">Lease not found</p>
          <button onClick={() => router.push('/tenant/lease')} className="mt-4 text-emerald-600 text-sm font-semibold hover:underline">
            Back to leases
          </button>
        </div>
      </div>
    );
  }

  const cfg        = STATUS_CONFIG[activeLease.status as keyof typeof STATUS_CONFIG];
  const StatusIcon = cfg.icon;
  const canSign    = ['sent', 'viewed'].includes(activeLease.status);
  const isSigned   = ['signed', 'active', 'expired', 'terminated'].includes(activeLease.status);

  // ── Main render ──
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Sidebar />

      <main className="pt-16 pl-64">
        <div className="max-w-3xl mx-auto px-6 py-8">

          {/* ── Header ── */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/tenant/lease')}
                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-200 transition"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900">Lease Agreement</h1>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {cfg.label}
                  </span>
                </div>
                <p className="text-slate-400 text-xs mt-0.5">#{activeLease._id.slice(-12).toUpperCase()}</p>
              </div>
            </div>

            {/* Download PDF button */}
            <button
              onClick={() => void handleDownloadPDF()}
              disabled={isGeneratingPDF}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition disabled:opacity-50"
            >
              {isGeneratingPDF
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Download className="w-4 h-4" />
              }
              Download PDF
            </button>
          </div>

          {/* ── Action banner ── */}
          {canSign && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-800">Your signature is required</p>
                  <p className="text-xs text-amber-600">Please review all terms carefully before signing</p>
                </div>
              </div>
              <button
                onClick={() => setShowSignModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition"
              >
                <Pen className="w-3.5 h-3.5" /> Sign Lease
              </button>
            </div>
          )}

          {/* ── Lease Document ── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">

            <div className="bg-slate-800 px-8 py-6 text-center">
              <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h2 className="text-lg font-bold text-white tracking-wide">LEASE AGREEMENT</h2>
              <p className="text-slate-400 text-sm mt-1">
                {activeLease.leaseType === 'fixed' ? 'Fixed Term' : 'Month-to-Month'} Tenancy
              </p>
            </div>

            <div className="px-8 py-6 space-y-6">

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-sm text-slate-600 leading-relaxed">
                  This Lease Agreement is entered into for the rental property associated with this agreement.
                  The tenant agrees to pay a monthly rent of{' '}
                  <strong className="text-slate-800">{formatCurrency(activeLease.rentAmount)}</strong> and
                  abide by all terms and conditions stated herein. The lease runs from{' '}
                  <strong className="text-slate-800">{formatDate(activeLease.startDate)}</strong> to{' '}
                  <strong className="text-slate-800">{formatDate(activeLease.endDate)}</strong>.
                </p>
              </div>

               {(propertyData ?? landlordData ?? tenantData) && (
    <div className="space-y-3">
      <SectionTitle>Parties & Property</SectionTitle>

      {propertyData && (
        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Home className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium mb-0.5">Property</p>
            <p className="text-sm font-bold text-slate-800">{propertyData.title}</p>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" />
              {propertyData.address}, {propertyData.city}, {propertyData.state}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {landlordData && (
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {landlordData.avatar ? (
                <img src={landlordData.avatar} alt="" className="w-full h-full object-cover rounded-full" />
              ) : (
                <User className="w-4 h-4 text-blue-600" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-400 font-medium mb-0.5">Landlord</p>
              <p className="text-sm font-bold text-slate-800 truncate">{landlordData.firstName} {landlordData.lastName}</p>
              <p className="text-xs text-slate-500 truncate">{landlordData.email}</p>
              {landlordData.phone && <p className="text-xs text-slate-500">{landlordData.phone}</p>}
            </div>
          </div>
        )}

        {tenantData && (
          <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {tenantData.avatar ? (
                <img src={tenantData.avatar} alt="" className="w-full h-full object-cover rounded-full" />
              ) : (
                <User className="w-4 h-4 text-emerald-600" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-400 font-medium mb-0.5">Tenant</p>
              <p className="text-sm font-bold text-slate-800 truncate">{tenantData.firstName} {tenantData.lastName}</p>
              <p className="text-xs text-slate-500 truncate">{tenantData.email}</p>
              {tenantData.phone && <p className="text-xs text-slate-500">{tenantData.phone}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  )}


              <SectionTitle>Financial Terms</SectionTitle>
              <div className="grid grid-cols-2 gap-3">
                <InfoBox label="Monthly Rent"     value={formatCurrency(activeLease.rentAmount)} />
                <InfoBox label="Security Deposit" value={formatCurrency(activeLease.securityDeposit)} />
                <InfoBox label="Payment Due"      value={`${ordinal(activeLease.paymentDueDay)} of each month`} />
                <InfoBox label="Late Fee"         value={activeLease.lateFee > 0 ? formatCurrency(activeLease.lateFee) : 'None'} />
              </div>

              {activeLease.utilitiesIncluded.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Utilities Included</p>
                  <div className="flex flex-wrap gap-2">
                    {activeLease.utilitiesIncluded.map((u: string) => (
                      <span key={u} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg border border-emerald-100">
                        {UTILITY_LABELS[u] ?? u}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <SectionTitle>Lease Duration</SectionTitle>
              <div className="grid grid-cols-2 gap-3">
                <InfoBox label="Start Date"    value={formatDate(activeLease.startDate)} />
                <InfoBox label="End Date"      value={formatDate(activeLease.endDate)} />
                <InfoBox label="Duration"      value={getDuration()} />
                <InfoBox label="Notice Period" value={`${activeLease.noticePeriod} days`} />
              </div>

              <SectionTitle>Rules & Restrictions</SectionTitle>
              <div className="grid grid-cols-3 gap-3">
                <RuleBox icon={Users}     label="Max Occupants" value={String(activeLease.maxOccupants)} />
                <RuleBox icon={PawPrint}  label="Pets"          value={activeLease.petsAllowed    ? 'Allowed' : 'Not Allowed'} ok={activeLease.petsAllowed} />
                <RuleBox icon={Cigarette} label="Smoking"       value={activeLease.smokingAllowed ? 'Allowed' : 'Not Allowed'} ok={activeLease.smokingAllowed} />
              </div>

              {activeLease.termsAndConditions && (
                <>
                  <SectionTitle>Terms & Conditions</SectionTitle>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {activeLease.termsAndConditions}
                    </p>
                  </div>
                </>
              )}

              <SectionTitle>Signatures</SectionTitle>
              <div className="grid grid-cols-2 gap-4">

                {/* Landlord */}
                <div className={`border rounded-xl p-4 ${activeLease.landlordSignature ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200'}`}>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Landlord</p>
                  {activeLease.landlordSignature ? (
                    <>
                      <p className="text-base font-semibold text-emerald-800 italic mb-1">{activeLease.landlordSignature.name}</p>
                      <p className="text-xs text-emerald-600">Signed on {formatDate(activeLease.landlordSignature.signedAt)}</p>
                    </>
                  ) : (
                    <>
                      <div className="h-10 border-b-2 border-dashed border-slate-300 mb-2" />
                      <p className="text-xs text-slate-400">Awaiting landlord signature</p>
                    </>
                  )}
                </div>

                {/* Tenant */}
                <div className={`border rounded-xl p-4 ${isSigned ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200'}`}>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Tenant</p>
                  {activeLease.tenantSignature ? (
                    <>
                      <p className="text-base font-semibold text-emerald-800 italic mb-1">{activeLease.tenantSignature.name}</p>
                      <p className="text-xs text-emerald-600">Signed on {formatDate(activeLease.tenantSignature.signedAt)}</p>
                    </>
                  ) : (
                    <>
                      <div className="h-10 border-b-2 border-dashed border-slate-300 mb-2" />
                      <p className="text-xs text-slate-400">Awaiting tenant signature</p>
                    </>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* ── Bottom buttons ── */}
          <div className="space-y-3">
            {canSign && (
              <button
                onClick={() => setShowSignModal(true)}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl transition"
              >
                <Pen className="w-4 h-4" /> Sign This Lease Agreement
              </button>
            )}
            {isSigned && activeLease.tenantSignature && (
              <div className="flex items-center justify-center gap-2 py-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <p className="text-sm font-semibold text-emerald-700">
                  You signed this lease on {formatDate(activeLease.tenantSignature.signedAt)}
                </p>
              </div>
            )}
          </div>

        </div>
      </main>




      {/* ── Sign Modal ── */}
      {showSignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <Pen className="w-6 h-6 text-emerald-600" />
              </div>
              <button
                onClick={() => { setShowSignModal(false); setSignatureName(''); setSignatureError(''); }}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">Sign Lease Agreement</h3>
            <p className="text-sm text-slate-500 mb-5">
              By signing, you agree to all the terms and conditions stated in this lease agreement.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={signatureName}
                onChange={e => { setSignatureName(e.target.value); setSignatureError(''); }}
                placeholder="Enter your full legal name"
                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                  signatureError ? 'border-red-400 bg-red-50' : 'border-slate-200'
                }`}
              />
              {signatureError && <p className="text-red-500 text-xs mt-1">{signatureError}</p>}
              <p className="text-xs text-slate-400 mt-1.5">This will serve as your electronic signature</p>
            </div>

            {signatureName.trim() && (
              <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-200">
                <p className="text-xs text-slate-400 mb-1">Signature preview</p>
                <p className="text-lg font-semibold text-slate-800 italic">{signatureName}</p>
              </div>
            )}

            <div className="bg-amber-50 rounded-xl p-3 mb-5 border border-amber-100">
              <p className="text-xs text-amber-700">
                ⚠️ This is a legally binding agreement. By clicking "Sign Now" you confirm you have read and agree to all terms.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowSignModal(false); setSignatureName(''); setSignatureError(''); }}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleSign()}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 rounded-xl transition flex items-center justify-center gap-2"
              >
                {isSubmitting
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing...</>
                  : <><Pen className="w-4 h-4" /> Sign Now</>
                }
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
} 


function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">{children}</p>
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
      <p className="text-xs text-slate-400 font-medium mb-0.5">{label}</p>
      <p className="text-sm font-bold text-slate-800">{value}</p>
    </div>
  );
}

function RuleBox({
  icon: Icon, label, value, ok,
}: {
  icon:   React.ElementType;
  label:  string;
  value:  string;
  ok?:    boolean;
}) {
  return (
    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col gap-1.5">
      <Icon className="w-4 h-4 text-slate-400" />
      <p className="text-xs text-slate-400 font-medium">{label}</p>
      <p className={`text-sm font-bold ${
        ok === undefined ? 'text-slate-800' : ok ? 'text-emerald-600' : 'text-red-500'
      }`}>
        {value}
      </p>
    </div>
  );
}