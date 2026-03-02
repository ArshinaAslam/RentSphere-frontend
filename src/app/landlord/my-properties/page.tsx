// 'use client';

// import { useState } from "react";
// import LandlordNavbar from "@/components/layout/LandlordNavbar";
// import LandlordSidebar from "@/components/layout/LandlordSidebar";
// import { Button } from "@/components/ui/button";
// import { Plus, ChevronLeft, ChevronRight, Search } from "lucide-react";
// import PropertyCard from "@/components/property/PropertyCard";
// import AddPropertyPage from './AddPropertyPage';
// import { Input } from "@/components/ui/input";

// const properties = [
//   {
//     id: 1,
//     title: "Luxury 3BHK Apartment",
//     location: "Downtown, Mumbai",
//     price: 45000,
//     bedrooms: 3,
//     bathrooms: 2,
//     area: 1200,
//     status: "Available" as const,
//     vacant: 2,
//     image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&auto=format&fit=crop&q=80",
//   },
//   {
//     id: 2,
//     title: "Modern 2BHK Villa",
//     location: "Bandra West, Mumbai",
//     price: 65000,
//     bedrooms: 2,
//     bathrooms: 2,
//     area: 950,
//     status: "Active" as const,
//     vacant: 5,
//     image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500&auto=format&fit=crop&q=80",
//   },
//   {
//     id: 3,
//     title: "Cozy 1BHK Villa",
//     location: "Andheri East, Mumbai",
//     price: 28000,
//     bedrooms: 1,
//     bathrooms: 1,
//     area: 600,
//     status: "Pending" as const,
//     vacant: 0,
//     image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=80",
//   },
//   {
//     id: 4,
//     title: "Spacious 4BHK Apartment",
//     location: "Worli, Mumbai",
//     price: 120000,
//     bedrooms: 4,
//     bathrooms: 3,
//     area: 2200,
//     status: "Rented" as const,
//     vacant: 1,
//     image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&auto=format&fit=crop&q=80",
//   },
//   {
//     id: 5,
//     title: "Garden View 2BHK",
//     location: "Powai, Mumbai",
//     price: 38000,
//     bedrooms: 2,
//     bathrooms: 2,
//     area: 950,
//     status: "Active" as const,
//     vacant: 1,
//     image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&auto=format&fit=crop&q=80",
//   },
//   {
//     id: 6,
//     title: "Sea View 3BHK",
//     location: "Marine Drive, Mumbai",
//     price: 85000,
//     bedrooms: 3,
//     bathrooms: 2,
//     area: 1400,
//     status: "Inactive" as const,
//     vacant: 1,
//     image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=500&auto=format&fit=crop&q=80",
//   },
// ];

// const ITEMS_PER_PAGE = 6;

// export default function PropertiesPage() {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showAddProperty, setShowAddProperty] = useState(false);

//   const totalPages = Math.ceil(properties.length / ITEMS_PER_PAGE);
//   const paged = properties.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   );

//   if (showAddProperty) {
//     return <AddPropertyPage onBack={() => setShowAddProperty(false)}/>;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30">
//       <LandlordNavbar />
//       <LandlordSidebar />

//       <main className="pl-64 pt-16 min-h-screen">
//         <div className="max-w-5xl mx-auto px-10 py-10">

//           {/* Header Row */}
//           <div className="mb-8 pt-8 flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-slate-900 mb-1">
//                 My Properties
//               </h1>
//               <p className="text-slate-500 font-medium">
//                 Manage your property listings and track their performance
//               </p>
//             </div>
//             <Button
//               onClick={() => setShowAddProperty(true)}
//               className="h-11 px-6 text-sm font-semibold bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-xl transition-all duration-300 gap-2 whitespace-nowrap"
//             >
//               <Plus size={16} />
//               Add Property
//             </Button>
//           </div>

//           {/* Search Row */}
//           <div className="mb-8">
//             <div className="relative max-w-sm">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
//               <Input
//                 placeholder="Search properties..."
//                 className="h-11 pl-11 pr-4 bg-white border-slate-200 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
//               />
//             </div>
//           </div>

//           {/* Properties Grid */}
//           <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
//             {paged.map((property) => (
//               <PropertyCard key={property.id} property={property} />
//             ))}
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="mt-10 flex items-center justify-center gap-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage((p) => p - 1)}
//                 className="h-10 px-5 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 gap-2 font-semibold"
//               >
//                 <ChevronLeft size={16} />
//                 Previous
//               </Button>

