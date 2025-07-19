import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route } from 'react-router-dom'
import HomePage from './components/home/homePage'
import DetailAnime from './components/app/detailAnime'
import ContactPage from './components/ContactPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/anime/:id" element={<DetailAnime />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  )
}

export default App
