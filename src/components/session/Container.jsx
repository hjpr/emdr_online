import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import './Container.css'

const Container = () => {
    const { nextCheckpoint } = useApp()
    const [isOpen, setIsOpen] = useState(true)
    const [isPressed, setIsPressed] = useState(false)
    const [progress, setProgress] = useState(0)
    const [isLocked, setIsLocked] = useState(false)
    const longPressTimer = useRef(null)
    const progressInterval = useRef(null)

    const handlePressStart = () => {
        if (isLocked) return

        setIsPressed(true)
        const startTime = Date.now()
        const duration = 3000 // 3 seconds to close

        progressInterval.current = setInterval(() => {
            const elapsed = Date.now() - startTime
            const newProgress = Math.min((elapsed / duration) * 100, 100)
            setProgress(newProgress)

            if (newProgress >= 100) {
                clearInterval(progressInterval.current)
            }
        }, 16) // ~60fps

        longPressTimer.current = setTimeout(() => {
            handleLockContainer()
        }, duration)
    }

    const handlePressEnd = () => {
        if (isLocked) return

        setIsPressed(false)
        clearTimeout(longPressTimer.current)
        clearInterval(progressInterval.current)

        // Reset progress if not complete
        if (progress < 100) {
            setProgress(0)
        }
    }

    const handleLockContainer = () => {
        // Ensure progress circle completes
        clearInterval(progressInterval.current)
        setProgress(100)

        // Small delay to let the progress ring finish rendering
        setTimeout(() => {
            setIsOpen(false)
            setIsPressed(false)
            setIsLocked(true)

            // Wait for animation, then proceed
            setTimeout(() => {
                nextCheckpoint()
            }, 2000)
        }, 100) // 100ms delay to ensure progress ring completes visually
    }

    return (
        <motion.div
            className="checkpoint container-checkpoint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
        >
            <motion.div
                className="checkpoint-content"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                exit={{ y: 20 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="checkpoint-title">The Container</h1>
                <p className="checkpoint-subtitle">
                    Visualize the event or image bothering you. <br />
                    When you're ready, put it inside the container for safekeeping.
                </p>

                <div className="container-visual-area">
                    <AnimatePresence mode="wait">
                        {isLocked ? (
                            <motion.div
                                key="locked"
                                className="container-locked"
                                initial={{ scale: 1, opacity: 1 }}
                                animate={{ scale: 0, opacity: 0 }}
                                transition={{ duration: 1, ease: 'easeInOut' }}
                            >
                                <div className="container-box closed">
                                    <div className="container-lid closed" />
                                    <div className="container-body" />
                                    <motion.div
                                        className="padlock-icon"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        🔒
                                    </motion.div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="open"
                                className="container-interactive"
                                onMouseDown={handlePressStart}
                                onMouseUp={handlePressEnd}
                                onMouseLeave={handlePressEnd}
                                onTouchStart={handlePressStart}
                                onTouchEnd={handlePressEnd}
                            >
                                <div className={`container-box ${isPressed ? 'pressing' : ''}`}>
                                    <motion.div
                                        className="container-lid"
                                        animate={{
                                            rotateX: isPressed ? -60 + (progress / 100) * 60 : -60
                                        }}
                                        style={{ transformOrigin: 'bottom' }}
                                    >
                                        <div className="lid-top" />
                                    </motion.div>
                                    <div className="container-body" />
                                </div>

                                {/* Progress ring */}
                                {isPressed && (
                                    <svg className="progress-ring" viewBox="0 0 200 200">
                                        <circle
                                            className="progress-ring-bg"
                                            cx="100"
                                            cy="100"
                                            r="90"
                                            fill="none"
                                            stroke="rgba(255,255,255,0.1)"
                                            strokeWidth="4"
                                        />
                                        <motion.circle
                                            className="progress-ring-fill"
                                            cx="100"
                                            cy="100"
                                            r="90"
                                            fill="none"
                                            stroke="url(#gradient)"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: progress / 100 }}
                                            style={{
                                                transform: 'rotate(-90deg)',
                                                transformOrigin: 'center'
                                            }}
                                        />
                                        <defs>
                                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#22d3ee" />
                                                <stop offset="100%" stopColor="#a855f7" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {!isLocked && (
                    <motion.p
                        className="instruction-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Hold to close the lid and lock it away
                    </motion.p>
                )}
            </motion.div>
        </motion.div>
    )
}

export default Container
