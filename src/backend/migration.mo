import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  type OldServiceType = {
    #cleaning;
    #inspection;
    #repair;
  };

  type OldBooking = {
    id : Nat;
    customerName : Text;
    phone : Text;
    address : Text;
    serviceType : OldServiceType;
    scheduledTime : Int;
    status : {
      #scheduled;
      #completed;
      #canceled;
    };
    createdAt : Int;
  };

  type OldActor = {
    bookings : Map.Map<Nat, OldBooking>;
    nextBookingId : Nat;
  };

  type NewBooking = {
    id : Nat;
    customerName : Text;
    phone : Text;
    address : Text;
    serviceType : {
      #chimneyCleaning;
      #chimneyInspection;
      #chimneyRepair;
      #stoveService;
      #hobService;
    };
    scheduledTime : Int;
    status : { #scheduled; #completed; #canceled };
    createdAt : Int;
  };

  type NewActor = {
    bookings : Map.Map<Nat, NewBooking>;
    nextBookingId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newBookings = old.bookings.map<Nat, OldBooking, NewBooking>(
      func(_id, oldBooking) {
        { oldBooking with serviceType = convertServiceType(oldBooking.serviceType) };
      }
    );
    { old with bookings = newBookings };
  };

  func convertServiceType(oldType : OldServiceType) : { #chimneyCleaning; #chimneyInspection; #chimneyRepair; #stoveService; #hobService } {
    switch (oldType) {
      case (#cleaning) { #chimneyCleaning };
      case (#inspection) { #chimneyInspection };
      case (#repair) { #chimneyRepair };
    };
  };
};
