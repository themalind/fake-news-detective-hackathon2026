import { useGame } from '../context/GameContext'
import { CASES } from '../data/cases'
import Header from '../components/Header'
import './SummaryPage.scss'

function getRank(score: number): string {
  if (score >= 30000) return 'Legendär Faktagranskare'
  if (score >= 20000) return 'Sanningens väktare'
  if (score >= 12000) return 'Mästerspion'
  if (score >= 7500) return 'Elitdetektiv'
  if (score >= 4500) return 'Chefdetektiv'
  if (score >= 2500) return 'Desinformationsdetektiv'
  if (score >= 1200) return 'Rubrikjägare'
  if (score >= 500) return 'Källsniffare'
  return 'Junior Skeptiker'
}

function getRankBadge(score: number): string {
  if (score >= 30000) return '👑'
  if (score >= 20000) return '✦✦✦'
  if (score >= 12000) return '✦✦★'
  if (score >= 7500) return '✦★★'
  if (score >= 4500) return '★★★'
  if (score >= 2500) return '★★☆'
  if (score >= 1200) return '★☆☆'
  if (score >= 500) return '◈◈◇'
  return '◈◇◇'
}

export default function SummaryPage() {
  const { state, dispatch } = useGame()
  const { score, maxStreak, results } = state

  const correctCount = results.filter((r) => r.isCorrect).length
  const accuracy = results.length > 0
    ? Math.round((correctCount / results.length) * 100)
    : 0
  const rank = getRank(score)
  const badge = getRankBadge(score)

  return (
    <>
      <Header onLogoClick={() => dispatch({ type: 'RESTART' })} />
      <main className="summary-page">
      <div className="summary-page__card">
        <div className="summary-page__badge">{badge}</div>
        <h1 className="summary-page__rank">{rank}</h1>
        <p className="summary-page__score-label">SLUTPOÄNG</p>
        <p className="summary-page__score">{score} XP</p>

        <div className="summary-page__stats">
          <div className="summary-stat">
            <span className="summary-stat__value">{correctCount}/{results.length}</span>
            <span className="summary-stat__label">Fall lösta</span>
          </div>
          <div className="summary-stat">
            <span className="summary-stat__value">{accuracy}%</span>
            <span className="summary-stat__label">Träffsäkerhet</span>
          </div>
          <div className="summary-stat">
            <span className="summary-stat__value">&#128293; {maxStreak}</span>
            <span className="summary-stat__label">Bästa streak</span>
          </div>
        </div>

        <div className="summary-page__cases">
          <div className="summary-page__cases-col">
            <h3 className="summary-page__cases-heading summary-page__cases-heading--correct">Lösta fall</h3>
            {results.filter((r) => r.isCorrect).map((result) => {
              const c = CASES.find((cas) => cas.id === result.caseId)
              return (
                <div key={result.caseId} className="summary-case summary-case--correct">
                  <span className="summary-case__icon">✓</span>
                  <span className="summary-case__headline">{c?.headline}</span>
                  <span className="summary-case__score">+{result.scoreGained} XP</span>
                </div>
              )
            })}
          </div>
          <div className="summary-page__cases-col">
            <h3 className="summary-page__cases-heading summary-page__cases-heading--wrong">Missade fall</h3>
            {results.filter((r) => !r.isCorrect).map((result) => {
              const c = CASES.find((cas) => cas.id === result.caseId)
              return (
                <div key={result.caseId} className="summary-case summary-case--wrong">
                  <span className="summary-case__icon">✗</span>
                  <span className="summary-case__headline">{c?.headline}</span>
                  <span className="summary-case__score">{result.scoreGained} XP</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="summary-page__actions">
          <button
            className="summary-page__restart"
            onClick={() => dispatch({ type: 'RESTART' })}
          >
            UTRED IGEN
          </button>
          <button
            className="summary-page__dashboard"
            onClick={() => dispatch({ type: 'RESTART' })}
          >
            TILL DASHBOARD
          </button>
        </div>
      </div>
    </main>
    </>
  )
}
