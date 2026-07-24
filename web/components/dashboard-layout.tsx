'use client'

import React from "react"

import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Bell, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAPAXStore } from '@/lib/store'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { metalPrices } = useAPAXStore()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#0A0A0A] overflow-x-hidden">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between border-b border-[#2A2A2A] bg-[#0A0A0A]/95 backdrop-blur-sm px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-[#888888] hover:text-[#E8E8E8] hover:bg-[#1A1A1A]" />

            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888888]" />
              <Input
                placeholder="Search assets, transactions..."
                className="w-64 pl-9 bg-[#1A1A1A] border-[#2A2A2A] text-[#E8E8E8] placeholder:text-[#888888] focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Metal Prices Ticker */}
            <div className="hidden lg:flex items-center gap-4 px-4 py-1.5 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A]">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#D4AF37] animate-pulse" />
                <span className="text-xs text-[#888888]">GOLD</span>
                <span className="text-sm font-medium text-[#D4AF37]">${metalPrices.gold.toFixed(2)}</span>
              </div>
              <div className="w-px h-4 bg-[#2A2A2A]" />
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#C0C0C0] animate-pulse" />
                <span className="text-xs text-[#888888]">SILVER</span>
                <span className="text-sm font-medium text-[#C0C0C0]">${metalPrices.silver.toFixed(2)}</span>
              </div>
              <div className="w-px h-4 bg-[#2A2A2A]" />
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#E5E4E2] animate-pulse" />
                <span className="text-xs text-[#888888]">PLATINUM</span>
                <span className="text-sm font-medium text-[#E5E4E2]">${metalPrices.platinum.toFixed(2)}</span>
              </div>
            </div>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-[#888888] hover:text-[#E8E8E8] hover:bg-[#1A1A1A]"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#D4AF37]" />
            </Button>

            {/* User Avatar */}
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-[#0A0A0A] font-semibold text-sm">
              AA
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 p-4 md:p-6 min-w-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
