import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faFootballBall, faFutbol } from '@fortawesome/free-solid-svg-icons';

interface MainNavProps {
  currentPage: 'overview' | 'nfl' | 'football';
  onPageChange: (page: 'overview' | 'nfl' | 'football') => void;
}

export function MainNav({ currentPage, onPageChange }: MainNavProps) {
  const navItems = [
    { id: 'overview' as const, label: 'Overview', icon: faChartLine },
    { id: 'nfl' as const, label: 'NFL', icon: faFootballBall },
    { id: 'football' as const, label: 'Football', icon: faFutbol },
  ];

  return (
    <nav className="border-b border-stroke bg-card/30">
      <div className="px-8 py-4">
        <div className="flex items-center justify-center gap-2">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg text-[16px] font-bold transition-colors ${
                  isActive
                    ? 'bg-green text-app-bg'
                    : 'text-dim hover:text-text hover:bg-muted/50'
                }`}
              >
                <FontAwesomeIcon 
                  icon={item.icon} 
                  className={`h-5 w-5 ${
                    isActive ? 'text-app-bg' : ''
                  }`}
                />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}