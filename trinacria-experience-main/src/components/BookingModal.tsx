import { useEffect, useState } from "react";
import { X, CalendarCheck, ExternalLink, Send } from "lucide-react";
import type { Poi } from "@/data/pois";

interface Props {
  poi: Poi | null;
  onClose: () => void;
}

export function BookingModal({ poi, onClose }: Props) {
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (poi) {
      setCheckin("");
      setCheckout("");
      setGuests(2);
      setName("");
      setEmail("");
    }
  }, [poi]);

  if (!poi) return null;

  const target = poi.contactEmail ?? "bookings@trinacria.example";
  const subject = `Booking inquiry — ${poi.name}`;
  const body = [
    `Hello,`,
    ``,
    `I'd like to check availability at ${poi.name} (${poi.location}).`,
    ``,
    `Name: ${name || "(not provided)"}`,
    `Guests: ${guests}`,
    `Check-in: ${checkin || "(flexible)"}`,
    `Check-out: ${checkout || "(flexible)"}`,
    `Reply to: ${email || "(not provided)"}`,
    ``,
    `Sent via Trinacria Experience.`,
  ].join("\n");

  const mailto = `mailto:${target}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center md:items-center">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[var(--navy-deep)]/70 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
      />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-t-3xl border border-border bg-card shadow-[var(--shadow-elegant)] transition-transform duration-300 ease-in-out md:rounded-2xl">
        <div
          className="relative h-32 bg-cover bg-center"
          style={{ backgroundImage: `url(${poi.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
          <button
            onClick={onClose}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-card/80 text-foreground backdrop-blur transition duration-300 ease-in-out hover:bg-card"
            aria-label="Close booking"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-3 left-4 right-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--lemon)]">
              Reserve your stay
            </p>
            <h3 className="font-serif text-xl font-semibold leading-tight text-foreground">
              {poi.name}
            </h3>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            window.location.href = mailto;
          }}
          className="space-y-4 p-5 md:p-6"
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="Check-in">
              <input
                type="date"
                required
                value={checkin}
                onChange={(e) => setCheckin(e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Check-out">
              <input
                type="date"
                required
                value={checkout}
                min={checkin || undefined}
                onChange={(e) => setCheckout(e.target.value)}
                className="input"
              />
            </Field>
          </div>
          <Field label="Guests">
            <input
              type="number"
              min={1}
              max={12}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="input"
            />
          </Field>
          <Field label="Your name">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Marco Rossi"
              className="input"
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input"
            />
          </Field>

          <div className="space-y-2 pt-1">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--gradient-lemon)] px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition duration-300 ease-in-out hover:brightness-110"
            >
              <Send className="h-4 w-4" />
              Confirm Inquiry
            </button>
            {poi.bookingUrl && (
              <a
                href={poi.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-5 py-3 text-sm font-medium text-secondary-foreground transition duration-300 ease-in-out hover:bg-muted"
              >
                <ExternalLink className="h-4 w-4" />
                Book on partner site
              </a>
            )}
            <p className="flex items-start gap-1.5 pt-1 text-[11px] text-muted-foreground">
              <CalendarCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              We'll open your email client with the inquiry pre-filled. The host
              typically replies within 24 hours.
            </p>
          </div>
        </form>

        <style>{`
          .input {
            width: 100%;
            border-radius: 0.75rem;
            border: 1px solid var(--border);
            background: var(--background);
            padding: 0.6rem 0.85rem;
            font-size: 0.875rem;
            color: var(--foreground);
            transition: border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
          }
          .input:focus {
            outline: none;
            border-color: var(--lemon);
            box-shadow: 0 0 0 3px oklch(0.88 0.18 95 / 0.25);
          }
          .input::-webkit-calendar-picker-indicator { filter: invert(0.85) sepia(1) saturate(5) hue-rotate(10deg); }
        `}</style>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
