import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import './SessionExplanation.css'

const SessionExplanation = () => {
    const { nextCheckpoint } = useApp()
    const [step, setStep] = useState(0)

    const messages = [
        "During this session you will be asked to recall stressful events.",
        "After your recollection there will be a series of visual stimulations.",
        "These stimulations are designed to reprocess your memory.",
        "Let's begin..."
    ]

    useEffect(() => {
        // Display each message for 5 seconds
        // (1s fade in, 3s read, 1s fade out implicit in transition)
        const duration = 5000

        const timer = setInterval(() => {
            setStep((prevStep) => {
                if (prevStep < messages.length - 1) {
                    return prevStep + 1
                } else {
                    clearInterval(timer)
                    // After last message, wait a brief moment and move on
                    setTimeout(() => nextCheckpoint(), 1000)
                    return prevStep
                }
            })
        }, duration)

        return () => {
            clearInterval(timer)
        }
    }, [nextCheckpoint, messages.length])

    return (
        <motion.div
            className="checkpoint session-explanation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
        >
            <div className="explanation-content">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={step}
                        className="explanation-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {messages[step]}
                    </motion.p>
                </AnimatePresence>
            </div>
        </motion.div>
    )
}

export default SessionExplanation
