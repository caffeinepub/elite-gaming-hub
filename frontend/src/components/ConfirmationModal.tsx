import { CheckCircle, X, Trophy, User, Hash, Phone } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { RegistrationData } from '@/types/registration';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchId: number;
  gameMode: string;
  entryFee: number;
  prizePool: number;
  registrationData: RegistrationData | null;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  matchId,
  gameMode,
  entryFee,
  prizePool,
  registrationData,
}: ConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent
        className="max-w-md w-full p-0 overflow-hidden border-0 bg-transparent shadow-none"
        style={{ boxShadow: 'none' }}
      >
        <div
          className="relative bg-card-bg rounded-lg overflow-hidden"
          style={{
            border: '1px solid oklch(0.55 0.22 25 / 0.7)',
            boxShadow: '0 0 12px oklch(0.55 0.22 25 / 0.4), 0 0 40px oklch(0.55 0.22 25 / 0.15), inset 0 0 8px oklch(0.55 0.22 25 / 0.05)',
          }}
        >
          {/* Top accent bar */}
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-neon-red to-transparent" />

          {/* Header */}
          <div className="px-6 pt-5 pb-4 flex items-start justify-between">
            <DialogHeader>
              <DialogTitle asChild>
                <h2 className="font-orbitron font-bold text-lg uppercase tracking-widest text-foreground neon-text">
                  Registration Successful!
                </h2>
              </DialogTitle>
              <DialogDescription asChild>
                <p className="font-rajdhani text-sm text-muted-foreground mt-1 uppercase tracking-wider">
                  Your payment is being verified
                </p>
              </DialogDescription>
            </DialogHeader>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-neon-red hover:bg-neon-red/10 transition-colors duration-200 ml-4 mt-0.5 flex-shrink-0"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Divider */}
          <div className="mx-6 h-px bg-gradient-to-r from-transparent via-neon-red/20 to-transparent" />

          <div className="px-6 py-5 space-y-5">
            {/* Success Icon */}
            <div className="flex flex-col items-center py-3">
              <div
                className="w-16 h-16 rounded-full bg-neon-red/10 flex items-center justify-center mb-3"
                style={{ border: '2px solid oklch(0.55 0.22 25 / 0.5)', boxShadow: '0 0 20px oklch(0.55 0.22 25 / 0.3)' }}
              >
                <CheckCircle className="w-8 h-8 text-neon-red" />
              </div>
              <p className="font-rajdhani font-semibold text-base text-foreground text-center">
                You're registered! We'll confirm your slot once payment is verified.
              </p>
            </div>

            {/* Match Details */}
            <div className="bg-dark-bg rounded-md px-4 py-3 space-y-2"
              style={{ border: '1px solid oklch(0.55 0.22 25 / 0.2)' }}>
              <p className="font-rajdhani font-semibold text-xs uppercase tracking-widest text-muted-foreground mb-2">Match Details</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-neon-red/70" />
                  <span className="font-rajdhani text-sm text-muted-foreground uppercase tracking-wider">Free Fire {gameMode}</span>
                </div>
                <span className="font-orbitron font-bold text-sm text-foreground">Match #{matchId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-rajdhani text-sm text-muted-foreground uppercase tracking-wider">Entry Fee</span>
                <span className="font-orbitron font-bold text-sm text-neon-red">₹{entryFee}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-rajdhani text-sm text-muted-foreground uppercase tracking-wider">Prize Pool</span>
                <span className="font-orbitron font-bold text-sm text-neon-red-bright neon-text">₹{prizePool}</span>
              </div>
            </div>

            {/* Player Info */}
            {registrationData && (
              <div className="bg-dark-bg rounded-md px-4 py-3 space-y-2"
                style={{ border: '1px solid oklch(0.55 0.22 25 / 0.15)' }}>
                <p className="font-rajdhani font-semibold text-xs uppercase tracking-widest text-muted-foreground mb-2">Your Details</p>
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-neon-red/60" />
                  <span className="font-rajdhani text-sm text-muted-foreground uppercase tracking-wider w-24">Name</span>
                  <span className="font-rajdhani font-semibold text-sm text-foreground">{registrationData.inGameName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-neon-red/60" />
                  <span className="font-rajdhani text-sm text-muted-foreground uppercase tracking-wider w-24">Player ID</span>
                  <span className="font-rajdhani font-semibold text-sm text-foreground">{registrationData.playerId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-neon-red/60" />
                  <span className="font-rajdhani text-sm text-muted-foreground uppercase tracking-wider w-24">WhatsApp</span>
                  <span className="font-rajdhani font-semibold text-sm text-foreground">{registrationData.whatsappNumber}</span>
                </div>
              </div>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-md font-orbitron font-bold text-sm uppercase tracking-widest bg-neon-red text-white hover:bg-neon-red-bright neon-glow hover:shadow-neon-lg active:scale-95 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
