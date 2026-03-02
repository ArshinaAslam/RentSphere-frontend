import Link from "next/link";

import { Bed, Bath, Maximize2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";


interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  status: "Available" | "Rented" | "Inactive";
  vacant: number;
  image: string;
}

const statusColors: Record<string, string> = {
  Available: "bg-available",
  // Active: "bg-active",
  // Pending: "bg-pending",
  Rented: "bg-rented",
  Inactive: "bg-inactive",
};

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <Card className="overflow-hidden border-0 bg-card">
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="h-full w-full object-cover"
        />
        <span
          className={`absolute left-3 top-3 rounded-md px-3 py-1 text-xs font-semibold text-primary-foreground ${statusColors[property.status]}`}
        >
          {property.status}
        </span>
      </div>

      <CardContent className="space-y-3 p-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">{property.title}</h3>
          <p className="text-sm text-muted-foreground">{property.location}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-primary">
            ₹{property.price.toLocaleString()}/month
          </span>
          <span className="rounded-full bg-vacant/15 px-2.5 py-0.5 text-xs font-medium text-vacant">
            🟢 {property.vacant} Vacant
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Bed size={14} /> {property.bedrooms} {property.bedrooms === 1 ? "Bed" : "Beds"}
          </span>
          <span className="flex items-center gap-1">
            <Bath size={14} /> {property.bathrooms} {property.bathrooms === 1 ? "Bath" : "Baths"}
          </span>
          <span className="flex items-center gap-1">
            <Maximize2 size={14} /> {property.area.toLocaleString()} sqft
          </span>
        </div>

     <div className="flex gap-2 pt-1">
 <Button 
    variant="outline" 
    size="sm" 
    className="flex-1 text-sm"
    asChild  
  >
    <Link href={`/landlord/my-properties/${property.id}/details`}>
      View Details
    </Link>
  </Button>
<Button 
  asChild 
  size="sm" 
  className="flex-1 text-sm bg-emerald-600 hover:bg-emerald-700 text-white border-0 "
>
  <Link href={`/landlord/my-properties/edit/${property.id}`}>
    Edit Listing
  </Link>
</Button>
</div>
      </CardContent>
    </Card>
  );
}
