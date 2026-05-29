'use client'

import * as React from 'react'
import {
  LayoutDashboard,
  BarChart3,
  Sparkles,
  Building2,
  Users,
  FileText,
  CreditCard,
  Wrench,
  MessageSquare,
  FolderOpen,
  Settings,
  Plus,
  Search,
} from 'lucide-react'

import { useAppStore } from '@/stores'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'

// ── Data ────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'Navigation' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, group: 'Navigation' },
  { id: 'copilot', label: 'AI Copilot', icon: Sparkles, group: 'Navigation' },
  { id: 'properties', label: 'Properties', icon: Building2, group: 'Navigation' },
  { id: 'tenants', label: 'Tenants', icon: Users, group: 'Navigation' },
  { id: 'leases', label: 'Leases', icon: FileText, group: 'Navigation' },
  { id: 'billing', label: 'Billing', icon: CreditCard, group: 'Navigation' },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench, group: 'Navigation' },
  { id: 'communications', label: 'Communications', icon: MessageSquare, group: 'Navigation' },
  { id: 'documents', label: 'Documents', icon: FolderOpen, group: 'Navigation' },
  { id: 'settings', label: 'Settings', icon: Settings, group: 'Navigation' },
]

const QUICK_ACTIONS = [
  { id: 'add-property', label: 'Add Property', icon: Building2 },
  { id: 'add-tenant', label: 'Add Tenant', icon: Users },
  { id: 'create-lease', label: 'Create Lease', icon: FileText },
  { id: 'new-ticket', label: 'New Ticket', icon: Wrench },
  { id: 'view-analytics', label: 'View Analytics', icon: BarChart3 },
  { id: 'open-copilot', label: 'Open AI Copilot', icon: Sparkles },
]

const RECENT_ITEMS = [
  { id: 'recent-skyline', label: 'Skyline Tower', description: 'Property • 24 units' },
  { id: 'recent-harbor', label: 'Harbor View Residences', description: 'Property • 18 units' },
  { id: 'recent-metro', label: 'Metro Commercial Hub', description: 'Property • 12 units' },
]

// ── Component ───────────────────────────────────────────────────────────────

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, setActiveModule } = useAppStore()

  // Keyboard shortcut: Cmd+K / Ctrl+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(!commandPaletteOpen)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [commandPaletteOpen, setCommandPaletteOpen])

  const handleSelect = React.useCallback(
    (id: string) => {
      // Map quick actions to modules
      const actionToModule: Record<string, string> = {
        'view-analytics': 'analytics',
        'open-copilot': 'copilot',
        'add-property': 'properties',
        'add-tenant': 'tenants',
        'create-lease': 'leases',
        'new-ticket': 'maintenance',
      }

      // Check if it's a quick action
      if (actionToModule[id]) {
        setActiveModule(actionToModule[id])
      }
      // Check if it's a nav item
      else if (NAV_ITEMS.some((item) => item.id === id)) {
        setActiveModule(id)
      }

      setCommandPaletteOpen(false)
    },
    [setActiveModule, setCommandPaletteOpen]
  )

  return (
    <CommandDialog
      open={commandPaletteOpen}
      onOpenChange={setCommandPaletteOpen}
      title="Command Palette"
      description="Search for modules, actions, or recent items..."
    >
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Navigation group */}
        <CommandGroup heading="Navigation">
          {NAV_ITEMS.map((item) => (
            <CommandItem
              key={item.id}
              value={item.label}
              onSelect={() => handleSelect(item.id)}
              className="cursor-pointer"
            >
              <item.icon className="size-4 text-muted-foreground" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* Quick actions group */}
        <CommandGroup heading="Actions">
          {QUICK_ACTIONS.map((action) => (
            <CommandItem
              key={action.id}
              value={action.label}
              onSelect={() => handleSelect(action.id)}
              className="cursor-pointer"
            >
              <Plus className="size-4 text-primary" />
              <span>{action.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* Recent items group */}
        <CommandGroup heading="Recent">
          {RECENT_ITEMS.map((item) => (
            <CommandItem
              key={item.id}
              value={item.label}
              onSelect={() => handleSelect('properties')}
              className="cursor-pointer"
            >
              <Search className="size-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span>{item.label}</span>
                <span className="text-xs text-muted-foreground">{item.description}</span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
