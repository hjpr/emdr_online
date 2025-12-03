import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import './SafePlace.css'

const SafePlace = () => {
    const { safePlaceName, setSafePlaceName, setBackgroundColor, nextCheckpoint } = useApp()
    const [localName, setLocalName] = useState(safePlaceName || '')

    const handleContinue = () => {
        setSafePlaceName(localName)

        // Shift background color to calming tone
        setBackgroundColor('#0a1628') // Deep ocean blue

        setTimeout(() => {
            nextCheckpoint()
        }, 500)
    }

    return (
        <motion.div
            className="checkpoint safe-place"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="checkpoint-content">
                <h1 className="checkpoint-title">Your Safe Place</h1>
                <p className="checkpoint-subtitle">
                    Bring to mind a place where you feel calm and safe. <br />
                    It can be real or imagined. Let yourself be there.
                </p>

                <div className="safe-place-visual">
                    <motion.div
                        className="minds-eye-icon"
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.7, 1, 0.7]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                    >
                        ✨
                    </motion.div>
                </div>

                <div className="input-container">
                    <label htmlFor="safe-place-input" className="input-label">
                        What is this place? (Optional)
                    </label>
                    <input
                        id="safe-place-input"
                        type="text"
                        className="safe-place-input"
                        placeholder="The ocean, a forest, my room..."
                        value={localName}
                        onChange={(e) => setLocalName(e.target.value)}
                        maxLength={50}
                    />
                </div>

                <motion.button
                    className="continue-btn"
                    onClick={handleContinue}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    I'm there
                </motion.button>
            </div>
        </motion.div>
    )
}

export default SafePlace
