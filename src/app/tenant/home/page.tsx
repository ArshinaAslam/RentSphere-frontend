'use client';

import { useEffect, useState, useMemo } from 'react';

import Link from 'next/link';

import {
  Search, MapPin, BedDouble, Bath, Maximize2,
  X, SlidersHorizontal, ChevronLeft, ChevronRight,
  Home, ChevronDown, ChevronUp, ArrowRight,
  Heart,
  Loader2
} from 'lucide-react';

import Navbar from '@/components/layout/Navbar';
import { fetchAllProperties } from '@/features/property/propertyThunk';
import type { propertyData } from '@/features/property/types';
import { toggleWishlist } from '@/features/wishlist/wishlistThunk';
import { useAppDispatch, useAppSelector } from '@/store/hooks';


const BHK_OPTIONS     = ['1 BHK', '2 BHK', '3 BHK', '4+ BHK'];
const TYPE_OPTIONS    = ['Apartment', 'Villa', 'House'];
const STATUS_OPTIONS  = ['Available', 'Rented', 'Inactive'];
const FURNISH_OPTIONS = ['Fully Furnished', 'Semi Furnished', 'Unfurnished'];
const SORT_OPTIONS    = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low–High', value: 'price_asc' },
  { label: 'Price: High–Low', value: 'price_desc' },
];

const LIMIT = 9;

export default function TenantHomePage() {

  const dispatch = useAppDispatch();
  const { properties, total} = useAppSelector(s => s.property);

  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [page, setPage] = useState(1);
  const [selectedType, setSelectedType] = useState('');
  const [selectedBhk, setSelectedBhk] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minBed, setMinBed] = useState('');
  const [minBath, setMinBath] = useState('');
  const [furnishing, setFurnishing] = useState('');
  const [moreOpen, setMoreOpen] = useState(false);

  const totalPages = Math.ceil(total / LIMIT);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    void dispatch(fetchAllProperties({
      page,
      limit: LIMIT,
      search: debounced,
      bhk: selectedBhk,
      type: selectedType,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    }));
  }, [page, debounced, selectedType, selectedBhk, minPrice, maxPrice, dispatch]);

  const displayed = useMemo(() => {
    let r = [...properties];

    if (selectedStatus)
      r = r.filter(p => p.status === selectedStatus);

    if (minBed)
      r = r.filter(p => Number(p.bedrooms) >= Number(minBed));

    if (minBath)
      r = r.filter(p => Number(p.bathrooms) >= Number(minBath));

    if (furnishing)
      r = r.filter(p => p.furnishing === furnishing);

    if (selectedType)
  r = r.filter(p => p.type?.toLowerCase() === selectedType.toLowerCase());

    if (sortBy === 'price_asc')
      r.sort((a, b) => Number(a.price) - Number(b.price));

    if (sortBy === 'price_desc')
      r.sort((a, b) => Number(b.price) - Number(a.price));

    return r;
  }, [properties, selectedStatus,selectedType, minBed, minBath, furnishing, sortBy]);

  const clearAll = () => {
    setSearch('');
    setSelectedType('');
    setSelectedBhk('');
    setSelectedStatus('');
    setMinPrice('');
    setMaxPrice('');
    setMinBed('');
    setMinBath('');
    setFurnishing('');
    setSortBy('newest');
    setPage(1);
  };

  const activeFilters: { label: string; onRemove: () => void }[] = [];

  if (selectedBhk)
    activeFilters.push({ label: selectedBhk, onRemove: () => setSelectedBhk('') });

  if (selectedType)
    activeFilters.push({ label: selectedType, onRemove: () => setSelectedType('') });

  if (selectedStatus)
    activeFilters.push({ label: selectedStatus, onRemove: () => setSelectedStatus('') });

  if (furnishing)
    activeFilters.push({ label: furnishing, onRemove: () => setFurnishing('') });

  if (minBed)
    activeFilters.push({ label: `${minBed}+ Beds`, onRemove: () => setMinBed('') });

  if (minBath)
    activeFilters.push({ label: `${minBath}+ Baths`, onRemove: () => setMinBath('') });

  if (minPrice)
    activeFilters.push({
      label: `Min ₹${Number(minPrice).toLocaleString('en-IN')}`,
      onRemove: () => setMinPrice('')
    });

  if (maxPrice)
    activeFilters.push({
      label: `Max ₹${Number(maxPrice).toLocaleString('en-IN')}`,
      onRemove: () => setMaxPrice('')
    });

  if (sortBy !== 'newest')
    activeFilters.push({
      label: SORT_OPTIONS.find(opt => opt.value === sortBy)?.label || 'Sorted',
      onRemove: () => setSortBy('newest')
    });

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      {/* ── Hero ── */}
<header className="bg-emerald-700 mt-16 relative">

  <button 
    className="absolute top-6 left-8 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
    onClick={() => console.log("Open Menu")} 
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  </button>


  <div className="max-w-7xl mx-auto px-8 pt-8 pb-8 flex flex-col items-center text-center">
    
    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
      Find Your Perfect Place to Live
    </h1>
    
    <p className="text-white/70 text-lg mb-8 max-w-lg">
      Discover thousands of residential properties from apartments to villas, all in one place.
    </p>

      <div className="relative" style={{ width: '420px' }}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title, city, or address..."
              style={{ paddingLeft: '2.75rem', paddingRight: '2.5rem' }}
              className="w-full h-12 text-sm bg-white rounded-2xl shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 text-slate-800 placeholder:text-slate-400"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
  </div>
