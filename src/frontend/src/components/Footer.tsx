import { Clock, Heart, Mail, Phone } from "lucide-react";
import { SiFacebook, SiInstagram, SiX } from "react-icons/si";
import { Separator } from "./ui/separator";

const SOCIAL_LINKS = [
  { icon: SiFacebook, label: "Facebook", href: "https://facebook.com" },
  { icon: SiX, label: "X", href: "https://x.com" },
  { icon: SiInstagram, label: "Instagram", href: "https://instagram.com" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-serif text-lg font-semibold mb-3">
              ChimneyCare Pro
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Professional chimney cleaning, inspection, and repair services.
              Certified technicians keeping your home safe and warm.
            </p>
            <div className="mt-4 flex gap-4">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold mb-3">Services</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {[
                "Chimney Cleaning",
                "Chimney Inspection",
                "Chimney Repair",
                "Stove Service",
                "Built-in Hob Service",
              ].map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold mb-3">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                info@chimneycarepro.com
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0" />
                Mon – Sat, 8 AM – 6 PM
              </li>
            </ul>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="text-center text-sm text-muted-foreground">
          © {year}. Built with <Heart className="inline h-4 w-4 text-primary" />{" "}
          using{" "}
          <a
            href={caffeineUrl}
            className="hover:text-primary transition-colors underline-offset-2 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
