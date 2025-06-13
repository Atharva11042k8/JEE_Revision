
import React, { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { AnimationEngine } from '@/utils/animations';

// Define the structure for our formula data
interface Formula {
  question: string;
  answer: string;
}

interface Chapter {
  name: string;
  file: string;
}

interface Subject {
  name: string;
  icon: string;
  chapters: Chapter[];
}

const Index = () => {
  // App state
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [currentFormula, setCurrentFormula] = useState<Formula | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formulaIndex, setFormulaIndex] = useState(0);

  // Refs for animations
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);

  // Subject and chapter configuration with updated data folder structure
  const subjects: Subject[] = [
    {
      name: 'Physics',
      icon: '⚛️',
      chapters: [
        { name: 'Kinematics', file: 'physics/kinematics.json' },
        { name: 'Vectors', file: 'physics/vectors.json' },
        { name: 'Laws of Motion', file: 'physics/laws_of_motion.json' },
        { name: 'Work Energy Power', file: 'physics/work_energy_power.json' },
        { name: 'Rotational Motion', file: 'physics/rotational_motion.json' },
        { name: 'Thermodynamics', file: 'physics/thermodynamics.json' },
        { name: 'Waves', file: 'physics/waves.json' },
        { name: 'Electrostatics', file: 'physics/electrostatics.json' },
        { name: 'Current Electricity', file: 'physics/current_electricity.json' },
        { name: 'Magnetic Effects', file: 'physics/magnetic_effects.json' },
        { name: 'Electromagnetic Induction', file: 'physics/electromagnetic_induction.json' },
        { name: 'Optics', file: 'physics/optics.json' },
        { name: 'Modern Physics', file: 'physics/modern_physics.json' }
      ]
    },
    {
      name: 'Chemistry',
      icon: '🧪',
      chapters: [
        { name: 'Atomic Structure', file: 'chemistry/atomic_structure.json' },
        { name: 'Chemical Bonding', file: 'chemistry/chemical_bonding.json' },
        { name: 'Periodic Table', file: 'chemistry/periodic_table.json' },
        { name: 'Chemical Equilibrium', file: 'chemistry/chemical_equilibrium.json' },
        { name: 'Acids and Bases', file: 'chemistry/acids_bases.json' },
        { name: 'Redox Reactions', file: 'chemistry/redox_reactions.json' },
        { name: 'Thermodynamics', file: 'chemistry/thermodynamics.json' },
        { name: 'Chemical Kinetics', file: 'chemistry/chemical_kinetics.json' },
        { name: 'Organic Chemistry', file: 'chemistry/organic_chemistry.json' },
        { name: 'Coordination Compounds', file: 'chemistry/coordination_compounds.json' }
      ]
    },
    {
      name: 'Mathematics',
      icon: '📐',
      chapters: [
        { name: 'Algebra', file: 'mathematics/algebra.json' },
        { name: 'Trigonometry', file: 'mathematics/trigonometry.json' },
        { name: 'Coordinate Geometry', file: 'mathematics/coordinate_geometry.json' },
        { name: 'Calculus', file: 'mathematics/calculus.json' },
        { name: 'Vectors', file: 'mathematics/vectors.json' },
        { name: 'Probability', file: 'mathematics/probability.json' },
        { name: 'Statistics', file: 'mathematics/statistics.json' },
        { name: 'Matrices', file: 'mathematics/matrices.json' },
        { name: 'Complex Numbers', file: 'mathematics/complex_numbers.json' },
        { name: 'Differential Equations', file: 'mathematics/differential_equations.json' }
      ]
    }
  ];

  // Initialize animations on component mount
  useEffect(() => {
    // Initial page load animations
    setTimeout(() => {
      if (titleRef.current) {
        AnimationEngine.scaleIn(titleRef.current, 0);
      }
      AnimationEngine.fadeInUp('.selection-card', 0.3);
      AnimationEngine.fadeInUp('.feature-badge', 0.6);
      AnimationEngine.floatingParticles();
    }, 100);

    // Add glow effect to main elements
    setTimeout(() => {
      AnimationEngine.pulseGlow('.main-card');
    }, 1000);
  }, []);

  // Function to load chapter formulas from JSON files with updated path
  const loadChapterFormulas = async (filePath: string) => {
    setLoading(true);
    
    // Add loading animation
    AnimationEngine.fadeInUp('.loading-spinner', 0);
    
    try {
      const response = await fetch(`/data/${filePath}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Formula[] = await response.json();
      
      setFormulas(data);
      setCurrentFormula(data[0]);
      setFormulaIndex(0);
      setShowAnswer(false);
      
      // Animate the formula card entrance
      setTimeout(() => {
        if (cardRef.current) {
          AnimationEngine.scaleIn(cardRef.current, 0);
        }
        if (questionRef.current) {
          AnimationEngine.slideInFromLeft(questionRef.current, 0.2);
        }
      }, 100);
      
      toast.success(`✅ Loaded ${data.length} formulas successfully!`, {
        description: `Ready to practice ${selectedChapter} formulas`
      });
    } catch (error) {
      console.error('Error loading formulas:', error);
      toast.error("❌ Failed to load formulas", {
        description: "Please check if the JSON file exists and try again."
      });
      
      // Fallback to sample data for demonstration
      const sampleData: Formula[] = [
        {
          question: "Sample formula question for " + selectedChapter,
          answer: "Sample formula answer: \\frac{a + b}{c}"
        },
        {
          question: "Another sample question",
          answer: "E = mc^2"
        }
      ];
      
      setFormulas(sampleData);
      setCurrentFormula(sampleData[0]);
      setFormulaIndex(0);
      setShowAnswer(false);
    } finally {
      setLoading(false);
    }
  };

  // Function to get next random formula with enhanced animations
  const getNextFormula = () => {
    if (formulas.length === 0) return;
    
    // Animate out current question
    if (questionRef.current) {
      AnimationEngine.slideInFromRight(questionRef.current, 0);
    }
    
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * formulas.length);
    } while (nextIndex === formulaIndex && formulas.length > 1);
    
    setTimeout(() => {
      setFormulaIndex(nextIndex);
      setCurrentFormula(formulas[nextIndex]);
      setShowAnswer(false);
      
      // Animate in new question
      if (questionRef.current) {
        AnimationEngine.slideInFromLeft(questionRef.current, 0.1);
      }
    }, 300);
  };

  // Function to reveal answer with animation
  const revealAnswer = () => {
    setShowAnswer(true);
    
    // Animate answer reveal
    setTimeout(() => {
      if (answerRef.current) {
        AnimationEngine.cardFlip(answerRef.current);
        AnimationEngine.liquidFill(answerRef.current);
      }
    }, 100);
    
    toast.success("🎯 Answer revealed!", {
      description: "Study the formula and click Next when ready"
    });
  };

  // Effect to render math when formulas change
  useEffect(() => {
    if (window.renderMathInElement && currentFormula) {
      setTimeout(() => {
        try {
          window.renderMathInElement(document.body, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '\\[', right: '\\]', display: true },
              { left: '$', right: '$', display: false },
              { left: '\\(', right: '\\)', display: false }
            ],
            throwOnError: false
          });
        } catch (error) {
          console.warn('KaTeX rendering error:', error);
        }
      }, 100);
    }
  }, [currentFormula, showAnswer]);

  // Handle subject change with animations
  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    setSelectedChapter('');
    setCurrentFormula(null);
    setFormulas([]);
    setShowAnswer(false);
    
    // Animate selection feedback
    AnimationEngine.fadeInUp('.chapter-select', 0.2);
    
    toast.info(`📚 Selected ${value}`, {
      description: "Now choose a chapter to start practicing"
    });
  };

  // Handle chapter change
  const handleChapterChange = (value: string) => {
    setSelectedChapter(value);
    const subject = subjects.find(s => s.name === selectedSubject);
    const chapter = subject?.chapters.find(c => c.name === value);
    if (chapter) {
      loadChapterFormulas(chapter.file);
    }
  };

  const selectedSubjectData = subjects.find(s => s.name === selectedSubject);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden relative">
      {/* Enhanced animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-green-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="floating-particle absolute w-2 h-2 bg-blue-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <h1 
            ref={titleRef}
            className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 bg-clip-text text-transparent mb-4 font-mono"
          >
            JEE Formula Master
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-4">
            Ultimate Revision Tool for Physics, Chemistry & Mathematics
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="feature-badge text-sm md:text-base px-3 md:px-4 py-2 border-purple-500/50 text-purple-300">
              <i className="fas fa-brain mr-2"></i>
              Smart Recall System
            </Badge>
            <Badge variant="outline" className="feature-badge text-sm md:text-base px-3 md:px-4 py-2 border-blue-500/50 text-blue-300">
              <i className="fas fa-random mr-2"></i>
              Random Practice
            </Badge>
            <Badge variant="outline" className="feature-badge text-sm md:text-base px-3 md:px-4 py-2 border-green-500/50 text-green-300">
              <i className="fas fa-mobile-alt mr-2"></i>
              Mobile Friendly
            </Badge>
          </div>
        </div>

        {/* Subject and Chapter Selection */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="selection-card p-4 md:p-6 bg-gray-800/50 backdrop-blur-xl border-gray-700/50 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {/* Subject Selection */}
              <div className="space-y-3">
                <label className="text-base md:text-lg font-semibold text-blue-400 flex items-center">
                  <i className="fas fa-book mr-2"></i>
                  Select Subject
                </label>
                <Select value={selectedSubject} onValueChange={handleSubjectChange}>
                  <SelectTrigger className="w-full bg-gray-700/50 border-gray-600 text-white text-base md:text-lg p-3 md:p-4 hover:bg-gray-600/50 transition-all duration-300">
                    <SelectValue placeholder="Choose a subject..." />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {subjects.map((subject) => (
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

              {/* Chapter Selection */}
              <div className="space-y-3 chapter-select">
                <label className="text-base md:text-lg font-semibold text-purple-400 flex items-center">
                  <i className="fas fa-list mr-2"></i>
                  Select Chapter
                </label>
                <Select 
                  value={selectedChapter} 
                  onValueChange={handleChapterChange}
                  disabled={!selectedSubject}
                >
                  <SelectTrigger className="w-full bg-gray-700/50 border-gray-600 text-white text-base md:text-lg p-3 md:p-4 hover:bg-gray-600/50 transition-all duration-300">
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

        {/* Formula Display Area */}
        {currentFormula && (
          <div className="max-w-4xl mx-auto">
            <Card 
              ref={cardRef}
              className="main-card p-6 md:p-8 bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-xl border-gray-700/50 shadow-2xl transform hover:scale-[1.01] transition-all duration-300"
            >
              {/* Question */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50 w-fit">
                    <i className="fas fa-question-circle mr-1"></i>
                    Question
                  </Badge>
                  <span className="text-gray-400 text-sm md:text-base">
                    Formula {formulaIndex + 1} of {formulas.length}
                  </span>
                </div>
                <div 
                  ref={questionRef}
                  className="bg-gray-900/50 rounded-lg p-4 md:p-6 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300"
                >
                  <p className="text-lg md:text-xl lg:text-2xl text-gray-100 leading-relaxed">
                    {currentFormula.question}
                  </p>
                </div>
              </div>

              {/* Answer */}
              <div className={`mb-8 transition-all duration-500 ${showAnswer ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
                {showAnswer && (
                  <>
                    <div className="flex items-center mb-4">
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                        <i className="fas fa-check-circle mr-1"></i>
                        Answer
                      </Badge>
                    </div>
                    <div 
                      ref={answerRef}
                      className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg p-4 md:p-6 border border-green-500/30 hover:border-green-400/50 transition-all duration-300"
                    >
                      <p className="text-lg md:text-2xl lg:text-3xl text-green-100 leading-relaxed font-mono break-words">
                        ${currentFormula.answer}$
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!showAnswer ? (
                  <Button
                    onClick={() => {
                      AnimationEngine.buttonPress('.reveal-btn');
                      revealAnswer();
                    }}
                    size="lg"
                    className="reveal-btn bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 md:py-4 px-6 md:px-8 text-base md:text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <i className="fas fa-eye mr-2"></i>
                    Reveal Answer
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      AnimationEngine.buttonPress('.next-btn');
                      getNextFormula();
                    }}
                    size="lg"
                    className="next-btn bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-3 md:py-4 px-6 md:px-8 text-base md:text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
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
          <div className="text-center py-12 loading-spinner">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
            <p className="text-gray-400 text-lg">Loading formulas...</p>
          </div>
        )}

        {/* Empty State */}
        {!currentFormula && !loading && (
          <div className="text-center py-16">
            <div className="text-4xl md:text-6xl mb-6">🎯</div>
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-300 mb-4">
              Ready to Master JEE Formulas?
            </h3>
            <p className="text-gray-400 text-base md:text-lg max-w-md mx-auto px-4">
              Select a subject and chapter to start your formula revision journey!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
