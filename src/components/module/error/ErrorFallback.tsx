"use client";
import React from "react";

interface ErrorFallbackProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ message, onRetry, className = "text-center py-24" }) => {
  return (
    <div className={className}>
      <div className="max-w-md mx-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
        <p className="text-gray-600 mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorFallback;
