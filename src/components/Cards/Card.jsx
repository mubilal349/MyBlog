import React from "react";

const Card = ({ title, description, image }) => {
  return (
    <div className="max-w-sm bg-white shadow-lg rounded-lg overflow-hidden">
      <img className="w-full h-48 object-cover" src={image} alt={title} />
      <div className="p-4">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="text-gray-600 mt-2 ">{description}</p>
      </div>
    </div>
  );
};

export default Card;
