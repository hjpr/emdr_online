import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import Decompression from './Decompression'
import PulseCheck from '../triage/PulseCheck'
import './Recall.css'

const Recall = () => {
    const { nextCheckpoint, saveRecallRating } = useApp()

    // State Machine
    // 'input': Describe Issue (Initial state)
    // 'processing': EMDR
    // 'post-rating': Rate (0-10) using PulseCheck
    // 'decision': Result check (Improvement? > New Issue or Affirmations)
    const [phase, setPhase] = useState('input')

    const [issueCount, setIssueCount] = useState(1) // Which unique issue are we on?
    const [roundCount, setRoundCount] = useState(1) // Round 1-3 for current issue

    const [preScore, setPreScore] = useState(null)
    const [issueText, setIssueText] = useState('')
    const [postScore, setPostScore] = useState(5)

    // Helper to reset for a new issue
    const startNewIssue = () => {
        setIssueCount(prev => prev + 1)
        setRoundCount(1)
        setPreScore(null)
        setPostScore(5)
        setIssueText('')
        setPhase('input')
    }

    // Handlers
    const handleSetupComplete = () => {
        if (!issueText.trim()) return
        setPhase('processing')
    }

    const handleProcessingComplete = () => {
        setPhase('post-rating')
    }

    const handlePostRatingComplete = (score) => {
        setPostScore(score)
        saveRecallRating(score)

        // Logic Check
        // Success if: score < 4 OR improved by >= 2 (if preScore exists)
        let isResolved = score < 4
        if (preScore !== null) {
            isResolved = isResolved || (preScore - score >= 2)
        }

        if (isResolved) {
            // Success! Ask if they want to do another issue
            setPhase('decision')
        } else {
            // Not resolved yet.
            if (roundCount < 3) {
                // Continue loop with SAME issue but ask for NEW input
                setRoundCount(prev => prev + 1)
                setPreScore(score) // Update baseline for next round
                setIssueText('') // Clear text for new input
                setPhase('input') // Go back to input
            } else {
                // Max rounds reached. Force decision.
                setPhase('decision')
            }
        }
    }

    const handleDecision = (choice) => {
        if (choice === 'new-issue') {
            startNewIssue()
        } else {
            // Affirmations
            nextCheckpoint()
        }
    }

    // Render Helpers
    const getSliderColor = (val) => {
        if (val <= 2) return '#4ade80'
        if (val <= 4) return '#22d3ee'
        if (val <= 6) return '#fbbf24'
        if (val <= 8) return '#fb923c'
        return '#ef4444'
    }

    const getInputTitle = () => {
        if (roundCount === 2) {
            return "What continues to stick out in your mind?"
        }
        if (roundCount === 3) {
            return "What continues to stay with you?"
        }
        return issueCount === 1 ? "Talk about what's been bothering you." : "What else is bothering you?"
    }

    const getInputSubtitle = () => {
        if (roundCount === 1 && issueCount === 1) {
            return "It may be from today or from the past."
        }
        if (roundCount === 2) {
            return "Think deeply and be descriptive."
        }
        if (roundCount === 3) {
            return "Try to describe why it stays with you."
        }
        return null
    }

    // Helper for decision text
    const getDecisionText = () => {
        const absoluteSuccess = postScore < 4
        const relativeSuccess = preScore !== null && (preScore - postScore >= 2)

        if (absoluteSuccess || relativeSuccess) {
            return "You've made good progress."
        }
        return "You've done heavy work."
    }

    return (
        <motion.div
            className="checkpoint recall-checkpoint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
        >
            <AnimatePresence mode="wait">
                {/* PHASE 1: INPUT (Describe Issue) */}
                {phase === 'input' && (
                    <motion.div
                        key="input"
                        className="recall-input-phase"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="checkpoint-title">
                            {getInputTitle()}
                        </h1>

                        {getInputSubtitle() && (
                            <p className="checkpoint-subtitle" style={{ marginTop: '0.5rem', marginBottom: '2rem' }}>
                                {getInputSubtitle()}
                            </p>
                        )}

                        <div className="input-area">
                            <textarea
                                className="recall-textarea"
                                value={issueText}
                                onChange={(e) => setIssueText(e.target.value)}
                                placeholder=""
                                autoFocus
                            />
                        </div>

                        <motion.button
                            className="reprocess-btn"
                            onClick={handleSetupComplete}
                            disabled={!issueText.trim()}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Start Processing
                        </motion.button>
                    </motion.div>
                )}

                {/* PHASE 2: PROCESSING (EMDR) */}
                {phase === 'processing' && (
                    <motion.div
                        key="processing"
                        className="processing-wrapper"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Decompression
                            onComplete={handleProcessingComplete}
                            // Skip instructions if it's not the very first round of the very first issue?
                            // Or skip after round 1 of ANY issue?
                            // User said "skip instructions after round 1". 
                            // Suggestion: Show instructions ONLY for Issue 1, Round 1.
                            skipInstructions={issueCount > 1 || roundCount > 1}
                        />
                    </motion.div>
                )}

                {/* PHASE 3: POST-RATING */}
                {phase === 'post-rating' && (
                    <motion.div
                        key="post-rating"
                        className="rating-wrapper"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <PulseCheck onComplete={handlePostRatingComplete} />
                    </motion.div>
                )}

                {/* PHASE 4: DECISION */}
                {phase === 'decision' && (
                    <motion.div
                        key="decision"
                        className="decision-phase"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="checkpoint-title">
                            {getDecisionText()}
                        </h2>
                        <p className="checkpoint-subtitle">
                            Do you want to process another specific issue?
                        </p>

                        <div className="decision-buttons">
                            <button
                                className="decision-btn primary"
                                onClick={() => handleDecision('new-issue')}
                            >
                                Yes, another issue
                            </button>
                            <button
                                className="decision-btn secondary"
                                onClick={() => handleDecision('anchor')}
                            >
                                No, I'm done
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
export default Recall
