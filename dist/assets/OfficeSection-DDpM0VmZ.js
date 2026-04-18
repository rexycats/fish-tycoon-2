import { u as useGameStore, r as reactExports, m as getLoanStatus, j as jsxRuntimeExports, n as getStreakLabel, o as getStreakMultiplier, q as getMilestoneProgress, s as getCompletedCount, t as checkOrderFulfillment, v as RESEARCH_BRANCHES, L as LOAN_TIERS, w as getTotalPossibleDiscoveries, x as TANK_BACKGROUNDS, y as getTotalMilestones, z as getLevelFromXp, F as FishSprite, D as DECOR_CATALOG, B as TANK_THEMES, C as DECOR_CATEGORIES, E as getDecorById, R as RARITY, e as getTotalDailyWages, S as STAFF_ROLES, H as getHireCost, I as getStaffWage, J as getTrainCost, K as getMaxStaff, N as ROOMS, T as TabErrorBoundary } from "./index-Dj6wWOWJ.js";
function canClaimDaily(state) {
  var _a;
  const last = (_a = state.player) == null ? void 0 : _a.lastDailyClaimDate;
  if (!last) return true;
  const today = (/* @__PURE__ */ new Date()).toDateString();
  return last !== today;
}
function getStreak(state) {
  var _a, _b, _c;
  const last = (_a = state.player) == null ? void 0 : _a.lastDailyClaimDate;
  if (!last) return 0;
  const lastDate = new Date(last);
  const today = /* @__PURE__ */ new Date();
  const diff = Math.floor((today - lastDate) / 864e5);
  if (diff === 1) return ((_b = state.player) == null ? void 0 : _b.dailyStreak) || 0;
  if (diff === 0) return ((_c = state.player) == null ? void 0 : _c.dailyStreak) || 0;
  return 0;
}
function GoalsPanel() {
  const player = useGameStore((s) => s.player);
  const fish = useGameStore((s) => s.fish);
  const orders = useGameStore((s) => s.specialOrders) || [];
  const discoveries = useGameStore((s) => s.discoveries) || [];
  const reviews = useGameStore((s) => s.reviews) || [];
  const weather = useGameStore((s) => s.weather);
  const fulfillOrder = useGameStore((s) => s.fulfillOrder);
  const buyResearch = useGameStore((s) => s.buyResearch);
  const takeLoan = useGameStore((s) => s.takeLoan);
  const repayLoan = useGameStore((s) => s.repayLoan);
  const claimDailyReward = useGameStore((s) => s.claimDailyReward);
  const buyBackground = useGameStore((s) => s.buyBackground);
  const claimMilestone = useGameStore((s) => s.claimMilestone);
  const [subTab, setSubTab] = reactExports.useState("campaign");
  const canClaim = canClaimDaily({ player });
  const streak = getStreak({ player });
  const loanStatus = getLoanStatus(player.activeLoan);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "goals-panel", children: [
    weather && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "goals-weather", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: weather.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "goals-weather-effect", children: [
        weather.happinessBonus > 0 ? `+${weather.happinessBonus} happiness` : weather.happinessBonus < 0 ? `${weather.happinessBonus} happiness` : "",
        weather.rare ? " Rare weather!" : ""
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "goals-tabs", children: [
      ["campaign", "Campaign"],
      ["orders", "Orders"],
      ["research", "Research"],
      ["bank", "Bank"],
      ["journal", "Journal"],
      ["backgrounds", "Themes"]
    ].map(([id, label]) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        className: `goals-tab ${subTab === id ? "active" : ""}`,
        onClick: () => setSubTab(id),
        children: label
      },
      id
    )) }),
    streak > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `goals-streak ${streak >= 3 ? "hot" : ""}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: getStreakLabel(streak) || `Day ${streak}` }),
      getStreakMultiplier(streak) > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "goals-streak-mult", children: [
        "+",
        Math.round((getStreakMultiplier(streak) - 1) * 100),
        "% coins"
      ] })
    ] }),
    canClaim && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "goals-daily", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Daily reward ready" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "goals-daily-streak", children: [
        "Day ",
        streak + 1,
        " streak"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-sm btn-primary", onClick: claimDailyReward, children: "Claim!" })
    ] }),
    subTab === "campaign" && (() => {
      const state = useGameStore.getState();
      const chapters = getMilestoneProgress(state);
      const totalDone = getCompletedCount(state);
      const totalAll = getTotalMilestones();
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "goals-section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "goals-section-title", children: [
          "Campaign — ",
          totalDone,
          "/",
          totalAll,
          " milestones"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "campaign-progress-bar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "campaign-progress-fill", style: { width: `${totalDone / totalAll * 100}%` } }) }),
        Object.entries(chapters).map(([ch, info]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "campaign-chapter", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "campaign-chapter-header", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "campaign-chapter-name", children: [
              "Ch.",
              ch,
              ": ",
              info.title
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "campaign-chapter-count", children: [
              info.done,
              "/",
              info.total
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "campaign-milestones", children: info.milestones.map((m) => {
            var _a, _b;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `campaign-milestone ${m.isDone ? "done" : ""} ${m.isReady ? "ready" : ""}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "campaign-milestone-icon", children: m.isDone ? "—" : "" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "campaign-milestone-info", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "campaign-milestone-title", children: m.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "campaign-milestone-desc", children: m.desc })
              ] }),
              m.isDone ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "campaign-milestone-claimed", children: "Claimed" }) : m.isReady ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-sm btn-primary campaign-claim", onClick: () => claimMilestone(m.id), children: [
                "Claim 🪙",
                ((_a = m.reward) == null ? void 0 : _a.coins) || 0
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "campaign-milestone-reward", children: [
                "🪙",
                ((_b = m.reward) == null ? void 0 : _b.coins) || 0
              ] })
            ] }, m.id);
          }) })
        ] }, ch))
      ] });
    })(),
    subTab === "orders" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "goals-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "goals-section-title", children: "Special Orders — refreshes daily" }),
      orders.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "goals-empty", children: "No orders available yet. Keep playing!" }),
      orders.map((order) => {
        const matchingFish = fish.filter((f) => f.stage === "adult" && checkOrderFulfillment(f, order));
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `goals-order ${order.fulfilled ? "fulfilled" : ""}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "goals-order-header", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "goals-order-emoji", children: order.emoji }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "goals-order-desc", children: order.desc }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "goals-order-customer", children: [
                "— ",
                order.customer
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "goals-order-reward", children: [
              "🪙",
              order.reward
            ] })
          ] }),
          order.fulfilled ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "goals-order-done", children: "Fulfilled" }) : matchingFish.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "goals-order-matches", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              matchingFish.length,
              " matching fish:"
            ] }),
            matchingFish.slice(0, 3).map((f) => {
              var _a;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: "btn btn-sm goals-order-fill",
                  onClick: () => fulfillOrder(order.id, f.id),
                  children: [
                    "Sell ",
                    f.nickname || ((_a = f.species) == null ? void 0 : _a.name)
                  ]
                },
                f.id
              );
            })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "goals-order-none", children: "No matching fish — breed or buy one!" })
        ] }, order.id);
      })
    ] }),
    subTab === "research" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "goals-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "goals-section-title", children: "Research — permanent bonuses" }),
      Object.entries(RESEARCH_BRANCHES).map(([branchId, branch]) => {
        var _a;
        const level = ((_a = player.research) == null ? void 0 : _a[branchId]) || 0;
        const next = level < branch.tiers.length ? branch.tiers[level] : null;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "goals-research-branch", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "goals-research-header", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: branch.color }, children: [
              branch.emoji,
              " ",
              branch.label
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "goals-research-level", children: [
              "Tier ",
              level,
              "/",
              branch.tiers.length
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "goals-research-tiers", children: branch.tiers.map((tier, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `goals-research-tier ${i < level ? "done" : i === level ? "next" : "locked"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "goals-research-name", children: [
              i < level ? "·" : i === level ? "▸" : "—",
              " ",
              tier.label
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "goals-research-desc", children: tier.desc })
          ] }, i)) }),
          next && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "btn btn-sm",
              disabled: player.coins < next.cost,
              onClick: () => buyResearch(branchId),
              children: [
                "Research: 🪙",
                next.cost
              ]
            }
          ),
          !next && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "goals-research-maxed", children: "Fully researched" })
        ] }, branchId);
      })
    ] }),
    subTab === "bank" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "goals-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "goals-section-title", children: "Bank of the Deep" }),
      loanStatus ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "goals-loan-active", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "goals-loan-header", children: "Active Loan" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          "Borrowed: 🪙",
          loanStatus.amount
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          "Total owed: 🪙",
          loanStatus.totalOwed
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: loanStatus.overdue ? "goals-loan-overdue" : "", children: loanStatus.overdue ? "OVERDUE — Bank will seize a fish!" : `Time remaining: ${Math.floor(loanStatus.remaining / 60)}m ${Math.round(loanStatus.remaining % 60)}s` }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "btn btn-sm btn-primary",
            disabled: player.coins < loanStatus.totalOwed,
            onClick: repayLoan,
            children: [
              "Repay 🪙",
              loanStatus.totalOwed
            ]
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "goals-loan-options", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.8rem", opacity: 0.6, marginBottom: "0.8rem" }, children: "Need cash fast? Take a loan — but repay on time or the bank seizes your best fish!" }),
        LOAN_TIERS.map((tier) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "goals-loan-tier", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "goals-loan-name", children: tier.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "goals-loan-desc", children: tier.desc })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-sm", onClick: () => takeLoan(tier.id), children: [
            "Borrow 🪙",
            tier.amount
          ] })
        ] }, tier.id))
      ] })
    ] }),
    subTab === "journal" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "goals-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "goals-section-title", children: "Discovery Journal" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "goals-discovery-count", children: [
        discoveries.length,
        " / ",
        getTotalPossibleDiscoveries(),
        " unique phenotypes discovered"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "goals-discovery-bar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "goals-discovery-fill", style: { width: `${discoveries.length / getTotalPossibleDiscoveries() * 100}%` } }) }),
      reviews.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "goals-section-title", style: { marginTop: "1rem" }, children: "Latest Reviews" }),
        reviews.slice(0, 5).map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "goals-review", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "goals-review-stars", children: "★".repeat(r.stars) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "goals-review-headline", children: [
            '"',
            r.headline,
            '"'
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "goals-review-critic", children: r.critic })
        ] }, i))
      ] })
    ] }),
    subTab === "backgrounds" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "goals-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "goals-section-title", children: "Tank Backgrounds" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "goals-bg-grid", children: TANK_BACKGROUNDS.map((bg) => {
        const owned = bg.cost === 0 || (player.unlockedBackgrounds || []).includes(bg.id);
        const locked = bg.minPrestige && (player.prestigeLevel || 0) < bg.minPrestige;
        const tanks = useGameStore.getState().tanks || [];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `goals-bg-card ${owned ? "owned" : ""} ${locked ? "locked" : ""}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "goals-bg-preview", style: { background: bg.gradient } }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "goals-bg-name", children: [
            bg.emoji,
            " ",
            bg.label
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "goals-bg-desc", children: bg.desc }),
          locked ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "goals-bg-locked", children: [
            "Prestige ",
            bg.minPrestige
          ] }) : owned ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              className: "goals-bg-apply",
              defaultValue: "",
              onChange: (e) => {
                if (e.target.value) {
                  useGameStore.getState().setTankBackground(e.target.value, bg.id);
                  e.target.value = "";
                }
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Apply to tank..." }),
                tanks.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t.id, children: t.name }, t.id))
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "btn btn-sm",
              disabled: player.coins < bg.cost,
              onClick: () => buyBackground(bg.id),
              children: [
                "🪙",
                bg.cost
              ]
            }
          )
        ] }, bg.id);
      }) })
    ] })
  ] });
}
const JUDGE_NAMES = [
  "Judge Coral",
  "Madame Reef",
  "Professor Tide",
  "Old Salt",
  "Dr. Scales",
  "Sir Bubbles"
];
function scoreFish(fish) {
  var _a, _b;
  const rarity = ((_a = fish == null ? void 0 : fish.species) == null ? void 0 : _a.rarity) || "common";
  const rarityScore = { common: 1, uncommon: 3, rare: 5, epic: 7, legendary: 10 }[rarity] || 1;
  const personality = (fish == null ? void 0 : fish.personality) || "shy";
  const size = ((_b = fish == null ? void 0 : fish.phenotype) == null ? void 0 : _b.size) || "Medium";
  const health = (fish == null ? void 0 : fish.health) || 50;
  const healthBonus = health / 100;
  const hasVariant = (fish == null ? void 0 : fish.colorVariant) && fish.colorVariant !== "default";
  const beauty = Math.min(10, Math.round(
    rarityScore * 0.6 + healthBonus * 3 + (hasVariant ? 1.5 : 0) + Math.random() * 1.5
  ));
  const trickScores = {
    playful: 8,
    curious: 7,
    social: 6,
    aggressive: 5,
    hardy: 4,
    gluttonous: 3,
    lazy: 2,
    shy: 1
  };
  const tricks = Math.min(10, Math.round(
    (trickScores[personality] || 3) * 0.8 + healthBonus * 2 + Math.random() * 1.5
  ));
  const sizeScores = { Dwarf: 2, Tiny: 3, Medium: 5, Giant: 8, Leviathan: 10 };
  const sizeScore = Math.min(10, Math.round(
    (sizeScores[size] || 5) * 0.7 + rarityScore * 0.2 + Math.random() * 2
  ));
  return { beauty, tricks, size: sizeScore, total: beauty + tricks + sizeScore };
}
function generateCompetitors(playerLevel) {
  const count = 3 + Math.min(4, Math.floor(playerLevel / 5));
  const competitors = [];
  const names = [
    "Azure Dream",
    "Coral King",
    "Reef Runner",
    "Tide Dancer",
    "Deep Blue",
    "Pearl Diver",
    "Wave Rider",
    "Storm Chaser",
    "Moonlit Fin",
    "Golden Scale",
    "Shadow Swimmer",
    "Crystal Eye"
  ];
  for (let i = 0; i < count; i++) {
    const base = 3 + Math.floor(playerLevel / 3) + Math.floor(Math.random() * 4);
    competitors.push({
      name: names[i % names.length],
      owner: JUDGE_NAMES[i % JUDGE_NAMES.length].split(" ").slice(1).join(" ") + "'s entry",
      beauty: Math.min(10, base + Math.floor(Math.random() * 3)),
      tricks: Math.min(10, base - 1 + Math.floor(Math.random() * 3)),
      size: Math.min(10, base - 1 + Math.floor(Math.random() * 4)),
      total: 0
    });
    competitors[i].total = competitors[i].beauty + competitors[i].tricks + competitors[i].size;
  }
  return competitors.sort((a, b) => b.total - a.total);
}
function getShowReward(placement, entryCount) {
  if (placement === 1) return { coins: 500, xp: 50, label: "1st Place!", trophy: "gold" };
  if (placement === 2) return { coins: 250, xp: 30, label: "2nd Place!", trophy: "silver" };
  if (placement === 3) return { coins: 100, xp: 20, label: "3rd Place!", trophy: "bronze" };
  return { coins: 25, xp: 5, label: `Placed #${placement} of ${entryCount + 1}`, trophy: null };
}
function canEnterShow(state) {
  var _a;
  const lastShow = (_a = state.player) == null ? void 0 : _a.lastShowDate;
  if (!lastShow) return true;
  const now = /* @__PURE__ */ new Date();
  const last = new Date(lastShow);
  return now.toDateString() !== last.toDateString();
}
function FishShowPanel() {
  var _a;
  const player = useGameStore((s) => s.player);
  const fish = useGameStore((s) => s.fish);
  const [phase, setPhase] = reactExports.useState("select");
  const [selectedFishId, setSelectedFishId] = reactExports.useState(null);
  const [scores, setScores] = reactExports.useState(null);
  const [results, setResults] = reactExports.useState(null);
  const [currentRound, setCurrentRound] = reactExports.useState(0);
  const [judgingStep, setJudgingStep] = reactExports.useState(0);
  const eligible = canEnterShow({ player });
  const adults = reactExports.useMemo(() => fish.filter((f) => f.stage === "adult"), [fish]);
  const { level } = getLevelFromXp(player.xp || 0);
  const handleEnter = () => {
    if (!selectedFishId || !eligible) return;
    const entry = fish.find((f) => f.id === selectedFishId);
    if (!entry) return;
    const playerScores = scoreFish(entry);
    const competitors = generateCompetitors(level);
    setScores(playerScores);
    setPhase("judging");
    setCurrentRound(0);
    setJudgingStep(0);
    let step = 0;
    const interval = setInterval(() => {
      var _a2, _b;
      step++;
      if (step <= 3) {
        setCurrentRound(step);
        setJudgingStep(step);
      } else {
        clearInterval(interval);
        const allEntries = [
          { name: entry.nickname || ((_a2 = entry.species) == null ? void 0 : _a2.name) || "Your Fish", isPlayer: true, ...playerScores },
          ...competitors
        ].sort((a, b) => b.total - a.total);
        const placement = allEntries.findIndex((e) => e.isPlayer) + 1;
        const reward = getShowReward(placement, competitors.length);
        setResults({ allEntries, placement, reward, fishName: entry.nickname || ((_b = entry.species) == null ? void 0 : _b.name) });
        setPhase("results");
      }
    }, 1200);
  };
  const handleClaimReward = () => {
    if (!results) return;
    useGameStore.setState((state) => {
      state.player.coins += results.reward.coins;
      state.player.totalCoinsEarned = (state.player.totalCoinsEarned || 0) + results.reward.coins;
      state.player.xp = (state.player.xp || 0) + results.reward.xp;
      state.player.lastShowDate = (/* @__PURE__ */ new Date()).toDateString();
      state.player.stats.showsEntered = (state.player.stats.showsEntered || 0) + 1;
      if (results.placement === 1) state.player.stats.showsWon = (state.player.stats.showsWon || 0) + 1;
    });
    setPhase("done");
  };
  const judge = JUDGE_NAMES[Math.floor(Math.random() * JUDGE_NAMES.length)];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fish-show", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fish-show-title", children: "Fish Show" }),
    !eligible && phase === "select" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fish-show-cooldown", children: "You've already entered today's show. Come back tomorrow!" }),
    phase === "select" && eligible && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "fish-show-intro", children: "Select your best fish to compete in Beauty, Tricks, and Size!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fish-show-roster", children: [
        adults.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "goals-empty", children: "No adult fish to enter." }),
        adults.map((f) => {
          var _a2, _b, _c;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `fish-show-entry ${selectedFishId === f.id ? "selected" : ""}`,
              onClick: () => setSelectedFishId(f.id),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fish-show-entry-sprite", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FishSprite, { fish: f, size: 40 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fish-show-entry-info", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fish-show-entry-name", children: f.nickname || ((_a2 = f.species) == null ? void 0 : _a2.name) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fish-show-entry-meta", children: [
                    (_b = f.species) == null ? void 0 : _b.rarity,
                    " · ",
                    f.personality,
                    " · ",
                    ((_c = f.phenotype) == null ? void 0 : _c.size) || "Medium"
                  ] })
                ] })
              ]
            },
            f.id
          );
        })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "btn btn-primary fish-show-enter",
          disabled: !selectedFishId,
          onClick: handleEnter,
          children: "Enter the Show!"
        }
      )
    ] }),
    phase === "judging" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fish-show-judging", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fish-show-judge", children: judge }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fish-show-rounds", children: ["Beauty", "Tricks", "Size"].map((label, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `fish-show-round ${judgingStep > i ? "revealed" : judgingStep === i ? "judging" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fish-show-round-label", children: label }),
        judgingStep > i && scores && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fish-show-round-score", children: [
          [scores.beauty, scores.tricks, scores.size][i],
          "/10"
        ] }),
        judgingStep === i && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fish-show-round-judging", children: "Judging..." })
      ] }, i)) }),
      judgingStep > 0 && scores && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fish-show-total", children: [
        "Total: ",
        (judgingStep >= 1 ? scores.beauty : 0) + (judgingStep >= 2 ? scores.tricks : 0) + (judgingStep >= 3 ? scores.size : 0),
        "/30"
      ] })
    ] }),
    phase === "results" && results && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fish-show-results", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `fish-show-placement fish-show-placement--${results.reward.trophy || "none"}`, children: results.reward.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fish-show-results-fish", children: [
        results.fishName,
        " scored ",
        (_a = results.allEntries.find((e) => e.isPlayer)) == null ? void 0 : _a.total,
        "/30"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fish-show-leaderboard", children: results.allEntries.slice(0, 5).map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `fish-show-lb-row ${entry.isPlayer ? "player" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "fish-show-lb-rank", children: [
          "#",
          i + 1
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fish-show-lb-name", children: entry.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "fish-show-lb-score", children: [
          entry.total,
          "/30"
        ] })
      ] }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fish-show-reward", children: [
        "Reward: 🪙",
        results.reward.coins,
        " + ",
        results.reward.xp,
        " XP"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary", onClick: handleClaimReward, children: "Claim Reward!" })
    ] }),
    phase === "done" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fish-show-done", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fish-show-done-icon", children: "Done" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Reward claimed! See you at the next show." })
    ] })
  ] });
}
const CAT_ORDER = ["substrate", "plant", "rock", "coral", "structure", "special"];
function ThemePreview({ theme, size = 120 }) {
  const gradId = `tpg-${theme.id}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: size,
      height: Math.round(size * 0.55),
      viewBox: "0 0 120 66",
      style: { display: "block", borderRadius: "6px 6px 0 0" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("linearGradient", { id: gradId, x1: "0", y1: "0", x2: "0", y2: "1", children: theme.waterGradient.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: s.offset, stopColor: s.color, stopOpacity: s.opacity }, i)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "120", height: "66", fill: `url(#${gradId})` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "g",
          {
            dangerouslySetInnerHTML: { __html: theme.bgSvgFn() },
            transform: "scale(0.15) translate(0, 0)",
            style: { transformOrigin: "0 0" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0", y: "54", width: "120", height: "12", fill: "#7a5828", opacity: "0.8" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0", y: "58", width: "120", height: "8", fill: "#9a7840", opacity: "0.6" })
      ]
    }
  );
}
function DecorPreview({ decor, size = 80 }) {
  const cx = size / 2;
  const cy = size * 0.82;
  const scale = size / 120;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: size,
      height: size,
      viewBox: `0 0 ${size} ${size}`,
      style: { display: "block" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: size, height: size, fill: "#0a1828", rx: "6" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("g", { dangerouslySetInnerHTML: { __html: decor.svgFn(cx, cy, scale * decor.defaultScale) } })
      ]
    }
  );
}
function DecorationCanvas({ tank, activeTankFish, onPlace, onRemove, selectedDecorType, placingScale }) {
  var _a;
  const svgRef = reactExports.useRef(null);
  const placed = ((_a = tank.decorations) == null ? void 0 : _a.placed) || [];
  const handleCanvasClick = reactExports.useCallback((e) => {
    if (!selectedDecorType) return;
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 800;
    const y = (e.clientY - rect.top) / rect.height * 400;
    onPlace(selectedDecorType, x, y, placingScale);
  }, [selectedDecorType, placingScale, onPlace]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "decor-canvas-wrap", children: [
    selectedDecorType && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "decor-placing-hint", children: [
      "Click anywhere in the tank to place · ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "ESC" }),
      " to cancel"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        ref: svgRef,
        className: `decor-canvas-svg ${selectedDecorType ? "placing-mode" : ""}`,
        viewBox: "0 0 800 400",
        preserveAspectRatio: "xMidYMid meet",
        onClick: handleCanvasClick,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "800", height: "400", fill: "#0e3a6e" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "800", height: "400", fill: "url(#decor-water-grad)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "decor-water-grad", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#1060a0", stopOpacity: "0.4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#040e1a", stopOpacity: "0.6" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "400", cy: "415", rx: "450", ry: "55", fill: "#8a6830" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "400", cy: "408", rx: "440", ry: "38", fill: "#b88a50" }),
          placed.map((item) => {
            const decor = getDecorById(item.type);
            if (!decor) return null;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "g",
              {
                className: "decor-placed-item",
                onClick: (e) => {
                  if (!selectedDecorType) {
                    e.stopPropagation();
                    onRemove(item.instanceId);
                  }
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("g", { dangerouslySetInnerHTML: { __html: decor.svgFn(item.x, item.y, item.scale) } }),
                  !selectedDecorType && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "circle",
                    {
                      cx: item.x,
                      cy: item.y - 60,
                      r: "10",
                      fill: "#e04040",
                      opacity: "0",
                      className: "decor-remove-btn"
                    }
                  )
                ]
              },
              item.instanceId
            );
          }),
          activeTankFish == null ? void 0 : activeTankFish.slice(0, 8).map((f, i) => {
            const x = 80 + i % 4 * 170;
            const y = 150 + Math.floor(i / 4) * 90;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "ellipse",
              {
                cx: x,
                cy: y,
                rx: "22",
                ry: "12",
                fill: "#60a0d0",
                opacity: "0.3"
              },
              f.id
            );
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "800", height: "8", fill: "rgba(180,220,255,0.12)" }),
          [0, 1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              d: `M${i * 200},4 Q${i * 200 + 100},0 ${i * 200 + 200},4`,
              fill: "none",
              stroke: "rgba(200,235,255,0.3)",
              strokeWidth: "2"
            },
            i
          )),
          selectedDecorType && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "text",
            {
              x: "400",
              y: "200",
              textAnchor: "middle",
              fill: "rgba(255,255,255,0.3)",
              fontSize: "14",
              fontFamily: "sans-serif",
              children: "Click to place decoration"
            }
          )
        ]
      }
    )
  ] });
}
function DecorShopCard({ decor, owned, coins, onBuy, onSelectPlace, isSelected }) {
  const canAfford = coins >= decor.cost;
  const inStock = (owned || 0) > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `decor-shop-card ${isSelected ? "decor-selected" : ""} ${inStock ? "in-stock" : ""}`,
      onClick: () => inStock && onSelectPlace(decor.id),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "decor-preview-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DecorPreview, { decor, size: 72 }),
          inStock && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "decor-stock-badge", children: [
            "×",
            owned
          ] }),
          isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "decor-placing-badge", children: "PLACING" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "decor-card-info", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "decor-card-name", children: decor.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "decor-card-desc", children: decor.desc }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "decor-card-actions", children: [
            decor.cost === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "decor-free-label", children: "Free" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "btn btn-sm",
                disabled: !canAfford,
                onClick: (e) => {
                  e.stopPropagation();
                  onBuy(decor.id);
                },
                title: canAfford ? `Buy 1 for 🪙${decor.cost}` : `Need ${decor.cost - coins} more coins`,
                children: [
                  "🪙",
                  decor.cost
                ]
              }
            ),
            inStock && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: `btn btn-sm ${isSelected ? "btn-warn" : "btn-place"}`,
                onClick: (e) => {
                  e.stopPropagation();
                  onSelectPlace(isSelected ? null : decor.id);
                },
                children: isSelected ? "✕ Cancel" : "Place"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function PlacedItemRow({ item, onRemove }) {
  const decor = getDecorById(item.type);
  if (!decor) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "placed-item-row", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DecorPreview, { decor, size: 36 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "placed-item-name", children: decor.label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "placed-item-pos", children: [
      "(",
      Math.round(item.x),
      ", ",
      Math.round(item.y),
      ")"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-sm btn-warn", onClick: () => onRemove(item.instanceId), children: "Remove" })
  ] });
}
function DecorationPanel({ game, activeTank, onBuyDecor, onPlaceDecor, onRemoveDecor, unlockedDecorations = [], onClaimUnlockedDecor, onBuyTheme, onApplyTheme }) {
  var _a, _b;
  const [activeCategory, setActiveCategory] = reactExports.useState("all");
  const [selectedDecorType, setSelectedDecorType] = reactExports.useState(null);
  const [placingScale, setPlacingScale] = reactExports.useState(1);
  const [subTab, setSubTab] = reactExports.useState("themes");
  const { player } = game;
  const owned = ((_a = activeTank == null ? void 0 : activeTank.decorations) == null ? void 0 : _a.owned) || {};
  const placed = ((_b = activeTank == null ? void 0 : activeTank.decorations) == null ? void 0 : _b.placed) || [];
  const shopCatalog = DECOR_CATALOG.filter((d) => !d.achievementLocked);
  const achievementCatalog = DECOR_CATALOG.filter((d) => d.achievementLocked);
  const catalogFiltered = activeCategory === "all" ? shopCatalog : shopCatalog.filter((d) => d.category === activeCategory);
  const handleSelectPlace = (id) => {
    setSelectedDecorType((prev) => prev === id ? null : id);
  };
  const handlePlace = (type, x, y, scale) => {
    onPlaceDecor(activeTank.id, type, x, y, scale);
    const decor = getDecorById(type);
    if ((decor == null ? void 0 : decor.category) === "substrate") setSelectedDecorType(null);
  };
  reactExports.useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setSelectedDecorType(null);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "decor-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "decor-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Tank Decorations" }),
      activeTank && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "decor-tank-name", children: [
        "Decorating: ",
        activeTank.name
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DecorationCanvas,
      {
        tank: activeTank || { decorations: { placed: [] } },
        activeTankFish: game.fish.filter((f) => f.tankId === (activeTank == null ? void 0 : activeTank.id)),
        onPlace: handlePlace,
        onRemove: (instanceId) => onRemoveDecor(activeTank.id, instanceId),
        selectedDecorType,
        placingScale
      }
    ),
    selectedDecorType && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "decor-scale-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "decor-scale-label", children: "Size" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "range",
          min: "0.5",
          max: "2.0",
          step: "0.1",
          value: placingScale,
          onChange: (e) => setPlacingScale(parseFloat(e.target.value)),
          className: "decor-scale-slider"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "decor-scale-val", children: [
        placingScale.toFixed(1),
        "×"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-sm btn-warn", onClick: () => setSelectedDecorType(null), children: "Cancel" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "decor-subtabs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `decor-subtab ${subTab === "themes" ? "active" : ""}`, onClick: () => setSubTab("themes"), children: "Themes" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `decor-subtab ${subTab === "shop" ? "active" : ""}`, onClick: () => setSubTab("shop"), children: "Decorations" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: `decor-subtab ${subTab === "placed" ? "active" : ""}`, onClick: () => setSubTab("placed"), children: [
        "Placed (",
        placed.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: `decor-subtab ${subTab === "awards" ? "active" : ""}`, onClick: () => setSubTab("awards"), children: [
        "Awards ",
        unlockedDecorations.length > 0 ? `(${unlockedDecorations.length})` : ""
      ] })
    ] }),
    subTab === "themes" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "decor-themes-grid", children: TANK_THEMES.map((theme) => {
      var _a2, _b2;
      const ownedThemes = ((_a2 = activeTank == null ? void 0 : activeTank.themes) == null ? void 0 : _a2.owned) || ["tropical"];
      const activeThemeId = ((_b2 = activeTank == null ? void 0 : activeTank.themes) == null ? void 0 : _b2.active) || "tropical";
      const isOwned = ownedThemes.includes(theme.id);
      const isActive = activeThemeId === theme.id;
      const canAfford = player.coins >= theme.cost;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `decor-theme-card ${isActive ? "theme-active" : ""} ${isOwned ? "theme-owned" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "decor-theme-preview-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ThemePreview, { theme, size: 160 }),
          isActive && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "theme-active-badge", children: "✓ Active" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "decor-theme-info", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "decor-theme-name", children: [
            theme.emoji,
            " ",
            theme.label
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "decor-card-desc", children: theme.desc }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "decor-card-actions", children: isOwned ? isActive ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "decor-free-label", children: "Applied" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "btn btn-sm btn-place",
              onClick: () => activeTank && onApplyTheme && onApplyTheme(activeTank.id, theme.id),
              children: "Apply"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "btn btn-sm",
              disabled: !canAfford,
              title: canAfford ? `Buy for 🪙${theme.cost}` : `Need ${theme.cost - player.coins} more coins`,
              onClick: () => activeTank && onBuyTheme && onBuyTheme(activeTank.id, theme.id),
              children: [
                "🪙",
                theme.cost
              ]
            }
          ) })
        ] })
      ] }, theme.id);
    }) }),
    subTab === "shop" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "decor-categories", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `decor-cat-btn ${activeCategory === "all" ? "active" : ""}`,
            onClick: () => setActiveCategory("all"),
            children: "All"
          }
        ),
        CAT_ORDER.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: `decor-cat-btn ${activeCategory === cat ? "active" : ""}`,
            onClick: () => setActiveCategory(cat),
            children: [
              DECOR_CATEGORIES[cat].emoji,
              " ",
              DECOR_CATEGORIES[cat].label
            ]
          },
          cat
        ))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "decor-shop-grid", children: catalogFiltered.map((decor) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        DecorShopCard,
        {
          decor,
          owned: owned[decor.id] || 0,
          coins: player.coins,
          onBuy: onBuyDecor,
          onSelectPlace: handleSelectPlace,
          isSelected: selectedDecorType === decor.id
        },
        decor.id
      )) })
    ] }),
    subTab === "placed" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "placed-items-list", children: placed.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "decor-empty", children: "No decorations placed yet. Buy some and click Place!" }) : placed.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      PlacedItemRow,
      {
        item,
        onRemove: (id) => onRemoveDecor(activeTank.id, id)
      },
      item.instanceId
    )) }),
    subTab === "awards" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "decor-awards-list", children: achievementCatalog.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "decor-empty", children: "No award decorations exist yet." }) : achievementCatalog.map((decor) => {
      const isUnlocked = unlockedDecorations.includes(decor.id);
      const isClaimed = (owned[decor.id] || 0) > 0;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `decor-award-card ${isUnlocked ? "unlocked" : "locked"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "decor-preview-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DecorPreview, { decor, size: 72 }),
          !isUnlocked && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "decor-locked-overlay", children: "Locked" }),
          isClaimed && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "decor-stock-badge", children: "In Tank" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "decor-card-info", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "decor-card-name", children: decor.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "decor-card-desc", children: decor.desc }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "decor-achievement-badge", children: decor.achievementLabel }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "decor-card-actions", style: { marginTop: 6 }, children: isUnlocked ? isClaimed ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "btn btn-sm btn-place",
              onClick: () => handleSelectPlace(decor.id),
              children: selectedDecorType === decor.id ? "✕ Cancel" : "Place"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "decor-claim-btn",
              onClick: () => {
                onClaimUnlockedDecor(decor.id);
              },
              children: "Add to Inventory"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "decor-locked-hint", children: [
            "Earn the ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: decor.achievementLabel }),
            " achievement to unlock"
          ] }) })
        ] })
      ] }, decor.id);
    }) })
  ] });
}
const CAUSE_COLORS = {
  "Starvation": "#e08840",
  "Water Toxicity": "#40a0e0",
  "Temperature Shock": "#e04040",
  "Ich": "#ff4444",
  "Fin Rot": "#a06020",
  "Bloat": "#d4c020",
  "Velvet": "#e06820",
  "Old Age / Unknown": "#607080"
};
const CAUSE_ICONS = {
  "Starvation": "",
  "Water Toxicity": "",
  "Temperature Shock": "",
  "Ich": "",
  "Fin Rot": "",
  "Bloat": "",
  "Velvet": "",
  "Old Age / Unknown": ""
};
const CAUSE_TIPS = {
  "Starvation": "Tip: Enable auto-feed or check food supplies regularly.",
  "Water Toxicity": "Tip: Use Water Treatment when quality drops below 50%.",
  "Temperature Shock": "Tip: Use heater cartridges to keep temperature near 74°F.",
  "Ich": "Tip: Ich spreads fast — treat all fish in the tank immediately.",
  "Fin Rot": "Tip: Fin Rot thrives in dirty water. Maintain water quality above 40%.",
  "Bloat": "Tip: Bloat is caused by overfeeding. Let hunger drop before feeding.",
  "Velvet": "Tip: Velvet is very aggressive. Quarantine infected fish if possible.",
  "Old Age / Unknown": "Keep monitoring your fish for stressors."
};
function AutopsyCard({ record }) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const gc = useGameStore((s) => s.gameClock || Date.now());
  const rarity = RARITY[record.rarity] || RARITY.common;
  const causeCol = CAUSE_COLORS[record.cause] || "#607080";
  const causeIcon = CAUSE_ICONS[record.cause] || "";
  const tip = CAUSE_TIPS[record.cause] || "";
  const timeAgo = (() => {
    const diff = gc - record.diedAt;
    const min = Math.floor(diff / 6e4);
    if (min < 1) return "just now";
    if (min < 60) return `${min}m ago`;
    return `${Math.floor(min / 60)}h ago`;
  })();
  const fakeFish = {
    id: record.id,
    phenotype: record.phenotype,
    genome: record.genome || {},
    species: { name: record.fishName, rarity: record.rarity },
    stage: "adult",
    health: 0,
    hunger: 0
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "autopsy-card", style: { "--ac": causeCol }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "autopsy-card-header", onClick: () => setExpanded((e) => !e), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "autopsy-sprite-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FishSprite, { fish: fakeFish, size: 48 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "autopsy-dead-overlay", children: "✝" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "autopsy-info", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "autopsy-name", style: { color: rarity.color }, children: record.fishName }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "autopsy-meta", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "autopsy-rarity", children: rarity.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "autopsy-age", children: [
            "Lived ",
            record.ageMinutes,
            " min"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "autopsy-time", children: timeAgo })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "autopsy-cause", style: { color: causeCol }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "autopsy-cause-icon", children: causeIcon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "autopsy-cause-label", children: record.cause })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "autopsy-chevron", children: expanded ? "▲" : "▼" })
    ] }),
    expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "autopsy-card-body", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "autopsy-detail-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "autopsy-detail-label", children: "Tank:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: record.tankName })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "autopsy-detail-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "autopsy-detail-label", children: "Water Quality:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: record.waterQuality < 30 ? "#ff6040" : "#5aaa70" }, children: [
          record.waterQuality,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "autopsy-detail-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "autopsy-detail-label", children: "Hunger at death:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: record.hunger > 80 ? "#ff6040" : "#aaa" }, children: [
          record.hunger,
          "%"
        ] })
      ] }),
      record.detail && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "autopsy-cause-detail", children: [
        causeIcon,
        " ",
        record.detail
      ] }),
      tip && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "autopsy-tip", children: tip }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "autopsy-phenotype", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "autopsy-ph-label", children: "Genetics:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "autopsy-ph-tags", children: Object.entries(record.phenotype || {}).map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "autopsy-ph-tag", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "autopsy-ph-key", children: [
            k,
            ":"
          ] }),
          " ",
          v
        ] }, k)) })
      ] })
    ] })
  ] });
}
function FishAutopsyPanel({ autopsies = [] }) {
  if (autopsies.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "autopsy-panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "autopsy-header", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "autopsy-title", children: "Fish Autopsy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "autopsy-subtitle", children: "Understand why your fish died. Improve. Prevent." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "autopsy-empty", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "autopsy-empty-icon", children: "No records" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "No deaths recorded yet. Long may your fish live!" })
      ] })
    ] });
  }
  const causeCounts = {};
  for (const r of autopsies) {
    causeCounts[r.cause] = (causeCounts[r.cause] || 0) + 1;
  }
  const topCause = Object.entries(causeCounts).sort((a, b) => b[1] - a[1])[0];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "autopsy-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "autopsy-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "autopsy-header-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "autopsy-title", children: "Fish Autopsy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "autopsy-subtitle", children: "Post-mortem records — understand and prevent future losses." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "autopsy-stats-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "autopsy-stat", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "autopsy-stat-num", children: autopsies.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "autopsy-stat-label", children: "Deaths" })
        ] }),
        topCause && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "autopsy-stat", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "autopsy-stat-num", style: { color: CAUSE_COLORS[topCause[0]] || "#aaa" }, children: CAUSE_ICONS[topCause[0]] || "" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "autopsy-stat-label", children: "Top Cause" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "autopsy-stat-sub", children: topCause[0] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "autopsy-breakdown", children: Object.entries(causeCounts).sort((a, b) => b[1] - a[1]).map(([cause, count]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "autopsy-breakdown-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "autopsy-bd-icon", children: CAUSE_ICONS[cause] || "" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "autopsy-bd-label", children: cause }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "autopsy-bd-bar-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "autopsy-bd-bar",
          style: {
            width: `${Math.round(count / autopsies.length * 100)}%`,
            background: CAUSE_COLORS[cause] || "#607080"
          }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "autopsy-bd-count", children: count })
    ] }, cause)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "autopsy-records", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "autopsy-records-title", children: [
        "Recent Deaths (last ",
        autopsies.length,
        ")"
      ] }),
      [...autopsies].reverse().map((record) => /* @__PURE__ */ jsxRuntimeExports.jsx(AutopsyCard, { record }, record.id))
    ] })
  ] });
}
function StaffPanel() {
  const staff = useGameStore((s) => s.staff || []);
  const tanks = useGameStore((s) => s.tanks || []);
  const coins = useGameStore((s) => {
    var _a;
    return ((_a = s.player) == null ? void 0 : _a.coins) || 0;
  });
  const playerLevel = useGameStore((s) => {
    var _a;
    return ((_a = s.player) == null ? void 0 : _a.level) || 1;
  });
  const hireStaff = useGameStore((s) => s.hireStaff);
  const fireStaff = useGameStore((s) => s.fireStaff);
  const assignStaff = useGameStore((s) => s.assignStaff);
  const trainStaff = useGameStore((s) => s.trainStaff);
  const maxStaff = getMaxStaff(playerLevel);
  const totalWages = getTotalDailyWages(staff);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "staff-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "staff-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "staff-title", children: "STAFF" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "staff-meta", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          staff.length,
          "/",
          maxStaff,
          " hired"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "staff-wages", children: [
          "Daily wages: ",
          totalWages,
          "/day"
        ] })
      ] })
    ] }),
    staff.length < maxStaff && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "staff-hire-row", children: Object.values(STAFF_ROLES).map((role) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        className: "btn staff-hire-btn",
        onClick: () => hireStaff(role.id),
        disabled: coins < getHireCost(role.id),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "staff-hire-role", children: role.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "staff-hire-cost", children: getHireCost(role.id) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "staff-hire-desc", children: role.desc })
        ]
      },
      role.id
    )) }),
    staff.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "staff-empty", children: "No staff hired yet. Hire a Caretaker to auto-feed your fish!" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "staff-list", children: staff.map((member) => {
      const roleDef = STAFF_ROLES[member.role];
      const wage = getStaffWage(member);
      const trainCostVal = getTrainCost(member);
      const canTrain = member.level < ((roleDef == null ? void 0 : roleDef.maxLevel) || 5) && coins >= trainCostVal;
      const assignedTank = tanks.find((t) => t.id === member.assignedTankId);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "staff-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "staff-card-top", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "staff-card-info", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "staff-card-name", children: member.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "staff-card-role", children: (roleDef == null ? void 0 : roleDef.label) || member.role }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "staff-card-level", children: [
              "LV.",
              member.level + 1
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "staff-card-wage", children: [
            wage,
            "/day"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "staff-card-assign", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              className: "staff-tank-select",
              value: member.assignedTankId || "",
              onChange: (e) => assignStaff(member.id, e.target.value || null),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Unassigned" }),
                tanks.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t.id, children: t.name }, t.id))
              ]
            }
          ),
          !assignedTank && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "staff-unassigned-hint", children: "Assign to a tank to work" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "staff-card-actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "btn staff-train-btn",
              onClick: () => trainStaff(member.id),
              disabled: !canTrain,
              children: [
                "Train (",
                trainCostVal,
                ")"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "btn staff-fire-btn",
              onClick: () => fireStaff(member.id),
              children: "Fire"
            }
          )
        ] })
      ] }, member.id);
    }) })
  ] });
}
function ResearchPanel() {
  const research = useGameStore((s) => {
    var _a;
    return ((_a = s.player) == null ? void 0 : _a.research) || {};
  });
  const coins = useGameStore((s) => {
    var _a;
    return ((_a = s.player) == null ? void 0 : _a.coins) || 0;
  });
  const purchaseResearch = useGameStore((s) => s.purchaseResearch);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "research-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "research-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "research-title", children: "RESEARCH LAB" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "research-subtitle", children: "Invest in permanent upgrades for your aquarium" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "research-branches", children: Object.values(RESEARCH_BRANCHES).map((branch) => {
      const level = research[branch.id] || 0;
      const maxed = level >= branch.tiers.length;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "research-branch", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "research-branch-header", style: { borderLeftColor: branch.color }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "research-branch-label", children: branch.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "research-branch-progress", children: [
            level,
            "/",
            branch.tiers.length
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "research-tiers", children: branch.tiers.map((tier, i) => {
          const unlocked = i < level;
          const current = i === level;
          const locked = i > level;
          const canAfford = coins >= tier.cost;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `research-tier ${unlocked ? "research-tier--done" : ""} ${current ? "research-tier--current" : ""} ${locked ? "research-tier--locked" : ""}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "research-tier-header", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "research-tier-check", children: unlocked ? "✓" : current ? "○" : "·" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "research-tier-name", children: tier.label }),
                  !unlocked && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "research-tier-cost", children: tier.cost })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "research-tier-desc", children: tier.desc }),
                current && !maxed && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    className: "btn research-buy-btn",
                    onClick: () => purchaseResearch(branch.id),
                    disabled: !canAfford,
                    style: { borderColor: canAfford ? branch.color : void 0 },
                    children: [
                      "Research (",
                      tier.cost,
                      ")"
                    ]
                  }
                )
              ]
            },
            i
          );
        }) }),
        maxed && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "research-maxed", style: { color: branch.color }, children: "Fully Researched" })
      ] }, branch.id);
    }) })
  ] });
}
function RoomPanel() {
  const coins = useGameStore((s) => {
    var _a;
    return ((_a = s.player) == null ? void 0 : _a.coins) || 0;
  });
  const rep = useGameStore((s) => {
    var _a;
    return ((_a = s.shop) == null ? void 0 : _a.reputation) || 0;
  });
  const prestige = useGameStore((s) => {
    var _a;
    return ((_a = s.player) == null ? void 0 : _a.prestigeLevel) || 0;
  });
  const unlockedRooms = useGameStore((s) => s.unlockedRooms || ["lobby"]);
  const tanks = useGameStore((s) => s.tanks || []);
  const roomAssignments = useGameStore((s) => s.roomAssignments || {});
  const unlockRoom = useGameStore((s) => s.unlockRoom);
  const assignTank = useGameStore((s) => s.assignTankToRoom);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "room-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "room-title", children: "AQUARIUM ROOMS" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "room-subtitle", children: "Expand your aquarium with themed wings that give tank bonuses" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "room-list", children: ROOMS.map((room) => {
      const isUnlocked = unlockedRooms.includes(room.id);
      const tanksHere = tanks.filter((t) => (roomAssignments[t.id] || "lobby") === room.id);
      const canUnlock = !isUnlocked && coins >= room.cost && (!room.minRep || rep >= room.minRep) && (!room.minPrestige || prestige >= room.minPrestige);
      const locked = !isUnlocked;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `room-card ${locked ? "room-card--locked" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "room-card-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "room-card-name", children: room.label }),
          isUnlocked && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "room-card-count", children: [
            tanksHere.length,
            "/",
            room.maxTanks
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "room-card-desc", children: room.desc }),
        isUnlocked && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "room-tanks", children: [
          tanksHere.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "room-tank-chip", children: t.name }, t.id)),
          tanks.filter((t) => (roomAssignments[t.id] || "lobby") !== room.id).length > 0 && tanksHere.length < room.maxTanks && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              className: "room-assign-select",
              value: "",
              onChange: (e) => {
                if (e.target.value) assignTank(e.target.value, room.id);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "+ Assign tank..." }),
                tanks.filter((t) => (roomAssignments[t.id] || "lobby") !== room.id).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t.id, children: t.name }, t.id))
              ]
            }
          )
        ] }),
        locked && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "btn room-unlock-btn",
            onClick: () => unlockRoom(room.id),
            disabled: !canUnlock,
            children: [
              "Unlock (",
              room.cost,
              ")",
              room.minRep && rep < room.minRep ? ` — Rep ${room.minRep}` : "",
              room.minPrestige && prestige < room.minPrestige ? ` — Prestige ${room.minPrestige}` : ""
            ]
          }
        )
      ] }, room.id);
    }) })
  ] });
}
const MemoDecorationPanel = reactExports.memo(DecorationPanel);
const MemoFishAutopsy = reactExports.memo(FishAutopsyPanel);
const VIEWS = [
  { id: "contracts", label: "Contracts" },
  { id: "staff", label: "Staff" },
  { id: "research", label: "Research" },
  { id: "rooms", label: "Rooms" },
  { id: "decor", label: "Decor" },
  { id: "autopsy", label: "Autopsy" }
];
function OfficeSection() {
  const [view, setView] = reactExports.useState("contracts");
  const player = useGameStore((s) => s.player);
  const fish = useGameStore((s) => s.fish);
  const tanks = useGameStore((s) => s.tanks);
  const shop = useGameStore((s) => s.shop);
  const activeTank = tanks == null ? void 0 : tanks[0];
  const dailyChallenges = useGameStore((s) => {
    var _a;
    return ((_a = s.dailyChallenges) == null ? void 0 : _a.challenges) || [];
  });
  const _buyDecoration = useGameStore((s) => s.buyDecoration);
  const _placeDecoration = useGameStore((s) => s.placeDecoration);
  const _removeDecoration = useGameStore((s) => s.removeDecoration);
  const _claimUnlockedDecoration = useGameStore((s) => s.claimUnlockedDecoration);
  const _buyTheme = useGameStore((s) => s.buyTheme);
  const _applyTheme = useGameStore((s) => s.applyTheme);
  const handleBuyDecor = (decorId) => _buyDecoration(decorId, activeTank == null ? void 0 : activeTank.id);
  const handlePlaceDecor = (decorId) => _placeDecoration(decorId, activeTank == null ? void 0 : activeTank.id);
  const handleRemoveDecor = (decorId) => _removeDecoration(decorId, activeTank == null ? void 0 : activeTank.id);
  const handleClaimDecor = (decorId) => _claimUnlockedDecoration == null ? void 0 : _claimUnlockedDecoration(decorId);
  const handleBuyTheme = (themeId) => _buyTheme(themeId, activeTank == null ? void 0 : activeTank.id);
  const handleApplyTheme = (themeId) => _applyTheme(themeId, activeTank == null ? void 0 : activeTank.id);
  const game = { player, fish, tanks, shop };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sim-section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sim-sub-tabs", children: VIEWS.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        className: `sim-sub-tab${view === v.id ? " active" : ""}`,
        onClick: () => setView(v.id),
        children: v.label
      },
      v.id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sim-section-content", children: [
      view === "contracts" && /* @__PURE__ */ jsxRuntimeExports.jsxs(TabErrorBoundary, { name: "contracts", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(GoalsPanel, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FishShowPanel, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DailyChallengesPanel,
          {
            dailyChallenges,
            streak: player.challengeStreak || 0
          }
        )
      ] }),
      view === "decor" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        MemoDecorationPanel,
        {
          game,
          activeTank,
          onBuyDecor: handleBuyDecor,
          onPlaceDecor: handlePlaceDecor,
          onRemoveDecor: handleRemoveDecor,
          unlockedDecorations: player.unlockedDecorations || [],
          onClaimUnlockedDecor: handleClaimDecor,
          onBuyTheme: handleBuyTheme,
          onApplyTheme: handleApplyTheme
        }
      ),
      view === "staff" && /* @__PURE__ */ jsxRuntimeExports.jsx(StaffPanel, {}),
      view === "research" && /* @__PURE__ */ jsxRuntimeExports.jsx(ResearchPanel, {}),
      view === "rooms" && /* @__PURE__ */ jsxRuntimeExports.jsx(RoomPanel, {}),
      view === "autopsy" && /* @__PURE__ */ jsxRuntimeExports.jsx(MemoFishAutopsy, { autopsies: player.autopsies || [] })
    ] })
  ] });
}
function DailyChallengesPanel({ dailyChallenges, streak = 0 }) {
  const claimDailyReward = useGameStore((s) => s.claimDailyReward);
  const player = useGameStore((s) => s.player);
  if (!dailyChallenges || dailyChallenges.length === 0) return null;
  const today = (/* @__PURE__ */ new Date()).toDateString();
  const canClaim = !player.lastDailyClaimDate || player.lastDailyClaimDate !== today;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "daily-challenges-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "section-title", children: "Daily Challenges" }),
    streak > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "challenge-streak", children: [
      "Day ",
      streak,
      " streak"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "challenge-list", children: dailyChallenges.map((c, i) => {
      const done = c.progress >= (c.goal || c.target);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `challenge-card ${done ? "challenge-card--done" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "challenge-desc", children: c.desc }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "challenge-progress", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "challenge-bar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "challenge-bar-fill", style: { width: `${Math.min(100, c.progress / (c.goal || c.target || 1) * 100)}%` } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "challenge-count", children: [
            c.progress,
            "/",
            c.goal || c.target
          ] })
        ] }),
        done && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "challenge-reward", children: [
          "+",
          c.reward
        ] })
      ] }, i);
    }) }),
    canClaim && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-sm", onClick: claimDailyReward, children: "Claim Daily Reward" })
  ] });
}
export {
  OfficeSection as default
};
