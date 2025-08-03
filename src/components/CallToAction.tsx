import { Button } from "@/components/ui/button";
import { Play, Download, Smartphone } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 relative overflow-hidden bg-snap-black">
      {/* Floating game emojis */}
      <div className="absolute top-10 left-10 text-3xl animate-bounce-in opacity-40">🎮</div>
      <div className="absolute top-20 right-20 text-2xl animate-swipe-left delay-200 opacity-40">🕹️</div>
      <div className="absolute bottom-20 left-20 text-4xl animate-float delay-400 opacity-40">🎯</div>
      <div className="absolute bottom-10 right-10 text-2xl animate-wiggle delay-600 opacity-40">🎲</div>
      <div className="absolute top-1/2 left-1/4 text-2xl animate-pop delay-800 opacity-40">⚡</div>
      <div className="absolute top-1/3 right-1/4 text-3xl animate-swipe-right delay-1000 opacity-40">💎</div>
      
      <div className="container mx-auto relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA */}
          <div className="mb-8 animate-bounce-in">
            <Smartphone className="w-20 h-20 mx-auto text-snap-yellow animate-wiggle" />
          </div>
          
          <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black mb-4 sm:mb-6 text-snap-white leading-tight animate-slide-up px-4">
            Ready to Play?
            <br />
            <span className="text-snap-yellow">Let's Go! 🚀</span>
          </h2>
          
          <p className="text-lg sm:text-2xl text-snap-white/90 mb-8 sm:mb-12 font-bold animate-slide-up delay-200 px-4">
            Join the fun, meow! No strings attached! 🐱💛
          </p>
          
          {/* Mobile-optimized action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-8 sm:mb-12 px-4">
            <Button 
              className="text-xl sm:text-2xl px-10 sm:px-16 py-6 sm:py-8 bg-snap-yellow text-snap-black font-black rounded-full border-4 border-snap-yellow hover:bg-snap-white hover:border-snap-white transform active:scale-95 hover:scale-110 transition-all duration-300 shadow-2xl animate-swipe-left delay-400 min-h-[70px] touch-manipulation"
              onClick={() => window.open('https://casual-game-flip.expo.app/', '_blank')}
            >
              <Play className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3" />
              PLAY NOW!
            </Button>
            <Button 
              className="text-xl sm:text-2xl px-10 sm:px-16 py-6 sm:py-8 bg-transparent text-snap-yellow font-black rounded-full border-4 border-snap-yellow hover:bg-snap-yellow hover:text-snap-black transform active:scale-95 hover:scale-110 transition-all duration-300 shadow-2xl animate-swipe-right delay-500 min-h-[70px] touch-manipulation"
            >
              <Download className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3" />
              GET APP
            </Button>
          </div>
          
          {/* Mobile-friendly badges */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 animate-bounce-in delay-600 px-4">
            <div className="bg-snap-yellow/20 backdrop-blur-sm border-2 border-snap-yellow rounded-full px-4 sm:px-6 py-2 sm:py-3 touch-manipulation">
              <span className="text-snap-yellow font-bold text-sm sm:text-base">🎮 1000+ Games</span>
            </div>
            <div className="bg-snap-yellow/20 backdrop-blur-sm border-2 border-snap-yellow rounded-full px-4 sm:px-6 py-2 sm:py-3 touch-manipulation">
              <span className="text-snap-yellow font-bold text-sm sm:text-base">⚡ Instant Play</span>
            </div>
            <div className="bg-snap-yellow/20 backdrop-blur-sm border-2 border-snap-yellow rounded-full px-4 sm:px-6 py-2 sm:py-3 touch-manipulation">
              <span className="text-snap-yellow font-bold text-sm sm:text-base">💛 No Ads</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;