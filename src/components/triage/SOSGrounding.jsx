import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import './SOSGrounding.css'

const SOSGrounding = () => {
    const { nextCheckpoint } = useApp()
    const [introStep, setIntroStep] = useState(0) // 0: Pause, 1: Follow sphere, 2: Start breathing
    const [breathPhase, setBreathPhase] = useState('inhale') // inhale, hold, exhale
    const [cycleCount, setCycleCount] = useState(0)
    const [isComplete, setIsComplete] = useState(false)

    const totalCycles = 3

    const phaseDurations = {
        inhale: 4000,
        hold: 2000,
        exhale: 4000
    }

    useEffect(() => {
        // Intro sequence
        if (introStep < 2) {
            const timer = setTimeout(() => {
                setIntroStep(prev => prev + 1)
            }, 3000)
            return () => clearTimeout(timer)
        }

        // Breathing logic (only starts after introStep === 2)
        if (cycleCount >= totalCycles && !isComplete) {
            setIsComplete(true)
        }

        const phaseSequence = ['inhale', 'hold', 'exhale']
        let currentPhaseIndex = phaseSequence.indexOf(breathPhase)
        const currentDuration = phaseDurations[breathPhase]

        const timer = setTimeout(() => {
            currentPhaseIndex = (currentPhaseIndex + 1) % phaseSequence.length
            setBreathPhase(phaseSequence[currentPhaseIndex])

            // Increment cycle count after completing exhale phase
            if (phaseSequence[currentPhaseIndex] === 'inhale' && currentPhaseIndex === 0) {
                setCycleCount((prev) => prev + 1)
            }
        }, currentDuration)

        return () => clearTimeout(timer)
    }, [breathPhase, cycleCount, isComplete, introStep])

    const getPhaseText = () => {
        if (breathPhase === 'inhale') return 'Breathe in...'
        if (breathPhase === 'hold') return 'Hold...'
        return 'Breathe out...'
    }

    const getSphereScale = () => {
        if (breathPhase === 'inhale') return 1.5
        if (breathPhase === 'hold') return 1.5
        return 0.8
    }

    const getBackgroundColor = () => {
        // Always dark during intro
        if (introStep < 2) return 'hsl(240, 15%, 8%)'

        if (breathPhase === 'inhale' || breathPhase === 'hold') {
            return 'hsl(240, 15%, 14%)' // Lighter during inhale/hold
        }
        return 'hsl(240, 15%, 8%)' // Dark during exhale
    }

    return (
        <motion.div
            className="checkpoint sos-grounding"
            initial={{ opacity: 0, backgroundColor: 'hsl(240, 15%, 8%)' }}
            animate={{
                opacity: 1,
                backgroundColor: getBackgroundColor()
            }}
            exit={{ opacity: 0 }}
            transition={{
                duration: 0.6,
                backgroundColor: {
                    duration: phaseDurations[breathPhase] / 1000,
                    ease: 'easeInOut'
                }
            }}
        >
            <div className="checkpoint-content">
                <AnimatePresence mode="wait">
                    {introStep === 0 && (
                        <motion.div
                            key="intro-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="intro-text-container"
                        >
                            <h1 className="checkpoint-title">Let's pause and take a few breaths...</h1>
                        </motion.div>
                    )}

                    {introStep === 1 && (
                        <motion.div
                            key="intro-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="intro-text-container"
                        >
                            <h1 className="checkpoint-title">Follow the sphere, breathe with it. You're safe.</h1>
                        </motion.div>
                    )}

                    {introStep === 2 && (
                        <motion.div
                            key="breathing-exercise"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                            className="breathing-content"
                        >

                            <div className="breathing-container">
                                <motion.div
                                    className="breathing-sphere"
                                    animate={{
                                        scale: getSphereScale(),
                                        opacity: breathPhase === 'hold' ? 1 : 0.8
                                    }}
                                    transition={{
                                        duration: phaseDurations[breathPhase] / 1000,
                                        ease: 'easeInOut'
                                    }}
                                />

                                <motion.div
                                    className="breath-text"
                                    key={breathPhase}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {getPhaseText()}
                                </motion.div>
                            </div>

                            <div className="action-buttons">
                                <motion.button
                                    className="continue-btn"
                                    onClick={nextCheckpoint}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: isComplete ? 1 : 0 }}
                                    transition={{ duration: 5, ease: "easeIn" }}
                                    style={{ pointerEvents: isComplete ? 'auto' : 'none' }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    I feel steady enough to proceed
                                </motion.button>

                                <motion.a
                                    href="https://dbh.dc.gov/service/access-helpline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="crisis-btn"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: cycleCount >= 10 ? 1 : 0 }}
                                    transition={{ duration: 2, ease: "easeIn" }}
                                    style={{
                                        pointerEvents: cycleCount >= 10 ? 'auto' : 'none',
                                        textDecoration: 'none'
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    I need professional help now
                                </motion.a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}

export default SOSGrounding
