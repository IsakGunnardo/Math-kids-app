import React, { useState, useEffect } from 'react';
import { Star, Settings, RefreshCcw, Trophy, Keyboard, MousePointer2, Home, Hand, Play, ArrowRight, Lock, Unlock, Circle, Globe } from 'lucide-react';

/**
 * HandSVG Component
 * Renders a stylized hand with a specific number of fingers raised.
 */
const HandSVG = ({ fingers, skinTone = "#fcd3b1" }) => {
  const getVisibleFingers = (count) => {
    switch (count) {
      case 0: return [];
      case 1: return ['index'];
      case 2: return ['index', 'middle'];
      case 3: return ['index', 'middle', 'ring'];
      case 4: return ['index', 'middle', 'ring', 'pinky'];
      case 5: return ['thumb', 'index', 'middle', 'ring', 'pinky'];
      default: return [];
    }
  };

  const visibleIds = getVisibleFingers(fingers);

  return (
    <svg viewBox="0 0 120 120" className="w-16 h-16 md:w-24 md:h-24 drop-shadow-md transition-transform hover:scale-110">
      <path d="M 20 60 Q 20 110 60 110 Q 100 110 100 60 L 100 50 Q 60 50 20 50 Z" fill={skinTone} stroke="#e0a67b" strokeWidth="2" />
      <g opacity="0.4">
         <circle cx="30" cy="55" r="8" fill={skinTone} />
         <circle cx="50" cy="50" r="8" fill={skinTone} />
         <circle cx="70" cy="52" r="8" fill={skinTone} />
         <circle cx="90" cy="60" r="8" fill={skinTone} />
      </g>
      {visibleIds.includes('pinky') && <rect x="88" y="25" width="14" height="40" rx="7" fill={skinTone} stroke="#e0a67b" transform="rotate(20 95 65)" />}
      {visibleIds.includes('ring') && <rect x="68" y="10" width="15" height="50" rx="7.5" fill={skinTone} stroke="#e0a67b" transform="rotate(8 75 60)" />}
      {visibleIds.includes('middle') && <rect x="43" y="5" width="16" height="55" rx="8" fill={skinTone} stroke="#e0a67b" />}
      {visibleIds.includes('index') && <rect x="20" y="15" width="15" height="50" rx="7.5" fill={skinTone} stroke="#e0a67b" transform="rotate(-10 27 60)" />}
      {visibleIds.includes('thumb') && <ellipse cx="95" cy="70" rx="20" ry="10" fill={skinTone} stroke="#e0a67b" transform="rotate(-30 95 70)" />}
    </svg>
  );
};

const HandGroup = ({ number }) => {
  const hands = [];
  let remaining = number;
  if (remaining === 0) hands.push(0);
  while (remaining > 0) {
    if (remaining >= 5) { hands.push(5); remaining -= 5; }
    else { hands.push(remaining); remaining = 0; }
  }
  return (
    <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
      {hands.map((count, idx) => <HandSVG key={idx} fingers={count} />)}
    </div>
  );
};

/**
 * DotGroup Component
 * Renders simple dots for counting (used in answer buttons)
 */
const DotGroup = ({ number }) => {
  return (
    <div className="flex flex-wrap justify-center gap-1.5 mt-2 max-w-[120px]">
      {[...Array(number)].map((_, i) => (
        <div 
          key={i} 
          className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-indigo-300 shadow-sm"
        />
      ))}
    </div>
  );
};

/**
 * Firework Component
 * Renders a single explosion of particles
 */
const Firework = ({ left, top, color, delay }) => {
  const particles = [...Array(16)].map((_, i) => {
    const angle = (i / 16) * 360;
    const dist = 60 + Math.random() * 60;
    const tx = Math.cos(angle * Math.PI / 180) * dist;
    const ty = Math.sin(angle * Math.PI / 180) * dist;
    return { id: i, tx, ty };
  });

  return (
    <div 
      className="absolute pointer-events-none" 
      style={{ left: `${left}%`, top: `${top}%` }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-2 h-2 rounded-full opacity-0"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}`,
            animation: `firework-bang 1.5s ease-out infinite`,
            animationDelay: `${delay}s`,
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
          }}
        />
      ))}
    </div>
  );
};

