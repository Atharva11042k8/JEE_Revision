import React, { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { AnimationEngine } from '@/utils/animations';
import { SUBJECT_CONFIG } from '@/data/subjectConfig';
import { deLatex } from '@/utils/deLatex';
import Latex from '@/components/Latex';

// Define formula type (could move to global.d.ts)
interface Formula {
  question: string;
  answer: string;
}

const Index = () => {
  // UI state
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [currentFormula, setCurrentFormula] = useState<Formula | null>(null);
  const [showInterface, setShowInterface] = useState(false); // true after chapter selected
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formulaIndex, setFormulaIndex] = useState(0);
  const [shownIndices, setShownIndices] = useState<number[]>([]); // Track indices already shown

  // Animation refs (minimal)
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Animate entrance for subject/chapter selection
  useEffect(() => {
    if (!showInterface) {
      setTimeout(() => {
        if (titleRef.current) AnimationEngine.scaleIn(titleRef.current, 0);
        AnimationEngine.fadeInUp('.selection-card', 0.1);
      }, 100);
    }
  }, [showInterface]);

  // Show formula interface after chapter is picked
  const handleChapterChange = (chapterName: string) => {
    setSelectedChapter(chapterName);
    const subject = SUBJECT_CONFIG.find(s => s.name === selectedSubject);
    const chapter = subject?.chapters.find(c => c.name === chapterName);
    if (chapter) {
      loadChapterFormulas(chapter.file);
      setShowInterface(true);
    }
  };

  // Fetch formulas for chapter (from formulas/)
  const loadChapterFormulas = async (filePath: string) => {
    setLoading(true);
    try {
      let cleanPath = filePath.replace(/^\/+/, ""); // remove any leading slash just in case
      // FIX: fetch from /formulas instead of /data
      const response = await fetch(`/formulas/${cleanPath}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: Formula[] = await response.json();
      setFormulas(data);
      setCurrentFormula(data[0]);
      setFormulaIndex(0);
      setShowAnswer(false);
      setShownIndices([0]); // Reset tracking, show first question

      setTimeout(() => {
        if (cardRef.current) AnimationEngine.fadeInUp(cardRef.current, 0);
      }, 80);
      toast.success(`✅ Loaded ${data.length} formulas!`);
    } catch (error) {
      toast.error("❌ Could not load formulas.");
      setFormulas([
        { question: "Unable to fetch formula data.", answer: "Please check your file path." }
      ]);
      setCurrentFormula({ question: "Unable to fetch formula data.", answer: "Please check your file path." });
      setFormulaIndex(0);
      setShowAnswer(false);
      setShownIndices([]);
    } finally { setLoading(false); }
  };

  // Get next random formula, showing each once
  const getNextFormula = () => {
    if (formulas.length === 0) return;

    // All questions have been shown
    if (shownIndices.length === formulas.length) {
      toast.success("🎉 All questions for this chapter have been shown!");
      // Optionally, reset to allow re-review, uncomment below if desired
      // setShownIndices([]);
      // setFormulaIndex(0);
      // setCurrentFormula(formulas[0]);
      // setShowAnswer(false);
      return;
    }

    let nextIndex: number | undefined;
    const availableIndices = formulas
      .map((_, idx) => idx)
      .filter(idx => !shownIndices.includes(idx));
    if (availableIndices.length === 0) {
      // Defensive, shouldn't happen
      toast.success("🎉 All questions for this chapter have been shown!");
      return;
    }
    // Pick one at random
    nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    setFormulaIndex(nextIndex);
    setCurrentFormula(formulas[nextIndex]);
    setShowAnswer(false);
    setShownIndices(prev => [...prev, nextIndex]);
  };

  // Reveal answer btn
  const revealAnswer = () => {
    setShowAnswer(true);
    toast.success("Answer revealed!");
  };

  // Fix KaTeX: Render on changes (NO LONGER NEEDED - we show as plain text)
  // useEffect(() => {}, [currentFormula, showAnswer, showInterface]); // removed

  // Reset state if subject changed
  const handleSubjectChange = (subjectName: string) => {
    setSelectedSubject(subjectName);
    setSelectedChapter('');
    setCurrentFormula(null);
    setFormulas([]);
    setShowAnswer(false);
    setShowInterface(false);
    setShownIndices([]);
  };

  // Subject config
  const selectedSubjectData = SUBJECT_CONFIG.find(s => s.name === selectedSubject);

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Neon BG circles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 
            ref={titleRef}
            className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 bg-clip-text text-transparent mb-4 font-mono"
          >
            ATHARVA the ENCODER
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-4">
            JEE revision app: by @atharvahadke11
          </p>
        </div>

        {/* SUBJECT/CHAPTER SELECTION UI */}
        {!showInterface && (
          <div className="max-w-4xl mx-auto mb-8">
            <Card className="selection-card p-4 md:p-6 bg-gray-800/50 backdrop-blur-xl border-gray-700/50 shadow-2xl">
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                {/* SUBJECTS */}
                <div className="space-y-3">
                  <label className="text-base md:text-lg font-semibold text-blue-400 flex items-center">
                    <i className="fas fa-book mr-2"></i>
                    Select Subject
                  </label>
                  <Select value={selectedSubject} onValueChange={handleSubjectChange}>
                    <SelectTrigger className="w-full bg-gray-700/50 border-gray-600 text-white text-base md:text-lg p-3 md:p-4">
                      <SelectValue placeholder="Choose a subject..." />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {SUBJECT_CONFIG.map((subject) => (
                        <SelectItem 
                          key={subject.name} 
                          value={subject.name}
                          className="text-white hover:bg-gray-700 cursor-pointer"
                        >
                          <span className="flex items-center">
                            <span className="mr-2 text-xl">{subject.icon}</span>
                            {subject.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* CHAPTERS */}
                <div className="space-y-3">
                  <label className="text-base md:text-lg font-semibold text-purple-400 flex items-center">
                    <i className="fas fa-list mr-2"></i>
                    Select Chapter
                  </label>
                  <Select 
                    value={selectedChapter} 
                    onValueChange={handleChapterChange}
                    disabled={!selectedSubject}
                  >
                    <SelectTrigger className="w-full bg-gray-700/50 border-gray-600 text-white text-base md:text-lg p-3 md:p-4">
                      <SelectValue placeholder="Choose a chapter..." />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {selectedSubjectData?.chapters.map((chapter) => (
                        <SelectItem 
                          key={chapter.name} 
                          value={chapter.name}
                          className="text-white hover:bg-gray-700 cursor-pointer"
                        >
                          {chapter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* FORMULA CARD INTERFACE */}
        {showInterface && currentFormula && (
          <div className="max-w-4xl mx-auto">
            <Card 
              ref={cardRef}
              className="p-6 md:p-8 bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-xl border-gray-700/50 shadow-2xl"
            >
              {/* Question */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50 w-fit">
                    <i className="fas fa-question-circle mr-1"></i>
                    Question
                  </Badge>
                  <span className="text-gray-400 text-sm md:text-base">
                    
                  </span>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4 md:p-6 border border-gray-700/50">
                  <div className="text-lg md:text-xl lg:text-2xl text-gray-100 leading-relaxed">
                    {/* Show as proper typeset math with horizontal bar */}
                    <Latex latex={currentFormula.question} block />
                  </div>
                </div>
              </div>
              {/* Answer */}
              {showAnswer && (
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                      <i className="fas fa-check-circle mr-1"></i>
                      Answer
                    </Badge>
                  </div>
                  <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg p-4 md:p-6 border border-green-500/30">
                    <div className="text-lg md:text-2xl lg:text-3xl text-green-100 leading-relaxed font-mono">
                      <Latex latex={currentFormula.answer} block />
                    </div>
                  </div>
                </div>
              )}
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!showAnswer ? (
                  <Button
                    onClick={revealAnswer}
                    size="lg"
                    className="reveal-btn bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 md:py-4 px-6 md:px-8 text-base md:text-lg"
                  >
                    <i className="fas fa-eye mr-2"></i>
                    Reveal Answer
                  </Button>
                ) : (
                  <Button
                    onClick={getNextFormula}
                    size="lg"
                    className="next-btn bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-3 md:py-4 px-6 md:px-8 text-base md:text-lg"
                  >
                    <i className="fas fa-arrow-right mr-2"></i>
                    Next Formula
                  </Button>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
            <p className="text-gray-400 text-lg">Loading formulas...</p>
          </div>
        )}

        {/* Empty state */}
        {!showInterface && !currentFormula && !loading && (
          <div className="text-center py-16">
            <div className="text-4xl md:text-6xl mb-6">🎯</div>
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-300 mb-4">
              AIR 11
            </h3>
            <p className="text-gray-400 text-base md:text-lg max-w-md mx-auto px-4">
              Select a subject and chapter to start revision
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
