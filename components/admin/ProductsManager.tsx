'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { formatPrice } from '@/lib/format'
import {
  Plus, Pencil, Trash2, Search, AlertTriangle, CheckCircle, XCircle,
  Loader2, X, Package, Upload
} from 'lucide-react'

type Category = {
  id: string
  name: string
  slug: string
}

type Product = {
  id: string
  name: string
  slug: string
  price: number
  stockQuantity: number
  description: string | null
  images: string[]
  categorySlug: string
  category: Category
  isFeatured: boolean
  inStock: boolean
  inHeroLoop: boolean
}

type FormData = {
  name: string
  slug: string
  price: string
  stockQuantity: string
  description: string
  categorySlug: string
  images: string
  isFeatured: boolean
  inStock: boolean
  inHeroLoop: boolean
}

const emptyForm: FormData = {
  name: '',
  slug: '',
  price: '',
  stockQuantity: '10',
  description: '',
  categorySlug: '',
  images: '',
  isFeatured: false,
  inStock: true,
  inHeroLoop: false,
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function ProductsManager({
  initialProducts,
  categories,
}: {
  initialProducts: Product[]
  categories: Category[]
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [modal, setModal] = useState<'none' | 'create' | 'edit' | 'delete'>('none')
  const [selected, setSelected] = useState<Product | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')

  // Filter products
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !search || p.name.toLowerCase().includes(search.toLowerCase())
      const matchCat =
        filterCategory === 'all' || p.categorySlug === filterCategory
      return matchSearch && matchCat
    })
  }, [products, search, filterCategory])

  function openCreate() {
    setForm(emptyForm)
    setFormError('')
    setModal('create')
  }

  function openEdit(p: Product) {
    setSelected(p)
    setForm({
      name: p.name,
      slug: p.slug,
      price: String(p.price),
      stockQuantity: String(p.stockQuantity ?? 10),
      description: p.description ?? '',
      categorySlug: p.categorySlug,
      images: p.images.join('\n'),
      isFeatured: p.isFeatured,
      inStock: p.inStock,
      inHeroLoop: p.inHeroLoop,
    })
    setFormError('')
    setModal('edit')
  }

  function openDelete(p: Product) {
    setSelected(p)
    setModal('delete')
  }

  function closeModal() {
    setModal('none')
    setSelected(null)
    setFormError('')
  }

  function handleNameChange(name: string) {
    setForm((f) => ({
      ...f,
      name,
      slug: modal === 'create' ? slugify(name) : f.slug,
    }))
  }

  async function handleCreate() {
    setFormError('')
    const price = parseFloat(form.price)
    if (!form.name || !form.slug || isNaN(price) || !form.categorySlug) {
      setFormError('Completá nombre, slug, precio y categoría.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          price,
          stockQuantity: parseInt(form.stockQuantity) || 0,
          description: form.description || null,
          categorySlug: form.categorySlug,
          images: form.images.split('\n').map((s) => s.trim()).filter(Boolean),
          isFeatured: form.isFeatured,
          inStock: form.inStock,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setFormError(data.error ?? 'Error al crear el producto.')
        return
      }

      setProducts((prev) => [
        { ...data.product, images: data.product.images ? JSON.parse(data.product.images) : [] },
        ...prev,
      ])
      closeModal()
    } catch {
      setFormError('Error de conexión.')
    } finally {
      setLoading(false)
    }
  }

  async function handleEdit() {
    if (!selected) return
    setFormError('')
    const price = parseFloat(form.price)
    if (!form.name || isNaN(price) || !form.categorySlug) {
      setFormError('Completá nombre, precio y categoría.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/products/${selected.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          price,
          stockQuantity: parseInt(form.stockQuantity) || 0,
          description: form.description || null,
          categorySlug: form.categorySlug,
          images: form.images.split('\n').map((s) => s.trim()).filter(Boolean),
          isFeatured: form.isFeatured,
          inStock: form.inStock,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setFormError(data.error ?? 'Error al actualizar.')
        return
      }

      const updated: Product = {
        ...data.product,
        images: (() => {
          try { return JSON.parse(data.product.images) } catch { return [] }
        })(),
      }

      setProducts((prev) => prev.map((p) => (p.id === selected.id ? updated : p)))
      closeModal()
    } catch {
      setFormError('Error de conexión.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!selected) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/products/${selected.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        alert(data.error ?? 'Error al eliminar.')
        return
      }
      setProducts((prev) => prev.filter((p) => p.id !== selected.id))
      closeModal()
    } catch {
      alert('Error de conexión.')
    } finally {
      setLoading(false)
    }
  }

  async function toggleStock(p: Product) {
    try {
      const res = await fetch(`/api/admin/products/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: !p.inStock }),
      })
      if (!res.ok) return
      setProducts((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, inStock: !item.inStock } : item))
      )
    } catch {}
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-bold text-2xl text-gray-800">Productos</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} productos en total</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#5C663D] text-white rounded-xl text-sm font-bold hover:bg-[#4A5038] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Agregar producto
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C663D] bg-white"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C663D] bg-white"
        >
          <option value="all">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Products grid */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No se encontraron productos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className={`bg-white rounded-2xl border p-4 flex flex-col gap-3 ${
                !p.inStock ? 'border-red-200 opacity-75' : 'border-gray-200'
              }`}
            >
              {/* Image */}
              <div className="w-full h-36 rounded-xl bg-gray-100 overflow-hidden relative">
                {p.images[0] ? (
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300">
                    <Package className="w-10 h-10" />
                  </div>
                )}
                {/* badges */}
                <div className="absolute top-2 left-2 flex gap-1">
                  {p.isFeatured && (
                    <span className="bg-[#5C663D] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Destacado
                    </span>
                  )}
                  {!p.inStock && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Sin stock
                    </span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {p.category.name}
                  </p>
                  <span className="text-[11px] font-extrabold text-[#5C663D] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {p.stockQuantity ?? 10} un.
                  </span>
                </div>
                <h3 className="font-bold text-sm text-gray-800 leading-tight mt-1">{p.name}</h3>
                <p className="font-extrabold text-[#5D4B3E] mt-1">{formatPrice(p.price)}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                <button
                  onClick={() => toggleStock(p)}
                  title={p.inStock ? 'Marcar sin stock' : 'Marcar con stock'}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                    p.inStock
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                  }`}
                >
                  {p.inStock ? (
                    <CheckCircle className="w-3.5 h-3.5" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                  {p.inStock ? 'En stock' : 'Sin stock'}
                </button>
                <div className="flex-1" />
                <button
                  onClick={() => openEdit(p)}
                  className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                  title="Editar"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openDelete(p)}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {(modal === 'create' || modal === 'edit') && (
        <ProductModal
          mode={modal}
          form={form}
          categories={categories}
          error={formError}
          loading={loading}
          onClose={closeModal}
          onNameChange={handleNameChange}
          onFormChange={(key, val) => setForm((f) => ({ ...f, [key]: val }))}
          onSubmit={modal === 'create' ? handleCreate : handleEdit}
        />
      )}

      {modal === 'delete' && selected && (
        <DeleteModal
          product={selected}
          loading={loading}
          onClose={closeModal}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}

// ── Product Form Modal ──────────────────────────────────────────────────────
function ProductModal({
  mode, form, categories, error, loading, onClose, onNameChange, onFormChange, onSubmit,
}: {
  mode: 'create' | 'edit'
  form: FormData
  categories: Category[]
  error: string
  loading: boolean
  onClose: () => void
  onNameChange: (name: string) => void
  onFormChange: (key: keyof FormData, val: string | boolean) => void
  onSubmit: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-bold text-lg text-gray-800">
            {mode === 'create' ? 'Nuevo producto' : 'Editar producto'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}

          <Field label="Nombre *">
            <input
              type="text"
              value={form.name}
              onChange={(e) => onNameChange(e.target.value)}
              className={inputClass}
              placeholder="Mate Camionero Criollo..."
            />
          </Field>

          <Field label="Slug (URL) *">
            <input
              type="text"
              value={form.slug}
              onChange={(e) => onFormChange('slug', e.target.value)}
              className={inputClass}
              placeholder="mate-camionero-criollo"
              readOnly={mode === 'edit'}
            />
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Precio (ARS) *">
              <input
                type="number"
                value={form.price}
                onChange={(e) => onFormChange('price', e.target.value)}
                className={inputClass}
                placeholder="13000"
                min="0"
              />
            </Field>
            <Field label="Unidades Stock *">
              <input
                type="number"
                value={form.stockQuantity}
                onChange={(e) => onFormChange('stockQuantity', e.target.value)}
                className={inputClass}
                placeholder="10"
                min="0"
              />
            </Field>
            <Field label="Categoría *">
              <select
                value={form.categorySlug}
                onChange={(e) => onFormChange('categorySlug', e.target.value)}
                className={inputClass}
              >
                <option value="">Seleccioná...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Descripción">
            <textarea
              value={form.description}
              onChange={(e) => onFormChange('description', e.target.value)}
              className={`${inputClass} h-24 resize-none`}
              placeholder="Descripción del producto..."
            />
          </Field>

          <Field label="Fotos del producto">
            <div className="space-y-3">
              {/* Grid visual de fotos existentes con botón eliminar intuitivo */}
              {(() => {
                const imgList = form.images.split('\n').map((s) => s.trim()).filter(Boolean)
                return (
                  <div className="space-y-2">
                    {imgList.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {imgList.map((imgUrl, idx) => (
                          <div
                            key={idx}
                            className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-50 flex items-center justify-center p-1"
                          >
                            <Image
                              src={imgUrl}
                              alt={`Foto ${idx + 1}`}
                              width={120}
                              height={120}
                              className="w-full h-full object-contain"
                            />
                            {/* Botón eliminar foto intuitivo */}
                            <button
                              type="button"
                              onClick={() => {
                                const newList = imgList.filter((_, i) => i !== idx)
                                onFormChange('images', newList.join('\n'))
                              }}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-all cursor-pointer"
                              title="Eliminar foto"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                              #{idx + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">No hay fotos agregadas todavía.</p>
                    )}
                  </div>
                )
              })()}

              {/* Botón selector de archivo nativo */}
              <div className="flex items-center gap-3 bg-gray-50 border border-dashed border-gray-300 rounded-xl p-3">
                <input
                  type="file"
                  id="imageUploadInput"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const formData = new FormData()
                    formData.append('file', file)
                    try {
                      const res = await fetch('/api/admin/upload', {
                        method: 'POST',
                        body: formData,
                      })
                      const data = await res.json()
                      if (!res.ok) {
                        alert(data.error || 'Error al subir la imagen')
                        return
                      }
                      const current = form.images ? form.images.trim() + '\n' : ''
                      onFormChange('images', current + data.url)
                    } catch (err) {
                      alert('Error al subir la foto.')
                    } finally {
                      e.target.value = ''
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('imageUploadInput')?.click()}
                  className="px-4 py-2.5 bg-[#5D4B3E] hover:bg-[#4A3B32] text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
                >
                  <Upload className="w-4 h-4" />
                  + Agregar foto
                </button>
                <span className="text-[11px] text-gray-500">
                  Subí fotos en JPG, PNG, WebP o AVIF (Máx. 5MB)
                </span>
              </div>
            </div>
          </Field>

          <div className="flex flex-wrap gap-4 pt-1">
            <Checkbox
              label="En stock"
              checked={form.inStock}
              onChange={(v) => onFormChange('inStock', v)}
            />
            <Checkbox
              label="Destacar en inicio"
              checked={form.isFeatured}
              onChange={(v) => onFormChange('isFeatured', v)}
            />
          </div>
        </div>

        <div className="flex gap-3 px-6 py-5 border-t border-gray-100 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-[#5C663D] text-white text-sm font-bold hover:bg-[#4A5038] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {mode === 'create' ? 'Crear producto' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Delete Confirmation Modal ─────────────────────────────────────────────
function DeleteModal({
  product, loading, onClose, onConfirm,
}: {
  product: Product
  loading: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto">
          <Trash2 className="w-6 h-6 text-red-500" />
        </div>
        <div className="text-center">
          <h2 className="font-bold text-lg text-gray-800">Eliminar producto</h2>
          <p className="text-sm text-gray-500 mt-1">
            ¿Estás seguro de que querés eliminar <strong>{product.name}</strong>? Esta acción no se puede deshacer.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Helpers ────────────────────────────────────────────────────────────────
const inputClass =
  'w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C663D] bg-[#fafaf9] transition'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}

function Checkbox({
  label, checked, onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded accent-[#5C663D]"
      />
      {label}
    </label>
  )
}
