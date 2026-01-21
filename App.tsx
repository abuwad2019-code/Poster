import React, { useState } from 'react';
import { GeneratedOutput, UserInput } from './types';
import { generateScenario, generateVisualPrompts } from './services/gemini';
import InputForm from './components/InputForm';
import ScenarioView from './components/ScenarioView';
import PromptView from './components/PromptView';
import { LayoutDashboard, FileText, Clapperboard, RefreshCw } from 'lucide-react';

enum Step {
  INPUT = 1,
  SCENARIO = 2,
  PROMPTS = 3
}

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>(Step.INPUT);
  const [data, setData] = useState<GeneratedOutput>({
    scenario: null,
    imagePrompts: [],
    videoPrompts: []
  });
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScenarioGeneration = async (input: UserInput) => {
    setIsLoading(true);
    setError(null);
    setUserInput(input);
    try {
      const scenario = await generateScenario(input);
      setData(prev => ({ ...prev, scenario }));
      setCurrentStep(Step.SCENARIO);
    } catch (err) {
      setError("حدث خطأ أثناء توليد السيناريو. يرجى المحاولة مرة أخرى.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptGeneration = async () => {
    if (!data.scenario || !userInput) return;
    setIsLoading(true);
    setError(null);
    try {
      const { imagePrompts, videoPrompts } = await generateVisualPrompts(data.scenario, userInput);
      setData(prev => ({ ...prev, imagePrompts, videoPrompts }));
      setCurrentStep(Step.PROMPTS);
    } catch (err) {
      setError("حدث خطأ أثناء توليد البرومبت. يرجى المحاولة مرة أخرى.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(Step.INPUT);
    setData({ scenario: null, imagePrompts: [], videoPrompts: [] });
    setUserInput(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black pb-20">
      
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2.5 rounded-lg shadow-lg shadow-blue-500/20">
                <Clapperboard className="text-white h-6 w-6" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                وكيل التصميم الإعلاني
              </span>
            </div>
            {currentStep > Step.INPUT && (
              <button 
                onClick={handleReset}
                className="text-sm text-gray-400 hover:text-white flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <RefreshCw size={14} />
                بدء جديد
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Progress Steps */}
      <div className="max-w-3xl mx-auto my-8 px-4">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -z-10 rounded-full"></div>
          <div className={`absolute top-1/2 left-0 h-1 bg-blue-600 -z-10 rounded-full transition-all duration-500`} 
               style={{ width: `${((currentStep - 1) / 2) * 100}%` }}></div>

          <StepIndicator step={Step.INPUT} current={currentStep} icon={LayoutDashboard} label="الفكرة" />
          <StepIndicator step={Step.SCENARIO} current={currentStep} icon={FileText} label="السيناريو" />
          <StepIndicator step={Step.PROMPTS} current={currentStep} icon={Clapperboard} label="البرومبت" />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="max-w-3xl mx-auto mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-200 text-center">
            {error}
          </div>
        )}

        <div className="transition-all duration-500 ease-in-out">
          {currentStep === Step.INPUT && (
            <InputForm onSubmit={handleScenarioGeneration} isLoading={isLoading} />
          )}

          {currentStep === Step.SCENARIO && data.scenario && (
            <ScenarioView 
              scenario={data.scenario} 
              onGeneratePrompts={handlePromptGeneration}
              isGeneratingPrompts={isLoading}
            />
          )}

          {currentStep === Step.PROMPTS && (
            <PromptView 
              imagePrompts={data.imagePrompts} 
              videoPrompts={data.videoPrompts} 
            />
          )}
        </div>
      </main>
    </div>
  );
}

const StepIndicator = ({ step, current, icon: Icon, label }: { step: number, current: number, icon: any, label: string }) => {
  const isActive = current >= step;
  const isCurrent = current === step;

  return (
    <div className="flex flex-col items-center gap-2 bg-[#0f172a] px-2 z-10">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
        isActive 
        ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' 
        : 'bg-gray-900 border-gray-700 text-gray-500'
      }`}>
        <Icon size={20} />
      </div>
      <span className={`text-sm font-medium transition-colors ${isActive ? 'text-blue-400' : 'text-gray-600'}`}>
        {label}
      </span>
    </div>
  );
};