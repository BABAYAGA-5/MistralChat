export default function Loader() {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex space-x-1">
        <div className="h-2.5 w-2.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce shadow-lg" style={{animationDelay: '-0.3s'}}></div>
        <div className="h-2.5 w-2.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-bounce shadow-lg" style={{animationDelay: '-0.15s'}}></div>
        <div className="h-2.5 w-2.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce shadow-lg"></div>
      </div>
      <span className="text-sm text-gray-400 ml-2 animate-pulse">✨ AI is thinking...</span>
    </div>
  );
}