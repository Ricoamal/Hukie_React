import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';

interface ImageSliderProps {
  images: string[];
  onFullscreen: () => void;
}

export default function ImageSlider({ images, onFullscreen }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance the slider every 5 seconds
  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [images.length]);

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFullscreen();
  };

  if (images.length === 0) {
    return <div className="h-48 bg-gray-200 flex items-center justify-center">No images</div>;
  }

  return (
    <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
      {/* Main image */}
      <img 
        src={images[currentIndex]} 
        alt={`Slide ${currentIndex + 1}`} 
        className="w-full h-full object-cover transition-opacity duration-500"
      />
      
      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button 
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}
      
      {/* Fullscreen button */}
      <button 
        onClick={handleFullscreen}
        className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all"
      >
        <Maximize2 size={16} />
      </button>
      
      {/* Dots indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
          {images.map((_, index) => (
            <div 
              key={index} 
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
