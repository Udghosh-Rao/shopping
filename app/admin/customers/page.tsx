'use client';

import { useState, useEffect } from 'react';
import { Loader2, Users, Mail } from 'lucide-react';

interface Customer {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/customers')
      .then((res) => res.json())
      .then((data) => setCustomers(data.customers || []))
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
          <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-sm text-muted">{customers.length} registered users</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted" /></div>
      ) : (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-3 px-5 font-semibold text-muted">Name</th>
                  <th className="text-left py-3 px-5 font-semibold text-muted">Email</th>
                  <th className="text-left py-3 px-5 font-semibold text-muted">Role</th>
                  <th className="text-left py-3 px-5 font-semibold text-muted">Joined</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer._id} className="border-b border-[var(--border)] last:border-0">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-bold">
                          {customer.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <span className="font-medium">{customer.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-1.5 text-muted">
                        <Mail className="w-3.5 h-3.5" />
                        {customer.email}
                      </div>
                    </td>
                    <td className="py-3 px-5">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                        customer.role === 'admin'
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}>
                        {customer.role}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-muted">{new Date(customer.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
