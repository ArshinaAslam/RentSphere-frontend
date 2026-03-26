'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

import { useRouter }           from 'next/navigation';

import {
  ArrowLeft, FileText, DollarSign, Calendar, Users,
  Shield, CheckCircle, ChevronRight, ChevronLeft,
  Loader2, Zap, Wrench, PawPrint, Cigarette,
  Search, X, User, Home, Check,
} from 'lucide-react';
import { toast }               from 'sonner';
import { z }                   from 'zod';
 
import LandlordNavbar       from '@/components/layout/LandlordNavbar';
import LandlordSidebar      from '@/components/layout/LandlordSidebar';
import { createLeaseThunk, fetchLandlordProperties, searchTenantsThunk } from '@/features/lease/leaseThunk';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createLeaseSchema } from '@/constants/lease.validation';







interface FormData {
  propertyId:         string;
  tenantId:           string;
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

const UTILITIES = [
  { value: 'electricity', label: 'Electricity', icon: Zap     },
  { value: 'water',       label: 'Water',        icon: Shield  },
  { value: 'wifi',        label: 'WiFi',         icon: Zap     },
  { value: 'gas',         label: 'Gas',          icon: Zap     },
  { value: 'maintenance', label: 'Maintenance',  icon: Wrench  },
];

const STEPS = [
  { id: 1, label: 'Parties',   icon: Users      },
  { id: 2, label: 'Financial', icon: DollarSign },
  { id: 3, label: 'Duration',  icon: Calendar   },
  { id: 4, label: 'Rules',     icon: Shield     },
  { id: 5, label: 'Terms',     icon: FileText   },
];

export default function CreateLeasePage() {
  const dispatch = useAppDispatch();
  const router   = useRouter();
  const { isSubmitting } = useAppSelector(s => s.lease);

  const [step,   setStep]   = useState(1);
   const [errors, setErrors] = useState<Record<string, string>>({});  

  const [properties,        setProperties]        = useState<PropertyResult[]>([]);
  const [selectedProperty,  setSelectedProperty]  = useState<PropertyResult | null>(null);
  const [isLoadingProps,    setIsLoadingProps]     = useState(false);

  
  const [tenantQuery,       setTenantQuery]        = useState('');
  const [tenantResults,     setTenantResults]      = useState<TenantResult[]>([]);
  const [selectedTenant,    setSelectedTenant]     = useState<TenantResult | null>(null);
  const [isSearching,       setIsSearching]        = useState(false);
  const [showTenantResults, setShowTenantResults]  = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);


  const [form, setForm] = useState<FormData>({
    propertyId:         '',
    tenantId:           '',
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
  setIsLoadingProps(true);
  void dispatch(fetchLandlordProperties())
    .then((result) => {
      if (fetchLandlordProperties.fulfilled.match(result)) {
        setProperties(result.payload);
      }
    })
    .finally(() => setIsLoadingProps(false));
}, [dispatch]);


const handleTenantSearch = useCallback((q: string) => {
  setTenantQuery(q);
  if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

  if (q.trim().length < 2) {
    setTenantResults([]);
    setShowTenantResults(false);
    return;
  }

  searchTimeoutRef.current = setTimeout(() => {
    setIsSearching(true);
    void dispatch(searchTenantsThunk(q.trim()))
      .then((result) => {
       
        if (searchTenantsThunk.fulfilled.match(result)) {
          setTenantResults(result.payload);
          setShowTenantResults(true);
        }
      })
      .finally(() => setIsSearching(false));
  }, 400);
}, [dispatch]);

  const selectTenant = (tenant: TenantResult) => {
    setSelectedTenant(tenant);
    setForm(prev => ({ ...prev, tenantId: tenant._id }));
    setTenantQuery(`${tenant.firstName} ${tenant.lastName}`);
    setShowTenantResults(false);
   setErrors(prev => {
  const next = { ...prev };
  delete next.tenantId;
  return next;
});
  };

  const clearTenant = () => {
    setSelectedTenant(null);
    setTenantQuery('');
    setTenantResults([]);
    setForm(prev => ({ ...prev, tenantId: '' }));
  };

  const selectProperty = (property: PropertyResult) => {
    setSelectedProperty(property);
    setForm(prev => ({ ...prev, propertyId: property._id }));
    setErrors(prev => {
  const next = { ...prev };
  delete next.tenantId;
  return next;
});
  };

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
  const newErrors: Record<string, string> = {};

