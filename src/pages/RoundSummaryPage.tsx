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

function getRank(score: number): string {
  if (score >= 30000) return "Legendär Faktagranskare";
  if (score >= 20000) return "Sanningens väktare";
  if (score >= 12000) return "Mästerspion";
  if (score >= 7500) return "Elitdetektiv";
  if (score >= 4500) return "Chefdetektiv";
  if (score >= 2500) return "Desinformationsdetektiv";
  if (score >= 1200) return "Rubrikjägare";
  if (score >= 500) return "Nyhetsgranskare";
  return "Junior Skeptiker";
}

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

  if (isLastRound) {
    const allCorrect = state.results.filter((r) => r.isCorrect);
    const allWrong = state.results.filter((r) => !r.isCorrect);
    const totalAccuracy =
      state.results.length > 0
        ? Math.round((allCorrect.length / state.results.length) * 100)
        : 0;

    return (
      <div className="round-summary">
        <div className="round-summary__card round-summary__card--final">
          <span className="round-summary__badge">Alla rundor klara!</span>
          <h1 className="round-summary__rank">{getRank(state.score)}</h1>
          <p className="round-summary__final-score">{state.score} XP</p>

          <div className="round-summary__stats">
            <div className="round-summary__stat">
              <div className="round-summary__stat-row">
                <img src="/images/StylingElements/check.png" alt="" aria-hidden="true" className="round-summary__stat-icon" />
                <span className="round-summary__stat-value">
                  {allCorrect.length}/{state.results.length}
                </span>
              </div>
              <span className="round-summary__stat-label">Fall lösta</span>
            </div>
            <div className="round-summary__stat">
              <div className="round-summary__stat-row">
                <img src="/images/StylingElements/dartboard.png" alt="" aria-hidden="true" className="round-summary__stat-icon" />
                <span className="round-summary__stat-value">{totalAccuracy}%</span>
              </div>
              <span className="round-summary__stat-label">Träffsäkerhet</span>
            </div>
            <div className="round-summary__stat">
              <div className="round-summary__stat-row">
                <img src="/images/StylingElements/fire1.png" alt="" aria-hidden="true" className="round-summary__stat-icon" />
                <span className="round-summary__stat-value">{state.maxStreak}</span>
              </div>
              <span className="round-summary__stat-label">Bästa streak</span>
            </div>
          </div>

          {(allCorrect.length > 0 || allWrong.length > 0) && (
            <div className="round-summary__case-groups">
              {allCorrect.length > 0 && (
                <div>
                  <h3 className="round-summary__cases-heading round-summary__cases-heading--correct">
                    Lösta fall
                  </h3>
                  <ul className="round-summary__cases">
                    {allCorrect.map((result) => {
                      const c = CASES.find((cas) => cas.id === result.caseId);
                      return (
                        <li
                          key={result.caseId}
                          className="round-summary__case round-summary__case--correct"
                        >
                          <span className="round-summary__case-icon">✓</span>
                          <span className="round-summary__case-headline">{c?.headline}</span>
                          <span className="round-summary__case-score">+{result.scoreGained} XP</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              {allWrong.length > 0 && (
                <div>
                  <h3 className="round-summary__cases-heading round-summary__cases-heading--wrong">
                    Missade fall
                  </h3>
                  <ul className="round-summary__cases">
                    {allWrong.map((result) => {
                      const c = CASES.find((cas) => cas.id === result.caseId);
                      return (
                        <li
                          key={result.caseId}
                          className="round-summary__case round-summary__case--wrong"
                        >
                          <span className="round-summary__case-icon">✗</span>
                          <span className="round-summary__case-headline">{c?.headline}</span>
                          <span className="round-summary__case-score">{result.scoreGained} XP</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="round-summary__actions round-summary__actions--row">
            <button
              className="round-summary__next-btn"
              onClick={() => dispatch({ type: "START_GAME" })}
            >
              UTRED IGEN
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

  return (
    <div className="round-summary">
      <div className="round-summary__card">
        <span className="round-summary__badge">
          Runda {round.number} klar
        </span>

        <h1 className="round-summary__title">{round.title}</h1>

        <div className="round-summary__stats">
          <div className="round-summary__stat">
            <div className="round-summary__stat-row">
              <img src="/images/StylingElements/check.png" alt="" aria-hidden="true" className="round-summary__stat-icon" />
              <span className="round-summary__stat-value">
                {correctCount}/{roundResults.length}
              </span>
            </div>
            <span className="round-summary__stat-label">Fall lösta</span>
          </div>
          <div className="round-summary__stat">
            <div className="round-summary__stat-row">
              <img src="/images/StylingElements/dartboard.png" alt="" aria-hidden="true" className="round-summary__stat-icon" />
              <span className="round-summary__stat-value">{accuracy}%</span>
            </div>
            <span className="round-summary__stat-label">Träffsäkerhet</span>
          </div>
          <div className="round-summary__stat">
            <div className="round-summary__stat-row">
              <img src="/images/StylingElements/fire1.png" alt="" aria-hidden="true" className="round-summary__stat-icon" />
              <span className="round-summary__stat-value">
                {roundScore >= 0 ? "+" : ""}
                {roundScore}
              </span>
            </div>
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
            <>
              Nästa runda <ArrowRight size={16} strokeWidth={2.5} />
            </>
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
