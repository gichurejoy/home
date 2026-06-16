"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/store/useToastStore";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  Trash2, 
  X, 
  MapPin, 
  User, 
  Check
} from "lucide-react";
import { CalendarEvent } from "@/data/mockTier2";

export default function CalendarPage() {
  const { 
    calendarEvents, 
    addCalendarEvent, 
    deleteCalendarEvent, 
    properties, 
    agents, 
    customers 
  } = useAppStore();

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("All");
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  
  // Form States
  const [eventTitle, setEventTitle] = useState("");
  const [eventType, setEventType] = useState<'Showing' | 'Open House' | 'Closing' | 'Follow-up'>('Showing');
  const [eventDate, setEventDate] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [selectedPropId, setSelectedPropId] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [selectedCustId, setSelectedCustId] = useState("");

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const today = () => {
    setCurrentDate(new Date());
    const todayStr = new Date().toISOString().split('T')[0];
    setSelectedDateStr(todayStr);
  };

  // Generate calendar days for month grid
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // Day of week first day falls on (0-6)
    const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const totalDaysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];

    // Prev month overflow days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = totalDaysInPrevMonth - i;
      const prevMonthDate = new Date(currentYear, currentMonth - 1, day);
      days.push({
        date: prevMonthDate,
        dayNum: day,
        isCurrentMonth: false,
        dateStr: prevMonthDate.toISOString().split('T')[0]
      });
    }

    // Current month days
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const currDate = new Date(currentYear, currentMonth, i);
      days.push({
        date: currDate,
        dayNum: i,
        isCurrentMonth: true,
        dateStr: currDate.toISOString().split('T')[0]
      });
    }

    // Next month overflow days (to fill 42-cell grid)
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const nextDate = new Date(currentYear, currentMonth + 1, i);
      days.push({
        date: nextDate,
        dayNum: i,
        isCurrentMonth: false,
        dateStr: nextDate.toISOString().split('T')[0]
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  // Filter events based on month/year and type filter
  const filteredEvents = useMemo(() => {
    return calendarEvents.filter(e => {
      const matchType = filterType === "All" || e.type === filterType;
      return matchType;
    });
  }, [calendarEvents, filterType]);

  // Map events to date string for grid access
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    filteredEvents.forEach(e => {
      if (!map[e.start]) {
        map[e.start] = [];
      }
      map[e.start].push(e);
    });
    return map;
  }, [filteredEvents]);

  // Get events on selected date
  const selectedDateEvents = useMemo(() => {
    if (!selectedDateStr) return [];
    return calendarEvents.filter(e => e.start === selectedDateStr);
  }, [calendarEvents, selectedDateStr]);

  // Type color styling helper
  const getTypeStyles = (type: CalendarEvent['type']) => {
    switch(type) {
      case 'Showing': 
        return { 
          bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20', 
          dot: 'bg-emerald-500', 
          hoverBg: 'hover:bg-emerald-500/20' 
        };
      case 'Open House': 
        return { 
          bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20', 
          dot: 'bg-blue-500', 
          hoverBg: 'hover:bg-blue-500/20' 
        };
      case 'Closing': 
        return { 
          bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20', 
          dot: 'bg-amber-500', 
          hoverBg: 'hover:bg-amber-500/20' 
        };
      case 'Follow-up': 
        return { 
          bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20', 
          dot: 'bg-indigo-500', 
          hoverBg: 'hover:bg-indigo-500/20' 
        };
      default: 
        return { 
          bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20', 
          dot: 'bg-slate-500', 
          hoverBg: 'hover:bg-slate-500/20' 
        };
    }
  };

  // Open create event modal
  const handleOpenCreateModal = (dateStr?: string) => {
    setEditingEvent(null);
    setEventTitle("");
    setEventType("Showing");
    setEventDate(dateStr || new Date().toISOString().split('T')[0]);
    setEventDesc("");
    setSelectedPropId("");
    setSelectedAgentId("");
    setSelectedCustId("");
    setIsModalOpen(true);
  };

  // Open edit modal
  const handleOpenEditModal = (event: CalendarEvent) => {
    setEditingEvent(event);
    setEventTitle(event.title);
    setEventType(event.type);
    setEventDate(event.start);
    setEventDesc(event.description || "");
    setSelectedPropId(event.propertyId || "");
    setSelectedAgentId(event.agentId || "");
    setSelectedCustId(event.customerId || "");
    setIsModalOpen(true);
  };

  // Handle Save Event (both add and edit)
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDate) {
      toast.error("Please fill in the title and date.");
      return;
    }

    const matchedProp = properties.find(p => p.id === selectedPropId);

    const eventPayload = {
      title: eventTitle,
      type: eventType,
      start: eventDate,
      description: eventDesc,
      propertyId: selectedPropId || undefined,
      propertyName: matchedProp?.title || undefined,
      agentId: selectedAgentId || undefined,
      customerId: selectedCustId || undefined
    };

    if (editingEvent) {
      // For editing, since we have only add/delete in useAppStore right now, we can delete old and add new
      deleteCalendarEvent(editingEvent.id);
      addCalendarEvent(eventPayload);
      toast.success("Event updated successfully.");
    } else {
      addCalendarEvent(eventPayload);
      toast.success("Event added successfully.");
    }

    setIsModalOpen(false);
    setSelectedDateStr(eventDate);
  };

  const handleDeleteEvent = (id: string) => {
    deleteCalendarEvent(id);
    toast.success("Event deleted successfully.");
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <Breadcrumb />
          <h1 className="text-[20px] font-bold text-foreground">Calendar & Appointment Scheduler</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Manage showings, open houses, and contract closings</p>
        </div>
        <button
          onClick={() => handleOpenCreateModal()}
          className="bg-primary hover:bg-primary/90 text-white text-[13px] font-bold px-4 py-2 rounded-[5px] flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="h-4 w-4" /> Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        {/* ── Left 3/4: Month Grid View ─────────────────────────────────── */}
        <div className="xl:col-span-3 bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
          {/* Calendar Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <h2 className="text-[17px] font-bold text-foreground">
                {months[currentMonth]} {currentYear}
              </h2>
              <div className="flex items-center gap-1 border border-border rounded-md bg-muted/20 p-0.5">
                <button
                  onClick={prevMonth}
                  className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={today}
                className="text-[12.5px] border border-border px-3 py-1 rounded-[4px] font-bold text-muted-foreground hover:bg-muted transition-all"
              >
                Today
              </button>
            </div>

            {/* Type Filters */}
            <div className="flex flex-wrap items-center gap-1.5">
              {["All", "Showing", "Open House", "Closing", "Follow-up"].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`text-[12px] px-3 py-1 rounded-[4px] font-bold transition-all border ${
                    filterType === type 
                      ? 'bg-primary text-white border-primary shadow-sm' 
                      : 'border-border text-muted-foreground hover:bg-muted bg-card'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Month Calendar Grid */}
          <div>
            {/* Days of the Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[12px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            {/* Day Cells */}
            <div className="grid grid-cols-7 gap-1 border border-border rounded-lg overflow-hidden bg-border/40">
              {calendarDays.map((cell, idx) => {
                const isSelected = selectedDateStr === cell.dateStr;
                const isToday = new Date().toISOString().split('T')[0] === cell.dateStr;
                const dayEvents = eventsByDate[cell.dateStr] || [];

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDateStr(cell.dateStr)}
                    onDoubleClick={() => handleOpenCreateModal(cell.dateStr)}
                    className={`min-h-[105px] bg-card p-2 flex flex-col justify-between transition-all cursor-pointer relative group ${
                      cell.isCurrentMonth ? '' : 'bg-muted/10 opacity-50'
                    } ${
                      isSelected ? 'ring-2 ring-primary ring-inset z-10' : 'hover:bg-muted/10'
                    }`}
                  >
                    {/* Day Number Header */}
                    <div className="flex items-center justify-between">
                      <span className={`text-[13px] font-bold rounded-full h-6 w-6 flex items-center justify-center ${
                        isToday 
                          ? 'bg-primary text-white font-extrabold shadow-sm' 
                          : 'text-muted-foreground'
                      }`}>
                        {cell.dayNum}
                      </span>

                      {/* Double Click indicator */}
                      <span className="opacity-0 group-hover:opacity-100 text-[10px] text-muted-foreground/50 transition-opacity hidden sm:inline">
                        DblClick +
                      </span>
                    </div>

                    {/* Events List inside Cell */}
                    <div className="space-y-1 mt-1 flex-1 overflow-hidden select-none">
                      {dayEvents.slice(0, 3).map(e => {
                        const style = getTypeStyles(e.type);
                        return (
                          <div
                            key={e.id}
                            onClick={(ev) => {
                              ev.stopPropagation();
                              handleOpenEditModal(e);
                            }}
                            className={`text-[10px] font-bold truncate px-1.5 py-0.5 rounded border flex items-center gap-1 ${style.bg} ${style.hoverBg} transition-colors`}
                            title={e.title}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${style.dot} shrink-0`} />
                            <span className="truncate">{e.title}</span>
                          </div>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <div className="text-[9px] font-extrabold text-muted-foreground/70 text-center bg-muted/40 rounded py-0.2">
                          + {dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Right 1/4: Selected Date Agenda / Detail View ────────────────────── */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
            <h3 className="text-[15px] font-bold text-foreground mb-4 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-primary" />
              Agenda for {selectedDateStr ? new Date(selectedDateStr + "T00:00:00").toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Select a Date"}
            </h3>

            {selectedDateEvents.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-border rounded-lg bg-muted/5">
                <p className="text-[13px] text-muted-foreground">No appointments scheduled.</p>
                {selectedDateStr && (
                  <button
                    onClick={() => handleOpenCreateModal(selectedDateStr)}
                    className="mt-3 text-[12px] font-bold text-primary hover:underline flex items-center justify-center gap-1 w-full"
                  >
                    <Plus className="h-3 w-3" /> Schedule Appointment
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3.5">
                {selectedDateEvents.map(e => {
                  const style = getTypeStyles(e.type);
                  return (
                    <div
                      key={e.id}
                      onClick={() => handleOpenEditModal(e)}
                      className={`border rounded-[6px] p-3 cursor-pointer hover:shadow-md transition-all bg-card border-l-[4px] ${
                        e.type === 'Showing' ? 'border-l-emerald-500' :
                        e.type === 'Open House' ? 'border-l-blue-500' :
                        e.type === 'Closing' ? 'border-l-amber-500' :
                        'border-l-indigo-500'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[9.5px] font-extrabold uppercase px-1.5 py-0.2 rounded border ${style.bg}`}>
                          {e.type}
                        </span>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-0.5">
                          <Clock className="h-3 w-3" /> All Day
                        </span>
                      </div>
                      <h4 className="text-[13.5px] font-bold text-foreground mt-2 leading-tight hover:text-primary transition-colors">
                        {e.title}
                      </h4>
                      {e.description && (
                        <p className="text-[12px] text-muted-foreground mt-1 line-clamp-2">
                          {e.description}
                        </p>
                      )}

                      {/* Connected entities links */}
                      {(e.propertyName || e.agentId || e.customerId) && (
                        <div className="mt-3 pt-2 border-t border-border/60 space-y-1 text-[11px] text-muted-foreground">
                          {e.propertyName && (
                            <div className="flex items-center gap-1.5 truncate">
                              <MapPin className="h-3 w-3 text-muted-foreground/60 shrink-0" />
                              <span className="truncate">{e.propertyName}</span>
                            </div>
                          )}
                          {e.agentId && (
                            <div className="flex items-center gap-1.5 truncate">
                              <User className="h-3 w-3 text-muted-foreground/60 shrink-0" />
                              <span className="truncate">Agent: {agents.find(a => a.id === e.agentId)?.name || e.agentId}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Add / Edit Event Overlay Modal ────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="text-[16px] font-bold text-foreground flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                {editingEvent ? "Edit Appointment" : "Schedule New Event"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveEvent}>
              <div className="p-5 space-y-4 text-[13px]">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider text-[11px]">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Showing at Beach Avenue"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Type */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground uppercase tracking-wider text-[11px]">
                      Event Type
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value as CalendarEvent['type'])}
                      className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors"
                    >
                      <option value="Showing">Showing</option>
                      <option value="Open House">Open House</option>
                      <option value="Closing">Closing</option>
                      <option value="Follow-up">Follow-up</option>
                    </select>
                  </div>

                  {/* Date */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground uppercase tracking-wider text-[11px]">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                {/* Property Association */}
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider text-[11px]">
                    Associate Property
                  </label>
                  <select
                    value={selectedPropId}
                    onChange={(e) => setSelectedPropId(e.target.value)}
                    className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors"
                  >
                    <option value="">None</option>
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                {/* Agent Association */}
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider text-[11px]">
                    Associate Agent
                  </label>
                  <select
                    value={selectedAgentId}
                    onChange={(e) => setSelectedAgentId(e.target.value)}
                    className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors"
                  >
                    <option value="">None</option>
                    {agents.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>

                {/* Customer Association */}
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider text-[11px]">
                    Associate Customer
                  </label>
                  <select
                    value={selectedCustId}
                    onChange={(e) => setSelectedCustId(e.target.value)}
                    className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors"
                  >
                    <option value="">None</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider text-[11px]">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Add specific details or appointment notes..."
                    value={eventDesc}
                    onChange={(e) => setEventDesc(e.target.value)}
                    className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="px-5 py-4 bg-muted/30 border-t border-border flex items-center justify-between">
                {editingEvent ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(editingEvent.id)}
                    className="bg-danger/10 hover:bg-danger text-danger hover:text-white text-[12.5px] font-bold px-3 py-2 rounded-[5px] flex items-center gap-1 transition-all"
                  >
                    <Trash2 className="h-4 w-4" /> Delete Event
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="text-[12.5px] font-bold text-muted-foreground border border-border bg-card hover:bg-muted px-4 py-2 rounded-[5px] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary/95 text-white text-[12.5px] font-bold px-4 py-2 rounded-[5px] shadow-sm flex items-center gap-1.5 transition-all"
                  >
                    <Check className="h-4 w-4" /> Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
