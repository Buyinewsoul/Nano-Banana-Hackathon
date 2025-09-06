
import React from 'react';

interface HistoryPanelProps {
  history: string[];
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <h3 className="text-sm font-medium text-gray-300 mb-2">Edit History</h3>
      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
        {history.map((item, index) => (
          <div key={index} className="bg-gray-700/50 p-2 rounded-md">
            <p className="text-sm text-gray-200">
              <span className="font-semibold text-purple-400 mr-2">{index + 1}.</span>
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
