import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  Link2,
  PackageCheck,
  ReceiptText,
  ScanSearch,
  ShieldCheck,
  Star,
  Users,
  Wallet,
} from 'lucide-react';
import Logo from '@/components/common/Logo';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { APP_ROUTES } from '@/utils/routes';

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.16, rootMargin: '0px 0px -48px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

const REVIEWS = [
  {
    name: 'Priya Shah',
    role: 'Operations Lead · Floor',
    rating: 5,
    avatar:
      'https://images.pexels.com/photos/7752788/pexels-photo-7752788.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
    quote:
      'Attendance, payouts, and stock finally live in one place. Close-out used to take an hour — now the floor already knows the status.',
  },
  {
    name: 'Marcus Chen',
    role: 'Warehouse Manager',
    rating: 5,
    avatar:
      'https://images.pexels.com/photos/5308640/pexels-photo-5308640.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
    quote:
      'Container tracking stopped being a spreadsheet chase. Everyone sees the same current view, including walk-ins.',
  },
  {
    name: 'Elena Vargas',
    role: 'Payroll Admin',
    rating: 4.5,
    avatar:
      'https://images.pexels.com/photos/37272329/pexels-photo-37272329.png?auto=compress&cs=tinysrgb&h=120&w=120',
    quote:
      'Loans and payouts stay tied to the shift record. Fewer handoffs, fewer “who approved this?” messages at week’s end.',
  },
  {
    name: 'James Okonkwo',
    role: 'Floor Supervisor',
    rating: 5,
    avatar:
      'https://images.pexels.com/photos/14950779/pexels-photo-14950779.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
    quote:
      'I open the shift, check who’s on site, and move on. No more chasing three chats for one roster answer.',
  },
  {
    name: 'Aisha Rahman',
    role: 'Inventory Coordinator',
    rating: 4.5,
    avatar:
      'https://images.pexels.com/photos/33680700/pexels-photo-33680700.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
    quote:
      'Stock and expenses stay connected to the same day. Mid-shift questions finally have one place to look.',
  },
  {
    name: 'Tomás Rivera',
    role: 'Site Admin',
    rating: 5,
    avatar:
      'https://images.pexels.com/photos/35490803/pexels-photo-35490803.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
    quote:
      'Role views keep sensitive actions focused. Leads get what they need without seeing what they shouldn’t.',
  },
  {
    name: 'Sofia Patel',
    role: 'Customer Desk',
    rating: 5,
    avatar:
      'https://images.pexels.com/photos/16160809/pexels-photo-16160809.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
    quote:
      'Walk-ins and ring customers show up on the same board as container status. The desk feels calmer already.',
  },
  {
    name: 'Daniel Kim',
    role: 'Shift Lead',
    rating: 4.5,
    avatar:
      'https://images.pexels.com/photos/35681211/pexels-photo-35681211.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
    quote:
      'End-of-day used to mean notebooks and screenshots. Now settlement closes against one shared record.',
  },
] as const;

const FAQS: [string, string][] = [
  [
    'What is OpsPilot for?',
    'OpsPilot is the workspace for attendance, payouts, inventory, expenses, customers, and container tracking — one place for the whole shift.',
  ],
  [
    'Who can use it?',
    'Admins and employees each get a role-aware view. Floor leads, payroll, and site admins see what they need for their day — and only that.',
  ],
  [
    'How fast can our team get started?',
    'Most teams feel at home within a day. Sign in, set roles, and start managing the shift from one shared operational record.',
  ],
  [
    'Does OpsPilot support dark mode?',
    'Yes. Light and dark themes stay on-brand, and your preference is saved so every visit matches how you work.',
  ],
  [
    'Can we control who sees sensitive actions?',
    'Yes. Role-based access keeps payouts, loans, and admin actions focused while giving each person the information they need.',
  ],
  [
    'Is attendance connected to payouts?',
    'Yes. Clock-ins, work logs, loans, and payouts stay linked from shift open through settlement — fewer handoffs and fewer gaps.',
  ],
  [
    'How do we request access?',
    'Use Sign in if you already have an account, or contact your admin / request access from the footer to get a workspace.',
  ],
  [
    'What if I forget my password?',
    'Use Forgot password on the sign-in page to reset securely and get back to your workspace without waiting on the floor.',
  ],
];

