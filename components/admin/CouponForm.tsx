'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { X, Loader2 } from 'lucide-react';

interface CouponFormProps {
  initialData?: {
    _id: string;
    code: string;
    discountType: 'percentage' | 'flat';
    discountValue: number;
    maxUses: number;
    minOrderAmount: number;
    expiresAt: string | null;
    usedCount: number;
    isActive: boolean;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CouponForm({ initialData, onSuccess, onCancel }: CouponFormProps) {
  const [formData, setFormData] = useState({
    code: initialData?.code || '',
    discountType: (initialData?.discountType || 'percentage') as 'percentage' | 'flat',
    discountValue: initialData?.discountValue || 0,
    maxUses: initialData?.maxUses || 100,
    minOrderAmount: initialData?.minOrderAmount || 0,
    expiresAt: initialData?.expiresAt ? initialData.expiresAt.split('T')[0] : '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'discountType' ? value : name.includes('Value') || name.includes('Uses') || name.includes('Amount') ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = initialData ? `/api/admin/coupons/${initialData._id}` : '/api/admin/coupons';
      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to save coupon');
        return;
      }

      toast.success(initialData ? 'Coupon updated!' : 'Coupon created!');
      onSuccess?.();
    } catch (error) {
      console.error('Error saving coupon:', error);
      toast.error('Failed to save coupon');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{initialData ? 'Edit Coupon' : 'Create New Coupon'}</h2>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Coupon Code *</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="e.g., SAVE20"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
            required
            disabled={!!initialData}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Discount Type *</label>
          <select
            name="discountType"
            value={formData.discountType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="flat">Flat Amount (₹)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Discount Value {formData.discountType === 'percentage' ? '(0-100)' : '(₹)'} *
          </label>
          <input
            type="number"
            name="discountValue"
            value={formData.discountValue}
            onChange={handleChange}
            min={formData.discountType === 'percentage' ? 0 : 0}
            max={formData.discountType === 'percentage' ? 100 : undefined}
            placeholder="e.g., 20"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Maximum Uses</label>
          <input
            type="number"
            name="maxUses"
            value={formData.maxUses}
            onChange={handleChange}
            min={1}
            placeholder="e.g., 100"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Minimum Order Amount (₹)</label>
          <input
            type="number"
            name="minOrderAmount"
            value={formData.minOrderAmount}
            onChange={handleChange}
            min={0}
            placeholder="e.g., 500"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Expiry Date</label>
          <input
            type="date"
            name="expiresAt"
            value={formData.expiresAt}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium flex items-center gap-2"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {initialData ? 'Update Coupon' : 'Create Coupon'}
        </button>
      </div>
    </form>
  );
}
