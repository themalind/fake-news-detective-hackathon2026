import { useGame } from "../context/GameContext";
import { CASES } from "../data/cases";
import { ROUNDS } from "../data/rounds";
import type { PlayerStats } from "../types/game";
import { load } from "../utils/storage";
import { ArrowRight } from "lucide-react";
import "./RoundSummaryPage.scss";

const DEFAULT_STATS: PlayerStats = {
  totalGames: 0,
  totalCorrect: 0,
  totalFooled: 0,
  totalEvidenceFound: 0,
  bestStreak: 0,
  lastStreak: 0,
  totalScore: 0,
  badges: [],
  totalCompletedRounds: 0,
};

export default function RoundSummaryPage() {
  const { state, dispatch } = useGame();
  const round = ROUNDS[state.currentRoundIndex];
  const isLastRound = state.currentRoundIndex === ROUNDS.length - 1;

  const roundResults = state.results.filter((r) =>
    round.caseIds.includes(r.caseId)
  );
  const correctCount = roundResults.filter((r) => r.isCorrect).length;
  const roundScore = roundResults.reduce((sum, r) => sum + r.scoreGained, 0);
  const accuracy =
    roundResults.length > 0
      ? Math.round((correctCount / roundResults.length) * 100)
      : 0;

  const experience =
    (load("stats", DEFAULT_STATS) as PlayerStats).totalScore + state.score;

  return (
    <div className="round-summary">
      <div className="round-summary__card">
        <span className="round-summary__badge">
          Runda {round.number} klar
        </span>

        <h1 className="round-summary__title">{round.title}</h1>

        <div className="round-summary__stats">
          <div className="round-summary__stat">
            <span className="round-summary__stat-value">
              {correctCount}/{roundResults.length}
            </span>
            <span className="round-summary__stat-label">Fall lösta</span>
          </div>
          <div className="round-summary__stat">
            <span className="round-summary__stat-value">{accuracy}%</span>
            <span className="round-summary__stat-label">Träffsäkerhet</span>
          </div>
          <div className="round-summary__stat">
            <span className="round-summary__stat-value">
              {roundScore >= 0 ? "+" : ""}
              {roundScore}
            </span>
            <span className="round-summary__stat-label">XP denna runda</span>
          </div>
        </div>

        <div className="round-summary__xp-total">
          <span className="round-summary__xp-label">Total XP</span>
          <span className="round-summary__xp-value">{experience}</span>
        </div>

        <ul className="round-summary__cases">
          {roundResults.map((result) => {
            const c = CASES.find((cas) => cas.id === result.caseId);
            return (
              <li
                key={result.caseId}
                className={`round-summary__case round-summary__case--${result.isCorrect ? "correct" : "wrong"}`}
              >
                <span className="round-summary__case-icon">
                  {result.isCorrect ? "✓" : "✗"}
                </span>
                <span className="round-summary__case-headline">
                  {c?.headline}
                </span>
                <span className="round-summary__case-score">
                  {result.scoreGained >= 0 ? "+" : ""}
                  {result.scoreGained} XP
                </span>
              </li>
            );
          })}
        </ul>

        <div className="round-summary__actions">
          <button
            className="round-summary__next-btn"
            onClick={() => dispatch({ type: "NEXT_ROUND" })}
          >
            {isLastRound ? (
              "Se slutresultat"
            ) : (
              <>
                Nästa runda <ArrowRight size={16} strokeWidth={2.5} />
              </>
            )}
          </button>
          <button
            className="round-summary__dashboard-btn"
            onClick={() => dispatch({ type: "EXIT_TO_START" })}
          >
            Till dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
