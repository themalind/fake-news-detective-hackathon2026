import './StartPage.scss';

type StartPageProps = {
  onStart: () => void;
};

export function StartPage({ onStart }: StartPageProps) {
  return (
    <main className="start-page">
      <div className="start-page__inner">
        <h1 className="start-page__title">Fake News Detective</h1>
        <p className="start-page__lead">
          Träna ditt öga för manipulerade rubriker, citat och bilder.
        </p>
        <button
          type="button"
          className="start-page__cta"
          onClick={onStart}
        >
          START
        </button>
      </div>
    </main>
  );
}
