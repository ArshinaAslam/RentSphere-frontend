'use client';

import { useEffect, useState }   from 'react';

import { useParams, useRouter }  from 'next/navigation';

import {
  ArrowLeft, FileText, DollarSign, Calendar,
  Shield, CheckCircle, ChevronRight, ChevronLeft,
  Loader2, Zap, Wrench, PawPrint, Cigarette,
} from 'lucide-react';

import LandlordNavbar          from '@/components/layout/LandlordNavbar';
import LandlordSidebar         from '@/components/layout/LandlordSidebar';
import { clearActiveLease }    from '@/features/lease/leaseSlice';
import { fetchLeaseById , updateLeaseThunk }      from '@/features/lease/leaseThunk';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toast } from 'sonner';

const UTILITIES = [
  { value: 'electricity', label: 'Electricity', icon: Zap     },
  { value: 'water',       label: 'Water',       icon: Shield  },
  { value: 'wifi',        label: 'WiFi',        icon: Zap     },
  { value: 'gas',         label: 'Gas',         icon: Zap     },
  { value: 'maintenance', label: 'Maintenance', icon: Wrench  },
];

const STEPS = [
  { id: 1, label: 'Financial', icon: DollarSign },
  { id: 2, label: 'Duration',  icon: Calendar   },
  { id: 3, label: 'Rules',     icon: Shield     },
  { id: 4, label: 'Terms',     icon: FileText   },
];

interface FormData {
  rentAmount:         string;
  securityDeposit:    string;
  paymentDueDay:      string;
  lateFee:            string;
  startDate:          string;
  endDate:            string;
  leaseType:          'fixed' | 'monthly';
  petsAllowed:        boolean;
  smokingAllowed:     boolean;
  maxOccupants:       string;
  noticePeriod:       string;
  utilitiesIncluded:  string[];
  termsAndConditions: string;
}