  if (s === 1) {
    if (!form.propertyId) newErrors.propertyId = 'Please select a property';
    if (!form.tenantId)   newErrors.tenantId   = 'Please select a tenant';
  }

if (s === 2) {
  const rentAmount      = Number(form.rentAmount);
  const securityDeposit = Number(form.securityDeposit);
  const paymentDueDay   = Number(form.paymentDueDay);
  const lateFee         = Number(form.lateFee);

  if (!form.rentAmount || isNaN(rentAmount) || rentAmount <= 0)
    newErrors.rentAmount = 'Rent amount must be greater than 0';

  if (form.securityDeposit === '' || isNaN(securityDeposit) || securityDeposit < 0)
    newErrors.securityDeposit = 'Security deposit cannot be negative';

  if (securityDeposit > rentAmount)
    newErrors.securityDeposit = 'Security deposit cannot be greater than rent amount';

  if (!form.paymentDueDay || isNaN(paymentDueDay) || paymentDueDay < 1 || paymentDueDay > 31)
    newErrors.paymentDueDay = 'Payment due day must be between 1 and 31';

  if (form.lateFee !== '' && (isNaN(lateFee) || lateFee < 0))
    newErrors.lateFee = 'Late fee cannot be negative';
}

  

 
  

  if (s === 3) {
  if (!form.startDate)
    newErrors.startDate = 'Start date is required';

  if (!form.endDate)
    newErrors.endDate = 'End date is required';

  if (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate))
    newErrors.endDate = 'End date must be after start date';
}

if (s === 4) {
  const maxOccupants = Number(form.maxOccupants);
  if (!form.maxOccupants || isNaN(maxOccupants) || maxOccupants < 1)
    newErrors.maxOccupants = 'At least 1 occupant required';
}

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const next = () => { if (validateStep(step)) setStep(s => Math.min(s + 1, 5)); };
  const back = () => { setErrors({}); setStep(s => Math.max(s - 1, 1)); };

