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
    const [backgroundColor, setBackgroundColor] = useState('#0f0f14')

    // Determine current stage based on checkpoint
    const getCurrentStage = () => {
        if (currentCheckpoint <= 4) return 'triage'
        if (currentCheckpoint === 5 || currentCheckpoint === 6) return 'session'
        if (currentCheckpoint >= 7) return 'closing'
        return 'triage'
    }

    // Navigate to next checkpoint with conditional logic
    // scoreOverride allows passing the score directly to avoid async state issues
    const nextCheckpoint = (scoreOverride = null) => {
        const effectiveScore = scoreOverride !== null ? scoreOverride : sudsScore

        switch (currentCheckpoint) {
            case 1:
                setCurrentCheckpoint(2) // Intro -> Disclaimer
                break
            case 2:
                setCurrentCheckpoint(3) // Disclaimer -> Pulse Check
                break
            case 3:
                // Check SUDS score for conditional routing (Pulse Check)
                if (effectiveScore !== null && effectiveScore >= 7) {
                    setCurrentCheckpoint(4) // High distress -> SOS Grounding
                } else {
                    setCurrentCheckpoint(5) // Low distress -> Session Explanation
                }
                break
            case 4:
                setCurrentCheckpoint(5) // SOS -> Session Explanation
                break
            case 5:
                setCurrentCheckpoint(6) // Explanation -> Recall
                break
            case 6:
                // Recall -> Affirmations
                setCurrentCheckpoint(7)
                break
            case 7:
                setCurrentCheckpoint(8) // Affirmations -> Resources
                break
            default:
                if (currentCheckpoint < 8) {
                    setCurrentCheckpoint(currentCheckpoint + 1)
                }
                break
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
        setBackgroundColor('#0f0f14')
    }

    const value = {
        sudsScore,
        setSudsScore,
        currentCheckpoint,
        setCurrentCheckpoint,
        currentStage: getCurrentStage(),
        backgroundColor,
        setBackgroundColor,
        nextCheckpoint,
        goToCheckpoint,
        resetSession
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