export default function EditLeasePage() {
  const { leaseId } = useParams<{ leaseId: string }>();
  const dispatch    = useAppDispatch();
  const router      = useRouter();
  const { activeLease, isLoading, isSubmitting } = useAppSelector(s => s.lease);

  const [step,   setStep]   = useState(1);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [form,   setForm]   = useState<FormData>({
    rentAmount:         '',
    securityDeposit:    '',
    paymentDueDay:      '1',
    lateFee:            '0',
    startDate:          '',
    endDate:            '',
    leaseType:          'fixed',
    petsAllowed:        false,
    smokingAllowed:     false,
    maxOccupants:       '2',
    noticePeriod:       '30',
    utilitiesIncluded:  [],
    termsAndConditions: '',
  });

  useEffect(() => {
    if (leaseId) void dispatch(fetchLeaseById(leaseId));
    return () => { dispatch(clearActiveLease()); };
  }, [leaseId, dispatch]);

  
  useEffect(() => {
    if (activeLease) {
      setForm({
        rentAmount:         String(activeLease.rentAmount),
        securityDeposit:    String(activeLease.securityDeposit),
        paymentDueDay:      String(activeLease.paymentDueDay),
        lateFee:            String(activeLease.lateFee),
        startDate:          activeLease.startDate.split('T')[0],
        endDate:            activeLease.endDate.split('T')[0],
        leaseType:          activeLease.leaseType,
        petsAllowed:        activeLease.petsAllowed,
        smokingAllowed:     activeLease.smokingAllowed,
        maxOccupants:       String(activeLease.maxOccupants),
        noticePeriod:       String(activeLease.noticePeriod),
        utilitiesIncluded:  activeLease.utilitiesIncluded,
        termsAndConditions: activeLease.termsAndConditions,
      });
    }
  }, [activeLease]);

  const set = (field: keyof FormData, value: FormData[keyof FormData]) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const toggleUtility = (val: string) => {
    setForm(prev => ({
      ...prev,
      utilitiesIncluded: prev.utilitiesIncluded.includes(val)
        ? prev.utilitiesIncluded.filter(u => u !== val)
        : [...prev.utilitiesIncluded, val],
    }));
  };

 const validateStep = (s: number): boolean => {
  const newErrors: Partial<Record<keyof FormData, string>> = {};

 if (s === 1) {
    const rent    = Number(form.rentAmount);
    const deposit = Number(form.securityDeposit);
    const dueDay  = Number(form.paymentDueDay);
    const late    = Number(form.lateFee);

    if (!form.rentAmount)
      newErrors.rentAmount = 'Rent amount is required';         
    else if (isNaN(rent) || rent <= 0)
      newErrors.rentAmount = 'Rent amount must be greater than 0';

    if (form.securityDeposit === '')
      newErrors.securityDeposit = 'Security deposit is required'; 
    else if (isNaN(deposit) || deposit < 0)
      newErrors.securityDeposit = 'Security deposit cannot be negative';
    else if (deposit > rent)
      newErrors.securityDeposit = 'Security deposit cannot be greater than rent amount';

    if (!form.paymentDueDay || isNaN(dueDay) || dueDay < 1 || dueDay > 31)
      newErrors.paymentDueDay = 'Payment due day must be between 1 and 31';

    if (form.lateFee !== '' && (isNaN(late) || late < 0))
      newErrors.lateFee = 'Late fee cannot be negative';
  }


  if (s === 2) {
    if (!form.startDate) newErrors.startDate = 'Start date is required';
    if (!form.endDate)   newErrors.endDate   = 'End date is required';
    if (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate))
      newErrors.endDate = 'End date must be after start date';
  }

  if (s === 3) {
    const max = Number(form.maxOccupants);
    if (!form.maxOccupants || isNaN(max) || max < 1)
      newErrors.maxOccupants = 'At least 1 occupant required';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const next = () => { if (validateStep(step)) setStep(s => Math.min(s + 1, 4)); };
  const back = () => { setErrors({}); setStep(s => Math.max(s - 1, 1)); };

  const handleSubmit = async () => {
    if (!validateStep(step) || !activeLease) return;
    const result = await dispatch(updateLeaseThunk({
      leaseId:   activeLease._id,
      data: {
        rentAmount:         Number(form.rentAmount),
        securityDeposit:    Number(form.securityDeposit),
        paymentDueDay:      Number(form.paymentDueDay),
        lateFee:            Number(form.lateFee),
        startDate:          form.startDate,
        endDate:            form.endDate,
        leaseType:          form.leaseType,
        petsAllowed:        form.petsAllowed,
        smokingAllowed:     form.smokingAllowed,
        maxOccupants:       Number(form.maxOccupants),
        noticePeriod:       Number(form.noticePeriod),
        utilitiesIncluded:  form.utilitiesIncluded,
        termsAndConditions: form.termsAndConditions,
      },
    }));
    if (updateLeaseThunk.fulfilled.match(result)) {
       toast.success('Lease updated successfully!');
      router.push(`/landlord/leases/${activeLease._id}`);
    }else {
    toast.error(
      typeof result.payload === 'string'
        ? result.payload
        : 'Failed to update lease'
    );
  }
  };

  const inputClass = (field: keyof FormData) =>
    `w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'
    }`;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <LandlordNavbar />
        <LandlordSidebar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)] pt-16 pl-64">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <LandlordNavbar />
      <LandlordSidebar />

      <main className="pt-16 pl-64">
        <div className="max-w-2xl mx-auto px-6 py-8">

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => router.push(`/landlord/leases/${leaseId}`)}
              className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-200 transition"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Edit Lease</h1>
              <p className="text-slate-500 text-sm">Only draft leases can be edited</p>
            </div>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-0 mb-8 bg-white rounded-2xl p-2 border border-slate-100 shadow-sm">
            {STEPS.map((s, idx) => {
              const Icon     = s.icon;
              const isActive = step === s.id;
              const isDone   = step > s.id;
              return (
                <div key={s.id} className="flex-1 flex items-center">
                  <button
                    onClick={() => isDone && setStep(s.id)}
                    className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition ${
                      isActive ? 'bg-emerald-50' : isDone ? 'cursor-pointer hover:bg-slate-50' : ''
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-emerald-600 text-white'
                      : isDone  ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-slate-100 text-slate-400'
                    }`}>
                      {isDone ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                    </div>
                    <span className={`text-[10px] font-semibold hidden sm:block ${
                      isActive ? 'text-emerald-600' : isDone ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      {s.label}
                    </span>
                  </button>
                  {idx < STEPS.length - 1 && (
                    <div className={`h-0.5 w-4 flex-shrink-0 ${step > s.id ? 'bg-emerald-300' : 'bg-slate-200'}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

            {/* Step 1 — Financial */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" /> Financial Terms
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Monthly Rent (₹)</label>
                    <input type="number" value={form.rentAmount} onChange={e => set('rentAmount', e.target.value)} className={inputClass('rentAmount')} />
                    {errors.rentAmount && <p className="text-red-500 text-xs mt-1">{errors.rentAmount}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Security Deposit (₹)</label>
                    <input type="number" value={form.securityDeposit} onChange={e => set('securityDeposit', e.target.value)} className={inputClass('securityDeposit')} />
                    {errors.securityDeposit && <p className="text-red-500 text-xs mt-1">{errors.securityDeposit}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Payment Due Day</label>
                    <input type="number" value={form.paymentDueDay} onChange={e => set('paymentDueDay', e.target.value)} min={1} max={31} className={inputClass('paymentDueDay')} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Late Fee (₹)</label>
                    <input type="number" value={form.lateFee} onChange={e => set('lateFee', e.target.value)} min={0} className={inputClass('lateFee')} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Utilities Included</label>
                  <div className="flex flex-wrap gap-2">
                    {UTILITIES.map(u => {
                      const Icon       = u.icon;
                      const isSelected = form.utilitiesIncluded.includes(u.value);
                      return (
                        <button key={u.value} type="button" onClick={() => toggleUtility(u.value)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                            isSelected ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />{u.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 — Duration */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" /> Duration
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {(['fixed', 'monthly'] as const).map(type => (
                    <button key={type} type="button" onClick={() => set('leaseType', type)}
                      className={`p-3 rounded-xl border text-sm font-medium text-left transition ${
                        form.leaseType === type ? 'bg-emerald-50 border-emerald-400 text-emerald-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <p className="font-semibold capitalize">{type}</p>
                      <p className="text-xs text-slate-400 mt-0.5 font-normal">
                        {type === 'fixed' ? 'Set start and end date' : 'Month-to-month renewal'}
                      </p>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Start Date</label>
                    <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} className={inputClass('startDate')} />
                    {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">End Date</label>
                    <input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} min={form.startDate} className={inputClass('endDate')} />
                    {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Notice Period (days)</label>
                  <input type="number" value={form.noticePeriod} onChange={e => set('noticePeriod', e.target.value)} min={0} className={inputClass('noticePeriod')} />
                </div>
              </div>
            )}

            {/* Step 3 — Rules */}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600" /> Rules
                </h2>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Maximum Occupants</label>
                  <input type="number" value={form.maxOccupants} onChange={e => set('maxOccupants', e.target.value)} min={1} className={inputClass('maxOccupants')} />
                </div>
                <div className="space-y-3">
                  {[
                    { field: 'petsAllowed' as const,    label: 'Pets Allowed',    icon: PawPrint,  desc: 'Allow tenants to keep pets' },
                    { field: 'smokingAllowed' as const, label: 'Smoking Allowed', icon: Cigarette, desc: 'Allow smoking on premises'   },
                  ].map(rule => {
                    const Icon = rule.icon;
                    return (
                      <div key={rule.field} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            <Icon className="w-4 h-4 text-slate-500" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-700">{rule.label}</p>
                            <p className="text-xs text-slate-400">{rule.desc}</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => set(rule.field, !form[rule.field])}
                          className={`w-12 h-6 rounded-full transition-colors relative ${form[rule.field] ? 'bg-emerald-500' : 'bg-slate-300'}`}
                        >
                          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form[rule.field] ? 'translate-x-6' : 'translate-x-0.5'}`} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4 — Terms */}
            {step === 4 && (
              <div className="space-y-5">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" /> Terms & Conditions
                </h2>
                <textarea
                  value={form.termsAndConditions}
                  onChange={e => set('termsAndConditions', e.target.value)}
                  placeholder="Enter additional terms..."
                  rows={8}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                />
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={step === 1 ? () => router.push(`/landlord/leases/${leaseId}`) : back}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
            >
              <ChevronLeft className="w-4 h-4" />
              {step === 1 ? 'Cancel' : 'Back'}
            </button>
            {step < 4 ? (
              <button onClick={next}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={() => void handleSubmit()} disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-sm font-semibold rounded-xl transition"
              >
                {isSubmitting
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                  : <><CheckCircle className="w-4 h-4" /> Save Changes</>
                }
              </button>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}