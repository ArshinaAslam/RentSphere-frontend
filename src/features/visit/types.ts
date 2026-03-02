export interface BookedSlotsResponse {
  bookedSlots: string[];
}

export interface BookVisitParams {
  propertyId: string;
  landlordId: string;
  date:       string;
  timeSlot:   string;
}

interface PopulatedProperty {
  _id:     string;
  title:   string;
  address: string;
  city:    string;
  images:  string[];
}

export interface VisitBooking {
  _id:        string;
  propertyId: string | PopulatedProperty;
  tenantId:   string;
  landlordId: string;
  date:       string;
  timeSlot:   string;
  status:     'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt:  string;
}