import Array "mo:core/Array";
import List "mo:core/List";
import Time "mo:core/Time";
import MixinStorage "blob-storage/Mixin";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  type Match = {
    matchId : Nat;
    gameMode : Text;
    entryFee : Nat;
    prizePool : Nat;
    status : Text;
  };

  type Transaction = {
    id : Nat;
    transactionType : Text;
    amount : Nat;
    description : Text;
    timestamp : Int;
  };

  var balance = 0;
  let transactionsList = List.empty<Transaction>();

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

  public query ({ caller }) func getWalletBalance() : async Nat {
    balance;
  };

  public query ({ caller }) func getTransactions() : async [Transaction] {
    transactionsList.toArray();
  };

  public shared ({ caller }) func addTransaction(transactionType : Text, amount : Nat, description : Text) : async () {
    let newTransaction : Transaction = {
      id = transactionsList.size();
      transactionType;
      amount;
      description;
      timestamp = Time.now();
    };
    transactionsList.add(newTransaction);

    switch (transactionType) {
      case ("credit") { balance += amount };
      case ("debit") { balance -= amount };
      case (_) {};
    };
  };
};
