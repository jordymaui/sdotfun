import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faUsers, faChartLine, faCog, faRotate, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { toast } from 'sonner@2.0.3';

interface DashboardNavProps {
  currentPage: 'overview' | 'players' | 'trades' | 'settings' | 'performance';
  onPageChange: (page: 'overview' | 'players' | 'trades' | 'settings' | 'performance') => void;
}

export function DashboardNav({ currentPage, onPageChange }: DashboardNavProps) {
  const { refreshFromSupabase, isLoading, lastRefreshed } = usePortfolioStore();
  
  const navItems = [
    { id: 'overview' as const, label: 'Portfolio Overview', icon: faChartPie },
    { id: 'performance' as const, label: 'Performance', icon: faChartBar },
    { id: 'players' as const, label: 'Players', icon: faUsers },
    { id: 'trades' as const, label: 'Trades', icon: faChartLine },
    { id: 'settings' as const, label: 'Settings', icon: faCog },
  ];

  const handleRefresh = async () => {
    const toastId = toast.loading('Refreshing live data from Supabase...');
    await refreshFromSupabase();
    toast.success('Portfolio data refreshed!', { id: toastId });
  };

  return (
    <nav className="border-b border-stroke bg-card/50">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[14px] font-semibold transition-colors ${
                    isActive
                      ? 'bg-green text-app-bg'
                      : 'text-dim hover:text-text hover:bg-muted/50'
                  }`}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className={`h-5 w-5 ${
                      isActive ? 'text-app-bg' : 'text-dim'
                    }`}
                  />
                  {item.label}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-semibold transition-colors ${
              isLoading 
                ? 'text-dim cursor-not-allowed' 
                : 'text-dim hover:text-text hover:bg-muted/50'
            }`}
            title="Refresh Dashboard"
          >
            <FontAwesomeIcon
              icon={faRotate}
              className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
            />
            <span>Refresh</span>
            {lastRefreshed && !isLoading && (
              <span className="text-[10px] text-dim">
                • {new Date(lastRefreshed).toLocaleTimeString()}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}