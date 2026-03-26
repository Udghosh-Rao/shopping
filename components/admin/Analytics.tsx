'use client';

import { useState, useEffect } from 'react';
import { Loader2, TrendingUp, TrendingDown, Package, Users, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface DailyRevenue {
  date: string;
  revenue: number;
  orders: number;
}

interface TopProduct {
  _id: string;
  name: string;
  unitsSold: number;
  revenue: number;
}

interface StockAlert {
  productId: string;
  name: string;
  stock: number;
  lowStockSizes: { size: string; stock: number }[];
}

interface ConversionMetrics {
  visitors: number;
  carts: number;
  checkouts: number;
  orders: number;
  conversionRate: string;
}

interface AnalyticsData {
  dailyRevenue: DailyRevenue[];
  topProducts: TopProduct[];
  stockAlerts: StockAlert[];
  conversionMetrics: ConversionMetrics;
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/analytics');
      if (res.ok) {
        const analyticsData = await res.json();
        setData(analyticsData);
      } else {
        toast.error('Failed to load analytics');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load analytics data</p>
      </div>
    );
  }

  const totalRevenue = data.dailyRevenue.reduce((sum, day) => sum + day.revenue, 0);
  const avgOrderValue = data.conversionMetrics.orders > 0 ? (totalRevenue / data.conversionMetrics.orders).toFixed(2) : '0.00';
  const revenueGrowth = data.dailyRevenue.length > 1
    ? ((data.dailyRevenue[data.dailyRevenue.length - 1].revenue - data.dailyRevenue[0].revenue) / data.dailyRevenue[0].revenue) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Revenue Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Revenue (Last 30 Days)</h2>
          <div className="flex items-center gap-2">
            {revenueGrowth > 0 ? (
              <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                +{revenueGrowth.toFixed(1)}%
              </span>
            ) : revenueGrowth < 0 ? (
              <span className="flex items-center gap-1 text-red-600 text-sm font-medium">
                <TrendingDown className="w-4 h-4" />
                {revenueGrowth.toFixed(1)}%
              </span>
            ) : null}
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-3xl font-bold">₹{totalRevenue.toLocaleString()}</div>

          {/* Simple bar chart */}
          <div className="flex items-end gap-1 h-40 bg-gray-50 p-4 rounded-lg overflow-x-auto">
            {data.dailyRevenue.map((day, idx) => {
              const maxRevenue = Math.max(...data.dailyRevenue.map((d) => d.revenue));
              const heightPercent = (day.revenue / maxRevenue) * 100;

              return (
                <div
                  key={idx}
                  className="flex-1 min-w-8 bg-blue-500 rounded-t hover:bg-blue-600 cursor-pointer transition-all group relative"
                  style={{ height: `${heightPercent}%` }}
                  title={`${day.date}: ₹${day.revenue}`}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity">
                    ₹{day.revenue}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-blue-600">{data.conversionMetrics.orders}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-green-600">₹{avgOrderValue}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-gray-600">Conv. Rate</p>
              <p className="text-2xl font-bold text-purple-600">{data.conversionMetrics.conversionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Top Selling Products</h2>

          {data.topProducts.length === 0 ? (
            <p className="text-gray-600 text-sm">No sales data available</p>
          ) : (
            <div className="space-y-3">
              {data.topProducts.map((product, idx) => (
                <div key={product._id} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-medium truncate max-w-xs">{product.name}</p>
                      <p className="text-xs text-gray-600">{product.unitsSold} units sold</p>
                    </div>
                  </div>
                  <p className="font-semibold">₹{product.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Conversion Funnel</h2>

          <div className="space-y-3">
            {[
              { label: 'Visitors', value: data.conversionMetrics.visitors, icon: Users },
              { label: 'Added to Cart', value: data.conversionMetrics.carts, icon: Package },
              { label: 'Checkouts', value: data.conversionMetrics.checkouts, icon: Package },
              { label: 'Orders', value: data.conversionMetrics.orders, icon: TrendingUp },
            ].map((item, idx) => {
              const Icon = item.icon;
              const percent = idx === 0 ? 100 : (item.value / data.conversionMetrics.visitors) * 100;
              const previousValue = idx === 0 ? data.conversionMetrics.visitors : (idx === 1 ? data.conversionMetrics.carts : idx === 2 ? data.conversionMetrics.checkouts : data.conversionMetrics.orders);
              const dropoff = idx === 0 ? 0 : ((previousValue - item.value) / previousValue) * 100;

              return (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{item.value}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.max(2, percent)}%` }}
                    />
                  </div>
                  {idx > 0 && (
                    <p className="text-xs text-red-600">
                      {dropoff > 0 ? `↓ ${dropoff.toFixed(1)}% drop-off` : '→ No drop-off'}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {data.stockAlerts.length > 0 && (
        <div className="bg-white rounded-lg border border-yellow-200 bg-yellow-50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <h2 className="text-lg font-semibold text-yellow-900">Low Stock Alerts</h2>
            <span className="ml-auto bg-yellow-200 text-yellow-900 px-2.5 py-0.5 rounded-full text-xs font-semibold">
              {data.stockAlerts.length} products
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.stockAlerts.map((alert) => (
              <div key={alert.productId} className="bg-white border border-yellow-300 rounded-lg p-3">
                <p className="font-medium text-sm mb-2">{alert.name}</p>
                {alert.lowStockSizes.length > 0 ? (
                  <div className="text-xs text-gray-600 space-y-1">
                    {alert.lowStockSizes.map((size) => (
                      <div key={size.size} className="flex items-center justify-between">
                        <span>Size {size.size}:</span>
                        <span className="font-semibold text-red-600">{size.stock} units</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-red-600 font-semibold">Overall stock: {alert.stock} units</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
