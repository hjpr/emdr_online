import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './LoadingScreen.css'
import refinedAf from '../assets/intro/refined_af.png'
import refinedAm from '../assets/intro/refined_am.png'
import refinedBf from '../assets/intro/refined_bf.png'
import refinedWm from '../assets/intro/refined_wm.png'

const LoadingScreen = () => {
    const images = [
        refinedAf,
        refinedAm,
        refinedBf,
        refinedWm
    ]

    // Duration for each image in milliseconds
    const DISPLAY_DURATION = 1000
    // Transition duration in seconds (for framer-motion)
    const TRANSITION_DURATION = 2

    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
        }, DISPLAY_DURATION + (TRANSITION_DURATION * 1000))

        return () => clearInterval(timer)
    }, [])

    return (
        <motion.div
            className="loading-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
        >
            <div className="loading-content">
                <div className="image-container">
                    <AnimatePresence mode="popLayout">
                        <motion.img
                            key={currentIndex}
                            src={images[currentIndex]}
                            alt="Loading..."
                            className="loading-image"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: TRANSITION_DURATION }}
                        />
                    </AnimatePresence>
                </div>
                <div className="loading-spinner"></div>
            </div>
        </motion.div>
    )
}

export default LoadingScreen
