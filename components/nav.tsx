"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Role } from "@prisma/client";
import { logout } from "@/actions/auth";

const NavBar = () => {
  const { data: session } = useSession();
  const currentPath = usePathname();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="font-bold text-lg">
                MyStore
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/products"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentPath.startsWith("/products")
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Products
            </Link>

            {session?.user.role === Role.ADMIN && (
              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPath.startsWith("/dashboard")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          <div className="flex items-center">
            {session ? (
              <button type="button" onClick={() => logout()}>
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
