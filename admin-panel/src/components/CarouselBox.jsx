import React from "react";

const CarouselBox = () => {
  return (
    <div className="w-full h-64 bg-cover bg-center rounded-lg shadow-md" style={{ backgroundImage: `url('https://source.unsplash.com/random/800x600')` }}>
      <div className="bg-black bg-opacity-40 h-full w-full flex items-center justify-center text-white text-2xl font-bold">
        Carousel Slide
      </div>
    </div>
  );
};

export default CarouselBox;
