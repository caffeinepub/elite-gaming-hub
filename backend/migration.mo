import List "mo:core/List";
import Nat "mo:core/Nat";

module {
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

  type OldActor = {
    matches : [Match];
  };

  type NewActor = {
    matches : [Match];
    balance : Nat;
    transactionsList : List.List<Transaction>;
  };

  public func run(old : OldActor) : NewActor {
    // Initially, balance is zero and transactionsList is empty
    let transactionsList = List.empty<Transaction>();
    { old with balance = 0; transactionsList };
  };
};
