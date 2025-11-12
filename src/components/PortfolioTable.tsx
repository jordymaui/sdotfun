import React, { useState, useEffect } from 'react';
import { Player, useStore } from '../store/useStore';
import { formatCurrency, formatPercentage, getPlayerInitials } from '../utils/calculations';
import { TagPill } from './TagPill';
import { BatchPill } from './BatchPill';
import { SortableTableHeader } from './SortableTableHeader';
import { ActionModal } from './ActionModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faTimes } from '@fortawesome/free-solid-svg-icons';

interface PortfolioTableProps {
  positions: Player[];
}

export function PortfolioTable({ positions: initialPositions }: PortfolioTableProps) {
  const { batchFilter, tagFilter, setBatchFilter, setTagFilter, updatePositionBatch } = useStore();
  const [openMenuIdx, setOpenMenuIdx] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [actionModal, setActionModal] = useState<{
    open: boolean;
    player: string;
    action: 'buy' | 'sell';
  } | null>(null);

  // Apply sorting
  let positions = [...initialPositions];
  if (sortConfig) {
    positions.sort((a, b) => {
      let aVal: any = a[sortConfig.key as keyof typeof a];
      let bVal: any = b[sortConfig.key as keyof typeof b];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const hasActiveFilters = batchFilter !== 'All' || tagFilter !== 'All';

  const clearAllFilters = () => {
    setBatchFilter('All');
    setTagFilter('All');
  };

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'desc' };
    });
  };

  return (
    <div className="rounded-xl bg-card p-6 border border-stroke shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[18px] font-semibold text-text">Portfolio</h3>
      </div>

      {/* Filter Controls */}
      <div className="mb-6 space-y-3">
        <div className="flex gap-4 items-center">
          {/* Batch Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-dim uppercase tracking-wide">Batch:</span>
            <div className="flex gap-2">
              {(['All', 'Batch 1', 'Batch 2'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setBatchFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${
                    batchFilter === f
                      ? 'bg-green text-app-bg'
                      : 'bg-muted text-dim hover:text-text'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Tag Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-dim uppercase tracking-wide">Tag:</span>
            <div className="flex gap-2">
              {(['All', 'Keep', 'Watch', 'Sell'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setTagFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${
                    tagFilter === f
                      ? 'bg-green text-app-bg'
                      : 'bg-muted text-dim hover:text-text'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filter Pills */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-dim">Active filters:</span>
            {batchFilter !== 'All' && (
              <button
                onClick={() => setBatchFilter('All')}
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted text-text text-[11px] font-semibold hover:bg-stroke transition-colors"
              >
                Batch: {batchFilter}
                <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
              </button>
            )}
            {tagFilter !== 'All' && (
              <button
                onClick={() => setTagFilter('All')}
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted text-text text-[11px] font-semibold hover:bg-stroke transition-colors"
              >
                Tag: {tagFilter}
                <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
              </button>
            )}
            <button
              onClick={clearAllFilters}
              className="text-[11px] text-dim hover:text-text underline transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stroke">
              <SortableTableHeader label="Tag" sortKey="tag" currentSort={sortConfig} onSort={handleSort} align="left" />
              <SortableTableHeader label="Batch" sortKey="batch" currentSort={sortConfig} onSort={handleSort} align="left" />
              <SortableTableHeader label="Player" sortKey="player" currentSort={sortConfig} onSort={handleSort} align="left" />
              <SortableTableHeader label="Shares" sortKey="shares" currentSort={sortConfig} onSort={handleSort} align="right" />
              <SortableTableHeader label="Avg Cost" sortKey="avgCost" currentSort={sortConfig} onSort={handleSort} align="right" />
              <SortableTableHeader label="Price" sortKey="price" currentSort={sortConfig} onSort={handleSort} align="right" />
              <SortableTableHeader label="Value" sortKey="currentValue" currentSort={sortConfig} onSort={handleSort} align="right" />
              <SortableTableHeader label="Realised P&L" sortKey="realisedPnL" currentSort={sortConfig} onSort={handleSort} align="right" />
              <SortableTableHeader label="Unrealised P&L" sortKey="unrealisedPnL" currentSort={sortConfig} onSort={handleSort} align="right" />
              <SortableTableHeader label="ROI" sortKey="roi" currentSort={sortConfig} onSort={handleSort} align="right" />
              <th className="pb-3 text-right text-[12px] text-dim uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((pos, idx) => {
              const initials = getPlayerInitials(pos.player);
              const isPositiveUnrealised = (pos.unrealisedPnL || 0) >= 0;
              const isPositiveRealised = (pos.realisedPnL || 0) >= 0;
              const isPositiveROI = (pos.roi || 0) >= 0;
              const isMenuOpen = openMenuIdx === idx;

              return (
                <tr
                  key={idx}
                  className="border-b border-stroke/50 hover:bg-muted/20 transition-colors"
                >
                  <td className="py-4">
                    <TagPill tag={pos.tag} />
                  </td>
                  <td className="py-4">
                    <BatchPill batch={pos.batch} />
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-[11px] text-text font-semibold">
                        {initials}
                      </div>
                      <span className="text-[14px] text-text">{pos.player}</span>
                    </div>
                  </td>
                  <td className="py-4 text-right text-[14px] text-text">
                    {pos.shares.toLocaleString()}
                  </td>
                  <td className="py-4 text-right text-[14px] text-text">
                    ${pos.avgCost.toFixed(4)}
                  </td>
                  <td className="py-4 text-right text-[14px] text-text">
                    ${pos.price.toFixed(4)}
                  </td>
                  <td className="py-4 text-right text-[14px] text-text font-semibold">
                    {formatCurrency(pos.currentValue || 0)}
                  </td>
                  <td className={`py-4 text-right text-[14px] ${isPositiveRealised ? 'text-green' : 'text-red'}`}>
                    {formatCurrency(pos.realisedPnL || 0)}
                  </td>
                  <td className={`py-4 text-right text-[14px] ${isPositiveUnrealised ? 'text-green' : 'text-red'}`}>
                    {formatCurrency(pos.unrealisedPnL || 0)}
                  </td>
                  <td className={`py-4 text-right text-[14px] ${isPositiveROI ? 'text-green' : 'text-red'}`}>
                    {formatPercentage(pos.roi || 0)}
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2 justify-end items-center relative">
                      <button
                        onClick={() => setActionModal({ open: true, player: pos.player, action: 'buy' })}
                        className="px-3 py-1 rounded-full bg-green text-app-bg text-[12px] font-semibold hover:opacity-90 transition-opacity"
                      >
                        Buy
                      </button>
                      <button
                        onClick={() => setActionModal({ open: true, player: pos.player, action: 'sell' })}
                        className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-opacity ${
                          pos.shares > 0
                            ? 'bg-muted text-text hover:opacity-90'
                            : 'bg-muted/50 text-dim cursor-not-allowed opacity-50'
                        }`}
                        disabled={pos.shares === 0}
                      >
                        Sell
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuIdx(isMenuOpen ? null : idx)}
                          className="p-1 rounded hover:bg-muted transition-colors"
                        >
                          <FontAwesomeIcon icon={faEllipsisV} className="h-5 w-5" />
                        </button>
                        {isMenuOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenMenuIdx(null)}
                            />
                            <div className="absolute right-0 top-8 z-20 w-40 rounded-lg bg-card border border-stroke shadow-card py-1">
                              <button
                                onClick={() => {
                                  updatePositionBatch(pos.player, 'Batch 1');
                                  setOpenMenuIdx(null);
                                }}
                                className="w-full px-3 py-2 text-left text-[12px] text-text hover:bg-muted transition-colors"
                              >
                                Move to Batch 1
                              </button>
                              <button
                                onClick={() => {
                                  updatePositionBatch(pos.player, 'Batch 2');
                                  setOpenMenuIdx(null);
                                }}
                                className="w-full px-3 py-2 text-left text-[12px] text-text hover:bg-muted transition-colors"
                              >
                                Move to Batch 2
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {actionModal && (
        <ActionModal
          player={actionModal.player}
          action={actionModal.action}
          onClose={() => setActionModal(null)}
        />
      )}
    </div>
  );
}