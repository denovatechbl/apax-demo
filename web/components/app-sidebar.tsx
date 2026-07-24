'use client'

import {
  SquaresFour,
  ShieldCheck,
  Calculator,
  Coins,
  FileText,
  Gear,
  Question,
  SignOut
} from '@phosphor-icons/react'
import Image from 'next/image'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator
} from '@/components/ui/sidebar'
import { useAPAXStore } from '@/lib/store'

const mainNavItems = [
  {
    title: 'Dashboard',
    icon: SquaresFour,
    view: 'dashboard' as const
  },
  {
    title: 'Proof of Reserve',
    icon: ShieldCheck,
    view: 'por' as const
  },
  {
    title: 'Zakat Calculator',
    icon: Calculator,
    view: 'zakat' as const
  },
  {
    title: 'Redemption Portal',
    icon: Coins,
    view: 'redemption' as const
  },
  {
    title: 'Sharia Certification',
    icon: FileText,
    view: 'sharia' as const
  }
]

const supportItems = [
  {
    title: 'Help & Support',
    icon: Question
  },
  {
    title: 'Settings',
    icon: Gear
  }
]

export function AppSidebar() {
  const { activeView, setActiveView } = useAPAXStore()

  return (
    <Sidebar className="border-r border-[#2A2A2A] bg-[#0D0D0D]">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-lg gold-glow">
            <Image
              src="/images/apax-logo.png"
              alt="APAX Logo"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-semibold text-[#D4AF37]">APAX</span>
            <span className="text-xs text-[#888888]">Precious Metal Vault</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator className="bg-[#2A2A2A]" />

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#888888] text-xs uppercase tracking-wider px-3 py-2">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={activeView === item.view}
                    onClick={() => setActiveView(item.view)}
                    className={`
                      group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all
                      ${activeView === item.view
                        ? 'bg-[#1A1A1A] text-[#D4AF37] border border-[#D4AF37]/20'
                        : 'text-[#C0C0C0] hover:bg-[#1A1A1A] hover:text-[#E8E8E8]'
                      }
                    `}
                  >
                    <item.icon className={`h-5 w-5 ${activeView === item.view ? 'text-[#D4AF37]' : 'text-[#888888] group-hover:text-[#C0C0C0]'}`} />
                    <span>{item.title}</span>
                    {activeView === item.view && (
                      <div className="absolute right-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-l-full bg-[#D4AF37]" />
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-4 bg-[#2A2A2A]" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-[#888888] text-xs uppercase tracking-wider px-3 py-2">
            Support
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#C0C0C0] transition-all hover:bg-[#1A1A1A] hover:text-[#E8E8E8]"
                  >
                    <item.icon className="h-5 w-5 text-[#888888] group-hover:text-[#C0C0C0]" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-[#2A2A2A]">
        <div className="glass rounded-lg p-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-[#0A0A0A] font-semibold text-sm">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#E8E8E8] truncate">John Doe</p>
              <p className="text-xs text-[#888888] truncate">client@apax.institutional</p>
            </div>
            <button className="p-1.5 rounded-md hover:bg-[#1A1A1A] text-[#888888] hover:text-[#E8E8E8] transition-colors">
              <SignOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
