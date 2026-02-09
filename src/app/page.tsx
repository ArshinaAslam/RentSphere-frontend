
'use client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  FileCheck, 
  CreditCard, 
  Search, 
  ClipboardCheck, 
  LayoutDashboard,
  Bell,
  CheckCircle2,
  Lock,
  MapPin,
  ChevronRight
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { RootState } from "@/store";

export default function Home() {

  const router=useRouter()
  const {userData,loading} = useAppSelector((state:RootState)=>state.auth)

  useEffect(()=>{
     if(!loading && userData){
      const rolePath = userData.role?.toLowerCase()
      router.replace(`/${rolePath}/dashboard`)
     }
  },[userData,loading,router])
  const steps = [
    { id: "1", title: "Sign up and verify", desc: "Complete signup with OTP verification and KYC for landlords to ensure trust and security." },
    { id: "2", title: "List or discover homes", desc: "Landlords add verified properties, tenants browse through authenticated listings." },
    { id: "3", title: "Sign lease and pay rent", desc: "Create digital leases with e‑signatures and enable online rent payments with automated tracking." },
  ];

 if (loading || userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }


  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Navbar */}
      <header className="fixed top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">RS</span>
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">RentSphere</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <Link href="#features" className="hover:text-emerald-600 transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-emerald-600 transition-colors">How It Works</Link>
            <Link href="#pricing" className="hover:text-emerald-600 transition-colors">Pricing</Link>
            <Link href="/login" className="hover:text-emerald-600 transition-colors">Login</Link>
            <Link href="/account-type" className="bg-emerald-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-emerald-700 transition-all">Get Started</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl lg:text-6xl font-bold leading-[1.15] text-slate-900 mb-6">
            Manage Rentals, <br />
            Tenants, and <br />
            Payments in One <br />
            Place
          </h1>
          <p className="text-slate-500 text-lg max-w-lg mb-10 leading-relaxed">
            RentSphere helps landlords verify tenants, manage properties, create digital leases, and collect rent with late fee automation.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/signup?role=landlord" className="bg-emerald-600 text-white px-6 py-3.5 rounded-lg font-bold flex items-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-100">
              Get Started as Landlord <ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="/signup?role=tenant" className="border border-slate-200 text-slate-700 px-6 py-3.5 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors">
              Find a Home as Tenant
            </Link>
          </div>
        </div>

        {/* Hero Dashboard Preview */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-800">Dashboard Overview</h3>
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Live</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="bg-white p-2.5 rounded-xl shadow-sm text-emerald-600"><FileCheck className="w-5 h-5" /></div>
                <div><p className="text-xs text-slate-400 font-medium">Verified Properties</p><p className="text-xl font-bold">12</p></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="bg-white p-2.5 rounded-xl shadow-sm text-emerald-600"><CreditCard className="w-5 h-5" /></div>
                <div><p className="text-xs text-slate-400 font-medium">Upcoming Rent</p><p className="text-xl font-bold">$4,850</p></div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-2"><Bell className="w-3 h-3" /> Recent Notifications</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-xs text-slate-500 font-medium"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> New tenant application received</li>
                <li className="flex items-center gap-2 text-xs text-slate-500 font-medium"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Rent payment confirmed</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
{/* How It Works - Compact Version with Trust & Security Card Style */}
<section id="how-it-works" className="py-20 bg-slate-50 border-y border-slate-100">
  <div className="max-w-6xl mx-auto px-6">
    <div className="text-center mb-16">
      <h2 className="text-3xl font-bold text-slate-900 mb-3">How It Works</h2>
      <p className="text-slate-500 text-sm">Get started in three simple steps</p>
    </div>

    <div className="grid md:grid-cols-3 gap-8">
      {[
        {
          id: "1",
          title: "Sign up and verify",
          desc: "Complete signup with OTP verification and KYC for landlords to ensure trust and security.",
          icon: <ShieldCheck className="w-6 h-6" />
        },
        {
          id: "2",
          title: "List or discover homes",
          desc: "Landlords add verified properties, while tenants browse through authenticated listings.",
          icon: <Search className="w-6 h-6" />
        },
        {
          id: "3",
          title: "Sign lease and pay rent",
          desc: "Create digital leases with e-signatures and enable online rent payments with automated tracking.",
          icon: <FileCheck className="w-6 h-6" />
        }
      ].map((step) => (
        /* Card styling updated to match 'Trust & Security':
           - bg-white
           - p-10 (standardized padding)
           - rounded-3xl
           - border-slate-200
        */
        <div 
          key={step.id} 
          className="relative bg-white p-10 pt-14 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group text-center flex flex-col items-center"
        >
          {/* STEP NUMBER CIRCLE - Top Left */}
          <div className="absolute -top-4 -left-4">
            <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-base shadow-lg shadow-emerald-200">
              {step.id}
            </div>
          </div>

          {/* ICON - Matching Trust & Security Style */}
          <div className="mb-6 text-emerald-600 bg-emerald-50 p-5 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            {step.icon}
          </div>

          <h3 className="font-bold text-xl mb-4 text-slate-900">{step.title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            {step.desc}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* Features Grid (Landlords & Tenants) */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-3">For Landlords</h2>
          <p className="text-slate-500 text-center mb-12">Powerful tools to manage your rental business efficiently</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Landlord KYC", icon: <ShieldCheck /> },
              { title: "Tenant Screening", icon: <ClipboardCheck /> },
              { title: "Digital Leases", icon: <FileCheck /> },
              { title: "Rent Collection", icon: <CreditCard /> },
            ].map((f) => (
              <div key={f.title} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all group">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all">{f.icon}</div>
                <h4 className="font-bold text-slate-800 mb-2">{f.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">Secure and automated verification workflows designed for scale.</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-center mb-3">For Tenants</h2>
          <p className="text-slate-500 text-center mb-12">Find your perfect home with confidence and ease</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Verified Listings", icon: <CheckCircle2 /> },
              { title: "Apply Once", icon: <LayoutDashboard /> },
              { title: "Secure Leases", icon: <Lock /> },
              { title: "Online Payments", icon: <CreditCard /> },
            ].map((f) => (
              <div key={f.title} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all group">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all">{f.icon}</div>
                <h4 className="font-bold text-slate-800 mb-2">{f.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">Browse only authenticated rentals with secure payment processing.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Action Gallery */}
<section className="pt-5 pb-8 bg-white px-6">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-3xl font-bold text-center mb-3">See RentSphere in Action</h2>
    <p className="text-slate-500 text-center mb-16">Experience the platform through the tenant journey</p>
    <div className="grid md:grid-cols-3 gap-8">
      {[
        { 
          title: "Set your location", 
          img: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?q=80&w=800&auto=format&fit=crop",
          desc: "Pinpoint your preferred neighborhood with our interactive map search." 
        },
        { 
          title: "Browse verified homes", 
          img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop",
          desc: "Scroll through high-quality, pre-vetted listings with detailed virtual tours." 
        },
        { 
          title: "Pay rent online", 
          img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800&auto=format&fit=crop",
          desc: "Secure one-click payments with automated receipts and payment history." 
        },
      ].map((a) => (
        <div key={a.title} className="rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
          <div className="h-64 overflow-hidden">
            <img 
              src={a.img} 
              alt={a.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            />
          </div>
          <div className="p-6">
            <h4 className="font-bold mb-2">{a.title}</h4>
            <p className="text-slate-500 text-sm">{a.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

     {/* Trust & Security */}
<section className="py-24 bg-slate-50 border-y border-slate-100">
  <div className="max-w-7xl mx-auto px-6 text-center">
    <h2 className="text-3xl font-bold mb-3 text-slate-900">Built on Trust & Security</h2>
    <p className="text-slate-500 mb-16">Your safety and security is our top priority</p>
    
    <div className="grid md:grid-cols-3 gap-8">
      {[
        { 
          icon: <ShieldCheck className="w-8 h-8" />, 
          title: "KYC for Users", 
          desc: "Identity verification ensures all users are authenticated and trustworthy." 
        },
        { 
          icon: <FileCheck className="w-8 h-8" />, 
          title: "Document Verification", 
          desc: "All property documents are verified by our team before listings go live." 
        },
        { 
          icon: <Lock className="w-8 h-8" />, 
          title: "Secure Payments", 
          desc: "Bank-grade encryption and secure gateways for all financial transactions." 
        },
      ].map((t) => (
        <div key={t.title} className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col items-center group">
          <div className="mb-6 text-emerald-600 bg-emerald-50 p-5 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            {t.icon}
          </div>
          <h4 className="font-bold text-xl mb-4 text-slate-900">{t.title}</h4>
          <p className="text-slate-500 text-sm leading-relaxed">
            {t.desc}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-emerald-600 rounded-[2.5rem] p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4">Ready to launch your rental workspace?</h2>
            <p className="text-emerald-50 mb-10 opacity-90">Create your landlord or tenant account in minutes</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/signup" className="bg-white text-emerald-700 px-8 py-4 rounded-full font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-600" /> Sign up as Landlord
              </Link>
              <Link href="/signup" className="bg-emerald-700 text-white px-8 py-4 rounded-full font-bold hover:bg-emerald-800 transition-all flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white" /> Sign up as Tenant
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
{/* Footer */}
<footer className="py-20 px-6 border-t border-slate-100 bg-white">
  <div className="max-w-7xl mx-auto">
    {/* Changing grid-cols to center-aligned items. 
        'justify-items-center' ensures each column is centered in its own space.
    */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 justify-items-center text-center">
      
      {/* Brand Column */}
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-emerald-600 rounded flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">RS</span>
          </div>
          <span className="font-bold text-slate-900 text-lg">RentSphere</span>
        </div>
        <p className="text-slate-500 leading-relaxed max-w-[200px]">
          Modern rental management for landlords and tenants.
        </p>
      </div>

      {/* Link Columns */}
      {['Product', 'Company', 'Legal'].map((col) => (
        <div key={col} className="flex flex-col items-center">
          <h5 className="font-bold text-slate-900 mb-6">{col}</h5>
          <ul className="space-y-4 text-slate-500">
            <li>
              <Link href="#" className="hover:text-emerald-600 transition-colors">Overview</Link>
            </li>
            <li>
              <Link href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</Link>
            </li>
            <li>
              <Link href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</Link>
            </li>
          </ul>
        </div>
      ))}
    </div>

    {/* Bottom Copyright */}
    <div className="mt-16 pt-8 border-t border-slate-50 text-center">
      <p className="text-slate-400 text-xs">
        © {new Date().getFullYear()} RentSphere. All rights reserved.
      </p>
    </div>
  </div>
</footer>
    </main>
  );
}

