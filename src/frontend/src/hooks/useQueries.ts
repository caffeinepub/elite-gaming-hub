import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { DepositRequest, Match, Transaction } from "../backend";
import { useActor } from "./useActor";

export function useMatches() {
  const { actor, isFetching } = useActor();

  return useQuery<Match[]>({
    queryKey: ["matches"],
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
    queryKey: ["walletBalance"],
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
    queryKey: ["transactions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTransactions();
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

export function useDeductEntryFee() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      matchId,
      amount,
    }: { matchId: bigint; amount: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deductEntryFee(matchId, amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["walletBalance"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useSubmitDepositRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      amount,
      screenshotNote,
      screenshotUrl,
      playerName,
    }: {
      amount: bigint;
      screenshotNote: string;
      screenshotUrl: string;
      playerName: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitDepositRequest(
        amount,
        screenshotNote,
        screenshotUrl,
        playerName,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["walletBalance"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useAllDepositRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<DepositRequest[]>({
    queryKey: ["allDepositRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDepositRequests();
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

export function useApproveDepositRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.approveDepositRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allDepositRequests"] });
      queryClient.invalidateQueries({ queryKey: ["walletBalance"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}
