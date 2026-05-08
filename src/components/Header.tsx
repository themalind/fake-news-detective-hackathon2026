import "./Header.scss";

type CaseStatus = "correct" | "wrong" | undefined;

interface HeaderProps {
  isHomePage?: boolean;
  showGameNavigation?: boolean;
  currentCaseIndex?: number;
  totalCases?: number;
  caseStatuses?: CaseStatus[];
  experience?: number;
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
  caseStatuses = [],
  experience,
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
      <header className={`header${isHomePage ? " header--home" : ""}`}>
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
              {Array.from({ length: totalCases }, (_, i) => {
                const status = caseStatuses[i];
                const modifier =
                  i === currentCaseIndex
                    ? "header__dot--active"
                    : status === "correct"
                      ? "header__dot--correct"
                      : status === "wrong"
                        ? "header__dot--wrong"
                        : "";
                return (
                  <span
                    key={i}
                    className={`header__dot${modifier ? " " + modifier : ""}`}
                  />
                );
              })}
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

        {experience !== undefined ? (
          <div className="header__stats">
            <span className="header__score">{experience} XP</span>
            {streak !== undefined && streak > 0 && (
              <span className="header__streak">
                <img
                  src="/images/StylingElements/fire1.png"
                  alt=""
                  aria-hidden="true"
                  className="header__streak-icon"
                />
                {streak}
              </span>
            )}
          </div>
        ) : (
          <div className="header__spacer" aria-hidden="true" />
        )}
      </header>
    </>
  );
}
