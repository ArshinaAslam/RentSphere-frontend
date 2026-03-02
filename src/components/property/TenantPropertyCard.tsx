import { Badge, Bath, BedDouble, MapPin, Maximize } from "lucide-react";

export function TenantPropertyCard({ property }: { property: any }) {
  return (
    <div className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
        />
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <Badge className={`
            ${property.status === 'Available' ? 'bg-emerald-500/20 text-emerald-700' : 
              property.status === 'Rented' ? 'bg-red-500/20 text-red-700' : 'bg-slate-500/20 text-slate-700'}
            backdrop-blur-md border-none px-3 py-1 rounded-full font-bold text-xs
          `}>
            {property.status}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">
          {property.title}
        </h3>
        
        <div className="flex items-center gap-1.5 text-slate-400 text-sm mb-6">
          <MapPin className="w-4 h-4 text-emerald-500" />
          <span className="truncate">{property.location}</span>
        </div>

        {/* Specs */}
        <div className="flex items-center justify-between py-4 border-y border-slate-50 mb-6">
          <div className="flex flex-col items-center gap-1">
            <BedDouble className="w-4 h-4 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase">{property.beds} Bed</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Bath className="w-4 h-4 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase">{property.baths} Bath</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Maximize className="w-4 h-4 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase">{property.sqft} sqft</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">₹ {property.price}</span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">per month</p>
          </div>
          <button className="text-emerald-600 font-bold text-sm hover:underline">
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
}

// Dummy Data
const PROPERTIES = [
  { id: 1, title: 'Luxurious 3BHK Apartment in Bandra...', location: '12, Sea Breeze Tower...', beds: 3, baths: 2, sqft: 1850, price: '85,000', status: 'Available', image: '/path-to-image.jpg' },
  // ... add others from your screenshots
];