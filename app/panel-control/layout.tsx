// This layout only wraps the admin panel visually.
// Auth protection is handled by:
//   1. proxy.ts (redirects unauthenticated requests to /panel-control/login)
//   2. Each page doing its own getAdminSession() check
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {children}
    </div>
  )
}
