import { CASES } from '../data/cases'
import './PlayerDashboard.scss'
import type { PlayerStats } from '../types/game'

const RANKS = [
  { name: 'Junior Skeptiker',         min: 0,   max: 199  },
  { name: 'Källsniffare',             min: 200, max: 399  },
  { name: 'Rubrikjägare',             min: 400, max: 599  },
  { name: 'Desinformationsdetektiv',  min: 600, max: 799  },
  { name: 'Chefdetektiv',             min: 800, max: 1200 },
]

const BADGES = [
  { id: 'forsta-fallet', label: 'Första fallet', emoji: '🔍' },
  { id: 'streakjagaren', label: 'Streakjägaren',  emoji: '⚡' },
  { id: 'bevissamlaren', label: 'Bevissamlaren',  emoji: '🗂️' },
  { id: 'skarpskytten',  label: 'Skarpskytten',   emoji: '🎯' },
  { id: 'veteranen',     label: 'Veteran',         emoji: '🏅' },
]

function getRank(score: number) {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (score >= RANKS[i].min) return { rank: RANKS[i], index: i }
  }
  return { rank: RANKS[0], index: 0 }
}

function getRankProgress(score: number) {
  const { rank, index } = getRank(score)
  if (index === RANKS.length - 1) return 100
  const progress = score - rank.min
  const range = rank.max - rank.min + 1
  return Math.min(100, Math.round((progress / range) * 100))
}

const MOCK_STATS: PlayerStats = {
  totalGames: 12,
  totalCorrect: 47,
  totalFooled: 13,
  totalEvidenceFound: 84,
  bestStreak: 7,
  lastStreak: 4,
  totalScore: 520,
  badges: ['forsta-fallet', 'streakjagaren', 'bevissamlaren'],
}

export default function PlayerDashboard() {
  const stats = MOCK_STATS
  const { rank } = getRank(stats.totalScore)
  const rankProgress = getRankProgress(stats.totalScore)
  const hasPlayed = stats.totalGames > 0
  const accuracy = hasPlayed
    ? Math.round((stats.totalCorrect / (stats.totalGames * CASES.length)) * 100)
    : null

  return (
    <div className="player-dashboard">
      <span className="player-dashboard__corner player-dashboard__corner--tl" aria-hidden="true">✦</span>
      <span className="player-dashboard__corner player-dashboard__corner--tr" aria-hidden="true">✦</span>
      <span className="player-dashboard__corner player-dashboard__corner--bl" aria-hidden="true">✦</span>
      <span className="player-dashboard__corner player-dashboard__corner--br" aria-hidden="true">✦</span>

      <div className="player-dashboard__dossier">
        <span className="player-dashboard__dossier-label">Dossier · Detektiv</span>
        <span className="player-dashboard__dossier-rule" aria-hidden="true" />
      </div>

      <div className="player-dashboard__top">
        <div className="player-dashboard__profile">
          <div className="player-dashboard__avatar">🕵️</div>
          <div className="player-dashboard__rank-info">
            <span className="player-dashboard__rank-name">{rank.name}</span>
            <div className="player-dashboard__rank-bar" role="progressbar" aria-valuenow={rankProgress} aria-valuemin={0} aria-valuemax={100}>
              <div className="player-dashboard__rank-bar-fill" style={{ width: `${rankProgress}%` }} />
            </div>
            <span className="player-dashboard__rank-score">{stats.totalScore} poäng</span>
          </div>
        </div>

        <div className="player-dashboard__key-stats">
        <div className="player-dashboard__stat">
          <div className="player-dashboard__stat-row">
            <span aria-hidden="true">🔥</span>
            <span className="player-dashboard__stat-value">{stats.lastStreak}</span>
          </div>
          <span className="player-dashboard__stat-label">Streak</span>
        </div>
        <div className="player-dashboard__stat">
          <div className="player-dashboard__stat-row">
            <span aria-hidden="true">⭐</span>
            <span className="player-dashboard__stat-value">{stats.bestStreak}</span>
          </div>
          <span className="player-dashboard__stat-label">Rekord</span>
        </div>
        <div className="player-dashboard__stat">
          <div className="player-dashboard__stat-row">
            <span aria-hidden="true">🎯</span>
            <span className="player-dashboard__stat-value">{accuracy !== null ? `${accuracy}%` : '–'}</span>
          </div>
          <span className="player-dashboard__stat-label">Träffsäkerhet</span>
        </div>
      </div>
      </div>

      <div className="player-dashboard__investigation">
        <div className="player-dashboard__inv-grid">
          <div className="player-dashboard__inv-item">
            <div className="player-dashboard__inv-row">
              <span aria-hidden="true">📁</span>
              <span className="player-dashboard__inv-value">{stats.totalGames}</span>
            </div>
            <span className="player-dashboard__inv-label">Utredningar</span>
          </div>
          <div className="player-dashboard__inv-item">
            <div className="player-dashboard__inv-row">
              <span aria-hidden="true">✅</span>
              <span className="player-dashboard__inv-value">{stats.totalCorrect}</span>
            </div>
            <span className="player-dashboard__inv-label">Rätt bedömning</span>
          </div>
          <div className="player-dashboard__inv-item">
            <div className="player-dashboard__inv-row">
              <span aria-hidden="true">🚫</span>
              <span className="player-dashboard__inv-value">{stats.totalFooled}</span>
            </div>
            <span className="player-dashboard__inv-label">Lurad</span>
          </div>
          <div className="player-dashboard__inv-item">
            <div className="player-dashboard__inv-row">
              <span aria-hidden="true">🔍</span>
              <span className="player-dashboard__inv-value">{stats.totalEvidenceFound}</span>
            </div>
            <span className="player-dashboard__inv-label">Bevis funna</span>
          </div>
        </div>
      </div>

      <div className="player-dashboard__badges">
        <span className="player-dashboard__badges-title">🏆 Märken</span>
        <div className="player-dashboard__badges-list">
          {BADGES.map(badge => {
            const earned = stats.badges.includes(badge.id)
            return (
              <div
                key={badge.id}
                className={`player-dashboard__badge${earned ? ' player-dashboard__badge--earned' : ''}`}
                title={earned ? badge.label : `${badge.label} (låst)`}
              >
                <div className="player-dashboard__badge-seal">
                  <span className="player-dashboard__badge-emoji">{badge.emoji}</span>
                </div>
                <span className="player-dashboard__badge-label">{badge.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {!hasPlayed && (
        <p className="player-dashboard__new-player">
          Redo för din första utredning, detektiv?
        </p>
      )}
    </div>
  )
}
