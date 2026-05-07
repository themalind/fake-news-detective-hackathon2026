import "./Header.scss";

interface HeaderProps {
  isHomePage?: boolean;
  showGameNavigation?: boolean;
  currentCaseIndex?: number;
  totalCases?: number;
  score?: number;
  streak?: number;
  onLogoClick?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  isPrevDisabled?: boolean;
  isNextDisabled?: boolean;
}

export default function Header({
  isHomePage = false,
  showGameNavigation = false,
  currentCaseIndex = 0,
  totalCases = 0,
  score,
  streak,
  onLogoClick,
  onPrevious,
  onNext,
  isPrevDisabled = false,
  isNextDisabled = false,
}: HeaderProps) {
  const logo = (
    <img
      src="/images/StylingElements/logo.png"
      alt="Fake News Detective"
      className="header__logo-img"
    />
  );

  return (
    <>
      <header className="header">
        <div className="header__logo">
          {isHomePage || !onLogoClick ? (
            logo
          ) : (
            <button
              className="header__logo-btn"
              onClick={onLogoClick}
              aria-label="Gå till startsidan"
            >
              {logo}
            </button>
          )}
        </div>

        {showGameNavigation && (
          <nav className="header__nav" aria-label="Fallnavigering">
            <button
              className="header__arrow header__arrow--prev"
              onClick={onPrevious}
              disabled={isPrevDisabled}
              aria-label="Föregående fall"
            />
            <div className="header__dots" aria-hidden="true">
              {Array.from({ length: totalCases }, (_, i) => (
                <span
                  key={i}
                  className={`header__dot${
                    i < currentCaseIndex
                      ? " header__dot--done"
                      : i === currentCaseIndex
                        ? " header__dot--active"
                        : ""
                  }`}
                />
              ))}
            </div>
            <button
              className="header__arrow header__arrow--next"
              onClick={onNext}
              disabled={isNextDisabled}
              aria-label="Nästa fall"
            >
            </button>
          </nav>
        )}

        {score !== undefined ? (
          <div className="header__stats">
            <span className="header__score">{score} XP</span>
            {streak !== undefined && streak > 0 && (
              <span className="header__streak">&#128293; {streak}</span>
            )}
          </div>
        ) : (
          <div aria-hidden="true" />
        )}
      </header>
    </>
  );
}
