"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/store/useToastStore";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { 
  Plus, 
  Trash2, 
  Percent, 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  HelpCircle, 
  DollarSign,
  Briefcase
} from "lucide-react";

export default function CommissionsPage() {
  const {
    sessionRole,
    rolePermissions,
    agents,
    closedDeals,
    commissionPlans,
    agentPlanAssignments,
    addCommissionPlan,
    deleteCommissionPlan,
    assignAgentPlan
  } = useAppStore();

  // Modal State for New Plan
  const [isNewPlanOpen, setIsNewPlanOpen] = useState(false);
  const [newPlanName, setNewPlanName] = useState("");
  const [agentPct, setAgentPct] = useState(80);
  const [brokerPct, setBrokerPct] = useState(20);
  const [capLimit, setCapLimit] = useState(20000);
  const [deskFee, setDeskFee] = useState(0);

  // Help Tooltip State
  const [showHelp, setShowHelp] = useState(false);

  // Check RBAC permission for Commission Admin
  const hasCommissionsAdmin = rolePermissions[sessionRole]?.includes("commissions_admin") ?? false;

  // Calculate stats for plan card: number of agents assigned
  const getAgentCountForPlan = (planId: string) => {
    return Object.values(agentPlanAssignments).filter(id => id === planId).length;
  };

  // Calculate current cap progress for an agent
  const getAgentCapStats = (agentId: string, planCapLimit: number) => {
    // Sum of brokerCut in closedDeals for this agent
    const paidToBroker = closedDeals
      ? closedDeals.filter(d => d.agentId === agentId).reduce((sum, d) => sum + d.brokerCut, 0)
      : 0;

    const isCapped = planCapLimit > 0 && paidToBroker >= planCapLimit;
    const progressPercent = planCapLimit > 0 ? Math.min(100, (paidToBroker / planCapLimit) * 100) : 0;
    
    return {
      paidToBroker,
      isCapped,
      progressPercent
    };
  };

  // Handle Plan Submit
  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasCommissionsAdmin) {
      toast.error(`Permission Denied: Your current role (${sessionRole}) cannot configure commission plans.`);
      return;
    }
    if (!newPlanName.trim()) {
      toast.error("Please enter a plan name.");
      return;
    }
    if (agentPct + brokerPct !== 100) {
      toast.error("Split percentages must add up to exactly 100%.");
      return;
    }

    addCommissionPlan({
      name: newPlanName,
      agentPercentage: agentPct,
      brokerPercentage: brokerPct,
      capLimit,
      deskFee
    });

    toast.success(`Commission plan '${newPlanName}' created successfully!`);
    setIsNewPlanOpen(false);
    setNewPlanName("");
    setAgentPct(80);
    setBrokerPct(20);
    setCapLimit(20000);
    setDeskFee(0);
  };

  // Handle Plan Delete
  const handleDeletePlan = (planId: string, planName: string) => {
    if (!hasCommissionsAdmin) {
      toast.error(`Permission Denied: Your current role (${sessionRole}) cannot delete plans.`);
      return;
    }

    // Check if any agent is currently assigned to this plan
    const assignedCount = getAgentCountForPlan(planId);
    if (assignedCount > 0) {
      toast.error(`Cannot delete plan '${planName}' because ${assignedCount} agent(s) are assigned to it. Reassign them first.`);
      return;
    }

    if (commissionPlans.length <= 1) {
      toast.error("You must keep at least one commission plan active.");
      return;
    }

    deleteCommissionPlan(planId);
    toast.success(`Plan '${planName}' has been removed.`);
  };

  // Handle Agent Assignment Change
  const handleAssignPlan = (agentId: string, planId: string) => {
    if (!hasCommissionsAdmin) {
      toast.error(`Permission Denied: Your current role (${sessionRole}) cannot assign plans.`);
      return;
    }
    assignAgentPlan(agentId, planId);
    const plan = commissionPlans.find(p => p.id === planId);
    const agent = agents.find(a => a.id === agentId);
    toast.success(`Assigned ${agent?.name || "agent"} to plan: ${plan?.name || planId}`);
  };

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Breadcrumb />
          <h1 className="text-[20px] font-bold text-foreground flex items-center gap-2">
            <Percent className="h-5 w-5 text-primary animate-pulse" />
            Commission Splits & Cap Configurations
          </h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Configure agent split agreements, track annual broker fee caps, and assign plan packages.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="h-9 w-9 rounded-[5px] border border-border flex items-center justify-center hover:bg-muted/40 transition-colors text-muted-foreground"
            title="How do commission splits and caps work?"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => {
              if (!hasCommissionsAdmin) {
                toast.error(`Permission Denied: Your current role (${sessionRole}) cannot configure splits.`);
                return;
              }
              setIsNewPlanOpen(true);
            }}
            disabled={!hasCommissionsAdmin}
            className={`text-[13px] font-bold px-4 py-2 rounded-[5px] flex items-center gap-1.5 shadow-sm transition-all ${
              hasCommissionsAdmin
                ? "bg-primary hover:bg-primary/95 text-white cursor-pointer"
                : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
            }`}
          >
            <Plus className="h-4 w-4" /> Create Split Plan
          </button>
        </div>
      </div>

      {/* ── Educational Help Banner ────────────────────────────────── */}
      {showHelp && (
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-5 text-[13px] space-y-2 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-4.5 w-4.5 text-primary" />
              Real Estate Commission Split & Cap Guide
            </h4>
            <button 
              onClick={() => setShowHelp(false)}
              className="text-muted-foreground hover:text-foreground font-bold"
            >
              Dismiss
            </button>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            In a standard split arrangement (e.g., 80/20), the agent earns 80% of the gross deal commission, and the brokerage receives 20% (the "Broker Cut"). 
            An <strong>Annual Cap</strong> is the maximum total dollar amount the broker will collect from the agent during their cycle (usually 1 year). 
            Once the sum of the broker's cuts reaches this cap limit, the agent "caps" and receives <strong>100% of their commission payouts</strong> for all subsequent deals until their anniversary reset.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 font-medium">
            <div className="bg-card border border-border/80 rounded-[8px] p-3">
              <span className="text-[11px] text-muted-foreground block uppercase font-bold tracking-wider">Example Deal</span>
              <p className="mt-1">$500,000 Sale @ 3% Commission = <strong>$15,000 Gross</strong></p>
            </div>
            <div className="bg-card border border-border/80 rounded-[8px] p-3">
              <span className="text-[11px] text-muted-foreground block uppercase font-bold tracking-wider">Split Stage (80/20)</span>
              <p className="mt-1">Agent gets <strong>$12,000</strong>. Brokerage gets <strong>$3,000</strong> (goes toward cap).</p>
            </div>
            <div className="bg-card border border-border/80 rounded-[8px] p-3">
              <span className="text-[11px] text-muted-foreground block uppercase font-bold tracking-wider">Cap-Met Stage (100%)</span>
              <p className="mt-1">Once Cap is met, Broker gets <strong>$0</strong>. Agent gets full <strong>$15,000</strong>.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Commission Split Plans list ─────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-foreground flex items-center gap-2">
            <Briefcase className="h-4.5 w-4.5 text-primary" /> Active Commission Plan Packages
          </h2>
          <span className="text-[11.5px] text-muted-foreground font-semibold bg-muted px-2.5 py-0.5 rounded-full">
            {commissionPlans.length} Plans Defined
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {commissionPlans.map(plan => {
            const agentCount = getAgentCountForPlan(plan.id);
            return (
              <div 
                key={plan.id} 
                className="bg-card border border-border rounded-xl p-5 shadow-[0_0_35px_rgba(154,161,171,0.03)] flex flex-col justify-between relative hover:border-primary/40 transition-all group"
              >
                {/* Trash delete button */}
                <button
                  onClick={() => handleDeletePlan(plan.id, plan.name)}
                  className="absolute top-4 right-4 h-7 w-7 rounded-full text-muted-foreground hover:text-danger hover:bg-danger/10 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove Plan Template"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded">
                      {plan.agentPercentage}/{plan.brokerPercentage} Split
                    </span>
                    <h3 className="text-[14px] font-bold text-foreground mt-2 line-clamp-1">{plan.name}</h3>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-dashed border-border text-[12.5px]">
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span>Broker Cut Rate:</span>
                      <span className="font-bold text-foreground">{plan.brokerPercentage}%</span>
                    </div>
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span>Annual Cap Limit:</span>
                      <span className="font-bold text-foreground">
                        {plan.capLimit > 0 ? `$${plan.capLimit.toLocaleString()}` : "No Limit / None"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span>Monthly Desk Fee:</span>
                      <span className="font-bold text-foreground">
                        {plan.deskFee > 0 ? `$${plan.deskFee}/mo` : "$0 (None)"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11.5px]">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> {agentCount} Assigned
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground/60">{plan.id}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Agent Assignments & Cap progress tracker ───────────────── */}
      <div className="bg-card border border-border rounded-xl shadow-[0_0_35px_rgba(154,161,171,0.05)] overflow-hidden">
        <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-muted/5">
          <div>
            <h3 className="text-[15px] font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="h-4.5 w-4.5 text-primary" />
              Agent Split Assignments & Cap Tracking Ledger
            </h3>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              Assign split schedules to agents and review their current broker cut contribution towards their annual limits.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12.5px]">
            <thead>
              <tr className="border-b border-border bg-muted/10 font-bold text-muted-foreground text-[10.5px] uppercase">
                <th className="py-3.5 px-5 min-w-[200px]">Agent Profile</th>
                <th className="py-3.5 px-4 min-w-[220px]">Assigned Plan Package</th>
                <th className="py-3.5 px-4 min-w-[150px] text-right">Gross Sold Volume</th>
                <th className="py-3.5 px-4 min-w-[280px]">Cap Limits Progression (Broker Cuts)</th>
                <th className="py-3.5 px-5 min-w-[110px] text-right">Status Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {agents.map(agent => {
                const assignedPlanId = agentPlanAssignments[agent.id] || commissionPlans[0]?.id;
                const activePlan = commissionPlans.find(p => p.id === assignedPlanId) || commissionPlans[0];
                const stats = getAgentCapStats(agent.id, activePlan.capLimit);

                // Calculate gross volume closed for the agent from closedDeals
                const totalDeals = closedDeals
                  ? closedDeals.filter(d => d.agentId === agent.id)
                  : [];
                const grossVolume = totalDeals.reduce((sum, d) => sum + d.price, 0);

                return (
                  <tr key={agent.id} className="hover:bg-muted/10 transition-colors">
                    {/* Agent Profile */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img 
                          src={agent.avatar} 
                          className="h-9 w-9 rounded-full object-cover border border-border" 
                          alt={agent.name} 
                        />
                        <div>
                          <p className="font-bold text-foreground leading-snug">{agent.name}</p>
                          <span className="text-[10.5px] text-muted-foreground">{agent.id} • {agent.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Assigned Plan Selector */}
                    <td className="py-3.5 px-4">
                      {hasCommissionsAdmin ? (
                        <select
                          value={assignedPlanId}
                          onChange={(e) => handleAssignPlan(agent.id, e.target.value)}
                          className="text-[12px] font-semibold border border-border bg-card text-foreground rounded-[5px] px-2.5 py-1.5 outline-none focus:border-primary transition-colors cursor-pointer w-full max-w-[220px]"
                        >
                          {commissionPlans.map(plan => (
                            <option key={plan.id} value={plan.id}>
                              {plan.name} ({plan.agentPercentage}/{plan.brokerPercentage})
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="font-semibold text-foreground">
                          {activePlan.name} ({activePlan.agentPercentage}/{activePlan.brokerPercentage})
                        </div>
                      )}
                    </td>

                    {/* Gross Sold Volume */}
                    <td className="py-3.5 px-4 text-right font-bold text-foreground">
                      ${grossVolume.toLocaleString()}
                      <span className="text-[10.5px] text-muted-foreground block font-medium">
                        {totalDeals.length} Deal{totalDeals.length !== 1 ? 's' : ''} Closed
                      </span>
                    </td>

                    {/* Cap Limit progression */}
                    <td className="py-3.5 px-4">
                      {activePlan.capLimit > 0 ? (
                        <div className="space-y-1.5 max-w-xs">
                          <div className="flex justify-between text-[11px] font-medium">
                            <span className="text-muted-foreground">Broker Cut Contribution:</span>
                            <span className="text-foreground font-bold">
                              ${stats.paidToBroker.toLocaleString()} / ${activePlan.capLimit.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-muted h-2 rounded-full overflow-hidden border border-border/10">
                            <div 
                              className={`h-full transition-all duration-500 rounded-full ${
                                stats.isCapped ? "bg-success" : "bg-primary"
                              }`}
                              style={{ width: `${stats.progressPercent}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-[11.5px] italic">
                          No Cap Limit Defined
                        </span>
                      )}
                    </td>

                    {/* Cap Status Badge */}
                    <td className="py-3.5 px-5 text-right">
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.8 rounded-full border ${
                        stats.isCapped
                          ? 'text-success bg-soft-success border-success/20'
                          : activePlan.capLimit === 0
                          ? 'text-info bg-soft-info border-info/20'
                          : 'text-warning bg-soft-warning border-warning/20'
                      }`}>
                        {stats.isCapped 
                          ? 'Cap Met (100% split)' 
                          : activePlan.capLimit === 0 
                          ? 'No Cap (Constant Split)' 
                          : `${Math.round(100 - stats.progressPercent)}% Left to Cap`
                        }
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Plan Builder Modal ─────────────────────────────────────── */}
      {isNewPlanOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/10">
              <h3 className="text-[16px] font-bold text-foreground flex items-center gap-2">
                <Percent className="h-5 w-5 text-primary" /> Create New Commission Plan
              </h3>
              <button
                onClick={() => setIsNewPlanOpen(false)}
                className="text-muted-foreground hover:text-foreground h-7 w-7 rounded-full hover:bg-muted flex items-center justify-center transition-colors text-[18px]"
              >
                <i className="ri-close-line" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan}>
              <div className="p-5 space-y-4 text-[13px]">
                {/* Plan Name */}
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider text-[11px]">
                    Plan Template Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPlanName}
                    onChange={(e) => setNewPlanName(e.target.value)}
                    placeholder="e.g. Bronze Split 70/30"
                    className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Agent Split % */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground uppercase tracking-wider text-[11px]">
                      Agent Share (%) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      required
                      value={agentPct}
                      onChange={(e) => {
                        const val = Math.min(100, Math.max(0, Number(e.target.value)));
                        setAgentPct(val);
                        setBrokerPct(100 - val);
                      }}
                      className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors font-semibold"
                    />
                  </div>

                  {/* Broker Split % */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground uppercase tracking-wider text-[11px]">
                      Broker Share (%) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      required
                      value={brokerPct}
                      onChange={(e) => {
                        const val = Math.min(100, Math.max(0, Number(e.target.value)));
                        setBrokerPct(val);
                        setAgentPct(100 - val);
                      }}
                      className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Cap Limit */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground uppercase tracking-wider text-[11px] flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5 text-muted-foreground" /> Annual Cap ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={capLimit}
                      onChange={(e) => setCapLimit(Math.max(0, Number(e.target.value)))}
                      placeholder="e.g. 20000 (0 for no cap)"
                      className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors font-semibold"
                    />
                  </div>

                  {/* Monthly Desk Fee */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground uppercase tracking-wider text-[11px] flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5 text-muted-foreground" /> Monthly Desk Fee ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={deskFee}
                      onChange={(e) => setDeskFee(Math.max(0, Number(e.target.value)))}
                      placeholder="e.g. 150 (0 if none)"
                      className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors font-semibold"
                    />
                  </div>
                </div>

                <div className="p-3 bg-muted/20 border border-border rounded-[8px] space-y-1">
                  <p className="font-bold text-[11.5px] text-foreground flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Plan Summary Details
                  </p>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    This plan splits all deal commissions: <strong>{agentPct}%</strong> to the Agent and <strong>{brokerPct}%</strong> to the Broker. 
                    {capLimit > 0 ? (
                      <span> Once the Broker has collected <strong>${capLimit.toLocaleString()}</strong> in broker cuts, the Agent receives <strong>100%</strong> of deal commissions.</span>
                    ) : (
                      <span> There is no annual cap, meaning splits remain constant.</span>
                    )}
                    {deskFee > 0 && <span> The agent will be charged a monthly desk fee of <strong>${deskFee}</strong>.</span>}
                  </p>
                </div>
              </div>

              <div className="px-5 py-4 bg-muted/30 border-t border-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewPlanOpen(false)}
                  className="text-[12.5px] font-bold text-muted-foreground border border-border bg-card hover:bg-muted px-4 py-2 rounded-[5px] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/95 text-white text-[12.5px] font-bold px-4 py-2 rounded-[5px] shadow-sm transition-all"
                >
                  Create Plan Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
