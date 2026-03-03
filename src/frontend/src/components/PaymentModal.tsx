import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PaymentData, RegistrationData } from "@/types/registration";
import {
  CheckCircle,
  Copy,
  CreditCard,
  ImageIcon,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";

const UPI_ID = "Apna UPI ID eithe likho";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PaymentData) => void;
  entryFee: number;
  registrationData: RegistrationData | null;
  matchId: number;
  gameMode: string;
}

export default function PaymentModal({
  isOpen,
  onClose,
  onSubmit,
  entryFee,
  registrationData,
  matchId,
  gameMode,
}: PaymentModalProps) {
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setScreenshot(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleCopyUPI = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: do nothing
    }
  };

  const handleSubmit = () => {
    if (!screenshot) return;
    onSubmit({ screenshot, uploadedAt: new Date() });
  };

  const handleClose = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setScreenshot(null);
    setPreviewUrl(null);
    setCopied(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent
        className="max-w-md w-full p-0 overflow-hidden border-0 bg-transparent shadow-none"
        style={{ boxShadow: "none" }}
      >
        <div
          className="relative bg-card-bg rounded-lg overflow-hidden"
          style={{
            border: "1px solid oklch(0.55 0.22 25 / 0.7)",
            boxShadow:
              "0 0 12px oklch(0.55 0.22 25 / 0.4), 0 0 40px oklch(0.55 0.22 25 / 0.15), inset 0 0 8px oklch(0.55 0.22 25 / 0.05)",
          }}
        >
          {/* Top accent bar */}
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-neon-red to-transparent" />

          {/* Header */}
          <div className="px-6 pt-5 pb-4 flex items-start justify-between">
            <div>
              <DialogHeader>
                <DialogTitle asChild>
                  <h2 className="font-orbitron font-bold text-lg uppercase tracking-widest text-foreground neon-text flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-neon-red" />
                    Payment
                  </h2>
                </DialogTitle>
                <DialogDescription asChild>
                  <p className="font-rajdhani text-sm text-muted-foreground mt-1 uppercase tracking-wider">
                    Free Fire {gameMode} · Match #{matchId}
                  </p>
                </DialogDescription>
              </DialogHeader>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-neon-red hover:bg-neon-red/10 transition-colors duration-200 ml-4 mt-0.5 flex-shrink-0"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Divider */}
          <div className="mx-6 h-px bg-gradient-to-r from-transparent via-neon-red/20 to-transparent" />

          <div className="px-6 py-5 space-y-5">
            {/* Entry Fee */}
            <div
              className="bg-dark-bg rounded-md px-4 py-3 flex items-center justify-between"
              style={{ border: "1px solid oklch(0.55 0.22 25 / 0.2)" }}
            >
              <span className="font-rajdhani text-sm text-muted-foreground uppercase tracking-wider">
                Entry Fee
              </span>
              <span className="font-orbitron font-bold text-xl text-neon-red-bright neon-text">
                ₹{entryFee}
              </span>
            </div>

            {/* UPI ID Section */}
            <div className="space-y-2">
              <p className="font-rajdhani font-semibold text-xs uppercase tracking-widest text-muted-foreground">
                Pay via UPI
              </p>
              <div
                className="bg-dark-bg rounded-md px-4 py-3 flex items-center justify-between gap-3"
                style={{ border: "1px solid oklch(0.55 0.22 25 / 0.3)" }}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-rajdhani text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                    UPI ID
                  </p>
                  <p className="font-orbitron font-bold text-sm text-foreground truncate">
                    {UPI_ID}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyUPI}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md font-rajdhani font-semibold text-xs uppercase tracking-wider transition-all duration-200 ${
                    copied
                      ? "bg-green-500/15 text-green-400 border border-green-500/30"
                      : "bg-neon-red/10 text-neon-red border border-neon-red/30 hover:bg-neon-red/20"
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </>
                  )}
                </button>
              </div>
              <p className="font-rajdhani text-xs text-muted-foreground/70 tracking-wide">
                Send ₹{entryFee} to the UPI ID above, then upload the payment
                screenshot below.
              </p>
            </div>

            {/* Player Info Summary */}
            {registrationData && (
              <div
                className="bg-dark-bg rounded-md px-4 py-3 space-y-1"
                style={{ border: "1px solid oklch(0.55 0.22 25 / 0.15)" }}
              >
                <p className="font-rajdhani font-semibold text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Player Info
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <div>
                    <p className="font-rajdhani text-xs text-muted-foreground/60 uppercase tracking-wider">
                      Name
                    </p>
                    <p className="font-rajdhani font-semibold text-sm text-foreground">
                      {registrationData.inGameName}
                    </p>
                  </div>
                  <div>
                    <p className="font-rajdhani text-xs text-muted-foreground/60 uppercase tracking-wider">
                      Player ID
                    </p>
                    <p className="font-rajdhani font-semibold text-sm text-foreground">
                      {registrationData.playerId}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Screenshot */}
            <div className="space-y-2">
              <p className="font-rajdhani font-semibold text-xs uppercase tracking-widest text-muted-foreground">
                Payment Screenshot
              </p>

              {previewUrl ? (
                <div
                  className="relative rounded-md overflow-hidden"
                  style={{ border: "1px solid oklch(0.55 0.22 25 / 0.4)" }}
                >
                  <img
                    src={previewUrl}
                    alt="Payment screenshot preview"
                    className="w-full max-h-48 object-contain bg-dark-bg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (previewUrl) URL.revokeObjectURL(previewUrl);
                      setScreenshot(null);
                      setPreviewUrl(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-dark-bg/80 flex items-center justify-center text-muted-foreground hover:text-neon-red transition-colors duration-200"
                    style={{ border: "1px solid oklch(0.55 0.22 25 / 0.3)" }}
                    aria-label="Remove screenshot"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-6 rounded-md flex flex-col items-center justify-center gap-2 bg-dark-bg transition-all duration-200 hover:border-neon-red/50 hover:bg-neon-red/5 cursor-pointer"
                  style={{ border: "1px dashed oklch(0.55 0.22 25 / 0.3)" }}
                >
                  <div className="w-10 h-10 rounded-full bg-neon-red/10 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-neon-red/70" />
                  </div>
                  <div className="text-center">
                    <p className="font-rajdhani font-semibold text-sm text-foreground">
                      Upload Screenshot
                    </p>
                    <p className="font-rajdhani text-xs text-muted-foreground/60 mt-0.5">
                      PNG, JPG, JPEG accepted
                    </p>
                  </div>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload payment screenshot"
              />

              {!previewUrl && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 rounded-md font-rajdhani font-semibold text-sm uppercase tracking-wider bg-neon-red/10 text-neon-red border border-neon-red/30 hover:bg-neon-red/20 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Choose Screenshot
                </button>
              )}
            </div>

            {/* Confirm Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!screenshot}
              className={`w-full py-3 rounded-md font-orbitron font-bold text-sm uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 ${
                screenshot
                  ? "bg-neon-red text-white hover:bg-neon-red-bright neon-glow hover:shadow-neon-lg active:scale-95 cursor-pointer"
                  : "bg-foreground/5 text-muted-foreground cursor-not-allowed border border-foreground/10"
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Confirm Payment
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
