import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import './Decompression.css'

const Decompression = () => {
    const { nextCheckpoint } = useApp()
    const [showInstructions, setShowInstructions] = useState(true)
    const [timeRemaining, setTimeRemaining] = useState(15)
    const [ballPosition, setBallPosition] = useState(0)

    // Hide instructions after 5 seconds
    useEffect(() => {
        const instructionTimer = setTimeout(() => {
            setShowInstructions(false)
        }, 5000)

        return () => clearTimeout(instructionTimer)
    }, [])

    // Timer countdown
    useEffect(() => {
        if (timeRemaining <= 0) {
            setTimeout(() => {
                nextCheckpoint()
            }, 1000)
            return
        }

        const timer = setInterval(() => {
            setTimeRemaining((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [timeRemaining, nextCheckpoint])

    // Ball animation position (0 to 1, repeating)
    useEffect(() => {
        const duration = 1000 // 1 second per pass
        const startTime = Date.now()

        const animate = () => {
            const elapsed = Date.now() - startTime
            const cycle = (elapsed % duration) / duration
            // Smooth sine wave for natural movement
            const position = (Math.sin(cycle * Math.PI * 2 - Math.PI / 2) + 1) / 2
            setBallPosition(position)

            // Haptic feedback at edge
            if (
                cycle < 0.02 &&
                navigator.vibrate &&
                elapsed > 100 // Avoid vibrating immediately on mount
            ) {
                navigator.vibrate(50)
            }

            requestAnimationFrame(animate)
        }

        const animationFrame = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(animationFrame)
    }, [])

    return (
        <motion.div
            className="checkpoint decompression"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="decompression-container">
                {showInstructions && (
                    <motion.div
                        className="instructions-overlay"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <p className="instruction-text">
                            Follow the ball with your eyes. <br />
                            Tap your feet left and right if you can. <br />
                            Just breathe.
                        </p>
                    </motion.div>
                )}

                <div className="ball-track">
                    <motion.div
                        className="bilateral-ball"
                        style={{
                            left: `${ballPosition * 100}%`
                        }}
                    />
                </div>

                <div className="timer-display">
                    {timeRemaining}s
                </div>
            </div>
        </motion.div>
    )
}

export default Decompression
