import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface BookingInput {
    customerName: string;
    serviceType: ServiceType;
    scheduledTime: Time;
    address: string;
    phone: string;
}
export interface Booking {
    id: bigint;
    customerName: string;
    status: BookingStatus;
    serviceType: ServiceType;
    scheduledTime: Time;
    createdAt: Time;
    address: string;
    phone: string;
}
export interface BookingStats {
    chimneyCleaning: bigint;
    hobService: bigint;
    chimneyInspection: bigint;
    chimneyRepair: bigint;
    stoveService: bigint;
}
export interface UserProfile {
    name: string;
    address: string;
    phone: string;
}
export enum BookingStatus {
    scheduled = "scheduled",
    canceled = "canceled",
    completed = "completed"
}
export enum ServiceType {
    chimneyCleaning = "chimneyCleaning",
    hobService = "hobService",
    chimneyInspection = "chimneyInspection",
    chimneyRepair = "chimneyRepair",
    stoveService = "stoveService"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBooking(input: BookingInput): Promise<bigint>;
    filterByCustomerName(searchTerm: string): Promise<Array<Booking>>;
    filterByDateRange(startTime: Time, endTime: Time): Promise<Array<Booking>>;
    filterByServiceType(serviceType: ServiceType): Promise<Array<Booking>>;
    getAllBookings(): Promise<Array<Booking>>;
    getBooking(id: bigint): Promise<Booking>;
    getBookingStats(): Promise<BookingStats>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateBookingStatus(id: bigint, newStatus: BookingStatus): Promise<void>;
}
