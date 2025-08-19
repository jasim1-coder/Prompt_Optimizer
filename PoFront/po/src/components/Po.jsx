import { useState, useRef } from "react";
import { Settings, Zap, Copy, Menu, X } from "lucide-react";

export default function PromptOptimizer() {
  const [inputPrompt, setInputPrompt] = useState("");
  const [outputPrompt, setOutputPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState({ type: "connected", message: "Connected" });
  const [tokenUsage, setTokenUsage] = useState(35); 
  const [showSettings, setShowSettings] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("input"); 
  const outputRef = useRef(null);


 const optimizePrompt = async () => {
  if (!inputPrompt.trim()) return;

  setIsProcessing(true);
  setStatus({ type: "processing", message: "Processing..." });
  setOutputPrompt("");
  setActiveTab("output");

  try {
    const response = await fetch("https://localhost:7201/api/Prompts/optimize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ originalPrompt: inputPrompt }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // data will look like:
    // {
    //   "id": 6,
    //   "originalPrompt": "hai",
    //   "optimizedPrompt": "Hai ",
    //   "createdAt": "0001-01-01T00:00:00"
    // }

    const optimized = data.optimizedPrompt || "No optimized prompt received.";

    // Typewriter effect
    setIsTyping(true);
    let i = 0;
    const typeWriter = () => {
      
      if (i < optimized.length) {
        setOutputPrompt(optimized.slice(0, i + 1));
        i++;
        setTimeout(typeWriter, 30);
      } else {
        setIsTyping(false);
      }
    };
    typeWriter();

    setTokenUsage((prev) => Math.min(prev + 15, 95));
    setStatus({ type: "connected", message: "Connected" });
  } catch (err) {
    console.error(err);
    setStatus({ type: "disconnected", message: "Error connecting" });
    setOutputPrompt("⚠️ Failed to optimize prompt. Please try again.");
  } finally {
    setIsProcessing(false);
  }
};


  const copyToClipboard = async () => {
    if (outputPrompt) await navigator.clipboard.writeText(outputPrompt);
  };

  const StatusIndicator = ({ status }) => {
    const colorMap = {
      connected: "bg-green-500 shadow-md shadow-green-500/50",
      disconnected: "bg-red-500 shadow-md shadow-red-500/50",
      processing: "bg-yellow-400 animate-pulse",
    };
    return (
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${colorMap[status.type] || ""}`} />
        <span className="font-mono text-xs sm:text-sm text-gray-500 hidden sm:inline">{status.message}</span>
        <span className="font-mono text-xs text-gray-500 sm:hidden">{status.type === "connected" ? "●" : status.type === "processing" ? "..." : "○"}</span>
      </div>
    );
  };

  const LoadingDots = () => (
    <div className="flex space-x-1">
      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full animate-bounce" />
      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.16s]" />
      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.32s]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b bg-white px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 rounded-md flex items-center justify-center">
            <Zap className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
          </div>
          <h1 className="font-mono text-lg sm:text-xl font-semibold tracking-tight">
            <span className="hidden sm:inline">Prompt Optimizer</span>
            <span className="sm:hidden">Optimizer</span>
          </h1>
        </div>
        
        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Desktop settings */}
        <div className="hidden sm:block relative">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Settings className="w-5 h-5" />
          </button>
          {showSettings && (
            <div className="absolute right-0 top-12 bg-white border rounded-lg shadow-lg p-3 w-48 animate-[slide-up_0.3s_ease-out] z-10">
              <label className="block text-sm font-medium mb-2">Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full p-2 border rounded-md bg-gray-50 font-mono text-sm"
              >
                <option value="gpt-4o">GPT-4o</option>
                <option value="gpt-4o-mini">GPT-4o Mini</option>
                <option value="claude-3.5-sonnet">Claude 3.5 Sonnet</option>
              </select>
            </div>
          )}
        </div>
      </header>

      {/* Mobile settings menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white border-b p-4 animate-[slide-up_0.3s_ease-out]">
          <label className="block text-sm font-medium mb-2">Model</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full p-2 border rounded-md bg-gray-50 font-mono text-sm"
          >
            <option value="gpt-4o">GPT-4o</option>
            <option value="gpt-4o-mini">GPT-4o Mini</option>
            <option value="claude-3.5-sonnet">Claude 3.5 Sonnet</option>
          </select>
        </div>
      )}

      {/* Mobile tabs */}
      <div className="sm:hidden bg-white border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab("input")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition ${
              activeTab === "input"
                ? "text-orange-600 border-b-2 border-orange-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Input
          </button>
          <button
            onClick={() => setActiveTab("output")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition ${
              activeTab === "output"
                ? "text-orange-600 border-b-2 border-orange-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Output
          </button>
        </div>
      </div>

      {/* Workspace */}
      <main className="flex-1 flex">
        {/* Desktop: Side by side */}
        <div className="hidden sm:flex flex-1">
          {/* Input */}
          <div className="flex-1 flex flex-col border-r">
            <div className="p-3 md:p-4 border-b">
              <h2 className="font-mono text-sm font-medium text-gray-500">INPUT</h2>
            </div>
            <div className="flex-1 p-3 md:p-4">
              <textarea
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Paste your raw prompt/code here..."
                className="w-full h-full resize-none bg-transparent focus:outline-none font-mono text-sm leading-relaxed p-3 md:p-4 rounded-lg border"
              />
            </div>
          </div>

          {/* Output */}
          <div className="flex-1 flex flex-col">
            <div className="p-3 md:p-4 border-b flex items-center justify-between">
              <h2 className="font-mono text-sm font-medium text-gray-500">OUTPUT</h2>
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 transition"
                disabled={!outputPrompt}
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 p-3 md:p-4">
              <textarea
                ref={outputRef}
                value={outputPrompt}
                readOnly
                placeholder={
                  isProcessing ? "Processing..." : "Optimized prompt will appear here..."
                }
                className={`w-full h-full resize-none bg-transparent focus:outline-none font-mono text-sm leading-relaxed p-3 md:p-4 rounded-lg border ${
                  isTyping ? "animate-[typing_2s_steps(40,end),blink_0.75s_infinite]" : ""
                }`}
              />
            </div>
          </div>
        </div>

        {/* Mobile: Tabbed view */}
        <div className="sm:hidden flex-1 flex flex-col">
          {activeTab === "input" && (
            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b">
                <h2 className="font-mono text-sm font-medium text-gray-500">INPUT</h2>
              </div>
              <div className="flex-1 p-4">
                <textarea
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  placeholder="Paste your raw prompt/code here..."
                  className="w-full h-full resize-none bg-transparent focus:outline-none font-mono text-sm leading-relaxed p-4 rounded-lg border"
                />
              </div>
            </div>
          )}

          {activeTab === "output" && (
            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-mono text-sm font-medium text-gray-500">OUTPUT</h2>
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 transition"
                  disabled={!outputPrompt}
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 p-4">
                <textarea
                  ref={outputRef}
                  value={outputPrompt}
                  readOnly
                  placeholder={
                    isProcessing ? "Processing..." : "Optimized prompt will appear here..."
                  }
                  className={`w-full h-full resize-none bg-transparent focus:outline-none font-mono text-sm leading-relaxed p-4 rounded-lg border ${
                    isTyping ? "animate-[typing_2s_steps(40,end),blink_0.75s_infinite]" : ""
                  }`}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 w-full sm:w-auto">
            <StatusIndicator status={status} />
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs sm:text-sm text-gray-500">Tokens</span>
              <div className="w-20 sm:w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 transition-all duration-300"
                  style={{ width: `${tokenUsage}%` }}
                />
              </div>
              <span className="font-mono text-xs text-gray-500">{tokenUsage}%</span>
            </div>
          </div>
          <button
            onClick={optimizePrompt}
            disabled={!inputPrompt.trim() || isProcessing}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-orange-500 text-white font-mono font-bold flex items-center justify-center transition hover:scale-105 active:scale-95 disabled:opacity-50 shrink-0"
          >
            {isProcessing ? <LoadingDots /> : <span className="text-xs sm:text-sm">RUN</span>}
          </button>
        </div>
      </footer>

      {/* Inline animations */}
      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes blink {
          0%, 100% { border-color: transparent; }
          50% { border-color: orange; }
        }
      `}</style>
    </div>
  );
}

// import { useState, useRef } from "react";
// import { Settings, Zap, Copy } from "lucide-react";

// export default function App() {
//   const [inputPrompt, setInputPrompt] = useState("");
//   const [outputPrompt, setOutputPrompt] = useState("");
//   const [selectedModel, setSelectedModel] = useState("gpt-4o");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [status, setStatus] = useState({ type: "connected", message: "Connected" });
//   const [tokenUsage, setTokenUsage] = useState(35); // Mock %
//   const [showSettings, setShowSettings] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   const outputRef = useRef(null);

//   // Mock API call simulation
//   const optimizePrompt = async () => {
//     if (!inputPrompt.trim()) return;
//     setIsProcessing(true);
//     setStatus({ type: "processing", message: "Processing..." });
//     setOutputPrompt("");

//     await new Promise((resolve) => setTimeout(resolve, 2000));

//     const mockOutput = `OPTIMIZED PROMPT:

// You are an expert AI assistant specializing in [specific domain]. Your task is to provide detailed, accurate, and actionable responses.

// Context: ${inputPrompt.slice(0, 100)}...

// Instructions:
// 1. Analyze the user's request thoroughly
// 2. Provide step-by-step guidance
// 3. Include relevant examples
// 4. Maintain a professional yet friendly tone
// 5. Ask clarifying questions if needed

// Output format: [Structured response with clear sections]

// Quality checks:
// - Ensure accuracy and relevance
// - Verify all recommendations are practical
// - Include potential limitations or considerations`;

//     setIsProcessing(false);
//     setStatus({ type: "connected", message: "Connected" });

//     // Typewriter effect
//     setIsTyping(true);
//     let i = 0;
//     const typeWriter = () => {
//       if (i < mockOutput.length) {
//         setOutputPrompt(mockOutput.slice(0, i + 1));
//         i++;
//         setTimeout(typeWriter, 30);
//       } else {
//         setIsTyping(false);
//       }
//     };
//     typeWriter();

//     setTokenUsage((prev) => Math.min(prev + 15, 95));
//   };

//   const copyToClipboard = async () => {
//     if (outputPrompt) {
//       // Use document.execCommand('copy') for better iframe compatibility
//       if (outputRef.current) {
//         outputRef.current.select();
//         document.execCommand('copy');
//       }
//     }
//   };

//   const StatusIndicator = ({ status }) => {
//     const colorMap = {
//       connected: "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]",
//       disconnected: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]",
//       processing: "bg-yellow-400 animate-pulse",
//     };
//     return (
//       <div className="flex items-center gap-2">
//         <div className={`w-3 h-3 rounded-full ${colorMap[status.type] || ""}`} />
//         <span className="font-mono text-sm text-gray-500">{status.message}</span>
//       </div>
//     );
//   };

//   const LoadingDots = () => (
//     <div className="flex space-x-1">
//       <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
//       <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.16s]" />
//       <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.32s]" />
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
//       {/* Header */}
//       <header className="border-b bg-white px-4 md:px-6 py-4 flex justify-between items-center flex-wrap gap-4">
//         <div className="flex items-center gap-3">
//           <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
//             <Zap className="w-5 h-5 text-white" />
//           </div>
//           <h1 className="font-mono text-lg md:text-xl font-semibold tracking-tight">
//             Prompt Optimizer
//           </h1>
//         </div>
//         <div className="relative">
//           <button
//             onClick={() => setShowSettings(!showSettings)}
//             className="p-2 hover:bg-gray-100 rounded-lg transition"
//           >
//             <Settings className="w-5 h-5" />
//           </button>
//           {showSettings && (
//             <div className="absolute right-0 top-12 bg-white border rounded-lg shadow-lg p-3 w-48 animate-[slide-up_0.3s_ease-out] z-10">
//               <label className="block text-sm font-medium mb-2">Model</label>
//               <select
//                 value={selectedModel}
//                 onChange={(e) => setSelectedModel(e.target.value)}
//                 className="w-full p-2 border rounded-md bg-gray-50 font-mono text-sm"
//               >
//                 <option value="gpt-4o">GPT-4o</option>
//                 <option value="gpt-4o-mini">GPT-4o Mini</option>
//                 <option value="claude-3.5-sonnet">Claude 3.5 Sonnet</option>
//               </select>
//             </div>
//           )}
//         </div>
//       </header>

//       {/* Main Workspace - Flexbox for columns, Grid for mobile */}
//       <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
//         {/* Input */}
//         <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r">
//           <div className="p-4 border-b">
//             <h2 className="font-mono text-sm font-medium text-gray-500">INPUT</h2>
//           </div>
//           <div className="flex-1 p-4 overflow-auto">
//             <textarea
//               value={inputPrompt}
//               onChange={(e) => setInputPrompt(e.target.value)}
//               placeholder="Paste your raw prompt/code here..."
//               className="w-full h-full min-h-[200px] md:min-h-full resize-none bg-transparent focus:outline-none font-mono text-sm leading-relaxed p-4 rounded-lg border focus:border-orange-500 transition-colors"
//             />
//           </div>
//         </div>

//         {/* Output */}
//         <div className="flex-1 flex flex-col">
//           <div className="p-4 border-b flex items-center justify-between">
//             <h2 className="font-mono text-sm font-medium text-gray-500">OUTPUT</h2>
//             <button
//               onClick={copyToClipboard}
//               className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
//               disabled={!outputPrompt}
//             >
//               <Copy className="w-4 h-4" />
//             </button>
//           </div>
//           <div className="flex-1 p-4 overflow-auto">
//             <textarea
//               ref={outputRef}
//               value={outputPrompt}
//               readOnly
//               placeholder={
//                 isProcessing ? "Processing..." : "Optimized prompt will appear here..."
//               }
//               className={`w-full h-full min-h-[200px] md:min-h-full resize-none bg-transparent focus:outline-none font-mono text-sm leading-relaxed p-4 rounded-lg border ${
//                 isTyping ? "animate-[typing_2s_steps(40,end)]" : ""
//               }`}
//             />
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="border-t bg-white px-4 md:px-6 py-4 flex flex-col-reverse md:flex-row items-center justify-between gap-4">
//         <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
//           <StatusIndicator status={status} />
//           <div className="flex items-center gap-2">
//             <span className="font-mono text-sm text-gray-500">Tokens</span>
//             <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-orange-500 transition-all duration-300"
//                 style={{ width: `${tokenUsage}%` }}
//               />
//             </div>
//             <span className="font-mono text-xs text-gray-500">{tokenUsage}%</span>
//           </div>
//         </div>
//         <button
//           onClick={optimizePrompt}
//           disabled={!inputPrompt.trim() || isProcessing}
//           className="w-16 h-16 rounded-full bg-orange-500 text-white font-mono font-bold flex items-center justify-center transition hover:scale-105 active:scale-95 disabled:opacity-50"
//         >
//           {isProcessing ? <LoadingDots /> : "RUN"}
//         </button>
//       </footer>

//       {/* Inline animations */}
//       <style>{`
//         @keyframes slide-up {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style>
//     </div>
//   );
// }
