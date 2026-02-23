import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20 hover:shadow-2xl hover:-translate-y-1 ${className} ${onClick ? 'cursor-pointer' : ''}`}
        >
            {children}
        </div>
    );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`px-6 py-4 border-b border-white/5 ${className}`}>{children}</div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`px-6 py-4 ${className}`}>{children}</div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`px-6 py-4 border-t border-white/5 ${className}`}>{children}</div>
);
