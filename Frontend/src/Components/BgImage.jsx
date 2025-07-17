// bgImage.jsx
import React from 'react';

const bgImage = ({ children }) => {
  return (
    <div
      className="min-h-screen bg-[url('/images/bg.jpg')] bg-cover bg-center text-white"
    >
      {children}
    </div>
  );
};

export default bgImage;
