import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import './Disclaimer.css'

const Disclaimer = () => {
    const { nextCheckpoint } = useApp()
    const [isChecked, setIsChecked] = useState(false)
    const [showTransition, setShowTransition] = useState(false)

    const handleContinue = () => {
        setShowTransition(true)
        setTimeout(() => {
            nextCheckpoint()
        }, 3000)
    }

    return (
        <motion.div
            className="checkpoint disclaimer-checkpoint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
        >
            <AnimatePresence mode="wait">
                {!showTransition ? (
                    <motion.div
                        key="content"
                        className="checkpoint-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div
                            className="disclaimer-box"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        >
                            <h2 className="disclaimer-title">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="disclaimer-icon">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                Important Notice
                            </h2>
                            <p className="disclaimer-text">
                                This is a self-guided tool designed to help nurses approach everyday hardships.
                                <strong> It is not a replacement for professional counseling or therapy.</strong>
                            </p>
                            <p className="disclaimer-text">
                                If you are in crisis, please call a professional or visit the nearest emergency room immediately.
                            </p>

                            <div className="checkbox-container">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={(e) => setIsChecked(e.target.checked)}
                                        className="disclaimer-checkbox"
                                    />
                                    <span className="checkbox-text">I understand and wish to proceed</span>
                                </label>
                            </div>
                        </motion.div>

                        <motion.button
                            className="continue-btn"
                            onClick={handleContinue}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isChecked ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ pointerEvents: isChecked ? 'auto' : 'none' }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Continue
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="transition"
                        className="checkpoint-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }} // Slower fade in
                        style={{ justifyContent: 'center', height: '100%' }}
                    >
                        <h2 className="checkpoint-title" style={{ maxWidth: '800px', lineHeight: 1.4 }}>
                            Let's get a sense of how you are feeling right now.
                        </h2>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default Disclaimer
