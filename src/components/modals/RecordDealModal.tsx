"use client";

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';

interface RecordDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPropertyId?: string;
  defaultAgentId?: string;
}

export function RecordDealModal({
  isOpen,
  onClose,
  defaultPropertyId,
  defaultAgentId
}: RecordDealModalProps) {
  const { properties, agents, customers, addClosedDeal } = useAppStore();

  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [salePrice, setSalePrice] = useState(0);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [selectedBuyerName, setSelectedBuyerName] = useState('');
  const [commissionRate, setCommissionRate] = useState(3.0);
  const [splitRate, setSplitRate] = useState(80); // Default 80% to Agent, 20% to Broker
  const [isDoubleEnded, setIsDoubleEnded] = useState(false);
  const [closeDate, setCloseDate] = useState('');
  const [dealStatus, setDealStatus] = useState<'Paid' | 'Processing' | 'Pending'>('Paid');
  const [errorMessage, setErrorMessage] = useState('');

  // Sync defaults when modal opens or defaults change
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const propId = defaultPropertyId || (properties.length > 0 ? properties[0].id : '');
        setSelectedPropertyId(propId);
        
        const agentId = defaultAgentId || (agents.length > 0 ? agents[0].id : '');
        setSelectedAgentId(agentId);

        if (customers.length > 0) {
          setSelectedBuyerName(customers[0].name);
        }

        // Default close date to today
        const today = new Date().toISOString().split('T')[0];
        setCloseDate(today);

        // Pre-fill price from selected property
        const matchedProp = properties.find(p => p.id === propId);
        if (matchedProp) {
          // If it's a rental, price might be lower, but we support standard sales
          setSalePrice(matchedProp.price * 10); // scale up rent mock price for realistic deal volume, or use list price
        }
        
        setErrorMessage('');
        setIsDoubleEnded(false);
        setCommissionRate(3.0);
        setSplitRate(80);
      }, 0);
    }
  }, [isOpen, defaultPropertyId, defaultAgentId, properties, agents, customers]);

  // Adjust sale price when property selection changes
  const handlePropertyChange = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    const matchedProp = properties.find(p => p.id === propertyId);
    if (matchedProp) {
      setSalePrice(matchedProp.price * 10); // Scale up mock price if it's small (e.g. rent) to look realistic
    }
  };

  // Adjust values based on Double-Ended transaction type has been moved directly to the checkbox handler to avoid side-effects.

  if (!isOpen) return null;

  const grossCommission = Math.round((salePrice * commissionRate) / 100);
  const agentPayout = Math.round((grossCommission * splitRate) / 100);
  const brokerCut = grossCommission - agentPayout;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPropertyId) {
      setErrorMessage('Please select a property.');
      return;
    }
    if (!selectedAgentId) {
      setErrorMessage('Please select a closing agent.');
      return;
    }
    if (!selectedBuyerName) {
      setErrorMessage('Please select a buyer client.');
      return;
    }
    if (salePrice <= 0) {
      setErrorMessage('Please enter a valid sale price.');
      return;
    }

    const matchedProp = properties.find(p => p.id === selectedPropertyId);
    const matchedAgent = agents.find(a => a.id === selectedAgentId);

    if (!matchedProp || !matchedAgent) {
      setErrorMessage('Internal error: property or agent not found.');
      return;
    }

    // Submit the transaction to the store
    addClosedDeal({
      propertyId: selectedPropertyId,
      propertyTitle: matchedProp.title,
      price: salePrice,
      agentId: selectedAgentId,
      agentName: matchedAgent.name,
      buyerName: selectedBuyerName,
      commissionRate,
      grossCommission,
      splitRatio: isDoubleEnded ? "100% Cap-Met" : `${splitRate}/${100 - splitRate} Split`,
      agentPayout,
      brokerCut,
      doubleEnded: isDoubleEnded,
      closeDate,
      status: dealStatus
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-card border border-border rounded-lg shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-muted/20 border-b border-border flex items-center justify-between">
          <div className="flex flex-col">
            <span className="bg-primary/10 text-primary text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-[4px] tracking-wider self-start">
              B2B SaaS Portal
            </span>
            <h3 className="text-[16px] font-bold text-foreground mt-1.5 flex items-center gap-1.5">
              <i className="ri-exchange-dollar-line text-[20px] text-primary" />
              Record Sold Deal & Commission Split
            </h3>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="h-8 w-8 rounded-full bg-muted/40 hover:bg-muted text-muted-foreground flex items-center justify-center transition-all"
          >
            <i className="ri-close-line text-[18px]" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 bg-danger/10 border border-danger/20 text-danger text-[12.5px] font-semibold rounded-[5px]">
              {errorMessage}
            </div>
          )}

          {/* Property Select */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              Property Listing
            </label>
            <select
              value={selectedPropertyId}
              onChange={(e) => handlePropertyChange(e.target.value)}
              className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors font-medium cursor-pointer"
            >
              {properties.map(p => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.id}) - {p.status}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Sale Price */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                Final Sale Price ($)
              </label>
              <input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(Math.max(0, Number(e.target.value)))}
                className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors font-semibold"
                required
              />
            </div>

            {/* Double-Ended Checkbox */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                Double-Ended Deal?
              </label>
              <label className="flex items-center gap-2 border border-border bg-card hover:bg-muted/10 transition-colors rounded-[5px] px-3 py-2 cursor-pointer h-[38px]">
                <input
                  type="checkbox"
                  checked={isDoubleEnded}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setIsDoubleEnded(checked);
                    setCommissionRate(checked ? 6.0 : 3.0);
                  }}
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4 bg-muted/20"
                />
                <span className="text-[12.5px] font-semibold text-foreground">Double-Ended</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Agent Select */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                Closing Agent
              </label>
              <select
                value={selectedAgentId}
                onChange={(e) => setSelectedAgentId(e.target.value)}
                className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors font-medium cursor-pointer"
              >
                {agents.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Buyer Select */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                Buyer Customer
              </label>
              <select
                value={selectedBuyerName}
                onChange={(e) => setSelectedBuyerName(e.target.value)}
                className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors font-medium cursor-pointer"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Commission Rate */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                Commission Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                disabled={isDoubleEnded}
                value={commissionRate}
                onChange={(e) => setCommissionRate(Math.max(0, Number(e.target.value)))}
                className="w-full text-[13px] border border-border bg-card disabled:bg-muted/40 text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors font-semibold"
                required
              />
            </div>

            {/* Date Closed */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                Closing Date
              </label>
              <input
                type="date"
                value={closeDate}
                onChange={(e) => setCloseDate(e.target.value)}
                className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors font-semibold cursor-pointer"
                required
              />
            </div>
          </div>

          {/* Splits slider */}
          <div className="space-y-2 pt-2 border-t border-dashed border-border">
            <div className="flex justify-between items-center text-[11px] font-bold text-muted-foreground uppercase">
              <span>Commission Split Tier</span>
              <span className="text-primary font-bold">{splitRate}% Agent / {100 - splitRate}% Broker</span>
            </div>
            
            <div className="flex gap-2">
              {[50, 70, 80, 90].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setSplitRate(preset)}
                  className={`flex-1 py-1 rounded text-[11px] font-bold border transition-colors ${
                    splitRate === preset
                      ? "bg-primary text-white border-primary"
                      : "bg-card text-muted-foreground border-border hover:bg-muted/40"
                  }`}
                >
                  {preset}/{100 - preset}
                </button>
              ))}
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={splitRate}
              onChange={(e) => setSplitRate(Number(e.target.value))}
              className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary mt-2"
            />
          </div>

          {/* Deal Status & Calculations summary */}
          <div className="p-4 bg-muted/10 border border-border rounded-[8px] space-y-3">
            <div className="flex justify-between items-center text-[12.5px] font-medium text-muted-foreground">
              <span className="font-bold text-foreground">Compensation Payout Summary</span>
              <div className="flex items-center gap-1.5">
                {['Paid', 'Processing', 'Pending'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setDealStatus(st as 'Paid' | 'Processing' | 'Pending')}
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase transition-colors ${
                      dealStatus === st
                        ? st === 'Paid'
                          ? 'bg-success text-white'
                          : st === 'Processing'
                          ? 'bg-warning text-white'
                          : 'bg-slate-500 text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted-foreground/15'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 text-[13px] font-medium text-muted-foreground pt-1.5 border-t border-border/80">
              <div className="flex justify-between">
                <span>Gross Commission ({commissionRate}%):</span>
                <span className="font-bold text-foreground">${grossCommission.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-success block" /> Agent Share ({splitRate}%):
                </span>
                <span className="font-bold text-success">${agentPayout.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-primary block" /> Brokerage Share ({100 - splitRate}%):
                </span>
                <span className="font-bold text-primary">${brokerCut.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer action buttons */}
          <div className="pt-4 border-t border-border flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-border text-muted-foreground hover:bg-muted font-bold py-2 rounded-[5px] text-[13.5px] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#0acf97] hover:bg-[#0acf97]/90 text-white font-bold py-2 rounded-[5px] text-[13.5px] transition-colors flex items-center justify-center gap-1 shadow-md"
            >
              <i className="ri-check-line" /> Log Closed Deal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
