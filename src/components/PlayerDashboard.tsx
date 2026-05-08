import type { PlayerStats } from "../types/game";
import { load } from "../utils/storage";
import "./PlayerDashboard.scss";

const RANKS = [
  { name: "Junior Skeptiker", min: 0, max: 499 },
  { name: "Källspanare", min: 500, max: 1199 },
  { name: "Rubrikjägare", min: 1200, max: 2499 },
  { name: "Desinformationsdetektiv", min: 2500, max: 4499 },
  { name: "Chefdetektiv", min: 4500, max: 7499 },
  { name: "Elitdetektiv", min: 7500, max: 11999 },
  { name: "Mästerspion", min: 12000, max: 19999 },
  { name: "Sanningens väktare", min: 20000, max: 29999 },
  { name: "Legendär Faktagranskare", min: 30000, max: Infinity },
];

const BADGES = [
  { id: "forsta-fallet", label: "Första fallet", image: "/images/StylingElements/fire1.png" },
  { id: "streakjagaren", label: "Streakjägaren", image: "/images/StylingElements/lightning.png" },
  { id: "bevissamlaren", label: "Bevissamlaren", image: "/images/StylingElements/folder.png" },
  { id: "skarpskytten", label: "Skarpskytten", image: "/images/StylingElements/dartboard.png" },
  { id: "veteranen", label: "Veteran", image: "/images/StylingElements/star.png" },
];

function getRank(score: number) {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (score >= RANKS[i].min) return { rank: RANKS[i], index: i };
  }
  return { rank: RANKS[0], index: 0 };
}

function getRankProgress(score: number) {
  const { rank, index } = getRank(score);
  if (index === RANKS.length - 1) return 100;
  return Math.min(100, Math.round((score / (rank.max + 1)) * 100));
}

function getRankXpLabel(score: number) {
  const { rank, index } = getRank(score);
  if (index === RANKS.length - 1) return `${score} erfarenhet`;
  return `${score} / ${rank.max + 1} erfarenhet`;
}

const DEFAULT_STATS: PlayerStats = {
  totalGames: 5,
  totalCorrect: 3,
  totalFooled: 4,
  totalEvidenceFound: 9,
  bestStreak: 3,
  lastStreak: 2,
  totalScore: 450,
  badges: ["forsta-fallet", "streakjagaren", "bevissamlaren", "skarpskytten", "veteranen"],
  totalCompletedRounds: 1,
};

