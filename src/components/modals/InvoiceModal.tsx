import React from 'react';
import { Transaction } from '@/data/mockTransactions';
import { Printer, X, FileText, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface InvoiceModalProps {
  tx: Transaction;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ tx, onClose }) => {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      {/* Self-contained CSS injection for page isolation during print */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #print-invoice-area, #print-invoice-area * {
            visibility: visible;
          }
          #print-invoice-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: #1a202c !important;
            padding: 2rem !important;
            box-shadow: none !important;
            border: none !important;
          }
          .print-hidden {
            display: none !important;
          }
        }
      `}} />

      <div
        id="print-invoice-area"
        className="bg-card border border-border rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col"
      >
        {/* Header (Hidden during printing) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-[#ebe9fc]/20 dark:bg-slate-800/50 print-hidden">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span className="text-[15px] font-bold text-foreground">Transaction Invoice</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Invoice Body */}
        <div className="p-8 space-y-6 overflow-y-auto max-h-[80vh]">
          {/* Top Row: Logo & Invoice details */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-extrabold text-primary tracking-tight">waveron</h1>
              <p className="text-[12px] text-muted-foreground mt-1">
                Premium Real Estate CRM & Brokerage
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                100 Pine Street, San Francisco, CA 94111
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-bold text-foreground uppercase">Invoice</h2>
              <p className="text-[12px] text-muted-foreground mt-1">
                Invoice ID: <span className="font-semibold text-foreground">{tx.id}</span>
              </p>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                Date: <span className="font-semibold text-foreground">{tx.date}</span>
              </p>
            </div>
          </div>

          <hr className="border-border" />

          {/* Parties Row */}
          <div className="grid grid-cols-2 gap-8 text-[13px]">
            <div>
              <h3 className="font-bold text-muted-foreground uppercase text-[11px] tracking-wider mb-2">
                Billed To
              </h3>
              <p className="font-bold text-foreground">{tx.customerName}</p>
              <p className="text-muted-foreground mt-1">Customer Account</p>
              <p className="text-muted-foreground mt-0.5">Payment Method: {tx.paymentMethod}</p>
              {tx.cardNumber && (
                <p className="text-muted-foreground mt-0.5">Details: {tx.cardNumber}</p>
              )}
            </div>
            <div>
              <h3 className="font-bold text-muted-foreground uppercase text-[11px] tracking-wider mb-2">
                Brokerage Representative
              </h3>
              <p className="font-bold text-foreground">{tx.agentName}</p>
              <p className="text-muted-foreground mt-1">Licensed Real Estate Agent</p>
              <p className="text-muted-foreground mt-0.5">waveron Agent Network</p>
            </div>
          </div>

          {/* Details Table */}
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse text-[13px]">
              <thead className="bg-muted/50 font-semibold text-foreground border-b border-border">
                <tr>
                  <th className="px-4 py-2.5">Item & Property Details</th>
                  <th className="px-4 py-2.5 text-right w-32">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground">
                <tr>
                  <td className="px-4 py-4">
                    <p className="font-bold">Property Investment Purchase</p>
                    <p className="text-muted-foreground text-[12px] mt-1 leading-relaxed">
                      Location/Address: {tx.propertyAddress}
                    </p>
                    <p className="text-muted-foreground text-[12px] mt-0.5">
                      Type: {tx.paymentType} Payment
                    </p>
                  </td>
                  <td className="px-4 py-4 text-right font-bold text-[14px]">
                    {formatPrice(tx.amount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals & Status */}
          <div className="flex justify-between items-center bg-muted/20 p-4 rounded-lg border border-border">
            <div className="flex items-center gap-2">
              {tx.status === 'Completed' ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="font-bold text-success text-[13px] uppercase">Paid In Full</span>
                </>
              ) : tx.status === 'Pending' ? (
                <>
                  <Clock className="h-5 w-5 text-warning" />
                  <span className="font-bold text-warning text-[13px] uppercase">Payment Pending</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-danger" />
                  <span className="font-bold text-danger text-[13px] uppercase">Cancelled</span>
                </>
              )}
            </div>
            <div className="text-right">
              <span className="text-[12px] text-muted-foreground mr-2 font-medium">Invoice Total:</span>
              <span className="text-lg font-extrabold text-foreground">{formatPrice(tx.amount)}</span>
            </div>
          </div>

          <div className="text-center text-[11px] text-muted-foreground pt-4 border-t border-border border-dashed">
            Thank you for choosing waveron. If you have any questions, please contact support@waveron.com
          </div>
        </div>

        {/* Footer actions (Hidden during printing) */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-muted/15 print-hidden">
          <button
            onClick={handlePrint}
            className="border border-border hover:bg-muted text-muted-foreground hover:text-foreground text-[12.5px] font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="h-4 w-4" /> Print Invoice
          </button>
          <button
            onClick={onClose}
            className="bg-primary hover:bg-primary/95 text-white text-[12.5px] font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