//               {Array.from({ length: totalPages }, (_, i) => (
//                 <Button
//                   key={i}
//                   size="sm"
//                   variant={currentPage === i + 1 ? "default" : "outline"}
//                   onClick={() => setCurrentPage(i + 1)}
//                   className={`h-10 w-10 p-0 font-semibold transition-all duration-200 ${
//                     currentPage === i + 1
//                       ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
//                       : "border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
//                   }`}
//                 >
//                   {i + 1}
//                 </Button>
//               ))}

//               <Button
//                 variant="outline"
//                 size="sm"
//                 disabled={currentPage === totalPages}
//                 onClick={() => setCurrentPage((p) => p + 1)}
//                 className="h-10 px-5 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 gap-2 font-semibold"
//               >
//                 Next
//                 <ChevronRight size={16} />
//               </Button>
//             </div>
//           )}

//         </div>
//       </main>
//     </div>
//   );
// }



// 'use client';

// import { useState } from "react";
// import LandlordNavbar from "@/components/layout/LandlordNavbar";
// import LandlordSidebar from "@/components/layout/LandlordSidebar";
// import { Button } from "@/components/ui/button";
// import { Plus, ChevronLeft, ChevronRight, Search, Building2 } from "lucide-react";
// import PropertyCard from "@/components/property/PropertyCard";
// import AddPropertyPage from './AddPropertyPage';
// import { Input } from "@/components/ui/input";

// const ITEMS_PER_PAGE = 6;

// export default function PropertiesPage() {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showAddProperty, setShowAddProperty] = useState(false);
//   const [properties, setProperties] = useState<any[]>([]); // replace with your real data fetch

//   const totalPages = Math.ceil(properties.length / ITEMS_PER_PAGE);
//   const paged = properties.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   );

//   if (showAddProperty) {
//     return <AddPropertyPage onBack={() => setShowAddProperty(false)} />;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30">
//       <LandlordNavbar />
//       <LandlordSidebar />

//       <main className="pl-64 pt-16 min-h-screen">
//         <div className="max-w-5xl mx-auto px-10 py-10">

//           {/* Header Row */}
//           <div className="mb-8 pt-8 flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-slate-900 mb-1">
//                 My Properties
//               </h1>
//               <p className="text-slate-500 font-medium">
//                 Manage your property listings and track their performance
//               </p>
//             </div>
//             <Button
//               onClick={() => setShowAddProperty(true)}
//               className="h-11 px-6 text-sm font-semibold bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-xl transition-all duration-300 gap-2 whitespace-nowrap"
//             >
//               <Plus size={16} />
//               Add Property
//             </Button>
//           </div>

//           {/* Search Row — only show if there are properties */}
//           {properties.length > 0 && (
//             <div className="mb-8">
//               <div className="relative max-w-sm">
//                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
//                 <Input
//                   placeholder="Search properties..."
//                   className="h-11 pl-11 pr-4 bg-white border-slate-200 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
//                 />
//               </div>
//             </div>
//           )}

//           {/* Empty State */}
//           {properties.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-24 text-center">
//               <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
//                 <Building2 size={36} className="text-emerald-400" />
//               </div>
//               <h2 className="text-xl font-semibold text-slate-800 mb-2">
//                 No properties yet
//               </h2>
//               <p className="text-slate-500 max-w-sm mb-8">
//                 You haven't listed any properties yet. Add your first property to get started.
//               </p>
//               <Button
//                 onClick={() => setShowAddProperty(true)}
//                 className="h-11 px-6 text-sm font-semibold bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg gap-2"
//               >
//                 <Plus size={16} />
//                 Add Your First Property
//               </Button>
//             </div>
//           ) : (
//             <>
//               {/* Properties Grid */}
//               <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
//                 {paged.map((property) => (
//                   <PropertyCard key={property.id} property={property} />
//                 ))}
//               </div>

//               {/* Pagination */}
//               {totalPages > 1 && (
//                 <div className="mt-10 flex items-center justify-center gap-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     disabled={currentPage === 1}
//                     onClick={() => setCurrentPage((p) => p - 1)}
//                     className="h-10 px-5 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 gap-2 font-semibold"
//                   >
//                     <ChevronLeft size={16} />
//                     Previous
//                   </Button>

//                   {Array.from({ length: totalPages }, (_, i) => (
//                     <Button
//                       key={i}
//                       size="sm"
//                       variant={currentPage === i + 1 ? "default" : "outline"}
//                       onClick={() => setCurrentPage(i + 1)}
//                       className={`h-10 w-10 p-0 font-semibold transition-all duration-200 ${
//                         currentPage === i + 1
//                           ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
//                           : "border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
//                       }`}
//                     >
//                       {i + 1}
//                     </Button>
//                   ))}

