import React from 'react';
import { Users, Building2, UserCircle } from 'lucide-react';

const StatCards = ({ statistics }) => {
    const stats = [
        {
            title: 'Total Clients',
            value: statistics?.total || 0,
            icon: Users,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            title: 'Companies',
            value: statistics?.totalCompanies || 0,
            icon: Building2,
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600'
        },
        {
            title: 'Individuals',
            value: statistics?.totalIndividuals || 0,
            icon: UserCircle,
            color: 'bg-green-500',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600 mb-1">
                                    {stat.title}
                                </p>
                                <p className="text-3xl font-bold text-slate-900">
                                    {stat.value}
                                </p>
                            </div>
                            <div className={`${stat.bgColor} p-3 rounded-lg`}>
                                <Icon className={`w-6 h-6 ${stat.textColor}`} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StatCards;
