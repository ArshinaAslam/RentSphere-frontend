"use client";
import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ShieldCheck,
  FileCheck,
  CreditCard,
  Search,
  Home as HomeIcon,
  ClipboardCheck,
  LayoutDashboard,
  CheckCircle2,
  Lock,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

import type { RootState } from "@/store";
import { useAppSelector } from "@/store/hooks";

export default function Home() {
  const router = useRouter();
  const { userData, loading } = useAppSelector(
    (state: RootState) => state.auth,
  );

  const [showLoginMenu, setShowLoginMenu] = useState(false);
  useEffect(() => {
    if (!loading && userData) {
      const rolePath = userData.role?.toLowerCase();
      router.replace(`/${rolePath}/dashboard`);
    }
  }, [userData, loading, router]);

  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Navbar */}
      <header className="fixed top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl rotate-6 blur-sm" />
              <div className="relative w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <HomeIcon className="w-5 h-5 text-white stroke-[2.5]" />
              </div>
            </div>
            <span className="text-slate-900 font-bold text-xl tracking-tight group-hover:text-emerald-600 transition-colors">
              RentSphere
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <Link
              href="#features"
              className="hover:text-emerald-600 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="hover:text-emerald-600 transition-colors"
            >
              How It Works
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setShowLoginMenu(true)}
              onMouseLeave={() => setShowLoginMenu(false)}
            >
              <button className="hover:text-emerald-600 transition-colors flex items-center gap-1">
                Login <ChevronDown className="w-3 h-3" />
              </button>
              {showLoginMenu && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg py-2 z-50">
                  <Link
                    href="/landlord/login"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-600"
                  >
                    <ShieldCheck className="w-4 h-4" /> Landlord Login
                  </Link>
                  <Link
                    href="/tenant/login"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-600"
                  >
                    <HomeIcon className="w-4 h-4" /> Tenant Login
                  </Link>
                </div>
              )}
            </div>
            <Link
              href="/account-type"
              className="bg-emerald-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-emerald-700 transition-all"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl lg:text-6xl font-bold leading-[1.15] text-slate-900 mb-6">
            Manage Rentals, <br />
            Tenants, and <br />
            Payments in One <br />
            Place
          </h1>
          <p className="text-slate-500 text-lg max-w-lg mb-10 leading-relaxed">
            RentSphere helps landlords verify tenants, manage properties, create
            digital leases, and collect rent with late fee automation.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/landlord/signup?role=LANDLORD"
              className="bg-emerald-600 text-white px-6 py-3.5 rounded-lg font-bold flex items-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-100"
            >
              Get Started as Landlord <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/tenant/signup?role=TENANT"
              className="border border-slate-200 text-slate-700 px-6 py-3.5 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors"
            >
              Find a Home as Tenant
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-slate-400 text-xs font-medium mb-1">
                Landlord Portal
              </p>
              <h3 className="font-bold text-slate-800 text-lg">
                RentSphere Dashboard
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              {
                label: "KYC Verified",
                desc: "Identity confirmed",
                icon: ShieldCheck,
                color: "emerald",
              },
              {
                label: "Digital Lease",
                desc: "E-sign in minutes",
                icon: FileCheck,
                color: "blue",
              },
              {
                label: "Rent Collection",
                desc: "Auto & on-time",
                icon: CreditCard,
                color: "purple",
              },
              {
                label: "Tenant Search",
                desc: "Find the right fit",
                icon: Search,
                color: "amber",
              },
            ].map((m) => (
              <div
                key={m.label}
                className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 flex items-center gap-3"
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    m.color === "emerald"
                      ? "bg-emerald-100"
                      : m.color === "blue"
                        ? "bg-blue-100"
                        : m.color === "purple"
                          ? "bg-purple-100"
                          : "bg-amber-100"
                  }`}
                >
                  <m.icon
                    className={`w-4 h-4 ${
                      m.color === "emerald"
                        ? "text-emerald-600"
                        : m.color === "blue"
                          ? "text-blue-600"
                          : m.color === "purple"
                            ? "text-purple-600"
                            : "text-amber-600"
                    }`}
                  />
                </div>
                <div>
                  <p className="text-slate-800 text-xs font-semibold">
                    {m.label}
                  </p>
                  <p className="text-slate-400 text-[10px]">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 mb-3 border border-slate-100">
            <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-3">
              Lease Lifecycle
            </p>
            <div className="flex items-center">
              {[
                { label: "Draft", active: true },
                { label: "Sent", active: true },
                { label: "Signed", active: true },
                { label: "Active", active: false },
                { label: "Expired", active: false },
              ].map((step, i, arr) => (
                <div key={step.label} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-2 h-2 rounded-full mb-1 ${step.active ? "bg-emerald-500" : "bg-slate-200"}`}
                    />
                    <span
                      className={`text-[9px] font-medium ${step.active ? "text-emerald-600" : "text-slate-300"}`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <div
                      className={`h-px flex-1 mb-3 ${step.active ? "bg-emerald-200" : "bg-slate-200"}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-3">
              Why RentSphere
            </p>
            <div className="space-y-2.5">
              {[
                "Automated late fee reminders",
                "Real-time payment notifications",
                "Secure Razorpay integration",
              ].map((text) => (
                <div key={text} className="flex items-center gap-3">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 text-[9px] font-bold">
                      ✓
                    </span>
                  </span>
                  <p className="text-slate-500 text-xs">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="py-20 bg-slate-50 border-y border-slate-100"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              How It Works
            </h2>
            <p className="text-slate-500 text-sm">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                id: "1",
                title: "Sign up and verify",
                desc: "Complete signup with OTP verification and KYC for landlords to ensure trust and security.",
                icon: <ShieldCheck className="w-6 h-6" />,
              },
              {
                id: "2",
                title: "List or discover homes",
                desc: "Landlords add verified properties, while tenants browse through authenticated listings.",
                icon: <Search className="w-6 h-6" />,
              },
              {
                id: "3",
                title: "Sign lease and pay rent",
                desc: "Create digital leases with e-signatures and enable online rent payments with automated tracking.",
                icon: <FileCheck className="w-6 h-6" />,
              },
            ].map((step) => (
              <div
                key={step.id}
                className="relative bg-white p-10 pt-14 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group text-center flex flex-col items-center"
              >
                <div className="absolute -top-4 -left-4">
                  <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-base shadow-lg shadow-emerald-200">
                    {step.id}
                  </div>
                </div>

                <div className="mb-6 text-emerald-600 bg-emerald-50 p-5 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  {step.icon}
                </div>

                <h3 className="font-bold text-xl mb-4 text-slate-900">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div id="features" className="scroll-mt-20" />
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-3">For Landlords</h2>
          <p className="text-slate-500 text-center mb-12">
            Powerful tools to manage your rental business efficiently
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Landlord KYC", icon: <ShieldCheck /> },
              { title: "Tenant Screening", icon: <ClipboardCheck /> },
              { title: "Digital Leases", icon: <FileCheck /> },
              { title: "Rent Collection", icon: <CreditCard /> },
            ].map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all group"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  {f.icon}
                </div>
                <h4 className="font-bold text-slate-800 mb-2">{f.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Secure and automated verification workflows designed for
                  scale.
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-center mb-3">For Tenants</h2>
          <p className="text-slate-500 text-center mb-12">
            Find your perfect home with confidence and ease
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Verified Listings", icon: <CheckCircle2 /> },
              { title: "Apply Once", icon: <LayoutDashboard /> },
              { title: "Secure Leases", icon: <Lock /> },
              { title: "Online Payments", icon: <CreditCard /> },
            ].map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all group"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  {f.icon}
                </div>
                <h4 className="font-bold text-slate-800 mb-2">{f.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Browse only authenticated rentals with secure payment
                  processing.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-5 pb-8 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">
            See RentSphere in Action
          </h2>
          <p className="text-slate-500 text-center mb-16">
            Experience the platform through the tenant journey
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Set your location",
                img: "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop",
                desc: "Pinpoint your preferred neighborhood with our interactive map search.",
              },
              {
                title: "Browse verified homes",
                img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop",
                desc: "Scroll through high-quality, pre-vetted listings with detailed virtual tours.",
              },
              {
                title: "Pay rent online",
                img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800&auto=format&fit=crop",
                desc: "Secure one-click payments with automated receipts and payment history.",
              },
            ].map((a) => (
              <div
                key={a.title}
                className="rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group"
              >
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

      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-3 text-slate-900">
            Built on Trust & Security
          </h2>
          <p className="text-slate-500 mb-16">
            Your safety and security is our top priority
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <ShieldCheck className="w-8 h-8" />,
                title: "KYC for Users",
                desc: "Identity verification ensures all users are authenticated and trustworthy.",
              },
              {
                icon: <FileCheck className="w-8 h-8" />,
                title: "Document Verification",
                desc: "All property documents are verified by our team before listings go live.",
              },
              {
                icon: <Lock className="w-8 h-8" />,
                title: "Secure Payments",
                desc: "Bank-grade encryption and secure gateways for all financial transactions.",
              },
            ].map((t) => (
              <div
                key={t.title}
                className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col items-center group"
              >
                <div className="mb-6 text-emerald-600 bg-emerald-50 p-5 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  {t.icon}
                </div>
                <h4 className="font-bold text-xl mb-4 text-slate-900">
                  {t.title}
                </h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-emerald-600 rounded-[2.5rem] p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4">
              Ready to launch your rental workspace?
            </h2>
            <p className="text-emerald-50 mb-10 opacity-90">
              Create your landlord or tenant account in minutes
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/landlord/signup?role=LANDLORD"
                className="bg-white text-emerald-700 px-8 py-4 rounded-full font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-600" /> Sign up
                as Landlord
              </Link>
              <Link
                href="/tenant/signup?role=TENANT"
                className="bg-emerald-700 text-white px-8 py-4 rounded-full font-bold hover:bg-emerald-800 transition-all flex items-center gap-2"
              >
                <span className="h-2 w-2 rounded-full bg-white" /> Sign up as
                Tenant
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 justify-items-center text-center">
            <div className="flex flex-col items-center space-y-4">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative flex items-center justify-center w-10 h-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl rotate-6 blur-sm" />
                  <div className="relative w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <HomeIcon className="w-5 h-5 text-white stroke-[2.5]" />
                  </div>
                </div>
                <span className="text-slate-900 font-bold text-xl tracking-tight group-hover:text-emerald-600 transition-colors">
                  RentSphere
                </span>
              </Link>
              <p className="text-slate-500 leading-relaxed max-w-[200px]">
                Modern rental management for landlords and tenants.
              </p>
            </div>

            {["Product", "Company", "Legal"].map((col) => (
              <div key={col} className="flex flex-col items-center">
                <h5 className="font-bold text-slate-900 mb-6">{col}</h5>
                <ul className="space-y-4 text-slate-500">
                  <li>
                    <Link
                      href="#"
                      className="hover:text-emerald-600 transition-colors"
                    >
                      Overview
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-emerald-600 transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-emerald-600 transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            ))}
          </div>

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
