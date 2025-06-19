// src/components/ui/Card.tsx
import React from 'react';
import { LucideProps } from 'lucide-react';

interface CardProps {
  title?: string;
  icon?: React.ComponentType<LucideProps>;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, icon: Icon, children }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 h-full">
      {title && (
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          {Icon && <Icon className="h-7 w-7 mr-2 text-blue-600" />} {title}
        </h2>
      )}
      {children}
    </div>
  );
};

export default Card;