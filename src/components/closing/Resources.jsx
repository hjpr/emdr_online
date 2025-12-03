import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import './Resources.css'

const Resources = () => {
    const { goToCheckpoint, resetSession } = useApp()

    const handleRepeatDecompression = () => {
        goToCheckpoint(4) // Go back to Decompression
    }

    const handleEndSession = () => {
        resetSession()
    }

    return (
        <motion.div
            className="checkpoint resources"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="checkpoint-content">
                <h1 className="checkpoint-title">You've completed one cycle</h1>
                <p className="checkpoint-subtitle">
                    Take a moment. Notice how you're feeling. <br />
                    What would serve you best right now?
                </p>

                <div className="resources-grid">
                    <motion.button
                        className="resource-btn repeat-btn"
                        onClick={handleRepeatDecompression}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <span className="btn-icon">🔄</span>
                        <span className="btn-label">Repeat Decompression</span>
                        <span className="btn-description">Do another 60-second bilateral session</span>
                    </motion.button>

                    <motion.div
                        className="crisis-resources"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h3 className="section-title">Need More Support?</h3>
                        <div className="crisis-links">
                            <a
                                href="tel:988"
                                className="crisis-link"
                            >
                                <span className="link-icon">📞</span>
                                <span className="link-text">
                                    <strong>988 Suicide & Crisis Lifeline</strong>
                                    <small>Call or text: 988</small>
                                </span>
                            </a>
                            <a
                                href="tel:1-800-985-5990"
                                className="crisis-link"
                            >
                                <span className="link-icon">💬</span>
                                <span className="link-text">
                                    <strong>SAMHSA Disaster Distress Helpline</strong>
                                    <small>1-800-985-5990</small>
                                </span>
                            </a>
                            <a
                                href="https://www.crisistextline.org"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="crisis-link"
                            >
                                <span className="link-icon">✉️</span>
                                <span className="link-text">
                                    <strong>Crisis Text Line</strong>
                                    <small>Text HOME to 741741</small>
                                </span>
                            </a>
                        </div>
                    </motion.div>

                    <motion.button
                        className="resource-btn end-btn"
                        onClick={handleEndSession}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <span className="btn-icon">→</span>
                        <span className="btn-label">End Session</span>
                        <span className="btn-description">Return to the beginning</span>
                    </motion.button>
                </div>

                <motion.p
                    className="closing-message"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    You showed up for yourself today. That matters.
                </motion.p>
            </div>
        </motion.div>
    )
}

export default Resources
