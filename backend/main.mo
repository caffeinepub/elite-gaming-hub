import Array "mo:core/Array";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  type Match = {
    matchId : Nat;
    gameMode : Text;
    entryFee : Nat;
    prizePool : Nat;
    status : Text;
  };

  let matches : [Match] = [
    {
      matchId = 1;
      gameMode = "Solo";
      entryFee = 50;
      prizePool = 500;
      status = "Open";
    },
    {
      matchId = 2;
      gameMode = "Solo";
      entryFee = 100;
      prizePool = 1000;
      status = "Closed";
    },
    {
      matchId = 3;
      gameMode = "Duo";
      entryFee = 200;
      prizePool = 2000;
      status = "Open";
    },
    {
      matchId = 4;
      gameMode = "Duo";
      entryFee = 150;
      prizePool = 1500;
      status = "Closed";
    },
  ];

  public query ({ caller }) func getMatches() : async [Match] {
    matches;
  };
};
