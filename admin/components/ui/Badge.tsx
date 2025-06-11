import { AlertTriangle, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'outline';
  children: React.ReactNode;
  className?: string;
}

const Badge = ({ 
  variant = 'default', 
  children,
  className = ''
}: BadgeProps) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    destructive: 'bg-red-100 text-red-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    outline: 'border border-gray-300 bg-white'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;