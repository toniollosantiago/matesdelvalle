// This layout only wraps the admin panel visually.
// Auth protection is handled by each page calling getAdminSession().
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {children}
    </div>
  )
}
