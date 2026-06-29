"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/store/useToastStore";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { exportToCSV } from "@/lib/exportUtils";
import { 
  FileText, 
  Calendar, 
  Filter, 
  Download, 
  Printer, 
  Mail, 
  Clock, 
  ChevronRight, 
  Percent, 
  User, 
  Home, 
  Loader2,
  CheckCircle,
  TrendingUp,
  Settings,
  DollarSign
} from "lucide-react";

type ReportType = 'commissions' | 'sales_rank' | 'portfolio';

interface ScheduleConfig {
  id: string;
  reportType: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  emails: string;
  format: 'PDF' | 'CSV';
  active: boolean;
}

export default function ReportsPage() {
  const {
    properties,
    agents,
    closedDeals,
    commissionPlans,
  } = useAppStore();

  // Filter Configurations
  const [reportType, setReportType] = useState<ReportType>('commissions');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-12-31');
  const [selectedAgentId, setSelectedAgentId] = useState('all');
  const [propertyType, setPropertyType] = useState('all');

  // Loading state for generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationTrigger, setGenerationTrigger] = useState(0); // to trigger animation

  // Export progress overlay state
  const [exportProgress, setExportProgress] = useState<'idle' | 'generating' | 'success'>('idle');
  const [exportProgressText, setExportProgressText] = useState('');
  const [downloadFileName, setDownloadFileName] = useState('');

  // Scheduled Reports state
  const [schedules, setSchedules] = useState<ScheduleConfig[]>([
    {
      id: "SCH-001",
      reportType: "Monthly Commission Summary",
      frequency: "Monthly",
      emails: "brokerage.compliance@waveron.com",
      format: "PDF",
      active: true
    },
    {
      id: "SCH-002",
      reportType: "Agent Sales Performance Rank",
      frequency: "Weekly",
      emails: "sales-leads@waveron.com",
      format: "CSV",
      active: false
    }
  ]);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [schedFreq, setSchedFreq] = useState<'Daily' | 'Weekly' | 'Monthly'>('Weekly');
  const [schedType, setSchedType] = useState('Monthly Commission Summary');
  const [schedEmails, setSchedEmails] = useState('');
  const [schedFormat, setSchedFormat] = useState<'PDF' | 'CSV'>('PDF');

  // Generate action
  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerationTrigger(prev => prev + 1);
      toast.success(`${getReportLabel(reportType)} generated with active parameters.`);
    }, 800);
  };

  const getReportLabel = (type: ReportType) => {
    if (type === 'commissions') return "Monthly Commission Summary";
    if (type === 'sales_rank') return "Agent Sales Performance Rank";
    return "Portfolio Listing Valuation";
  };

  // Filter and compute data based on settings
  const reportData = useMemo(() => {
    // Force dependency on generationTrigger to simulate rebuilds
    const _ = generationTrigger;

    const startMs = startDate ? new Date(startDate).getTime() : 0;
    const endMs = endDate ? new Date(endDate).getTime() : Infinity;

    if (reportType === 'commissions') {
      const filteredDeals = closedDeals.filter(deal => {
        const dealTime = new Date(deal.closeDate).getTime();
        const matchesDate = dealTime >= startMs && dealTime <= endMs;
        const matchesAgent = selectedAgentId === 'all' || deal.agentId === selectedAgentId;
        return matchesDate && matchesAgent;
      });

      const totalGross = filteredDeals.reduce((sum, d) => sum + d.grossCommission, 0);
      const totalAgentPayout = filteredDeals.reduce((sum, d) => sum + d.agentPayout, 0);
      const totalBrokerCut = filteredDeals.reduce((sum, d) => sum + d.brokerCut, 0);
      const totalVolume = filteredDeals.reduce((sum, d) => sum + d.price, 0);

      return {
        deals: filteredDeals,
        totalGross,
        totalAgentPayout,
        totalBrokerCut,
        totalVolume,
        count: filteredDeals.length
      };
    }

    if (reportType === 'sales_rank') {
      // Aggregate volume and deals by agent
      const rank = agents.map(agent => {
        const agentDeals = closedDeals.filter(d => {
          const dealTime = new Date(d.closeDate).getTime();
          const matchesDate = dealTime >= startMs && dealTime <= endMs;
          return d.agentId === agent.id && matchesDate;
        });

        const salesVolume = agentDeals.reduce((sum, d) => sum + d.price, 0);
        const brokerPaid = agentDeals.reduce((sum, d) => sum + d.brokerCut, 0);
        const agentEarned = agentDeals.reduce((sum, d) => sum + d.agentPayout, 0);

        return {
          id: agent.id,
          name: agent.name,
          avatar: agent.avatar,
          dealsCount: agentDeals.length,
          salesVolume,
          brokerPaid,
          agentEarned,
          rating: agent.rating
        };
      }).sort((a, b) => b.salesVolume - a.salesVolume);

      return {
        rankings: rank
      };
    }

    // portfolio valuation
    const filteredProps = properties.filter(prop => {
      const matchesType = propertyType === 'all' || prop.type.toLowerCase().includes(propertyType.toLowerCase());
      return matchesType;
    });

    const totalValuation = filteredProps.reduce((sum, p) => sum + p.price * 10, 0); // Rent prices scaled
    const avgPrice = filteredProps.length > 0 ? Math.round(totalValuation / filteredProps.length) : 0;
    
    // Status breakdown
    const statusCounts = filteredProps.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      properties: filteredProps,
      totalValuation,
      avgPrice,
      statusCounts,
      count: filteredProps.length
    };
  }, [reportType, startDate, endDate, selectedAgentId, propertyType, generationTrigger, closedDeals, agents, properties]);

  // CSV Exporter
  const handleCSVExport = () => {
    const fileName = `${reportType}_report`;
    
    if (reportType === 'commissions') {
      const csvData = (reportData as any).deals.map((d: any) => ({
        id: d.id,
        propertyTitle: d.propertyTitle,
        price: d.price,
        agentName: d.agentName,
        buyerName: d.buyerName,
        grossCommission: d.grossCommission,
        splitRatio: d.splitRatio,
        agentPayout: d.agentPayout,
        brokerCut: d.brokerCut,
        closeDate: d.closeDate,
        status: d.status
      }));

      const headers = [
        { key: "id", label: "Deal ID" },
        { key: "propertyTitle", label: "Property Title" },
        { key: "price", label: "Sale Price" },
        { key: "agentName", label: "Agent Name" },
        { key: "buyerName", label: "Buyer Client" },
        { key: "grossCommission", label: "Gross Commission" },
        { key: "splitRatio", label: "Split Ratio" },
        { key: "agentPayout", label: "Agent Payout" },
        { key: "brokerCut", label: "Broker Cut" },
        { key: "closeDate", label: "Close Date" },
        { key: "status", label: "Status" }
      ] as any;
      
      exportToCSV(csvData, headers, fileName);
      toast.success("CSV file downloaded successfully.");
    } else if (reportType === 'sales_rank') {
      const csvData = (reportData as any).rankings.map((r: any, index: number) => ({
        rank: index + 1,
        id: r.id,
        name: r.name,
        dealsCount: r.dealsCount,
        salesVolume: r.salesVolume,
        agentEarned: r.agentEarned,
        brokerPaid: r.brokerPaid,
        rating: r.rating
      }));

      const headers = [
        { key: "rank", label: "Rank" },
        { key: "id", label: "Agent ID" },
        { key: "name", label: "Agent Name" },
        { key: "dealsCount", label: "Deals Closed" },
        { key: "salesVolume", label: "Gross Sales Volume" },
        { key: "agentEarned", label: "Agent Commission Payout" },
        { key: "brokerPaid", label: "Broker Cut Shared" },
        { key: "rating", label: "Agent Rating" }
      ] as any;

      exportToCSV(csvData, headers, fileName);
      toast.success("Agent Rankings CSV downloaded.");
    } else {
      // Portfolio
      const csvData = (reportData as any).properties.map((p: any) => ({
        id: p.id,
        title: p.title,
        type: p.type,
        beds: p.beds,
        baths: p.baths,
        price: p.price * 10,
        status: p.status
      }));

      const headers = [
        { key: "id", label: "Property ID" },
        { key: "title", label: "Title" },
        { key: "type", label: "Category/Type" },
        { key: "beds", label: "Beds" },
        { key: "baths", label: "Baths" },
        { key: "price", label: "Est. Price" },
        { key: "status", label: "Status" }
      ] as any;

      exportToCSV(csvData, headers, fileName);
      toast.success("Portfolio Valuation CSV downloaded.");
    }
  };

  // Simulated PDF Downloader
  const triggerPDFExport = () => {
    const filename = `${reportType}_compliance_report_${Math.floor(100 + Math.random() * 900)}.pdf`;
    setDownloadFileName(filename);
    setExportProgress('generating');
    setExportProgressText('Aggregating ledger data points...');

    setTimeout(() => {
      setExportProgressText('Applying print stylesheet layouts...');
    }, 600);

    setTimeout(() => {
      setExportProgressText('Generating cryptographic signature hash...');
    }, 1300);

    setTimeout(() => {
      setExportProgress('success');
      toast.success("PDF Compiled and Saved locally.");
    }, 2000);
  };

  // Add automated scheduler config
  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedEmails.trim()) {
      toast.error("Please enter destination emails.");
      return;
    }

    const newSched: ScheduleConfig = {
      id: `SCH-${Math.floor(100 + Math.random() * 900)}`,
      reportType: schedType,
      frequency: schedFreq,
      emails: schedEmails,
      format: schedFormat,
      active: true
    };

    setSchedules([...schedules, newSched]);
    setIsScheduleModalOpen(false);
    setSchedEmails('');
    toast.success(`Schedule configured: ${schedType} will be emailed ${schedFreq.toLowerCase()}.`);
  };

  // Toggle active status of schedules
  const toggleScheduleActive = (id: string) => {
    setSchedules(schedules.map(s => s.id === id ? { ...s, active: !s.active } : s));
    toast.success("Schedule delivery status toggled.");
  };

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Breadcrumb />
          <h1 className="text-[20px] font-bold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Advanced Report Builder & Exports
          </h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Design sales summaries, commission splits breakdowns, and configure automated email delivery schedules.
          </p>
        </div>

        <button
          onClick={() => setIsScheduleModalOpen(true)}
          className="text-[12.5px] font-bold px-3.5 py-2 border border-border rounded-[5px] flex items-center gap-1.5 bg-card hover:bg-muted/40 transition-colors text-foreground"
        >
          <Clock className="h-4 w-4 text-primary" /> Configure Scheduled Report
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Configuration Parameters (col-span-4) */}
        <div className="xl:col-span-4 col-span-12 space-y-6">
          <div className="bg-card border border-border rounded-xl p-5 shadow-[0_0_35px_rgba(154,161,171,0.04)]">
            <h3 className="text-[14.5px] font-bold text-foreground flex items-center gap-2 mb-4 pb-2.5 border-b border-border">
              <Filter className="h-4 w-4 text-primary" /> Report Parameters
            </h3>

            <div className="space-y-4">
              {/* Report Template Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                  Report Template Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as ReportType)}
                  className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors font-semibold cursor-pointer"
                >
                  <option value="commissions">Monthly Commission Summary</option>
                  <option value="sales_rank">Agent Sales Performance Rank</option>
                  <option value="portfolio">Portfolio Listing Valuation</option>
                </select>
              </div>

              {/* Date Filters: Show for commissions and rankings */}
              {reportType !== 'portfolio' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full text-[12.5px] border border-border bg-card text-foreground rounded-[5px] px-2.5 py-1.5 outline-none focus:border-primary font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full text-[12.5px] border border-border bg-card text-foreground rounded-[5px] px-2.5 py-1.5 outline-none focus:border-primary font-semibold"
                    />
                  </div>
                </div>
              )}

              {/* Dynamic Parameter Filter 1: Agent selector for commissions */}
              {reportType === 'commissions' && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                    Attributed Agent
                  </label>
                  <select
                    value={selectedAgentId}
                    onChange={(e) => setSelectedAgentId(e.target.value)}
                    className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors font-medium cursor-pointer"
                  >
                    <option value="all">All Registered Agents</option>
                    {agents.map(a => (
                      <option key={a.id} value={a.id}>{a.name} ({a.id})</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Dynamic Parameter Filter 2: Property category for portfolio */}
              {reportType === 'portfolio' && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                    Property Category Type
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors font-medium cursor-pointer"
                  >
                    <option value="all">All Property Styles</option>
                    <option value="Villa">Villa Homes</option>
                    <option value="Duplex">Duplex Duets</option>
                    <option value="Apartment">Apartment Units</option>
                    <option value="Penthouse">Luxury Penthouses</option>
                  </select>
                </div>
              )}

              {/* Build Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-2.5 rounded-[5px] text-[13px] shadow-sm transition-all flex items-center justify-center gap-1.5 mt-6"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" /> Compiling Data...
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4.5 w-4.5" /> Generate Active Preview
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Active schedules panel */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-[0_0_35px_rgba(154,161,171,0.04)]">
            <h3 className="text-[14px] font-bold text-foreground flex items-center gap-2 mb-3 pb-2.5 border-b border-border">
              <Clock className="h-4 w-4 text-primary" /> Active Delivery Schedules
            </h3>

            <div className="space-y-3.5">
              {schedules.map(sched => (
                <div key={sched.id} className="p-3 bg-muted/10 border border-border/80 rounded-[8px] flex items-start justify-between gap-3 text-[12.5px]">
                  <div className="space-y-1">
                    <span className={`text-[9.5px] font-extrabold uppercase px-1.5 py-0.2 rounded border ${
                      sched.frequency === 'Monthly' 
                        ? 'text-primary bg-primary/10 border-primary/20'
                        : 'text-success bg-soft-success border-success/20'
                    }`}>
                      {sched.frequency} ({sched.format})
                    </span>
                    <p className="font-bold text-foreground mt-1">{sched.reportType}</p>
                    <p className="text-[11px] text-muted-foreground truncate max-w-[180px]">{sched.emails}</p>
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer mt-1">
                    <input
                      type="checkbox"
                      checked={sched.active}
                      onChange={() => toggleScheduleActive(sched.id)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4.5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Report Preview (col-span-8) */}
        <div className="xl:col-span-8 col-span-12 space-y-6">
          <div className="bg-card border border-border rounded-xl shadow-[0_0_35px_rgba(154,161,171,0.05)] overflow-hidden">
            {/* Preview Header */}
            <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-muted/5">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-[14.5px] font-bold text-foreground">
                    Live Preview: {getReportLabel(reportType)}
                  </h3>
                  <span className="text-[11.5px] text-muted-foreground font-semibold">
                    Status: Generated & Verified
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCSVExport}
                  className="px-3 py-1.5 text-[12px] font-bold border border-border rounded-[5px] bg-card hover:bg-muted/40 transition-colors text-foreground flex items-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" /> CSV
                </button>
                <button
                  onClick={triggerPDFExport}
                  className="px-3 py-1.5 text-[12px] font-bold bg-primary hover:bg-primary/95 text-white rounded-[5px] transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="h-3.5 w-3.5" /> Compile PDF
                </button>
              </div>
            </div>

            {/* Preview Body */}
            <div className="p-6">
              {/* ── Report Type 1: Commission Summary ───────────────────── */}
              {reportType === 'commissions' && (
                <div className="space-y-6">
                  {/* Summary Metric cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-card border border-border rounded-xl p-4.5 shadow-sm flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider block">Gross Commissions</span>
                        <h4 className="text-[18px] font-black text-foreground mt-0.5">
                          ${(reportData as any).totalGross.toLocaleString()}
                        </h4>
                        <span className="text-[10px] text-muted-foreground">From {(reportData as any).count} closed transactions</span>
                      </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-4.5 shadow-sm flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider block">Agent Payouts</span>
                        <h4 className="text-[18px] font-black text-foreground mt-0.5">
                          ${(reportData as any).totalAgentPayout.toLocaleString()}
                        </h4>
                        <span className="text-[10px] text-muted-foreground">
                          {Math.round(((reportData as any).totalAgentPayout / ((reportData as any).totalGross || 1)) * 100)}% Effective Split
                        </span>
                      </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-4.5 shadow-sm flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-info/10 text-info flex items-center justify-center shrink-0">
                        <Percent className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider block">Broker Revenue</span>
                        <h4 className="text-[18px] font-black text-foreground mt-0.5">
                          ${(reportData as any).totalBrokerCut.toLocaleString()}
                        </h4>
                        <span className="text-[10px] text-muted-foreground">Retained by brokerage</span>
                      </div>
                    </div>
                  </div>

                  {/* SVG Chart Display */}
                  <div className="bg-card border border-border rounded-xl p-4.5 shadow-sm space-y-3">
                    <p className="text-[12px] font-bold text-foreground">Broker Cut vs Agent Payouts Share</p>
                    <div className="h-6 w-full rounded-full bg-muted flex overflow-hidden border border-border">
                      <div 
                        className="bg-success h-full transition-all duration-500" 
                        style={{ width: `${((reportData as any).totalAgentPayout / ((reportData as any).totalGross || 1)) * 100}%` }}
                        title="Agent payout"
                      />
                      <div 
                        className="bg-primary h-full transition-all duration-500" 
                        style={{ width: `${((reportData as any).totalBrokerCut / ((reportData as any).totalGross || 1)) * 100}%` }}
                        title="Broker cut"
                      />
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-muted-foreground font-semibold">
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success block" /> Agent share: ${ (reportData as any).totalAgentPayout.toLocaleString() }</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary block" /> Broker share: ${ (reportData as any).totalBrokerCut.toLocaleString() }</span>
                    </div>
                  </div>

                  {/* Deals table */}
                  <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse text-[12px]">
                      <thead>
                        <tr className="border-b border-border bg-muted/20 font-bold text-muted-foreground text-[10px] uppercase">
                          <th className="py-2.5 px-4">Deal ID</th>
                          <th className="py-2.5 px-3">Property</th>
                          <th className="py-2.5 px-3">Closing Agent</th>
                          <th className="py-2.5 px-3 text-right">Gross Comm</th>
                          <th className="py-2.5 px-3 text-right">Agent Split</th>
                          <th className="py-2.5 px-3 text-right">Broker Share</th>
                          <th className="py-2.5 px-4 text-center">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border font-medium">
                        {(reportData as any).deals.map((deal: any) => (
                          <tr key={deal.id} className="hover:bg-muted/5">
                            <td className="py-3 px-4 font-bold text-foreground">{deal.id}</td>
                            <td className="py-3 px-3 text-foreground truncate max-w-[130px]">{deal.propertyTitle}</td>
                            <td className="py-3 px-3 text-muted-foreground">{deal.agentName}</td>
                            <td className="py-3 px-3 text-right text-foreground font-bold">${deal.grossCommission.toLocaleString()}</td>
                            <td className="py-3 px-3 text-right text-success font-bold">${deal.agentPayout.toLocaleString()}</td>
                            <td className="py-3 px-3 text-right text-primary font-bold">${deal.brokerCut.toLocaleString()}</td>
                            <td className="py-3 px-4 text-center text-muted-foreground text-[11px]">{deal.closeDate}</td>
                          </tr>
                        ))}
                        {(reportData as any).deals.length === 0 && (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-muted-foreground italic">
                              No deals matches parameters inside this cycle period.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── Report Type 2: Agent Sales Rank ──────────────────────── */}
              {reportType === 'sales_rank' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Top Performer Ribbon */}
                    {(reportData as any).rankings.length > 0 && (
                      <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 flex items-center justify-between relative overflow-hidden">
                        <div className="space-y-1">
                          <span className="text-[10px] font-extrabold uppercase bg-primary text-white px-2 py-0.5 rounded-full">
                            Top Performer
                          </span>
                          <h4 className="text-[18px] font-black text-foreground mt-2">
                            {(reportData as any).rankings[0].name}
                          </h4>
                          <p className="text-[12.5px] text-muted-foreground">
                            Volume: <strong className="text-foreground">${(reportData as any).rankings[0].salesVolume.toLocaleString()}</strong> closed
                          </p>
                        </div>
                        <img 
                          src={(reportData as any).rankings[0].avatar} 
                          className="h-16 w-16 rounded-full object-cover border-2 border-primary/50 shadow" 
                          alt="" 
                        />
                      </div>
                    )}

                    {/* Quick Stats Summary */}
                    <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-center space-y-2">
                      <div className="flex justify-between items-center text-[12.5px]">
                        <span className="text-muted-foreground">Total Participating Agents:</span>
                        <span className="font-bold text-foreground">{agents.length}</span>
                      </div>
                      <div className="flex justify-between items-center text-[12.5px]">
                        <span className="text-muted-foreground">Total Collective Sales:</span>
                        <span className="font-bold text-foreground">
                          ${(reportData as any).rankings.reduce((sum: number, r: any) => sum + r.salesVolume, 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Horizontal visual chart bars */}
                  <div className="bg-card border border-border rounded-xl p-4.5 shadow-sm space-y-4">
                    <p className="text-[12.5px] font-bold text-foreground">Sales Volume Distribution Matrix</p>
                    
                    <div className="space-y-3">
                      {(reportData as any).rankings.slice(0, 5).map((r: any, idx: number) => {
                        const maxVol = Math.max(...(reportData as any).rankings.map((a: any) => a.salesVolume), 1);
                        const pct = (r.salesVolume / maxVol) * 100;

                        return (
                          <div key={r.id} className="space-y-1">
                            <div className="flex justify-between text-[11.5px] font-semibold">
                              <span className="text-foreground">{idx + 1}. {r.name}</span>
                              <span className="text-primary font-bold">${r.salesVolume.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden border border-border/10">
                              <div 
                                className="bg-primary h-full rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Rankings details table */}
                  <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse text-[12px]">
                      <thead>
                        <tr className="border-b border-border bg-muted/20 font-bold text-muted-foreground text-[10px] uppercase">
                          <th className="py-2.5 px-4 text-center w-[60px]">Rank</th>
                          <th className="py-2.5 px-3">Agent Profile</th>
                          <th className="py-2.5 px-3 text-center">Deals Closed</th>
                          <th className="py-2.5 px-3 text-right">Sales Volume</th>
                          <th className="py-2.5 px-3 text-right">Payout Shared</th>
                          <th className="py-2.5 px-4 text-right">Broker Cut</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border font-medium">
                        {(reportData as any).rankings.map((r: any, idx: number) => (
                          <tr key={r.id} className="hover:bg-muted/5">
                            <td className="py-3 px-4 text-center">
                              <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-extrabold mx-auto ${
                                idx === 0 
                                  ? 'bg-amber-400 text-white shadow'
                                  : idx === 1
                                  ? 'bg-slate-300 text-slate-800'
                                  : idx === 2
                                  ? 'bg-amber-600 text-white'
                                  : 'text-muted-foreground'
                              }`}>
                                {idx + 1}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <img src={r.avatar} className="h-7 w-7 rounded-full object-cover" alt="" />
                                <span className="font-bold text-foreground">{r.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-center text-foreground font-semibold">{r.dealsCount}</td>
                            <td className="py-3 px-3 text-right text-foreground font-extrabold">${r.salesVolume.toLocaleString()}</td>
                            <td className="py-3 px-3 text-right text-success font-bold">${r.agentEarned.toLocaleString()}</td>
                            <td className="py-3 px-4 text-right text-primary font-bold">${r.brokerPaid.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── Report Type 3: Portfolio Listing Valuation ──────────── */}
              {reportType === 'portfolio' && (
                <div className="space-y-6">
                  {/* Summary Metric cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-card border border-border rounded-xl p-4.5 shadow-sm flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Home className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider block">Total Active Listings</span>
                        <h4 className="text-[18px] font-black text-foreground mt-0.5">
                          {(reportData as any).count} Properties
                        </h4>
                        <span className="text-[10px] text-muted-foreground">In selected category</span>
                      </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-4.5 shadow-sm flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider block">Portfolio Value</span>
                        <h4 className="text-[18px] font-black text-foreground mt-0.5">
                          ${(reportData as any).totalValuation.toLocaleString()}
                        </h4>
                        <span className="text-[10px] text-muted-foreground">Cumulative valuation assets</span>
                      </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-4.5 shadow-sm flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-info/10 text-info flex items-center justify-center shrink-0">
                        <DollarSign className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider block">Average Price</span>
                        <h4 className="text-[18px] font-black text-foreground mt-0.5">
                          ${(reportData as any).avgPrice.toLocaleString()}
                        </h4>
                        <span className="text-[10px] text-muted-foreground">Per property list price</span>
                      </div>
                    </div>
                  </div>

                  {/* Status allocation graph */}
                  <div className="bg-card border border-border rounded-xl p-4.5 shadow-sm space-y-3">
                    <p className="text-[12px] font-bold text-foreground">Listing Distribution Status</p>
                    <div className="flex gap-1 h-3 rounded-full overflow-hidden w-full">
                      {Object.entries((reportData as any).statusCounts).map(([status, count]) => {
                        const pct = ((count as number) / (reportData as any).count) * 100;
                        const bgClass = status === 'Sold' 
                          ? 'bg-success' 
                          : status === 'Rent' 
                          ? 'bg-info' 
                          : 'bg-warning';
                        return (
                          <div 
                            key={status}
                            className={bgClass}
                            style={{ width: `${pct}%` }}
                            title={`${status}: ${count}`}
                          />
                        );
                      })}
                    </div>
                    <div className="flex flex-wrap gap-4 text-[11px] text-muted-foreground font-semibold">
                      {Object.entries((reportData as any).statusCounts).map(([status, count]) => (
                        <span key={status} className="flex items-center gap-1">
                          <span className={`h-2 w-2 rounded-full block ${
                            status === 'Sold' 
                              ? 'bg-success' 
                              : status === 'Rent' 
                              ? 'bg-info' 
                              : 'bg-warning'
                          }`} />
                          {status}: {count as number}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Property list */}
                  <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse text-[12px]">
                      <thead>
                        <tr className="border-b border-border bg-muted/20 font-bold text-muted-foreground text-[10px] uppercase">
                          <th className="py-2.5 px-4">ID</th>
                          <th className="py-2.5 px-3">Listing Title</th>
                          <th className="py-2.5 px-3">Type</th>
                          <th className="py-2.5 px-3 text-center">Beds/Baths</th>
                          <th className="py-2.5 px-3 text-right">List Price</th>
                          <th className="py-2.5 px-4 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border font-medium">
                        {(reportData as any).properties.map((prop: any) => (
                          <tr key={prop.id} className="hover:bg-muted/5">
                            <td className="py-3 px-4 font-bold text-foreground">{prop.id}</td>
                            <td className="py-3 px-3 text-foreground">{prop.title}</td>
                            <td className="py-3 px-3 text-muted-foreground">{prop.type}</td>
                            <td className="py-3 px-3 text-center text-muted-foreground">{prop.beds} Bds / {prop.baths} Ba</td>
                            <td className="py-3 px-3 text-right text-foreground font-bold">${(prop.price * 10).toLocaleString()}</td>
                            <td className="py-3 px-4 text-center">
                              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                                prop.status === 'Sold'
                                  ? 'text-success bg-soft-success border-success/20'
                                  : prop.status === 'Rent'
                                  ? 'text-info bg-soft-info border-info/20'
                                  : 'text-warning bg-soft-warning border-warning/20'
                              }`}>
                                {prop.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Scheduled Report Config Modal ─────────────────────────── */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/10">
              <h3 className="text-[16px] font-bold text-foreground flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" /> Configure Scheduled Report
              </h3>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="text-muted-foreground hover:text-foreground h-7 w-7 rounded-full hover:bg-muted flex items-center justify-center transition-colors text-[18px]"
              >
                <i className="ri-close-line" />
              </button>
            </div>

            <form onSubmit={handleAddSchedule}>
              <div className="p-5 space-y-4 text-[13px]">
                {/* Select Report Template */}
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider text-[11px]">
                    Report Type Template *
                  </label>
                  <select
                    value={schedType}
                    onChange={(e) => setSchedType(e.target.value)}
                    className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors font-medium cursor-pointer"
                  >
                    <option value="Monthly Commission Summary">Monthly Commission Summary</option>
                    <option value="Agent Sales Performance Rank">Agent Sales Performance Rank</option>
                    <option value="Portfolio Listing Valuation">Portfolio Listing Valuation</option>
                  </select>
                </div>

                {/* Grid for Frequency and Format */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground uppercase tracking-wider text-[11px]">
                      Delivery Frequency *
                    </label>
                    <select
                      value={schedFreq}
                      onChange={(e) => setSchedFreq(e.target.value as any)}
                      className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors cursor-pointer"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly (Every Monday)</option>
                      <option value="Monthly">Monthly (1st of month)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground uppercase tracking-wider text-[11px]">
                      File Attachment Format *
                    </label>
                    <select
                      value={schedFormat}
                      onChange={(e) => setSchedFormat(e.target.value as any)}
                      className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors cursor-pointer font-bold"
                    >
                      <option value="PDF">PDF Report Document</option>
                      <option value="CSV">CSV Data File</option>
                    </select>
                  </div>
                </div>

                {/* Email Inputs */}
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider text-[11px] flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Destination Email(s) *
                  </label>
                  <input
                    type="text"
                    required
                    value={schedEmails}
                    onChange={(e) => setSchedEmails(e.target.value)}
                    placeholder="e.g. accounting@company.com, ceo@company.com"
                    className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors"
                  />
                  <span className="text-[10.5px] text-muted-foreground mt-0.5 block">Separate multiple emails with commas.</span>
                </div>

                {/* Description info */}
                <div className="p-3 bg-primary/5 border border-primary/15 rounded-[6px] text-muted-foreground text-[11px] leading-relaxed">
                  🔄 The system background cron schedule triggers the compilation engine automatically. The compiled <strong>{schedFormat}</strong> file will be attached and sent to <strong>{schedEmails || 'specified recipients'}</strong>.
                </div>
              </div>

              <div className="px-5 py-4 bg-muted/30 border-t border-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="text-[12.5px] font-bold text-muted-foreground border border-border bg-card hover:bg-muted px-4 py-2 rounded-[5px] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/95 text-white text-[12.5px] font-bold px-4 py-2 rounded-[5px] shadow-sm transition-all"
                >
                  Schedule Recurrence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Export Compilation Progress Dialog ─────────────────────── */}
      {exportProgress !== 'idle' && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-[3px] animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-150">
            {exportProgress === 'generating' ? (
              <div className="space-y-4 py-3">
                <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto" />
                <div>
                  <h4 className="font-bold text-foreground text-[14.5px]">Compiling Compliance PDF</h4>
                  <p className="text-[12px] text-muted-foreground mt-1">{exportProgressText}</p>
                </div>
                <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-2/3 animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="space-y-4 py-3">
                <div className="h-12 w-12 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto text-[24px]">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-[14.5px]">PDF Compiled Successfully</h4>
                  <p className="text-[12px] text-muted-foreground mt-1 truncate max-w-[280px] mx-auto font-mono">{downloadFileName}</p>
                </div>
                <button
                  onClick={() => setExportProgress('idle')}
                  className="bg-primary hover:bg-primary/95 text-white text-[12.5px] font-bold px-4 py-2 rounded-[5px] transition-all w-full"
                >
                  Close & Dismiss
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
