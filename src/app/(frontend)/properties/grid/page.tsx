"use client";

import { useState, useEffect } from "react";
import { properties, Property } from "@/data/mockProperties";
import Link from "next/link";

export default function PropertyGrid() {
  // Saved properties state (for bookmark toggle)
  const [savedProperties, setSavedProperties] = useState<string[]>([]);

  // Search & Filter state
  const [location, setLocation] = useState<string>("");
  const [placeType, setPlaceType] = useState<string>("");
  const [minCost, setMinCost] = useState<number>(0);
  const [maxCost, setMaxCost] = useState<number>(150000);
  const [selectedBHKs, setSelectedBHKs] = useState<string[]>(["3 BHK"]); // 3 BHK is default checked in template
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["All Properties"]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

  // Filtered properties state
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);

  // Toggle bookmark function
  const toggleBookmark = (id: string) => {
    if (savedProperties.includes(id)) {
      setSavedProperties(savedProperties.filter((item) => item !== id));
    } else {
      setSavedProperties([...savedProperties, id]);
    }
  };

  // Run filters
  const applyFilters = () => {
    let result = [...properties];

    // 1. Location
    if (location) {
      result = result.filter((p) => p.location.toLowerCase().includes(location.toLowerCase()));
    }

    // 2. Type of place text search
    if (placeType) {
      result = result.filter((p) => 
        p.title.toLowerCase().includes(placeType.toLowerCase()) || 
        p.type.toLowerCase().includes(placeType.toLowerCase())
      );
    }

    // 3. Price range
    result = result.filter((p) => p.price >= minCost && p.price <= maxCost);

    // 4. BHK Count
    // "1 BHK" -> 1 bed, "2 BHK" -> 2 beds, "3 BHK" -> 3 beds, "4 & 5 BHK" -> 4 or 5 beds
    if (selectedBHKs.length > 0) {
      result = result.filter((p) => {
        return selectedBHKs.some((bhk) => {
          if (bhk === "1 BHK") return p.bedrooms === 1;
          if (bhk === "2 BHK") return p.bedrooms === 2;
          if (bhk === "3 BHK") return p.bedrooms === 3;
          if (bhk === "4 & 5 BHK") return p.bedrooms === 4 || p.bedrooms === 5;
          return true;
        });
      });
    }

    // 5. Property Type Checkboxes
    if (selectedTypes.length > 0 && !selectedTypes.includes("All Properties")) {
      result = result.filter((p) => {
        return selectedTypes.some((type) => {
          // Normalize names
          const pType = p.type.toLowerCase();
          const tType = type.toLowerCase();
          if (tType.includes("villa")) return pType.includes("villa");
          if (tType.includes("apartment")) return pType.includes("apartment");
          if (tType.includes("cottage")) return pType.includes("cottage");
          if (tType.includes("bungalow")) return pType.includes("bungalow");
          if (tType.includes("residences")) return pType.includes("residences");
          return pType === tType;
        });
      });
    }

    // 6. Facilities/Accessibility Features
    if (selectedFacilities.length > 0) {
      result = result.filter((p) => {
        return selectedFacilities.every((fac) => {
          return p.facilities.some((pfac) => pfac.toLowerCase().includes(fac.toLowerCase()));
        });
      });
    }

    setFilteredProperties(result);
  };

  // Apply filters automatically on state change
  useEffect(() => {
    applyFilters();
  }, [location, placeType, minCost, maxCost, selectedBHKs, selectedTypes, selectedFacilities]);

  const toggleBHK = (bhk: string) => {
    if (selectedBHKs.includes(bhk)) {
      setSelectedBHKs(selectedBHKs.filter((b) => b !== bhk));
    } else {
      setSelectedBHKs([...selectedBHKs, bhk]);
    }
  };

  const toggleType = (type: string) => {
    if (type === "All Properties") {
      setSelectedTypes(["All Properties"]);
      return;
    }

    let next = selectedTypes.filter((t) => t !== "All Properties");
    if (next.includes(type)) {
      next = next.filter((t) => t !== type);
      if (next.length === 0) next = ["All Properties"];
    } else {
      next.push(type);
    }
    setSelectedTypes(next);
  };

  const toggleFacility = (facility: string) => {
    if (selectedFacilities.includes(facility)) {
      setSelectedFacilities(selectedFacilities.filter((f) => f !== facility));
    } else {
      setSelectedFacilities([...selectedFacilities, facility]);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-[20px] font-bold text-foreground">Listing Grid</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Show {properties.length} Properties</p>
        </div>
        <ol className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <li>
            <a href="/" className="hover:text-primary transition-colors">Real Estate</a>
          </li>
          <li><i className="ri-arrow-right-s-line text-[12px]" /></li>
          <li className="text-primary font-medium">Listing Grid</li>
        </ol>
      </div>

      {/* Main Grid Content Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Column: Filter Sidebar (col-xl-3) */}
        <div className="xl:col-span-3 col-span-12">
          <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-border">
              <div>
                <h4 className="text-[15.5px] font-bold text-foreground">Properties</h4>
                <p className="text-[12.5px] text-muted-foreground">Show {filteredProperties.length} Properties</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Properties Location select */}
              <div>
                <label className="text-[13.5px] font-semibold text-foreground mb-1.5 block">Properties Location</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-[13.5px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors"
                >
                  <option value="">Choose a city</option>
                  <optgroup label="UK">
                    <option value="London">London</option>
                    <option value="Manchester">Manchester</option>
                    <option value="Liverpool">Liverpool</option>
                  </optgroup>
                  <optgroup label="FR">
                    <option value="Paris">Paris</option>
                    <option value="Lyon">Lyon</option>
                    <option value="Marseille">Marseille</option>
                  </optgroup>
                  <optgroup label="US">
                    <option value="New York">New York</option>
                    <option value="Washington">Washington</option>
                    <option value="Michigan">Michigan</option>
                    <option value="Los Angeles">Los Angeles</option>
                    <option value="Harrisburg">Harrisburg</option>
                  </optgroup>
                  <optgroup label="SP">
                    <option value="Madrid">Madrid</option>
                    <option value="Barcelona">Barcelona</option>
                    <option value="Malaga">Malaga</option>
                  </optgroup>
                  <optgroup label="CA">
                    <option value="Montreal">Montreal</option>
                    <option value="Toronto">Toronto</option>
                    <option value="Vancouver">Vancouver</option>
                  </optgroup>
                </select>
              </div>

              {/* Type Of Place Search */}
              <div>
                <label className="text-[13.5px] font-semibold text-foreground mb-1.5 block">Type Of Place</label>
                <input
                  type="text"
                  placeholder="Search apartment, villa, etc..."
                  value={placeType}
                  onChange={(e) => setPlaceType(e.target.value)}
                  className="w-full text-[13.5px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/60"
                />
              </div>

              {/* Custom Price Range */}
              <div>
                <label className="text-[13.5px] font-semibold text-foreground mb-1.5 block">Custom Price Range ($)</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={minCost}
                    onChange={(e) => setMinCost(Number(e.target.value))}
                    className="w-full text-center text-[12.5px] border border-border bg-card text-foreground rounded-[5px] py-1 px-2"
                  />
                  <span className="text-[12.5px] text-muted-foreground font-semibold">to</span>
                  <input
                    type="number"
                    value={maxCost}
                    onChange={(e) => setMaxCost(Number(e.target.value))}
                    className="w-full text-center text-[12.5px] border border-border bg-card text-foreground rounded-[5px] py-1 px-2"
                  />
                </div>
              </div>

              {/* BHK Selection */}
              <div>
                <label className="text-[13.5px] font-semibold text-foreground mb-1.5 block">Bedrooms</label>
                <div className="flex flex-wrap gap-1.5">
                  {["1 BHK", "2 BHK", "3 BHK", "4 & 5 BHK"].map((bhk) => {
                    const active = selectedBHKs.includes(bhk);
                    return (
                      <button
                        key={bhk}
                        type="button"
                        onClick={() => toggleBHK(bhk)}
                        className={`text-[12.5px] px-3 py-1.5 font-semibold rounded-[5px] border transition-all ${
                          active
                            ? "bg-[#604ae3] text-white border-[#604ae3]"
                            : "bg-transparent text-muted-foreground border-border hover:bg-muted/40"
                        }`}
                      >
                        {bhk}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Properties Type Checkboxes */}
              <div>
                <label className="text-[13.5px] font-semibold text-foreground mb-2 block">Properties Type</label>
                <div className="space-y-2">
                  {[
                    "All Properties",
                    "Cottage",
                    "Villas",
                    "Apartment",
                    "Duplex Bungalow",
                    "Residences",
                  ].map((type) => {
                    const active = selectedTypes.includes(type);
                    return (
                      <label key={type} className="flex items-center gap-2 cursor-pointer text-[13px] font-medium text-foreground/80 hover:text-foreground">
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => toggleType(type)}
                          className="rounded border-border text-primary focus:ring-primary h-4 w-4 bg-muted/20"
                        />
                        {type}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Accessibility Features / Facilities */}
              <div>
                <label className="text-[13.5px] font-semibold text-foreground mb-2 block">Accessibility Features</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Balcony",
                    "Parking",
                    "Spa",
                    "Pool",
                    "Restaurant",
                    "Fitness Club",
                  ].map((fac) => {
                    const active = selectedFacilities.includes(fac);
                    return (
                      <label key={fac} className="flex items-center gap-2 cursor-pointer text-[13px] font-medium text-foreground/80 hover:text-foreground">
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => toggleFacility(fac)}
                          className="rounded border-border text-primary focus:ring-primary h-4 w-4 bg-muted/20"
                        />
                        {fac}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={applyFilters}
                  className="w-full bg-[#604ae3] text-white text-[13.5px] font-semibold py-2 rounded-[5px] hover:bg-[#503bc7] active:scale-[0.98] transition-all duration-150"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Listing Cards Grid (col-xl-9) */}
        <div className="xl:col-span-9 col-span-12 space-y-6">
          
          <div className="flex justify-between items-center">
            <p className="text-[13px] text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredProperties.length}</span> of <span className="font-semibold text-foreground">{properties.length}</span> results
            </p>
            <Link
              href="/properties/add"
              className="bg-[#604ae3] text-white text-[13px] font-bold px-3.5 py-2 rounded-[5px] flex items-center gap-1 hover:bg-[#503bc7] transition-all"
            >
              <i className="ri-add-line text-[16px]" /> Add Property
            </Link>
          </div>

          {filteredProperties.length === 0 ? (
            <div className="bg-card border border-border rounded-[8px] p-12 text-center shadow-[0_0_35px_rgba(154,161,171,0.05)]">
              <iconify-icon icon="solar:info-circle-broken" className="fs-48 text-muted-foreground/60 mb-3" />
              <h3 className="text-[16px] font-bold text-foreground">No Properties Found</h3>
              <p className="text-[13px] text-muted-foreground mt-1 max-w-md mx-auto">
                No properties match your current filter settings. Try relaxing your location, BHK, price, or facilities parameters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((p) => {
                const isSaved = savedProperties.includes(p.id);
                const isSold = p.status === "Sold";
                return (
                  <div
                    key={p.id}
                    className="bg-card border border-border rounded-[8px] overflow-hidden shadow-[0_0_35px_rgba(154,161,171,0.05)] flex flex-col justify-between hover:shadow-[0_10px_35px_rgba(154,161,171,0.15)] group transition-all duration-300"
                  >
                    {/* Header Image section */}
                    <div className="relative overflow-hidden aspect-[4/3] bg-muted/20">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* Bookmark Icon button */}
                      <span className="absolute top-2.5 left-2.5 z-10">
                        <button
                          type="button"
                          onClick={() => toggleBookmark(p.id)}
                          className={`h-8 w-8 rounded flex items-center justify-center text-[18px] transition-all ${
                            isSaved
                              ? "bg-warning text-white scale-105"
                              : "bg-[#f9bc0b]/20 hover:bg-[#f9bc0b] text-[#f9bc0b] hover:text-white"
                          }`}
                        >
                          <iconify-icon icon={isSaved ? "solar:bookmark-bold" : "solar:bookmark-broken"} className="text-[18px]" />
                        </button>
                      </span>

                      {/* Status badge */}
                      <span className="absolute top-2.5 right-2.5 z-10">
                        <span className={`text-[12.5px] font-bold px-2 py-0.5 rounded text-white shadow-sm ${
                          p.status === "For Rent" ? "bg-[#0acf97]" :
                          p.status === "For Sale" ? "bg-[#f9bc0b]" :
                          "bg-[#ff5b5b]"
                        }`}>
                          {p.status}
                        </span>
                      </span>
                    </div>

                    {/* Body content section */}
                    <div className="p-4 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex items-start gap-2.5 mb-2.5">
                          <div className="h-8 w-8 min-w-[32px] rounded bg-muted/60 flex items-center justify-center">
                            <iconify-icon
                              icon={p.type.toLowerCase().includes("apartment") || p.type.toLowerCase().includes("penthouse") ? "solar:buildings-3-bold-duotone" : "solar:home-bold-duotone"}
                              className="text-[18px] text-[#604ae3]"
                            />
                          </div>
                          <div>
                            <Link href={`/properties/${p.id}`} className="text-[15.5px] font-bold text-foreground hover:text-primary transition-colors line-clamp-1">
                              {p.title}
                            </Link>
                            <p className="text-[12.5px] text-muted-foreground mt-0.5 line-clamp-1">{p.location}</p>
                          </div>
                        </div>

                        {/* Specs grid */}
                        <div className="grid grid-cols-2 gap-2 mt-3 mb-4">
                          <span className="text-[12.5px] text-muted-foreground bg-muted/20 border border-border rounded px-2 py-1 flex items-center gap-1 font-medium">
                            <iconify-icon icon="solar:bed-broken" className="text-[15px] text-primary" /> {p.bedrooms} Beds
                          </span>
                          <span className="text-[12.5px] text-muted-foreground bg-muted/20 border border-border rounded px-2 py-1 flex items-center gap-1 font-medium">
                            <iconify-icon icon="solar:bath-broken" className="text-[15px] text-primary" /> {p.bathrooms} Bath
                          </span>
                          <span className="text-[12.5px] text-muted-foreground bg-muted/20 border border-border rounded px-2 py-1 flex items-center gap-1 font-medium">
                            <iconify-icon icon="solar:scale-broken" className="text-[15px] text-primary" /> {p.area}ft
                          </span>
                          <span className="text-[12.5px] text-muted-foreground bg-muted/20 border border-border rounded px-2 py-1 flex items-center gap-1 font-medium">
                            <iconify-icon icon="solar:double-alt-arrow-up-broken" className="text-[15px] text-primary" /> {p.floors} Floor
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer price / action section */}
                    <div className="px-4 py-3 bg-muted/10 border-t border-border flex justify-between items-center">
                      <p className={`text-[15px] font-bold ${isSold ? "text-muted-foreground line-through decoration-muted-foreground/60" : "text-foreground"}`}>
                        ${p.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <Link href={`/properties/${p.id}`} className="text-[#604ae3] text-[13px] font-bold flex items-center gap-0.5 hover:text-[#503bc7] transition-all">
                        More Inquiry <i className="ri-arrow-right-line text-[14px]" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination bar */}
          {filteredProperties.length > 0 && (
            <div className="pt-3 border-t border-border flex justify-end">
              <nav className="flex items-center gap-1">
                <button type="button" className="text-[13px] border border-border px-3 py-1.5 rounded-[5px] text-muted-foreground hover:bg-muted font-medium transition-colors">Previous</button>
                <button type="button" className="text-[13px] border border-[#604ae3] bg-[#604ae3] text-white px-3.5 py-1.5 rounded-[5px] font-bold transition-all">1</button>
                <button type="button" className="text-[13px] border border-border px-3.5 py-1.5 rounded-[5px] text-muted-foreground hover:bg-muted font-medium transition-colors">2</button>
                <button type="button" className="text-[13px] border border-border px-3.5 py-1.5 rounded-[5px] text-muted-foreground hover:bg-muted font-medium transition-colors">3</button>
                <button type="button" className="text-[13px] border border-border px-3 py-1.5 rounded-[5px] text-muted-foreground hover:bg-muted font-medium transition-colors">Next</button>
              </nav>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
