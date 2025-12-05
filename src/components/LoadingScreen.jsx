import { motion } from 'framer-motion'
import './LoadingScreen.css'
import introImage from '../assets/intro_scene.png'

const LoadingScreen = () => {
    return (
        <motion.div
            className="loading-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
        >
            <div className="loading-content">
                <motion.img
                    src={introImage}
                    alt="Loading..."
                    className="loading-image"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                />
                <div className="loading-spinner"></div>
            </div>
        </motion.div>
    )
}

export default LoadingScreen
