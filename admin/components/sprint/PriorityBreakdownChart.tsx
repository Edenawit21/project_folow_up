import Card from "@/components/ProjectsDetails/Card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'; // Import Cell
import {Sigma} from  "lucide-react";

interface PriorityBreakdownChartProps {
  priorityCounts: {
    [key: string]: number;
  };
}

const PriorityBreakdownChart: React.FC<PriorityBreakdownChartProps> = ({ priorityCounts }) => {
  const priorityOrder = ['Highest', 'High', 'Medium', 'Low', 'Lowest', 'None', 'N/A'];

  // Convert dictionary to array of objects, ordered by priorityOrder
  const data = priorityOrder
    .map(orderKey => ({
      name: orderKey,
      count: priorityCounts[orderKey] || 0 // Use 0 if priority not found
    }))
    .filter(item => item.count > 0); // Only show priorities that actually have tasks

  // Define colors for consistency, mapping to priority levels
  const COLORS: { [key: string]: string } = {
    'Highest': '#EF4444', // Red
    'High': '#F97316',    // Orange
    'Medium': '#F59E0B',   // Amber
    'Low': '#22C55E',     // Green
    'Lowest': '#3B82F6',    // Blue
    'None': '#6B7280',    // Gray
    'N/A': '#9CA3AF'      // Lighter Gray for "Not Available"
  };

  const getBarColor = (priorityName: string) => COLORS[priorityName] || '#E5E7EB'; // Default gray if color not defined

  return (
    <Card title="Task Priority Breakdown" icon={Sigma}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          layout="vertical" // Often clearer for categories like priority
        >
          <XAxis type="number" dataKey="count" label={{ value: "Number of Tasks", position: "insideBottomRight", offset: 0, fill: '#6B7280' }} stroke="#D1D5DB" />
          <YAxis type="category" dataKey="name" width={80} stroke="#D1D5DB" tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', color: '#F9FAFB' }} itemStyle={{ color: '#F9FAFB' }} />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Bar dataKey="count" name="Tasks">
            {
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.name)} />
              ))
            }
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default PriorityBreakdownChart; // Assuming this is the only export or you'll use named export