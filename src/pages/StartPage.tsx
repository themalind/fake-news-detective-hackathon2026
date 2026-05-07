import { useGame } from "../context/GameContext";
import "./SummaryPage.scss";

function getRank(score: number): string {
  if (score >= 800) return "Chefdetektiv av Nope";
  if (score >= 600) return "Desinformationsdetektiv";
  if (score >= 400) return "Rubrikjägare";
  if (score >= 200) return "Källsniffare";
  return "Junior Skeptiker";
}

function getRankBadge(score: number): string {
  if (score >= 800) return "★★★";
  if (score >= 600) return "★★☆";
  if (score >= 400) return "★☆☆";
  if (score >= 200) return "◈◈◇";
  return "◈◇◇";
}

export default function SummaryPage() {
  const { state, dispatch } = useGame();
  const { score, maxStreak, results } = state;

  const correctCount = results.filter((r) => r.isCorrect).length;
  const accuracy = results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0;
  const rank = getRank(score);
  const badge = getRankBadge(score);

  return (
    <main className="summary-page">
      <div className="summary-page__card">
        <div className="summary-page__badge">{badge}</div>
        <h1 className="summary-page__rank">{rank}</h1>
        <p className="summary-page__score-label">SLUTPOÄNG</p>
        <p className="summary-page__score">{score} XP</p>

        <div className="summary-page__stats">
          <div className="summary-stat">
            <span className="summary-stat__value">
              {correctCount}/{results.length}
            </span>
            <span className="summary-stat__label">Fall lösta</span>
          </div>
          <div className="summary-stat">
            <span className="summary-stat__value">{accuracy}%</span>
            <span className="summary-stat__label">Träffsäkerhet</span>
          </div>
          <div className="summary-stat">
            <span className="summary-stat__value">&#128293; {maxStreak}</span>
            <span className="summary-stat__label">Bästa streak</span>
          </div>
        </div>

        <div className="summary-page__cases">
          {results.map((result, i) => {
            const c = CASES[i];
            return (
              <div
                key={result.caseId}
                className={`summary-case ${result.isCorrect ? "summary-case--correct" : "summary-case--wrong"}`}
              >
                <span className="summary-case__icon">{result.isCorrect ? "✓" : "✗"}</span>
                <span className="summary-case__headline">{c.headline}</span>
                <span className="summary-case__score">
                  {result.scoreGained >= 0 ? "+" : ""}
                  {result.scoreGained} XP
                </span>
              </div>
            );
          })}
        </div>

        <button className="summary-page__restart" onClick={() => dispatch({ type: "RESTART" })}>
          UTRED IGEN
        </button>
      </div>
    </main>
  );
}
