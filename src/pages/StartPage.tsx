import PlayerDashboard from "../components/PlayerDashboard";
import { useMagnify } from "../hooks/useMagnify";
import "./StartPage.scss";

interface StartPageProps {
  onStart: () => void;
}

export default function StartPage({ onStart }: StartPageProps) {
  const dashboardRef = useMagnify<HTMLDivElement>()
  const hintRef      = useMagnify<HTMLParagraphElement>()

  return (
    <main className="start-page">
      <img src="/images/wallLight.png" alt="" aria-hidden="true" className="start-page__wall-light start-page__wall-light--left" />
      <img src="/images/wallLight.png" alt="" aria-hidden="true" className="start-page__wall-light start-page__wall-light--right" />

      <p className="start-page__tagline">Granska fakta. Ifrågasätt allt. Avslöja sanningen.</p>

      <div ref={dashboardRef}>
        <PlayerDashboard />
      </div>

      <button className="start-page__button" onClick={onStart}>
        STARTA UTREDNING
      </button>

      <p className="start-page__hint" ref={hintRef}>Kan du avslöja falska nyheter innan de sprids?</p>
    </main>
  );
}