const Landing: React.FC = () => {
  const trustReveal = useReveal<HTMLElement>();
  const modulesReveal = useReveal<HTMLElement>();
  const workflowReveal = useReveal<HTMLElement>();
  const outcomesReveal = useReveal<HTMLElement>();
  const ratingsReveal = useReveal<HTMLElement>();
  const teamsReveal = useReveal<HTMLElement>();
  const securityReveal = useReveal<HTMLElement>();
  const faqReveal = useReveal<HTMLElement>();
  const accessReveal = useReveal<HTMLElement>();
  const [activeFaq, setActiveFaq] = useState(0);

  return (
    <div className="min-h-screen overflow-x-hidden bg-ivory font-landing text-charcoal antialiased transition-colors duration-300">
      <nav
        aria-label="Main navigation"
        className="sticky top-0 z-30 border-b border-line/60 bg-ivory/75 backdrop-blur-2xl"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-6">
          <a href="#top" className="flex items-center" aria-label="OpsPilot home">
            <Logo variant="primary" height={36} />
          </a>
          <div className="hidden items-center gap-8 text-sm text-muted md:flex">
            <a href="#modules" className="transition-colors hover:text-charcoal">Modules</a>
            <a href="#workflow" className="transition-colors hover:text-charcoal">Workflow</a>
            <a href="#ratings" className="transition-colors hover:text-charcoal">Ratings</a>
            <a href="#faq" className="transition-colors hover:text-charcoal">FAQ</a>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to={APP_ROUTES.AUTH.LOGIN}
              className="rounded-full bg-charcoal px-4 py-2 text-sm font-medium text-ivory transition-transform hover:-translate-y-px"
            >
              Sign in
            </Link>
          </div>
        </div>
      </nav>

      <main id="top">
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <header className="hero-wash relative overflow-hidden border-b border-line/50">
          <div className="landing-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-20 lg:pt-20">
            <div className="rise-in max-w-[40rem]">
              <p className="font-display text-3xl font-bold tracking-tight text-charcoal sm:text-4xl lg:text-[2.75rem]">
                Ops<span className="text-gold">Pilot</span>
              </p>
              <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-[3.4rem]">
                Run the whole operation from one calm desk.
              </h1>
              <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-muted sm:text-lg">
                Attendance, payouts, inventory, expenses, customers, and containers — every status clear, every shift organized.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to={APP_ROUTES.AUTH.LOGIN}
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-panel transition-transform hover:-translate-y-px"
                >
                  Access OpsPilot <ArrowRight className="size-4" />
                </Link>
                <a
                  href="#modules"
                  className="rounded-full bg-elevated/80 px-6 py-3 text-sm font-medium text-charcoal ring-1 ring-line transition-colors hover:bg-elevated"
                >
                  Explore modules
                </a>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-muted">
                <StarRow rating={5} />
                <span>
                  <strong className="font-semibold text-charcoal">4.9</strong> average from operations teams
                </span>
              </div>
            </div>

            <DashboardPreview />
          </div>
          <div className="shimmer-line absolute inset-x-0 bottom-0 h-px" aria-hidden />
        </header>

        {/* ── Trust strip ──────────────────────────────────────────────────── */}
        <section
          ref={trustReveal.ref}
          className={`border-b border-line/50 bg-elevated/40 reveal-up ${trustReveal.visible ? 'reveal-up-visible' : ''}`}
        >
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-12 px-5 py-16 sm:grid-cols-4 sm:gap-x-10 sm:gap-y-12 sm:px-6 sm:py-20">
            <TrustStat
              end={4.9}
              decimals={1}
              suffix="★"
              label="Team rating"
              delayMs={0}
              visible={trustReveal.visible}
            />
            <TrustStat
              end={98}
              suffix="%"
              label="Shift clarity"
              delayMs={100}
              visible={trustReveal.visible}
            />
            <TrustStat
              end={6}
              label="Core modules"
              delayMs={200}
              visible={trustReveal.visible}
            />
            <TrustStat
              end={1}
              prefix="<"
              suffix=" day"
              label="To feel at home"
              delayMs={300}
              visible={trustReveal.visible}
            />
          </div>
        </section>

        {/* ── Modules ──────────────────────────────────────────────────────── */}
        <section
          id="modules"
          ref={modulesReveal.ref}
          className={`reveal-up ${modulesReveal.visible ? 'reveal-up-visible' : ''}`}
        >
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6">
            <SectionHeader
              eyebrow="Connected operations"
              title="Every module, in one place."
              subtitle="One shared operational record across the floor and the office."
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <ModuleCard
                icon={Clock3}
                title="Attendance & payouts"
                text="Clock-ins, work logs, loans, and payouts stay connected from shift to settlement."
                delayMs={0}
                visible={modulesReveal.visible}
              />
              <ModuleCard
                icon={Boxes}
                title="Inventory & expenses"
                text="Monitor stock movement and operating spend without losing context between teams."
                delayMs={90}
                visible={modulesReveal.visible}
              />
              <ModuleCard
                icon={PackageCheck}
                title="Containers & customers"
                text="Track containers, walk-ins, and ring customers on a single current view."
                delayMs={180}
                visible={modulesReveal.visible}
              />
            </div>
          </div>
        </section>

        {/* ── Workflow ─────────────────────────────────────────────────────── */}
        <section
          id="workflow"
          ref={workflowReveal.ref}
          className={`border-y border-line/50 bg-cool/30 reveal-up ${workflowReveal.visible ? 'reveal-up-visible' : ''}`}
        >
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-24">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">How a shift runs</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem]">
                One flow.<br />
                <span className="text-gold">Zero scramble.</span>
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted sm:text-base">
                From open to close, the floor, office, and leads stay on the same live picture of the day.
              </p>

              <div
                className={`mt-8 overflow-hidden rounded-3xl border border-line/70 bg-panel p-5 text-on-panel sm:p-6 reveal-up ${workflowReveal.visible ? 'reveal-up-visible' : ''}`}
                style={{ transitionDelay: workflowReveal.visible ? '120ms' : '0ms' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="soft-pulse size-2 rounded-full bg-gold" />
                    <span className="text-[11px] font-semibold tracking-wide text-on-panel/70">Live shift · Today</span>
                  </div>
                  <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-medium text-on-panel/65">
                    In progress
                  </span>
                </div>
                <div className="mt-5 space-y-3">
                  {[
                    { label: 'Roster locked', done: true },
                    { label: 'Floor activity updating', done: true },
                    { label: 'Settlement pending', done: false },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-xl bg-white/[0.06] px-3.5 py-2.5 ring-1 ring-white/10"
                    >
                      <span className="text-sm text-on-panel/85">{item.label}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          item.done ? 'bg-gold/20 text-gold' : 'bg-white/10 text-on-panel/50'
                        }`}
                      >
                        {item.done ? 'Done' : 'Next'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <ol className="relative space-y-0">
              <div
                className={`workflow-line absolute bottom-6 left-[1.35rem] top-6 w-px origin-top bg-gradient-to-b from-gold via-gold/50 to-transparent sm:left-6 ${
                  workflowReveal.visible ? 'workflow-line-visible' : ''
                }`}
                aria-hidden
              />
              <WorkflowStep
                step="01"
                icon={ClipboardList}
                title="Open the shift"
                text="Attendance and assignments land in one place before the rush begins."
                delayMs={180}
                visible={workflowReveal.visible}
              />
              <WorkflowStep
                step="02"
                icon={Boxes}
                title="Track the day"
                text="Inventory, expenses, and walk-ins update while leads stay on the floor."
                delayMs={360}
                visible={workflowReveal.visible}
              />
              <WorkflowStep
                step="03"
                icon={CheckCircle2}
                title="Settle cleanly"
                text="Payouts, containers, and day-end records close without chasing notes."
                delayMs={540}
                visible={workflowReveal.visible}
              />
            </ol>
          </div>
        </section>

        {/* ── Outcomes ─────────────────────────────────────────────────────── */}
        <section
          id="outcomes"
          ref={outcomesReveal.ref}
          className={`reveal-up ${outcomesReveal.visible ? 'reveal-up-visible' : ''}`}
        >
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Designed for daily work</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem]">
                Clarity that lasts the{' '}
                <span className="text-gold">whole shift.</span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
                Less noise between teams. More signal when you need to decide.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              <OutcomeCard
                icon={Link2}
                metric="−62%"
                title="Manual handoffs"
                text="One operational record follows work from attendance through payout and reporting."
                delayMs={0}
                visible={outcomesReveal.visible}
              />
              <OutcomeCard
                icon={ScanSearch}
                metric="3×"
                title="Faster status checks"
                text="Ownership and activity stay easy to scan before small issues become blockers."
                delayMs={100}
                visible={outcomesReveal.visible}
              />
              <OutcomeCard
                icon={Clock3}
                metric="<2m"
                title="To a clear decision"
                text="Inventory, expenses, customers, and movements stay visible in one workspace."
                delayMs={200}
                visible={outcomesReveal.visible}
              />
            </div>
          </div>
        </section>

        {/* ── Ratings ──────────────────────────────────────────────────────── */}
        <section
          id="ratings"
          ref={ratingsReveal.ref}
          className={`overflow-hidden border-y border-line/50 bg-elevated/50 reveal-up ${ratingsReveal.visible ? 'reveal-up-visible' : ''}`}
        >
          <div className="mx-auto max-w-6xl px-5 pt-20 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Loved by teams</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Don’t take our word for it.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                Operations teams rate OpsPilot for clarity, speed, and fewer end-of-day surprises.
              </p>
            </div>

            <div
              className={`mx-auto mt-10 flex max-w-xl flex-wrap items-center justify-center gap-8 rounded-2xl border border-line/70 bg-elevated/80 p-6 sm:p-8 reveal-up ${ratingsReveal.visible ? 'reveal-up-visible' : ''}`}
              style={{ transitionDelay: ratingsReveal.visible ? '80ms' : '0ms' }}
            >
              <div className="text-center sm:text-left">
                <div className="flex items-end justify-center gap-2 sm:justify-start">
                  <span className="font-display text-5xl font-extrabold tracking-tight">4.9</span>
                  <span className="mb-1.5 text-sm text-muted">/ 5</span>
                </div>
                <StarRow rating={5} className="mt-2 justify-center sm:justify-start" />
                <p className="mt-2 text-sm text-muted">Based on team feedback</p>
              </div>
              <div className="min-w-[12rem] flex-1 space-y-2">
                <RatingBar label="Ease of use" value={96} />
                <RatingBar label="Daily reliability" value={94} />
                <RatingBar label="Role clarity" value={92} />
              </div>
            </div>
          </div>

          <div className="mt-14 pb-20">
            <ReviewMarquee />
          </div>
        </section>

        {/* ── Teams ────────────────────────────────────────────────────────── */}
        <section
          id="teams"
          ref={teamsReveal.ref}
          className={`reveal-up ${teamsReveal.visible ? 'reveal-up-visible' : ''}`}
        >
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6">
            <SectionHeader
              eyebrow="Built for the floor"
              title="Each role gets the view it needs."
            />
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <TeamRole
                icon={ClipboardCheck}
                role="Floor leads"
                text="See who’s on site, what’s moving, and what still needs attention before the next handoff."
                delayMs={0}
                visible={teamsReveal.visible}
              />
              <TeamRole
                icon={Wallet}
                role="Office & payroll"
                text="Review attendance, loans, and payouts from the same record the floor already trusts."
                delayMs={90}
                visible={teamsReveal.visible}
              />
              <TeamRole
                icon={ShieldCheck}
                role="Admins"
                text="Set access, keep sensitive actions focused, and stay current without living in every module."
                delayMs={180}
                visible={teamsReveal.visible}
              />
            </div>
          </div>
        </section>

        {/* ── Security ─────────────────────────────────────────────────────── */}
        <section
          id="security"
          ref={securityReveal.ref}
          className={`border-y border-line/50 bg-cool/30 reveal-up ${securityReveal.visible ? 'reveal-up-visible' : ''}`}
        >
          <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:px-6 md:grid-cols-[0.85fr_1.15fr] md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Controlled access</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
                The right view for every role.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-relaxed text-muted">
              Admin and employee workspaces keep sensitive actions focused while giving each person the information they need for their day — with light and dark themes that stay on-brand.
            </p>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section
          id="faq"
          ref={faqReveal.ref}
          className={`reveal-up ${faqReveal.visible ? 'reveal-up-visible' : ''}`}
        >
          <div className="mx-auto max-w-3xl px-5 py-20 sm:px-6">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Questions, answered</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Let’s make this easy.
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
                Clear answers about OpsPilot — roles, access, and how the day runs.
              </p>
            </div>

            <div className="mt-10 divide-y divide-line/80 rounded-2xl border border-line/80 bg-elevated/70 px-5 sm:px-7">
              {FAQS.map(([question, answer], index) => {
                const open = activeFaq === index;
                return (
                  <div key={question} className="py-4 sm:py-5">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-4 text-left"
                      aria-expanded={open}
                      onClick={() => setActiveFaq(open ? -1 : index)}
                    >
                      <span className="text-sm font-semibold text-charcoal sm:text-[15px]">{question}</span>
                      <ChevronDown
                        className={`size-4 shrink-0 text-gold transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                        aria-hidden
                      />
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                        open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-2xl pr-8 pt-3 text-sm leading-7 text-muted">{answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section
          id="access"
          ref={accessReveal.ref}
          className={`reveal-up ${accessReveal.visible ? 'reveal-up-visible' : ''}`}
        >
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6">
            <div className="relative overflow-hidden rounded-3xl bg-panel px-7 py-10 text-on-panel sm:px-12 sm:py-14">
              <div
                className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-gold/20 blur-3xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -bottom-24 left-10 size-56 rounded-full bg-cool/30 blur-3xl"
                aria-hidden
              />
              <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
                <div className="max-w-xl">
                  <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                    Your next shift, already organized.
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-on-panel/65 sm:text-base">
                    Open your OpsPilot workspace and manage the day from one dependable system.
                  </p>
                </div>
                <Link
                  to={APP_ROUTES.AUTH.LOGIN}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-[#1a1a1a] transition-transform hover:-translate-y-px"
                >
                  Open your workspace <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line/50 bg-elevated/40">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div className="max-w-sm">
              <Logo variant="primary" height={44} />
              <p className="mt-4 text-sm leading-6 text-muted">
                OpsPilot is the workspace for attendance, payouts, inventory, expenses, customers, and container tracking.
              </p>
              <div className="mt-6 flex items-center gap-2">
                <ThemeToggle />
                <Link
                  to={APP_ROUTES.AUTH.LOGIN}
                  className="inline-flex items-center gap-2 rounded-full bg-charcoal px-5 py-2.5 text-sm font-medium text-ivory transition-transform hover:-translate-y-px"
                >
                  Sign in <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>

            <FooterColumn
              title="Product"
              links={[
                { href: '#modules', label: 'Modules' },
                { href: '#workflow', label: 'Workflow' },
                { href: '#ratings', label: 'Ratings' },
                { href: '#faq', label: 'FAQ' },
                { href: '#access', label: 'Get access' },
              ]}
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Workspace</p>
              <ul className="mt-4 space-y-3 text-sm text-muted">
                <li>
                  <Link to={APP_ROUTES.AUTH.LOGIN} className="transition-colors hover:text-charcoal">
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link to={APP_ROUTES.AUTH.FORGOT_PASSWORD} className="transition-colors hover:text-charcoal">
                    Forgot password
                  </Link>
                </li>
                <li>
                  <a href="mailto:admin@opspilot.app" className="transition-colors hover:text-charcoal">
                    Request access
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Operations</p>
              <ul className="mt-4 space-y-3 text-sm text-muted">
                <li>Attendance & payouts</li>
                <li>Inventory & expenses</li>
                <li>Containers & customers</li>
                <li>Role-based access</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-line/50">
          <div className="mx-auto max-w-6xl px-5 py-6 text-center text-sm text-muted sm:px-6">
            <span>© 2026 OpsPilot · Built for daily operations</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{subtitle}</p> : null}
    </div>
  );
}

function StarRow({
  rating,
  className = '',
  size = 'md',
}: {
  rating: number;
  className?: string;
  size?: 'sm' | 'md';
}) {
  const iconClass = size === 'sm' ? 'size-3.5' : 'size-4';
  return (
    <span className={`inline-flex items-center gap-0.5 text-gold ${className}`} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i + 1 <= Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <Star
            key={i}
            className={iconClass}
            fill={filled || half ? 'currentColor' : 'none'}
            strokeWidth={filled || half ? 0 : 1.75}
            style={half ? { opacity: 0.55 } : undefined}
          />
        );
      })}
    </span>
  );
}

