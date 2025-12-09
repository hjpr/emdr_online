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
    const [sessionRatings, setSessionRatings] = useState({})
    const [isPostSessionSOS, setIsPostSessionSOS] = useState(false)

    // Save initial Triage rating
    const saveTriageRating = (score) => {
        setSessionRatings(prev => ({
            ...prev,
            triageRating: score
        }))
    }

    // Save Final rating
    const saveFinalRating = (score) => {
        setSessionRatings(prev => ({
            ...prev,
            finalRating: score
        }))
    }

    // Save sequential Recall ratings (recallRating1, recallRating2, etc.)
    const saveRecallRating = (score) => {
        setSessionRatings(prev => {
            // Count how many recall ratings already exist to determine next index
            const recallKeys = Object.keys(prev).filter(key => key.startsWith('recallRating'))
            const nextIndex = recallKeys.length + 1
            return {
                ...prev,
                [`recallRating${nextIndex}`]: score
            }
        })
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
                if (isPostSessionSOS) {
                    setIsPostSessionSOS(false)
                    setCurrentCheckpoint(9) // SOS -> Resources (end of post-session/crisis loop)
                } else {
                    setCurrentCheckpoint(5) // SOS -> Session Explanation (normal flow)
                }
                break
            case 5:
                setCurrentCheckpoint(6) // Explanation -> Recall
                break
            case 6:
                // Recall -> Affirmations
                setCurrentCheckpoint(7)
                break
            case 7:
                setCurrentCheckpoint(8) // Affirmations -> Final Rating
                break
            case 8:
                // Final Rating Logic
                if (effectiveScore !== null && effectiveScore >= 7) {
                    setIsPostSessionSOS(true)
                    setCurrentCheckpoint(4) // High distress -> SOS Grounding
                } else {
                    setCurrentCheckpoint(9) // Low/Medium distress -> Resources
                }
                break
            case 9:
                // End of line
                break
            default:
                if (currentCheckpoint < 9) {
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
        setSessionRatings({})
        setIsPostSessionSOS(false)
        setCurrentCheckpoint(1)
        setBackgroundColor('#0f0f14')
    }

    const value = {
        sudsScore,
        setSudsScore,
        currentCheckpoint,
        setCurrentCheckpoint,
        sessionRatings,
        saveTriageRating,
        saveRecallRating,
        saveFinalRating,
        backgroundColor,
        setBackgroundColor,
        nextCheckpoint,
        goToCheckpoint,
        resetSession
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
