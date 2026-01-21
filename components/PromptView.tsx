import React, { useState } from 'react';
import { ImagePrompt, VideoPrompt } from '../types';
import { Copy, Check, Image as ImageIcon, Video, MonitorPlay } from 'lucide-react';

interface Props {
  imagePrompts: ImagePrompt[];
  videoPrompts: VideoPrompt[];
}

const PromptView: React.FC<Props> = ({ imagePrompts, videoPrompts }) => {
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
      
      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('images')}
          className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-2 text-lg font-bold transition-all ${
            activeTab === 'images' 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <ImageIcon size={20} />
          قسم الصور والستوري بورد
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-2 text-lg font-bold transition-all ${
            activeTab === 'videos' 
            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' 
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <Video size={20} />
          قسم إنتاج الفيديو
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6">
        {activeTab === 'images' ? (
          imagePrompts.map((prompt, idx) => (
            <PromptCard 
              key={idx} 
              type="image"
              title={prompt.title}
              description={prompt.description}
              promptAr={prompt.promptAr}
              promptEn={prompt.promptEn}
              meta={[
                { label: 'نسبة الأبعاد', value: prompt.aspectRatio },
                { label: 'الموديل المقترح', value: prompt.modelSuggestion }
              ]}
            />
          ))
        ) : (
          videoPrompts.map((prompt, idx) => (
            <PromptCard 
              key={idx} 
              type="video"
              title={`نمط: ${prompt.style}`}
              description={`حركة الكاميرا: ${prompt.cameraMovement}`}
              promptAr={prompt.promptAr}
              promptEn={prompt.promptEn}
              meta={[
                { label: 'المدة', value: prompt.duration },
                { label: 'الموديل المقترح', value: prompt.modelSuggestion }
              ]}
            />
          ))
        )}
      </div>
    </div>
  );
};

interface PromptCardProps {
  type: 'image' | 'video';
  title: string;
  description: string;
  promptAr: string;
  promptEn: string;
  meta: { label: string; value: string }[];
}

const PromptCard: React.FC<PromptCardProps> = ({ type, title, description, promptAr, promptEn, meta }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, lang: string) => {
    navigator.clipboard.writeText(text);
    setCopied(lang);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden border border-gray-700 hover:border-gray-500 transition-all">
      <div className={`h-2 w-full ${type === 'image' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`} />
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
            <p className="text-gray-400 text-sm">{description}</p>
          </div>
          <div className="flex gap-2">
            {meta.map((m, i) => (
              <span key={i} className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300 border border-gray-700">
                {m.label}: {m.value}
              </span>
            ))}
          </div>
        </div>

        {/* English Prompt */}
        <div className="bg-gray-900/60 rounded-xl p-4 mb-4 border border-gray-700 relative group">
          <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => handleCopy(promptEn, 'en')}
              className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 text-white flex items-center gap-1 text-xs"
            >
              {copied === 'en' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              Copy English
            </button>
          </div>
          <div className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wider text-left" dir="ltr">English Prompt</div>
          <p className="text-gray-300 text-sm font-mono leading-relaxed text-left" dir="ltr">{promptEn}</p>
        </div>

        {/* Arabic Prompt */}
        <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-700 relative group">
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => handleCopy(promptAr, 'ar')}
              className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 text-white flex items-center gap-1 text-xs"
            >
              {copied === 'ar' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              نسخ
            </button>
          </div>
          <div className="text-xs text-gray-500 font-bold mb-1">البرومبت العربي</div>
          <p className="text-gray-300 text-sm leading-relaxed">{promptAr}</p>
        </div>
      </div>
    </div>
  );
};

export default PromptView;