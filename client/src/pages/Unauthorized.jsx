import React from "react";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-red-600">
      <h1 className="text-3xl font-bold">403 - Unauthorized</h1>
      <p className="mt-2">You don’t have permission to view this page.</p>
    </div>
  );
};

export default Unauthorized;
