interface CardProps<T> {
 title  :string,
 value: number,
 percentage : number,
 color: string
}

const MetricCard = <T extends object> ({ title, value, percentage, color = 'gray' } : CardProps<T>) => {
    // Dynamic color classes for Tailwind
    const borderColorClass = `border-${color}-500`;
    const progressBarColorClass = `bg-${color}-600`;

    return (
        <div className={`bg-white rounded-lg shadow p-5 border-l-4 ${borderColorClass}`}>
            <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
            <p className="text-3xl font-bold text-gray-900">
                {value}
                {percentage !== undefined && percentage !== null && (
                    <span className="ml-2 text-base text-gray-500">({percentage.toFixed(0)}%)</span>
                )}
            </p>
            {percentage !== undefined && percentage !== null && (
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                        className={`${progressBarColorClass} h-2 rounded-full`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            )}
        </div>
    );
};

export default MetricCard;