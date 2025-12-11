import React, { useState } from 'react';
import { LeadData } from '../types';
import { 
  Clipboard, 
  Check, 
  MapPin, 
  Home, 
  User, 
  DollarSign, 
  Calendar, 
  Car, 
  Sofa, 
  Users,
  Phone,
  FileText,
  Code
} from 'lucide-react';

interface ResultDisplayProps {
  data: LeadData;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'json'>('visual');

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to format currency
  const formatBudget = () => {
    if (data.budget_min === null && data.budget_max === null) return 'Not specified';
    const curr = data.budget_currency || '';
    if (data.budget_min !== null && data.budget_max !== null) {
        if (data.budget_min === data.budget_max) return `${data.budget_min.toLocaleString()} ${curr}`;
        return `${data.budget_min.toLocaleString()} - ${data.budget_max.toLocaleString()} ${curr}`;
    }
    if (data.budget_min !== null) return `Min ${data.budget_min.toLocaleString()} ${curr}`;
    if (data.budget_max !== null) return `Max ${data.budget_max.toLocaleString()} ${curr}`;
    return 'Not specified';
  };

  const getBadgeColor = (val: string | null) => {
    if (!val || val === 'unknown') return 'bg-gray-100 text-gray-500';
    switch (val) {
        case 'buy': return 'bg-green-100 text-green-700 border-green-200';
        case 'rent': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'sell': return 'bg-orange-100 text-orange-700 border-orange-200';
        case 'tenant': case 'buyer': return 'bg-purple-100 text-purple-700 border-purple-200';
        case 'owner': case 'agent': return 'bg-amber-100 text-amber-700 border-amber-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Cleaned Data</h2>
        <div className="flex gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
            <button 
                onClick={() => setActiveTab('visual')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'visual' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                Visual
            </button>
            <button 
                onClick={() => setActiveTab('json')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'json' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                JSON
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        
        {activeTab === 'visual' ? (
            <div className="space-y-6">
                {/* Summary Card */}
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-100">
                    <h3 className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-2">Short Summary</h3>
                    <p className="text-gray-800 font-medium leading-relaxed">
                        {data.short_summary || "No summary available."}
                    </p>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Intent & Role */}
                    <div className="p-4 border border-gray-100 rounded-lg bg-white shadow-sm">
                        <div className="text-xs text-gray-400 uppercase tracking-wider mb-3">Context</div>
                        <div className="flex gap-3 flex-wrap">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold border capitalize ${getBadgeColor(data.intent)}`}>
                                Intent: {data.intent}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold border capitalize ${getBadgeColor(data.role)}`}>
                                Role: {data.role}
                            </span>
                        </div>
                    </div>

                    {/* Property Info */}
                    <div className="p-4 border border-gray-100 rounded-lg bg-white shadow-sm">
                        <div className="text-xs text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                            <Home className="w-3 h-3" /> Property
                        </div>
                        <div className="space-y-2">
                             <div className="flex justify-between">
                                <span className="text-gray-600 text-sm">Type</span>
                                <span className="font-medium text-gray-800 capitalize">{data.property_type}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 text-sm">Specs</span>
                                <span className="font-medium text-gray-800">
                                    {data.bedrooms !== null ? `${data.bedrooms} Bed` : 'Bed?'} • {data.bathrooms !== null ? `${data.bathrooms} Bath` : 'Bath?'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="p-4 border border-gray-100 rounded-lg bg-white shadow-sm md:col-span-2">
                         <div className="text-xs text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> Location
                        </div>
                        <p className="text-gray-800 font-medium text-lg">
                            {data.location || <span className="text-gray-400 italic">Unknown Location</span>}
                        </p>
                    </div>

                    {/* Financials */}
                    <div className="p-4 border border-gray-100 rounded-lg bg-white shadow-sm">
                         <div className="text-xs text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                            <DollarSign className="w-3 h-3" /> Budget
                        </div>
                        <p className="text-indigo-600 font-bold text-lg">
                            {formatBudget()}
                        </p>
                    </div>

                    {/* Move In */}
                    <div className="p-4 border border-gray-100 rounded-lg bg-white shadow-sm">
                         <div className="text-xs text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Move In
                        </div>
                         <p className="text-gray-800 font-medium">
                            {data.move_in_date || 'ASAP / Unknown'}
                        </p>
                    </div>
                    
                    {/* Details Grid */}
                    <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-3">
                         <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-center">
                            <Sofa className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                            <div className="text-xs text-gray-500">Furnished</div>
                            <div className="text-sm font-medium text-gray-800 capitalize truncate">{data.furnished || '-'}</div>
                         </div>
                         <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-center">
                            <Car className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                            <div className="text-xs text-gray-500">Parking</div>
                            <div className="text-sm font-medium text-gray-800">
                                {data.parking_required === true ? 'Yes' : data.parking_required === false ? 'No' : '-'}
                            </div>
                         </div>
                         <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-center">
                            <Users className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                            <div className="text-xs text-gray-500">Occupants</div>
                            <div className="text-sm font-medium text-gray-800 capitalize truncate">{data.family_or_bachelor || '-'}</div>
                         </div>
                         <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-center">
                            <Phone className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                            <div className="text-xs text-gray-500">Contact</div>
                            <div className="text-sm font-medium text-gray-800 truncate">{data.contact || '-'}</div>
                         </div>
                    </div>

                    {/* Notes */}
                    {data.notes && (
                        <div className="md:col-span-2 p-4 border border-yellow-100 bg-yellow-50 rounded-lg">
                             <div className="text-xs text-yellow-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                                <FileText className="w-3 h-3" /> Notes
                            </div>
                            <p className="text-gray-700 text-sm italic">
                                "{data.notes}"
                            </p>
                        </div>
                    )}

                </div>
            </div>
        ) : (
            <div className="relative group h-full">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto h-full text-sm font-mono border border-gray-800 shadow-inner">
                    {JSON.stringify(data, null, 2)}
                </pre>
                 <button
                    onClick={handleCopyJson}
                    className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all border border-white/20"
                >
                    {copied ? <Check className="w-3 h-3" /> : <Clipboard className="w-3 h-3" />}
                    {copied ? 'Copied!' : 'Copy JSON'}
                </button>
            </div>
        )}

      </div>
    </div>
  );
};

export default ResultDisplay;