import PlayerDashboard from "../components/PlayerDashboard";
import Header from "../components/Header";
import "./StartPage.scss";

interface StartPageProps {
  onStart: () => void;
}

export default function StartPage({ onStart }: StartPageProps) {
  return (
    <>
      <Header isHomePage />
      <main className="start-page">
      <div className="start-page__badge">ÄRENDE: ÖPPET</div>

      <h1 className="start-page__title">Fake News Detective</h1>

      <p className="start-page__tagline">Granska fakta. Ifrågasätt allt. Avslöja sanningen.</p>

      <PlayerDashboard />

      <button className="start-page__button" onClick={onStart}>
        STARTA UTREDNING
      </button>

      <p className="start-page__hint">Kan du avslöja falska nyheter innan de sprids?</p>
    </main>
    </>
  );
}
