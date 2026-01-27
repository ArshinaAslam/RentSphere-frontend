
import Link from "next/link";
import { User, Building2 } from "lucide-react";
import AccountTypeCard from "@/components/auth/AccountTypeCard";



export default function AccountTypePage() {
  const tenantFeatures = [
    "Browse available properties",
    "Submit rental applications",
    "Pay rent online",
    "Chat with landlords",
  ];

  const landlordFeatures = [
    "List and manage properties",
    "Track rent payments",
    "Manage tenant requests",
    "Financial analytics & reports",
  ];

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-900">
      <div className="mx-auto w-full max-w-4xl px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-3xl font-bold">Choose Your Account Type</h1>
          <p className="text-slate-600">
            Select the option that best describes how you'll use RentSphere
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 justify-items-center">
          
          <div className="w-full max-w-[360px]">
       
              <AccountTypeCard
                icon={User}
                title="Tenant"
                description="Looking for a place to rent"
                features={tenantFeatures}
                buttonText="Continue as Tenant"
                href="/tenant/signup?role=TENANT"
              />
         
          </div>

          <div className="w-full max-w-[360px]">
    
              <AccountTypeCard
                icon={Building2}
                title="Landlord"
                description="Managing rental properties"
                features={landlordFeatures}
                buttonText="Continue as Landlord"
                href="/landlord/signup?role=LANDLORD"
              />
            
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-slate-500">
          Need help choosing?{" "}
          <Link href="/contact" className="font-semibold text-emerald-700 hover:underline">
            Contact our support team
          </Link>
        </p>
      </div>
    </div>
  );
}

