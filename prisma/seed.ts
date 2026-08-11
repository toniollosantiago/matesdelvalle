import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // Clear existing data
  await prisma.product.deleteMany({})
  await prisma.category.deleteMany({})
  await prisma.storeConfig.deleteMany({})

  // Store Config
  await prisma.storeConfig.create({
    data: {
      whatsappNumber: '5493571315093',
      shippingInfo: 'Envíos a coordinar por WhatsApp — consultanos 📦',
      bannerMessage: '¡Bienvenidos a Mates del Valle — Embalse, Córdoba!'
    }
  })

  // Categories
  const categoryMates = await prisma.category.create({
    data: {
      name: 'Mates',
      slug: 'mates',
      description: 'Mates artesanales de calabaza, algarrobo y cuero'
    }
  })

  const categoryBombillas = await prisma.category.create({
    data: {
      name: 'Bombillas',
      slug: 'bombillas',
      description: 'Bombillas de alpaca y acero inoxidable'
    }
  })

  const categoryCombos = await prisma.category.create({
    data: {
      name: 'Combos',
      slug: 'combos',
      description: 'Combos armados de mate y bombilla a precio especial'
    }
  })

  // Products
  const productsData = [
    // MATES
    {
      name: 'Mate Camionero criollo de Calabaza',
      slug: 'mate-camionero-criollo-calabaza',
      description: 'Mate camionero de calabaza seleccionada con virola lisa de acero y 4 patas reforzadas.',
      price: 13000,
      images: JSON.stringify(['/images/Mate Camionero criollo de Calabaza.png']),
      categorySlug: categoryMates.slug,
      isFeatured: true,
      inStock: true,
      inHeroLoop: true
    },
    {
      name: 'Mate Camionero Calabaza Liso con Virola de Acero',
      slug: 'mate-camionero-calabaza-virola-acero',
      description: 'Mate camionero clásico de calabaza con virola lisa de acero inoxidable.',
      price: 18000,
      images: JSON.stringify(['/images/Mate Camionero Calabaza Liso con Virola de Acero.png']),
      categorySlug: categoryMates.slug,
      isFeatured: true,
      inStock: true,
      inHeroLoop: true
    },
    {
      name: 'Mate Camionero chico Calabaza Liso con Virola de Acero',
      slug: 'mate-camionero-chico-calabaza',
      description: 'Mate camionero tamaño chico, ideal para consumo personal diario.',
      price: 12000,
      images: JSON.stringify(['/images/Mate Camionero chico Calabaza Liso con Virola de Acero.png']),
      categorySlug: categoryMates.slug,
      isFeatured: false,
      inStock: true,
      inHeroLoop: true
    },
    {
      name: 'Mate Camionero Calabaza Liso con Virola de Acero Cincelada',
      slug: 'mate-camionero-virola-cincelada',
      description: 'Mate camionero con virola de acero trabajada con detalles cincelados a mano.',
      price: 18000,
      images: JSON.stringify(['/images/Mate Camionero Calabaza Liso con Virola de Acero Cincelada.png']),
      categorySlug: categoryMates.slug,
      isFeatured: true,
      inStock: true,
      inHeroLoop: true
    },
    {
      name: 'Mate Camionero de Algarrobo Virola de Acero',
      slug: 'mate-camionero-algarrobo',
      description: 'Mate tallado en madera maciza de algarrobo con virola de acero.',
      price: 12000,
      images: JSON.stringify(['/images/Mate Camionero de Algarrobo Virola de Acero.png']),
      categorySlug: categoryMates.slug,
      isFeatured: false,
      inStock: true,
      inHeroLoop: true
    },

    // BOMBILLAS
    {
      name: 'Bombillas (surtido de modelos)',
      slug: 'bombillas-surtido',
      description: 'Variedad de bombillas de alpaca y acero inoxidable (pico de loro, chata, filtro desarmable).',
      price: 4000,
      images: JSON.stringify(['/images/Bombillas.png']),
      categorySlug: categoryBombillas.slug,
      isFeatured: true,
      inStock: true,
      inHeroLoop: false
    },

    // COMBOS
    {
      name: 'COMBO 1: Mate Camionero Calabaza Liso + Bombilla Pico de Loro',
      slug: 'combo-1',
      description: 'Combo listo para usar: Mate Camionero de calabaza con virola de acero + Bombilla Pico de Loro de acero.',
      price: 22000,
      images: JSON.stringify(['/images/Mate Camionero Calabaza Liso con Virola de Acero.png', '/images/Bombillas.png']),
      categorySlug: categoryCombos.slug,
      isFeatured: true,
      inStock: true,
      inHeroLoop: false
    },
    {
      name: 'COMBO 2: Mate Imperial Liso + Bombilla Pico de Loro de Acero',
      slug: 'combo-2',
      description: 'Combo premium: Mate Imperial liso con virola trabajada + Bombilla Pico de Loro de acero.',
      price: 22000,
      images: JSON.stringify(['/images/Mate Camionero Calabaza Liso con Virola de Acero Cincelada.png', '/images/Bombillas.png']),
      categorySlug: categoryCombos.slug,
      isFeatured: true,
      inStock: true,
      inHeroLoop: false
    },
    {
      name: 'COMBO 3: Mate Camionero de Algarrobo + Bombilla Chata simple',
      slug: 'combo-3',
      description: 'Combo rústico: Mate Camionero de madera de algarrobo + Bombilla chata simple.',
      price: 13500,
      images: JSON.stringify(['/images/Mate Camionero de Algarrobo Virola de Acero.png', '/images/Bombillas.png']),
      categorySlug: categoryCombos.slug,
      isFeatured: false,
      inStock: true,
      inHeroLoop: false
    },
    {
      name: 'COMBO 4: Mate Camionero chico + Bombilla Chata simple',
      slug: 'combo-4',
      description: 'Combo práctico: Mate Camionero chico de calabaza + Bombilla chata simple.',
      price: 14000,
      images: JSON.stringify(['/images/Mate Camionero chico Calabaza Liso con Virola de Acero.png', '/images/Bombillas.png']),
      categorySlug: categoryCombos.slug,
      isFeatured: false,
      inStock: true,
      inHeroLoop: false
    },
    {
      name: 'COMBO 5: Mate Camionero criollo de Calabaza + Bombilla Pico de Loro',
      slug: 'combo-5',
      description: 'Combo tradicional: Mate Camionero criollo de calabaza + Bombilla Pico de Loro de acero.',
      price: 16000,
      images: JSON.stringify(['/images/Mate Camionero criollo de Calabaza.png', '/images/Bombillas.png']),
      categorySlug: categoryCombos.slug,
      isFeatured: false,
      inStock: true,
      inHeroLoop: false
    }
  ]

  for (const product of productsData) {
    await prisma.product.create({ data: product })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
