import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Booking,
  BookingStats,
  BookingStatus,
  ServiceType,
  UserRole,
} from "../backend";
import { useActor } from "./useActor";

export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();
  return useQuery<UserRole>({
    queryKey: ["callerUserRole"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useCreateBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      customerName: string;
      phone: string;
      address: string;
      serviceType: ServiceType;
      scheduledTime: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createBooking(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookingStats"] });
    },
  });
}

export function useGetAllBookings() {
  const { actor, isFetching } = useActor();
  return useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBookingStats() {
  const { actor, isFetching } = useActor();
  return useQuery<BookingStats>({
    queryKey: ["bookingStats"],
    queryFn: async () => {
      if (!actor)
        return {
          chimneyCleaning: BigInt(0),
          chimneyInspection: BigInt(0),
          chimneyRepair: BigInt(0),
          stoveService: BigInt(0),
          hobService: BigInt(0),
        };
      return actor.getBookingStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateBookingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: { id: bigint; status: BookingStatus }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateBookingStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookingStats"] });
    },
  });
}

export function useFilterByServiceType(serviceType: ServiceType | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Booking[]>({
    queryKey: ["bookings", "serviceType", serviceType],
    queryFn: async () => {
      if (!actor || !serviceType) return [];
      return actor.filterByServiceType(serviceType);
    },
    enabled: !!actor && !isFetching && !!serviceType,
  });
}

export function useFilterByDateRange(
  startTime: bigint | null,
  endTime: bigint | null,
) {
  const { actor, isFetching } = useActor();
  return useQuery<Booking[]>({
    queryKey: [
      "bookings",
      "dateRange",
      startTime?.toString(),
      endTime?.toString(),
    ],
    queryFn: async () => {
      if (!actor || startTime === null || endTime === null) return [];
      return actor.filterByDateRange(startTime, endTime);
    },
    enabled: !!actor && !isFetching && startTime !== null && endTime !== null,
  });
}

export function useFilterByCustomerName(searchTerm: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Booking[]>({
    queryKey: ["bookings", "customerName", searchTerm],
    queryFn: async () => {
      if (!actor || !searchTerm) return [];
      return actor.filterByCustomerName(searchTerm);
    },
    enabled: !!actor && !isFetching && searchTerm.length > 0,
  });
}
