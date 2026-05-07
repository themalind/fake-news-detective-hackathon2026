import { useEffect, useMemo, useState } from "react";
import { useGame } from "../context/GameContext";
import { CASES } from "../data/cases";
import { SOURCE_CRITIC_HINTS, URL_INSPECT_TIPS } from "../data/hints";
import type {
  Case,
  Classification,
  Clue,
  ImageAnalysis,
  PlayerStats,
  RoundResult,
} from "../types/game";
import Header from "../components/Header";
import { load } from "../utils/storage";
import { ArrowRight, Lock, Search, Star } from "lucide-react";
import "./GamePage.scss";

const DEFAULT_STATS: PlayerStats = {
  totalGames: 0,
  totalCorrect: 0,
  totalFooled: 0,
  totalEvidenceFound: 0,
  bestStreak: 0,
  lastStreak: 0,
  totalScore: 0,
  badges: [],
};

interface ArticleContent {
  caseId: string;
  source: string;
  headline: string;
  author?: string;
  date?: string;
  paragraphs: string[];
}

function parseArticlesHtml(html: string): Record<string, ArticleContent> {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const articles: Record<string, ArticleContent> = {};

  doc
    .querySelectorAll<HTMLElement>("article[data-case-id]")
    .forEach((article) => {
      const caseId = article.dataset.caseId;
      if (!caseId) return;

      const meta = Array.from(article.querySelectorAll(".meta span")).map(
        (node) => node.textContent?.trim() ?? "",
      );
      const paragraphs = Array.from(article.querySelectorAll(".article-body p"))
        .map((node) => node.textContent?.trim() ?? "")
        .filter(Boolean);

      articles[caseId] = {
        caseId,
        source: article.querySelector(".url")?.textContent?.trim() ?? "",
        headline: article.querySelector("h2")?.textContent?.trim() ?? "",
        author: meta[0],
        date: meta[1],
        paragraphs,
      };
    });

  return articles;
}

