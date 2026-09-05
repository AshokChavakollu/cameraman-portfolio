import { useEffect } from 'react'
import Aperture from './components/Aperture'
import Nav from './components/Nav'
import Hero from './components/hero/Hero'
import ContactSheet from './components/sheet/ContactSheet'
import EditBay from './components/edit/EditBay'
import Gallery from './components/Gallery'
import Story from './components/Story'
import Films from './components/Films'
import Services from './components/Services'
import Process from './components/Process'
import Delivery from './components/Delivery'
import Testimonials from './components/Testimonials'
import Faq from './components/Faq'
import Availability from './components/Availability'
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
        {/* The iris is used twice and no more: on the first section after the
            hero, and on the work itself. A lens that opens on every section is
            a page transition; a lens that opens twice is punctuation. */}
        <Aperture>
          <ContactSheet />
        </Aperture>
        <EditBay />
        <Divider />
        <Aperture>
          <Gallery />
        </Aperture>
        <Story />
        <Films />
        <Services />
        <Divider />
        <Process />
        <Delivery />
        <Testimonials />
        <Faq />
        <Availability />
        <Contact />
      </main>

      <Footer />
      <MobileCta />
    </div>
  )
}
