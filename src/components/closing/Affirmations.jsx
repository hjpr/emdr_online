import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import './Affirmations.css'

const allAffirmations = [
    "I leave what no longer serves me in the past.",
    "I deserve the same kindness I give to others, and I extend that kindness to myself.",
    "I am capable of facing any challenges that come my way.",
    "Let go of what was, accept what is.",
    "I have courage and confidence to do the right thing.",
    "I choose positivity. I choose happiness. I see both all around me.",
    "Not everybody will understand my situation and it is okay. ",
    "Peace comes from within. Do not seek it without.",
    "Quiet the mind, and the soul will speak.",
    "I am not what happened to me, I am what I choose to become.",
    "I am open to new experiences and challenges, which help me grow and learn. ",
    "I have survived my anxiety before and I will survive it again now. "
]

const Affirmations = () => {
    const { nextCheckpoint } = useApp()

    // Select 4 random unique affirmations on mount
    const [affirmations] = useState(() => {
        const shuffled = [...allAffirmations].sort(() => 0.5 - Math.random())
        return shuffled.slice(0, 4)
    })

    const [currentIndex, setCurrentIndex] = useState(0)
    const [isHolding, setIsHolding] = useState(false)
    const [progress, setProgress] = useState(0)
    const [isComplete, setIsComplete] = useState(false)

    const holdTimer = useRef(null)
    const progressInterval = useRef(null)

    const handleHoldStart = () => {
        if (isComplete) return

        setIsHolding(true)
        const startTime = Date.now()
        const duration = 5000 // 5 seconds

        progressInterval.current = setInterval(() => {
            const elapsed = Date.now() - startTime
            const newProgress = Math.min((elapsed / duration) * 100, 100)
            setProgress(newProgress)

            if (newProgress >= 100) {
                clearInterval(progressInterval.current)
            }
        }, 16)

        holdTimer.current = setTimeout(() => {
            handleAffirmationComplete()
        }, duration)
    }

    const handleHoldEnd = () => {
        if (isComplete) return

        setIsHolding(false)
        clearTimeout(holdTimer.current)
        clearInterval(progressInterval.current)

        if (progress < 100) {
            setProgress(0)
        }
    }

    const handleAffirmationComplete = () => {
        setIsComplete(true)
        setProgress(100)

        setTimeout(() => {
            if (currentIndex < affirmations.length - 1) {
                // Next affirmation
                setIsHolding(false)
                setProgress(0)
                setIsComplete(false)
                setCurrentIndex(prev => prev + 1)
            } else {
                // All done
                setTimeout(() => {
                    nextCheckpoint()
                }, 1000)
            }
        }, 1500) // Delay before next affirmation
    }

    return (
        <motion.div
            className="checkpoint affirmations-checkpoint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="checkpoint-content">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        className="affirmation-container"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="affirmation-text">{affirmations[currentIndex]}</p>
                    </motion.div>
                </AnimatePresence>

                <motion.div
                    className="hold-button-container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    <div
                        className={`hold-button ${isHolding ? 'holding' : ''} ${isComplete ? 'complete' : ''}`}
                        onMouseDown={handleHoldStart}
                        onMouseUp={handleHoldEnd}
                        onMouseLeave={handleHoldEnd}
                        onTouchStart={handleHoldStart}
                        onTouchEnd={handleHoldEnd}
                    >
                        <svg className="hold-progress-ring" viewBox="0 0 100 100">
                            <circle
                                className="hold-progress-bg"
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="rgba(255,255,255,0.2)"
                                strokeWidth="2"
                            />
                            <motion.circle
                                className="hold-progress-fill"
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="white"
                                strokeWidth="3"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: progress / 100 }}
                                style={{
                                    transform: 'rotate(-90deg)',
                                    transformOrigin: 'center'
                                }}
                            />
                        </svg>
                        <span className="hold-text">
                            {isComplete ? '✓' : 'Hold to Absorb'}
                        </span>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default Affirmations
