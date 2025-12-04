import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import './Intro.css'

const Intro = () => {
    const { nextCheckpoint } = useApp()
    const [step, setStep] = useState(0)

    useEffect(() => {
        // Step 0: "I just had a hard day..." (0-4s)
        // Step 1: "Before I go home" (4-8s)
        // Step 2: Transition to next checkpoint (8s)

        const timer1 = setTimeout(() => {
            setStep(1)
        }, 6000)

        const timer2 = setTimeout(() => {
            nextCheckpoint()
        }, 12000)

        return () => {
            clearTimeout(timer1)
            clearTimeout(timer2)
        }
    }, [nextCheckpoint])

    return (
        <motion.div
            className="checkpoint intro-checkpoint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
        >
            <div className="checkpoint-content">
                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.div
                            key="step-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                            className="intro-text-group"
                        >
                            <h1 className="intro-title">I just went through something.</h1>
                            <motion.p
                                className="intro-title"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 3, duration: 1 }}
                            >
                                I'm going to take a moment to breathe...
                            </motion.p>
                        </motion.div>
                    )}

                    {step === 1 && (
                        <motion.div
                            key="step-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                            className="intro-text-group"
                        >
                            <h1 className="intro-title large">Before I go home.</h1>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}

export default Intro
