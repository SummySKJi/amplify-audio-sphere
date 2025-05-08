
const platforms = [
  "Spotify", "Apple Music", "JioSaavn", "YouTube Music", 
  "Instagram", "Facebook", "Gaana", "Wynk Music", 
  "Hungama", "Amazon Music", "Resso", "TikTok"
];

const Platforms = () => {
  return (
    <section id="platforms" className="section-padding bg-black/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get Your Music On <span className="text-gradient">250+ Platforms</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We distribute your music to all major streaming platforms and digital stores
            worldwide. Here are some of the top destinations for your music:
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {platforms.map((platform, index) => (
            <div 
              key={index}
              className="glass-card h-24 flex items-center justify-center card-hover"
            >
              <p className="font-medium text-white">{platform}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400">
            ...and 230+ more streaming platforms and stores worldwide
          </p>
        </div>
      </div>
    </section>
  );
};

export default Platforms;
