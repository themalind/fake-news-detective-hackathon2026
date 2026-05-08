import { useEffect, useMemo, useRef, useState } from "react";
import { useGame } from "../context/GameContext";
import { CASES } from "../data/cases";
import { DETECTIVE_HINTS, URL_INSPECT_TIPS } from "../data/hints";
import type {
  ArticleLink,
  Case,
  Classification,
  Clue,
  ImageAnalysis,
  PlayerStats,
  ResearchReport,
  RoundResult,
  ShadyLinkInfo,
} from "../types/game";
import Header from "../components/Header";
import { load } from "../utils/storage";
import { AlertTriangle, ArrowRight, Lock, Search, Star, X } from "lucide-react";
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
  onLinkClick,
  selectedClassification,
}: {
  currentCase: Case;
  article?: ArticleContent;
  onImageSearch?: () => void;
  onLinkClick: (link: ArticleLink) => void;
  selectedClassification?: string | null;
}) {
  // articles.html är källan för all metadata och brödtext.
  // cases.ts driver bara gameplay (klassificering, bevis, etc.) + url.
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
                  <span className="case-card__image-search-btn-label">
                    Granska
                  </span>
                </button>
              )}
            </div>
          )}
          {paragraphs.map((paragraph, index) => (
            <p className="case-card__content" key={index}>
              {renderParagraphWithLinks(
                paragraph,
                currentCase.inlineLinks,
                onLinkClick,
              )}
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
  isReadOnly?: boolean;
}

function EvidencePanel({
  clues,
  positiveClues,
  misleadingClues,
  classification,
  selectedClueIds,
  onToggle,
  onSubmit,
  isReadOnly = false,
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
        type="button"
        className={`clue-chip${selected ? " clue-chip--selected" : ""}`}
        onClick={isReadOnly ? undefined : () => onToggle(clue.id)}
        disabled={isReadOnly}
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
        <span className="evidence-panel__sub">
          {isReadOnly
            ? "Du har redan klassificerat detta fall"
            : "Välj alla bevis som stämmer"}
        </span>
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
          disabled={!isReadOnly && selectedClueIds.length === 0}
        >
          {isReadOnly ? (
            "VISA FACIT"
          ) : (
            <>
              LÄMNA IN FALL <ArrowRight size={16} strokeWidth={2.5} />
            </>
          )}
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
        Fler tips på URL-granskning <ArrowRight size={14} strokeWidth={2.25} />
      </button>
    </div>
  );
}

function HintCard({
  hints,
  index,
  onIndexChange,
}: {
  hints: {
    title: string;
    body: string;
    link?: { url: string; label: string };
  }[];
  index: number;
  onIndexChange: (next: number) => void;
}) {
  const hint = hints[index];
  const prev = () => onIndexChange((index - 1 + hints.length) % hints.length);
  const next = () => onIndexChange((index + 1) % hints.length);

  return (
    <aside className="hint-card" aria-label="Detektivtips">
      <div className="hint-card__header">
        <button
          type="button"
          className="hint-card__nav hint-card__nav--prev"
          onClick={prev}
          aria-label="Föregående tips"
        />
        <span className="hint-card__badge">Detektivtips</span>
        <button
          type="button"
          className="hint-card__nav hint-card__nav--next"
          onClick={next}
          aria-label="Nästa tips"
        />
      </div>
      <h3 className="hint-card__title">{hint.title}</h3>
      <p className="hint-card__body">{hint.body}</p>
      {hint.link && (
        <a
          className="hint-card__link"
          href={hint.link.url}
          title={hint.link.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {hint.link.label} ↗
        </a>
      )}
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

// ---------- Inline-länkar i artiklar ----------

const LINK_TOKEN_RE = /\{\{(\w+)\|([^}]+)\}\}/g;

function renderParagraphWithLinks(
  text: string,
  links: Record<string, ArticleLink> | undefined,
  onLinkClick: (link: ArticleLink) => void,
): React.ReactNode {
  if (!links) return text;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let nodeKey = 0;
  // RegExp.exec med global flagga — reset:as inte mellan anrop, så ny RegExp varje gång
  const re = new RegExp(LINK_TOKEN_RE.source, "g");
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const link = links[match[1]];
    const displayText = match[2];
    if (link) {
      parts.push(
        <ArticleLinkInline
          key={`link-${nodeKey++}`}
          link={link}
          displayText={displayText}
          onClick={() => onLinkClick(link)}
        />,
      );
    } else {
      parts.push(displayText);
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

function ArticleLinkInline({
  link,
  displayText,
  onClick,
}: {
  link: ArticleLink;
  displayText: string;
  onClick: () => void;
}) {
  return (
    <a
      href={link.url}
      title={link.url}
      className="article-link"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {displayText}
    </a>
  );
}

// Fake-browser-modal — visar antingen en forskningsrapport eller en 404-sida
function FakeBrowserModal({
  link,
  onClose,
}: {
  link: Extract<ArticleLink, { type: "report" | "dead" }>;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fake-browser-modal"
      role="dialog"
      aria-modal="true"
      aria-label={link.type === "report" ? "Forskningsrapport" : "404 sida"}
      onClick={onClose}
    >
      <div
        className="fake-browser"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="fake-browser__url-bar">
          <Lock size={12} strokeWidth={2.25} className="fake-browser__lock" />
          <span className="fake-browser__url" title={link.url}>
            {link.url}
          </span>
          <button
            type="button"
            className="fake-browser__close"
            onClick={onClose}
            aria-label="Stäng"
          >
            <X size={16} strokeWidth={2.25} />
          </button>
        </div>
        <div className="fake-browser__body">
          {link.type === "report" ? (
            <ReportContent report={link.report} />
          ) : (
            <DeadPageContent url={link.url} />
          )}
        </div>
      </div>
    </div>
  );
}

function ReportContent({ report }: { report: ResearchReport }) {
  return (
    <article className="report">
      <header className="report__header">
        <h1 className="report__title">{report.title}</h1>
        <p className="report__authors">
          {report.authors}
          <span className="report__affiliation"> — {report.affiliation}</span>
        </p>
        <p className="report__meta">
          Publicerad {report.date}
          {report.participants !== undefined &&
            ` · ${report.participants} deltagare`}
        </p>
        {report.funding && (
          <p className="report__funding">
            <strong>Finansiering:</strong> {report.funding}
          </p>
        )}
      </header>

      <section className="report__section">
        <h2 className="report__heading">Sammanfattning</h2>
        <p>{report.abstract}</p>
      </section>

      <section className="report__section">
        <h2 className="report__heading">Metod</h2>
        <p>{report.method}</p>
      </section>

      <section className="report__section">
        <h2 className="report__heading">Resultat</h2>
        <ul className="report__list">
          {report.findings.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      </section>

      <section className="report__section">
        <h2 className="report__heading">Slutsats</h2>
        <p>{report.conclusion}</p>
      </section>
    </article>
  );
}

function DeadPageContent({ url }: { url: string }) {
  return (
    <div className="dead-page">
      <div className="dead-page__code">404</div>
      <h1 className="dead-page__title">Sidan kunde inte hittas</h1>
      <p className="dead-page__url">{url}</p>
      <p className="dead-page__lead">
        Servern svarade men hittade ingen resurs på den här adressen.
      </p>
      <p className="dead-page__hint">
        💡 Detektivtips: Om en artikel hänvisar till en källa som inte ens
        finns — då existerar troligen inte underlaget för påståendet heller.
      </p>
    </div>
  );
}

// Suspicious-link-modal — varning + URL-tips
function SuspiciousLinkModal({
  link,
  onClose,
  onShowTips,
}: {
  link: Extract<ArticleLink, { type: "shady" }>;
  onClose: () => void;
  onShowTips: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const { warning } = link;

  return (
    <div
      className="suspicious-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Varning för misstänkt länk"
      onClick={onClose}
    >
      <div
        className="suspicious-modal__card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="suspicious-modal__header">
          <AlertTriangle
            size={28}
            strokeWidth={2}
            className="suspicious-modal__warn-icon"
          />
          <div>
            <h2 className="suspicious-modal__title">Misstänkt länk</h2>
            <p className="suspicious-modal__sub">
              Håll alltid muspekaren över en länk <em>innan</em> du klickar.
              Den fullständiga URL:en visas då i webbläsarens nedre kant — så
              du hinner avgöra om den ser säker ut. På mobil: håll fingret
              nedtryckt på länken.
            </p>
          </div>
        </div>

        <div className="suspicious-modal__url-row">
          <span className="suspicious-modal__url-label">URL</span>
          <span className="suspicious-modal__url">{link.url}</span>
        </div>

        <div className="suspicious-modal__legit">
          <span className="suspicious-modal__legit-label">
            Legitim adress hade varit
          </span>
          <span className="suspicious-modal__legit-domain">
            {warning.legitDomain}
          </span>
        </div>

        <ul className="suspicious-modal__reasons">
          {warning.reasons.map((reason, i) => (
            <li key={i} className="suspicious-modal__reason">
              {reason}
            </li>
          ))}
        </ul>

        <div className="suspicious-modal__actions">
          <button
            type="button"
            className="suspicious-modal__tips-btn"
            onClick={onShowTips}
          >
            Fler tips på URL-granskning
          </button>
          <button
            type="button"
            className="suspicious-modal__close-btn"
            onClick={onClose}
          >
            STÄNG
          </button>
        </div>
      </div>
    </div>
  );
}

interface FeedbackOverlayProps {
  result: RoundResult;
  currentCase: Case;
  selectedClueIds: string[];
  isLastCase: boolean;
  isReview?: boolean;
  onNext: () => void;
}

function FeedbackOverlay({
  result,
  currentCase,
  selectedClueIds,
  isLastCase,
  isReview = false,
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

  // Bevis-granskningen ska bara titta på den lista användaren faktiskt såg
  // (motsvarande deras valda klassificering). Annars listas "missade" ledtrådar
  // från klassificeringar de aldrig hade möjlighet att välja chips från.
  const cluesForReview =
    result.selectedClassification === "true"
      ? currentCase.positiveClues
      : result.selectedClassification === "false"
        ? currentCase.clues
        : currentCase.misleadingClues;

  const clueGroups = buildClueGroups(cluesForReview, selectedClueIds);

  const scoreParts = [
    `${classScore >= 0 ? "+" : ""}${classScore} klassificering`,
    `${clueScore >= 0 ? "+" : ""}${clueScore} bevis`,
    timeBonus > 0 ? `+${timeBonus} snabbhet` : null,
  ].filter(Boolean);

  return (
    <div className="feedback-overlay" role="dialog" aria-modal="true">
      <div className="feedback-overlay__card">
        <div
          className={`feedback-overlay__verdict feedback-overlay__verdict--${
            result.isCorrect ? "correct" : "wrong"
          }`}
        >
          <span className="feedback-overlay__verdict-icon">
            {result.isCorrect ? "✓" : "✗"}
          </span>
          <strong className="feedback-overlay__verdict-title">
            {result.isCorrect ? "Rätt bedömning!" : "Fel klassificering"}
          </strong>
          {!result.isCorrect && (
            <span className="feedback-overlay__verdict-sub">
              Rätt: <strong>{correctLabel}</strong> · Du svarade {selectedLabel}
            </span>
          )}
        </div>

        <div className="feedback-overlay__explanation">
          <p className="feedback-overlay__explanation-text">
            {currentCase.feedback}
          </p>
          <div className="feedback-overlay__consequence">
            <span className="feedback-overlay__consequence-label">
              Om den delas:
            </span>
            <span>{currentCase.consequence}</span>
          </div>
        </div>

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
                    <span className="clue-group__pill">
                      {STATUS_ICON[status]} {STATUS_LABEL[status]} ·{" "}
                      {items.length}
                    </span>
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

        <div className="feedback-overlay__score">
          <span className="feedback-overlay__score-parts">
            {scoreParts.join(" · ")}
          </span>
          <span className="feedback-overlay__score-total">
            {result.scoreGained >= 0 ? "+" : ""}
            {result.scoreGained} XP
          </span>
        </div>

        <button className="feedback-overlay__next-btn" onClick={onNext}>
          {isReview ? (
            "STÄNG"
          ) : (
            <>
              {isLastCase ? "SE RESULTAT" : "NÄSTA FALL"}{" "}
              <ArrowRight size={16} strokeWidth={2.5} />
            </>
          )}
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
  // "Sista" innebär: alla case är besvarade (inklusive nuvarande efter submit).
  // Då ska feedback-overlayens knapp säga "SE RESULTAT" istället för "NÄSTA FALL".
  const isLastCase = CASES.every((c) =>
    state.results.find((r) => r.caseId === c.id),
  );
  const [showImageAnalysis, setShowImageAnalysis] = useState(false);
  const [showUrlInspect, setShowUrlInspect] = useState(false);
  const [showFacit, setShowFacit] = useState(false);
  const [activeBrowserLink, setActiveBrowserLink] = useState<
    Extract<ArticleLink, { type: "report" | "dead" }> | null
  >(null);
  const [activeShadyLink, setActiveShadyLink] = useState<
    Extract<ArticleLink, { type: "shady" }> | null
  >(null);

  // Resultatet för det case användaren ser just nu (om det är besvarat).
  // Används för att visa "Visa facit"-läget vid backnav till tidigare cases.
  const currentCaseResult = state.results.find(
    (r) => r.caseId === currentCase.id,
  );
  const isAnswered = !!currentCaseResult;

  // Detektivtips: stegas fram automatiskt varje gång användaren byter case,
  // men man kan också manuellt bläddra med chevron-pilarna och fortsätta
  // därifrån vid nästa case-byte.
  const [hintIndex, setHintIndex] = useState(0);
  const lastSeenCaseIndex = useRef(state.currentCaseIndex);
  useEffect(() => {
    if (lastSeenCaseIndex.current !== state.currentCaseIndex) {
      lastSeenCaseIndex.current = state.currentCaseIndex;
      setHintIndex((i) => (i + 1) % DETECTIVE_HINTS.length);
    }
  }, [state.currentCaseIndex]);

  // Status per case för paginerings-pluppar i headern
  const caseStatuses = CASES.map((c) => {
    const result = state.results.find((r) => r.caseId === c.id);
    if (!result) return undefined;
    return result.isCorrect ? ("correct" as const) : ("wrong" as const);
  });

  useEffect(() => {
    setShowImageAnalysis(false);
    setShowUrlInspect(false);
    setShowFacit(false);
    setActiveBrowserLink(null);
    setActiveShadyLink(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [state.currentCaseIndex]);

  // Scrolla ned till bevis-sektionen när användaren tryckt på klassificera.
  // Liten fördröjning så stamp-slap-animationen (0.25s) hinner spelas upp först.
  useEffect(() => {
    if (state.phase !== "investigating") return;
    const timer = setTimeout(() => {
      document.querySelector(".evidence-panel")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 200);
    return () => clearTimeout(timer);
  }, [state.phase]);

  return (
    <div className="game-page">
      <Header
        showGameNavigation
        currentCaseIndex={state.currentCaseIndex}
        totalCases={CASES.length}
        caseStatuses={caseStatuses}
        experience={(load("stats", DEFAULT_STATS) as PlayerStats).totalScore + state.score}
        streak={state.streak}
        onLogoClick={() => dispatch({ type: "EXIT_TO_START" })}
        onPrevious={() => dispatch({ type: "PREV_CASE" })}
        onNext={() => dispatch({ type: "NEXT_CASE" })}
        isPrevDisabled={state.currentCaseIndex === 0}
        isNextDisabled={state.currentCaseIndex >= CASES.length - 1}
      />

      <div className="game-page__body">
        <div className="game-page__layout">
          <div className="game-page__main">
            <BrowserFrame
              source={currentCase.url ?? currentCase.source}
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
                onLinkClick={(link) => {
                  if (link.type === "shady") {
                    setActiveShadyLink(link);
                  } else {
                    setActiveBrowserLink(link);
                  }
                }}
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
                onSubmit={
                  isAnswered
                    ? () => setShowFacit(true)
                    : () => dispatch({ type: "SUBMIT_CASE" })
                }
                isReadOnly={isAnswered}
              />
            )}
          </div>

          <aside className="game-page__sidebar">
            <section className="classify-panel">
              <p className="classify-panel__label">
                {isAnswered ? "DIN KLASSIFICERING" : "KLASSIFICERA ARTIKELN"}
              </p>
              <div className="classify-panel__buttons">
                <ClassifyButton
                  label="SANT"
                  value="true"
                  selected={state.selectedClassification === "true"}
                  disabled={state.phase === "feedback" || isAnswered}
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
                  disabled={state.phase === "feedback" || isAnswered}
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
                  disabled={state.phase === "feedback" || isAnswered}
                  onClick={() =>
                    dispatch({
                      type: "SELECT_CLASSIFICATION",
                      classification: "misleading",
                    })
                  }
                />
              </div>
            </section>

            <HintCard
              hints={DETECTIVE_HINTS}
              index={hintIndex}
              onIndexChange={setHintIndex}
            />
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

      {showFacit && currentCaseResult && (
        <FeedbackOverlay
          result={currentCaseResult}
          currentCase={currentCase}
          selectedClueIds={currentCaseResult.selectedClueIds}
          isLastCase={false}
          isReview
          onNext={() => setShowFacit(false)}
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

      {activeBrowserLink && (
        <FakeBrowserModal
          link={activeBrowserLink}
          onClose={() => setActiveBrowserLink(null)}
        />
      )}

      {activeShadyLink && (
        <SuspiciousLinkModal
          link={activeShadyLink}
          onClose={() => setActiveShadyLink(null)}
          onShowTips={() => {
            setActiveShadyLink(null);
            setShowUrlInspect(true);
          }}
        />
      )}
    </div>
  );
}