const FireworksDisplay = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <Firework left={20} top={30} color="#FFD700" delay={0} />
      <Firework left={80} top={25} color="#FF6347" delay={0.5} />
      <Firework left={50} top={40} color="#4169E1" delay={1.0} />
      <Firework left={30} top={60} color="#32CD32" delay={0.2} />
      <Firework left={70} top={70} color="#FF00FF" delay={0.7} />
      <Firework left={15} top={55} color="#00FFFF" delay={1.2} />
      <Firework left={85} top={65} color="#FFA500" delay={1.5} />
    </div>
  );
};

const translations = {
  en: {
    title: "Math Kids",
    subtitle: "Ready to climb the levels?",
    choosePath: "Choose your Path",
    numbers: "Numbers",
    levels: "Levels",
    customization: "Customization",
    buttons: "Buttons",
    write: "Write",
    fingersOn: "Fingers: ON",
    fingersOff: "Fingers: OFF",
    dotsOn: "Dots: ON",
    dotsOff: "Dots: OFF",
    level: "Level",
    correct: "Correct!",
    tryAgain: "Try Again",
    check: "Check",
    pathComplete: "Path Complete!",
    mastered: "You mastered the 0-RANGE levels!",
    continue: "Continue to 0 -",
    backMenu: "Back to Menu",
    keepGoing: "Keep going!",
    score: "Score"
  },
  sv: {
    title: "Matte-Kul",
    subtitle: "Redo att klättra i nivåerna?",
    choosePath: "Välj din väg",
    numbers: "Tal",
    levels: "Nivåer",
    customization: "Anpassning",
    buttons: "Knappar",
    write: "Skriv",
    fingersOn: "Fingrar: PÅ",
    fingersOff: "Fingrar: AV",
    dotsOn: "Prickar: PÅ",
    dotsOff: "Prickar: AV",
    level: "Nivå",
    correct: "Rätt!",
    tryAgain: "Försök igen",
    check: "Rätta",
    pathComplete: "Banan Avklarad!",
    mastered: "Du klarade 0-RANGE nivåerna!",
    continue: "Fortsätt till 0 -",
    backMenu: "Tillbaks till menyn",
    keepGoing: "Fortsätt så!",
    score: "Poäng"
  }
};

