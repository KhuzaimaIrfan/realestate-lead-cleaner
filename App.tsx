import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import { parseLead } from './services/geminiService';
import { LeadData, LeadFormState } from './types';
import { Building2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [result, setResult] = useState<LeadData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcessLead = async (formData: LeadFormState) => {
    setLoading(true);
    setError(null);
    try {
      const data = await parseLead(formData.leadText, formData.marketHint);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to process the lead. Please try again or check your API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
                <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none">RealEstate Lead Cleaner</h1>
              <p className="text-xs text-gray-500 font-medium">AI-Powered Parser</p>
            </div>
          </div>
          <div className="hidden sm:block text-sm text-gray-500">
            Powered by Gemini 2.5
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700 animate-fadeIn">
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                    <h3 className="font-semibold text-sm">Processing Error</h3>
                    <p className="text-sm opacity-90">{error}</p>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* Left Column: Input */}
          <div className="h-full">
            <InputForm onSubmit={handleProcessLead} isLoading={loading} />
          </div>

          {/* Right Column: Output */}
          <div className="h-full min-h-[500px]">
            {result ? (
              <ResultDisplay data={result} />
            ) : (
              <div className="h-full bg-white rounded-xl border border-gray-200 border-dashed flex flex-col items-center justify-center p-12 text-center text-gray-400 shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Code className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Yet</h3>
                <p className="max-w-xs mx-auto">
                    Paste a real estate lead on the left and hit process to see the structured data here.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} RealEstate Lead Cleaner. Built for speed and accuracy.
        </div>
      </footer>
    </div>
  );
};

// Simple Icon for empty state
function Code(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    )
  }

export default App;