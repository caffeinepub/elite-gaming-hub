import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DepositRequest {
    id: bigint;
    screenshotNote: string;
    status: DepositRequestStatus;
    screenshotUrl: string;
    timestamp: bigint;
    playerName: string;
    amount: bigint;
}
export interface Match {
    status: string;
    matchId: bigint;
    gameMode: string;
    entryFee: bigint;
    prizePool: bigint;
}
export interface UserProfile {
    name: string;
}
export interface Transaction {
    id: bigint;
    transactionType: string;
    description: string;
    timestamp: bigint;
    amount: bigint;
}
export enum DepositRequestStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    approveDepositRequest(requestId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deductEntryFee(matchId: bigint, amount: bigint): Promise<{
        ok: boolean;
        newBalance: bigint;
        message: string;
    }>;
    getAllDepositRequests(): Promise<Array<DepositRequest>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMatches(): Promise<Array<Match>>;
    getPendingDepositRequests(): Promise<Array<DepositRequest>>;
    getTransactions(): Promise<Array<Transaction>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWalletBalance(): Promise<bigint>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitDepositRequest(amount: bigint, screenshotNote: string, screenshotUrl: string, playerName: string): Promise<{
        ok: boolean;
        requestId: bigint;
    }>;
}
