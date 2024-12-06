'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

export const description = 'An interactive bar chart';
 
const chartConfig2 ={
  price:{
    label: 'Price',
  },
  orders:{
    label: 'Orders',
    color: 'hsl(var(--chart-1))'
  }
} satisfies ChartConfig;
type ChartData ={
  date: string;
  orders: number;
}

 

export function BarGraph() {
  const [chartData, setChartData] = React.useState<ChartData[]>([]);
  React.useEffect(() => {
    const fetchChartData = async () => {
       
       let data =   await fetch(`${process.env.NEXT_PUBLIC_API_URL}orders`);
       let orders = await data.json();

       const orderData = orders.responseObject.map((order: any) => ({
         date: order.createdAt,
         orders: order.totalPrice,
       }));
        setChartData(orderData);
    }
    fetchChartData();
  }, []);
  
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig2>('orders');

  const total =  {
      order: chartData.length + 1    
    };



  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Bar Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
        <div className="flex">
          {['orders'].map((key) => {
            const chart = key as keyof typeof chartConfig2;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig2[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total['order'].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig2}
          className="aspect-auto h-[280px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
