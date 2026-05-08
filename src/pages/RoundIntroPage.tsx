import { useGame } from "../context/GameContext";
import { ROUNDS } from "../data/rounds";
import { ArrowRight } from "lucide-react";
import "./RoundIntroPage.scss";

export default function RoundIntroPage() {
  const { state, dispatch } = useGame();
  const round = ROUNDS[state.currentRoundIndex];

  return (
    <div className="round-intro">
      <div className="round-intro__card">
        <span className="round-intro__number">
          Runda {round.number} av {ROUNDS.length}
        </span>
        <h1 className="round-intro__title">{round.title}</h1>
        <p className="round-intro__focus">{round.focus}</p>
        <p className="round-intro__description">{round.description}</p>

        <div className="round-intro__tips">
          <h2 className="round-intro__tips-heading">Detektivtips för rundan</h2>
          <ul className="round-intro__tips-list">
            {round.tips.map((tip, i) => (
              <li key={i} className="round-intro__tip">
                <span className="round-intro__tip-bullet">▸</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <div className="round-intro__actions">
          <button
            className="round-intro__start-btn"
            onClick={() => dispatch({ type: "START_ROUND" })}
          >
            Starta runda {round.number} <ArrowRight size={18} strokeWidth={2.5} />
          </button>
          <button
            className="round-intro__back-btn"
            onClick={() => dispatch({ type: "EXIT_TO_START" })}
          >
            Till dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
