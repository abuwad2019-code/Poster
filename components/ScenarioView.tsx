import React from 'react';
import { Scenario } from '../types';
import { PlayCircle, Film, Volume2, ArrowLeft, Loader2 } from 'lucide-react';

interface Props {
  scenario: Scenario;
  onGeneratePrompts: () => void;
  isGeneratingPrompts: boolean;
}

const ScenarioView: React.FC<Props> = ({ scenario, onGeneratePrompts, isGeneratingPrompts }) => {
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in space-y-6">
      
      {/* Header Info */}
      <div className="glass-panel p-6 rounded-2xl border-r-4 border-blue-500">
        <h2 className="text-3xl font-bold text-white mb-2">{scenario.title}</h2>
        <p className="text-gray-400 leading-relaxed">{scenario.summary}</p>
        <div className="mt-4 p-4 bg-blue-900/20 rounded-xl border border-blue-500/30">
          <span className="text-blue-400 font-bold ml-2">الخاطفة (Hook):</span>
          <span className="text-gray-200">{scenario.hook}</span>
        </div>
      </div>

      {/* Scenes Timeline */}
      <div className="space-y-4">
        {scenario.scenes.map((scene, idx) => (
          <div key={idx} className="glass-panel p-5 rounded-xl flex flex-col md:flex-row gap-6 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
            <div className="absolute top-0 right-0 bg-gray-800 px-3 py-1 rounded-bl-xl text-sm font-bold text-gray-400">
              مشهد {scene.sceneNumber}
            </div>
            
            {/* Time */}
            <div className="hidden md:flex flex-col items-center justify-center w-24 border-l border-gray-700 pl-4 text-center">
              <div className="text-xl font-bold text-blue-400">{scene.duration}</div>
              <div className="text-xs text-gray-500">المدة</div>
            </div>

            {/* Content */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2 text-purple-400 font-medium">
                  <Film size={18} />
                  <span>الصورة (Visual)</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed bg-gray-900/40 p-3 rounded-lg border border-gray-700/50">
                  {scene.visual}
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2 text-green-400 font-medium">
                  <Volume2 size={18} />
                  <span>الصوت (Audio)</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed bg-gray-900/40 p-3 rounded-lg border border-gray-700/50">
                  {scene.audio}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="glass-panel p-6 rounded-2xl text-center border-t-4 border-green-500">
        <h3 className="text-xl font-bold text-green-400 mb-2">الدعوة لاتخاذ إجراء (CTA)</h3>
        <p className="text-2xl text-white font-medium">{scenario.cta}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end pt-4">
        <button
          onClick={onGeneratePrompts}
          disabled={isGeneratingPrompts}
          className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 text-white transition-all ${
             isGeneratingPrompts 
             ? 'bg-gray-700 cursor-not-allowed' 
             : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/20'
          }`}
        >
          {isGeneratingPrompts ? (
            <>
              <Loader2 className="animate-spin" />
              جاري هندسة البرومبت...
            </>
          ) : (
            <>
              <span>توليد أوامر الرسم والفيديو</span>
              <ArrowLeft size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ScenarioView;