function useCountUp(end: number, visible: boolean, delayMs = 0, durationMs = 1200, decimals = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!visible) {
      setValue(0);
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(end);
      return;
    }

    let frame = 0;
    let startTime: number | null = null;
    const timeout = window.setTimeout(() => {
      const tick = (now: number) => {
        if (startTime === null) startTime = now;
        const progress = Math.min((now - startTime) / durationMs, 1);
        const eased = 1 - (1 - progress) ** 3;
        setValue(end * eased);
        if (progress < 1) {
          frame = requestAnimationFrame(tick);
        } else {
          setValue(end);
        }
      };
      frame = requestAnimationFrame(tick);
    }, delayMs);

    return () => {
      window.clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [end, visible, delayMs, durationMs, decimals]);

  return decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
}

function TrustStat({
  end,
  label,
  prefix = '',
  suffix = '',
  decimals = 0,
  delayMs = 0,
  visible = false,
}: {
  end: number;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delayMs?: number;
  visible?: boolean;
}) {
  const display = useCountUp(end, visible, delayMs, 1300, decimals);

  return (
    <div
      className={`flex flex-col items-center justify-center px-2 text-center reveal-up ${visible ? 'reveal-up-visible' : ''}`}
      style={{ transitionDelay: visible ? `${delayMs}ms` : '0ms' }}
    >
      <div className="font-display text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">
        {prefix}
        {display}
        {suffix}
      </div>
      <div className="mt-2.5 text-xs text-muted sm:mt-3 sm:text-sm">{label}</div>
    </div>
  );
}

