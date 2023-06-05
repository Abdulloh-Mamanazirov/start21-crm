import React from "react";

const GroupCardPlaceholder = () => {
  return (
    <div className="relative border border-gray-300 rounded-xl p-3 pt-14 pb-12 shadow-lg">
      <div className="bg-gray-300 animate-pulse py-6 text-white text-xl font-semibold text-center absolute top-0 inset-x-0 rounded-t-xl"></div>
      <div className="flex items-center gap-5">
        <span className="w-16 bg-gray-300 animate-pulse object-cover aspect-square rounded-full" />
        <div className="flex flex-col gap-2 flex-1">
          <span className=" bg-gray-300 animate-pulse p-3"></span>
          <span className=" bg-gray-300 animate-pulse p-3"></span>
        </div>
      </div>
      <div className="flex flex-col mt-2 gap-2">
        <span className="flex items-center gap-3 bg-gray-300 animate-pulse p-2"></span>
        <span className="flex items-center gap-3 bg-gray-300 animate-pulse p-2"></span>
        <span className="flex items-center gap-3 bg-gray-300 animate-pulse p-2"></span>
      </div>
      <div className="rounded-b-xl absolute bottom-0 inset-x-0 flex bg-gray-300 animate-pulse p-4"></div>
    </div>
  );
};

export default GroupCardPlaceholder;
