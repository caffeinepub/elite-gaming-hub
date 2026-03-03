import { HttpAgent } from "@icp-sdk/core/agent";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle,
  Copy,
  ImageIcon,
  Loader2,
  Upload,
  Wallet,
} from "lucide-react";
import { useRef, useState } from "react";
import { loadConfig } from "../config";
import { useSubmitDepositRequest } from "../hooks/useQueries";
import { StorageClient } from "../utils/StorageClient";

interface AddMoneyContext {
  requiredAmount?: number;
  currentBalance?: number;
}

const UPI_ID = "8728872927@fam";

export default function AddMoneyPage() {
  const navigate = useNavigate();
  const submitDeposit = useSubmitDepositRequest();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Read context from sessionStorage
  const addMoneyContext = (() => {
    try {
      const raw = sessionStorage.getItem("addMoneyContext");
      return raw ? (JSON.parse(raw) as AddMoneyContext) : {};
    } catch {
      return {};
    }
  })();

  const { requiredAmount, currentBalance } = addMoneyContext;
  const shortfall =
    requiredAmount != null && currentBalance != null
      ? Math.max(0, requiredAmount - currentBalance)
      : null;

  const [playerName, setPlayerName] = useState("");
  const [amount, setAmount] = useState(shortfall ? String(shortfall) : "");
  const [transactionId, setTransactionId] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(
    null,
  );
  const [upiCopied, setUpiCopied] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshotFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setScreenshotPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCopyUPI = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setUpiCopied(true);
      setTimeout(() => setUpiCopied(false), 2000);
    } catch {
      // fallback: do nothing
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number.parseFloat(amount);
    if (!numAmount || numAmount <= 0) return;

    let screenshotNote = `Amount: ₹${numAmount} | TxnID: ${transactionId}`;
    let screenshotUrl = "";

    if (screenshotFile) {
      screenshotNote += ` | File: ${screenshotFile.name}`;
      setUploadProgress(0);

      try {
        // Read file as bytes
        const arrayBuffer = await screenshotFile.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);

        // Set up StorageClient for blob upload
        const config = await loadConfig();
        const agent = new HttpAgent({ host: config.backend_host });
        if (config.backend_host?.includes("localhost")) {
          await agent.fetchRootKey().catch(() => {});
        }
        const storageClient = new StorageClient(
          config.bucket_name,
          config.storage_gateway_url,
          config.backend_canister_id,
          config.project_id,
          agent,
        );

        // Upload file and get direct URL
        const { hash } = await storageClient.putFile(bytes, (pct) => {
          setUploadProgress(Math.min(pct, 95));
        });
        screenshotUrl = await storageClient.getDirectURL(hash);
        setUploadProgress(100);
      } catch {
        // If upload fails, continue with empty URL so the request still submits
        screenshotUrl = "";
        setUploadProgress(0);
      }
    }

    try {
      await submitDeposit.mutateAsync({
        amount: BigInt(Math.round(numAmount)),
        screenshotNote,
        screenshotUrl,
        playerName: playerName.trim(),
      });
    } catch {
      setUploadProgress(0);
      return;
    }

    setIsSuccess(true);
  };

  const isFormValid =
    playerName.trim().length > 0 &&
    amount.trim().length > 0 &&
    Number.parseFloat(amount) > 0 &&
    transactionId.trim().length > 0 &&
    screenshotFile !== null;
  const isPending = submitDeposit.isPending;

  // Success screen
  if (isSuccess) {
    return (
      <main className="pt-16 min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="max-w-lg mx-auto px-4 py-8 w-full">
          <div className="relative bg-card-bg rounded-2xl overflow-hidden neon-border shadow-neon text-center px-6 py-10">
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-neon-red to-transparent absolute top-0 left-0" />
            <div className="w-16 h-16 rounded-full bg-green-500/10 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-9 h-9 text-green-400" />
            </div>
            <h2 className="font-orbitron font-bold text-xl uppercase tracking-widest text-foreground mb-3">
              Request Submitted!
            </h2>
            <p className="font-rajdhani text-sm text-muted-foreground mb-2 leading-relaxed">
              Your payment screenshot has been submitted successfully.
            </p>
            <p className="font-rajdhani text-sm text-muted-foreground mb-8 leading-relaxed">
              Your balance will be updated after admin approval. This usually
              takes a few minutes.
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => navigate({ to: "/" })}
                className="w-full py-3 rounded-md font-orbitron font-bold text-sm uppercase tracking-widest bg-neon-red text-white hover:bg-neon-red-bright neon-glow hover:shadow-neon-lg active:scale-95 transition-all duration-200"
              >
                Back to Matches
              </button>
              <button
                type="button"
                onClick={() => navigate({ to: "/wallet" })}
                className="w-full py-3 rounded-md font-orbitron font-bold text-sm uppercase tracking-widest border border-neon-red/40 text-neon-red hover:bg-neon-red/10 hover:border-neon-red transition-all duration-200"
              >
                View Wallet
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-16 min-h-screen bg-dark-bg">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Back Navigation */}
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="flex items-center gap-2 text-muted-foreground hover:text-neon-red transition-colors duration-200 mb-6 group"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-rajdhani text-sm uppercase tracking-wider font-semibold">
            Back to Matches
          </span>
        </button>

        {/* Page Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-7 bg-neon-red rounded-full neon-glow-sm" />
            <h1 className="font-orbitron font-bold text-xl sm:text-2xl uppercase tracking-widest text-foreground">
              Add Money
            </h1>
          </div>
          <p className="font-rajdhani text-sm text-muted-foreground ml-3 uppercase tracking-wider">
            Top up your wallet via UPI
          </p>
        </div>

        {/* Insufficient Balance Banner */}
        {shortfall !== null && shortfall > 0 && (
          <div className="mb-5 px-4 py-3.5 rounded-lg bg-neon-red/10 border border-neon-red/40 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-neon-red flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-rajdhani font-bold text-sm text-neon-red uppercase tracking-wide">
                Insufficient Balance
              </p>
              <p className="font-rajdhani text-sm text-muted-foreground mt-0.5">
                You need{" "}
                <span className="text-foreground font-semibold">
                  ₹{requiredAmount}
                </span>{" "}
                to join this match. Your current balance is{" "}
                <span className="text-foreground font-semibold">
                  ₹{currentBalance}
                </span>
                . Please add at least{" "}
                <span className="text-neon-red font-bold">₹{shortfall}</span>.
              </p>
            </div>
          </div>
        )}

        {/* UPI Payment Card */}
        <div className="relative bg-card-bg rounded-xl overflow-hidden neon-border mb-5">
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-neon-red to-transparent" />
          <div className="px-5 py-5">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="w-5 h-5 text-neon-red" />
              <h2 className="font-orbitron font-bold text-sm uppercase tracking-widest text-foreground">
                Pay via UPI
              </h2>
            </div>

            {/* Step 1 */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-6 h-6 rounded-full bg-neon-red flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="font-orbitron font-bold text-xs text-white">
                  1
                </span>
              </div>
              <div className="flex-1">
                <p className="font-rajdhani font-semibold text-sm text-foreground mb-2 uppercase tracking-wide">
                  Send payment to this UPI ID
                </p>
                <div className="flex items-center gap-2 bg-dark-bg border border-neon-red/30 rounded-lg px-3 py-2.5">
                  <span className="font-orbitron font-bold text-sm text-neon-red-bright neon-text flex-1 tracking-wider">
                    {UPI_ID}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyUPI}
                    className="flex items-center gap-1 text-xs font-rajdhani font-semibold text-muted-foreground hover:text-neon-red transition-colors duration-200 flex-shrink-0"
                    aria-label="Copy UPI ID"
                  >
                    {upiCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-neon-red/20 border border-neon-red/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="font-orbitron font-bold text-xs text-neon-red">
                  2
                </span>
              </div>
              <p className="font-rajdhani font-semibold text-sm text-muted-foreground uppercase tracking-wide mt-0.5">
                Take a screenshot of the payment confirmation
              </p>
            </div>
          </div>
        </div>

        {/* Upload Form */}
        <form
          onSubmit={handleSubmit}
          className="relative bg-card-bg rounded-xl overflow-hidden neon-border"
        >
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-neon-red to-transparent" />
          <div className="px-5 py-5 space-y-5">
            {/* Player Name Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="playerName"
                className="font-rajdhani text-sm font-semibold uppercase tracking-wider text-foreground block"
              >
                Player Name <span className="text-neon-red">*</span>
              </label>
              <input
                id="playerName"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your in-game name"
                className="w-full bg-dark-bg border border-neon-red/20 rounded-md px-3 py-2.5 font-rajdhani text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:ring-1 focus:border-neon-red/60 focus:ring-neon-red/20 hover:border-neon-red/40"
                required
                disabled={isPending}
                data-ocid="add_money.player_name_input"
              />
            </div>

            {/* Amount Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="amount"
                className="font-rajdhani text-sm font-semibold uppercase tracking-wider text-foreground block"
              >
                Amount (₹) <span className="text-neon-red">*</span>
              </label>
              <input
                id="amount"
                type="number"
                min="1"
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount you paid"
                className="w-full bg-dark-bg border border-neon-red/20 rounded-md px-3 py-2.5 font-rajdhani text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:ring-1 focus:border-neon-red/60 focus:ring-neon-red/20 hover:border-neon-red/40"
                required
                disabled={isPending}
              />
            </div>

            {/* Transaction ID Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="transactionId"
                className="font-rajdhani text-sm font-semibold uppercase tracking-wider text-foreground block"
              >
                Transaction ID <span className="text-neon-red">*</span>
              </label>
              <input
                id="transactionId"
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter UPI Transaction ID"
                className="w-full bg-dark-bg border border-neon-red/20 rounded-md px-3 py-2.5 font-rajdhani text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:ring-1 focus:border-neon-red/60 focus:ring-neon-red/20 hover:border-neon-red/40"
                required
                disabled={isPending}
                data-ocid="add_money.transaction_id_input"
              />
            </div>

            {/* Screenshot Upload */}
            <div className="space-y-1.5">
              <label
                htmlFor="screenshotUpload"
                className="font-rajdhani text-sm font-semibold uppercase tracking-wider text-foreground block"
              >
                Payment Screenshot <span className="text-neon-red">*</span>
              </label>

              {screenshotPreview ? (
                <div className="relative rounded-lg overflow-hidden border border-neon-red/30 bg-dark-bg">
                  <img
                    src={screenshotPreview}
                    alt="Payment screenshot preview"
                    className="w-full max-h-48 object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setScreenshotFile(null);
                      setScreenshotPreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute top-2 right-2 bg-neon-red/80 hover:bg-neon-red text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold transition-colors"
                    aria-label="Remove screenshot"
                  >
                    ✕
                  </button>
                  <div className="px-3 py-2 border-t border-neon-red/20">
                    <p className="font-rajdhani text-xs text-muted-foreground truncate">
                      {screenshotFile?.name}
                    </p>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isPending}
                  className="w-full border-2 border-dashed border-neon-red/30 hover:border-neon-red/60 rounded-lg px-4 py-8 flex flex-col items-center justify-center gap-3 transition-all duration-200 bg-dark-bg hover:bg-neon-red/5 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  data-ocid="add_money.upload_button"
                >
                  <div className="w-12 h-12 rounded-full bg-neon-red/10 border border-neon-red/30 flex items-center justify-center group-hover:bg-neon-red/20 transition-colors">
                    <ImageIcon className="w-6 h-6 text-neon-red/70 group-hover:text-neon-red transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="font-rajdhani font-semibold text-sm text-foreground">
                      Click to upload screenshot
                    </p>
                    <p className="font-rajdhani text-xs text-muted-foreground mt-0.5">
                      PNG, JPG, JPEG up to 10MB
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-rajdhani font-semibold text-neon-red uppercase tracking-wider">
                    <Upload className="w-3.5 h-3.5" />
                    Browse Files
                  </div>
                </button>
              )}

              <input
                id="screenshotUpload"
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload payment screenshot"
              />
            </div>

            {/* Upload progress bar */}
            {isPending && uploadProgress > 0 && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-rajdhani text-xs text-muted-foreground uppercase tracking-wider">
                    Uploading…
                  </span>
                  <span className="font-orbitron text-xs text-neon-red">
                    {uploadProgress}%
                  </span>
                </div>
                <div className="h-1.5 bg-dark-bg rounded-full overflow-hidden border border-neon-red/20">
                  <div
                    className="h-full bg-neon-red rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error message */}
            {submitDeposit.isError && (
              <div className="px-3 py-2.5 rounded-lg bg-neon-red/10 border border-neon-red/40 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-neon-red flex-shrink-0" />
                <p className="font-rajdhani text-sm text-neon-red">
                  Failed to submit request. Please try again.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isPending}
              data-ocid="add_money.submit_button"
              className={`w-full py-3 rounded-md font-orbitron font-bold text-sm uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 ${
                isFormValid && !isPending
                  ? "bg-neon-red text-white hover:bg-neon-red-bright neon-glow hover:shadow-neon-lg active:scale-95 cursor-pointer"
                  : "bg-foreground/5 text-muted-foreground cursor-not-allowed border border-foreground/10"
              }`}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Submit for Approval
                </>
              )}
            </button>

            <p className="font-rajdhani text-xs text-muted-foreground text-center leading-relaxed">
              After submitting, your balance will be updated once the admin
              approves your payment. This usually takes a few minutes.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
