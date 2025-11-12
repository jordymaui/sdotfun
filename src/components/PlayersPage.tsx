import React, { useState } from 'react';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { formatCurrency, getPlayerInitials } from '../utils/calculations';
import { TagPill } from './TagPill';
import { SortableTableHeader } from './SortableTableHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';

export function PlayersPage() {
  const {
    getFilteredPlayers,
    releaseBatchFilter,
    setReleaseBatchFilter,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    showOnlyOwned,
    setShowOnlyOwned,
    updatePlayer,
  } = usePortfolioStore();

  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  let players = getFilteredPlayers();
  
  // Apply sorting
  if (sortConfig) {
    players = [...players].sort((a, b) => {
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
  
  const hasActiveFilters = releaseBatchFilter !== 'All' || statusFilter !== 'All' || searchQuery !== '' || !showOnlyOwned;

  const clearAllFilters = () => {
    setReleaseBatchFilter('All');
    setStatusFilter('All');
    setSearchQuery('');
    setShowOnlyOwned(false);
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
    <div className="space-y-6">
      {/* Batch Legend */}
      <div className="rounded-xl bg-card p-4 border border-stroke">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-[12px] text-dim uppercase tracking-wide">Batch Filters:</span>
          {[1, 2, 3].map(batch => (
            <div key={batch} className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-stroke text-[11px] font-semibold text-text">
                Batch {batch}
              </span>
              <span className="text-[12px] text-dim">
                {usePortfolioStore.getState().players.filter(p => p.release_batch === batch).length} players
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl bg-card p-6 border border-stroke shadow-card">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dim" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search players by name..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border border-stroke text-text placeholder:text-dim text-[14px] focus:outline-none focus:border-green"
            />
          </div>

          {/* Filter Row */}
          <div className="flex gap-4 items-center flex-wrap">
            {/* Ownership Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyOwned}
                onChange={(e) => setShowOnlyOwned(e.target.checked)}
                className="h-4 w-4 rounded border-stroke bg-muted checked:bg-green"
              />
              <span className="text-[12px] text-text font-semibold">Show only owned</span>
            </label>

            {/* Batch Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-dim uppercase tracking-wide">Batch:</span>
              <div className="flex gap-2">
                {(['All', 1, 2, 3] as const).map((batch) => (
                  <button
                    key={batch}
                    onClick={() => setReleaseBatchFilter(batch)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${
                      releaseBatchFilter === batch
                        ? 'bg-green text-app-bg'
                        : 'bg-muted text-dim hover:text-text'
                    }`}
                  >
                    {batch === 'All' ? 'All' : batch}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-dim uppercase tracking-wide">Status:</span>
              <div className="flex gap-2">
                {(['All', 'Keep', 'Watch', 'Sell'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${
                      statusFilter === status
                        ? 'bg-green text-app-bg'
                        : 'bg-muted text-dim hover:text-text'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Filters Pills */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-dim">Active filters:</span>
              {releaseBatchFilter !== 'All' && (
                <button
                  onClick={() => setReleaseBatchFilter('All')}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted text-text text-[11px] font-semibold hover:bg-stroke transition-colors"
                >
                  Batch: {releaseBatchFilter}
                  <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
                </button>
              )}
              {statusFilter !== 'All' && (
                <button
                  onClick={() => setStatusFilter('All')}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted text-text text-[11px] font-semibold hover:bg-stroke transition-colors"
                >
                  Status: {statusFilter}
                  <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
                </button>
              )}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted text-text text-[11px] font-semibold hover:bg-stroke transition-colors"
                >
                  Search: {searchQuery}
                  <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
                </button>
              )}
              {!showOnlyOwned && (
                <button
                  onClick={() => setShowOnlyOwned(true)}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted text-text text-[11px] font-semibold hover:bg-stroke transition-colors"
                >
                  Showing all players
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
      </div>

      {/* Players Table */}
      <div className="rounded-xl bg-card p-6 border border-stroke shadow-card">
        <h3 className="text-[18px] font-semibold text-text mb-6">
          All Players ({players.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stroke">
                <SortableTableHeader label="Player" sortKey="name" currentSort={sortConfig} onSort={handleSort} align="left" />
                <SortableTableHeader label="Pack" sortKey="pack_batch" currentSort={sortConfig} onSort={handleSort} align="center" />
                <SortableTableHeader label="Release Batch" sortKey="release_batch" currentSort={sortConfig} onSort={handleSort} align="center" />
                <SortableTableHeader label="Shares" sortKey="shares_owned" currentSort={sortConfig} onSort={handleSort} align="right" />
                <SortableTableHeader label="Avg Cost" sortKey="avg_cost" currentSort={sortConfig} onSort={handleSort} align="right" />
                <SortableTableHeader label="Price" sortKey="latest_price" currentSort={sortConfig} onSort={handleSort} align="right" />
                <SortableTableHeader label="Unrealised P&L" sortKey="unrealised_pnl" currentSort={sortConfig} onSort={handleSort} align="right" />
                <SortableTableHeader label="Status" sortKey="status_tag" currentSort={sortConfig} onSort={handleSort} align="center" />
                <th className="pb-3 text-left text-[12px] text-dim uppercase tracking-wide">Notes</th>
              </tr>
            </thead>
            <tbody>
              {players.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-dim">No players match the current filters.</span>
                      <button
                        onClick={clearAllFilters}
                        className="px-4 py-2 rounded-lg bg-green text-app-bg text-[12px] font-semibold hover:opacity-90 transition-opacity"
                      >
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                players.map((player, idx) => {
                  const isPositivePnL = player.unrealised_pnl >= 0;
                  
                  return (
                    <tr key={idx} className="border-b border-stroke/50 hover:bg-muted/20 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-[11px] text-text font-semibold">
                            {getPlayerInitials(player.name)}
                          </div>
                          <span className="text-[14px] text-text">{player.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-center text-[14px] text-dim">
                        {player.pack_batch}
                      </td>
                      <td className="py-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-stroke text-[11px] font-semibold text-text">
                          {player.release_batch}
                        </span>
                      </td>
                      <td className="py-4 text-right text-[14px] text-text">
                        {player.shares_owned > 0 ? player.shares_owned.toLocaleString() : '-'}
                      </td>
                      <td className="py-4 text-right text-[14px] text-text">
                        {player.avg_cost > 0 ? `$${player.avg_cost.toFixed(4)}` : '-'}
                      </td>
                      <td className="py-4 text-right text-[14px] text-text">
                        {player.latest_price > 0 ? `$${player.latest_price.toFixed(4)}` : '-'}
                      </td>
                      <td className={`py-4 text-right text-[14px] ${isPositivePnL ? 'text-green' : player.unrealised_pnl < 0 ? 'text-red' : 'text-dim'}`}>
                        {player.shares_owned > 0 ? formatCurrency(player.unrealised_pnl) : '-'}
                      </td>
                      <td className="py-4 text-center">
                        {editingTag === player.name ? (
                          <select
                            value={player.status_tag}
                            onChange={(e) => {
                              updatePlayer(player.name, { status_tag: e.target.value as any });
                              setEditingTag(null);
                            }}
                            onBlur={() => setEditingTag(null)}
                            autoFocus
                            className="px-2 py-1 rounded bg-muted border border-stroke text-[12px] text-text focus:outline-none focus:border-green"
                          >
                            <option value="Keep">Keep</option>
                            <option value="Watch">Watch</option>
                            <option value="Sell">Sell</option>
                          </select>
                        ) : (
                          <button onClick={() => setEditingTag(player.name)}>
                            <TagPill tag={player.status_tag} />
                          </button>
                        )}
                      </td>
                      <td className="py-4">
                        {editingNotes === player.name ? (
                          <input
                            type="text"
                            value={player.notes}
                            onChange={(e) => updatePlayer(player.name, { notes: e.target.value })}
                            onBlur={() => setEditingNotes(null)}
                            onKeyDown={(e) => e.key === 'Enter' && setEditingNotes(null)}
                            autoFocus
                            className="w-full px-2 py-1 rounded bg-muted border border-stroke text-[12px] text-text focus:outline-none focus:border-green"
                          />
                        ) : (
                          <button
                            onClick={() => setEditingNotes(player.name)}
                            className="text-[12px] text-dim hover:text-text transition-colors text-left w-full"
                          >
                            {player.notes || 'Add note...'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}