import React, { useState, useRef } from 'react';
import { UserInput, AdType, Tone } from '../types';
import { Upload, X, Lightbulb, Target, Users, Wand2, Loader2 } from 'lucide-react';

interface Props {
  onSubmit: (input: UserInput) => void;
  isLoading: boolean;
}

const InputForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [idea, setIdea] = useState('');
  const [adType, setAdType] = useState<AdType>(AdType.SOCIAL_MEDIA);
  const [tone, setTone] = useState<Tone>(Tone.PROFESSIONAL);
  const [targetAudience, setTargetAudience] = useState('');
  const [file, setFile] = useState<{ name: string; data: string; mimeType: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix for Gemini API
        const base64Data = base64String.split(',')[1];
        setFile({
          name: selectedFile.name,
          data: base64Data,
          mimeType: selectedFile.type
        });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      idea,
      adType,
      tone,
      targetAudience,
      referenceImage: file?.data,
      referenceMimeType: file?.mimeType
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto glass-panel rounded-2xl p-6 md:p-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-700 pb-4">
        <div className="p-3 bg-blue-600 rounded-full bg-opacity-20 text-blue-400">
          <Wand2 size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">ابدأ رحلة الإبداع</h2>
          <p className="text-gray-400 text-sm">أدخل فكرتك ودع الوكيل الذكي يتولى الباقي</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Idea Input */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
            <Lightbulb size={16} className="text-yellow-500" />
            فكرة الإعلان
          </label>
          <textarea
            required
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            className="w-full h-32 bg-gray-900/50 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            placeholder="مثال: إعلان لقهوة مختصة جديدة تركز على النشاط والتركيز للطلاب..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ad Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">نوع الإعلان</label>
            <select
              value={adType}
              onChange={(e) => setAdType(e.target.value as AdType)}
              className="w-full bg-gray-900/50 border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {Object.values(AdType).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Tone */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">نبرة الإعلان</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as Tone)}
              className="w-full bg-gray-900/50 border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {Object.values(Tone).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Target Audience */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
            <Users size={16} className="text-green-500" />
            الجمهور المستهدف
          </label>
          <input
            type="text"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="مثال: طلاب الجامعات، الموظفين عن بعد..."
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">مرفقات (اختياري)</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-gray-800/30 transition-all group"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />
            {file ? (
              <div className="flex items-center justify-center gap-2 text-blue-400">
                <span className="font-medium">{file.name}</span>
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="p-1 hover:bg-gray-700 rounded-full text-red-400"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-gray-300">
                <Upload size={24} />
                <span>ارفع صورة مرجعية أو هوية بصرية (PNG, JPG)</span>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
            isLoading 
              ? 'bg-gray-700 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/20'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" />
              جاري التحليل...
            </span>
          ) : (
            'تحليل وتوليد السيناريو'
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;