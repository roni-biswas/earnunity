"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Send, FileText, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const menu = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Submissions", href: "/admin/submissions", icon: Send },
    { name: "Jobs", href: "/admin/jobs", icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r p-6 flex flex-col">
        <h2 className="text-xl font-bold text-blue-600 mb-8">
          EarnUnity Admin
        </h2>
        <nav className="flex-1 space-y-2">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium ${pathname === item.href ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
            >
              <item.icon size={20} /> {item.name}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
