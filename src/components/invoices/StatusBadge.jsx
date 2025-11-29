import React from 'react';

const StatusBadge = ({ status }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status === 'Paid'
            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
        {status}
    </span>
);

export default StatusBadge;
