import React, { useState } from 'react';
import { LeadFormState } from '../types';
import { Sparkles, ArrowRight } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: LeadFormState) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formState, setFormState] = useState<LeadFormState>({
    leadText: '',
    marketHint: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.leadText.trim()) return;
    onSubmit(formState);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
        handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8 flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          Input Lead
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Paste messy text from WhatsApp, Telegram, or Facebook.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-5">
        <div className="flex-1 flex flex-col">
          <label htmlFor="lead_text" className="block text-sm font-medium text-gray-700 mb-2">
            Paste real estate message here <span className="text-red-500">*</span>
          </label>
          <textarea
            id="lead_text"
            required
            className="w-full flex-1 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none text-base leading-relaxed bg-gray-50 min-h-[200px]"
            placeholder={`Example:
"Looking for 2bhk in Dubai Marina. Budget around 85k. Family only. Need parking. Move in next month."`}
            value={formState.leadText}
            onChange={(e) => setFormState(prev => ({ ...prev, leadText: e.target.value }))}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div>
          <label htmlFor="market_hint" className="block text-sm font-medium text-gray-700 mb-2">
            Main country / market (optional)
          </label>
          <input
            type="text"
            id="market_hint"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50"
            placeholder="e.g. UAE, India, New York"
            value={formState.marketHint}
            onChange={(e) => setFormState(prev => ({ ...prev, marketHint: e.target.value }))}
          />
          <p className="text-xs text-gray-400 mt-1">Helps infer currency and location context.</p>
        </div>

        <button
          type="submit"
          disabled={isLoading || !formState.leadText.trim()}
          className={`
            w-full py-4 px-6 rounded-lg text-white font-semibold text-lg flex items-center justify-center gap-2 transition-all shadow-md
            ${isLoading || !formState.leadText.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg active:scale-[0.98]'
            }
          `}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Cleaning...
            </>
          ) : (
            <>
              Process Lead <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;