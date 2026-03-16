'use client';

import { useEffect, useState } from 'react';

import { X, MessageSquare, Loader2, CheckCircle } from 'lucide-react';

import { clearInquiryState } from '@/features/inquiry/inquirySlice';
import { createInquiry } from '@/features/inquiry/inquiryThunk';
import type { RootState } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const PRESET_QUESTIONS = [
  'Is the property still available?',
  'What are the lease terms?',
  'Are pets allowed?',
];

interface InquiryModalProps {
  propertyId:    string;
  landlordId:    string;
  propertyTitle: string;
  onClose:       () => void;
}

export default function InquiryModal({
  propertyId,
  landlordId,
  propertyTitle,
  onClose,
}: InquiryModalProps) {
  const dispatch = useAppDispatch();
  const { isSubmitting, success, error } =
    useAppSelector((s: RootState) => s.inquiry);

  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [message,           setMessage]           = useState('');
  const [validationError,   setValidationError]   = useState('');


 
  useEffect(() => {
    return () => { dispatch(clearInquiryState()); };
  }, [dispatch]);

  const toggleQuestion = (q: string) => {
    setValidationError('');
    setSelectedQuestions(prev =>
      prev.includes(q) ? prev.filter(x => x !== q) : [...prev, q],
    );
  };

  const handleSubmit = () => {
    if (selectedQuestions.length === 0) {
      setValidationError('Please select at least one question.');
      return;
    }



    void dispatch(createInquiry({
      propertyId,
      landlordId,
      questions: selectedQuestions,
      message,
    }));
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
        onClick={e => e.stopPropagation()}
      >
       
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
        
          <div className="flex flex-col items-center py-6 text-center">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Inquiry Sent!
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Your inquiry has been sent to the landlord.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition text-sm"
            >
              Done
            </button>
          </div>
        ) : (
          <>
           
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Send Inquiry</h3>
                <p className="text-xs text-slate-400 truncate max-w-[220px]">
                  {propertyTitle}
                </p>
              </div>
            </div>

         
            <div className="mb-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Select your questions
              </p>
              <div className="space-y-2">
                {PRESET_QUESTIONS.map(q => {
                  const isSelected = selectedQuestions.includes(q);
                  return (
                    <button
                      key={q}
                      onClick={() => toggleQuestion(q)}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-700 font-medium'
                          : 'border-slate-200 text-slate-600 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? 'bg-emerald-500 border-emerald-500'
                            : 'border-slate-300'
                        }`}>
                          {isSelected && (
                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                              <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                          )}
                        </div>
                        {q}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          
            <div className="mb-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Additional message (optional)
              </p>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Add any additional details..."
                rows={3}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
              />
            </div>

          
            {(validationError || error) && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-lg mb-4">
                {validationError || error}
              </p>
            )}

       
            <button
              disabled={isSubmitting || selectedQuestions.length === 0}
              onClick={handleSubmit}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 ${
                selectedQuestions.length > 0 && !isSubmitting
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? 'Sending...' : 'Send Inquiry'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}