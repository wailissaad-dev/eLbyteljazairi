import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Products } from "@/components/sections/Products";
import { Packs } from "@/components/sections/Packs";
import { Gallery } from "@/components/sections/Gallery";
import { Fabrics } from "@/components/sections/Fabrics";
import { Features } from "@/components/sections/Features";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { OrderFormModal } from "@/components/modals/OrderFormModal";
import { CustomRequestModal } from "@/components/modals/CustomRequestModal";
import { ProductGalleryModal } from "@/components/modals/ProductGalleryModal";
import { Lightbox } from "@/components/modals/Lightbox";
import { SuccessModal } from "@/components/modals/SuccessModal";
import { Toast } from "@/components/ui/Toast";
import { BackToTop } from "@/components/ui/BackToTop";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { SiteDataProvider } from "@/components/providers/SiteDataProvider";
import { getSiteData } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getSiteData();
  return (
    <SiteDataProvider data={data}>
      <ScrollProgress />
      <SiteHeader />
      <main>
        <Hero />
        <Stats />
        <Products />
        <Packs />
        <Gallery />
        <Fabrics />
        <Features />
        <About />
        <Contact />
      </main>
      <Footer />
      <FloatingActions />
      <BackToTop />

      {/* global overlays */}
      <CartDrawer />
      <OrderFormModal />
      <CustomRequestModal />
      <ProductGalleryModal />
      <Lightbox />
      <SuccessModal />
      <Toast />
    </SiteDataProvider>
  );
}
