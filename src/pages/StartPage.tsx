import PlayerDashboard from "../components/PlayerDashboard";
import Header from "../components/Header";
import { useMagnify } from "../hooks/useMagnify";
import "./StartPage.scss";

interface StartPageProps {
  onStart: () => void;
}

export default function StartPage({ onStart }: StartPageProps) {
  const dashboardRef = useMagnify<HTMLDivElement>()
  const hintRef      = useMagnify<HTMLParagraphElement>()

  return (
    <>
      <Header isHomePage />
      <main className="start-page">
        <div className="start-page__badge">ÄRENDE: ÖPPET</div>

        <h1 className="start-page__title">Fake News Detective</h1>

        <p className="start-page__tagline">Granska fakta. Ifrågasätt allt. Avslöja sanningen.</p>

        <div ref={dashboardRef}>
          <PlayerDashboard />
        </div>

        <button className="start-page__button" onClick={onStart}>
          STARTA UTREDNING
        </button>

        <p className="start-page__hint" ref={hintRef}>Kan du avslöja falska nyheter innan de sprids?</p>
      </main>
    </>
  );
}
