import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { AppProvider, useApp } from './context/AppContext'

// Intro components
import Intro from './components/intro/Intro'
import Disclaimer from './components/intro/Disclaimer'

// Triage components
import PulseCheck from './components/triage/PulseCheck'
import SOSGrounding from './components/triage/SOSGrounding'
import SessionExplanation from './components/triage/SessionExplanation'

// Session components
import Recall from './components/session/Recall'

// Closing components
import Affirmations from './components/closing/Affirmations'
import Resources from './components/closing/Resources'
import LoadingScreen from './components/LoadingScreen'

import './App.css'

function AppContent() {
  const { currentCheckpoint, backgroundColor } = useApp()

  const renderCheckpoint = () => {
    switch (currentCheckpoint) {
      case 1:
        return <Intro key="intro" />
      case 2:
        return <Disclaimer key="disclaimer" />
      case 3:
        return <PulseCheck key="pulse-check" />
      case 4:
        return <SOSGrounding key="sos-grounding" />
      case 5:
        return <SessionExplanation key="session-explanation" />
      case 6:
        return <Recall key="recall" />
      case 7:
        return <Affirmations key="affirmations" />
      case 8:
        return <PulseCheck key="final-rating" />
      case 9:
        return <Resources key="resources" />
      default:
        // Default to Intro if 0 or undefined, or PulseCheck? 
        // Logic starts at 1 now.
        return <Intro key="intro" />
    }
  }

  return (
    <div className="app" style={{ backgroundColor }}>
      <AnimatePresence mode="wait">
        {renderCheckpoint()}
      </AnimatePresence>
    </div>
  )
}

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time (min 12s for full cycle)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 12000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AppProvider>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loading" />
        ) : (
          <AppContent key="app" />
        )}
      </AnimatePresence>
    </AppProvider>
  )
}

export default App
