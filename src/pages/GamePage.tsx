import { useEffect, useMemo, useState } from "react";
import { useGame } from "../context/GameContext";
import { CASES } from "../data/cases";
import type {
  Case,
  Classification,
  Clue,
  ImageAnalysis,
  RoundResult,
} from "../types/game";
import Header from "../components/Header";
import "./GamePage.scss";

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

function CaseCard({
  currentCase,
  article,
  onImageSearch,
}: {
  currentCase: Case;
  article?: ArticleContent;
  onImageSearch?: () => void;
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
      <article className="case-card">
        <div className="case-card__url-bar">
          <span className="case-card__url-text">{source}</span>
          <span className="case-card__url-flag">&#9873; Misstänkt källa</span>
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
            <img
              className="case-card__article-image"
              src={`/images/${currentCase.image}`}
              alt=""
            />
          )}
          {paragraphs.map((paragraph, index) => (
            <p className="case-card__content" key={index}>
              {paragraph}
            </p>
          ))}
          {onImageSearch && (
            <div className="case-card__image-tool">
              <button
                className="case-card__image-search-btn"
                onClick={onImageSearch}
                aria-label="Öppna omvänd bildsökning"
              >
                🔍 Omvänd bildsökning
              </button>
            </div>
          )}
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
  selectedClueIds: string[];
  onToggle: (id: string) => void;
  onSubmit: () => void;
}

function EvidencePanel({
  clues,
  selectedClueIds,
  onToggle,
  onSubmit,
}: EvidencePanelProps) {
  const shuffledClues = useMemo(
    () => [...clues].sort(() => Math.random() - 0.5),
    [clues],
  );

  return (
    <div className="evidence-panel">
      <div className="evidence-panel__header">
        <span className="evidence-panel__label">VARFÖR TROR DU DET?</span>
        <span className="evidence-panel__sub">
          Välj alla ledtrådar som stämmer
        </span>
      </div>

      <div className="evidence-panel__grid">
        {shuffledClues.map((clue) => {
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
        })}
      </div>

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
          LÄMNA IN FALL &rarr;
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

  const clueGroups = buildClueGroups(currentCase.clues, selectedClueIds);

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
                Artikeln är <strong>{correctLabel}</strong>. Du svarade{" "}
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
          {isLastCase ? "SE RESULTAT" : "NÄSTA FALL"} &rarr;
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

  useEffect(() => {
    setShowImageAnalysis(false);
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
        score={state.score}
        streak={state.streak}
        onLogoClick={() => dispatch({ type: "RESTART" })}
        onPrevious={() => dispatch({ type: "PREV_CASE" })}
        onNext={() => dispatch({ type: "NEXT_CASE" })}
        isPrevDisabled={state.currentCaseIndex === 0}
        isNextDisabled={state.phase !== "feedback"}
      />

      <div className="game-page__body">
        <div className="game-page__case-label">
          UTREDNING #{currentCase.caseNumber}
        </div>
        <CaseCard
          currentCase={currentCase}
          article={currentArticle}
          onImageSearch={
            currentCase.imageAnalysis
              ? () => setShowImageAnalysis(true)
              : undefined
          }
        />

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

        {state.phase === "investigating" && (
          <EvidencePanel
            clues={currentCase.clues}
            selectedClueIds={state.selectedClueIds}
            onToggle={(id) => dispatch({ type: "TOGGLE_CLUE", clueId: id })}
            onSubmit={() => dispatch({ type: "SUBMIT_CASE" })}
          />
        )}
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

      {showImageAnalysis && currentCase.imageAnalysis && (
        <ImageAnalysisModal
          analysis={currentCase.imageAnalysis}
          onClose={() => setShowImageAnalysis(false)}
        />
      )}
    </div>
  );
}