

'use client';

import React, { useState, useEffect } from 'react';

import { Upload, Camera, CheckCircle, X } from 'lucide-react';

interface UploadBoxProps {
  title: string;
  subtitle: string;
  onChange: (file: File | null) => void;
  error?: boolean;
  value?: File | null;  
}

const UploadBox = ({ title, subtitle, onChange, error = false, value }: UploadBoxProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  
  const inputId = `upload-${title.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substr(2, 9)}`;


  useEffect(() => {
    if (value) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file && file.size <= 5 * 1024 * 1024) {  
      onChange(file);
      event.target.value = '';  
    }
  };

  const removeFile = () => {
    setPreview(null);
    onChange(null);
  };

  return (
    <div className={`
      relative border-2 border-dashed p-8 rounded-2xl text-center transition-all duration-300
      ${dragActive ? 'bg-emerald-50 border-emerald-400 ring-4 ring-emerald-100/50' : ''}
      ${error ? 'border-red-500 bg-red-50/50 ring-2 ring-red-200/50' : 'border-gray-200 hover:border-emerald-400 bg-gray-50/50'}
      ${preview ? 'border-emerald-500 bg-emerald-50/80 shadow-xl ring-2 ring-emerald-200/50' : 'hover:shadow-md'}
    `}>
      
     
      {preview ? (
        <div className="space-y-4 p-4">
          <div className="relative group">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full max-w-xs max-h-40 object-contain bg-white rounded-xl mx-auto shadow-lg border-4 border-white"
            />
         
            <button
              type="button"
              onClick={removeFile}
              className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-all group-hover:scale-110"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              ✓ Uploaded
            </div>
          </div>
          <p className="text-sm font-semibold text-emerald-700 flex items-center justify-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Ready to submit
          </p>
        </div>
      ) : (
        <>
        
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id={inputId}  
          />
          <label htmlFor={inputId} className="cursor-pointer block w-full h-full">
            <div className="space-y-3">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto shadow-lg border-2 border-dashed border-gray-300">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
          </label>
        </>
      )}

     
      <div
        className={`
          absolute inset-0 rounded-2xl pointer-events-none opacity-0 transition-all
          ${dragActive ? 'opacity-100 pointer-events-auto bg-emerald-500/10 backdrop-blur-sm' : ''}
        `}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(false);
          const file = e.dataTransfer.files[0];
          if (file && file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
            onChange(file);
          }
        }}
      >
        <div className="flex flex-col items-center justify-center h-full text-emerald-600">
          <Upload className="w-20 h-20 animate-bounce mb-4" />
          <p className="text-lg font-bold">Drop image here</p>
        </div>
      </div>
    </div>
  );
};

export default UploadBox;

