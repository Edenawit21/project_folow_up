import Card from "@/components/ProjectsDetails/Card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'; 
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
      count: priorityCounts[orderKey] || 0 
    }))
    .filter(item => item.count > 0); 

  // Define colors for consistency, mapping to priority levels
  const COLORS: { [key: string]: string } = {
    'Highest': '#EF4444', 
    'High': '#F97316',    
    'Medium': '#F59E0B',   
    'Low': '#22C55E',     
    'Lowest': '#3B82F6',    
    'None': '#6B7280',    
    'N/A': '#9CA3AF'      
  };

  const getBarColor = (priorityName: string) => COLORS[priorityName] || '#E5E7EB';

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

export default PriorityBreakdownChart; 