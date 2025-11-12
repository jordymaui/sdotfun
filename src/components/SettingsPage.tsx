import React, { useState } from 'react';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faUpload, faRotate, faEyeSlash, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'sonner';

export function SettingsPage() {
  const {
    settings,
    updateSettings,
    importPlayers,
    resetShares,
    hideZeroShares,
    setHideZeroShares,
  } = usePortfolioStore();

  const [csvInput, setCsvInput] = useState('');
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSaveSettings = () => {
    updateSettings(localSettings);
    toast.success('Settings saved successfully');
  };

  const handleImportCSV = () => {
    if (!csvInput.trim()) {
      toast.error('Please paste CSV data');
      return;
    }

    try {
      importPlayers(csvInput);
      toast.success('Players imported successfully');
      setCsvInput('');
    } catch (error) {
      toast.error('Error importing CSV. Please check the format.');
      console.error('CSV Import Error:', error);
    }
  };

  const handleResetShares = () => {
    if (window.confirm('Are you sure you want to reset all shares to zero? This cannot be undone.')) {
      resetShares();
      toast.success('All shares reset to zero');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Row: General Settings + Display Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="rounded-xl bg-card p-6 border border-stroke shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <FontAwesomeIcon icon={faDollarSign} className="h-5 w-5 text-green" />
            <h3 className="text-[18px] font-semibold text-text">Financial Settings</h3>
          </div>

          <div className="space-y-4">
            {/* Deposit Total */}
            <div>
              <label className="block text-[12px] text-dim uppercase tracking-wide mb-2">
                Total Deposited (USD)
              </label>
              <input
                type="number"
                value={localSettings.deposit_total}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, deposit_total: parseFloat(e.target.value) || 0 })
                }
                min="0"
                step="0.01"
                className="w-full px-4 py-2 rounded-lg bg-muted border border-stroke text-text text-[14px] focus:outline-none focus:border-green"
              />
            </div>

            {/* Cash Balance */}
            <div>
              <label className="block text-[12px] text-dim uppercase tracking-wide mb-2">
                Cash Balance (USD)
              </label>
              <input
                type="number"
                value={localSettings.cash_balance}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, cash_balance: parseFloat(e.target.value) || 0 })
                }
                min="0"
                step="0.01"
                className="w-full px-4 py-2 rounded-lg bg-muted border border-stroke text-text text-[14px] focus:outline-none focus:border-green"
              />
              <p className="text-[11px] text-dim mt-1.5">
                Free cash not invested in shares
              </p>
            </div>

            {/* Withdrawn Total */}
            <div>
              <label className="block text-[12px] text-dim uppercase tracking-wide mb-2">
                Total Withdrawn (USD)
              </label>
              <input
                type="number"
                value={localSettings.withdrawn_total}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, withdrawn_total: parseFloat(e.target.value) || 0 })
                }
                min="0"
                step="0.01"
                className="w-full px-4 py-2 rounded-lg bg-muted border border-stroke text-text text-[14px] focus:outline-none focus:border-green"
              />
            </div>

            {/* Base Currency */}
            <div>
              <label className="block text-[12px] text-dim uppercase tracking-wide mb-2">
                Base Currency
              </label>
              <input
                type="text"
                value={localSettings.base_currency}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, base_currency: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-muted border border-stroke text-text text-[14px] focus:outline-none focus:border-green"
              />
            </div>

            <button
              onClick={handleSaveSettings}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-green text-app-bg font-semibold hover:opacity-90 transition-opacity"
            >
              <FontAwesomeIcon icon={faCog} className="h-4 w-4" />
              Save Settings
            </button>
          </div>
        </div>

        {/* Display Options */}
        <div className="rounded-xl bg-card p-6 border border-stroke shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <FontAwesomeIcon icon={faEyeSlash} className="h-5 w-5 text-green" />
            <h3 className="text-[18px] font-semibold text-text">Display Options</h3>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg bg-muted/50 border border-stroke hover:border-green/50 transition-colors">
              <input
                type="checkbox"
                checked={hideZeroShares}
                onChange={(e) => setHideZeroShares(e.target.checked)}
                className="h-5 w-5 rounded border-stroke bg-muted checked:bg-green"
              />
              <div className="flex-1">
                <div className="text-[14px] text-text font-semibold">Hide players with zero shares</div>
                <div className="text-[12px] text-dim mt-1">
                  When enabled, players with no shares will be hidden from the Players table and Overview
                </div>
              </div>
            </label>

            {/* Info Box */}
            <div className="p-4 rounded-lg bg-muted/30 border border-stroke">
              <h4 className="text-[13px] font-semibold text-text mb-2">About Your Data</h4>
              <div className="space-y-1.5 text-[11px] text-dim">
                <p>• All data is stored locally in your browser</p>
                <p>• No data is sent to external servers</p>
                <p>• Clear your browser data to reset everything</p>
                <p>• Export your trades regularly as backup</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Data Import + Danger Zone */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Import */}
        <div className="rounded-xl bg-card p-6 border border-stroke shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <FontAwesomeIcon icon={faUpload} className="h-5 w-5 text-green" />
            <h3 className="text-[18px] font-semibold text-text">Data Import</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[12px] text-dim uppercase tracking-wide mb-2">
                Paste CSV Data
              </label>
              <p className="text-[11px] text-dim mb-3">
                Format: name,pack_batch,release_batch,shares_owned,avg_cost,latest_price,status_tag,notes
              </p>
              <textarea
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
                placeholder="name,pack_batch,release_batch,shares_owned,avg_cost,latest_price,status_tag,notes
J.Jefferson,1,1,2500,0.0125,0.0125,Keep,
J.Chase,1,3,2000,0.0125,0.0125,Keep,"
                rows={10}
                className="w-full px-4 py-3 rounded-lg bg-muted border border-stroke text-text placeholder:text-dim font-mono text-[11px] focus:outline-none focus:border-green resize-none"
              />
            </div>

            <button
              onClick={handleImportCSV}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-green text-app-bg font-semibold hover:opacity-90 transition-opacity"
            >
              <FontAwesomeIcon icon={faUpload} className="h-4 w-4" />
              Import CSV
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-xl bg-card p-6 border border-red/50 shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <FontAwesomeIcon icon={faRotate} className="h-5 w-5 text-red" />
            <h3 className="text-[18px] font-semibold text-red">Danger Zone</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-red/10 border border-red/30">
              <div className="text-[14px] text-text font-semibold mb-2">Reset All Shares</div>
              <div className="text-[12px] text-dim mb-4">
                This will set all shares_owned and avg_cost to 0 for all players. This action cannot be undone.
              </div>
              <button
                onClick={handleResetShares}
                className="w-full px-4 py-2 rounded-lg bg-red text-app-bg text-[13px] font-semibold hover:opacity-90 transition-opacity"
              >
                Reset All Shares to Zero
              </button>
            </div>

            {/* Additional warning info */}
            <div className="p-4 rounded-lg bg-muted/30 border border-stroke">
              <div className="text-[12px] text-dim space-y-2">
                <p className="flex items-start gap-2">
                  <span className="text-red">⚠️</span>
                  <span>Before resetting, consider exporting your trade history for backup.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-red">⚠️</span>
                  <span>This action will not affect your trade history, only current holdings.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}