export interface Payment {
  _id:               string;
  leaseId:           string;
  tenantId:          string;
  landlordId:        string;
  propertyId:        string;
  type:              'deposit' | 'rent' | 'late_fee' | 'refund';
  amount:            number;
  platformFee:       number;
  landlordAmount:    number;
  status:            'pending' | 'completed' | 'failed';
  dueDate?:          string;
  paidAt?:           string;
  razorpayOrderId?:  string;
  month?:            number;
  year?:             number;
  notes?:            string;
  createdAt:         string;
}

export interface DepositOrderResult {
  orderId:   string;
  amount:    number;
  currency:  string;
  paymentId: string;
  keyId:     string;
}

// export interface PaymentState {
//   payments:          Payment[];
//   isLoading:         boolean;
//   isProcessing:      boolean;
//   error:             string | null;
// }

export interface PaymentState {
  payments:     Payment[];
  pagination:   { total: number; page: number; totalPages: number };
  isLoading:    boolean;
  isProcessing: boolean;
  error:        string | null;
}

export interface PaginatedPayments {
  payments:   Payment[];
  total:      number;
  page:       number;
  totalPages: number;
}