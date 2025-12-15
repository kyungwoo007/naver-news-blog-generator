import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { GeneratorWizard } from './components/GeneratorWizard';
import { Editor } from './components/Editor';
import { BlogPost } from './types';

function App() {
  // Simple State-based routing for this SPA
  const [view, setView] = useState<'landing' | 'generator' | 'editor'>('landing');
  const [generatedBlog, setGeneratedBlog] = useState<BlogPost | null>(null);

  const startGenerator = () => {
    setView('generator');
    window.scrollTo(0,0);
  };

  const handleGenerationSuccess = (data: BlogPost) => {
    setGeneratedBlog(data);
    setView('editor');
  };

  const handleBackToLanding = () => {
    setView('landing');
  };

  const handleBackToGenerator = () => {
    // If asking to go back from Editor, maybe confirm with user
    if(window.confirm("Going back will discard your current edits. Continue?")){
      setView('generator');
    }
  };

  return (
    <div className="min-h-screen font-sans">
      {view === 'landing' && (
        <LandingPage onStart={startGenerator} />
      )}

      {view === 'generator' && (
        <div className="min-h-screen bg-gray-50 flex flex-col">
           <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 sm:px-8">
             <div className="font-bold text-xl tracking-tight text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 bg-[#03C75A] rounded-md flex items-center justify-center text-white font-bold text-lg">N</div>
                NewsBlogGen
             </div>
           </header>
           <main className="flex-1">
             <GeneratorWizard 
                onSuccess={handleGenerationSuccess} 
                onBack={handleBackToLanding} 
             />
           </main>
        </div>
      )}

      {view === 'editor' && generatedBlog && (
        <Editor 
          initialData={generatedBlog} 
          onBack={handleBackToGenerator} 
        />
      )}
    </div>
  );
}

export default App;
