import React from 'react';

interface ModeSwitchProps {
  isMedium: boolean;
  onToggle: () => void;
}

const SwitchComponent: React.FC<ModeSwitchProps> = ({ isMedium, onToggle }) => {
  return (
    <div className="flex items-center space-x-2 m-4">
      <span className="text-sm font-medium">{'Modo Fácil'}</span>
      <button
        onClick={onToggle}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          isMedium ? 'bg-blue-600' : 'bg-gray-400'
        }`}
      >
        <div
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
            isMedium ? 'translate-x-6' : 'translate-x-0'
          }`}
        ></div>
      </button>
      <span className="text-sm font-medium">{'Modo Normal'}</span>
    </div>
  );
};

export default SwitchComponent;
