'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { Heart, Home, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

import Navbar  from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { fetchWishlist, toggleWishlist } from '@/features/wishlist/wishlistThunk';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const LIMIT = 6;

export default function FavouritesPage() {
  const dispatch = useAppDispatch();
  const { userData }  = useAppSelector(s => s.auth);
  const { items, isLoading, togglingId, total, currentPage } = useAppSelector(s => s.wishlist);

 

  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(total / LIMIT);

  useEffect(() => {
    if (userData?.id) {
     void dispatch(fetchWishlist({ tenantId: userData.id, page, limit: LIMIT }));
    }
  }, [userData?.id, page, dispatch]);

  const handleRemove = (propertyId: string) => {
    if (!userData?.id) return;
    void dispatch(toggleWishlist({
      tenantId:     userData.id,
      propertyId,
      isWishlisted: true,
    })).then(() => {
      // if last item on page, go back one page
      if (items.length === 1 && page > 1) {
        setPage(p => p - 1);
      } else {
       void  dispatch(fetchWishlist({ tenantId: userData.id, page, limit: LIMIT }));
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Sidebar />

      <main className="pl-64 pt-16 min-h-screen">
        <div className="max-w-5xl mx-auto px-8 py-10">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-1">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
              <h1 className="text-2xl font-bold text-slate-900">My Favourites</h1>
            </div>
            <p className="text-slate-500 text-sm">
              {total} saved {total === 1 ? 'property' : 'properties'}
            </p>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          )}

          {/* Empty */}
          {!isLoading && items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mb-4">
                <Heart className="w-9 h-9 text-rose-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No favourites yet</h3>
              <p className="text-slate-400 text-sm mb-6">
                Browse properties and tap the heart icon to save them here.
              </p>
              <Link href="/tenant/home">
                <button className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition">
                  Browse Properties
                </button>
              </Link>
            </div>
          )}

          {/* Grid */}
          {!isLoading && items.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => {
                  const property = typeof item.propertyId === 'object' ? item.propertyId : null;
                  
                  if (!property) return null;
                  const isRemoving = togglingId === property._id;

                  return (
                    <article key={item._id}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all"
                    >
                      <div className="relative h-52 bg-slate-100">
                        {property.images?.[0] ? (
                          <img src={property.images[0]} alt={property.title}
                            className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Home size={36} className="text-slate-300" />
                          </div>
                        )}
                        <span className="absolute top-3 left-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                          {property.status}
                        </span>
                        <button
                          onClick={() => handleRemove(property._id)}
                          disabled={isRemoving}
                          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-rose-50 transition-all hover:scale-110"
                        >
                          {isRemoving
                            ? <Loader2 size={15} className="animate-spin text-slate-400" />
                            : <Heart size={15} className="text-rose-500 fill-rose-500" />
                          }
                        </button>
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold text-slate-900 mb-1 truncate">{property.title}</h3>
                        <p className="text-xs text-slate-500 mb-3 truncate">{property.address}, {property.city}</p>

                        <div className="flex flex-wrap gap-1.5 mb-3 text-xs">
                          {property.bhk       && <span className="px-2 py-1 bg-slate-100 rounded-md">{property.bhk}</span>}
                          {property.type      && <span className="px-2 py-1 bg-slate-100 rounded-md">{property.type}</span>}
                          {property.furnishing && <span className="px-2 py-1 bg-slate-100 rounded-md">{property.furnishing}</span>}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                          <span>{property.bedrooms} Beds</span>
                          <span>{property.bathrooms} Baths</span>
                          <span>{property.area} sqft</span>
                        </div>

                        <p className="text-lg font-bold text-slate-900 mb-4">
                          ₹ {Number(property.price).toLocaleString('en-IN')}
                          <span className="text-xs font-normal text-slate-400"> /month</span>
                        </p>

                        <Link href={`/tenant/home/${property._id}`}>
                          <button className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition">
                            View Details
                          </button>
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-200">
                  <p className="text-sm text-slate-500">
                    Page {currentPage} of {totalPages} · {total} properties
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                      className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-emerald-600 transition disabled:opacity-30"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <div className="w-8 h-8 rounded-lg text-xs font-bold bg-emerald-600 text-white flex items-center justify-center">
                      {page}
                    </div>
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(p => p + 1)}
                      className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-emerald-600 transition disabled:opacity-30"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
}