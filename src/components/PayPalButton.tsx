import React from 'react';

interface PayPalButtonProps {
  email: string;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ email }) => {
  return (
    <div className="mt-4 space-y-4">
      <div className="bg-[#1A1F35] p-4 rounded-lg border border-[#1E2642] mb-4">
        <h3 className="text-white font-medium mb-2">Important Payment Information</h3>
        <ul className="text-sm text-gray-400 space-y-2">
          <li>• Your account email: <span className="text-white">{email}</span></li>
          <li>• Payment amount: <span className="text-white">$7 USD</span></li>
          <li>• After payment, click "Return to Merchant" to activate your account</li>
          <li>• You can use any PayPal account to pay - we'll link it to your signup email</li>
        </ul>
      </div>

      <a
        href="https://www.paypal.com/ncp/payment/ULSN3LZGJUHPQ"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex justify-center py-3 px-4 rounded-lg text-white bg-[#0070BA] hover:bg-[#003087] transition-colors duration-200 font-medium items-center gap-2"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.067 8.478c.492.315.844.825.983 1.39.545 2.183-.922 4.445-3.168 4.445h-1.92l-.599 2.404A1.46 1.46 0 0113.93 18H12l-.72 2.88h-.72a.36.36 0 01-.359-.432l.42-1.68h-2.62l-.72 2.88h-.72a.36.36 0 01-.359-.432l.42-1.68H3.36a.36.36 0 01-.359-.432l.42-1.68h2.62l.72-2.88H4.08a.36.36 0 01-.359-.432l.42-1.68h2.62l.72-2.88h.72a.36.36 0 01.359.432l-.42 1.68h2.62l.72-2.88h.72a.36.36 0 01.359.432l-.42 1.68h1.92c1.16 0 2.244.479 2.928 1.262.492.563.787 1.263.84 2.005z"/>
        </svg>
        Pay with PayPal
      </a>

      <div className="mt-6 border-t border-[#1E2642] pt-4">
        <button
          onClick={() => window.location.reload()}
          className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
        >
          I've Completed Payment
        </button>
      </div>

      <p className="text-sm text-gray-400 text-center">
        Having issues? Contact support with your PayPal transaction ID
      </p>
    </div>
  );
};

export default PayPalButton;