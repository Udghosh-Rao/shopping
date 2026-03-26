'use client';

import { CreditCard, TrendingDown } from 'lucide-react';

interface PaymentMethodsProps {
  selectedMethod: 'razorpay' | 'cod';
  onMethodChange: (method: 'razorpay' | 'cod') => void;
}

export default function PaymentMethods({ selectedMethod, onMethodChange }: PaymentMethodsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select Payment Method</h3>

      {/* Razorpay Option */}
      <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all" style={{
        borderColor: selectedMethod === 'razorpay' ? '#1f2937' : '#e5e7eb',
        backgroundColor: selectedMethod === 'razorpay' ? '#f9fafb' : 'transparent'
      }}>
        <input
          type="radio"
          name="payment"
          value="razorpay"
          checked={selectedMethod === 'razorpay'}
          onChange={() => onMethodChange('razorpay')}
          className="w-4 h-4 cursor-pointer"
        />
        <CreditCard className="w-5 h-5 ml-3 text-blue-600" />
        <div className="ml-3">
          <p className="font-medium">Razorpay (UPI, Cards, Netbanking)</p>
          <p className="text-sm text-gray-500">Secure payment via Razorpay</p>
        </div>
      </label>

      {/* Cash on Delivery Option */}
      <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all" style={{
        borderColor: selectedMethod === 'cod' ? '#1f2937' : '#e5e7eb',
        backgroundColor: selectedMethod === 'cod' ? '#f9fafb' : 'transparent'
      }}>
        <input
          type="radio"
          name="payment"
          value="cod"
          checked={selectedMethod === 'cod'}
          onChange={() => onMethodChange('cod')}
          className="w-4 h-4 cursor-pointer"
        />
        <TrendingDown className="w-5 h-5 ml-3 text-green-600" />
        <div className="ml-3">
          <p className="font-medium">Cash on Delivery (COD)</p>
          <p className="text-sm text-gray-500">Pay when you receive your order</p>
        </div>
      </label>
    </div>
  );
}
