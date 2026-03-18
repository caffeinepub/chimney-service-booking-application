import Time "mo:core/Time";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Initialize the access control state for authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Data Types
  type ServiceType = {
    #chimneyCleaning;
    #chimneyInspection;
    #chimneyRepair;
    #stoveService;
    #hobService;
  };

  type BookingStatus = {
    #scheduled;
    #completed;
    #canceled;
  };

  public type Booking = {
    id : Nat;
    customerName : Text;
    phone : Text;
    address : Text;
    serviceType : ServiceType;
    scheduledTime : Time.Time;
    status : BookingStatus;
    createdAt : Time.Time;
  };

  public type BookingInput = {
    customerName : Text;
    phone : Text;
    address : Text;
    serviceType : ServiceType;
    scheduledTime : Time.Time;
  };

  type BookingStats = {
    chimneyCleaning : Nat;
    chimneyInspection : Nat;
    chimneyRepair : Nat;
    stoveService : Nat;
    hobService : Nat;
  };

  public type UserProfile = {
    name : Text;
    phone : Text;
    address : Text;
  };

  // Booking comparison module for sorting
  module Booking {
    public func compare(booking1 : Booking, booking2 : Booking) : Order.Order {
      if (booking1.id < booking2.id) { #less } else if (booking1.id > booking2.id) {
        #greater;
      } else { #equal };
    };
  };

  var nextBookingId = 1;

  // Storage
  let bookings = Map.empty<Nat, Booking>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Helper functions
  func toLower(text : Text) : Text {
    text.map(
      func(c) {
        if (c >= 'A' and c <= 'Z') {
          Char.fromNat32(c.toNat32() + 32);
        } else {
          c;
        };
      }
    );
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
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

  // Create Booking - Public endpoint for customers (no auth required)
  public shared ({ caller }) func createBooking(input : BookingInput) : async Nat {
    // No authorization check - customers can book without login (including guests)
    
    // Validate input
    if (input.customerName.isEmpty()) {
      Runtime.trap("Customer name cannot be empty");
    };

    if (input.phone.isEmpty() or input.phone.size() < 10) {
      Runtime.trap("Phone number must have at least 10 digits");
    };

    if (input.address.isEmpty()) {
      Runtime.trap("Address cannot be empty");
    };

    let bookingId = nextBookingId;

    let newBooking : Booking = {
      id = bookingId;
      customerName = input.customerName;
      phone = input.phone;
      address = input.address;
      serviceType = input.serviceType;
      scheduledTime = input.scheduledTime;
      status = #scheduled;
      createdAt = Time.now();
    };

    bookings.add(bookingId, newBooking);
    nextBookingId += 1;

    bookingId;
  };

  // Get Booking by ID (Admin Only)
  public query ({ caller }) func getBooking(id : Nat) : async Booking {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view bookings");
    };

    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) { booking };
    };
  };

  // Get All Bookings (Admin Only)
  public query ({ caller }) func getAllBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };

    bookings.values().toArray().sort();
  };

  // Update Booking Status (Admin Only)
  public shared ({ caller }) func updateBookingStatus(id : Nat, newStatus : BookingStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update bookings");
    };

    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        let updatedBooking : Booking = {
          id = booking.id;
          customerName = booking.customerName;
          phone = booking.phone;
          address = booking.address;
          serviceType = booking.serviceType;
          scheduledTime = booking.scheduledTime;
          status = newStatus;
          createdAt = booking.createdAt;
        };

        bookings.add(id, updatedBooking);
      };
    };
  };

  // Filter Bookings by Service Type (Admin Only)
  public query ({ caller }) func filterByServiceType(serviceType : ServiceType) : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can filter bookings");
    };

    bookings.values().toArray().filter(
      func(booking) {
        booking.serviceType == serviceType;
      }
    );
  };

  // Filter Bookings by Date Range (Admin Only)
  public query ({ caller }) func filterByDateRange(startTime : Time.Time, endTime : Time.Time) : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can filter bookings");
    };

    bookings.values().toArray().filter(
      func(booking) {
        booking.scheduledTime >= startTime and booking.scheduledTime <= endTime
      }
    );
  };

  // Filter Bookings by Customer Name (Admin Only)
  public query ({ caller }) func filterByCustomerName(searchTerm : Text) : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can filter bookings");
    };

    let lowerSearchTerm = toLower(searchTerm);

    bookings.values().toArray().filter(
      func(booking) {
        toLower(booking.customerName).contains(#text lowerSearchTerm);
      }
    );
  };

  // Get Booking Stats (Admin Only)
  public query ({ caller }) func getBookingStats() : async BookingStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access stats");
    };

    var chimneyCleaning = 0;
    var chimneyInspection = 0;
    var chimneyRepair = 0;
    var stoveService = 0;
    var hobService = 0;

    bookings.values().forEach(
      func(booking) {
        switch (booking.serviceType) {
          case (#chimneyCleaning) { chimneyCleaning += 1 };
          case (#chimneyInspection) { chimneyInspection += 1 };
          case (#chimneyRepair) { chimneyRepair += 1 };
          case (#stoveService) { stoveService += 1 };
          case (#hobService) { hobService += 1 };
        };
      }
    );

    {
      chimneyCleaning;
      chimneyInspection;
      chimneyRepair;
      stoveService;
      hobService;
    };
  };
};
