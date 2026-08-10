'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react'

export default function ProductGallery({
  images,
  productName,
}: {
  images: string[]
  productName: string
}) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isFading, setIsFading] = useState(false)

  const galleryImages = images.length > 0 ? images : ['/images/Mate Camionero criollo de Calabaza.png']
  const currentImage = galleryImages[selectedIndex] || galleryImages[0]

  const changeImage = (newIndex: number) => {
    if (newIndex === selectedIndex) return
    setIsFading(true)
    setTimeout(() => {
      setSelectedIndex(newIndex)
      setIsFading(false)
    }, 150)
  }

  const prevImage = () => {
    const nextIdx = selectedIndex === 0 ? galleryImages.length - 1 : selectedIndex - 1
    changeImage(nextIdx)
  }

  const nextImage = () => {
    const nextIdx = selectedIndex === galleryImages.length - 1 ? 0 : selectedIndex + 1
    changeImage(nextIdx)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Visualizador Principal con Carrusel / Deslizamiento con Animación Suave */}
      <div className="w-full aspect-square max-h-[420px] overflow-hidden rounded-2xl border border-washed-sky relative bg-white p-4 shadow-sm mx-auto group">
        <div
          className={`w-full h-full relative transition-all duration-300 transform ${
            isFading ? 'opacity-0 scale-95 blur-[2px]' : 'opacity-100 scale-100 blur-0'
          }`}
        >
          <Image
            src={currentImage}
            alt={`${productName} — foto ${selectedIndex + 1}`}
            fill
            priority
            className="w-full h-full object-contain p-2"
            sizes="(max-width: 1024px) 100vw, 58vw"
          />
        </div>

        {/* Botón Agrandar / Pantalla Completa */}
        <button
          onClick={() => setIsFullscreen(true)}
          aria-label="Agrandar imagen"
          className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all opacity-80 group-hover:opacity-100 backdrop-blur-sm z-10 cursor-pointer"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Flechas de Navegación Carrusel (Si hay más de 1 foto) */}
        {galleryImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="Imagen anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 text-white hover:bg-black/70 hover:scale-110 active:scale-95 transition-all backdrop-blur-sm shadow-md cursor-pointer z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={nextImage}
              aria-label="Imagen siguiente"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 text-white hover:bg-black/70 hover:scale-110 active:scale-95 transition-all backdrop-blur-sm shadow-md cursor-pointer z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Indicador de posición / Puntos deslizables */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 px-3.5 py-1.5 rounded-full backdrop-blur-sm z-10">
              {galleryImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => changeImage(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === selectedIndex ? 'bg-white w-5' : 'bg-white/50 w-2 hover:bg-white/80'
                  }`}
                  aria-label={`Ver foto ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Miniaturas de fotos */}
      {galleryImages.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => changeImage(idx)}
              className={`w-20 h-20 shrink-0 rounded-xl border-2 overflow-hidden bg-white p-1 transition-all duration-200 cursor-pointer ${
                idx === selectedIndex
                  ? 'border-[#5C663D] shadow-md scale-105 ring-2 ring-[#5C663D]/30'
                  : 'border-washed-sky opacity-60 hover:opacity-100 hover:scale-100'
              }`}
            >
              <Image
                src={img}
                alt={`${productName} miniatura ${idx + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}

      {/* Modal Pantalla Completa (Zoom) */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fadeIn">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-5 right-5 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-20 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-4xl h-[80vh] flex items-center justify-center">
            <Image
              src={currentImage}
              alt={`${productName} zoom`}
              fill
              className="object-contain transition-all duration-300"
            />
          </div>

          {galleryImages.length > 1 && (
            <div className="flex items-center gap-6 mt-4 z-20">
              <button
                onClick={prevImage}
                className="p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <span className="text-white/80 text-sm font-bold">
                {selectedIndex + 1} / {galleryImages.length}
              </span>
              <button
                onClick={nextImage}
                className="p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
