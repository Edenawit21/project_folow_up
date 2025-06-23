

interface CardProps<T> {
 title  :string;
counts: { [key: string]: number };
}

const BreakdownCard = <T extends object> ({ title, counts }: CardProps<T>)  => (
    <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
        {counts && Object.keys(counts).length > 0 ? (
            <ul className="space-y-2">
                {Object.entries(counts).map(([category, count]) => (
                    <li key={category} className="flex justify-between items-center text-gray-700">
                        <span className="font-medium">{category}:</span>
                        <span className="text-lg font-bold">{count}</span>
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-gray-600 text-sm">No data for this breakdown.</p>
        )}
    </div>
);

export default BreakdownCard;