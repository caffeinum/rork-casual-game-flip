const Features = () => {
  const features = [
    {
      emoji: "⚡",
      title: "Instant Play",
      description: "No downloads, pure fun!",
    },
    {
      emoji: "🎯", 
      title: "Smart Picks",
      description: "AI finds your vibe",
    },
    {
      emoji: "📱",
      title: "Mobile First", 
      description: "Perfect touch controls",
    }
  ];

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 bg-snap-white relative overflow-hidden">
      {/* Floating elements */}
      <div className="absolute top-10 left-10 text-2xl animate-float opacity-30">🎮</div>
      <div className="absolute top-20 right-20 text-2xl animate-float delay-75 opacity-30">🕹️</div>
      <div className="absolute bottom-10 left-20 text-2xl animate-float delay-150 opacity-30">🎲</div>
      <div className="absolute bottom-20 right-10 text-2xl animate-float delay-300 opacity-30">⭐</div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-8 sm:mb-12 px-4">
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black mb-3 sm:mb-4 text-snap-black animate-bounce-in">
            Why Choose Us? 🤔
          </h2>
          <p className="text-lg sm:text-xl text-snap-black/70 font-bold animate-slide-up delay-200">
            Because we're awesome, meow! 🐱✨
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto px-4">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`bg-snap-yellow/20 backdrop-blur-sm p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-3 sm:border-4 border-snap-black shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group animate-swipe-${index % 2 === 0 ? 'left' : 'right'} touch-manipulation`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="text-center">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4 group-hover:animate-wiggle">
                  {feature.emoji}
                </div>
                <h3 className="text-xl sm:text-2xl font-black mb-2 sm:mb-3 text-snap-black group-hover:text-snap-yellow transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="text-snap-black/80 font-semibold text-base sm:text-lg">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile-optimized stats */}
        <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 max-w-3xl mx-auto px-4">
          <div className="text-center bg-snap-black text-snap-yellow p-4 sm:p-6 rounded-2xl sm:rounded-3xl animate-bounce-in delay-700 touch-manipulation hover:scale-105 active:scale-95 transition-transform">
            <div className="text-2xl sm:text-3xl font-black">1000+</div>
            <div className="text-xs sm:text-sm font-bold">Games</div>
          </div>
          <div className="text-center bg-snap-black text-snap-yellow p-4 sm:p-6 rounded-2xl sm:rounded-3xl animate-bounce-in delay-800 touch-manipulation hover:scale-105 active:scale-95 transition-transform">
            <div className="text-2xl sm:text-3xl font-black">0s</div>
            <div className="text-xs sm:text-sm font-bold">Wait Time</div>
          </div>
          <div className="text-center bg-snap-black text-snap-yellow p-4 sm:p-6 rounded-2xl sm:rounded-3xl animate-bounce-in delay-900 touch-manipulation hover:scale-105 active:scale-95 transition-transform">
            <div className="text-2xl sm:text-3xl font-black">100%</div>
            <div className="text-xs sm:text-sm font-bold">Free</div>
          </div>
          <div className="text-center bg-snap-black text-snap-yellow p-4 sm:p-6 rounded-2xl sm:rounded-3xl animate-bounce-in delay-1000 touch-manipulation hover:scale-105 active:scale-95 transition-transform">
            <div className="text-2xl sm:text-3xl font-black">∞</div>
            <div className="text-xs sm:text-sm font-bold">Fun</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;