import { createContext, useContext, useState } from 'react'

const AppContext = createContext()

export const useApp = () => {
    const context = useContext(AppContext)
    if (!context) {
        throw new Error('useApp must be used within AppProvider')
    }
    return context
}

export const AppProvider = ({ children }) => {
    const [sudsScore, setSudsScore] = useState(null)
    const [currentCheckpoint, setCurrentCheckpoint] = useState(1)
    const [safePlaceName, setSafePlaceName] = useState('')
    const [backgroundColor, setBackgroundColor] = useState('#0f0f14')

    // Determine current stage based on checkpoint
    const getCurrentStage = () => {
        if (currentCheckpoint === 1 || currentCheckpoint === 1.5) return 'triage'
        if (currentCheckpoint >= 2 && currentCheckpoint <= 4) return 'session'
        if (currentCheckpoint >= 5 && currentCheckpoint <= 6) return 'closing'
        return 'triage'
    }

    // Navigate to next checkpoint with conditional logic
    // scoreOverride allows passing the score directly to avoid async state issues
    const nextCheckpoint = (scoreOverride = null) => {
        const effectiveScore = scoreOverride !== null ? scoreOverride : sudsScore

        if (currentCheckpoint === 1) {
            // Check SUDS score for conditional routing
            if (effectiveScore !== null && effectiveScore >= 7) {
                setCurrentCheckpoint(1.5) // Go to SOS Grounding
            } else {
                setCurrentCheckpoint(2) // Skip to Container
            }
        } else if (currentCheckpoint === 1.5) {
            setCurrentCheckpoint(2) // After grounding, go to Container
        } else if (currentCheckpoint === 4 && currentCheckpoint < 5) {
            // Normal progression
            setCurrentCheckpoint(currentCheckpoint + 1)
        } else if (currentCheckpoint < 6) {
            setCurrentCheckpoint(currentCheckpoint + 1)
        }
    }

    // Go to specific checkpoint (for looping back to decompression)
    const goToCheckpoint = (checkpoint) => {
        setCurrentCheckpoint(checkpoint)
    }

    // Reset session completely
    const resetSession = () => {
        setSudsScore(null)
        setCurrentCheckpoint(1)
        setSafePlaceName('')
        setBackgroundColor('#0f0f14')
    }

    const value = {
        sudsScore,
        setSudsScore,
        currentCheckpoint,
        setCurrentCheckpoint,
        currentStage: getCurrentStage(),
        safePlaceName,
        setSafePlaceName,
        backgroundColor,
        setBackgroundColor,
        nextCheckpoint,
        goToCheckpoint,
        resetSession
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
