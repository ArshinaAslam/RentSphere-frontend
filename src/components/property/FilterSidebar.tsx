import { ChevronDown, SlidersHorizontal } from "lucide-react";

import { Input } from "../ui/input";

export function FilterSidebar() {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 sticky top-6">
      <div className="flex items-center gap-2 mb-8 pb-4 border-b border-slate-50">
        <SlidersHorizontal className="w-5 h-5 text-slate-900" />
        <h2 className="text-xl font-bold text-slate-900">Filters</h2>
      </div>

      <div className="space-y-8">
        {/* Sort By */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Sort By</label>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-sm">Newest First</button>
            <button className="w-full text-left px-4 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 font-medium text-sm">Price: Low—High</button>
            <button className="w-full text-left px-4 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 font-medium text-sm">Price: High—Low</button>
          </div>
        </div>

        {/* Property Type */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Property Type</label>
          <div className="flex flex-wrap gap-2">
            {['Apartment', 'Villa', 'House'].map((type) => (
              <button key={type} className="px-4 py-2 rounded-full border border-slate-200 text-slate-600 text-sm font-medium hover:border-emerald-500 transition-colors">
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* BHK */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">BHK</label>
          <div className="flex flex-wrap gap-2">
            {['1 BHK', '2 BHK', '3 BHK', '4+ BHK'].map((bhk) => (
              <button key={bhk} className="px-4 py-2 rounded-full border border-slate-200 text-slate-600 text-sm font-medium hover:border-emerald-500">
                {bhk}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Price Range (₹/MO)</label>
          <div className="flex items-center gap-2">
            <Input placeholder="₹ Min" className="rounded-xl border-slate-200 bg-slate-50" />
            <Input placeholder="₹ Max" className="rounded-xl border-slate-200 bg-slate-50" />
          </div>
        </div>

        {/* More Filters Accordion */}
        <div className="pt-4 border-t border-slate-50">
          <button className="flex items-center justify-between w-full text-[10px] font-black uppercase tracking-widest text-slate-400">
            More Filters <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}