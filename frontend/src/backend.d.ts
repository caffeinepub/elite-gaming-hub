import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Transaction {
    id: bigint;
    transactionType: string;
    description: string;
    timestamp: bigint;
    amount: bigint;
}
export interface Match {
    status: string;
    matchId: bigint;
    gameMode: string;
    entryFee: bigint;
    prizePool: bigint;
}
export interface backendInterface {
    addTransaction(transactionType: string, amount: bigint, description: string): Promise<void>;
    getMatches(): Promise<Array<Match>>;
    getTransactions(): Promise<Array<Transaction>>;
    getWalletBalance(): Promise<bigint>;
}
