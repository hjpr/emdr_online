import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import './PulseCheck.css'

const PulseCheck = ({ onComplete }) => {
    const { setSudsScore, nextCheckpoint, saveTriageRating, saveFinalRating, currentCheckpoint } = useApp()
    const [score, setScore] = useState(0)
    const [hasInteracted, setHasInteracted] = useState(false)



    const getColor = (value) => {
        if (value <= 2) return '#4ade80'
        if (value <= 4) return '#22d3ee'
        if (value <= 6) return '#fbbf24'
        if (value <= 8) return '#fb923c'
        return '#ef4444'
    }

    const handleSliderChange = (e) => {
        const value = parseInt(e.target.value)
        setScore(value)
        if (!hasInteracted) {
            setHasInteracted(true)
        }
    }

    const handleContinue = () => {
        if (onComplete) {
            onComplete(score)
        } else {
            setSudsScore(score)
            if (currentCheckpoint === 8) {
                saveFinalRating(score)
            } else {
                saveTriageRating(score)
            }
            // Pass score directly to avoid async state update issues
            nextCheckpoint(score)
        }
    }

    return (
        <motion.div
            className="checkpoint pulse-check"
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
                <h1 className="checkpoint-title">I'm feeling...</h1>
                <p className="checkpoint-subtitle">Slide between 0-10. 0 is calm, 10 is overwhelmed.</p>

                <div className="suds-container">
                    <div className="suds-display">
                        <motion.div
                            className="suds-score"
                            style={{ color: getColor(score) }}
                            key={score}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            {score}
                        </motion.div>

                    </div>

                    <div className="slider-container">
                        <input
                            type="range"
                            min="0"
                            max="10"
                            value={score}
                            onChange={handleSliderChange}
                            className="suds-slider"
                            style={{
                                background: `linear-gradient(to right, ${getColor(score)} 0%, ${getColor(
                                    score
                                )} ${score * 10}%, rgba(255,255,255,0.1) ${score * 10}%, rgba(255,255,255,0.1) 100%)`
                            }}
                        />
                    </div>
                </div>

                <motion.button
                    className="continue-btn"
                    onClick={handleContinue}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Continue
                </motion.button>
            </motion.div>
        </motion.div>
    )
}

export default PulseCheck
