'use client';

import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { User, Phone, Mail } from 'lucide-react';
import { EditProfileValues } from '@/constants/authValidation';
import { EditProfileData } from '@/types/user';
import { UseFormReturn } from 'react-hook-form';  
import { toast } from 'sonner'; 


interface EditProfileProps {
    user: {
    fullName?: string;
    email?: string;
    phone?: string;
    avatar?: string;
  } | null;
  form:UseFormReturn<EditProfileValues>;
  onSubmit: (data: EditProfileValues, avatar: File | null ) => void;
}

export default function EditProfile({ user, form, onSubmit }: EditProfileProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [uploading, setUploading] = useState(false);

    const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file && file.size < 5 * 1024 * 1024) { // 5MB limit
      setImagePreview(URL.createObjectURL(file));
      
      
     setAvatarFile(file);
  
  toast.success('✅ Image selected');
    } else {
      toast.error('❌ Please select image < 5MB');
    }
  };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => setImagePreview(reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

  return (
    <div className="max-w-xl space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col items-center gap-4 py-4 border-b border-slate-100">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-emerald-100 border-4 border-white shadow-md overflow-hidden flex items-center justify-center text-emerald-700 text-3xl font-bold">
  {imagePreview ? (
    // 1️⃣ New image selected → preview
    <img
      src={imagePreview}
      alt="Preview"
      className="w-full h-full object-cover rounded-full"
    />
  ) : user?.avatar ? (
    // 2️⃣ Existing profile image from backend
    <img
      src={`${user.avatar}?t=${Date.now()}`} // cache-buster
      alt="Profile"
      className="w-full h-full object-cover rounded-full"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  ) : (
    // 3️⃣ Fallback → first letter
    <span>
      {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
    </span>
  )}
</div>

          <label className="absolute bottom-0 right-0 p-2 bg-emerald-600 rounded-full text-white cursor-pointer shadow-lg hover:bg-emerald-700 transition-colors">
            <User size={16} />
            <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
          </label>
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Click the icon to update photo
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => {
    onSubmit(data, avatarFile);
  })} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">First Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input 
                        placeholder="Enter first name" 
                        {...field} 
                        className="pl-10 rounded-xl bg-slate-50/50 border-slate-100 focus:bg-white transition-all h-12" 
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">Last Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter last name" 
                      {...field} 
                      className="rounded-xl bg-slate-50/50 border-slate-100 focus:bg-white transition-all h-12" 
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 font-semibold">Phone Number</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      placeholder="Enter phone (+91...)" 
                      {...field} 
                      className="pl-10 rounded-xl bg-slate-50/50 border-slate-100 focus:bg-white transition-all h-12" 
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <div className="opacity-60">
            <FormItem>
              <FormLabel className="text-slate-700 font-semibold">Email (Linked to Account)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    value={user?.email || ''} 
                    disabled 
                    className="pl-10 rounded-xl bg-slate-100/50 border-slate-200 cursor-not-allowed h-12" 
                  />
                </div>
              </FormControl>
            </FormItem>
          </div>

          <button 
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 px-8 rounded-2xl transition-all shadow-xl shadow-emerald-100 active:scale-95 h-12 flex items-center justify-center gap-2 text-lg"
          >
            <User className="h-5 w-5" />
            Update Profile
          </button>
        </form>
      </Form>
    </div>
  );
}
