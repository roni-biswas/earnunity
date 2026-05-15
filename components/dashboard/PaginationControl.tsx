"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  baseUrl: string;
}

export default function PaginationControl({
  totalPages,
  currentPage,
  baseUrl,
}: PaginationProps) {
  // Hide pagination if there's only one page
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-3 py-6 border-t border-slate-800/50 mt-8">
      {/* Previous Button */}
      <Link
        href={`${baseUrl}?page=${currentPage - 1}`}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-white transition-all hover:bg-slate-700",
          currentPage <= 1 && "opacity-20 pointer-events-none",
        )}
      >
        <ChevronLeft className="w-5 h-5" />
      </Link>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {pages.map((page) => (
          <Link
            key={page}
            href={`${baseUrl}?page=${page}`}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all border",
              currentPage === page
                ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/40"
                : "bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500",
            )}
          >
            {page}
          </Link>
        ))}
      </div>

      {/* Next Button */}
      <Link
        href={`${baseUrl}?page=${currentPage + 1}`}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-white transition-all hover:bg-slate-700",
          currentPage >= totalPages && "opacity-20 pointer-events-none",
        )}
      >
        <ChevronRight className="w-5 h-5" />
      </Link>
    </div>
  );
}
