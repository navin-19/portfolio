import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaCarSide,
  FaCheckCircle,
  FaClock,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaShieldAlt,
  FaStar,
  FaUsers,
} from "react-icons/fa";

const cars = [
  {
    name: "Suzuki Swift",
    type: "Compact city rides",
    price: "From Rs.14/km",
    rating: 4.8,
    seats: "4 seats",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Suzuki%20Swift%20front.jpg",
  },
  {
    name: "Maruti Suzuki Dzire",
    type: "Corporate and airport trips",
    price: "From Rs.18/km",
    rating: 4.9,
    seats: "4 seats",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Maruti%20Suzuki%20Dzire%20VXi%20VVT%20%28front%29.JPG",
  },
  {
    name: "Toyota Glanza",
    type: "Outstation and group travel",
    price: "From Rs.24/km",
    rating: 4.7,
    seats: "5 seats",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Toyota%20Glanza%20%28front%29.jpg",
  },
  {
    name: "Toyota Innova Crysta",
    type: "Premium chauffeur service",
    price: "From Rs.32/km",
    rating: 5.0,
    seats: "7 seats",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Toyota%20Innova%20Crysta%202.4%20Z%20front%20right.jpg",
  },
];

const servicePoints = [
  {
    icon: FaClock,
    title: "24/7 Availability",
    description: "Book rides anytime for local trips, airport transfers, and urgent travel plans.",
  },
  {
    icon: FaShieldAlt,
    title: "Verified Drivers",
    description: "Every cab is paired with trained drivers, cleaned vehicles, and trip monitoring.",
  },
  {
    icon: FaCalendarAlt,
    title: "Easy Scheduling",
    description: "Reserve now or schedule later with quick booking confirmations and reminders.",
  },
];

const officeDetails = [
  "SRI JEYARAM TRAVELS",
  "Neithal, New Housing Unit",
  "New Bus Stand, Thanjavur - 7",
];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1 text-amber-400">
      {Array.from({ length: 5 }).map((_, index) => (
        <FaStar key={index} className={index < Math.round(rating) ? "opacity-100" : "opacity-30"} />
      ))}
      <span className="ml-2 text-sm font-semibold text-slate-600">{rating.toFixed(1)}</span>
    </div>
  );
}

