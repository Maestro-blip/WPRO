"use client";

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
  MapPinned,
  MessagesSquare,
  Music4,
  PhoneCall,
  Send,
  Shirt
} from "lucide-react";

const weddingDate = new Date("2026-07-10T15:00:00+03:00");

const timeline = [
  {
    time: "12:30",
    title: "Збір",
    description: "Тепла зустріч гостей, легкий welcome drink та перші обійми.",
    icon: Clock3
  },
  {
    time: "14:00",
    title: "Церемонія",
    description: "Момент, коли ми скажемо одне одному найголовніше слово.",
    icon: Church
  },
  {
    time: "17:00",
    title: "Банкет",
    description: "Святкова вечеря, музика, танці та вечір у колі близьких.",
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

const drinkOptions = [
  "Безалкогольні напої",
  "Ігристе",
  "Вино біле",
  "Вино червоне",
  "Віскі",
  "Джин",
  "Горілка",
  "Бренді / Коньяк",
  "Самогонка «Від татуся Андрія» 🌾",
  "Пиво"
];

const sparklingOptions = ["Сухе", "Напівсолодке", "Солодке"];
const whiteWineOptions = ["Сухе", "Напівсухе", "Напівсолодке", "Солодке"];
const redWineOptions = ["Сухе", "Напівсухе", "Напівсолодке", "Солодке"];
const sliderMax = 188;

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

function RadioGroup({ name, options }) {
  return (
    <div className="mt-4 space-y-3">
      {options.map((option) => (
        <label
          key={option}
          className="flex cursor-pointer items-start gap-3 rounded-[1.1rem] border border-[#ead8cc] bg-white/70 px-4 py-3 text-sm leading-6 text-[#43352d] transition hover:border-[#d7b79a]"
        >
          <input
            type="radio"
            name={name}
            className="mt-1 h-4 w-4 shrink-0 accent-[#b18a66]"
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
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
  const [countdown, setCountdown] = useState(getTimeLeft);
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
  const heroRef = useRef(null);
  const timerRef = useRef(null);
  const knobX = useMotionValue(0);
  const progressWidth = useTransform(knobX, [0, sliderMax], ["0%", "100%"]);
  const swipeHint = useTransform(knobX, [0, sliderMax * 0.6], [1, 0.2]);

  const sliderTransition = useMemo(
    () => ({ type: "spring", stiffness: 320, damping: 30 }),
    []
  );

  useEffect(() => {
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

  const timerCard = (
    <div className="rounded-[2rem] border border-white/20 bg-[rgba(34,26,23,0.58)] p-5 text-[#fffaf4] shadow-[0_18px_60px_rgba(16,10,8,0.28)] backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.3em] text-[#e9cfad]">
        <CalendarDays className="h-4 w-4" />
        До весілля залишилось
      </div>
      <div className="grid grid-cols-4 gap-3">
        {countdown.map((item) => (
          <div
            key={item.label}
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

  return (
    <main className="min-h-screen bg-[#f7f1ea] text-[#2e2521]">
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
          <div className="scale-[0.84] origin-top">{timerCard}</div>
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
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/IMG_8548.JPG"
            className="h-full w-full object-cover bg-[#1a1512]"
          >
            <source src="/IMG_8832.MP4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,16,14,0.18),rgba(20,16,14,0.72))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,244,230,0.34),transparent_46%)]" />
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-5 pb-10 pt-8">
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

      <section ref={heroRef} className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/IMG_8548.JPG"
            alt="Роман та Оксана"
            className="h-full w-full object-cover object-[92%_22%] sm:object-[72%_center]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(39,28,24,0.24),rgba(39,28,24,0.68))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,244,230,0.26),transparent_46%)]" />
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-5 pb-10 pt-8">
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
                  Запрошуємо вас розділити з нами день, у якому любов звучатиме особливо тихо,
                  красиво й назавжди.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.16}>
              <div ref={timerRef}>{timerCard}</div>
            </FadeIn>
          </div>
        </div>
      </section>

      <div className="relative mx-auto max-w-md px-5 pb-20">
        <div className="absolute inset-x-5 top-0 -z-10 h-40 rounded-full bg-[#e7c6b2]/40 blur-3xl" />

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
              text="Зібрали для вас усе найважливіше, щоб дорога до нас була легкою і спокійною."
            />
          </FadeIn>

          <div className="mt-10 space-y-5">
            {locations.map((location, index) => (
              <FadeIn key={location.title} delay={index * 0.08}>
                <article className="overflow-hidden rounded-[2rem] border border-[#eadbce] bg-[#fffaf6] shadow-[0_16px_44px_rgba(90,63,42,0.08)]">
                  <div className={`relative h-44 bg-gradient-to-br ${location.gradient} p-5`}>
                    <img
                      src={location.image}
                      alt={location.subtitle}
                      className="absolute inset-0 h-full w-full object-cover object-center"
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
                      rel="noreferrer"
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
              title="Стиль у ніжних відтінках"
              text="Світлі, теплі й приглушені тони чудово підтримають атмосферу цього дня."
            />
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="mt-10 rounded-[2rem] border border-[#eadbce] bg-[#fffaf6] p-5 shadow-[0_16px_44px_rgba(90,63,42,0.08)]">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f2e4d9] text-[#9e7a5e]">
                  <Shirt className="h-5 w-5" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-[#31251f]">Деталі згодом</h3>
                  <p className="text-sm leading-7 text-[#6b5b50]">
                    Незабаром тут з&apos;являться референси кольорів та легкий візуальний гід по
                    образах для гостей.
                  </p>
                  <div className="flex gap-2">
                    {["#f0e2d3", "#dfc1b2", "#b79d87", "#786459"].map((color) => (
                      <span
                        key={color}
                        className="h-10 w-10 rounded-full border border-white shadow-inner"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
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
              text="Найбільша цінність для нас, що ви будете поруч. А ще залишили маленьке побажання щодо подарунків."
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
                  Якщо захочете привітати нас подарунком, будемо дуже вдячні за внесок у наші
                  спільні мрії. Замість квітів із радістю приймемо теплі слова, обійми та
                  святковий конверт.
                </p>
              </article>
            </FadeIn>

            <FadeIn delay={0.14}>
              <article className="rounded-[2rem] border border-[#eadbce] bg-[#fffaf6] p-5 shadow-[0_16px_44px_rgba(90,63,42,0.08)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f3e5da] text-[#9a765b]">
                    <MessagesSquare className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#31251f]">Тепла атмосфера</h3>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#6b5b50]">
                  Хочемо, щоб цей день був легким, щирим і дуже нашим. Дякуємо, що розділите з
                  нами ці миті з любов&apos;ю й радістю.
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
              text="Ми щиро чекаємо на зустріч із вами. Будь ласка, заповніть цю форму до 1 червня включно. Якщо ви плануєте бути з парою, вкажіть інформацію за обох осіб."
            />
          </FadeIn>

          <FadeIn delay={0.08}>
            <form className="mt-10 rounded-[2.2rem] border border-[#e6d4c6] bg-[linear-gradient(180deg,#fffaf6,#f8efe8)] p-5 shadow-[0_20px_56px_rgba(90,63,42,0.1)]">
              <div className="space-y-6">
                <div className="rounded-[1.6rem] border border-[#ead8cc] bg-white/55 p-4">
                  <p className="text-sm font-semibold text-[#342923]">1. Ваша присутність</p>
                  <p className="mt-1 text-sm leading-6 text-[#746458]">
                    Оберіть варіант, який найточніше відповідає вашим планам.
                  </p>
                  <label className="mt-4 block space-y-2">
                    <span className="text-sm font-medium text-[#5e4b3f]">Відповідь</span>
                    <select className="h-14 w-full rounded-[1.2rem] border border-[#e4d4c7] bg-white/80 px-4 text-sm text-[#302622] outline-none transition focus:border-[#b18a66] focus:ring-4 focus:ring-[#e8d3bf]/50">
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
                        type="text"
                        placeholder="Ім'я та прізвище"
                        className="h-14 w-full rounded-[1.2rem] border border-[#e4d4c7] bg-white/80 px-4 text-sm text-[#302622] outline-none transition placeholder:text-[#a08c7d] focus:border-[#b18a66] focus:ring-4 focus:ring-[#e8d3bf]/50"
                      />
                    </label>
                    <label className="block space-y-2">
                      <span className="text-sm font-medium text-[#5e4b3f]">
                        Ім&apos;я та прізвище супутника/супутниці (якщо йдете не самі)
                      </span>
                      <input
                        type="text"
                        placeholder="Ім'я та прізвище"
                        className="h-14 w-full rounded-[1.2rem] border border-[#e4d4c7] bg-white/80 px-4 text-sm text-[#302622] outline-none transition placeholder:text-[#a08c7d] focus:border-[#b18a66] focus:ring-4 focus:ring-[#e8d3bf]/50"
                      />
                    </label>
                  </div>
                </div>

                <div className="rounded-[1.6rem] border border-[#ead8cc] bg-white/55 p-4">
                  <p className="text-sm font-semibold text-[#342923]">3. Розклад та вінчання</p>
                  <p className="mt-1 text-sm leading-6 text-[#746458]">
                    Підкажіть, будь ласка, на яку частину свята ви плануєте приєднатися.
                  </p>
                  <RadioGroup name="ceremony" options={ceremonyOptions} />
                </div>

                <div className="rounded-[1.6rem] border border-[#ead8cc] bg-white/55 p-4">
                  <p className="text-sm font-semibold text-[#342923]">4. Трансфер та логістика 🚗</p>
                  <p className="mt-1 text-sm leading-6 text-[#746458]">
                    <strong>(Оберіть варіант, який вам підходить)</strong>
                  </p>
                  <RadioGroup name="transfer" options={transferOptions} />
                </div>

                <div className="rounded-[1.6rem] border border-[#ead8cc] bg-white/55 p-4">
                  <p className="text-sm font-semibold text-[#342923]">5. Проживання у готелі 🏨</p>
                  <p className="mt-1 text-sm leading-6 text-[#746458]">
                    Якщо ви плануєте залишитися з ночівлею, ми можемо забронювати для вас номер.
                    <strong> Оплата здійснюється гостем при поселенні.</strong>
                  </p>
                  <label className="mt-4 block space-y-2">
                    <span className="text-sm font-medium text-[#5e4b3f]">Проживання</span>
                    <select className="h-14 w-full rounded-[1.2rem] border border-[#e4d4c7] bg-white/80 px-4 text-sm text-[#302622] outline-none transition focus:border-[#b18a66] focus:ring-4 focus:ring-[#e8d3bf]/50">
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
                  <div className="mt-4 space-y-3">
                    <span className="text-sm font-medium text-[#5e4b3f]">
                      Вибір напоїв для вас двох
                    </span>

                    <CheckboxGroup
                      options={[
                        "Безалкогольні напої",
                        "Віскі",
                        "Джин",
                        "Горілка",
                        "Бренді / Коньяк",
                        "Самогонка «Від татуся Андрія» 🌾",
                        "Пиво"
                      ]}
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
                      expandedOptions={whiteWineOptions}
                      expandedValues={selectedWhiteWineTypes}
                      onExpandedToggle={(value) => toggleValue(value, setSelectedWhiteWineTypes)}
                    />

                    <ExpandableDrinkOption
                      label="Вино червоне"
                      checked={selectedDrinks.includes("Вино червоне")}
                      onToggle={() => toggleDrinkCategory("Вино червоне")}
                      isOpen={openDrinkSections.red}
                      onOpenToggle={() => toggleDrinkSectionOpen("red")}
                      expandedOptions={redWineOptions}
                      expandedValues={selectedRedWineTypes}
                      onExpandedToggle={(value) => toggleValue(value, setSelectedRedWineTypes)}
                    />
                  </div>
                </div>

                <div className="rounded-[1.6rem] border border-[#ead8cc] bg-white/55 p-4">
                  <p className="text-sm font-semibold text-[#342923]">7. Зворотний зв&apos;язок</p>
                  <p className="mt-1 text-sm leading-6 text-[#746458]">
                    Якщо у вас залишилися запитання, які вас турбують, або ви хочете уточнити
                    деталі, на які ми маємо вам відповісти, напишіть їх тут.
                  </p>
                  <label className="mt-4 block space-y-2">
                    <span className="text-sm font-medium text-[#5e4b3f]">Запитання та коментарі</span>
                    <textarea
                      rows={5}
                      placeholder="Ваші запитання та коментарі"
                      className="w-full rounded-[1.2rem] border border-[#e4d4c7] bg-white/80 px-4 py-3 text-sm text-[#302622] outline-none transition placeholder:text-[#a08c7d] focus:border-[#b18a66] focus:ring-4 focus:ring-[#e8d3bf]/50"
                    />
                  </label>
                </div>
              </div>

              <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2f2621] px-5 py-4 text-sm font-medium text-[#fff8f1] shadow-[0_16px_32px_rgba(47,38,33,0.24)] transition hover:bg-[#1f1815]">
                <Send className="h-4 w-4" />
                Надіслати
              </button>
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
                  <h3 className="mt-1 text-xl font-semibold text-[#31251f]">Анна Коваленко</h3>
                  <p className="mt-1 text-sm text-[#6b5b50]">+380 67 000 00 00</p>
                </div>
              </div>
            </article>
          </FadeIn>
        </section>

        <FadeIn delay={0.08}>
          <footer className="pb-4 pt-16 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e2d0c3] bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.28em] text-[#9d795c]">
              <Check className="h-4 w-4" />
              З любов&apos;ю чекаємо на вас
            </div>
            <p className="mt-5 font-script text-4xl text-[#b38863]">Roman & Oksana</p>
            <p className="mt-2 text-sm text-[#7b695d]">10 липня 2026</p>
          </footer>
        </FadeIn>
      </div>
    </main>
  );
}
