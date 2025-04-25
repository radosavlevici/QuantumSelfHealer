import { useState } from "react";
import { Feature } from "@/types";

interface FeatureToggleProps {
  feature: Feature;
  onToggle: (id: string, enabled: boolean) => void;
}

export function FeatureToggle({ feature, onToggle }: FeatureToggleProps) {
  const [enabled, setEnabled] = useState(feature.enabled);

  const handleToggle = () => {
    const newState = !enabled;
    setEnabled(newState);
    onToggle(feature.id, newState);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="material-icons text-primary-light mr-3">{feature.icon}</span>
          <span className="font-medium">{feature.title}</span>
        </div>
        <label className="relative inline-block w-12 h-6">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={enabled} 
            onChange={handleToggle}
          />
          <div className="absolute cursor-pointer rounded-full bg-gray-300 peer-checked:bg-primary-light left-0 right-0 top-0 bottom-0 transition-all duration-300 before:absolute before:content-[''] before:h-4 before:w-4 before:left-1 before:bottom-1 before:rounded-full before:bg-white before:transition-all before:duration-300 peer-checked:before:translate-x-6"></div>
        </label>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
        {feature.description}
      </p>
    </div>
  );
}