export default function PlayerDashboard() {
  const saved = load("stats", DEFAULT_STATS) as PlayerStats;
  const hasAnyProgress = saved.totalGames > 0 || (saved.totalCompletedRounds ?? 0) > 0;
  const stats = hasAnyProgress ? saved : DEFAULT_STATS;
  const { rank } = getRank(stats.totalScore);
  const rankProgress = getRankProgress(stats.totalScore);
  const rankXpLabel = getRankXpLabel(stats.totalScore);
  const hasPlayed = stats.totalGames > 0 || (stats.totalCompletedRounds ?? 0) > 0;
  const totalPlayed = stats.totalCorrect + stats.totalFooled;
  const accuracy = totalPlayed > 0 ? Math.round((stats.totalCorrect / totalPlayed) * 100) : null;
  const level = stats.totalCompletedRounds ?? 0;

  return (
    <div className="player-dashboard">
      <span className="player-dashboard__corner player-dashboard__corner--tl" aria-hidden="true">
        ✦
      </span>
      <span className="player-dashboard__corner player-dashboard__corner--tr" aria-hidden="true">
        ✦
      </span>
      <span className="player-dashboard__corner player-dashboard__corner--bl" aria-hidden="true">
        ✦
      </span>
      <span className="player-dashboard__corner player-dashboard__corner--br" aria-hidden="true">
        ✦
      </span>

      <div className="player-dashboard__dossier">
        <span className="player-dashboard__dossier-label">Dossier · Detektiv</span>
        <span className="player-dashboard__dossier-rule" aria-hidden="true" />
      </div>

      <div className="player-dashboard__top">
        <div className="player-dashboard__profile">
          <div className="player-dashboard__avatar">
            <img
              src="/images/StylingElements/detective-lady.png"
              alt=""
              aria-hidden="true"
              className="player-dashboard__avatar-img"
            />
          </div>
          <div className="player-dashboard__rank-info">
            <span className="player-dashboard__rank-name">{rank.name}</span>
            <div
              className="player-dashboard__rank-bar"
              role="progressbar"
              aria-valuenow={rankProgress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="player-dashboard__rank-bar-fill" style={{ width: `${rankProgress}%` }} />
            </div>
            <span className="player-dashboard__rank-score">{rankXpLabel}</span>
          </div>
        </div>
      </div>

      <div className="player-dashboard__level">
        <div className="player-dashboard__level-left">
          <span className="player-dashboard__level-label">Nivå</span>
          <span className="player-dashboard__level-number">{level}</span>
        </div>
        <div className="player-dashboard__key-stats">
          <div className="player-dashboard__stat">
            <div className="player-dashboard__stat-row">
              <img
                src="/images/StylingElements/fire1.png"
                alt=""
                aria-hidden="true"
                className="player-dashboard__stat-icon"
              />
              <span className="player-dashboard__stat-value">{stats.lastStreak}</span>
            </div>
            <span className="player-dashboard__stat-label">Streak</span>
          </div>
          <div className="player-dashboard__stat">
            <div className="player-dashboard__stat-row">
              <img
                src="/images/StylingElements/star.png"
                alt=""
                aria-hidden="true"
                className="player-dashboard__stat-icon"
              />
              <span className="player-dashboard__stat-value">{stats.bestStreak}</span>
            </div>
            <span className="player-dashboard__stat-label">Rekord</span>
          </div>
          <div className="player-dashboard__stat">
            <div className="player-dashboard__stat-row">
              <img
                src="/images/StylingElements/dartboard.png"
                alt=""
                aria-hidden="true"
                className="player-dashboard__stat-icon"
              />
              <span className="player-dashboard__stat-value">{accuracy !== null ? `${accuracy}%` : "–"}</span>
            </div>
            <span className="player-dashboard__stat-label">Träffsäkerhet</span>
          </div>
        </div>
      </div>

      <div className="player-dashboard__investigation">
        <div className="player-dashboard__inv-grid">
          <div className="player-dashboard__inv-item">
            <div className="player-dashboard__inv-row">
              <img
                src="/images/StylingElements/folder.png"
                alt=""
                aria-hidden="true"
                className="player-dashboard__stat-icon"
              />
              <span className="player-dashboard__inv-value">{stats.totalCompletedRounds ?? 0}</span>
            </div>
            <span className="player-dashboard__inv-label">Utredningar</span>
          </div>
          <div className="player-dashboard__inv-item">
            <div className="player-dashboard__inv-row">
              <img
                src="/images/StylingElements/check.png"
                alt=""
                aria-hidden="true"
                className="player-dashboard__stat-icon"
              />
              <span className="player-dashboard__inv-value">{stats.totalCorrect}</span>
            </div>
            <span className="player-dashboard__inv-label">Rätt bedömning</span>
          </div>
          <div className="player-dashboard__inv-item">
            <div className="player-dashboard__inv-row">
              <img
                src="/images/StylingElements/stop.png"
                alt=""
                aria-hidden="true"
                className="player-dashboard__stat-icon"
              />
              <span className="player-dashboard__inv-value">{stats.totalFooled}</span>
            </div>
            <span className="player-dashboard__inv-label">Lurad</span>
          </div>
          <div className="player-dashboard__inv-item">
            <div className="player-dashboard__inv-row">
              <img
                src="/images/StylingElements/magnifying.png"
                alt=""
                aria-hidden="true"
                className="player-dashboard__stat-icon"
              />
              <span className="player-dashboard__inv-value">{stats.totalEvidenceFound}</span>
            </div>
            <span className="player-dashboard__inv-label">Bevis funna</span>
          </div>
        </div>
      </div>

      <div className="player-dashboard__badges">
        <span className="player-dashboard__badges-title">Märken</span>
        <div className="player-dashboard__badges-list">
          {BADGES.map((badge) => {
            const earned = stats.badges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`player-dashboard__badge${earned ? " player-dashboard__badge--earned" : ""}`}
                title={earned ? badge.label : `${badge.label} (låst)`}
              >
                <div className="player-dashboard__badge-seal">
                  <img src={badge.image} alt="" aria-hidden="true" className="player-dashboard__badge-img" />
                </div>
                <span className="player-dashboard__badge-label">{badge.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {!hasPlayed && <p className="player-dashboard__new-player">Redo för din första utredning, detektiv?</p>}
    </div>
  );
}
