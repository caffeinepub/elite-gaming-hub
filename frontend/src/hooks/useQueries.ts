import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Match, Transaction } from '../backend';

export function useMatches() {
  const { actor, isFetching } = useActor();

  return useQuery<Match[]>({
    queryKey: ['matches'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMatches();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

export function useWalletBalance() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['walletBalance'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getWalletBalance();
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

export function useTransactions() {
  const { actor, isFetching } = useActor();

  return useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTransactions();
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

export function useAddTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      transactionType,
      amount,
      description,
    }: {
      transactionType: string;
      amount: bigint;
      description: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addTransaction(transactionType, amount, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['walletBalance'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}
