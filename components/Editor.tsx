import React, { useState, useEffect, useRef } from 'react';
import { BlogPost, ChatMessage } from '../types';
import { Button } from './Button';
import { refineBlogContent, translateBlogContent } from '../services/geminiService';
import { Send, ArrowLeft, Save, Sparkles, Layout, Monitor, Download, Globe, FileText, File as FileIcon } from 'lucide-react';

// Add html2pdf to window type
declare global {
  interface Window {
    html2pdf: any;
  }
}

interface EditorProps {
  initialData: BlogPost;
  onBack: () => void;
}

export const Editor: React.FC<EditorProps> = ({ initialData, onBack }) => {
  const [content, setContent] = useState(initialData.content);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "I've drafted the post based on your keywords. What would you like to improve?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [showAiSidebar, setShowAiSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Resize handler for responsiveness
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setShowAiSidebar(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg = inputValue;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputValue('');
    setIsProcessing(true);

    try {
      // AI Logic: Send content + instruction to Gemini
      const newContent = await refineBlogContent(content, userMsg);
      setContent(newContent);
      setMessages(prev => [...prev, { role: 'model', text: "I've updated the draft based on your feedback." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error updating the draft." }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTranslate = async (lang: string) => {
    setShowLangMenu(false);
    setIsTranslating(true);
    setMessages(prev => [...prev, { role: 'model', text: `Translating content to ${lang}...` }]);
    try {
      const translated = await translateBlogContent(content, lang);
      setContent(translated);
      setMessages(prev => [...prev, { role: 'model', text: `Translation to ${lang} complete.` }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Translation failed." }]);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleDownloadPDF = () => {
    setShowExportMenu(false);
    const element = previewRef.current || document.createElement('div');
    if (!previewRef.current) {
        element.innerHTML = content;
    }

    const opt = {
      margin: 10,
      filename: `${initialData.title.substring(0, 20)}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    if (window.html2pdf) {
        window.html2pdf().set(opt).from(element).save();
        setMessages(prev => [...prev, { role: 'model', text: "PDF download started." }]);
    } else {
        alert("PDF generator not loaded yet. Please try again in a moment.");
    }
  };

  const handleDownloadDoc = () => {
    setShowExportMenu(false);
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + content + footer;

    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `${initialData.title.substring(0, 20)}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
    setMessages(prev => [...prev, { role: 'model', text: "Word document download started." }]);
  };

  const toggleSidebar = () => setShowAiSidebar(!showAiSidebar);

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gray-500 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-gray-900 truncate max-w-[150px] sm:max-w-md">{initialData.title}</h1>
            <div className="flex items-center gap-2 text-xs text-gray-500">
               <span className="bg-green-100 text-green-700 px-1.5 rounded">Draft</span>
               <span>Saved locally</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           {/* Language Menu */}
           <div className="relative">
              <Button variant="ghost" className="p-2" onClick={() => setShowLangMenu(!showLangMenu)} disabled={isTranslating}>
                <Globe className="w-5 h-5 text-gray-600" />
              </Button>
              {showLangMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                    {['English', 'Korean', 'Japanese', 'Chinese (Simplified)', 'Spanish'].map(lang => (
                        <button 
                            key={lang}
                            onClick={() => handleTranslate(lang)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            Translate to {lang}
                        </button>
                    ))}
                </div>
              )}
           </div>

           {/* Export Menu */}
           <div className="relative">
              <Button variant="ghost" className="p-2" onClick={() => setShowExportMenu(!showExportMenu)}>
                <Download className="w-5 h-5 text-gray-600" />
              </Button>
              {showExportMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                    <button onClick={handleDownloadPDF} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <FileIcon className="w-4 h-4" /> Download PDF
                    </button>
                    <button onClick={handleDownloadDoc} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <FileText className="w-4 h-4" /> Download Word
                    </button>
                </div>
              )}
           </div>

           {/* View Toggles for Mobile */}
           <div className="sm:hidden flex bg-gray-100 rounded-lg p-1 mr-2">
              <button 
                onClick={() => setActiveTab('edit')} 
                className={`p-1.5 rounded ${activeTab === 'edit' ? 'bg-white shadow text-green-600' : 'text-gray-500'}`}
              >
                <Layout className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setActiveTab('preview')}
                className={`p-1.5 rounded ${activeTab === 'preview' ? 'bg-white shadow text-green-600' : 'text-gray-500'}`}
              >
                <Monitor className="w-4 h-4" />
              </button>
           </div>
           
           <Button variant="ghost" className="hidden sm:flex" onClick={() => alert("Simulated: Saved to Naver Drafts")}>
             Save Draft
           </Button>
           <Button 
             variant="primary" 
             onClick={() => alert("Simulated: Published to Naver Blog!")}
             className="text-sm px-3 sm:px-4"
           >
             <span className="hidden sm:inline">Publish to Naver</span>
             <span className="sm:hidden">Publish</span>
           </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Editor Area */}
        <div className={`flex-1 flex flex-col h-full transition-all duration-300 ${showAiSidebar && !isMobile ? 'mr-80' : ''}`}>
          
          {/* Editor/Preview Switcher Logic */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
            <div className="max-w-3xl mx-auto bg-white shadow-sm border border-gray-200 rounded-xl min-h-[800px] p-8 sm:p-12 relative" id="print-content">
               
               {activeTab === 'edit' ? (
                 <div 
                    className="prose prose-lg max-w-none focus:outline-none"
                    contentEditable
                    suppressContentEditableWarning
                    dangerouslySetInnerHTML={{ __html: content }}
                    onBlur={(e) => setContent(e.currentTarget.innerHTML)}
                 />
               ) : (
                 <div className="prose prose-lg max-w-none" ref={previewRef}>
                    {/* Simulated Naver Blog Preview Wrapper */}
                    <div className="border-b border-gray-200 pb-4 mb-4">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{initialData.title}</h1>
                      <p className="text-sm text-gray-500">Category: Technology | By User</p>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                    <div className="mt-8 pt-6 border-t border-gray-100 bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-bold text-sm text-gray-900 mb-2">Sources (Auto-generated)</h4>
                      <ul className="text-sm text-gray-600 list-disc pl-5">
                        {initialData.sources.map((s, i) => (
                          <li key={i}><a href={s.url} className="text-blue-600 hover:underline">{s.title}</a></li>
                        ))}
                      </ul>
                      <div className="mt-4 flex gap-2">
                        {initialData.tags.map((t, i) => (
                           <span key={i} className="text-xs text-gray-500">#{t}</span>
                        ))}
                      </div>
                    </div>
                 </div>
               )}

            </div>
          </div>
        </div>

        {/* AI Sidebar */}
        <div 
          className={`absolute inset-y-0 right-0 w-full sm:w-80 bg-white border-l border-gray-200 shadow-xl transform transition-transform duration-300 z-30 flex flex-col ${showAiSidebar ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {/* Sidebar Header */}
          <div className="h-14 flex items-center justify-between px-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2 text-gray-800 font-semibold">
              <Sparkles className="w-4 h-4 text-[#03C75A]" />
              AI Assistant
            </div>
            <button onClick={toggleSidebar} className="text-gray-400 hover:text-gray-600">
               <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === 'user' 
                    ? 'bg-[#03C75A] text-white rounded-br-none' 
                    : 'bg-white border border-gray-200 text-gray-700 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isProcessing || isTranslating ? (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex gap-1">
                   <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                   <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                   <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            ) : null}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask to shorten, change tone, or fix grammar..."
                className="w-full pl-4 pr-10 py-3 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-[#03C75A]/20 resize-none text-sm"
                rows={2}
                onKeyDown={(e) => {
                  if(e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isProcessing}
                className="absolute right-2 bottom-2 p-1.5 text-white bg-[#03C75A] rounded-lg hover:bg-[#02b351] disabled:opacity-50 disabled:bg-gray-300 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar">
              {['Make it shorter', 'More professional', 'Fix grammar'].map(opt => (
                <button 
                  key={opt}
                  onClick={() => { setInputValue(opt); }}
                  className="whitespace-nowrap px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-600 transition-colors"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button for AI Sidebar on Mobile */}
      {!showAiSidebar && (
        <button 
          onClick={toggleSidebar}
          className="fixed bottom-6 right-6 w-12 h-12 bg-[#03C75A] text-white rounded-full shadow-lg flex items-center justify-center z-40 hover:scale-105 transition-transform"
        >
          <Sparkles className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};