</header>


      {/* BODY */}
      <div className="w-full px-12 py-10 mt-6 flex gap-8">

    
        {/* SIDEBAR */}
<aside
  className="w-64 bg-white rounded-2xl shadow-sm border border-slate-200 sticky top-24 flex flex-col"
>

  {/* ───── Sidebar Header ───── */}
  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
    <div className="flex items-center gap-2">
      <SlidersHorizontal className="w-4 h-4 text-slate-600" />
      <span className="text-sm font-bold text-slate-800">
        Filters
      </span>
    </div>

    {activeFilters.length > 0 && (
      <button
        onClick={clearAll}
        className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
      >
        <X className="w-3 h-3" />
        Clear
      </button>
    )}
  </div>

  {/* ───── Scrollable Filters Area ───── */}
  <div className="p-6 space-y-6 overflow-y-auto">

    {/* Sort By */}
    <div>
      <p className="text-xs font-bold uppercase mb-3 text-slate-400">
        Sort By
      </p>
      {SORT_OPTIONS.map(s => (
        <button
          key={s.value}
          onClick={() => setSortBy(s.value)}
          className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${
            sortBy === s.value
              ? 'bg-emerald-100 text-emerald-700 font-semibold'
              : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>

    {/* Property Type */}
    <div>
      <p className="text-xs font-bold uppercase mb-3 text-slate-400">
        Property Type
      </p>
      <div className="flex flex-wrap gap-2">
        {TYPE_OPTIONS.map(t => (
          <button
            key={t}
            onClick={() => setSelectedType(selectedType === t ? '' : t)}
            className={`px-3 py-1 rounded-full text-sm border transition ${
              selectedType === t
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'hover:border-emerald-500 text-slate-600'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>

    {/* BHK */}
    <div>
      <p className="text-xs font-bold uppercase mb-3 text-slate-400">
        BHK
      </p>
      <div className="flex flex-wrap gap-2">
        {BHK_OPTIONS.map(b => (
          <button
            key={b}
            onClick={() => setSelectedBhk(selectedBhk === b ? '' : b)}
            className={`px-3 py-1 rounded-full text-sm border transition ${
              selectedBhk === b
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'hover:border-emerald-500 text-slate-600'
            }`}
          >
            {b}
          </button>
        ))}
      </div>
    </div>

    {/* Price */}
    <div>
      <p className="text-xs font-bold uppercase mb-3 text-slate-400">
        Price
      </p>
      <input
        type="number"
        placeholder="Min"
        value={minPrice}
        onChange={e => setMinPrice(e.target.value)}
        className="w-full mb-2 h-10 px-3 border rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none"
      />
      <input
        type="number"
        placeholder="Max"
        value={maxPrice}
        onChange={e => setMaxPrice(e.target.value)}
        className="w-full h-10 px-3 border rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none"
      />
    </div>

    {/* More Filters */}
    <div>
      <button
        onClick={() => setMoreOpen(!moreOpen)}
        className="flex items-center justify-between w-full"
      >
        <p className="text-xs font-bold uppercase text-slate-400">
          More Filters
        </p>
        {moreOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {moreOpen && (
        <div className="mt-4 space-y-4">

          {/* Min Bedrooms */}
          <div>
            <p className="text-xs font-medium mb-2">Min Bedrooms</p>
            <div className="grid grid-cols-4 gap-2">
              {['1','2','3','4'].map(n => (
                <button
                  key={n}
                  onClick={() => setMinBed(minBed === n ? '' : n)}
                  className={`py-1 border rounded text-xs ${
                    minBed === n
                      ? 'bg-emerald-600 text-white'
                      : 'hover:border-emerald-500'
                  }`}
                >
                  {n}+
                </button>
              ))}
            </div>
          </div>

          {/* Min Bathrooms */}
          <div>
            <p className="text-xs font-medium mb-2">Min Bathrooms</p>
            <div className="grid grid-cols-3 gap-2">
              {['1','2','3'].map(n => (
                <button
                  key={n}
                  onClick={() => setMinBath(minBath === n ? '' : n)}
                  className={`py-1 border rounded text-xs ${
                    minBath === n
                      ? 'bg-emerald-600 text-white'
                      : 'hover:border-emerald-500'
                  }`}
                >
                  {n}+
                </button>
              ))}
            </div>
          </div>

          {/* Furnishing */}
          <div>
            <p className="text-xs font-medium mb-2">Furnishing</p>
            <div className="space-y-2">
              {FURNISH_OPTIONS.map(f => (
                <button
                  key={f}
                  onClick={() => setFurnishing(furnishing === f ? '' : f)}
                  className={`block w-full text-left px-2 py-1 rounded text-xs ${
                    furnishing === f
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'hover:bg-slate-100'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <p className="text-xs font-medium mb-2">Status</p>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedStatus(selectedStatus === s ? '' : s)}
                  className={`px-2 py-1 rounded-full text-xs border ${
                    selectedStatus === s
                      ? 'bg-emerald-600 text-white'
                      : 'hover:border-emerald-500'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>

  </div>
</aside>

        {/* MAIN CONTENT */}
        <div className="flex-1">

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {activeFilters.map(f => (
                <span key={f.label}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-full"
                >
                  {f.label}
                  <button onClick={f.onRemove}>
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <p className="text-sm mb-6 text-slate-600">
            Showing {displayed.length} of {total} properties
          </p>

          <div className="grid grid-cols-2 xl:grid-cols-3 gap-8">
            {displayed.map(p => (
              <PropertyCard key={p._id} property={p} />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

/* PROPERTY CARD */

function PropertyCard({ property }: { property: propertyData }) {
  const [imgErr, setImgErr] = useState(false);
   const dispatch   = useAppDispatch();
   const { userData } = useAppSelector(s => s.auth);
    const { wishlisted, togglingId } = useAppSelector(s => s.wishlist);

  const isWishlisted = wishlisted.includes(property._id);
  const isToggling   = togglingId === property._id;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userData?.id) return;
    void dispatch(toggleWishlist({
      tenantId:    userData.id,
      propertyId:  property._id,
      isWishlisted,
    }));
  };


  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 transition-all">

      <div className="relative h-60 bg-slate-100">
        {property.images?.[0] && !imgErr ? (
          <img
            src={property.images[0]}
            alt={property.title}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Home size={40} className="text-slate-300" />
          </div>
        )}

        <span className="absolute top-3 left-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold">
          {property.status}
        </span>


          <button
          onClick={handleWishlist}
          className="absolute top-2 right-3 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-all"
        >
          {isToggling ? (
            <Loader2 size={16} className="animate-spin text-slate-400" />
          ) : (
            <Heart
              size={16}
              className={isWishlisted ? "text-rose-500 fill-rose-500" : "text-slate-400"}
            />
          )}
        </button>
      </div>

      <div className="p-5">

        <h3 className="font-bold text-lg mb-2">
          {property.title}
        </h3>

        <p className="text-sm text-slate-500 mb-3">
          {property.address}, {property.city}
        </p>

        {/* NEW INFO TAGS */}
        <div className="flex flex-wrap gap-2 mb-4 text-xs">
          {property.bhk && (
            <span className="px-2 py-1 bg-slate-100 rounded-md">
              {property.bhk}
            </span>
          )}
          {property.type && (
            <span className="px-2 py-1 bg-slate-100 rounded-md">
              {property.type}
            </span>
          )}
          {property.furnishing && (
            <span className="px-2 py-1 bg-slate-100 rounded-md">
              {property.furnishing}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
          <span>{property.bedrooms} Beds</span>
          <span>{property.bathrooms} Baths</span>
          <span>{property.area} sqft</span>
        </div>

        <div className="text-xl font-bold mb-4">
          ₹ {Number(property.price).toLocaleString('en-IN')} /month
        </div>

        <Link href={`/tenant/home/${property._id}`}>
          <button className="w-full py-3 bg-emerald-600 text-white rounded-xl">
            View Details
          </button>
        </Link>

      </div>
    </article>
  );
}