import { useState } from 'react';
import { Wallet, ArrowDownCircle, ArrowUpCircle, Clock, PlusCircle, MinusCircle, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useWalletBalance, useTransactions, useAddTransaction } from '../hooks/useQueries';
import type { Transaction } from '../backend';

function formatCurrency(amount: bigint): string {
  return `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatTimestamp(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  const date = new Date(ms);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function TransactionItem({ tx }: { tx: Transaction }) {
  const isCredit = tx.transactionType === 'credit';
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-dark-bg border border-neon-red/10 hover:border-neon-red/30 transition-colors duration-200">
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
            isCredit ? 'bg-green-500/10 border border-green-500/30' : 'bg-neon-red/10 border border-neon-red/30'
          }`}
        >
          {isCredit ? (
            <ArrowDownCircle className="w-5 h-5 text-green-400" />
          ) : (
            <ArrowUpCircle className="w-5 h-5 text-neon-red" />
          )}
        </div>
        <div>
          <p className="font-rajdhani font-semibold text-foreground text-sm leading-tight">{tx.description}</p>
          <p className="font-rajdhani text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <Clock className="w-3 h-3" />
            {formatTimestamp(tx.timestamp)}
          </p>
        </div>
      </div>
      <span
        className={`font-orbitron font-bold text-sm ${
          isCredit ? 'text-green-400' : 'text-neon-red'
        }`}
      >
        {isCredit ? '+' : '-'}{formatCurrency(tx.amount)}
      </span>
    </div>
  );
}

function WalletSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-44 w-full rounded-2xl bg-card-bg" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-12 rounded-xl bg-card-bg" />
        <Skeleton className="h-12 rounded-xl bg-card-bg" />
      </div>
      <Skeleton className="h-7 w-48 rounded bg-card-bg" />
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-16 w-full rounded-lg bg-card-bg" />
      ))}
    </div>
  );
}

