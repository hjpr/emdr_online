import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import './Decompression.css'

const Decompression = ({ onComplete, skipInstructions }) => {
    const { nextCheckpoint } = useApp()
    const [phase, setPhase] = useState(skipInstructions ? 'active' : 'instructions') // 'instructions' | 'active'
    const [timeRemaining, setTimeRemaining] = useState(15)
    const [ballPosition, setBallPosition] = useState(0)

    // Phase 1: Instructions (4 seconds)
    useEffect(() => {
        if (phase === 'instructions') {
            const timer = setTimeout(() => {
                setPhase('active')
            }, 4000)
            return () => clearTimeout(timer)
        }
    }, [phase])

    // Phase 2: Active (Timer countdown)
    useEffect(() => {
        if (phase !== 'active') return

        if (timeRemaining <= 0) {
            setTimeout(() => {
                if (onComplete) {
                    onComplete()
                } else {
                    nextCheckpoint()
                }
            }, 1000)
            return
        }

        const timer = setInterval(() => {
            setTimeRemaining((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [phase, timeRemaining, nextCheckpoint, onComplete])

    // Phase 2: Active (Ball animation)
    useEffect(() => {
        if (phase !== 'active') return

        const duration = 1000 // 1 second per pass
        const startTime = Date.now()

        const animate = () => {
            const elapsed = Date.now() - startTime
            const cycle = (elapsed % duration) / duration
            // Smooth sine wave for natural movement
            const position = (Math.sin(cycle * Math.PI * 2 - Math.PI / 2) + 1) / 2
            setBallPosition(position)

            // Haptic feedback at edge if supported
            if (
                cycle < 0.02 &&
                navigator.vibrate &&
                elapsed > 100 // Avoid vibrating immediately
            ) {
                // navigator.vibrate(50) // Optional: uncomment if requested
            }

            requestAnimationFrame(animate)
        }

        const animationFrame = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(animationFrame)
    }, [phase])

    return (
        <motion.div
            className="checkpoint decompression"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="decompression-container">
                <AnimatePresence mode="wait">
                    {phase === 'instructions' ? (
                        <motion.div
                            key="instructions"
                            className="instructions-overlay"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <p className="instruction-text">
                                Follow the ball with your eyes. <br />
                                Tap your feet left and right if you can. <br />
                                Just breathe.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="ball-track"
                            className="ball-track"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.div
                                className="bilateral-ball"
                                style={{
                                    left: `${ballPosition * 100}%`
                                }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}

export default Decompression
