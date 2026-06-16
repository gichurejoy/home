"use client";

import { useAppStore } from "@/store/useAppStore";
import { X, Play } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function CompareBar() {
  const { comparedPropertyIds, toggleComparedPropertyId, clearComparedProperties, properties } = useAppStore();

  const selectedProperties = properties.filter(p => comparedPropertyIds.includes(p.id));

  if (selectedProperties.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9990] w-[95%] max-w-2xl bg-card border border-border rounded-xl shadow-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <span className="text-[12.5px] font-bold text-foreground shrink-0 bg-primary/10 text-primary px-2.5 py-1 rounded">
            {selectedProperties.length} Selected
          </span>
          <div className="flex items-center gap-2">
            {selectedProperties.map(p => (
              <div key={p.id} className="relative group shrink-0">
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-10 w-10 rounded object-cover border border-border"
                />
                <button
                  onClick={() => toggleComparedPropertyId(p.id)}
                  className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-danger hover:bg-danger/90 text-white rounded-full flex items-center justify-center text-[10px] shadow"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-popover border border-border text-foreground text-[10px] font-medium py-1 px-2 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
                  {p.title}
                </div>
              </div>
            ))}
            {selectedProperties.length < 4 && (
              <div className="h-10 w-10 rounded border-2 border-dashed border-border flex items-center justify-center text-muted-foreground/30 text-[11px] shrink-0 font-medium">
                + Add
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">
          <button
            onClick={clearComparedProperties}
            className="text-[12.5px] font-semibold text-muted-foreground hover:text-foreground hover:underline px-2 py-1.5 cursor-pointer"
          >
            Clear All
          </button>
          <Link
            href="/properties/compare"
            className="bg-[#604ae3] hover:bg-[#503bc7] text-white text-[12.5px] font-bold px-4 py-2 rounded-[6px] shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
          >
            Compare Listings <Play className="h-3 w-3 fill-current" />
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