// Simple modal for Add Money / Withdraw
function ActionModal({
  type,
  onClose,
  onConfirm,
  isLoading,
}: {
  type: 'add' | 'withdraw';
  onClose: () => void;
  onConfirm: (amount: number, description: string) => void;
  isLoading: boolean;
}) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const isAdd = type === 'add';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || num <= 0) return;
    onConfirm(num, description || (isAdd ? 'Money added' : 'Withdrawal'));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm bg-card-bg border border-neon-red/40 rounded-2xl p-6 shadow-neon">
        <h3 className="font-orbitron font-bold text-lg text-foreground mb-1 tracking-wide">
          {isAdd ? 'Add Money' : 'Withdraw'}
        </h3>
        <p className="font-rajdhani text-sm text-muted-foreground mb-5">
          {isAdd ? 'Enter the amount you want to add to your wallet.' : 'Enter the amount you want to withdraw.'}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-rajdhani text-sm font-semibold text-muted-foreground block mb-1.5">
              Amount (₹)
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full bg-dark-bg border border-neon-red/30 rounded-lg px-3 py-2.5 font-rajdhani text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-red focus:ring-1 focus:ring-neon-red/40 transition-colors"
              required
            />
          </div>
          <div>
            <label className="font-rajdhani text-sm font-semibold text-muted-foreground block mb-1.5">
              Description (optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isAdd ? 'e.g. UPI Transfer' : 'e.g. Bank Withdrawal'}
              className="w-full bg-dark-bg border border-neon-red/30 rounded-lg px-3 py-2.5 font-rajdhani text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-red focus:ring-1 focus:ring-neon-red/40 transition-colors"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl border border-neon-red/30 font-rajdhani font-semibold text-muted-foreground hover:border-neon-red/60 hover:text-foreground transition-all duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !amount}
              className="flex-1 py-2.5 rounded-xl bg-neon-red font-rajdhani font-bold text-white hover:bg-neon-red-bright transition-all duration-200 shadow-neon disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isAdd ? 'Add Money' : 'Withdraw'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function WalletPage() {
  const { data: balance, isLoading: balanceLoading } = useWalletBalance();
  const { data: transactions, isLoading: txLoading } = useTransactions();
  const addTransaction = useAddTransaction();
  const [modal, setModal] = useState<'add' | 'withdraw' | null>(null);

  const isLoading = balanceLoading || txLoading;

  const handleConfirm = async (amount: number, description: string) => {
    if (!modal) return;
    const type = modal === 'add' ? 'credit' : 'debit';
    await addTransaction.mutateAsync({
      transactionType: type,
      amount: BigInt(Math.round(amount)),
      description,
    });
    setModal(null);
  };

  const sortedTransactions = transactions
    ? [...transactions].sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
    : [];

  return (
    <main className="pt-20 pb-12 min-h-screen bg-dark-bg">
      <div className="max-w-lg mx-auto px-4">
        {/* Page Title */}
        <div className="flex items-center gap-3 mb-6">
          <Wallet
            className="w-7 h-7 text-neon-red"
            style={{ filter: 'drop-shadow(0 0 8px oklch(0.55 0.22 25 / 0.8))' }}
          />
          <h1 className="font-orbitron font-bold text-2xl tracking-widest uppercase text-foreground neon-text">
            Wallet
          </h1>
        </div>

        {isLoading ? (
          <WalletSkeleton />
        ) : (
          <>
            {/* Balance Card */}
            <div className="relative rounded-2xl bg-card-bg border border-neon-red/40 shadow-neon p-6 mb-5 overflow-hidden">
              {/* Decorative glow blob */}
              <div
                className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10 pointer-events-none"
                style={{ background: 'radial-gradient(circle, oklch(0.55 0.22 25) 0%, transparent 70%)' }}
              />
              <p className="font-rajdhani text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                Available Balance
              </p>
              <p
                className="font-orbitron font-bold text-4xl text-foreground"
                style={{ textShadow: '0 0 20px oklch(0.55 0.22 25 / 0.4)' }}
              >
                {formatCurrency(balance ?? BigInt(0))}
              </p>
              <p className="font-rajdhani text-xs text-muted-foreground mt-2 opacity-70">
                Last updated just now
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <button
                onClick={() => setModal('add')}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-neon-red font-orbitron font-bold text-sm text-white uppercase tracking-wider shadow-neon hover:bg-neon-red-bright hover:shadow-neon-lg active:scale-95 transition-all duration-200"
              >
                <PlusCircle className="w-4 h-4" />
                Add Money
              </button>
              <button
                onClick={() => setModal('withdraw')}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-transparent border-2 border-neon-red/60 font-orbitron font-bold text-sm text-neon-red uppercase tracking-wider hover:border-neon-red hover:bg-neon-red/10 hover:shadow-neon active:scale-95 transition-all duration-200"
              >
                <MinusCircle className="w-4 h-4" />
                Withdraw
              </button>
            </div>

            {/* Transaction History */}
            <div>
              <h2 className="font-orbitron font-bold text-base uppercase tracking-widest text-foreground mb-4 flex items-center gap-2">
                <span
                  className="inline-block w-1 h-5 rounded-full bg-neon-red"
                  style={{ boxShadow: '0 0 8px oklch(0.55 0.22 25 / 0.8)' }}
                />
                Transaction History
              </h2>

              {sortedTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 rounded-2xl bg-card-bg border border-neon-red/10">
                  <Clock
                    className="w-12 h-12 text-neon-red/30 mb-3"
                    style={{ filter: 'drop-shadow(0 0 6px oklch(0.55 0.22 25 / 0.3))' }}
                  />
                  <p className="font-orbitron text-sm text-muted-foreground tracking-wide">No transactions yet</p>
                  <p className="font-rajdhani text-xs text-muted-foreground/60 mt-1">
                    Your transaction history will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {sortedTransactions.map((tx) => (
                    <TransactionItem key={Number(tx.id)} tx={tx} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Action Modal */}
      {modal && (
        <ActionModal
          type={modal}
          onClose={() => setModal(null)}
          onConfirm={handleConfirm}
          isLoading={addTransaction.isPending}
        />
      )}
    </main>
  );
}
