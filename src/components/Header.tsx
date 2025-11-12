import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';

interface HeaderProps {
  walletBalance: number;
}

export function Header({ walletBalance }: HeaderProps) {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Portfolio', 'Transfers', 'Leaderboards'];

  return (
    <header className="sticky top-0 z-50 border-b border-stroke bg-app-bg">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green">
            <FontAwesomeIcon icon={faChartLine} className="h-5 w-5 text-app-bg" />
          </div>
          <span className="text-[18px] font-semibold text-text">Sport.fun Analytics</span>
        </div>

          {/* Right: Balance */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full bg-card px-4 py-2 border border-stroke">
            <div className="h-2 w-2 rounded-full bg-gold"></div>
            <span className="text-[14px] font-semibold text-text">
              ${walletBalance.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}