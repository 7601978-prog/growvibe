import { useState, useRef, useCallback } from 'react'
import Hero from './components/Hero'
import WhatIs from './components/WhatIs'
import ForWhom from './components/ForWhom'
import WhatYouMake from './components/WhatYouMake'
import Price from './components/Price'
import Requirements from './components/Requirements'
import PrepFlow from './components/PrepFlow'
import Schedule from './components/Schedule'
import ReadinessForm from './components/ReadinessForm'
import RegistrationForm from './components/RegistrationForm'
import FAQ from './components/FAQ'
import FinalCTA from './components/FinalCTA'
import Toast from './components/Toast'
import ProgressNav from './components/ProgressNav'

export default function App() {
  const [laptopChecked, setLaptopChecked] = useState(false)
  const [flowDone, setFlowDone]           = useState(false)
  const [selectedCity, setSelectedCity]   = useState(null)
  const [selectedSession, setSelectedSession] = useState(null)
  const [readiness, setReadiness]   = useState(Array(5).fill(false))
  const [conditions, setConditions] = useState(Array(5).fill(false))

  // flash states: which section to shake
  const [flashReq,      setFlashReq]      = useState(false)
  const [flashPrep,     setFlashPrep]     = useState(false)
  const [flashSchedule, setFlashSchedule] = useState(false)
  const [flashReadiness,setFlashReadiness]= useState(false)

  // toast
  const [toast, setToast] = useState(null)

  const reqRef      = useRef(null)
  const prepRef     = useRef(null)
  const scheduleRef = useRef(null)
  const readinessRef= useRef(null)
  const registerRef = useRef(null)

  const readinessDone = readiness.every(Boolean) && conditions.every(Boolean)
  const canRegister   = flowDone && selectedSession && readinessDone

  const flash = (setFn, ref, msg) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setFn(true)
    setTimeout(() => setFn(false), 1200)
    setToast(msg)
  }

  // Main CTA — checks each gate in order, scrolls to first incomplete
  const handleCTA = useCallback(() => {
    if (!laptopChecked) {
      flash(setFlashReq, reqRef, 'Сначала подтвердите, что ноутбук подходит для участия')
      return
    }
    if (!flowDone) {
      flash(setFlashPrep, prepRef, 'Пройдите все 7 шагов подготовки — без этого регистрация недоступна')
      return
    }
    if (!selectedSession) {
      flash(setFlashSchedule, scheduleRef, 'Выберите удобную дату и город')
      return
    }
    if (!readinessDone) {
      flash(setFlashReadiness, readinessRef, 'Подтвердите готовность к обучению')
      return
    }
    registerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [laptopChecked, flowDone, selectedSession, readinessDone])

  const scrollToSchedule = () =>
    scheduleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="min-h-screen bg-white">
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      <ProgressNav
        laptopChecked={laptopChecked}
        flowDone={flowDone}
        selectedSession={selectedSession}
        readinessDone={readinessDone}
        refs={{ req: reqRef, prep: prepRef, schedule: scheduleRef, readiness: readinessRef, register: registerRef }}
      />

      <Hero onCTA={handleCTA} onSchedule={scrollToSchedule} />
      <WhatIs />
      <ForWhom />
      <WhatYouMake />
      <Price onCTA={handleCTA} />

      <div ref={reqRef}>
        <Requirements
          laptopChecked={laptopChecked}
          setLaptopChecked={setLaptopChecked}
          flash={flashReq}
          onNext={() => prepRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        />
      </div>

      <div ref={prepRef}>
        <PrepFlow
          laptopChecked={laptopChecked}
          onFlowComplete={() => setFlowDone(true)}
          flash={flashPrep}
        />
      </div>

      <div ref={scheduleRef}>
        <Schedule
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          selectedSession={selectedSession}
          setSelectedSession={setSelectedSession}
          flowDone={flowDone}
          flash={flashSchedule}
        />
      </div>

      <div ref={readinessRef}>
        <ReadinessForm
          readiness={readiness}   setReadiness={setReadiness}
          conditions={conditions} setConditions={setConditions}
          flash={flashReadiness}
        />
      </div>

      <div ref={registerRef}>
        <RegistrationForm
          canRegister={canRegister}
          selectedSession={selectedSession}
          onBlockedClick={handleCTA}
        />
      </div>

      <FAQ />
      <FinalCTA onCTA={handleCTA} />

      <footer className="bg-gray-900 text-gray-400 text-center py-8 text-sm">
        © 2026 Гроу Вайб · Офлайн-практикум по вайб-кодингу
      </footer>
    </div>
  )
}
