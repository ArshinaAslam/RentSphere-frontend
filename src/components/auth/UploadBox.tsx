'use client';

import { Upload, Camera } from 'lucide-react';

interface UploadBoxProps {
  title: string;
  subtitle: string;
  onChange: (file: File | null) => void;
  error?: boolean; 
}

const UploadBox = ({ title, subtitle, onChange, error = false }: UploadBoxProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onChange(file);
  };

  return (
    <div
      className={`border-2 border-dashed p-8 rounded-2xl text-center cursor-pointer transition-all hover:border-emerald-400 hover:bg-emerald-50/50 ${
        error 
          ? 'border-red-500 bg-red-50/50 ring-2 ring-red-200' 
          : 'border-gray-200 bg-gray-50/50 hover:border-emerald-400'
      }`}
      onDrop={(e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.size <= 5 * 1024 * 1024) {
          onChange(file);
        }
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="upload-file"
      />
      <label htmlFor="upload-file" className="cursor-pointer block">
        <div className="space-y-3">
          <Upload className="w-16 h-16 mx-auto text-gray-400" />
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </label>
    </div>
  );
};

export default UploadBox;
