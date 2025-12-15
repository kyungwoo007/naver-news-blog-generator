import React from 'react';
import { Button } from './Button';
import { ArrowRight, CheckCircle, Play, FileText } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#03C75A] rounded-md flex items-center justify-center text-white font-bold text-lg">N</div>
            <span className="font-bold text-xl tracking-tight text-gray-900">NewsBlogGen</span>
          </div>
          <Button variant="ghost" onClick={onStart} className="hidden sm:flex text-sm">Log In</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-[#03C75A] text-xs font-semibold tracking-wide uppercase mb-6">
          New Feature: Deep Dive Mode
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
          Turn Naver News into <br className="hidden sm:block" />
          <span className="text-[#03C75A]">Viral Blogs in Seconds</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 mb-8">
          Automate research, synthesis, and formatting. Perfect for thought leaders and marketers who need high-quality content without the grind.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={onStart} className="text-lg px-8">
            Start Generating Free
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button variant="outline" onClick={() => window.location.hash = '#case-study'} className="text-lg px-8">
            View Case Study
          </Button>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Real-time Search", desc: "Synthesizes live data from Naver News ecosystem." },
              { title: "Multimedia Embedding", desc: "Automatically finds and places relevant images/videos." },
              { title: "One-Click Publish", desc: "Direct integration with Naver Blog API (Draft/Publish)." }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <CheckCircle className="w-8 h-8 text-[#03C75A] mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Section (Prof Kang) */}
      <section id="case-study" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Success Story</h2>
          <p className="text-gray-500 mt-2">See how industry leaders use our tool.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 flex flex-col lg:flex-row">
          {/* Left: Context */}
          <div className="lg:w-1/3 bg-gray-900 p-8 sm:p-12 text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-white/20">
                   <img src="https://image.pollinations.ai/prompt/confident%20korean%20professor%20portrait?width=200&height=200&nologo=true&seed=10" alt="Prof Kang" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-xl">Prof. Kang Kyung-woo</h3>
                  <p className="text-gray-400 text-sm">Hanyang University</p>
                </div>
              </div>
              <blockquote className="text-xl italic font-light mb-6">
                "I need to share insights on transportation policy quickly. This tool turns my scattered thoughts and news clippings into professional columns in minutes."
              </blockquote>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold">1</div>
                <span>Analyzed 12 Naver News Articles</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold">2</div>
                <span>Extracted 3 Relevant Charts/Images</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold">3</div>
                <span>Published in 45 seconds</span>
              </div>
            </div>
          </div>

          {/* Right: The Output */}
          <div className="lg:w-2/3 bg-gray-50 p-8 sm:p-12 overflow-y-auto max-h-[800px]">
            <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-8 max-w-2xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-[#03C75A] text-white text-xs px-2 py-0.5 rounded">Blog</span>
                <span className="text-gray-500 text-xs">Generated 2 mins ago</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">The Future of Urban Mobility: Beyond the Smart City</h2>
              
              <div className="prose prose-sm sm:prose-base max-w-none text-gray-700">
                <p className="mb-4">
                  Recently, the discussion surrounding urban transportation policy has shifted significantly. According to recent reports from the Ministry of Land, Infrastructure and Transport...
                </p>
                
                <div className="my-6 rounded-lg overflow-hidden relative group cursor-pointer shadow-lg">
                  <img src="https://image.pollinations.ai/prompt/smart%20city%20seoul%20data%20visualization?width=800&height=450&nologo=true&seed=22" alt="Traffic Data" className="w-full object-cover" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="bg-white/90 p-2 rounded-full shadow-lg">
                      <Play className="w-5 h-5 text-gray-900 fill-current" />
                    </div>
                  </div>
                  <p className="text-xs text-center text-gray-500 mt-2 italic">Source: Naver News Video Clip Analysis</p>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">Key Policy Shifts in 2024</h3>
                <p className="mb-4">
                  As noted in yesterday's symposium, Hanyang University's research team highlighted three major pillars of change. The integration of AI in traffic signal control has reduced congestion by 14%...
                </p>
                
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mb-6">
                  <p className="text-blue-900 font-medium">"Innovation is not just about technology, but about accessibility." - Prof. Kang</p>
                </div>

                <p>In conclusion, the trajectory is clear. We must adapt our infrastructure to meet these evolving demands.</p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="font-bold text-sm text-gray-900 mb-2">Sources</h4>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li className="flex items-center gap-2"><FileText className="w-3 h-3" /> Electronic Times - AI Traffic Systems (2024.05.20)</li>
                  <li className="flex items-center gap-2"><FileText className="w-3 h-3" /> YTN Science - Future Cities Interview (2024.05.19)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; 2024 Naver News Blog Generator. All rights reserved.
        </div>
      </footer>
      
      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 sm:hidden z-50">
        <Button onClick={onStart} className="w-full shadow-xl">Start Generating Now</Button>
      </div>
    </div>
  );
};