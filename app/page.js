"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Check,
  Church,
  Clock3,
  HeartHandshake,
  Loader2,
  MapPinned,
  MessagesSquare,
  Music4,
  PhoneCall,
  Send,
  Shirt,
  X
} from "lucide-react";

const weddingDate = new Date("2026-07-10T15:00:00+03:00");

const introVideoSrc = "/Video_Web_light.mp4";
const introVideoPoster = "/IMG_8548.JPG";

const timeline = [
  {
    time: "12:00",
    title: "Вінчання",
    description: "Момент, коли ми скажемо одне одному найголовніше слово.",
    icon: Church
  },
  {
    time: "15:30",
    title: "Збір",
    description: (
      <>
        Тепла зустріч гостей, легкий welcome drink та перші обійми у <strong>Явір Резорт</strong>.
      </>
    ),
    icon: Clock3
  },
  {
    time: "16:30",
    title: "Святкова частина",
    description: "Головний момент вечора починається прямо зараз.",
    icon: Music4
  }
];

const locations = [
  {
    title: "Вінчання (Церква)",
    subtitle: "Храм Христового Воскресіння УГКЦ",
    details: "вулиця Городоцька, 319А, Львів, Львівська область",
    gradient: "from-[#f4e9dc] via-[#efe0d5] to-[#dcc0b3]",
    href: "https://maps.app.goo.gl/YqWznAobksFpzPC16?g_st=ic",
    image: "/charch.jpg"
  },
  {
    title: "Ресторан",
    subtitle: "Явір Резорт",
    details: "Вулиця Бічна, 55А, Старичі, Львівська область",
    gradient: "from-[#efe2db] via-[#e8d5ce] to-[#d9bfaf]",
    href: "https://maps.app.goo.gl/u6Zsxw8UgBZAKcnu8?g_st=ic",
    image: "/rest.webp"
  }
];

const attendanceOptions = [
  "Так, із радістю будемо! ✨",
  "На жаль, не зможемо прийти.",
  "Поки не знаємо, дамо відповідь до 1 червня."
];

const ceremonyOptions = [
  "Плануємо бути на вінчанні та святкуванні.",
  "Приєднаємося вже в ресторані."
];

const transferOptions = [
  "Будемо на власному авто (потрібне паркомісце).",
  "Потрібен трансфер в обидві сторони (до локації та назад).",
  "Потрібен трансфер тільки до локації.",
  "Потрібен трансфер тільки назад після свята."
];

const hotelOptions = ["Так, забронюйте мені номер.", "Ні, проживання не потрібне."];

/** Окремі блоки з підтипами — не дублювати в списку чекбоксів. */
const EXPANDABLE_DRINK_LABELS = ["Ігристе", "Вино біле", "Вино червоне"];

const DRINK_ORDER = [
  "Безалкогольні напої",
  ...EXPANDABLE_DRINK_LABELS,
  "Віскі",
  "Джин",
  "Горілка",
  "Бренді / Коньяк",
  "Самогонка «Від татуся Андрія» 🌾",
  "Пиво"
];

const simpleDrinkCheckboxOptions = DRINK_ORDER.filter(
  (label) => !EXPANDABLE_DRINK_LABELS.includes(label)
);

const sparklingOptions = ["Сухе", "Напівсолодке", "Солодке"];
const stillWineSweetnessOptions = ["Сухе", "Напівсухе", "Напівсолодке", "Солодке"];
const sliderMax = 188;
const calendarWeekdays = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "НД"];

function buildCalendarDays(year, monthIndex) {
  const firstDay = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7;

  return Array.from({ length: 35 }, (_, index) => {
    const dayNumber = index - startOffset + 1;
    return dayNumber > 0 && dayNumber <= daysInMonth ? dayNumber : null;
  });
}

const julyCalendarDays = buildCalendarDays(2026, 6);

