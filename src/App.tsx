import { useEffect } from 'react'
import Nav from './components/Nav'
import Hero from './components/hero/Hero'
import Shoot from './components/shoot/Shoot'
import EditBay from './components/edit/EditBay'
import Gallery from './components/Gallery'
import Films from './components/Films'
import Services from './components/Services'
import Process from './components/Process'
import Testimonials from './components/Testimonials'
import Faq from './components/Faq'
import Contact from './components/Contact'
import Footer from './components/Footer'
import MobileCta from './components/MobileCta'
import ScrollProgress from './components/ScrollProgress'
import { Divider } from './components/ui'
import { ScrollTrigger, useSmoothScroll } from './lib/motion'

export default function App() {
  useSmoothScroll()

  useEffect(() => {
    // Fonts land after first paint and shift every measurement ScrollTrigger
    // already took. Re-measure once they're in.
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  return (
    <div id="top" className="grain vignette relative min-h-screen">
      <ScrollProgress />
      <Nav />

      <main>
        <Hero />
        <Shoot />
        <EditBay />
        <Divider />
        <Gallery />
        <Films />
        <Services />
        <Divider />
        <Process />
        <Testimonials />
        <Faq />
        <Contact />
      </main>

      <Footer />
      <MobileCta />
    </div>
  )
}
