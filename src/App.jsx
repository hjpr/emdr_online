import { AnimatePresence } from 'framer-motion'
import { AppProvider, useApp } from './context/AppContext'

// Triage components
import PulseCheck from './components/triage/PulseCheck'
import SOSGrounding from './components/triage/SOSGrounding'

// Session components
import Container from './components/session/Container'
import SafePlace from './components/session/SafePlace'
import Decompression from './components/session/Decompression'

// Closing components
import Anchor from './components/closing/Anchor'
import Resources from './components/closing/Resources'

import './App.css'

function AppContent() {
  const { currentCheckpoint, backgroundColor } = useApp()

  const renderCheckpoint = () => {
    switch (currentCheckpoint) {
      case 1:
        return <PulseCheck key="pulse-check" />
      case 1.5:
        return <SOSGrounding key="sos-grounding" />
      case 2:
        return <Container key="container" />
      case 3:
        return <SafePlace key="safe-place" />
      case 4:
        return <Decompression key="decompression" />
      case 5:
        return <Anchor key="anchor" />
      case 6:
        return <Resources key="resources" />
      default:
        return <PulseCheck key="pulse-check" />
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
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App
