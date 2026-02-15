'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, X } from 'lucide-react';
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { passwordSchema, PasswordValues } from '@/constants/authValidation';
import { ChangePasswordModalProps } from '@/types/user';
import { changePasswordAsync } from '@/features/auth/authThunks';
import { useAppDispatch } from '@/store/hooks';
import { toast } from 'sonner'; 

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useAppDispatch();

  const form = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  if (!isOpen) return null;

  
  const handlePasswordSubmit = async (data: PasswordValues) => {
    try {
      await dispatch(changePasswordAsync(data)).unwrap();
      toast.success("Password Updated", {
        description: "Your password has been changed successfully.",
        duration: 3000,
        className: `
          rounded-2xl bg-white border border-emerald-200 shadow-xl shadow-emerald-100
        `,
        descriptionClassName: `text-slate-600 text-sm`,
        // icon: "✅",
      });
      onClose();        
      form.reset();     
    } catch  {
      toast.error("❌ Password change failed", {
        description:  "Please try again.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Lock className="w-8 h-8 text-slate-400" />
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Change Password</h2>
              <p className="text-sm text-slate-500">Enter current & new password</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-slate-400 hover:text-slate-900" />
          </button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handlePasswordSubmit)} className="space-y-5">
            {/* Current Password */}
            <FormField 
              control={form.control} 
              name="currentPassword" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">Current Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input 
                        type={showCurrent ? "text" : "password"} 
                        placeholder="Current password" 
                        {...field} 
                        className="pl-10 pr-12 rounded-xl h-12 bg-slate-50 focus:bg-white" 
                      />
                      <button 
                        type="button" 
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full" 
                        onClick={() => setShowCurrent(!showCurrent)}
                      >
                        {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs mt-1" />
                </FormItem>
              )} 
            />
            
            {/* New Password */}
            <FormField 
              control={form.control} 
              name="newPassword" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input 
                        type={showNew ? "text" : "password"} 
                        placeholder="New password (8+ chars)" 
                        {...field} 
                        className="pl-10 pr-12 rounded-xl h-12 bg-slate-50 focus:bg-white" 
                      />
                      <button 
                        type="button" 
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full" 
                        onClick={() => setShowNew(!showNew)}
                      >
                        {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs mt-1" />
                </FormItem>
              )} 
            />
            
            {/* Confirm Password */}
            <FormField 
              control={form.control} 
              name="confirmPassword" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input 
                        type={showConfirm ? "text" : "password"} 
                        placeholder="Confirm new password" 
                        {...field} 
                        className="pl-10 pr-12 rounded-xl h-12 bg-slate-50 focus:bg-white" 
                      />
                      <button 
                        type="button" 
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full" 
                        onClick={() => setShowConfirm(!showConfirm)}
                      >
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs mt-1" />
                </FormItem>
              )} 
            />

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-12 rounded-xl">
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 h-12 rounded-xl font-bold shadow-lg"
              >
                Update Password
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