function ModuleCard({
  icon: Icon,
  title,
  text,
  delayMs = 0,
  visible = false,
}: {
  icon: typeof Clock3;
  title: string;
  text: string;
  delayMs?: number;
  visible?: boolean;
}) {
  return (
    <article
      className={`group glass-surface rounded-2xl p-6 transition-transform hover:-translate-y-1 reveal-up ${visible ? 'reveal-up-visible' : ''}`}
      style={{ transitionDelay: visible ? `${delayMs}ms` : '0ms' }}
    >
      <div className="grid size-11 place-items-center rounded-xl bg-cool text-charcoal transition-colors group-hover:bg-gold/20 group-hover:text-gold">
        <Icon className="size-5" />
      </div>
      <h3 className="mt-5 font-display text-base font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
    </article>
  );
}

function WorkflowStep({
  step,
  icon: Icon,
  title,
  text,
  delayMs = 0,
  visible = false,
}: {
  step: string;
  icon: typeof Clock3;
  title: string;
  text: string;
  delayMs?: number;
  visible?: boolean;
}) {
  return (
    <li
      className={`relative flex gap-4 pb-8 last:pb-0 reveal-up ${visible ? 'reveal-up-visible' : ''}`}
      style={{ transitionDelay: visible ? `${delayMs}ms` : '0ms' }}
    >
      <div
        className={`relative z-10 grid size-11 shrink-0 place-items-center rounded-2xl border border-line/80 bg-elevated text-gold shadow-sm sm:size-12 workflow-icon ${
          visible ? 'workflow-icon-visible' : ''
        }`}
        style={{ animationDelay: visible ? `${delayMs + 80}ms` : '0ms' }}
      >
        <span
          className={`absolute inset-0 rounded-2xl bg-gold/15 workflow-icon-ring ${
            visible ? 'workflow-icon-ring-visible' : ''
          }`}
          style={{ animationDelay: visible ? `${delayMs + 120}ms` : '0ms' }}
          aria-hidden
        />
        <Icon className="relative size-5" />
      </div>
      <div className="min-w-0 pt-0.5">
        <div className="flex items-center gap-2">
          <span className="font-display text-xs font-bold tracking-[0.14em] text-gold">{step}</span>
          <span
            className={`h-px flex-1 origin-left bg-line/70 workflow-rule ${
              visible ? 'workflow-rule-visible' : ''
            }`}
            style={{ transitionDelay: visible ? `${delayMs + 160}ms` : '0ms' }}
            aria-hidden
          />
        </div>
        <h3 className="mt-2 font-display text-lg font-semibold tracking-tight">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{text}</p>
      </div>
    </li>
  );
}

