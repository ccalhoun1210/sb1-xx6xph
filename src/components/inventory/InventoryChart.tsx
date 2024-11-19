import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface InventoryChartProps {
  items: Array<{
    name: string;
    quantity: number;
    minStock: number;
    maxStock: number;
  }>;
}

export function InventoryChart({ items }: InventoryChartProps) {
  const chartData = items.map(item => ({
    name: item.name,
    current: item.quantity,
    minimum: item.minStock,
    maximum: item.maxStock,
  })).slice(0, 10)

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          height={100}
          interval={0}
          tick={{ fontSize: 12 }}
          tickLine={{ stroke: '#888' }}
          axisLine={{ stroke: '#888' }}
          scale="band"
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          tickLine={{ stroke: '#888' }}
          axisLine={{ stroke: '#888' }}
          width={80}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '8px'
          }}
        />
        <Legend />
        <Bar dataKey="current" fill="#3b82f6" name="Current Stock" />
        <Bar dataKey="minimum" fill="#ef4444" name="Minimum Stock" />
        <Bar dataKey="maximum" fill="#22c55e" name="Maximum Stock" />
      </BarChart>
    </ResponsiveContainer>
  )
}