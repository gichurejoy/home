"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/store/useToastStore";
import { FileText, Download, Trash2, UploadCloud } from "lucide-react";

interface DocumentManagerProps {
  entityId: string;
}

export function DocumentManager({ entityId }: DocumentManagerProps) {
  const { documents, addDocument, deleteDocument } = useAppStore();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [category, setCategory] = useState<'Contract' | 'Disclosure' | 'Image' | 'Blueprint' | 'Other'>('Contract');

  const entityDocs = documents.filter(d => d.entityId === entityId);

  const simulateUpload = (name: string) => {
    setIsUploading(true);
    setUploadProgress(0);
    setFileName(name);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Add to store
          addDocument({
            entityId,
            name,
            size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
            category,
            url: "#"
          });

          setIsUploading(false);
          setFileName("");
          toast.success("Document uploaded successfully.");
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      simulateUpload(files[0].name);
    }
  };

  const handleDelete = (id: string) => {
    deleteDocument(id);
    toast.success("Document deleted.");
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "Contract": return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "Disclosure": return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "Image": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "Blueprint": return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      default: return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
      <div className="border-b border-border pb-3 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h4 className="text-[15.5px] font-bold text-foreground">Document Repository</h4>
          <p className="text-[12px] text-muted-foreground mt-0.5">Manage contracts, disclosures, blueprints, and files</p>
        </div>
        
        {/* Category selector */}
        <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
          <span className="text-[11px] font-bold text-muted-foreground uppercase">Upload Category:</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as 'Contract' | 'Disclosure' | 'Image' | 'Blueprint' | 'Other')}
            className="text-[12px] border border-border bg-muted/20 text-foreground rounded px-2 py-1 outline-none font-bold"
          >
            <option value="Contract">Contract</option>
            <option value="Disclosure">Disclosure</option>
            <option value="Image">Image / Gallery</option>
            <option value="Blueprint">CAD Blueprint</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* Upload Dropzone (Col 4) */}
        <div className="md:col-span-4">
          <label className="border-2 border-dashed border-border hover:border-primary/50 bg-muted/5 hover:bg-muted/10 rounded-lg p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all h-[155px] relative group select-none">
            <input
              type="file"
              onChange={handleFileChange}
              disabled={isUploading}
              className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            
            {isUploading ? (
              <div className="w-full space-y-2.5">
                <div className="h-8 w-8 border-[3px] border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto" />
                <div className="text-center">
                  <p className="text-[12px] font-bold text-foreground truncate max-w-[150px] mx-auto">Uploading {fileName}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{uploadProgress}% complete</p>
                </div>
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary group-hover:scale-105 transition-transform">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[12.5px] font-bold text-foreground block">Choose Document</span>
                  <span className="text-[10.5px] text-muted-foreground mt-0.5 block">PDF, DOC, PNG up to 10MB</span>
                </div>
              </div>
            )}
          </label>
        </div>

        {/* Files List (Col 8) */}
        <div className="md:col-span-8 space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
          {entityDocs.length === 0 ? (
            <div className="border border-dashed border-border rounded-lg py-12 text-center text-[12.5px] text-muted-foreground bg-muted/5 font-medium">
              No documents uploaded yet.
            </div>
          ) : (
            entityDocs.map(doc => (
              <div
                key={doc.id}
                className="border border-border/80 hover:border-border rounded-lg p-3 bg-muted/10 flex items-center justify-between gap-3 group transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 bg-primary/10 rounded flex items-center justify-center shrink-0 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-[13px] font-bold text-foreground truncate leading-snug group-hover:text-primary transition-colors">
                      {doc.name}
                    </h5>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[9.5px] font-extrabold uppercase px-1.5 py-0.2 rounded border ${getCategoryColor(doc.category)}`}>
                        {doc.category}
                      </span>
                      <span className="text-[10.5px] text-muted-foreground font-semibold">
                        {doc.size} &bull; {doc.uploadedAt}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <a
                    href={doc.url}
                    className="h-8 w-8 rounded hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-all"
                    title="Download File"
                    onClick={(e) => {
                      e.preventDefault();
                      toast.success(`Downloaded: ${doc.name}`);
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="h-8 w-8 rounded hover:bg-danger/10 text-muted-foreground hover:text-danger flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                    title="Delete File"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
