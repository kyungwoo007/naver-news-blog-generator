import React, { useState } from 'react';
import { GeneratorConfig, Tone, Length, BlogPost } from '../types';
import { generateBlogDraft } from '../services/geminiService';
import { Button } from './Button';
import { Search, Calendar, Type, FileText, ChevronLeft, AlertCircle } from 'lucide-react';

interface GeneratorWizardProps {
  onSuccess: (data: BlogPost) => void;
  onBack: () => void;
}

export const GeneratorWizard: React.FC<GeneratorWizardProps> = ({ onSuccess, onBack }) => {
  const [config, setConfig] = useState<GeneratorConfig>({
    keywords: '',
    dateRange: 'Past 24 Hours',
    tone: Tone.ACADEMIC,
    length: Length.STANDARD,
  });

  const [step, setStep] = useState<'input' | 'processing'>('input');
  const [progress, setProgress] = useState(0); // Simulated progress
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!config.keywords) {
        setError("Please enter at least one keyword.");
        return;
    }
    
    setStep('processing');
    setError(null);

    // Simulated Steps for UX
    const steps = [
      { p: 10, msg: "Connecting to Naver News API..." },
      { p: 30, msg: `Searching for "${config.keywords}"...` },
      { p: 50, msg: "Extracting multimedia content..." },
      { p: 70, msg: "Synthesizing AI draft..." },
    ];

    let currentStepIndex = 0;
    
    const progressInterval = setInterval(() => {
      if (currentStepIndex < steps.length) {
        setProgress(steps[currentStepIndex].p);
        currentStepIndex++;
      }
    }, 800);

    try {
      const blogPost = await generateBlogDraft(config);
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => onSuccess(blogPost), 500);
    } catch (err) {
      clearInterval(progressInterval);
      setStep('input');
      setError("Failed to generate content. Please try again or check your API key.");
    }
  };

  if (step === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="relative pt-10">
            <div className="w-24 h-24 mx-auto bg-green-50 rounded-full flex items-center justify-center animate-pulse">
               <div className="w-16 h-16 bg-[#03C75A] rounded-full flex items-center justify-center">
                 <Search className="w-8 h-8 text-white animate-spin-slow" />
               </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Generating Blog Post...</h3>
            <p className="text-gray-500">Synthesizing Naver News data for <span className="font-semibold text-gray-800">"{config.keywords}"</span></p>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-[#03C75A] h-2.5 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-xs text-gray-400">
             <div className={progress > 20 ? "text-[#03C75A] font-medium" : ""}>Search</div>
             <div className={progress > 50 ? "text-[#03C75A] font-medium" : ""}>Extract</div>
             <div className={progress > 80 ? "text-[#03C75A] font-medium" : ""}>Synthesize</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-900 flex items-center gap-1 mb-4 text-sm font-medium">
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </button>
        <h2 className="text-3xl font-bold text-gray-900">Configure Generator</h2>
        <p className="text-gray-500 mt-2">Define the scope for your new blog post.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 space-y-8">
        
        {/* Keywords */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Search className="w-4 h-4 text-[#03C75A]" />
            Search Keywords
          </label>
          <input 
            type="text" 
            value={config.keywords}
            onChange={(e) => setConfig({ ...config, keywords: e.target.value })}
            placeholder="e.g., AI Technology, Seoul Transportation Policy"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#03C75A] focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Date Range */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Calendar className="w-4 h-4 text-[#03C75A]" />
            Search Period
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {['Past 24 Hours', 'Past Week', 'Past Month'].map((period) => (
              <button
                key={period}
                onClick={() => setConfig({ ...config, dateRange: period })}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                  config.dateRange === period 
                  ? 'bg-green-50 border-[#03C75A] text-[#03C75A]' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Style & Length */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <Type className="w-4 h-4 text-[#03C75A]" />
              Tone & Style
            </label>
            <select
              value={config.tone}
              onChange={(e) => setConfig({ ...config, tone: e.target.value as Tone })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#03C75A] focus:border-transparent outline-none"
            >
              {Object.values(Tone).map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <FileText className="w-4 h-4 text-[#03C75A]" />
              Target Length
            </label>
            <select
              value={config.length}
              onChange={(e) => setConfig({ ...config, length: e.target.value as Length })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#03C75A] focus:border-transparent outline-none"
            >
              {Object.values(Length).map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
            </div>
        )}

        <div className="pt-4">
          <Button onClick={handleSubmit} className="w-full text-lg shadow-green-500/20">
            Generate Blog Post
          </Button>
          <p className="text-center text-xs text-gray-400 mt-4">
            Estimated time: ~45 seconds
          </p>
        </div>
      </div>
    </div>
  );
};