function getTimeLeft() {
  const now = new Date();
  const diff = weddingDate.getTime() - now.getTime();

  if (diff <= 0) {
    return [
      { label: "Днів", value: "00" },
      { label: "Год", value: "00" },
      { label: "Хв", value: "00" },
      { label: "Сек", value: "00" }
    ];
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return [
    { label: "Днів", value: String(days).padStart(2, "0") },
    { label: "Год", value: String(hours).padStart(2, "0") },
    { label: "Хв", value: String(minutes).padStart(2, "0") },
    { label: "Сек", value: String(seconds).padStart(2, "0") }
  ];
}

/** Stable SSR/client initial value — real countdown starts in useEffect after mount. */
const countdownPlaceholder = [
  { label: "Днів", value: "--" },
  { label: "Год", value: "--" },
  { label: "Хв", value: "--" },
  { label: "Сек", value: "--" }
];

/** Два таймери на сторінці — ключі мають бути унікальні в дереві React. */
function TimerCard({ countdown, instanceId }) {
  return (
    <div className="rounded-[2rem] border border-white/20 bg-[rgba(34,26,23,0.58)] p-5 text-[#fffaf4] shadow-[0_18px_60px_rgba(16,10,8,0.28)] backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.3em] text-[#e9cfad]">
        <CalendarDays className="h-4 w-4" />
        До весілля залишилось
      </div>
      <div className="grid grid-cols-4 gap-3">
        {countdown.map((item) => (
          <div
            key={`${instanceId}-${item.label}`}
            className="rounded-[1.4rem] border border-white/15 bg-white/10 px-2 py-4 text-center"
          >
            <div className="text-2xl font-semibold text-white">{item.value}</div>
            <div className="mt-1 text-[0.68rem] uppercase tracking-[0.2em] text-[#f2dfc4]">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="space-y-3 text-center">
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.35em] text-[#a78663]">
        {eyebrow}
      </p>
      <h2 className="font-serif-display text-3xl text-[#322620]">{title}</h2>
      {text ? <p className="mx-auto max-w-md text-sm leading-7 text-[#6b5b50]">{text}</p> : null}
    </div>
  );
}

function FadeIn({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function RadioGroup({ name, options, error, onSelect }) {
  return (
    <>
      <div className="mt-4 space-y-3">
        {options.map((option) => (
          <label
            key={option}
            className={`flex cursor-pointer items-start gap-3 rounded-[1.1rem] border bg-white/70 px-4 py-3 text-sm leading-6 text-[#43352d] transition hover:border-[#d7b79a] ${error ? "border-red-400" : "border-[#ead8cc]"
              }`}
          >
            <input
              type="radio"
              name={name}
              value={option}
              onChange={() => onSelect?.()}
              className="mt-1 h-4 w-4 shrink-0 accent-[#b18a66]"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
      {error ? <p className="mt-2 text-xs text-red-500">{error}</p> : null}
    </>
  );
}

function CheckboxGroup({ options, values = [], onChange, className = "mt-4 space-y-3" }) {
  return (
    <div className={className}>
      {options.map((option) => (
        <label
          key={option}
          className="flex cursor-pointer items-start gap-3 rounded-[1.1rem] border border-[#ead8cc] bg-white/70 px-4 py-3 text-sm leading-6 text-[#43352d] transition hover:border-[#d7b79a]"
        >
          <input
            type="checkbox"
            checked={values.includes(option)}
            onChange={() => onChange?.(option)}
            className="mt-1 h-4 w-4 shrink-0 rounded accent-[#b18a66]"
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}

function ExpandableDrinkOption({
  label,
  checked,
  onToggle,
  isOpen,
  onOpenToggle,
  expandedOptions,
  expandedValues,
  onExpandedToggle
}) {
  const inputId = `drink-${label}`;

  return (
    <motion.div
      layout
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="overflow-hidden rounded-[1.1rem] border border-[#ead8cc] bg-white/70"
    >
      <div className="flex items-start gap-3 px-4 py-3 text-sm leading-6 text-[#43352d]">
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="mt-1 h-4 w-4 shrink-0 rounded accent-[#b18a66]"
        />
        <div className="flex flex-1 items-center justify-between gap-3">
          <label htmlFor={inputId} className="flex-1 cursor-pointer">
            {label}
          </label>
          {checked ? (
            <button
              type="button"
              onClick={onOpenToggle}
              className="shrink-0 text-[#9d7d63]"
            >
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="block"
              >
                <ChevronDown className="h-4 w-4" />
              </motion.span>
            </button>
          ) : null}
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{
          height: checked && isOpen ? "auto" : 0,
          opacity: checked && isOpen ? 1 : 0
        }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="overflow-hidden"
      >
        <div className="border-t border-[#ead8cc] bg-[#fffaf6] px-3 pb-3 pt-2">
          <p className="px-2 text-xs uppercase tracking-[0.18em] text-[#9d7d63]">
            Оберіть варіант
          </p>
          <CheckboxGroup
            options={expandedOptions}
            values={expandedValues}
            onChange={onExpandedToggle}
            className="mt-2 space-y-2"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const [countdown, setCountdown] = useState(countdownPlaceholder);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showStickyTimer, setShowStickyTimer] = useState(false);
  const [selectedDrinks, setSelectedDrinks] = useState([]);
  const [selectedSparklingTypes, setSelectedSparklingTypes] = useState([]);
  const [selectedWhiteWineTypes, setSelectedWhiteWineTypes] = useState([]);
  const [selectedRedWineTypes, setSelectedRedWineTypes] = useState([]);
  const [openDrinkSections, setOpenDrinkSections] = useState({
    sparkling: false,
    white: false,
    red: false
  });
  const [withPartner, setWithPartner] = useState(false);
  const [isThanksOpen, setIsThanksOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const clearError = (field) => {
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }
      const next = { ...current };
      delete next[field];
      return next;
    });
  };
  const heroRef = useRef(null);
  const timerRef = useRef(null);
  const introVideoRef = useRef(null);
  const guestNameRef = useRef(null);
  const partnerNameRef = useRef(null);
  const ceremonyRef = useRef(null);
  const transferRef = useRef(null);
  const drinksRef = useRef(null);
  const [splashMounted, setSplashMounted] = useState(true);
  const [splashFadeOut, setSplashFadeOut] = useState(false);
  const knobX = useMotionValue(0);
  const progressWidth = useTransform(knobX, [0, sliderMax], ["0%", "100%"]);
  const swipeHint = useTransform(knobX, [0, sliderMax * 0.6], [1, 0.2]);

  const sliderTransition = useMemo(
    () => ({ type: "spring", stiffness: 320, damping: 30 }),
    []
  );

  useEffect(() => {
    setCountdown(getTimeLeft());
    const timer = window.setInterval(() => {
      setCountdown(getTimeLeft());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isUnlocked) {
      return;
    }

    const timer = window.setTimeout(() => {
      heroRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 350);

    return () => window.clearTimeout(timer);
  }, [isUnlocked]);

  useEffect(() => {
    if (!isUnlocked || !timerRef.current) {
      setShowStickyTimer(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyTimer(!entry.isIntersecting);
      },
      {
        threshold: 0.98
      }
    );

    observer.observe(timerRef.current);

    return () => observer.disconnect();
  }, [isUnlocked]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let cancelled = false;
    const minMs = 550;
    const maxMs = 15000;
    const t0 = performance.now();

    const scheduleHide = () => {
      if (cancelled) {
        return;
      }

      const elapsed = performance.now() - t0;
      const rest = Math.max(0, minMs - elapsed);
      window.setTimeout(() => {
        if (!cancelled) {
          setSplashFadeOut(true);
        }
      }, rest);
    };

    const maxTimer = window.setTimeout(() => {
      if (!cancelled) {
        setSplashFadeOut(true);
      }
    }, maxMs);

    const onLoad = () => {
      window.clearTimeout(maxTimer);
      scheduleHide();
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("load", onLoad);
      window.clearTimeout(maxTimer);
    };
  }, []);

  useEffect(() => {
    if (!splashFadeOut) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSplashMounted(false);
    }, 480);

    return () => window.clearTimeout(timer);
  }, [splashFadeOut]);

  useEffect(() => {
    const el = introVideoRef.current;
    if (!el || isUnlocked) {
      return;
    }

    if (splashMounted) {
      el.pause();
      return;
    }

    el.currentTime = 0;
    const playAttempt = el.play();
    if (playAttempt !== undefined) {
      playAttempt.catch(() => { });
    }
  }, [splashMounted, isUnlocked]);

  useEffect(() => {
    if (typeof document === "undefined" || isUnlocked) {
      return;
    }

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, [isUnlocked]);

  useEffect(() => {
    if (typeof document === "undefined" || !isThanksOpen) {
      return;
    }

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event) => {
      if (event.key === "Escape") {
        setIsThanksOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [isThanksOpen]);

  const handleUnlock = () => {
    if (isUnlocking || isUnlocked) {
      return;
    }

    setIsUnlocking(true);
    animate(knobX, sliderMax, {
      duration: 0.18,
      ease: "easeOut",
      onComplete: () => {
        setIsUnlocked(true);
      }
    });
  };

  const handleDragEnd = () => {
    if (knobX.get() > sliderMax * 0.78) {
      handleUnlock();
      return;
    }

    animate(knobX, 0, sliderTransition);
  };

  const toggleValue = (value, setter) => {
    setter((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    );
  };

  const toggleDrinkCategory = (value) => {
    setSelectedDrinks((current) => {
      const isActive = current.includes(value);
      const next = isActive ? current.filter((item) => item !== value) : [...current, value];

      if (next.length > 0) {
        clearError("drinks");
      }

      if (value === "Ігристе" && isActive) {
        setSelectedSparklingTypes([]);
        setOpenDrinkSections((state) => ({ ...state, sparkling: false }));
      } else if (value === "Ігристе") {
        setOpenDrinkSections((state) => ({ ...state, sparkling: true }));
      }

      if (value === "Вино біле" && isActive) {
        setSelectedWhiteWineTypes([]);
        setOpenDrinkSections((state) => ({ ...state, white: false }));
      } else if (value === "Вино біле") {
        setOpenDrinkSections((state) => ({ ...state, white: true }));
      }

      if (value === "Вино червоне" && isActive) {
        setSelectedRedWineTypes([]);
        setOpenDrinkSections((state) => ({ ...state, red: false }));
      } else if (value === "Вино червоне") {
        setOpenDrinkSections((state) => ({ ...state, red: true }));
      }

      return next;
    });
  };

  const toggleDrinkSectionOpen = (key) => {
    setOpenDrinkSections((state) => ({ ...state, [key]: !state[key] }));
  };

  return (
    <main className="min-h-screen bg-[#f7f1ea] text-[#2e2521]">
      {splashMounted ? (
        <motion.div
          initial={false}
          animate={{ opacity: splashFadeOut ? 0 : 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-[#f7f1ea] px-6 text-center"
          style={{ pointerEvents: splashFadeOut ? "none" : "auto" }}
        >
          <p className="font-script text-4xl text-[#b38863] sm:text-5xl">Roman & Oksana</p>
          <div className="flex flex-col items-center gap-4">
            <div
              className="h-11 w-11 shrink-0 animate-spin rounded-full border-2 border-[#ead8cc] border-t-[#b18a66] [animation-duration:0.85s]"
              aria-hidden
            />
            <p className="max-w-xs text-xs uppercase leading-relaxed tracking-[0.28em] text-[#9d7d63]">
              Завантажуємо запрошення
            </p>
          </div>
        </motion.div>
      ) : null}

      <motion.div
        initial={false}
        animate={{
          opacity: showStickyTimer ? 1 : 0,
          y: showStickyTimer ? 0 : -24,
          pointerEvents: showStickyTimer ? "auto" : "none"
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="fixed inset-x-0 top-4 z-40 px-5"
      >
        <div className="mx-auto max-w-md">
          <div className="scale-[0.84] origin-top">
            <TimerCard countdown={countdown} instanceId="sticky" />
          </div>
        </div>
      </motion.div>

      <motion.section
        initial={false}
        animate={{
          opacity: isUnlocked ? 0 : 1,
          pointerEvents: isUnlocked ? "none" : "auto"
        }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
        className="fixed inset-0 z-50 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[#1a1512]">
          {!isUnlocked ? (
            <video
              ref={introVideoRef}
              loop
              muted
              playsInline
              preload="auto"
              poster={introVideoPoster}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover"
            >
              <source src={introVideoSrc} type="video/mp4" />
            </video>
          ) : null}
          <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(180deg,rgba(20,16,14,0.18),rgba(20,16,14,0.72))]" />
          <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_top,rgba(255,244,230,0.34),transparent_46%)]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col px-5 pb-10 pt-8">
          <div className="mb-auto rounded-full border border-white/30 bg-white/12 px-4 py-2 text-center text-[0.72rem] uppercase tracking-[0.35em] text-[#f5e9d6] backdrop-blur-md">
            Wedding day
          </div>

          <div className="mb-8 mt-auto space-y-6">
            <div className="space-y-5 text-center text-[#fff8f0]">
              <p className="text-sm uppercase tracking-[0.45em] text-[#e6caa7]">10.07.2026</p>
              <h1 className="font-script text-6xl leading-[0.95] text-[#f1d3a3] drop-shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
                Роман та
                <span className="mt-2 block">Оксана</span>
              </h1>
              <p className="mx-auto max-w-xs text-sm leading-7 text-[#f9f2ea]">
                Проведіть пальцем, щоб відкрити наше запрошення й перейти до деталей дня.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/20 bg-[rgba(32,24,21,0.52)] p-5 text-[#fffaf4] shadow-[0_18px_60px_rgba(16,10,8,0.28)]">
              <div className="mb-4 text-center text-sm text-[#f4eadf]">Розблокуйте запрошення</div>
              <div className="relative mx-auto h-[4.5rem] w-full max-w-[17rem] rounded-full border border-white/20 bg-[rgba(255,255,255,0.12)] px-2 py-2">
                <motion.div
                  style={{ width: progressWidth }}
                  className="absolute inset-y-2 left-2 rounded-full bg-[linear-gradient(90deg,rgba(222,195,164,0.65),rgba(244,231,217,0.18))]"
                />
                <motion.div
                  style={{ opacity: swipeHint }}
                  className="pointer-events-none absolute inset-y-0 left-[5.25rem] right-5 z-10 flex items-center justify-center text-center text-[0.82rem] font-medium text-[#fff1de]"
                >
                  Проведіть праворуч
                </motion.div>
                <motion.button
                  type="button"
                  drag="x"
                  dragConstraints={{ left: 0, right: sliderMax }}
                  dragElastic={0.02}
                  dragMomentum={false}
                  whileDrag={{ scale: 1.03 }}
                  style={{ x: knobX }}
                  animate={isUnlocking ? { scale: 1 } : undefined}
                  transition={sliderTransition}
                  onDragEnd={handleDragEnd}
                  onClick={handleUnlock}
                  className="relative z-10 flex h-14 w-14 touch-none items-center justify-center rounded-full bg-[#fff9f2] text-[#2f2621] shadow-[0_10px_22px_rgba(0,0,0,0.26)]"
                >
                  <ArrowRight className="h-6 w-6" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <section
        ref={heroRef}
        className="relative isolate min-h-svh overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="relative h-full min-h-svh w-full">
            <Image
              src="/IMG_8548.JPG"
              alt="Роман та Оксана"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[92%_22%] sm:object-[72%_center]"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(39,28,24,0.24),rgba(39,28,24,0.68))]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,244,230,0.26),transparent_46%)]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-svh max-w-md flex-col px-5 pb-10 pt-8">
          <FadeIn>
            <div className="mb-auto rounded-full border border-white/30 bg-white/10 px-4 py-2 text-center text-[0.72rem] uppercase tracking-[0.35em] text-[#f5e9d6] backdrop-blur-md">
              Wedding day
            </div>
          </FadeIn>

          <div className="mb-10 mt-auto space-y-6">
            <FadeIn delay={0.08}>
              <div className="space-y-5 text-center text-[#fff8f0]">
                <p className="text-sm uppercase tracking-[0.45em] text-[#e6caa7]">10.07.2026</p>
                <h1 className="font-script text-6xl leading-[0.95] text-[#f1d3a3] drop-shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
                  Роман та
                  <span className="mt-2 block">Оксана</span>
                </h1>
                <p className="mx-auto max-w-xs text-sm leading-7 text-[#f9f2ea]">
                  Запрошуємо Вас розділити з нами день, у якому любов звучатиме особливо тихо,
                  красиво й назавжди.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.16}>
              <div ref={timerRef}>
                <TimerCard countdown={countdown} instanceId="hero" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <div className="relative mx-auto max-w-md px-5 pb-20">
        <div className="absolute inset-x-5 top-0 -z-10 h-40 rounded-full bg-[#e7c6b2]/40 blur-3xl" />

        <section className="pt-14">
          <FadeIn>
            <article className="overflow-hidden rounded-[2.2rem] border border-[#eadbce] bg-[linear-gradient(180deg,#fffaf7,#f6ede6)] shadow-[0_16px_44px_rgba(90,63,42,0.08)]">
              <div className="border-b border-[#ecdcd0] px-6 py-5 text-center">
                <p className="text-[0.72rem] font-medium uppercase tracking-[0.35em] text-[#a78663]">
                  Wedding Calendar
                </p>
                <div className="mt-3 flex items-center justify-center gap-3 text-[#342923]">
                  <span className="font-serif-display text-4xl">П&apos;ятниця</span>
                  <span className="text-2xl text-[#baa18d]">|</span>
                  <span className="text-4xl font-semibold">10</span>
                  <span className="text-2xl text-[#baa18d]">|</span>
                  <span className="font-serif-display text-4xl">липня</span>
                </div>
                <p className="mt-2 text-sm text-[#7b695d]">Липень 2026</p>
              </div>

              <div className="px-5 py-6">
                <div className="grid grid-cols-7 gap-2 text-center text-[0.72rem] font-medium uppercase tracking-[0.18em] text-[#a78663]">
                  {calendarWeekdays.map((day) => (
                    <div key={day} className="py-1">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="mt-3 grid grid-cols-7 gap-2">
                  {julyCalendarDays.map((day, index) => {
                    const isWeddingDay = day === 10;
                    return (
                      <div
                        key={`${day ?? "empty"}-${index}`}
                        className={`flex aspect-square items-center justify-center rounded-full text-lg ${day
                          ? "text-[#342923]"
                          : "text-transparent"
                          } ${isWeddingDay
                            ? "border border-[#cfa782] bg-[#fff2e4] font-semibold text-[#9d5f3d] shadow-[0_10px_18px_rgba(207,167,130,0.22)]"
                            : "bg-transparent"
                          }`}
                      >
                        {day ?? "•"}
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>
          </FadeIn>
        </section>

        <section className="pt-14">
          <FadeIn>
            <SectionTitle
              eyebrow="Програма дня"
              title="Легка хронологія нашого свята"
              text="Ми продумали день так, щоб у ньому було місце і для ніжності, і для радості, і для красивого вечора разом."
            />
          </FadeIn>

          <div className="relative mt-10 space-y-5 before:absolute before:left-[1.55rem] before:top-4 before:h-[calc(100%-2rem)] before:w-px before:bg-[linear-gradient(180deg,rgba(167,134,99,0.55),rgba(167,134,99,0))]">
            {timeline.map((item, index) => {
              const Icon = item.icon;
              return (
                <FadeIn key={item.title} delay={index * 0.08}>
                  <article className="relative ml-0 flex gap-4 rounded-[1.9rem] border border-[#ead8cb] bg-[#fffaf6] p-4 shadow-[0_14px_40px_rgba(90,63,42,0.08)]">
                    <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f3e4d7] text-[#9f7a58]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold text-[#352923]">{item.time}</span>
                        <span className="inline-flex rounded-full bg-[#f8eee7] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#a07c5e]">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-sm leading-7 text-[#6b5b50]">{item.description}</p>
                    </div>
                  </article>
                </FadeIn>
              );
            })}
          </div>
        </section>

        <section className="pt-14">
          <FadeIn>
            <SectionTitle
              eyebrow="Локації"
              title="Два місця, одна особлива історія"
              text="Зібрали для Вас усе найважливіше, щоб дорога до нас була легкою і спокійною."
            />
          </FadeIn>

          <div className="mt-10 space-y-5">
            {locations.map((location, index) => (
              <FadeIn key={location.title} delay={index * 0.08}>
                <article className="overflow-hidden rounded-[2rem] border border-[#eadbce] bg-[#fffaf6] shadow-[0_16px_44px_rgba(90,63,42,0.08)]">
                  <div className={`relative h-44 bg-gradient-to-br ${location.gradient} p-5`}>
                    <Image
                      src={location.image}
                      alt={location.subtitle}
                      fill
                      sizes="(max-width: 448px) 100vw, 448px"
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(37,28,23,0.04),rgba(37,28,23,0.1))]" />
                    <div className="relative z-10 flex h-full flex-col justify-between">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/65 text-[#8d6a50] shadow-sm">
                        <MapPinned className="h-5 w-5" />
                      </div>
                      <div />
                    </div>
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="space-y-1">
                      <h3 className="text-xl font-semibold text-[#31251f]">{location.title}</h3>
                      <p className="text-sm font-medium text-[#9a765b]">{location.subtitle}</p>
                      <p className="text-sm leading-7 text-[#6b5b50]">{location.details}</p>
                    </div>
                    <a
                      href={location.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ad845f] px-5 py-3 text-sm font-medium text-[#fff9f3] shadow-[0_14px_30px_rgba(173,132,95,0.34)] transition hover:bg-[#9b734f]"
                    >
                      <MapPinned className="h-4 w-4" />
                      Відкрити в навігаторі
                    </a>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </section>

        <section className="pt-14">
          <FadeIn>
            <SectionTitle
              eyebrow="Dress-code"
              title=""
              text=""
            />
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="mt-10 rounded-[2rem] border border-[#eadbce] bg-[#fffaf6] p-5 shadow-[0_16px_44px_rgba(90,63,42,0.08)]">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f2e4d9] text-[#9e7a5e]">
                  <Shirt className="h-5 w-5" />
                </div>
                <div className="space-y-3">
                  <p className="text-sm leading-7 text-[#6b5b50]">
                    Ми не встановлюємо строгого дрес-коду — головне, щоб Вам було комфортно та святково.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        <section className="pt-14">
          <FadeIn>
            <SectionTitle
              eyebrow="Побажання"
              title="Трохи важливих деталей"
              text="Найбільша цінність для нас, що Ви будете поруч.  А ще залишили маленьке побажання щодо подарунків."
            />
          </FadeIn>

          <div className="mt-10 space-y-5">
            <FadeIn delay={0.08}>
              <article className="rounded-[2rem] border border-[#eadbce] bg-[#fffaf6] p-5 shadow-[0_16px_44px_rgba(90,63,42,0.08)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f3e5da] text-[#9a765b]">
                    <HeartHandshake className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#31251f]">Подарунки</h3>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#6b5b50]">
                  Замість квітів будемо раді пляшечці вина або іншого алкоголю для наших майбутніх сімейних вечорів.
                </p>
              </article>
            </FadeIn>


          </div>
        </section>

        <section className="pt-14">
          <FadeIn>
            <SectionTitle
              eyebrow="RSVP"
              title="Підтвердження присутності"
              text={
                <>
                  Ми щиро чекаємо на зустріч із Вами. Будь ласка, заповніть цю форму{" "}
                  <strong>до 1 червня включно</strong>. Якщо Ви плануєте бути з парою, вкажіть
                  інформацію за обох осіб.
                </>
              }
            />
          </FadeIn>

          <FadeIn delay={0.08}>
            <form
              noValidate
              onSubmit={async (event) => {
                event.preventDefault();
                if (isSubmitting) {
                  return;
                }
                const data = new FormData(event.currentTarget);
                const guestName = (data.get("guestName") || "").toString().trim();
                const partnerName = (data.get("partnerName") || "").toString().trim();
                const ceremony = data.get("ceremony");
                const transfer = data.get("transfer");

                const nextErrors = {};
                if (!guestName) {
                  nextErrors.guestName = "Заповніть, будь ласка, це поле.";
                }
                if (withPartner && !partnerName) {
                  nextErrors.partnerName = "Заповніть, будь ласка, це поле.";
                }
                if (!ceremony) {
                  nextErrors.ceremony = "Оберіть, будь ласка, варіант.";
                }
                if (!transfer) {
                  nextErrors.transfer = "Оберіть, будь ласка, варіант.";
                }
                if (selectedDrinks.length === 0) {
                  nextErrors.drinks =
                    "Це поле обов'язкове (виберіть «Безалкогольні напої», якщо не п'єте алкоголь).";
                }

                setErrors(nextErrors);

                if (Object.keys(nextErrors).length > 0) {
                  const fieldOrder = [
                    ["guestName", guestNameRef],
                    ["partnerName", partnerNameRef],
                    ["ceremony", ceremonyRef],
                    ["transfer", transferRef],
                    ["drinks", drinksRef]
                  ];
                  const firstInvalid = fieldOrder.find(([key]) => nextErrors[key]);
                  const node = firstInvalid?.[1].current;
                  if (node) {
                    node.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                  return;
                }

                const payload = {
                  attendance: (data.get("attendance") || "").toString(),
                  guestName,
                  partnerName: withPartner ? partnerName : "",
                  ceremony: (ceremony || "").toString(),
                  transfer: (transfer || "").toString(),
                  hotel: (data.get("hotel") || "").toString(),
                  drinks: selectedDrinks,
                  sparkling: selectedSparklingTypes,
                  whiteWine: selectedWhiteWineTypes,
                  redWine: selectedRedWineTypes,
                  message: (data.get("message") || "").toString().trim()
                };

                const webhookUrl = process.env.NEXT_PUBLIC_SHEET_WEBHOOK_URL;
                setSubmitError(null);
                setIsSubmitting(true);

                try {
                  if (webhookUrl) {
                    await fetch(webhookUrl, {
                      method: "POST",
                      body: JSON.stringify(payload),
                      redirect: "follow"
                    });
                  } else if (process.env.NODE_ENV !== "production") {
                    console.warn(
                      "NEXT_PUBLIC_SHEET_WEBHOOK_URL не задано. RSVP не відправлено."
                    );
                  }
                  setIsThanksOpen(true);
                } catch (error) {
                  setSubmitError(
                    "Не вдалось надіслати відповідь. Перевірте інтернет і спробуйте ще раз, або зателефонуйте координаторці."
                  );
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className="mt-10 rounded-[2.2rem] border border-[#e6d4c6] bg-[linear-gradient(180deg,#fffaf6,#f8efe8)] p-5 shadow-[0_20px_56px_rgba(90,63,42,0.1)]"
            >
              <div className="space-y-6">
                <div className="rounded-[1.6rem] border border-[#ead8cc] bg-white/55 p-4">
                  <p className="text-sm font-semibold text-[#342923]">1. Ваша присутність</p>
                  <p className="mt-1 text-sm leading-6 text-[#746458]">
                    Оберіть варіант, який найточніше відповідає Вашим планам.
                  </p>
                  <label className="mt-4 block space-y-2">
                    <span className="text-sm font-medium text-[#5e4b3f]">Відповідь</span>
                    <select
                      name="attendance"
                      defaultValue={attendanceOptions[0]}
                      className="h-14 w-full rounded-[1.2rem] border border-[#e4d4c7] bg-white/80 px-4 text-sm text-[#302622] outline-none transition focus:border-[#b18a66] focus:ring-4 focus:ring-[#e8d3bf]/50"
                    >
                      {attendanceOptions.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="rounded-[1.6rem] border border-[#ead8cc] bg-white/55 p-4">
                  <p className="text-sm font-semibold text-[#342923]">2. Інформація про гостей</p>
                  <p className="mt-1 text-sm leading-6 text-[#746458]">
                    Вкажіть, будь ласка, свої дані та інформацію про супутника чи супутницю, якщо
                    плануєте бути не самі.
                  </p>
                  <div className="mt-4 space-y-4">
                    <label className="block space-y-2">
                      <span className="text-sm font-medium text-[#5e4b3f]">Ім&apos;я та прізвище</span>
                      <input
                        ref={guestNameRef}
                        type="text"
                        name="guestName"
                        placeholder="Ім'я та прізвище"
                        onChange={() => clearError("guestName")}
                        aria-invalid={errors.guestName ? "true" : "false"}
                        className={`h-14 w-full rounded-[1.2rem] border bg-white/80 px-4 text-sm text-[#302622] outline-none transition placeholder:text-[#a08c7d] focus:ring-4 ${errors.guestName
                          ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                          : "border-[#e4d4c7] focus:border-[#b18a66] focus:ring-[#e8d3bf]/50"
                          }`}
                      />
                      {errors.guestName ? (
                        <p className="text-xs text-red-500">{errors.guestName}</p>
                      ) : null}
                    </label>
                    <label className="flex cursor-pointer items-start gap-3 rounded-[1.1rem] border border-[#ead8cc] bg-white/70 px-4 py-3 text-sm leading-6 text-[#43352d] transition hover:border-[#d7b79a]">
                      <input
                        type="checkbox"
                        checked={withPartner}
                        onChange={() => {
                          setWithPartner((s) => {
                            const next = !s;
                            if (!next) {
                              clearError("partnerName");
                            }
                            return next;
                          });
                        }}
                        className="mt-1 h-4 w-4 shrink-0 rounded accent-[#b18a66]"
                      />
                      <span>Я буду з супутником/супутницею</span>
                    </label>
                    <motion.div
                      initial={false}
                      animate={{
                        height: withPartner ? "auto" : 0,
                        opacity: withPartner ? 1 : 0
                      }}
                      transition={{ duration: 0.24, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <label className="block space-y-2 pt-1">
                        <span className="text-sm font-medium text-[#5e4b3f]">
                          Ім&apos;я та прізвище супутника/супутниці
                        </span>
                        <input
                          ref={partnerNameRef}
                          type="text"
                          name="partnerName"
                          placeholder="Ім'я та прізвище"
                          onChange={() => clearError("partnerName")}
                          aria-invalid={errors.partnerName ? "true" : "false"}
                          className={`h-14 w-full rounded-[1.2rem] border bg-white/80 px-4 text-sm text-[#302622] outline-none transition placeholder:text-[#a08c7d] focus:ring-4 ${errors.partnerName
                            ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                            : "border-[#e4d4c7] focus:border-[#b18a66] focus:ring-[#e8d3bf]/50"
                            }`}
                        />
                        {errors.partnerName ? (
                          <p className="text-xs text-red-500">{errors.partnerName}</p>
                        ) : null}
                      </label>
                    </motion.div>
                  </div>
                </div>

                <div className="rounded-[1.6rem] border border-[#ead8cc] bg-white/55 p-4">
                  <p className="text-sm font-semibold text-[#342923]">3. Розклад та вінчання</p>
                  <p className="mt-1 text-sm leading-6 text-[#746458]">
                    Підкажіть, будь ласка, на яку частину свята Ви плануєте приєднатися.
                  </p>
                  <div ref={ceremonyRef}>
                    <RadioGroup
                      name="ceremony"
                      options={ceremonyOptions}
                      error={errors.ceremony}
                      onSelect={() => clearError("ceremony")}
                    />
                  </div>
                </div>

                <div className="rounded-[1.6rem] border border-[#ead8cc] bg-white/55 p-4">
                  <p className="text-sm font-semibold text-[#342923]">4. Трансфер та логістика 🚗</p>
                  <p className="mt-1 text-sm leading-6 text-[#746458]">
                    <strong>(Оберіть варіант, який Вам підходить)</strong>
                  </p>
                  <div ref={transferRef}>
                    <RadioGroup
                      name="transfer"
                      options={transferOptions}
                      error={errors.transfer}
                      onSelect={() => clearError("transfer")}
                    />
                  </div>
                </div>

                <div className="rounded-[1.6rem] border border-[#ead8cc] bg-white/55 p-4">
                  <p className="text-sm font-semibold text-[#342923]">5. Проживання у готелі 🏨</p>
                  <p className="mt-1 text-sm leading-6 text-[#746458]">
                    Якщо Ви плануєте залишитися з ночівлею, ми можемо забронювати для Вас номер.
                    <strong> Оплата здійснюється гостем при поселенні.</strong>
                  </p>
                  <label className="mt-4 block space-y-2">
                    <span className="text-sm font-medium text-[#5e4b3f]">Проживання</span>
                    <select
                      name="hotel"
                      defaultValue={hotelOptions[0]}
                      className="h-14 w-full rounded-[1.2rem] border border-[#e4d4c7] bg-white/80 px-4 text-sm text-[#302622] outline-none transition focus:border-[#b18a66] focus:ring-4 focus:ring-[#e8d3bf]/50"
                    >
                      {hotelOptions.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="rounded-[1.6rem] border border-[#ead8cc] bg-white/55 p-4">
                  <p className="text-sm font-semibold text-[#342923]">6. Ваші вподобання щодо напоїв 🥂</p>
                  <p className="mt-1 text-sm leading-6 text-[#746458]">
                    <strong>
                      Будь ласка, оберіть варіанти (можна декілька):
                    </strong>
                  </p>
                  <div ref={drinksRef} className="mt-4 space-y-3">
                    <span className="text-sm font-medium text-[#5e4b3f]">
                      Вибір напоїв для Вас двох
                    </span>

                    <CheckboxGroup
                      options={simpleDrinkCheckboxOptions}
                      values={selectedDrinks}
                      onChange={toggleDrinkCategory}
                      className="mt-4 space-y-3"
                    />

                    <ExpandableDrinkOption
                      label="Ігристе"
                      checked={selectedDrinks.includes("Ігристе")}
                      onToggle={() => toggleDrinkCategory("Ігристе")}
                      isOpen={openDrinkSections.sparkling}
                      onOpenToggle={() => toggleDrinkSectionOpen("sparkling")}
                      expandedOptions={sparklingOptions}
                      expandedValues={selectedSparklingTypes}
                      onExpandedToggle={(value) => toggleValue(value, setSelectedSparklingTypes)}
                    />

                    <ExpandableDrinkOption
                      label="Вино біле"
                      checked={selectedDrinks.includes("Вино біле")}
                      onToggle={() => toggleDrinkCategory("Вино біле")}
                      isOpen={openDrinkSections.white}
                      onOpenToggle={() => toggleDrinkSectionOpen("white")}
                      expandedOptions={stillWineSweetnessOptions}
                      expandedValues={selectedWhiteWineTypes}
                      onExpandedToggle={(value) => toggleValue(value, setSelectedWhiteWineTypes)}
                    />

                    <ExpandableDrinkOption
                      label="Вино червоне"
                      checked={selectedDrinks.includes("Вино червоне")}
                      onToggle={() => toggleDrinkCategory("Вино червоне")}
                      isOpen={openDrinkSections.red}
                      onOpenToggle={() => toggleDrinkSectionOpen("red")}
                      expandedOptions={stillWineSweetnessOptions}
                      expandedValues={selectedRedWineTypes}
                      onExpandedToggle={(value) => toggleValue(value, setSelectedRedWineTypes)}
                    />
                  </div>
                  {errors.drinks ? (
                    <p className="mt-3 text-xs text-red-500">{errors.drinks}</p>
                  ) : null}
                </div>

                <div className="rounded-[1.6rem] border border-[#ead8cc] bg-white/55 p-4">
                  <p className="text-sm font-semibold text-[#342923]">7. Зворотний зв&apos;язок</p>
                  <p className="mt-1 text-sm leading-6 text-[#746458]">
                    Якщо у Вас залишилися запитання, які Вас турбують, або Ви хочете уточнити
                    деталі, на які ми маємо Вам відповісти, напишіть їх тут.
                  </p>
                  <label className="mt-4 block space-y-2">
                    <span className="text-sm font-medium text-[#5e4b3f]">Запитання та коментарі</span>
                    <textarea
                      name="message"
                      rows={5}
                      placeholder="Ваші запитання та коментарі"
                      className="w-full rounded-[1.2rem] border border-[#e4d4c7] bg-white/80 px-4 py-3 text-sm text-[#302622] outline-none transition placeholder:text-[#a08c7d] focus:border-[#b18a66] focus:ring-4 focus:ring-[#e8d3bf]/50"
                    />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting ? "true" : "false"}
                className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-4 text-sm font-medium text-[#fff8f1] shadow-[0_16px_32px_rgba(47,38,33,0.24)] transition ${isSubmitting
                  ? "cursor-wait bg-[#5a4a40]"
                  : "bg-[#2f2621] hover:bg-[#1f1815]"
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Надсилаємо…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Надіслати
                  </>
                )}
              </button>
              {submitError ? (
                <p className="mt-3 text-center text-xs leading-6 text-red-500">
                  {submitError}{" "}
                  <a
                    href="tel:+380977136226"
                    className="font-medium underline underline-offset-2"
                  >
                    +380 97 713 62 26
                  </a>
                </p>
              ) : null}
            </form>
          </FadeIn>
        </section>

        <section className="pt-14">
          <FadeIn>
            <SectionTitle
              eyebrow="Координатор"
              title="Ми поруч, якщо щось знадобиться"
              text="У день весілля з усіх організаційних питань можна звернутися до нашої людини, яка все підкаже."
            />
          </FadeIn>

          <FadeIn delay={0.08}>
            <article className="mt-10 rounded-[2rem] border border-[#eadbce] bg-[#fffaf6] p-5 shadow-[0_16px_44px_rgba(90,63,42,0.08)]">
              <div className="flex items-center gap-4">
                <div className="flex size-[4.5rem] shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#ead7c8] bg-[linear-gradient(135deg,#f1e4d7,#dec2b3)] text-[#8e6c55]">
                  <PhoneCall className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[#a07b5f]">Coordinator</p>
                  <h3 className="mt-1 text-xl font-semibold text-[#31251f]">Ярина</h3>
                  <p className="mt-1 text-sm text-[#6b5b50]">+380 97 713 62 26</p>
                </div>
              </div>
            </article>
          </FadeIn>
        </section>

        <FadeIn delay={0.08}>
          <footer className="pb-4 pt-16 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e2d0c3] bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.28em] text-[#9d795c]">
              <Check className="h-4 w-4" />
              З любов&apos;ю чекаємо на Вас
            </div>
            <p className="mt-5 font-script text-4xl text-[#b38863]">Roman & Oksana</p>
            <p className="mt-2 text-sm text-[#7b695d]">10 липня 2026</p>
          </footer>
        </FadeIn>
      </div>

      <motion.div
        initial={false}
        animate={{ opacity: isThanksOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{ pointerEvents: isThanksOpen ? "auto" : "none" }}
        className="fixed inset-0 z-[120] flex items-end justify-center px-5 pb-6 pt-6 sm:items-center"
        aria-hidden={!isThanksOpen}
      >
        <button
          type="button"
          aria-label="Закрити"
          tabIndex={isThanksOpen ? 0 : -1}
          onClick={() => setIsThanksOpen(false)}
          className="absolute inset-0 bg-[rgba(20,16,14,0.55)] backdrop-blur-md"
        />

        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="thanks-modal-title"
          initial={false}
          animate={{
            opacity: isThanksOpen ? 1 : 0,
            y: isThanksOpen ? 0 : 24,
            scale: isThanksOpen ? 1 : 0.96
          }}
          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-md overflow-hidden rounded-[2.4rem] border border-[#eadbce] bg-[linear-gradient(180deg,#fffaf6,#f6ede4)] p-6 shadow-[0_28px_70px_rgba(47,38,33,0.32)]"
        >
          <button
            type="button"
            onClick={() => setIsThanksOpen(false)}
            aria-label="Закрити"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#f3e4d7] text-[#9f7a58] transition hover:bg-[#ead2bb] hover:text-[#7a5a40]"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f3e4d7] text-[#9f7a58] shadow-[0_12px_28px_rgba(173,132,95,0.28)]">
              <Check className="h-7 w-7" />
            </div>
            <p className="mt-5 text-[0.7rem] font-medium uppercase tracking-[0.35em] text-[#a78663]">
              Дякуємо
            </p>
            <h3
              id="thanks-modal-title"
              className="mt-2 font-serif-display text-3xl text-[#322620]"
            >
              Вашу відповідь надіслано
            </h3>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#6b5b50]">
              Ми отримали Ваші дані і з нетерпінням чекаємо зустрічі. Якщо у Вас лишилися
              запитання — координатор охоче все підкаже.
            </p>
          </div>

          <article className="mt-6 rounded-[1.6rem] border border-[#eadbce] bg-white/70 p-4">
            <div className="flex items-center gap-4">
              <div className="flex size-[3.5rem] shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#ead7c8] bg-[linear-gradient(135deg,#f1e4d7,#dec2b3)] text-[#8e6c55]">
                <PhoneCall className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[#a07b5f]">
                  Coordinator
                </p>
                <h4 className="mt-1 text-lg font-semibold text-[#31251f]">Ярина</h4>
                <a
                  href="tel:+380977136226"
                  className="mt-1 inline-block text-sm text-[#9d7d63] transition hover:text-[#7a5a40]"
                >
                  +380 97 713 62 26
                </a>
              </div>
            </div>
          </article>

          <button
            type="button"
            onClick={() => setIsThanksOpen(false)}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2f2621] px-5 py-4 text-sm font-medium text-[#fff8f1] shadow-[0_16px_32px_rgba(47,38,33,0.24)] transition hover:bg-[#1f1815]"
          >
            Дякуємо!
          </button>
        </motion.div>
      </motion.div>
    </main>
  );
}
