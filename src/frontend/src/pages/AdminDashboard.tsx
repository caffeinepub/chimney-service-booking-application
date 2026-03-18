import {
  Calendar,
  ChefHat,
  Filter,
  Flame,
  Search,
  Settings,
  Shield,
  TrendingUp,
  Wrench,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { BookingStatus, ServiceType } from "../backend";
import type { Booking } from "../backend";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Skeleton } from "../components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  useGetAllBookings,
  useGetBookingStats,
  useUpdateBookingStatus,
} from "../hooks/useQueries";

const SERVICE_LABELS: Record<ServiceType, string> = {
  [ServiceType.chimneyCleaning]: "Chimney Cleaning",
  [ServiceType.chimneyInspection]: "Chimney Inspection",
  [ServiceType.chimneyRepair]: "Chimney Repair",
  [ServiceType.stoveService]: "Stove Service",
  [ServiceType.hobService]: "Built-in Hob Service",
};

const SERVICE_ICONS: Record<ServiceType, React.ReactNode> = {
  [ServiceType.chimneyCleaning]: <Flame className="h-4 w-4 text-primary" />,
  [ServiceType.chimneyInspection]: <Shield className="h-4 w-4 text-primary" />,
  [ServiceType.chimneyRepair]: <Wrench className="h-4 w-4 text-primary" />,
  [ServiceType.stoveService]: <Settings className="h-4 w-4 text-primary" />,
  [ServiceType.hobService]: <ChefHat className="h-4 w-4 text-primary" />,
};

const STAT_CARDS = [
  { key: "chimneyCleaning" as const, label: "Chimney Cleaning", icon: Flame },
  { key: "chimneyInspection" as const, label: "Inspection", icon: Shield },
  { key: "chimneyRepair" as const, label: "Repair", icon: Wrench },
  { key: "stoveService" as const, label: "Stove Service", icon: Settings },
  { key: "hobService" as const, label: "Hob Service", icon: ChefHat },
];

const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4"];

function getStatusBadge(status: BookingStatus) {
  switch (status) {
    case BookingStatus.scheduled:
      return <Badge variant="default">Scheduled</Badge>;
    case BookingStatus.completed:
      return (
        <Badge className="bg-green-600 hover:bg-green-700 text-white">
          Completed
        </Badge>
      );
    case BookingStatus.canceled:
      return <Badge variant="destructive">Canceled</Badge>;
  }
}

function formatDateTime(time: bigint) {
  return new Date(Number(time) / 1_000_000).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminDashboard() {
  const { data: bookings = [], isLoading } = useGetAllBookings();
  const { data: stats } = useGetBookingStats();
  const updateStatus = useUpdateBookingStatus();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterService, setFilterService] = useState<ServiceType | "all">(
    "all",
  );
  const [filterStatus, setFilterStatus] = useState<BookingStatus | "all">(
    "all",
  );
  const [filterDate, setFilterDate] = useState("");

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking: Booking) => {
      const matchesSearch =
        booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.phone.includes(searchTerm) ||
        booking.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesService =
        filterService === "all" || booking.serviceType === filterService;
      const matchesStatus =
        filterStatus === "all" || booking.status === filterStatus;
      let matchesDate = true;
      if (filterDate) {
        const bd = new Date(Number(booking.scheduledTime) / 1_000_000);
        const fd = new Date(filterDate);
        matchesDate = bd.toDateString() === fd.toDateString();
      }
      return matchesSearch && matchesService && matchesStatus && matchesDate;
    });
  }, [bookings, searchTerm, filterService, filterStatus, filterDate]);

  const hasFilters =
    searchTerm ||
    filterService !== "all" ||
    filterStatus !== "all" ||
    filterDate;

  const handleStatusUpdate = async (id: bigint, status: BookingStatus) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success("Booking status updated");
    } catch {
      toast.error("Failed to update booking status");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterService("all");
    setFilterStatus("all");
    setFilterDate("");
  };

  return (
    <div className="container py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-serif text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage bookings and view service statistics
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-ocid="admin.stats.card">
              {isLoading ? <Skeleton className="h-8 w-12" /> : bookings.length}
            </div>
          </CardContent>
        </Card>
        {STAT_CARDS.map(({ key, label, icon: Icon }, idx) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.06 }}
          >
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{label}</CardTitle>
                <Icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {stats ? (
                    Number(stats[key])
                  ) : (
                    <Skeleton className="h-8 w-8" />
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-xl">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>Search and filter bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Name, phone, address..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  data-ocid="admin.search_input"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Service Type</Label>
              <Select
                value={filterService}
                onValueChange={(v) =>
                  setFilterService(v as ServiceType | "all")
                }
              >
                <SelectTrigger data-ocid="admin.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {Object.entries(ServiceType).map(([, v]) => (
                    <SelectItem key={v} value={v}>
                      {SERVICE_LABELS[v]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={filterStatus}
                onValueChange={(v) =>
                  setFilterStatus(v as BookingStatus | "all")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value={BookingStatus.scheduled}>
                    Scheduled
                  </SelectItem>
                  <SelectItem value={BookingStatus.completed}>
                    Completed
                  </SelectItem>
                  <SelectItem value={BookingStatus.canceled}>
                    Canceled
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  className="pl-10"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-4 text-muted-foreground"
              onClick={clearFilters}
              data-ocid="admin.secondary_button"
            >
              <X className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">
            Bookings ({filteredBookings.length})
          </CardTitle>
          <CardDescription>
            View and manage all service bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3" data-ocid="admin.loading_state">
              {SKELETON_KEYS.map((k) => (
                <Skeleton key={k} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredBookings.length === 0 ? (
            <div
              className="py-12 text-center text-muted-foreground"
              data-ocid="admin.empty_state"
            >
              <Filter className="mx-auto mb-3 h-10 w-10 opacity-30" />
              {bookings.length === 0
                ? "No bookings yet"
                : "No bookings match your filters"}
            </div>
          ) : (
            <div className="overflow-x-auto" data-ocid="admin.table">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Update</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking: Booking, idx: number) => (
                    <TableRow
                      key={booking.id.toString()}
                      data-ocid={`admin.row.item.${idx + 1}`}
                    >
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        #{booking.id.toString()}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {booking.customerName}
                        </div>
                        <div className="max-w-[160px] truncate text-xs text-muted-foreground">
                          {booking.address}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{booking.phone}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {SERVICE_ICONS[booking.serviceType]}
                          <span className="text-sm">
                            {SERVICE_LABELS[booking.serviceType]}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDateTime(booking.scheduledTime)}
                      </TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell>
                        <Select
                          value={booking.status}
                          onValueChange={(v) =>
                            handleStatusUpdate(booking.id, v as BookingStatus)
                          }
                          disabled={updateStatus.isPending}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={BookingStatus.scheduled}>
                              Scheduled
                            </SelectItem>
                            <SelectItem value={BookingStatus.completed}>
                              Completed
                            </SelectItem>
                            <SelectItem value={BookingStatus.canceled}>
                              Canceled
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
