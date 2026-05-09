export interface Payment {
  _id:               string;
  leaseId:           string;
  tenantId:          string;
  tenantName:     string;  
  landlordId:        string;
  propertyId:        string;
  propertyTitle:  string;
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

export interface TenantPaymentsData {
  payments: Payment[];
  total: number;
  totalPages: number;
  page: number;
}

export interface PaymentState {
  payments:     Payment[];
  selectedPayment: Payment | null;
  pagination:   { total: number; page: number; totalPages: number };
  landlordPagination:  { total: number; page: number; totalPages: number };
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

export interface PaginatedLandlordPayments {
  payments:   Payment[];
  total:      number;
  page:       number;
  totalPages: number;
}

export interface ApiErrorResponse {
  message: string;
}