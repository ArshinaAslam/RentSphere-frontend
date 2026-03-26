export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) {
      resolve(true);
      return;
    }
    const script    = document.createElement('script');
    script.id       = 'razorpay-script';
    script.src      = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload   = () => resolve(true);
    script.onerror  = () => resolve(false);
    document.body.appendChild(script);
  });
}

interface RazorpayOptions {
  orderId:     string;
  amount:      number;
  currency:    string;
  keyId:       string;
  description: string;
  prefill?: {
    name?:    string;
    email?:   string;
    contact?: string;
  };
  onSuccess: (response: {
    razorpay_order_id:   string;
    razorpay_payment_id: string;
    razorpay_signature:  string;
  }) => void;
  onFailure: (error: unknown) => void;
}

export function openRazorpay(options: RazorpayOptions): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rzp = new (window as any).Razorpay({
    key:         options.keyId,
    amount:      options.amount,
    currency:    options.currency,
    name:        'RentSphere',
    description: options.description,
    order_id:    options.orderId,
    prefill:     options.prefill ?? {},
    theme:       { color: '#059669' },
    handler: (response: {
      razorpay_order_id:   string;
      razorpay_payment_id: string;
      razorpay_signature:  string;
    }) => {
      options.onSuccess(response);
    },
    modal: {
      ondismiss: () => options.onFailure('Payment cancelled'),
    },
  });
  rzp.open();
}