export default function MathApp() {
  const [gameState, setGameState] = useState('menu');
  const [language, setLanguage] = useState('sv');
  const [range, setRange] = useState(10);
  const [inputMode, setInputMode] = useState('buttons'); 
  const [showFingers, setShowFingers] = useState(true);
  const [showDots, setShowDots] = useState(true);
  const [level, setLevel] = useState(1);
  const [levelProgress, setLevelProgress] = useState(0);
  const QUESTIONS_PER_LEVEL = 2;
  const MAX_LEVELS = 10;
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null); 
  const [confetti, setConfetti] = useState(false);
  const [levelUpAnim, setLevelUpAnim] = useState(false);

  const t = translations[language];

  const generateQuestion = (targetLevel = level) => {
    let maxSumForLevel;
    if (targetLevel <= 3) {
      maxSumForLevel = Math.max(5, Math.floor(range * 0.5));
    } else if (targetLevel <= 7) {
      maxSumForLevel = Math.max(5, Math.floor(range * 0.8));
    } else {
      maxSumForLevel = range;
    }
    if (range <= 5) maxSumForLevel = range;

    let n1, n2;
    do {
      const minVal = targetLevel > 5 ? 1 : 0; 
      n1 = Math.floor(Math.random() * (maxSumForLevel - minVal + 1)) + minVal;
      n2 = Math.floor(Math.random() * (maxSumForLevel - n1 + 1));
    } while (n1 + n2 > maxSumForLevel);

    setNum1(n1);
    setNum2(n2);
    setFeedback(null);
    setUserAnswer('');
    setConfetti(false);
    setLevelUpAnim(false);

    const correct = n1 + n2;
    const opts = new Set([correct]);
    while (opts.size < 3) {
      let randomOpt = Math.floor(Math.random() * (maxSumForLevel + 2)); 
      if (randomOpt !== correct && randomOpt >= 0) opts.add(randomOpt);
    }
    setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
  };

  const startPath = (selectedRange) => {
    setRange(selectedRange);
    setLevel(1);
    setLevelProgress(0);
    setScore(0);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState === 'playing') {
      generateQuestion();
    }
  }, [gameState]); 

  const handleLevelUp = () => {
    if (level >= MAX_LEVELS) {
      setGameState('pathComplete');
      setConfetti(false);
    } else {
      setLevel(l => l + 1);
      setLevelProgress(0);
      setLevelUpAnim(true);
      setTimeout(() => generateQuestion(level + 1), 2000); 
    }
  };

  const handleAnswer = (val) => {
    const correct = num1 + num2;
    const valInt = parseInt(val, 10);

    if (valInt === correct) {
      setFeedback('correct');
      setScore(s => s + 10);
      setConfetti(true);
      const newProgress = levelProgress + 1;
      setLevelProgress(newProgress);
      if (newProgress >= QUESTIONS_PER_LEVEL) {
        setTimeout(handleLevelUp, 1000);
      } else {
        setTimeout(generateQuestion, 1500);
      }
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const nextPath = () => {
    let nextRange = 10;
    if (range === 5) nextRange = 10;
    else if (range === 10) nextRange = 20;
    else if (range === 20) nextRange = 30;
    else nextRange = range + 10;
    setRange(nextRange);
    setLevel(1);
    setLevelProgress(0);
    setGameState('playing');
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (userAnswer === '') return;
    handleAnswer(userAnswer);
  };

  const ConfettiPiece = ({ color, delay, left }) => (
    <div className={`fixed top-0 w-3 h-3 rounded-sm animate-fall`} style={{ backgroundColor: color, left: `${left}%`, animationDuration: `${Math.random() * 2 + 2}s`, animationDelay: `${delay}s` }} />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-indigo-100 font-sans text-gray-800 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      <style>{`
        @keyframes fall { 0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(720deg); opacity: 0; } }
        .animate-fall { animation: fall linear forwards; }
        .clip-path-slant { clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%); }
        @keyframes float-slow {
          0% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -50px) rotate(10deg); }
          66% { transform: translate(-20px, 20px) rotate(-5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes drift-up {
          0% { transform: translateY(110vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.2; }
          90% { opacity: 0.2; }
          100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
        }
        @keyframes firework-bang {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          50% { opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
        .animate-float-slow { animation: float-slow 20s infinite ease-in-out; }
        .animate-drift-up { animation: drift-up linear infinite; }
      `}</style>

      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-200/40 rounded-full blur-[100px] animate-float-slow" style={{ animationDuration: '25s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-200/40 rounded-full blur-[100px] animate-float-slow" style={{ animationDuration: '30s', animationDelay: '-5s' }} />
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-yellow-100/40 rounded-full blur-[80px] animate-float-slow" style={{ animationDuration: '35s', animationDelay: '-12s' }} />
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute text-indigo-900/10 font-black animate-drift-up select-none"
            style={{
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 3 + 2}rem`,
              animationDuration: `${Math.random() * 15 + 20}s`,
              animationDelay: `${Math.random() * -30}s`,
            }}
          >
            {['1', '2', '3', '4', '5', '+', '=', '?', '★', '7', '8'][Math.floor(Math.random() * 11)]}
          </div>
        ))}
      </div>

      {confetti && gameState !== 'pathComplete' && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(30)].map((_, i) => (
            <ConfettiPiece key={i} color={['#FFD700', '#FF6347', '#4169E1', '#32CD32'][i % 4]} delay={Math.random() * 0.5} left={Math.random() * 100} />
          ))}
        </div>
      )}

      {gameState === 'menu' && (
        <div className="w-full max-w-md animate-in slide-in-from-bottom-8 fade-in duration-500 relative z-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-b-8 border-indigo-200 overflow-hidden">
            <div className="bg-indigo-500 p-8 text-center clip-path-slant pb-12 relative">
              <button 
                onClick={() => setLanguage(l => l === 'sv' ? 'en' : 'sv')}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 px-3 rounded-xl transition-all backdrop-blur-sm flex items-center gap-2 border border-white/30"
                aria-label="Switch Language"
              >
                <Globe size={18} />
                <span className="text-xs font-bold">{language === 'sv' ? 'EN' : 'SV'}</span>
              </button>
              <h1 className="text-4xl font-black text-white mb-2">{t.title}</h1>
              <p className="text-indigo-100 font-bold">{t.subtitle}</p>
            </div>
            <div className="p-8 pt-4 space-y-6">
              <div>
                <label className="block text-sm font-black text-gray-400 uppercase tracking-wide mb-3">{t.choosePath}</label>
                <div className="grid grid-cols-1 gap-3">
                  {[5, 10, 20].map((r) => (
                    <button
                      key={r}
                      onClick={() => startPath(r)}
                      className="group relative flex items-center justify-between bg-white border-4 border-gray-100 p-4 rounded-2xl hover:border-indigo-400 hover:bg-indigo-50 transition-all active:scale-95"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl">
                          {r}
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-gray-700 text-lg">{t.numbers} 0 - {r}</div>
                          <div className="text-xs text-gray-400 font-bold uppercase tracking-wide">10 {t.levels}</div>
                        </div>
                      </div>
                      <ArrowRight className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-100">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-wide mb-3">{t.customization}</label>
                <div className="flex gap-2 mb-3">
                  <button onClick={() => setInputMode('buttons')} className={`flex-1 py-2 rounded-xl text-sm font-bold border-b-4 active:border-b-0 active:translate-y-1 transition-all ${inputMode === 'buttons' ? 'bg-purple-500 text-white border-purple-700' : 'bg-white text-gray-400 border-gray-200'}`}>
                    {t.buttons}
                  </button>
                  <button onClick={() => setInputMode('keyboard')} className={`flex-1 py-2 rounded-xl text-sm font-bold border-b-4 active:border-b-0 active:translate-y-1 transition-all ${inputMode === 'keyboard' ? 'bg-purple-500 text-white border-purple-700' : 'bg-white text-gray-400 border-gray-200'}`}>
                    {t.write}
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => setShowFingers(!showFingers)}
                    className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold border-b-4 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 ${showFingers ? 'bg-orange-400 text-white border-orange-600' : 'bg-white text-gray-400 border-gray-200'}`}
                  >
                    <Hand size={16} /> {showFingers ? t.fingersOn : t.fingersOff}
                  </button>
                  <button
                    onClick={() => setShowDots(!showDots)}
                    className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold border-b-4 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 ${showDots ? 'bg-teal-400 text-white border-teal-600' : 'bg-white text-gray-400 border-gray-200'}`}
                  >
                    <Circle size={16} /> {showDots ? t.dotsOn : t.dotsOff}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {gameState === 'playing' && !levelUpAnim && (
        <>
          <div className="w-full max-w-2xl bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-sm border-b-4 border-indigo-200 mb-6 flex justify-between items-center relative z-10">
            <button onClick={() => setGameState('menu')} className="p-2 bg-gray-100 rounded-xl hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors">
              <Home size={20} />
            </button>
            <div className="flex flex-col items-center flex-1 mx-4">
              <div className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">{t.level} {level} / {MAX_LEVELS}</div>
              <div className="w-full max-w-[200px] h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-400 transition-all duration-500 ease-out"
                  style={{ width: `${(levelProgress / QUESTIONS_PER_LEVEL) * 100}%` }}
                />
              </div>
            </div>
            <div className="bg-yellow-100 px-3 py-1 rounded-full text-yellow-700 font-black flex items-center gap-1">
              <Star size={16} className="fill-current" /> {score}
            </div>
          </div>
          <main className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border-b-8 border-indigo-200 p-4 sm:p-8 flex flex-col items-center relative z-0">
            <div className={`w-full bg-indigo-50/50 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 transition-all ${showFingers ? 'min-h-[160px]' : 'min-h-[100px]'}`}>
              <div className="flex flex-col items-center gap-2">
                <div className="text-5xl sm:text-6xl font-black text-indigo-500 mb-2">{num1}</div>
                {showFingers && <HandGroup number={num1} />}
              </div>
              <div className="text-4xl sm:text-6xl font-black text-gray-300 mx-2">+</div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-5xl sm:text-6xl font-black text-indigo-500 mb-2">{num2}</div>
                {showFingers && <HandGroup number={num2} />}
              </div>
            </div>
            <div className="h-8 mb-4 flex items-center justify-center">
              {feedback === 'correct' && (
                <div className="text-green-500 font-black text-xl flex items-center gap-2 animate-bounce">
                  <Star className="fill-current" /> {t.correct}
                </div>
              )}
              {feedback === 'wrong' && (
                <div className="text-red-500 font-bold text-xl animate-pulse">{t.tryAgain}</div>
              )}
            </div>
            <div className="w-full">
              {inputMode === 'buttons' ? (
                <div className="grid grid-cols-3 gap-4">
                  {options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(opt)}
                      disabled={feedback === 'correct'}
                      className="bg-white border-2 border-gray-100 shadow-[0_4px_0_0_rgba(0,0,0,0.1)] hover:shadow-[0_2px_0_0_rgba(0,0,0,0.1)] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none active:bg-indigo-50 flex flex-col items-center justify-center py-4 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[140px]"
                    >
                      <span className="text-3xl sm:text-4xl font-bold text-gray-700 mb-1">{opt}</span>
                      {showDots && <DotGroup number={opt} />}
                    </button>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleInputSubmit} className="flex flex-col items-center gap-4">
                  <input
                    type="text" inputMode="numeric" pattern="[0-9]*" value={userAnswer} onChange={(e) => { const re = /^[0-9\b]+$/; if (e.target.value === '' || re.test(e.target.value)) setUserAnswer(e.target.value); }}
                    disabled={feedback === 'correct'}
                    className="w-48 h-20 text-center text-4xl font-black border-4 border-gray-200 rounded-2xl focus:border-indigo-400 focus:outline-none transition-all text-gray-700"
                    placeholder="?" autoFocus
                  />
                  <button type="submit" disabled={!userAnswer || feedback === 'correct'} className="bg-indigo-500 text-white font-bold text-xl py-3 px-12 rounded-xl shadow-lg hover:bg-indigo-600 transition-colors">{t.check}</button>
                </form>
              )}
            </div>
          </main>
        </>
      )}

      {levelUpAnim && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/90 animate-in fade-in duration-300">
           <div className="text-6xl font-black text-yellow-500 mb-4 animate-bounce">{t.level} {level}!</div>
           <div className="text-2xl font-bold text-gray-500">{t.keepGoing}</div>
        </div>
      )}

      {gameState === 'pathComplete' && (
        <>
          <FireworksDisplay />
          <div className="w-full max-w-md animate-in zoom-in duration-500 relative z-10">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border-b-8 border-yellow-400 p-8 text-center">
              <div className="bg-yellow-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy size={48} className="text-yellow-600" />
              </div>
              <h2 className="text-3xl font-black text-gray-800 mb-2">{t.pathComplete}</h2>
              <p className="text-gray-500 font-bold mb-8">{t.mastered.replace('RANGE', range)}</p>
              <div className="space-y-3">
                <button 
                  onClick={nextPath}
                  className="w-full bg-green-500 hover:bg-green-600 text-white text-xl font-black py-4 rounded-2xl shadow-xl border-b-8 border-green-700 active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center gap-2"
                >
                  {t.continue} {range === 5 ? 10 : (range === 10 ? 20 : range + 10)} <ArrowRight />
                </button>
                <button 
                  onClick={() => setGameState('menu')}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold py-4 rounded-2xl transition-all"
                >
                  {t.backMenu}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
