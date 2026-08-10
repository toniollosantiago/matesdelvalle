import { NextResponse } from 'next/server';

const products = [
  { id: '1', name: 'Mate Imperial', price: 45000, image: '/images/mate-imperial.png', category: 'mates', slug: 'mate-imperial', description: 'Mate de calabaza brasileña seleccionada, forrado en cuero vaqueta.' },
  { id: '2', name: 'Bombilla Pico Loro', price: 15000, image: '/images/bombilla-pico-loro.png', category: 'bombillas', slug: 'bombilla-pico-loro', description: 'Bombilla de alpaca maciza, modelo pico de loro.' },
  { id: '3', name: 'Combo Matero', price: 55000, image: '/images/combo-matero.png', category: 'combos', slug: 'combo-matero', description: 'El combo ideal para regalar.' },
  { id: '4', name: 'Mate Torpedo', price: 38000, image: '/images/mate-torpedo.png', category: 'mates', slug: 'mate-torpedo', description: 'Mate de calabaza gruesa, forrado en cuero.' },
];

export async function GET() {
  return NextResponse.json(products);
}