const handleSubmit = async () => {
  if (!validateStep(step)) return;

 
  const parseResult = createLeaseSchema.safeParse({
    propertyId:         form.propertyId,
    tenantId:           form.tenantId,
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
  });

  if (!parseResult.success) {
    const fieldErrors: Record<string, string> = {};
    parseResult.error.errors.forEach(e => {
      if (e.path[0]) fieldErrors[String(e.path[0])] = e.message;
    });
    setErrors(fieldErrors);
    toast.error('Please fix the errors before submitting');
    return;
  }

  const result = await dispatch(createLeaseThunk(parseResult.data));

  if (createLeaseThunk.fulfilled.match(result)) {
    toast.success('Lease created successfully!');  
    router.push('/landlord/leases');               
  } else {
    toast.error(
      typeof result.payload === 'string'
        ? result.payload
        : 'Failed to create lease'
    );
  }
};

 const inputClass = (field: string) =>    
  `w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
    errors[field] ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'
  }`;

  return (
    <div className="min-h-screen bg-slate-50">
      <LandlordNavbar />
      <LandlordSidebar />

      <main className="pt-16 pl-64">
        <div className="max-w-2xl mx-auto px-6 py-8">

         
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => router.push('/landlord/leases')}
              className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-200 transition"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Create Lease Agreement</h1>
              <p className="text-slate-500 text-sm">Fill in the details to create a new lease</p>
            </div>
          </div>

        
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

         
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

       
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" /> Select Property & Tenant
                </h2>

             
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Property <span className="text-red-500">*</span>
                  </label>
                  {isLoadingProps ? (
                    <div className="flex items-center gap-2 py-3">
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                      <span className="text-sm text-slate-400">Loading properties...</span>
                    </div>
                  ) : properties.length === 0 ? (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-500 text-center">
                      No properties found. Add a property first.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                      {properties.map(property => {
                        const isSelected = selectedProperty?._id === property._id;
                        return (
                          <button
                            key={property._id}
                            type="button"
                            onClick={() => selectProperty(property)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition ${
                              isSelected
                                ? 'bg-emerald-50 border-emerald-400'
                                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                          
                            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {property.images?.[0] ? (
                                <img src={property.images[0]} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <Home className="w-5 h-5 text-slate-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-semibold truncate ${isSelected ? 'text-emerald-700' : 'text-slate-800'}`}>
                                {property.title}
                              </p>
                              <p className="text-xs text-slate-400 truncate">
  {property.city}, {property.state}
</p>
                            </div>
                            {isSelected && (
                              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {errors.propertyId && (
                    <p className="text-red-500 text-xs mt-1">{errors.propertyId}</p>
                  )}
                </div>

            
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tenant <span className="text-red-500">*</span>
                  </label>

                 
                  {selectedTenant ? (
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-300 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {selectedTenant.avatar ? (
                          <img src={selectedTenant.avatar} alt="" className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <User className="w-5 h-5 text-emerald-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-emerald-800">
                          {selectedTenant.firstName} {selectedTenant.lastName}
                        </p>
                        <p className="text-xs text-emerald-600">{selectedTenant.phone} · {selectedTenant.email}</p>
                      </div>
                      <button
                        onClick={clearTenant}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-emerald-200 transition"
                      >
                        <X className="w-4 h-4 text-emerald-600" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          value={tenantQuery}
                          onChange={e => handleTenantSearch(e.target.value)}
                          onFocus={() => tenantResults.length > 0 && setShowTenantResults(true)}
                          placeholder="Search by name, phone or email..."
                          className={`w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                            errors.tenantId ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'
                          }`}
                        />
                        {isSearching && (
                          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-emerald-500" />
                        )}
                      </div>

                    
                      {showTenantResults && tenantResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-lg z-10 overflow-hidden">
                          {tenantResults.map(tenant => (
                            <button
                              key={tenant._id}
                              type="button"
                              onClick={() => selectTenant(tenant)}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition text-left border-b border-slate-50 last:border-0"
                            >
                              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                {tenant.avatar ? (
                                  <img src={tenant.avatar} alt="" className="w-full h-full object-cover rounded-full" />
                                ) : (
                                  <User className="w-4 h-4 text-slate-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-800">
                                  {tenant.firstName} {tenant.lastName}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {tenant.phone} · {tenant.email}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                 
                      {showTenantResults && tenantResults.length === 0 && !isSearching && tenantQuery.length >= 2 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-lg z-10 px-4 py-3">
                          <p className="text-sm text-slate-500 text-center">No tenants found</p>
                          <p className="text-xs text-slate-400 text-center mt-0.5">
                            Only tenants you have chatted with will appear
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {errors.tenantId && (
                    <p className="text-red-500 text-xs mt-1">{errors.tenantId}</p>
                  )}
                  <p className="text-xs text-slate-400 mt-1.5">
                    Search from tenants you have previously chatted with
                  </p>
                </div>
              </div>
            )}

           
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" /> Financial Terms
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Monthly Rent (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number" value={form.rentAmount}
                      onChange={e => set('rentAmount', e.target.value)}
                      placeholder="e.g. 15000" min={0}
                      className={inputClass('rentAmount')}
                    />
                    {errors.rentAmount && <p className="text-red-500 text-xs mt-1">{errors.rentAmount}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Security Deposit (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number" value={form.securityDeposit}
                      onChange={e => set('securityDeposit', e.target.value)}
                      placeholder="e.g. 30000" min={0}
                      className={inputClass('securityDeposit')}
                    />
                    {errors.securityDeposit && <p className="text-red-500 text-xs mt-1">{errors.securityDeposit}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Payment Due Day</label>
                    <input
                      type="number" value={form.paymentDueDay}
                      onChange={e => set('paymentDueDay', e.target.value)}
                      placeholder="1" min={1} max={31}
                      className={inputClass('paymentDueDay')}
                    />
                    {errors.paymentDueDay && <p className="text-red-500 text-xs mt-1">{errors.paymentDueDay}</p>}
                    <p className="text-xs text-slate-400 mt-1">Day of month rent is due</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Late Fee (₹)</label>
                    <input
                      type="number" value={form.lateFee}
                      onChange={e => set('lateFee', e.target.value)}
                      placeholder="0" min={0}
                      className={inputClass('lateFee')}
                      
                    />
                    {errors.lateFee && <p className="text-red-500 text-xs mt-1">{errors.lateFee}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Utilities Included</label>
                  <div className="flex flex-wrap gap-2">
                    {UTILITIES.map(u => {
                      const Icon       = u.icon;
                      const isSelected = form.utilitiesIncluded.includes(u.value);
                      return (
                        <button
                          key={u.value} type="button" onClick={() => toggleUtility(u.value)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                            isSelected
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
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

            
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" /> Lease Duration
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {(['fixed', 'monthly'] as const).map(type => (
                    <button
                      key={type} type="button" onClick={() => set('leaseType', type)}
                      className={`p-3 rounded-xl border text-sm font-medium text-left transition ${
                        form.leaseType === type
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
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
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date" value={form.startDate}
                      onChange={e => set('startDate', e.target.value)}
                      className={inputClass('startDate')}
                    />
                    {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date" value={form.endDate}
                      onChange={e => set('endDate', e.target.value)}
                      min={form.startDate}
                      className={inputClass('endDate')}
                    />
                    {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Notice Period (days)</label>
                  <input
                    type="number" value={form.noticePeriod}
                    onChange={e => set('noticePeriod', e.target.value)}
                    placeholder="30" min={0}
                    className={inputClass('noticePeriod')}
                  />
                  <p className="text-xs text-slate-400 mt-1">Days required to notify before termination</p>
                </div>
              </div>
            )}

         
            {step === 4 && (
              <div className="space-y-5">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600" /> Rules & Restrictions
                </h2>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Maximum Occupants</label>
                  <input
                    type="number" value={form.maxOccupants}
                    onChange={e => set('maxOccupants', e.target.value)}
                    placeholder="2" min={1}
                    className={inputClass('maxOccupants')}
                  />
                </div>
                <div className="space-y-3">
                  {[
                    { field: 'petsAllowed'    as const, label: 'Pets Allowed',    icon: PawPrint,  desc: 'Allow tenants to keep pets'    },
                    { field: 'smokingAllowed' as const, label: 'Smoking Allowed', icon: Cigarette, desc: 'Allow smoking on the premises'  },
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
                        <button
                          type="button" onClick={() => set(rule.field, !form[rule.field])}
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

          
            {step === 5 && (
              <div className="space-y-5">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" /> Terms & Conditions
                </h2>
                <textarea
                  value={form.termsAndConditions}
                  onChange={e => set('termsAndConditions', e.target.value)}
                  placeholder="Enter any additional terms and conditions..."
                  rows={8}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                />

               
                <div className="bg-slate-50 rounded-xl p-4 space-y-2 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Lease Summary</p>
                  {[
                    { label: 'Property',      value: selectedProperty?.title ?? '—' },
                    { label: 'Tenant',        value: selectedTenant ? `${selectedTenant.firstName} ${selectedTenant.lastName}` : '—' },
                    { label: 'Rent',          value: `₹${Number(form.rentAmount).toLocaleString('en-IN')}/month` },
                    { label: 'Deposit',       value: `₹${Number(form.securityDeposit).toLocaleString('en-IN')}` },
                    { label: 'Duration',      value: `${form.startDate} → ${form.endDate}` },
                    { label: 'Type',          value: form.leaseType === 'fixed' ? 'Fixed term' : 'Month-to-month' },
                    { label: 'Pets',          value: form.petsAllowed ? 'Allowed' : 'Not allowed' },
                    { label: 'Smoking',       value: form.smokingAllowed ? 'Allowed' : 'Not allowed' },
                    { label: 'Max occupants', value: form.maxOccupants },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between text-sm">
                      <span className="text-slate-500">{item.label}</span>
                      <span className="text-slate-800 font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

         
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={step === 1 ? () => router.push('/landlord/leases') : back}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
            >
              <ChevronLeft className="w-4 h-4" />
              {step === 1 ? 'Cancel' : 'Back'}
            </button>
            {step < 5 ? (
              <button
                onClick={next}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => void handleSubmit()}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-sm font-semibold rounded-xl transition"
              >
                {isSubmitting
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
                  : <><CheckCircle className="w-4 h-4" /> Create Lease</>
                }
              </button>
            )}
          </div>

          <p className="text-center text-xs text-slate-400 mt-4">Step {step} of {STEPS.length}</p>

        </div>
      </main>

      
      {showTenantResults && (
        <div className="fixed inset-0 z-0" onClick={() => setShowTenantResults(false)} />
      )}
    </div>
  );
}