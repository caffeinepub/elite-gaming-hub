import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Iter "mo:core/Iter";



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

  public type DepositRequestStatus = {
    #pending;
    #approved;
    #rejected;
  };

  public type DepositRequest = {
    id : Nat;
    amount : Nat;
    screenshotNote : Text;
    screenshotUrl : Text;
    playerName : Text;
    status : DepositRequestStatus;
    timestamp : Int;
  };

  public type UserProfile = {
    name : Text;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var balance = 0;
  let transactionsList = List.empty<Transaction>();
  let depositRequestsList = List.empty<DepositRequest>();
  let userProfiles = Map.empty<Principal, UserProfile>();

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

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getMatches() : async [Match] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can view matches");
    };
    matches;
  };

  public query ({ caller }) func getWalletBalance() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can view wallet balance");
    };
    balance;
  };

  public query ({ caller }) func getTransactions() : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can view transactions");
    };
    transactionsList.toArray();
  };

  // Returns (ok, newBalance, message)
  public shared ({ caller }) func deductEntryFee(matchId : Nat, amount : Nat) : async { ok : Bool; newBalance : Nat; message : Text } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can deduct entry fees");
    };

    if (balance >= amount) {
      let newTransaction : Transaction = {
        id = transactionsList.size();
        transactionType = "debit";
        amount;
        description = "Entry fee for match #" # matchId.toText();
        timestamp = Time.now();
      };
      transactionsList.add(newTransaction);
      balance -= amount;
      { ok = true; newBalance = balance; message = "Entry fee deducted successfully" };
    } else {
      { ok = false; newBalance = balance; message = "Insufficient balance" };
    };
  };

  public shared ({ caller }) func submitDepositRequest(
    amount : Nat,
    screenshotNote : Text,
    screenshotUrl : Text,
    playerName : Text,
  ) : async { ok : Bool; requestId : Nat } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can submit deposit requests");
    };
    let newRequest : DepositRequest = {
      id = depositRequestsList.size();
      amount;
      screenshotNote;
      screenshotUrl;
      playerName;
      status = #pending;
      timestamp = Time.now();
    };
    depositRequestsList.add(newRequest);
    { ok = true; requestId = newRequest.id };
  };

  public query ({ caller }) func getAllDepositRequests() : async [DepositRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all deposit requests");
    };
    depositRequestsList.toArray();
  };

  public query ({ caller }) func getPendingDepositRequests() : async [DepositRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view pending deposit requests");
    };
    depositRequestsList.values().toArray().filter(
      func(request : DepositRequest) : Bool {
        switch (request.status) {
          case (#pending) { true };
          case (_) { false };
        };
      }
    );
  };

  public shared ({ caller }) func approveDepositRequest(requestId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve deposit requests");
    };

    let requestIter = depositRequestsList.values();
    let requestArray = requestIter.toArray();
    if (requestArray.size() == 0) {
      Runtime.trap("No deposit requests found for approval");
    };

    // Find the index of the request to approve
    func findIndex(array : [DepositRequest], compareId : Nat) : ?Nat {
      var i = 0;
      while (i < array.size()) {
        if (array[i].id == compareId) { return ?i };
        i += 1;
      };
      null;
    };

    switch (findIndex(requestArray, requestId)) {
      case (null) {
        Runtime.trap(
          "Deposit request with id " # requestId.toText() # " not found for approval"
        );
      };
      case (?updatedIndex) {
        // Update the deposit request status to approved
        let updatedRequest = {
          requestArray[updatedIndex] with
          status = #approved
        };

        // Rebuild array with the updated request
        func updateArray(array : [DepositRequest], index : Nat, updated : DepositRequest) : [DepositRequest] {
          Array.tabulate(
            array.size(),
            func(i) {
              if (i == index) { updated } else { array[i] };
            },
          );
        };

        let updatedArray = updateArray(requestArray, updatedIndex, updatedRequest);

        // Clear and re-populate the depositRequestsList
        depositRequestsList.clear();
        let updatedIter = updatedArray.values();
        updatedIter.forEach(
          func(request) {
            depositRequestsList.add(request);
          }
        );

        // Add transaction and increase balance with amount of approved deposit request
        let newTransaction : Transaction = {
          id = transactionsList.size();
          transactionType = "credit";
          amount = updatedRequest.amount;
          description = "Deposit via request id: " # requestId.toText();
          timestamp = Time.now();
        };
        transactionsList.add(newTransaction);
        balance += updatedRequest.amount;
      };
    };
  };
};
