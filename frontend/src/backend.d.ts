import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Match {
    status: string;
    matchId: bigint;
    gameMode: string;
    entryFee: bigint;
    prizePool: bigint;
}
export interface backendInterface {
    getMatches(): Promise<Array<Match>>;
}
