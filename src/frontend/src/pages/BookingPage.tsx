import {
  Calendar,
  CheckCircle2,
  ChefHat,
  Clock,
  Flame,
  Loader2,
  MapPin,
  Phone,
  Settings,
  Shield,
  Star,
  Wrench,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ServiceType } from "../backend";
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
import { Separator } from "../components/ui/separator";
import { Textarea } from "../components/ui/textarea";
import { useCreateBooking } from "../hooks/useQueries";

const SERVICES = [
  {
    value: ServiceType.chimneyCleaning,
    label: "Chimney Cleaning",
    icon: Flame,
    desc: "Thorough cleaning of chimney ducts, flue liners, and filters. Removes soot, creosote, and debris for safe and efficient operation.",
    badge: "Most Popular",
  },
  {
    value: ServiceType.chimneyInspection,
    label: "Chimney Inspection",
    icon: Shield,
    desc: "Comprehensive professional safety inspection to identify structural issues, blockages, and hazards before they become costly problems.",
    badge: null,
  },
  {
    value: ServiceType.chimneyRepair,
    label: "Chimney Repair",
    icon: Wrench,
    desc: "Expert repair services for leaks, cracks, damaged flashing, crumbling mortar, and all chimney structural damages.",
    badge: null,
  },
  {
    value: ServiceType.stoveService,
    label: "Stove Service",
    icon: Settings,
    desc: "Complete maintenance and repair for all stove types — gas, electric, and wood-burning. Ensure peak performance and safety.",
    badge: null,
  },
  {
    value: ServiceType.hobService,
    label: "Built-in Hob Service",
    icon: ChefHat,
    desc: "Professional hob installation, deep cleaning, burner maintenance, and repair for all built-in hob models and brands.",
    badge: "New Service",
  },
];

const TRUST_ITEMS = [
  { icon: Shield, text: "Licensed & Insured" },
  { icon: Star, text: "5-Star Rated" },
  { icon: CheckCircle2, text: "20+ Years Experience" },
  { icon: Phone, text: "Same-Day Response" },
];

export default function BookingPage() {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [serviceType, setServiceType] = useState<ServiceType | "">("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [confirmedId, setConfirmedId] = useState<bigint | null>(null);

  const createBooking = useCreateBooking();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !address || !serviceType || !date || !time) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      const dateTime = new Date(`${date}T${time}`);
      const scheduledTime = BigInt(dateTime.getTime()) * BigInt(1_000_000);
      const id = await createBooking.mutateAsync({
        customerName,
        phone,
        address,
        serviceType: serviceType as ServiceType,
        scheduledTime,
      });
      setConfirmedId(id);
      toast.success("Booking confirmed!");
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to create booking. Please try again.");
    }
  };

  const handleNewBooking = () => {
    setConfirmedId(null);
    setCustomerName("");
    setPhone("");
    setAddress("");
    setServiceType("");
    setDate("");
    setTime("");
  };

  if (confirmedId !== null) {
    const selectedService = SERVICES.find((s) => s.value === serviceType);
    return (
      <div className="container py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-xl"
          data-ocid="booking.success_state"
        >
          <Card className="border-primary/20 shadow-warm-lg overflow-hidden">
            <div className="bg-primary/10 p-8 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-foreground">
                Booking Confirmed!
              </h2>
              <p className="mt-2 text-muted-foreground">
                We'll contact you shortly to confirm your appointment.
              </p>
              <Badge
                variant="outline"
                className="mt-4 border-primary/30 text-primary"
              >
                Booking #{confirmedId.toString()}
              </Badge>
            </div>
            <CardContent className="p-6 space-y-3">
              <div className="rounded-lg bg-muted/50 p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">{customerName}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium">{phone}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium">{selectedService?.label}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Scheduled</span>
                  <span className="font-medium">
                    {new Date(`${date}T${time}`).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              </div>
              <Button
                className="w-full"
                variant="outline"
                onClick={handleNewBooking}
                data-ocid="booking.secondary_button"
              >
                Book Another Service
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-background to-muted/40">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/generated/chimney-hero.dim_1200x600.jpg"
            alt="Professional chimney service"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        </div>
        <div className="container relative py-24 md:py-36">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <Badge className="mb-4 border-primary-foreground/40 bg-primary/80 text-primary-foreground">
              Trusted Since 2004
            </Badge>
            <h1 className="font-serif text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              Expert Chimney, Stove &amp; Hob Services
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Professional cleaning, inspection, and repair to keep your home
              safe, warm, and efficient. Serving homes across the region with
              pride.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              {TRUST_ITEMS.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur"
                >
                  <Icon className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium text-white">{text}</span>
                </div>
              ))}
            </div>
            <Button
              size="lg"
              className="mt-8 shadow-warm-lg"
              onClick={() =>
                document
                  .getElementById("booking-form")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              data-ocid="hero.primary_button"
            >
              Book Now
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-4xl font-bold">Our Services</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Comprehensive home appliance services delivered by certified
            professionals.
          </p>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ value, label, icon: Icon, desc, badge }, idx) => (
            <motion.div
              key={value}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              viewport={{ once: true }}
            >
              <Card
                className="group h-full border-border/60 hover:border-primary/40 hover:shadow-warm transition-all duration-300 cursor-pointer"
                onClick={() => {
                  setServiceType(value);
                  document
                    .getElementById("booking-form")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <CardHeader>
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    {badge && (
                      <Badge variant="secondary" className="text-xs">
                        {badge}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="font-serif text-xl">{label}</CardTitle>
                  <CardDescription className="leading-relaxed">
                    {desc}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking-form" className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl"
        >
          <div className="text-center mb-8">
            <h2 className="font-serif text-4xl font-bold">
              Schedule Your Service
            </h2>
            <p className="mt-3 text-muted-foreground">
              Fill out the form below and our team will confirm your appointment
              shortly.
            </p>
          </div>
          <Card
            className="shadow-warm border-border/60"
            data-ocid="booking.card"
          >
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Ravi Kumar"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      data-ocid="booking.input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="pl-10"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Service Address *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="address"
                      placeholder="Flat 4B, Sunrise Apartments, Banjara Hills, Hyderabad - 500034"
                      className="pl-10"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      rows={2}
                      data-ocid="booking.textarea"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service">Service Type *</Label>
                  <Select
                    value={serviceType}
                    onValueChange={(v) => setServiceType(v as ServiceType)}
                  >
                    <SelectTrigger id="service" data-ocid="booking.select">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date">Preferred Date *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="date"
                        type="date"
                        className="pl-10"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Preferred Time *</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="time"
                        type="time"
                        className="pl-10"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={createBooking.isPending}
                  data-ocid="booking.submit_button"
                >
                  {createBooking.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Book Appointment"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}
