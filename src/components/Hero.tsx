import { Button } from "@/components/ui/button";
import { Play, Download, Ghost } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-snap-yellow">
      {/* Snapchat-style background pattern */}
      <div className="absolute inset-0 bg-gradient-glow opacity-20 animate-pulse-glow"></div>
      
      {/* Floating game emojis - casual game style */}
      <div className="absolute top-20 left-10 text-4xl animate-bounce-in delay-100">🎮</div>
      <div className="absolute top-32 right-20 text-3xl animate-swipe-left delay-200">🕹️</div>
      <div className="absolute bottom-40 left-20 text-5xl animate-float">🎯</div>
      <div className="absolute bottom-20 right-16 text-3xl animate-wiggle delay-300">🎲</div>
      <div className="absolute top-60 left-1/3 text-2xl animate-pop delay-400">⭐</div>
      <div className="absolute bottom-60 right-1/3 text-4xl animate-swipe-right delay-500">💎</div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Snapchat-style ghost icon */}
          <div className="mb-8 animate-bounce-in">
            <Ghost className="w-24 h-24 mx-auto text-snap-white drop-shadow-lg" />
          </div>
          
          {/* Main heading - Responsive for mobile */}
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black mb-4 sm:mb-6 text-snap-white drop-shadow-2xl leading-tight animate-slide-up">
            Play Games
            <br />
            <span className="text-snap-black">Instantly!</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-snap-black mb-6 sm:mb-8 animate-slide-up delay-200">
            Swipe • Play • Repeat 🔥
          </p>
          
          {/* Simple description */}
          <p className="text-base sm:text-lg text-snap-black/80 mb-8 sm:mb-12 max-w-2xl mx-auto animate-slide-up delay-300 px-4">
            No downloads, no ads, no BS. Just pure gaming fun in seconds! meow! 🐱
          </p>
          
          {/* Mobile-optimized buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 animate-swipe-left delay-400 px-4">
            <Button 
              className="text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-6 bg-snap-black text-snap-yellow font-black rounded-full border-4 border-snap-black hover:bg-snap-white hover:text-snap-black transform active:scale-95 hover:scale-105 transition-all duration-200 shadow-lg animate-pop min-h-[60px] touch-manipulation"
              onClick={() => window.open('https://casual-game-flip.expo.app/', '_blank')}
            >
              <Play className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              START PLAYING
            </Button>
            <Button 
              className="text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-6 bg-snap-white text-snap-black font-black rounded-full border-4 border-snap-black hover:bg-snap-yellow transform active:scale-95 hover:scale-105 transition-all duration-200 shadow-lg animate-pop delay-100 min-h-[60px] touch-manipulation"
            >
              <Download className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              GET APP
            </Button>
          </div>

          {/* Mobile-friendly game cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto animate-swipe-right delay-500 px-4">
            <div className="bg-snap-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-3 sm:border-4 border-snap-black shadow-lg animate-float hover:animate-wiggle touch-manipulation">
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🎮</div>
              <div className="text-xs sm:text-sm font-bold text-snap-black">Puzzle</div>
            </div>
            <div className="bg-snap-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-3 sm:border-4 border-snap-black shadow-lg animate-float delay-75 hover:animate-wiggle touch-manipulation">
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🏃‍♂️</div>
              <div className="text-xs sm:text-sm font-bold text-snap-black">Runner</div>
            </div>
            <div className="bg-snap-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-3 sm:border-4 border-snap-black shadow-lg animate-float delay-150 hover:animate-wiggle touch-manipulation">
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🎯</div>
              <div className="text-xs sm:text-sm font-bold text-snap-black">Arcade</div>
            </div>
            <div className="bg-snap-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-3 sm:border-4 border-snap-black shadow-lg animate-float delay-300 hover:animate-wiggle touch-manipulation">
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🧩</div>
              <div className="text-xs sm:text-sm font-bold text-snap-black">Strategy</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;