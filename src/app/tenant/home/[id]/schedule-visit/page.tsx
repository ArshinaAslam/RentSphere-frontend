

'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchBookedSlots, bookVisit } from '@/features/visit/visitThunk';
import { clearVisitState, clearVisitError } from '@/features/visit/visitSlice';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';

const ALL_SLOTS = [
  '9:00 AM - 10:00 AM',
  '11:00 AM - 12:00 PM',
  '2:00 PM - 3:00 PM',
  '4:00 PM - 5:00 PM',
  '6:00 PM - 7:00 PM',
];

export default function ScheduleVisitPage() {
  const { id: propertyId } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const { bookedSlots, isLoadingSlots, isSubmitting, success, error } =
    useAppSelector((s: RootState) => s.visit);
    const tenantProfile = useAppSelector((s: RootState) => s.auth.userData);

 
  const selectedProperty = useAppSelector((s: RootState) => s.property.selectedProperty);
  const landlordId = typeof selectedProperty?.landlordId === 'object'
    ? selectedProperty.landlordId.id
    : selectedProperty?.landlordId ?? '';

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  
  useEffect(() => {
    return () => { dispatch(clearVisitState()); };
  }, [dispatch]);

  
  useEffect(() => {
    if (!selectedDate || !propertyId) return;
    setSelectedSlot('');
    dispatch(clearVisitError());
    void dispatch(fetchBookedSlots({ propertyId, date: selectedDate }));
  }, [selectedDate, propertyId, dispatch]);

  const handleSubmit = () => {
    if (!selectedDate || !selectedSlot || !propertyId) return;
    void dispatch(bookVisit({
      propertyId,
      landlordId,
      date:     selectedDate,
      timeSlot: selectedSlot,
    }));
  };

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const minDate = [
  tomorrow.getFullYear(),
  String(tomorrow.getMonth() + 1).padStart(2, '0'),
  String(tomorrow.getDate()).padStart(2, '0'),
].join('-');

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-slate-100 pt-20 px-6 flex items-center justify-center">
        <Navbar />
        <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-slate-200">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Visit Scheduled!</h2>
          <p className="text-slate-500 mb-6">
            Your visit is booked for <strong>{selectedDate}</strong> at <strong>{selectedSlot}</strong>
          </p>
          <Link href="/tenant/home">
            <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 pt-20 ">
      <Navbar />
      <div className="max-w-4xl mx-auto">

        <Link href="/tenant/home" className="flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 mb-6">
          <ArrowLeft size={16} /> Back to Property
        </Link>

        <h1 className="text-2xl font-bold text-slate-900 mb-8">Schedule a Visit</h1>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-8">

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold mb-2">Select Date</label>
            <input
              type="date"
              min={minDate}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
            />
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <div>
              <h3 className="text-sm font-semibold mb-4">Available Time Slots</h3>

              {isLoadingSlots ? (
                <div className="flex items-center gap-2 text-slate-500">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading slots...
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {ALL_SLOTS.map(slot => {
                    const isBooked   = bookedSlots.includes(slot);
                    const isSelected = selectedSlot === slot;

                    return (
                      <button
                        key={slot}
                        disabled={isBooked}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 rounded-lg border text-sm font-medium transition ${
                          isBooked
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'border-slate-300 hover:border-emerald-600 hover:text-emerald-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          {slot}
                          {isSelected && <Check size={16} />}
                          {isBooked && (
                            <span className="text-xs bg-slate-300 text-slate-600 px-2 py-0.5 rounded">
                              Booked
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 px-4 py-2 rounded-lg">
              {error}
            </p>
          )}


          {/* Contact Information  */}
<div className="space-y-4">
  <h3 className="text-sm font-semibold text-slate-800">
    Your Contact Information
  </h3>
  <p className="text-xs text-slate-400">
    This information will be shared with the landlord.
  </p>

  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">
        Full Name
      </label>
      <input
        type="text"
        readOnly
        value={tenantProfile?.fullName
          ? tenantProfile?.fullName
          : ''}
        className="w-full border border-slate-200 rounded-lg px-4 py-2 bg-slate-50 text-slate-700 text-sm cursor-not-allowed"
      />
    </div>

    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">
        Phone Number
      </label>
      <input
        type="text"
        readOnly
        value={tenantProfile?.phone ?? ''}
        className="w-full border border-slate-200 rounded-lg px-4 py-2 bg-slate-50 text-slate-700 text-sm cursor-not-allowed"
      />
    </div>
  </div>

  <div>
    <label className="block text-xs font-medium text-slate-500 mb-1">
      Email Address
    </label>
    <input
      type="text"
      readOnly
      value={tenantProfile?.email ?? ''}
      className="w-full border border-slate-200 rounded-lg px-4 py-2 bg-slate-50 text-slate-700 text-sm cursor-not-allowed"
    />
  </div>
</div>

          {/* Submit */}
          <button
            disabled={!selectedDate || !selectedSlot || isSubmitting}
            onClick={handleSubmit}
            className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
              selectedDate && selectedSlot && !isSubmitting
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-slate-300 text-white cursor-not-allowed'
            }`}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? 'Booking...' : 'Confirm Visit'}
          </button>

        </div>
      </div>
    </div>
  );
}