function useArticleContent(): Record<string, ArticleContent> {
  const [articles, setArticles] = useState<Record<string, ArticleContent>>({});

  useEffect(() => {
    let cancelled = false;

    fetch("/articles.html")
      .then((res) => (res.ok ? res.text() : ""))
      .then((html) => {
        if (!cancelled && html) setArticles(parseArticlesHtml(html));
      })
      .catch(() => {
        if (!cancelled) setArticles({});
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return articles;
}

// ---------- Sub-components ----------

const stampConfig = {
  true: { text: "SANT", modifier: "true" },
  false: { text: "FALSKT", modifier: "false" },
  misleading: { text: "VILSELEDANDE", modifier: "misleading" },
};

function CaseCard({
  currentCase,
  article,
  onImageSearch,
  selectedClassification,
}: {
  currentCase: Case;
  article?: ArticleContent;
  onImageSearch?: () => void;
  selectedClassification?: string | null;
}) {
  const source = article?.source || currentCase.source;
  const headline = article?.headline || currentCase.headline;
  const author =
    article?.author || (currentCase.author ? `Av ${currentCase.author}` : "");
  const date = article?.date || currentCase.date;
  const paragraphs = article?.paragraphs ?? [];

  return (
    <div className="case-card-wrap">
      <svg
        className="case-card__tear-overlay"
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* roterar bilden 90° i SVG:ns eget koordinatsystem så den fyller hela viewBox */}
        <g transform="translate(1, 0) rotate(90 0 0)">
          <image
            href="/images/StylingElements/torn_paper_05-removebg-preview.png"
            x="0"
            y="0"
            width="1"
            height="1"
            preserveAspectRatio="none"
          />
        </g>
      </svg>
      {selectedClassification && stampConfig[selectedClassification as keyof typeof stampConfig] && (
        <div
          className={`case-card__stamp case-card__stamp--${stampConfig[selectedClassification as keyof typeof stampConfig].modifier}`}
          aria-hidden="true"
        >
          {stampConfig[selectedClassification as keyof typeof stampConfig].text}
        </div>
      )}
      <article className="case-card">
        <div className="case-card__url-bar">
          <span className="case-card__url-text">{source}</span>
        </div>
        <div className="case-card__body">
          <h2 className="case-card__headline">{headline}</h2>
          {(author || date) && (
            <div className="case-card__meta">
              {author && <span>{author}</span>}
              {date && <span>{date}</span>}
            </div>
          )}
          {currentCase.image && (
            <div className="case-card__image-wrap">
              <img
                className="case-card__article-image"
                src={`/images/${currentCase.image}`}
                alt=""
              />
              {onImageSearch && (
                <button
                  type="button"
                  className="case-card__image-search-btn"
                  onClick={onImageSearch}
                  aria-label="Granska bilden med omvänd bildsökning"
                >
                  <Search size={14} strokeWidth={2.25} />
                  Granska
                </button>
              )}
            </div>
          )}
          {paragraphs.map((paragraph, index) => (
            <p className="case-card__content" key={index}>
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </div>
  );
}

interface ClassifyButtonProps {
  label: string;
  value: Classification;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}

function ClassifyButton({
  label,
  value,
  selected,
  disabled,
  onClick,
}: ClassifyButtonProps) {
  return (
    <button
      className={`classify-btn classify-btn--${value}${selected ? " classify-btn--selected" : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
    >
      <span className="classify-btn__icon">
        {value === "true" && "✓"}
        {value === "false" && "✗"}
        {value === "misleading" && "?"}
      </span>
      {label}
    </button>
  );
}

interface EvidencePanelProps {
  clues: Clue[];
  positiveClues: Clue[];
  misleadingClues: Clue[];
  classification: Classification;
  selectedClueIds: string[];
  onToggle: (id: string) => void;
  onSubmit: () => void;
}

function EvidencePanel({
  clues,
  positiveClues,
  misleadingClues,
  classification,
  selectedClueIds,
  onToggle,
  onSubmit,
}: EvidencePanelProps) {
  const visibleClues =
    classification === "true"
      ? positiveClues
      : classification === "false"
        ? clues
        : misleadingClues;

  const shuffled = useMemo(
    () => [...visibleClues].sort(() => Math.random() - 0.5),
    [visibleClues],
  );

  const renderChip = (clue: Clue) => {
    const selected = selectedClueIds.includes(clue.id);
    return (
      <button
        key={clue.id}
        className={`clue-chip${selected ? " clue-chip--selected" : ""}`}
        onClick={() => onToggle(clue.id)}
        aria-pressed={selected}
      >
        <span className="clue-chip__check">{selected ? "✓" : "+"}</span>
        {clue.text}
      </button>
    );
  };

  return (
    <div className="evidence-panel">
      <div className="evidence-panel__header">
        <span className="evidence-panel__sub">Välj alla bevis som stämmer</span>
      </div>
      <div className="evidence-panel__grid">{shuffled.map(renderChip)}</div>

      <div className="evidence-panel__footer">
        <span className="evidence-panel__selected-count">
          {selectedClueIds.length} ledtråd
          {selectedClueIds.length !== 1 ? "ar" : ""} vald
          {selectedClueIds.length !== 1 ? "a" : ""}
        </span>
        <button
          className="evidence-panel__submit"
          onClick={onSubmit}
          disabled={selectedClueIds.length === 0}
        >
          LÄMNA IN FALL <ArrowRight size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

type ClueStatus = "correct" | "wrong" | "missed";

interface ClueReviewItem {
  clue: Clue;
  points: number;
}

interface ClueGroup {
  status: ClueStatus;
  items: ClueReviewItem[];
}

function buildClueGroups(
  clues: Clue[],
  selectedClueIds: string[],
): ClueGroup[] {
  const correct: ClueReviewItem[] = [];
  const wrong: ClueReviewItem[] = [];
  const missed: ClueReviewItem[] = [];

  for (const clue of clues) {
    const wasSelected = selectedClueIds.includes(clue.id);
    if (wasSelected && clue.isRelevant) {
      correct.push({ clue, points: 20 });
    } else if (wasSelected && !clue.isRelevant) {
      wrong.push({ clue, points: -10 });
    } else if (!wasSelected && clue.isRelevant) {
      missed.push({ clue, points: 0 });
    }
    // !wasSelected && !relevant → korrekt undviken, visas inte
  }

  const groups: ClueGroup[] = [];
  if (correct.length > 0) groups.push({ status: "correct", items: correct });
  if (wrong.length > 0) groups.push({ status: "wrong", items: wrong });
  if (missed.length > 0) groups.push({ status: "missed", items: missed });
  return groups;
}

const STATUS_ICON: Record<ClueStatus, string> = {
  correct: "✓",
  wrong: "✗",
  missed: "!",
};

const STATUS_LABEL: Record<ClueStatus, string> = {
  correct: "Skarpt öga",
  wrong: "Villospår",
  missed: "Missade ledtrådar",
};

interface ImageAnalysisModalProps {
  analysis: ImageAnalysis;
  onClose: () => void;
}

function ImageAnalysisModal({ analysis, onClose }: ImageAnalysisModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="image-analysis-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Bildanalys"
      onClick={onClose}
    >
      <div
        className="image-analysis-modal__card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="image-analysis-modal__header">
          <span className="image-analysis-modal__title">
            OMVÄND BILDSÖKNING
          </span>
          <button
            className="image-analysis-modal__close"
            onClick={onClose}
            aria-label="Stäng"
          >
            ✕
          </button>
        </div>

        <div
          className={`image-analysis-modal__match image-analysis-modal__match--${analysis.matchFound ? "found" : "clear"}`}
        >
          {analysis.matchFound
            ? "⚠ Matchning hittad"
            : "✓ Ingen matchning hittad"}
        </div>

        {analysis.matchFound &&
          (analysis.originalLocation ||
            analysis.originalDate ||
            analysis.subject) && (
            <div className="image-analysis-modal__rows">
              {analysis.originalLocation && (
                <div className="image-analysis-modal__row">
                  <span className="image-analysis-modal__label">
                    Ursprunglig plats
                  </span>
                  <span className="image-analysis-modal__value">
                    {analysis.originalLocation}
                  </span>
                </div>
              )}
              {analysis.originalDate && (
                <div className="image-analysis-modal__row">
                  <span className="image-analysis-modal__label">
                    Tidigare publicerad
                  </span>
                  <span className="image-analysis-modal__value">
                    {analysis.originalDate}
                  </span>
                </div>
              )}
              {analysis.subject && (
                <div className="image-analysis-modal__row">
                  <span className="image-analysis-modal__label">Motiv</span>
                  <span className="image-analysis-modal__value">
                    {analysis.subject}
                  </span>
                </div>
              )}
            </div>
          )}

        <button className="image-analysis-modal__close-btn" onClick={onClose}>
          STÄNG
        </button>
      </div>
    </div>
  );
}

function BrowserFrame({
  source,
  onInspectUrl,
  children,
}: {
  source: string;
  onInspectUrl: () => void;
  children: React.ReactNode;
}) {
  const [showLockInfo, setShowLockInfo] = useState(false);

  return (
    <div className="browser-frame">
      <div className="browser-frame__url-bar">
        <div className="browser-frame__address" title={source}>
          <button
            type="button"
            className="browser-frame__lock"
            onClick={() => setShowLockInfo((v) => !v)}
            aria-label="Visa anslutningsinformation"
            aria-expanded={showLockInfo}
          >
            <Lock size={12} strokeWidth={2.25} />
          </button>
          <span className="browser-frame__url">{source}</span>
          <span
            className="browser-frame__address-icon"
            aria-hidden="true"
            title="Sök på sidan"
          >
            <Search size={14} strokeWidth={2} />
          </span>
          <span
            className="browser-frame__address-icon"
            aria-hidden="true"
            title="Spara som bokmärke"
          >
            <Star size={14} strokeWidth={2} />
          </span>
        </div>
        {showLockInfo && (
          <LockInfoPopover
            source={source}
            onClose={() => setShowLockInfo(false)}
            onInspectUrl={() => {
              setShowLockInfo(false);
              onInspectUrl();
            }}
          />
        )}
      </div>
      <div className="browser-frame__body">{children}</div>
    </div>
  );
}

function LockInfoPopover({
  source,
  onClose,
  onInspectUrl,
}: {
  source: string;
  onClose: () => void;
  onInspectUrl: () => void;
}) {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (
        target.closest(".lock-popover") ||
        target.closest(".browser-frame__lock")
      ) {
        return;
      }
      onClose();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div className="lock-popover" role="dialog" aria-label="Anslutning">
      <div className="lock-popover__header">
        <Lock size={16} strokeWidth={2.25} />
        <span className="lock-popover__title">Anslutningen är krypterad</span>
      </div>
      <p className="lock-popover__lead">
        Sajten använder HTTPS — ingen kan avlyssna det du skickar. Men
        krypterad ≠ trovärdig.
      </p>
      <div className="lock-popover__url-row">
        <span className="lock-popover__url-label">Adress</span>
        <span className="lock-popover__url">{source}</span>
      </div>
      <p className="lock-popover__warning">
        Hänglåset säger inget om vem som äger sajten. Kontrollera domänen
        själv — bedragare har också HTTPS.
      </p>
      <button
        type="button"
        className="lock-popover__cta"
        onClick={onInspectUrl}
      >
        Fler tips på url-granskning <ArrowRight size={14} strokeWidth={2.25} />
      </button>
    </div>
  );
}

function HintCard({ hint }: { hint: { title: string; body: string } }) {
  return (
    <aside className="hint-card" aria-label="Detektivtips">
      <div className="hint-card__badge">Detektivtips</div>
      <h3 className="hint-card__title">{hint.title}</h3>
      <p className="hint-card__body">{hint.body}</p>
      <p className="hint-card__footer">
        Välj en klassificering för att börja samla bevis.
      </p>
    </aside>
  );
}

function UrlInspectModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="url-inspect-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Granska URL"
      onClick={onClose}
    >
      <div
        className="url-inspect-modal__card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="url-inspect-modal__header">
          <span className="url-inspect-modal__title">GRANSKA URL</span>
          <button
            className="url-inspect-modal__close"
            onClick={onClose}
            aria-label="Stäng"
          >
            ✕
          </button>
        </div>

        <p className="url-inspect-modal__lead">
          Adressfältet ljuger ibland. Här är vad en bra detektiv tittar efter
          innan hen litar på en länk:
        </p>

        <ul className="url-inspect-modal__list">
          {URL_INSPECT_TIPS.map((tip) => (
            <li className="url-inspect-modal__item" key={tip.title}>
              <span className="url-inspect-modal__item-title">{tip.title}</span>
              <span className="url-inspect-modal__item-body">{tip.body}</span>
            </li>
          ))}
        </ul>

        <button
          className="url-inspect-modal__close-btn"
          onClick={onClose}
        >
          STÄNG
        </button>
      </div>
    </div>
  );
}

interface FeedbackOverlayProps {
  result: RoundResult;
  currentCase: Case;
  selectedClueIds: string[];
  isLastCase: boolean;
  onNext: () => void;
}

function FeedbackOverlay({
  result,
  currentCase,
  selectedClueIds,
  isLastCase,
  onNext,
}: FeedbackOverlayProps) {
  const classLabel: Record<Classification, string> = {
    true: "SANT",
    false: "FALSKT",
    misleading: "VILSELEDANDE",
  };

  const correctLabel = classLabel[currentCase.correctClassification];
  const selectedLabel = classLabel[result.selectedClassification];

  const clueScore =
    result.correctCluesSelected * 20 - result.incorrectCluesSelected * 10;
  const timeBonus =
    result.timeElapsed < 20_000 ? 50 : result.timeElapsed < 40_000 ? 25 : 0;
  const classScore = result.isCorrect ? 100 : -50;

  const clueGroups = buildClueGroups(
    [
      ...currentCase.clues,
      ...currentCase.positiveClues,
      ...currentCase.misleadingClues,
    ],
    selectedClueIds,
  );

  return (
    <div className="feedback-overlay" role="dialog" aria-modal="true">
      <div className="feedback-overlay__card">
        <div
          className={`feedback-overlay__verdict ${result.isCorrect ? "feedback-overlay__verdict--correct" : "feedback-overlay__verdict--wrong"}`}
        >
          <span className="feedback-overlay__verdict-icon">
            {result.isCorrect ? "✓" : "✗"}
          </span>
          <div>
            <strong>
              {result.isCorrect ? "Rätt bedömning!" : "Fel klassificering"}
            </strong>
            {!result.isCorrect && (
              <span className="feedback-overlay__correct-label">
                {" "}
                Rätt klassificering är <strong>{correctLabel}</strong>. Du svarade{" "}
                {selectedLabel}.
              </span>
            )}
          </div>
        </div>

        <p className="feedback-overlay__explanation">{currentCase.feedback}</p>

        {clueGroups.length > 0 && (
          <div className="clue-review">
            <div className="clue-review__header">BEVIS-GRANSKNING</div>
            <div className="clue-review__scroll">
              {clueGroups.map(({ status, items }) => (
                <section
                  key={status}
                  className={`clue-group clue-group--${status}`}
                >
                  <h4 className="clue-group__title">
                    <span className="clue-group__icon" aria-hidden="true">
                      {STATUS_ICON[status]}
                    </span>
                    <span>{STATUS_LABEL[status]}</span>
                    <span className="clue-group__count">{items.length}</span>
                  </h4>
                  <ul className="clue-group__list">
                    {items.map(({ clue, points }) => (
                      <li key={clue.id} className="clue-group__item">
                        <span className="clue-group__text">{clue.text}</span>
                        <span className="clue-group__points">
                          {status === "missed"
                            ? "0 XP"
                            : `${points >= 0 ? "+" : ""}${points} XP`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        )}

        <div className="feedback-overlay__score-breakdown">
          <div className="feedback-overlay__score-row">
            <span>
              {result.isCorrect ? "Rätt klassificering" : "Fel klassificering"}
            </span>
            <span className={classScore >= 0 ? "positive" : "negative"}>
              {classScore >= 0 ? "+" : ""}
              {classScore} XP
            </span>
          </div>
          <div className="feedback-overlay__score-row">
            <span>
              Ledtrådar ({result.correctCluesSelected} rätt,{" "}
              {result.incorrectCluesSelected} fel)
            </span>
            <span className={clueScore >= 0 ? "positive" : "negative"}>
              {clueScore >= 0 ? "+" : ""}
              {clueScore} XP
            </span>
          </div>
          {timeBonus > 0 && (
            <div className="feedback-overlay__score-row">
              <span>Snabbhetsbonus</span>
              <span className="positive">+{timeBonus} XP</span>
            </div>
          )}
          <div className="feedback-overlay__score-row feedback-overlay__score-total">
            <span>Rundans totalt</span>
            <span>
              {result.scoreGained >= 0 ? "+" : ""}
              {result.scoreGained} XP
            </span>
          </div>
        </div>

        <div className="feedback-overlay__consequence">
          <span className="feedback-overlay__consequence-icon">&#9888;</span>
          {currentCase.consequence}
        </div>

        <button className="feedback-overlay__next-btn" onClick={onNext}>
          {isLastCase ? "SE RESULTAT" : "NÄSTA FALL"}{" "}
          <ArrowRight size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

// ---------- Main GamePage ----------

export default function GamePage() {
  const { state, dispatch } = useGame();
  const articles = useArticleContent();
  const currentCase = CASES[state.currentCaseIndex];
  const currentArticle = articles[currentCase.id];
  const lastResult = state.results[state.results.length - 1];
  const isLastCase = state.currentCaseIndex === CASES.length - 1;
  const [showImageAnalysis, setShowImageAnalysis] = useState(false);
  const [showUrlInspect, setShowUrlInspect] = useState(false);

  const currentHint =
    SOURCE_CRITIC_HINTS[state.currentCaseIndex % SOURCE_CRITIC_HINTS.length];

  useEffect(() => {
    setShowImageAnalysis(false);
    setShowUrlInspect(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [state.currentCaseIndex]);

  // Scrolla ned till bevis-sektionen när användaren tryckt på klassificeraknapp
  useEffect(() => {
    if (state.phase === "investigating") {
      document.querySelector(".evidence-panel")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [state.phase]);

  return (
    <div className="game-page">
      <Header
        showGameNavigation
        currentCaseIndex={state.currentCaseIndex}
        totalCases={CASES.length}
        experience={(load("stats", DEFAULT_STATS) as PlayerStats).totalScore + state.score}
        streak={state.streak}
        onLogoClick={() => dispatch({ type: "RESTART" })}
        onPrevious={() => dispatch({ type: "PREV_CASE" })}
        onNext={() => dispatch({ type: "NEXT_CASE" })}
        isPrevDisabled={state.currentCaseIndex === 0}
        isNextDisabled={state.currentCaseIndex >= CASES.length - 1}
      />

      <div className="game-page__body">
        <div className="game-page__layout">
          <div className="game-page__main">
            <BrowserFrame
              source={currentCase.source}
              onInspectUrl={() => setShowUrlInspect(true)}
            >
              <CaseCard
                currentCase={currentCase}
                article={currentArticle}
                onImageSearch={
                  currentCase.imageAnalysis
                    ? () => setShowImageAnalysis(true)
                    : undefined
                }
                selectedClassification={state.selectedClassification}
              />
            </BrowserFrame>

            {state.phase === "investigating" && (
              <EvidencePanel
                clues={currentCase.clues}
                positiveClues={currentCase.positiveClues}
                misleadingClues={currentCase.misleadingClues}
                classification={state.selectedClassification!}
                selectedClueIds={state.selectedClueIds}
                onToggle={(id) =>
                  dispatch({ type: "TOGGLE_CLUE", clueId: id })
                }
                onSubmit={() => dispatch({ type: "SUBMIT_CASE" })}
              />
            )}
          </div>

          <aside className="game-page__sidebar">
            <section className="classify-panel">
              <p className="classify-panel__label">KLASSIFICERA ARTIKELN</p>
              <div className="classify-panel__buttons">
                <ClassifyButton
                  label="SANT"
                  value="true"
                  selected={state.selectedClassification === "true"}
                  disabled={state.phase === "feedback"}
                  onClick={() =>
                    dispatch({
                      type: "SELECT_CLASSIFICATION",
                      classification: "true",
                    })
                  }
                />
                <ClassifyButton
                  label="FALSKT"
                  value="false"
                  selected={state.selectedClassification === "false"}
                  disabled={state.phase === "feedback"}
                  onClick={() =>
                    dispatch({
                      type: "SELECT_CLASSIFICATION",
                      classification: "false",
                    })
                  }
                />
                <ClassifyButton
                  label="VILSELEDANDE"
                  value="misleading"
                  selected={state.selectedClassification === "misleading"}
                  disabled={state.phase === "feedback"}
                  onClick={() =>
                    dispatch({
                      type: "SELECT_CLASSIFICATION",
                      classification: "misleading",
                    })
                  }
                />
              </div>
            </section>

            <HintCard hint={currentHint} />
          </aside>
        </div>
      </div>

      {state.phase === "feedback" && lastResult && (
        <FeedbackOverlay
          result={lastResult}
          currentCase={currentCase}
          selectedClueIds={state.selectedClueIds}
          isLastCase={isLastCase}
          onNext={() => dispatch({ type: "NEXT_CASE" })}
        />
      )}

      {showUrlInspect && (
        <UrlInspectModal onClose={() => setShowUrlInspect(false)} />
      )}

      {showImageAnalysis && currentCase.imageAnalysis && (
        <ImageAnalysisModal
          analysis={currentCase.imageAnalysis}
          onClose={() => setShowImageAnalysis(false)}
        />
      )}
    </div>
  );
}
