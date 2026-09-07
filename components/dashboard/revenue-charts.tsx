'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface DailyRevenuePoint {
  date: string;
  label: string;
  revenue: number;
  ordersCount: number;
}

interface MonthlyRevenuePoint {
  month: string;
  revenue: number;
  ordersCount: number;
}

interface ProductRevenueBreakdown {
  productId: string;
  productName: string;
  batchCode: string;
  honeyType: string;
  unitsSold: number;
  totalRevenue: number;
  price: number;
}

export function RevenueCharts({
  dailyRevenue,
  monthlyRevenue,
  productBreakdown,
}: {
  dailyRevenue: DailyRevenuePoint[];
  monthlyRevenue: MonthlyRevenuePoint[];
  productBreakdown: ProductRevenueBreakdown[];
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 14-Day Daily Revenue Trend */}
        <Card className="border-border/70 bg-card/75 shadow-[var(--shadow-soft)] backdrop-blur">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Daily Revenue (Last 14 Days)</CardTitle>
            <CardDescription>Daily accumulated earnings from paid consumer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyRevenue}>
                  <defs>
                    <linearGradient id="colorDailyRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="label"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `GH₵${value}`}
                  />
                  <Tooltip
                    formatter={(value: any) => [`GH₵${Number(value).toLocaleString()}`, 'Earnings']}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorDailyRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 6-Month Monthly Earnings Trend */}
        <Card className="border-border/70 bg-card/75 shadow-[var(--shadow-soft)] backdrop-blur">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Monthly Revenue Trend</CardTitle>
            <CardDescription>Historical monthly earnings across the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `GH₵${value}`}
                  />
                  <Tooltip
                    formatter={(value: any) => [`GH₵${Number(value).toLocaleString()}`, 'Revenue']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                    }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="hsl(var(--primary))"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Product Revenue Breakdown */}
      {productBreakdown.length > 0 && (
        <Card className="border-border/70 bg-card/75 shadow-[var(--shadow-soft)] backdrop-blur">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Revenue by Product & Harvest Batch</CardTitle>
            <CardDescription>Comparison of revenue contributions per honey listing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={productBreakdown.slice(0, 6).map((p) => ({
                    name: p.productName.length > 18 ? `${p.productName.slice(0, 18)}...` : p.productName,
                    revenue: p.totalRevenue,
                    units: p.unitsSold,
                  }))}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                  <XAxis
                    type="number"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `GH₵${value}`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={130}
                  />
                  <Tooltip
                    formatter={(value: any) => [`GH₵${Number(value).toLocaleString()}`, 'Total Revenue']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                    }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="hsl(var(--primary))"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
