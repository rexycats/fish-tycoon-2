// ============================================================
// LOAN SYSTEM — Bank of the Deep
// ============================================================

export const LOAN_TIERS = [
  { id: 'small',   amount: 500,   interest: 0.10, repayBy: 60 * 30,  label: 'Small Loan',   desc: '500🪙 at 10% interest, repay within 30 min' },
  { id: 'medium',  amount: 2000,  interest: 0.15, repayBy: 60 * 60,  label: 'Business Loan', desc: '2,000🪙 at 15% interest, repay within 1 hour' },
  { id: 'large',   amount: 5000,  interest: 0.25, repayBy: 60 * 120, label: 'Major Investment', desc: '5,000🪙 at 25% interest, repay within 2 hours' },
];

export function getLoanStatus(loan) {
  if (!loan || !loan.active) return null;
  const elapsed = (Date.now() - loan.takenAt) / 1000;
  const remaining = Math.max(0, loan.repayBy - elapsed);
  const totalOwed = Math.round(loan.amount * (1 + loan.interest));
  const overdue = remaining <= 0;
  return { ...loan, remaining, totalOwed, overdue, elapsed };
}

export function canTakeLoan(state) {
  return !state.player?.activeLoan?.active;
}

export function takeLoan(state, tierId) {
  const tier = LOAN_TIERS.find(t => t.id === tierId);
  if (!tier || !canTakeLoan(state)) return state;
  return {
    ...state,
    player: {
      ...state.player,
      coins: state.player.coins + tier.amount,
      activeLoan: {
        active: true,
        tierId: tier.id,
        amount: tier.amount,
        interest: tier.interest,
        repayBy: tier.repayBy,
        takenAt: Date.now(),
      },
    },
  };
}

export function repayLoan(state) {
  const loan = state.player?.activeLoan;
  if (!loan?.active) return state;
  const totalOwed = Math.round(loan.amount * (1 + loan.interest));
  if (state.player.coins < totalOwed) return null; // can't afford
  return {
    ...state,
    player: {
      ...state.player,
      coins: state.player.coins - totalOwed,
      activeLoan: { active: false },
      stats: { ...state.player.stats, loansRepaid: (state.player.stats?.loansRepaid || 0) + 1 },
    },
  };
}