function OutcomeCard({
  icon: Icon,
  metric,
  title,
  text,
  delayMs = 0,
  visible = false,
}: {
  icon: typeof Clock3;
  metric: string;
  title: string;
  text: string;
  delayMs?: number;
  visible?: boolean;
}) {
  return (
    <article
      className={`group relative overflow-hidden rounded-3xl border border-line/70 bg-elevated/70 p-6 transition-transform hover:-translate-y-1 sm:p-7 reveal-up ${visible ? 'reveal-up-visible' : ''}`}
      style={{ transitionDelay: visible ? `${delayMs}ms` : '0ms' }}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-gold/10 transition-transform group-hover:scale-125"
        aria-hidden
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="grid size-11 place-items-center rounded-2xl bg-cool text-charcoal transition-colors group-hover:bg-gold/20 group-hover:text-gold">
          <Icon className="size-5" />
        </div>
        <span className="font-display text-2xl font-extrabold tracking-tight text-gold sm:text-3xl">
          {metric}
        </span>
      </div>
      <h3 className="relative mt-6 font-display text-base font-semibold tracking-tight sm:text-lg">{title}</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-muted">{text}</p>
    </article>
  );
}

function RatingBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-muted">
        <span>{label}</span>
        <span className="font-medium text-charcoal">{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-line/80">
        <div className="h-full rounded-full bg-gold" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function ReviewMarquee() {
  const track = [...REVIEWS, ...REVIEWS];

  return (
    <div className="review-marquee relative">
      <div className="review-marquee-fade pointer-events-none absolute inset-y-0 left-0 z-10 w-12 sm:w-28" aria-hidden />
      <div className="review-marquee-fade-right pointer-events-none absolute inset-y-0 right-0 z-10 w-12 sm:w-28" aria-hidden />
      <div className="overflow-hidden">
        <div className="review-marquee-track flex w-max" aria-label="Customer reviews">
          {track.map((review, index) => (
            <ReviewCard
              key={`${review.name}-${index}`}
              {...review}
              ariaHidden={index >= REVIEWS.length}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ReviewCard({
  name,
  role,
  quote,
  rating,
  avatar,
  ariaHidden = false,
}: {
  name: string;
  role: string;
  quote: string;
  rating: number;
  avatar: string;
  ariaHidden?: boolean;
}) {
  return (
    <article
      className="mr-4 flex w-[300px] shrink-0 flex-col rounded-2xl border border-line/80 bg-elevated p-6 sm:w-[360px]"
      aria-hidden={ariaHidden}
    >
      <div className="flex items-center justify-between">
        <StarRow rating={rating} />
        <span className="text-xs font-bold text-gold">{rating.toFixed(1)}</span>
      </div>
      <p className="mt-4 flex-1 text-sm leading-7 text-muted">{quote}</p>
      <div className="mt-5 flex items-center gap-3 border-t border-line/70 pt-4">
        <img
          src={avatar}
          alt={ariaHidden ? '' : name}
          className="size-11 rounded-full object-cover ring-2 ring-line/60"
          loading="lazy"
          decoding="async"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-charcoal">{name}</p>
          <p className="truncate text-xs text-muted">{role}</p>
        </div>
      </div>
    </article>
  );
}

function TeamRole({
  icon: Icon,
  role,
  text,
  delayMs = 0,
  visible = false,
}: {
  icon: typeof Clock3;
  role: string;
  text: string;
  delayMs?: number;
  visible?: boolean;
}) {
  return (
    <article
      className={`glass-surface rounded-2xl p-6 reveal-up ${visible ? 'reveal-up-visible' : ''}`}
      style={{ transitionDelay: visible ? `${delayMs}ms` : '0ms' }}
    >
      <div className="grid size-11 place-items-center rounded-xl bg-cool text-charcoal">
        <Icon className="size-5" />
      </div>
      <h3 className="mt-5 font-display text-base font-semibold tracking-tight">{role}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
    </article>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">{title}</p>
      <ul className="mt-4 space-y-3 text-sm text-muted">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} className="transition-colors hover:text-charcoal">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DashboardPreview() {
  const bars = [42, 63, 52, 79, 60, 88, 70];
  return (
    <div className="rise-in [animation-delay:140ms]">
      <div className="glass-surface float-soft rounded-[24px] p-3 sm:p-4">
        <div className="rounded-2xl bg-panel p-4 text-on-panel ring-1 ring-white/10">
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <span className="soft-pulse size-2 rounded-full bg-[#E8C96A]" />
              <span className="font-display text-[11px] font-semibold tracking-wide text-on-panel">
                Shift overview · Today
              </span>
            </div>
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-medium text-on-panel/70">
              Live
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Metric label="On site" value="128" note="6 on leave" />
            <Metric label="Payouts" value="94%" note="cleared" />
            <Metric label="Containers" value="17" note="in transit" />
          </div>
          <div className="mt-3 rounded-xl bg-white/[0.08] p-3 ring-1 ring-white/10">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-on-panel/75">Attendance · last 7 days</span>
              <span className="text-[10px] text-on-panel/45">98.2% avg</span>
            </div>
            <div className="mt-4 flex h-16 items-end gap-1.5" aria-label="Attendance activity chart">
              {bars.map((height, index) => (
                <span
                  key={`${height}-${index}`}
                  className={`bar-grow flex-1 rounded-sm ${index === 5 ? 'bg-[#E8C96A]/85' : 'bg-white/25'}`}
                  style={{
                    height: `${height}%`,
                    animationDelay: `${180 + index * 70}ms`,
                  }}
                />
              ))}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-[1fr_1fr_auto] gap-2">
            <SmallMetric icon={ReceiptText} label="Open expenses" value="23" />
            <SmallMetric icon={Users} label="Walk-ins today" value="41" />
            <div className="grid size-12 place-items-center self-end rounded-xl bg-gold font-display text-sm font-bold text-[#1a1a1a]">
              17
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-xl bg-white/[0.08] p-2.5 ring-1 ring-white/10">
      <div className="text-[9px] uppercase tracking-wider text-on-panel/45">{label}</div>
      <div className="mt-1 font-display text-lg font-bold text-on-panel">{value}</div>
      <div className="text-[10px] text-[#E8C96A]">{note}</div>
    </div>
  );
}

function SmallMetric({ icon: Icon, label, value }: { icon: typeof Clock3; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/[0.08] p-2.5 ring-1 ring-white/10">
      <Icon className="mb-2 size-3.5 text-[#E8C96A]" />
      <div className="text-[9px] uppercase tracking-wider text-on-panel/45">{label}</div>
      <div className="mt-1 font-display text-sm font-bold text-on-panel">{value}</div>
    </div>
  );
}

export default Landing;
