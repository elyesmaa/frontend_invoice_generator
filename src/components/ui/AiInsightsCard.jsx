
const AiInsightsCard = ({ title, icon: Icon, message, isLoading }) => {
   
    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm shadow-gray-100">
            <div className="flex items-center mb-3">
                {Icon && <Icon className="h-6 w-6 text-yellow-500 mr-3" />}
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            </div>

            {isLoading ? (
                <div className="space-y-3 animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 rounded w-5/6" />
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
            ) : (
                <ul className='space-y-3 list-disc list-inside text-slate-600 ml-3'>
                    {message.map((insight, index) => {
                        return (
                            <li key={index} className='text-sm'>{insight}</li>
                        )
                    })}
                </ul>
            )}
        </div>
    );
};

export default AiInsightsCard;