function BookingModal({ open, onClose, defaultCar }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    pickup: "",
    drop: "",
    datetime: "",
    car: defaultCar || cars[0].name,
  });

  useEffect(() => {
    if (!open) {
      setSubmitted(false);
      setForm({
        pickup: "",
        drop: "",
        datetime: "",
        car: defaultCar || cars[0].name,
      });
    }
  }, [open, defaultCar]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 px-4 py-8 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/15 bg-white shadow-2xl"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.24 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="bg-slate-950 px-6 py-5 text-white sm:px-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-300">Reserve Your Ride</p>
                  <h3 className="mt-2 text-2xl font-semibold">Book a cab in under a minute</h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-white/20 px-3 py-1 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>

            {submitted ? (
              <div className="px-6 py-8 sm:px-8">
                <div className="rounded-[1.5rem] bg-emerald-50 p-6 text-left">
                  <div className="flex items-center gap-3 text-emerald-700">
                    <FaCheckCircle className="text-2xl" />
                    <div>
                      <p className="text-lg font-semibold">Booking request submitted</p>
                      <p className="text-sm text-emerald-800/80">
                        Pickup from {form.pickup || "your location"} to {form.drop || "destination"} for {form.car}.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-6 inline-flex rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form className="grid gap-4 px-6 py-8 sm:px-8" onSubmit={handleSubmit}>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Pickup location
                  <input
                    type="text"
                    value={form.pickup}
                    onChange={updateField("pickup")}
                    placeholder="Enter pickup point"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white"
                    required
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Drop location
                  <input
                    type="text"
                    value={form.drop}
                    onChange={updateField("drop")}
                    placeholder="Enter destination"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white"
                    required
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Date & time
                    <input
                      type="datetime-local"
                      value={form.datetime}
                      onChange={updateField("datetime")}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white"
                      required
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Car selection
                    <select
                      value={form.car}
                      onChange={updateField("car")}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white"
                    >
                      {cars.map((car) => (
                        <option key={car.name} value={car.name}>
                          {car.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <button
                  type="submit"
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-6 py-3 font-semibold text-white transition hover:bg-sky-600"
                >
                  Submit Booking
                  <FaArrowRight />
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Header({ onBook }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = ["home", "about", "cars", "contact"];

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between rounded-full border border-white/40 bg-white/80 px-4 py-2.5 shadow-lg shadow-slate-900/5 backdrop-blur md:px-5">
        <a href="#home" className="flex items-center gap-2.5 no-underline">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-sm text-sky-300">
            <FaCarSide />
          </span>
          <div className="text-left">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-600">Cab Booking</p>
            <p className="text-sm font-semibold text-slate-950 sm:text-base">SRI JEYARAM TRAVELS</p>
          </div>
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link}`}
              className="text-sm font-medium capitalize text-slate-700 transition hover:text-sky-600 no-underline"
            >
              {link}
            </a>
          ))}
        </nav>

        <div className="hidden items-center md:flex">
          <button
            type="button"
            onClick={onBook}
            className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
          >
            Book a Cab
          </button>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((current) => !current)}
          className="inline-flex rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 md:hidden"
        >
          Menu
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mx-4 mt-3 rounded-[1.75rem] border border-white/40 bg-white/95 p-4 shadow-xl backdrop-blur md:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex flex-col gap-2 text-left">
              {links.map((link) => (
                <a
                  key={link}
                  href={`#${link}`}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-medium capitalize text-slate-700 transition hover:bg-slate-100 no-underline"
                >
                  {link}
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onBook();
                }}
                className="mt-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
              >
                Book a Cab
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero({ onBook }) {
  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden bg-slate-950 pt-24 text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.35),transparent_30%),linear-gradient(115deg,rgba(2,6,23,0.95),rgba(15,23,42,0.82),rgba(3,105,161,0.55))]" />
        <div className="absolute inset-x-0 top-24 mx-auto h-64 max-w-4xl rounded-full bg-sky-400/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-10 text-center sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-3xl">
          <motion.p
            className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-200"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Trusted city and outstation rides
          </motion.p>
          <motion.h1
            className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            Ride across the city with clean cars, safe drivers, and quick booking.
          </motion.h1>
          <motion.p
            className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
          >
            SRI JEYARAM TRAVELS delivers 24/7 local rides, airport pickups, corporate travel, and outstation trips with
            transparent pricing and real support.
          </motion.p>

          <motion.div
            className="mt-6 flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
          >
            <button
              type="button"
              onClick={onBook}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-400 px-6 py-3.5 text-base font-semibold text-slate-950 transition hover:bg-sky-300"
            >
              Book Cars
              <FaArrowRight />
            </button>
            <a
              href="#about"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-white/10 no-underline"
            >
              View Details
            </a>
          </motion.div>

          <motion.div
            className="mt-6 grid gap-3 sm:grid-cols-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
          >
            <div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-3.5 backdrop-blur-sm">
              <p className="text-2xl font-semibold">15k+</p>
              <p className="mt-1 text-xs text-slate-200 sm:text-sm">Completed rides this year</p>
            </div>
            <div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-3.5 backdrop-blur-sm">
              <p className="text-2xl font-semibold">4.9/5</p>
              <p className="mt-1 text-xs text-slate-200 sm:text-sm">Average customer rating</p>
            </div>
            <div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-3.5 backdrop-blur-sm">
              <p className="text-2xl font-semibold">24/7</p>
              <p className="mt-1 text-xs text-slate-200 sm:text-sm">Call center and booking support</p>
            </div>
          </motion.div>
        </div>
      </div>

    </section>
  );
}

function About() {
  return (
    <section id="about" className="bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <motion.div
          className="rounded-[2rem] bg-slate-950 p-8 text-left text-white shadow-xl shadow-slate-900/10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-300">About SRI JEYARAM TRAVELS</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight">Reliable cab service built for daily travel and long trips.</h2>
          <p className="mt-5 text-base leading-8 text-slate-200">
            We help commuters, families, tourists, and corporate teams move comfortably with clean vehicles,
            experienced chauffeurs, and round-the-clock booking support.
          </p>
          <div className="mt-8 grid gap-4">
            {officeDetails.map((line) => (
              <div key={line} className="rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                {line}
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
            Owner: M.DURAI PANDIYAN
          </div>
          <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-200">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
              <FaPhoneAlt className="text-sky-300" />
              9597968252 / 9360329290
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
              <FaEnvelope className="text-sky-300" />
              rides@skylinecabs.in
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
              <FaPhoneAlt className="text-sky-300" />
              WhatsApp: 8870845252
            </span>
          </div>
        </motion.div>

        <div className="grid gap-4">
          <motion.div
            className="rounded-[2rem] border border-slate-200 bg-white p-8 text-left shadow-lg shadow-slate-900/5"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600">What We Offer</p>
            <h3 className="mt-3 text-3xl font-semibold text-slate-950">Safe local rides, airport drops, and premium intercity travel.</h3>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Every ride is backed by transparent pricing, well-maintained vehicles, and customer support that stays
              available before and after your trip.
            </p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            {servicePoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <motion.article
                  key={point.title}
                  className="rounded-[1.75rem] border border-slate-200 bg-white p-6 text-left shadow-lg shadow-slate-900/5"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: index * 0.08 }}
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                    <Icon />
                  </span>
                  <h4 className="mt-4 text-xl font-semibold text-slate-950">{point.title}</h4>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{point.description}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Fleet({ onBookCar }) {
  return (
    <section id="cars" className="bg-slate-100 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 text-left md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600">Available Cars</p>
            <h2 className="mt-3 text-4xl font-semibold text-slate-950">Pick the cab that fits your route and budget.</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              From quick intra-city rides to spacious outstation vehicles, our fleet is designed to keep travel simple,
              comfortable, and predictable.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onBookCar(cars[0].name)}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
          >
            Book a Cab
            <FaArrowRight />
          </button>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {cars.map((car, index) => (
            <motion.article
              key={car.name}
              className="group overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-900/5"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -8 }}
            >
              <div className="overflow-hidden">
                <img
                  src={car.image}
                  alt={car.name}
                  className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="grid gap-4 p-6 text-left">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-sky-600">{car.type}</p>
                    <h3 className="mt-1 text-2xl font-semibold text-slate-950">{car.name}</h3>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
                    {car.seats}
                  </span>
                </div>
                <StarRating rating={car.rating} />
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-slate-950">{car.price}</p>
                  <button
                    type="button"
                    onClick={() => onBookCar(car.name)}
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="bg-white py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
        <motion.div
          className="rounded-[2rem] bg-slate-950 p-8 text-left text-white shadow-xl shadow-slate-900/10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-300">Contact Us</p>
          <h2 className="mt-4 text-4xl font-semibold">Need help with a ride or business account?</h2>
          <p className="mt-4 text-base leading-8 text-slate-200">
            Reach our support desk for instant bookings, fleet partnerships, or custom transport plans.
          </p>

          <div className="mt-8 grid gap-4">
            <div className="flex items-start gap-4 rounded-[1.5rem] bg-white/5 p-4">
              <FaPhoneAlt className="mt-1 text-sky-300" />
              <div>
                <p className="text-sm font-semibold text-white">Phone</p>
                <a href="tel:9597968252" className="text-sm text-slate-200 no-underline">
                  9597968252 / 9360329290
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-[1.5rem] bg-white/5 p-4">
              <FaPhoneAlt className="mt-1 text-sky-300" />
              <div>
                <p className="text-sm font-semibold text-white">WhatsApp</p>
                <a href="tel:8870845252" className="text-sm text-slate-200 no-underline">
                  8870845252
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-[1.5rem] bg-white/5 p-4">
              <FaEnvelope className="mt-1 text-sky-300" />
              <div>
                <p className="text-sm font-semibold text-white">Email</p>
                <a href="mailto:rides@skylinecabs.in" className="text-sm text-slate-200 no-underline">
                  rides@skylinecabs.in
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-[1.5rem] bg-white/5 p-4">
              <FaMapMarkerAlt className="mt-1 text-sky-300" />
              <div>
                <p className="text-sm font-semibold text-white">Office Address</p>
                <p className="text-sm leading-7 text-slate-200">
                  Neithal, New Housing Unit, New Bus Stand, Thanjavur - 7.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-[1.5rem] bg-white/5 p-4">
              <FaUsers className="mt-1 text-sky-300" />
              <div>
                <p className="text-sm font-semibold text-white">Owner</p>
                <p className="text-sm text-slate-200">M.DURAI PANDIYAN</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6">
          <motion.div
            className="overflow-hidden rounded-[2rem] border border-slate-200 shadow-lg shadow-slate-900/5"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <iframe
              title="SRI JEYARAM TRAVELS office location"
              src="https://www.google.com/maps?q=New%20Bus%20Stand%20Thanjavur&z=14&output=embed"
              className="h-[320px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>

          <motion.form
            className="grid gap-4 rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-lg shadow-slate-900/5"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600">Message Us</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-950">Send your travel requirement</h3>
            </div>
            <input
              type="text"
              placeholder="Your name"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
              required
            />
            <input
              type="tel"
              placeholder="Phone number"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
              required
            />
            <textarea
              rows={4}
              placeholder="Tell us your route or cab requirement"
              className="resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
              required
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-sky-600"
            >
              Send Message
              <FaArrowRight />
            </button>
            {sent && <p className="text-sm font-medium text-emerald-600">Thanks. Our team will call you shortly.</p>}
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-2xl font-semibold">SRI JEYARAM TRAVELS</p>
          <p className="mt-2 text-sm text-slate-300">Professional cab booking service for city rides, airport transfers, and outstation travel.</p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-slate-300">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2">
            <FaUsers className="text-sky-300" />
            Owner: M.DURAI PANDIYAN
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2">
            <FaPhoneAlt className="text-sky-300" />
            WhatsApp: 8870845252
          </span>
        </div>
      </div>
    </footer>
  );
}

export default function Portfolio() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(cars[0].name);

  const openBooking = (carName = cars[0].name) => {
    setSelectedCar(carName);
    setBookingOpen(true);
  };

  return (
    <div className="bg-white text-slate-950">
      <Header onBook={() => openBooking()} />
      <Hero onBook={() => openBooking()} />

      <About />
      <Fleet onBookCar={openBooking} />
      <Contact />
      <Footer />
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} defaultCar={selectedCar} />
    </div>
  );
}
