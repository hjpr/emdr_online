import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import './Anchor.css'

const affirmations = [
    'I did my best today',
    'I am safe now',
    'That moment is over',
    'I showed up when it mattered',
    'I am more than this moment',
    'I deserve peace and rest'
]

const Anchor = () => {
    const { nextCheckpoint } = useApp()
    const [affirmation] = useState(() => {
        return affirmations[Math.floor(Math.random() * affirmations.length)]
    })
    const [isHolding, setIsHolding] = useState(false)
    const [progress, setProgress] = useState(0)
    const [isComplete, setIsComplete] = useState(false)
    const holdTimer = useRef(null)
    const progressInterval = useRef(null)

    const handleHoldStart = () => {
        if (isComplete) return

        setIsHolding(true)
        const startTime = Date.now()
        const duration = 3000 // 3 seconds

        progressInterval.current = setInterval(() => {
            const elapsed = Date.now() - startTime
            const newProgress = Math.min((elapsed / duration) * 100, 100)
            setProgress(newProgress)

            if (newProgress >= 100) {
                clearInterval(progressInterval.current)
            }
        }, 16)

        holdTimer.current = setTimeout(() => {
            setIsComplete(true)
            setTimeout(() => {
                nextCheckpoint()
            }, 1000)
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

    return (
        <motion.div
            className="checkpoint anchor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="checkpoint-content">
                <motion.div
                    className="affirmation-container"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                >
                    <p className="affirmation-text">{affirmation}</p>
                </motion.div>

                <motion.div
                    className="hold-button-container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                >
                    <div
                        className={`hold-button ${isHolding ? 'holding' : ''} ${isComplete ? 'complete' : ''
                            }`}
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
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="2"
                            />
                            <motion.circle
                                className="hold-progress-fill"
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="url(#hold-gradient)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: progress / 100 }}
                                style={{
                                    transform: 'rotate(-90deg)',
                                    transformOrigin: 'center'
                                }}
                            />
                            <defs>
                                <linearGradient id="hold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#22d3ee" />
                                    <stop offset="100%" stopColor="#a855f7" />
                                </linearGradient>
                            </defs>
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

export default Anchor
