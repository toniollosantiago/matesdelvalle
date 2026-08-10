'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl dark:bg-neutral-900"
          >
            <div className="flex items-center justify-between border-b p-6 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-emerald-600" />
                <h2 className="text-xl font-bold">Tu Carrito</h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex flex-col items-center justify-center h-full text-neutral-500">
                <ShoppingBag className="h-16 w-16 mb-4 opacity-20" />
                <p>Tu carrito está vacío.</p>
                <button 
                  onClick={onClose}
                  className="mt-6 rounded-full border-2 border-emerald-600 px-6 py-2 font-medium text-emerald-600 transition-colors hover:bg-emerald-600 hover:text-white"
                >
                  Seguir comprando
                </button>
              </div>
            </div>
            
            <div className="border-t p-6 dark:border-neutral-800">
              <div className="mb-4 flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span>$0</span>
              </div>
              <Link
                href="/carrito"
                onClick={onClose}
                className="flex w-full items-center justify-center rounded-xl bg-emerald-600 p-4 font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
              >
                Ir a pagar
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