//                   <Button
//                     variant="outline"
//                     size="sm"
//                     disabled={currentPage === totalPages}
//                     onClick={() => setCurrentPage((p) => p + 1)}
//                     className="h-10 px-5 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 gap-2 font-semibold"
//                   >
//                     Next
//                     <ChevronRight size={16} />
//                   </Button>
//                 </div>
//               )}
//             </>
//           )}

//         </div>
//       </main>
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from "react";

import { Plus, ChevronLeft, ChevronRight, Search, Building2 } from "lucide-react";
import { useSelector } from 'react-redux';

import LandlordNavbar from "@/components/layout/LandlordNavbar";
import LandlordSidebar from "@/components/layout/LandlordSidebar";
import PropertyCard from "@/components/property/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchLandlordProperties } from "@/features/property/propertyThunk";
import type { propertyData } from "@/features/property/types";
import { useAppDispatch } from "@/store/hooks";
import type { RootState } from "@/store/index";

import AddPropertyPage from './AddPropertyPage';


const ITEMS_PER_PAGE = 6;

export default function PropertiesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddProperty, setShowAddProperty] = useState(false);
   const [searchQuery, setSearchQuery] = useState("");
   const [debouncedSearch, setDebouncedSearch] = useState("");
   const dispatch = useAppDispatch()


   useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchQuery); 
  }, 500);

  return () => clearTimeout(timer); 
}, [searchQuery]);

  useEffect(() => {
  dispatch(fetchLandlordProperties({ page: currentPage, search: debouncedSearch }));
}, [debouncedSearch, currentPage]);

    const { properties, isLoading, total, limit } = useSelector((state: RootState) => state.property);
  const totalPages = Math.ceil(total / limit);



  
  if (showAddProperty) {
    return <AddPropertyPage onBack={() => setShowAddProperty(false)} />;
  }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30">
      <LandlordNavbar />
      <LandlordSidebar />

      <main className="pl-64 pt-16 min-h-screen">
        <div className="max-w-5xl mx-auto px-10 py-10">

          {/* Header Row */}
          <div className="mb-8 pt-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1">
                My Properties
              </h1>
              <p className="text-slate-500 font-medium">
                {properties.length === 0 
                  ? "List your first property to get started" 
                  : `${properties.length} properties listed • Manage your listings`
                }
              </p>
            </div>
            <Button
              onClick={() => setShowAddProperty(true)}
              className="h-11 px-6 text-sm font-semibold bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-xl transition-all duration-300 gap-2 whitespace-nowrap"
            >
              <Plus size={16} />
              {properties.length === 0 ? "Add First Property" : "Add Property"}
            </Button>
          </div>

          {/* Search Row — only show if properties exist */}
          {properties.length > 0 && (
            <div className="mb-8">
              <div className="relative max-w-sm">
                {/* <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" /> */}
                <Input
                      value={searchQuery}
                    onChange={handleSearch}
                  placeholder="Search properties..."
                  className="h-11 pl-11 pr-4 bg-white border-slate-200 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* EMPTY STATE vs PROPERTIES LIST */}
          {properties.length === 0 ? (
            /* EMPTY STATE (No Properties Added Yet) */
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                <Building2 size={36} className="text-emerald-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">
                No properties yet
              </h2>
              <p className="text-slate-500 max-w-sm mb-8">
                You haven't listed any properties yet. Add your first property to get started.
              </p>
              <Button
                onClick={() => setShowAddProperty(true)}
                className="h-11 px-8 text-sm font-semibold bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg gap-2"
              >
                <Plus size={16} />
                Add Your First Property
              </Button>
            </div>
          ) : (
            /*  PROPERTIES GRID + PAGINATION (Has Properties) */
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {properties.map((property: propertyData) => {
    const displayProperty = {
      id: property._id,
      title: property.title,
      location: `${property.city}, ${property.state}`,
      price: property.price || 0,
      bedrooms: property.bedrooms || 0,
      bathrooms: property.bathrooms || 0,
      area: property.area || 0,
      status: property.status,
      vacant: property.vacant || 0,
      image: property.images?.[0] || "https://via.placeholder.com/400x300?text=No+Image"
    };
    
    return (
      <PropertyCard 
         key={property._id} 
        property={displayProperty} 
      />
    );
  })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="h-10 px-5 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 gap-2 font-semibold"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i}
                      size="sm"
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`h-10 w-10 p-0 font-semibold transition-all duration-200 ${
                        currentPage === i + 1
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                          : "border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
                      }`}
                    >
                      {i + 1}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="h-10 px-5 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 gap-2 font-semibold"
                  >
                    Next
                    <ChevronRight size={16} />
                  </Button>
                </div>
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
}
