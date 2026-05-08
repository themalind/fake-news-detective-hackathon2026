import Header from "../components/Header";
import { useGame } from "../context/GameContext";
import { CASES } from "../data/cases";
import type { PlayerStats } from "../types/game";
import { load } from "../utils/storage";
import "./SummaryPage.scss";

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

export default function SummaryPage() {
  const { state, dispatch } = useGame();
  const { score, maxStreak, results } = state;
  const experience = (load("stats", DEFAULT_STATS) as PlayerStats).totalScore + score;

  const correctResults = results.filter((r) => r.isCorrect);
  const wrongResults = results.filter((r) => !r.isCorrect);
  const correctCount = correctResults.length;
  const accuracy = results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0;
  const rank = getRank(score);

  return (
    <>
      <Header experience={experience} onLogoClick={() => dispatch({ type: "EXIT_TO_START" })} />
      <main className="summary-page">
        <img
          src="/images/wallLight.png"
          alt=""
          aria-hidden="true"
          className="summary-page__wall-light summary-page__wall-light--left"
        />
        <img
          src="/images/wallLight.png"
          alt=""
          aria-hidden="true"
          className="summary-page__wall-light summary-page__wall-light--right"
        />
        <div className="summary-page__card">
          <span className="summary-page__corner summary-page__corner--tl" aria-hidden="true">✦</span>
          <span className="summary-page__corner summary-page__corner--tr" aria-hidden="true">✦</span>
          <span className="summary-page__corner summary-page__corner--bl" aria-hidden="true">✦</span>
          <span className="summary-page__corner summary-page__corner--br" aria-hidden="true">✦</span>
          <h1 className="summary-page__rank">{rank}</h1>
          <p className="summary-page__score">{score} XP</p>

          <div className="summary-page__stats">
            <div className="summary-stat">
              <div className="summary-stat__row">
                <img
                  src="/images/StylingElements/check.png"
                  alt=""
                  aria-hidden="true"
                  className="summary-stat__icon"
                />
                <span className="summary-stat__value">
                  {correctCount}/{results.length}
                </span>
              </div>
              <span className="summary-stat__label">Fall lösta</span>
            </div>
            <div className="summary-stat">
              <div className="summary-stat__row">
                <img
                  src="/images/StylingElements/dartboard.png"
                  alt=""
                  aria-hidden="true"
                  className="summary-stat__icon"
                />
                <span className="summary-stat__value">{accuracy}%</span>
              </div>
              <span className="summary-stat__label">Träffsäkerhet</span>
            </div>
            <div className="summary-stat">
              <div className="summary-stat__row">
                <img
                  src="/images/StylingElements/fire1.png"
                  alt=""
                  aria-hidden="true"
                  className="summary-stat__icon"
                />
                <span className="summary-stat__value">{maxStreak}</span>
              </div>
              <span className="summary-stat__label">Bästa streak</span>
            </div>
          </div>

          {(correctResults.length > 0 || wrongResults.length > 0) && (
            <div className="summary-page__cases">
              {correctResults.length > 0 && (
                <div className="summary-page__cases-col">
                  <h3 className="summary-page__cases-heading summary-page__cases-heading--correct">
                    Lösta fall
                  </h3>
                  <ul className="summary-page__cases-list">
                    {correctResults.map((result) => {
                      const c = CASES.find((cas) => cas.id === result.caseId);
                      return (
                        <li key={result.caseId} className="summary-case summary-case--correct">
                          <span className="summary-case__icon">✓</span>
                          <span className="summary-case__headline">{c?.headline}</span>
                          <span className="summary-case__score">+{result.scoreGained} XP</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              {wrongResults.length > 0 && (
                <div className="summary-page__cases-col">
                  <h3 className="summary-page__cases-heading summary-page__cases-heading--wrong">
                    Missade fall
                  </h3>
                  <ul className="summary-page__cases-list">
                    {wrongResults.map((result) => {
                      const c = CASES.find((cas) => cas.id === result.caseId);
                      return (
                        <li key={result.caseId} className="summary-case summary-case--wrong">
                          <span className="summary-case__icon">✗</span>
                          <span className="summary-case__headline">{c?.headline}</span>
                          <span className="summary-case__score">{result.scoreGained} XP</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="summary-page__actions">
          <button className="summary-page__restart" onClick={() => dispatch({ type: "START_GAME" })}>
            UTRED IGEN
          </button>
          <button className="summary-page__dashboard" onClick={() => dispatch({ type: "EXIT_TO_START" })}>
            TILL DASHBOARD
          </button>
        </div>
      </main>
    </>
  );
}
