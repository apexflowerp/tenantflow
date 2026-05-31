'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  Thermometer,
  Lock,
  Camera,
  Radio,
  Lightbulb,
  Wifi,
  WifiOff,
  AlertTriangle,
  Search,
  Plus,
  Download,
  Battery,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  Power,
  ChevronUp,
  ChevronDown,
  Zap,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────

type DeviceType = 'thermostat' | 'lock' | 'camera' | 'sensor' | 'light'

interface SmartDevice {
  id: string
  name: string
  type: DeviceType
  status: 'online' | 'offline' | 'alert'
  lastReading: string
  batteryLevel: number | null
  property: string
  unit: string
  value: string
  isOn: boolean
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const DEVICES: SmartDevice[] = [
  { id: 'sd-001', name: 'Living Room Thermostat', type: 'thermostat', status: 'online', lastReading: '2 min ago', batteryLevel: null, property: 'Skyline Tower', unit: '4B', value: '72°F', isOn: true },
  { id: 'sd-002', name: 'Front Door Lock', type: 'lock', status: 'online', lastReading: '5 min ago', batteryLevel: 85, property: 'Skyline Tower', unit: '4B', value: 'Locked', isOn: true },
  { id: 'sd-003', name: 'Hallway Camera', type: 'camera', status: 'online', lastReading: '1 min ago', batteryLevel: null, property: 'Skyline Tower', unit: '4B', value: 'Recording', isOn: true },
  { id: 'sd-004', name: 'Motion Sensor', type: 'sensor', status: 'alert', lastReading: 'Just now', batteryLevel: 62, property: 'Harbor View', unit: '12A', value: 'Motion Detected', isOn: true },
  { id: 'sd-005', name: 'Kitchen Lights', type: 'light', status: 'online', lastReading: '3 min ago', batteryLevel: null, property: 'Harbor View', unit: '12A', value: '80%', isOn: true },
  { id: 'sd-006', name: 'Bedroom Thermostat', type: 'thermostat', status: 'online', lastReading: '1 min ago', batteryLevel: null, property: 'Greenfield Gardens', unit: '7C', value: '68°F', isOn: true },
  { id: 'sd-007', name: 'Garage Door Lock', type: 'lock', status: 'offline', lastReading: '2 hours ago', batteryLevel: 12, property: 'Greenfield Gardens', unit: '7C', value: 'Unknown', isOn: false },
  { id: 'sd-008', name: 'Pool Area Camera', type: 'camera', status: 'online', lastReading: '30 sec ago', batteryLevel: null, property: 'Greenfield Gardens', unit: 'Common', value: 'Recording', isOn: true },
  { id: 'sd-009', name: 'Smoke Detector', type: 'sensor', status: 'online', lastReading: '10 min ago', batteryLevel: 94, property: 'Metro Hub', unit: '101', value: 'Normal', isOn: true },
  { id: 'sd-010', name: 'Porch Lights', type: 'light', status: 'online', lastReading: '5 min ago', batteryLevel: null, property: 'Metro Hub', unit: '101', value: 'Off', isOn: false },
  { id: 'sd-011', name: 'Water Leak Sensor', type: 'sensor', status: 'online', lastReading: '15 min ago', batteryLevel: 78, property: 'Oakwood Estates', unit: '3A', value: 'No Leak', isOn: true },
  { id: 'sd-012', name: 'Entry Thermostat', type: 'thermostat', status: 'alert', lastReading: '1 min ago', batteryLevel: null, property: 'Oakwood Estates', unit: '3A', value: '85°F', isOn: true },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function getDeviceIcon(type: DeviceType) {
  const map: Record<DeviceType, React.ComponentType<{ className?: string }>> = {
    thermostat: Thermometer,
    lock: Lock,
    camera: Camera,
    sensor: Radio,
    light: Lightbulb,
  }
  return map[type]
}

function getDeviceIconStyle(type: DeviceType): { color: string; bg: string } {
  const map: Record<DeviceType, { color: string; bg: string }> = {
    thermostat: { color: 'text-tahoe-orange', bg: 'bg-tahoe-orange/10' },
    lock: { color: 'text-tahoe-blue', bg: 'bg-tahoe-blue/10' },
    camera: { color: 'text-tahoe-purple', bg: 'bg-tahoe-purple/10' },
    sensor: { color: 'text-tahoe-teal', bg: 'bg-tahoe-teal/10' },
    light: { color: 'text-tahoe-green', bg: 'bg-tahoe-green/10' },
  }
  return map[type]
}

function getTypeBadgeClass(type: DeviceType): string {
  const map: Record<DeviceType, string> = {
    thermostat: 'tahoe-badge tahoe-badge-orange',
    lock: 'tahoe-badge tahoe-badge-blue',
    camera: 'tahoe-badge tahoe-badge-purple',
    sensor: 'tahoe-badge tahoe-badge-teal',
    light: 'tahoe-badge tahoe-badge-green',
  }
  return map[type]
}

function getTypeLabel(type: DeviceType): string {
  const map: Record<DeviceType, string> = { thermostat: 'Thermostat', lock: 'Lock', camera: 'Camera', sensor: 'Sensor', light: 'Light' }
  return map[type]
}

function getStatusBadge(status: string): string {
  const map: Record<string, string> = {
    online: 'tahoe-badge tahoe-badge-green',
    offline: 'tahoe-badge tahoe-badge-red',
    alert: 'tahoe-badge tahoe-badge-orange',
  }
  return map[status] ?? 'tahoe-badge'
}

function getBatteryIcon(level: number | null) {
  if (level === null) return null
  if (level >= 75) return <BatteryFull className="size-3.5 text-tahoe-green" />
  if (level >= 40) return <BatteryMedium className="size-3.5 text-tahoe-orange" />
  return <BatteryLow className="size-3.5 text-tahoe-red" />
}

// ── Main Component ────────────────────────────────────────────────────────────

export function SmartHomePage() {
  const [devices, setDevices] = React.useState(DEVICES)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState<DeviceType | 'all'>('all')
  const [temp, setTemp] = React.useState(72)

  const connectedDevices = devices.length
  const onlineDevices = devices.filter(d => d.status === 'online').length
  const alertDevices = devices.filter(d => d.status === 'alert').length
  const energySaved = 18

  const toggleDevice = (id: string) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, isOn: !d.isOn } : d))
  }

  const filteredDevices = devices.filter(d => {
    const matchSearch = !searchQuery ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.property.toLowerCase().includes(searchQuery.toLowerCase())
    const matchType = typeFilter === 'all' || d.type === typeFilter
    return matchSearch && matchType
  })

  const stats = [
    { title: 'Connected Devices', value: String(connectedDevices), subtitle: 'IoT integrations', icon: Home, iconColor: 'text-tahoe-blue', iconBg: 'bg-tahoe-blue/10' },
    { title: 'Online', value: String(onlineDevices), subtitle: 'Currently active', icon: Wifi, iconColor: 'text-tahoe-green', iconBg: 'bg-tahoe-green/10' },
    { title: 'Alerts', value: String(alertDevices), subtitle: 'Require attention', icon: AlertTriangle, iconColor: 'text-tahoe-red', iconBg: 'bg-tahoe-red/10' },
    { title: 'Energy Saved', value: `${energySaved}%`, subtitle: 'vs last month', icon: Zap, iconColor: 'text-tahoe-green', iconBg: 'bg-tahoe-green/10' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-tahoe-green/10">
            <Home className="size-6 text-tahoe-green" />
          </div>
          <div>
            <h1 className="tahoe-title">Smart Home</h1>
            <p className="tahoe-caption mt-1">IoT & smart device integration</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 glass-input border-0">
            <Download className="size-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button size="sm" className="gap-2 tahoe-btn-primary">
            <Plus className="size-3.5" />
            Add Device
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.08 }}>
            <Card className="glass-card tahoe-hover overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5 min-w-0">
                    <p className="tahoe-overline">{stat.title}</p>
                    <p className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</p>
                    <p className="tahoe-caption">{stat.subtitle}</p>
                  </div>
                  <div className={cn('flex size-11 shrink-0 items-center justify-center rounded-xl', stat.iconBg)}>
                    <stat.icon className={cn('size-5', stat.iconColor)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Controls */}
      <Card className="glass-card overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="tahoe-headline">Quick Controls</CardTitle>
          <p className="tahoe-caption mt-1">Common device actions</p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Lock/Unlock */}
            <div className="glass-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="size-4 text-tahoe-blue" />
                  <span className="font-medium text-sm">Front Door Lock</span>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-tahoe-blue" />
              </div>
              <p className="text-xs text-muted-foreground">Skyline Tower 4B</p>
            </div>

            {/* Temperature Control */}
            <div className="glass-card p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Thermometer className="size-4 text-tahoe-orange" />
                <span className="font-medium text-sm">Thermostat</span>
              </div>
              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full glass-input border-0" onClick={() => setTemp(t => Math.max(60, t - 1))}>
                  <ChevronDown className="size-4" />
                </Button>
                <span className="text-3xl font-bold text-foreground">{temp}°</span>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full glass-input border-0" onClick={() => setTemp(t => Math.min(85, t + 1))}>
                  <ChevronUp className="size-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">Skyline Tower 4B</p>
            </div>

            {/* Lights */}
            <div className="glass-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="size-4 text-tahoe-green" />
                  <span className="font-medium text-sm">Kitchen Lights</span>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-tahoe-green" />
              </div>
              <p className="text-xs text-muted-foreground">Harbor View 12A</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input placeholder="Search devices..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-8 h-9 text-sm glass-input border-0" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(['all', 'thermostat', 'lock', 'camera', 'sensor', 'light'] as const).map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium tahoe-transition',
                typeFilter === type
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/60 text-muted-foreground hover:bg-secondary'
              )}
            >
              {type === 'all' ? 'All' : getTypeLabel(type)}
            </button>
          ))}
        </div>
      </div>

      {/* Device Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence>
          {filteredDevices.map((device, i) => {
            const Icon = getDeviceIcon(device.type)
            const style = getDeviceIconStyle(device.type)
            return (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <Card className={cn(
                  'glass-card tahoe-hover overflow-hidden',
                  device.status === 'alert' && 'ring-1 ring-tahoe-orange/40',
                  device.status === 'offline' && 'opacity-60'
                )}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className={cn('flex size-10 items-center justify-center rounded-xl', style.bg)}>
                        <Icon className={cn('size-5', style.color)} />
                      </div>
                      <div className="flex items-center gap-1.5">
                        {device.status === 'online' && <Wifi className="size-3 text-tahoe-green" />}
                        {device.status === 'offline' && <WifiOff className="size-3 text-tahoe-red" />}
                        {device.status === 'alert' && <AlertTriangle className="size-3 text-tahoe-orange animate-pulse" />}
                        <span className={getStatusBadge(device.status)}>{device.status}</span>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium text-sm text-foreground">{device.name}</p>
                      <p className="text-[11px] text-muted-foreground">{device.property} · Unit {device.unit}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={getTypeBadgeClass(device.type)}>{getTypeLabel(device.type)}</span>
                      <span className="text-sm font-bold text-foreground">{device.value}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{device.lastReading}</span>
                      {device.batteryLevel !== null && (
                        <span className="flex items-center gap-1">
                          {getBatteryIcon(device.batteryLevel)}
                          {device.batteryLevel}%
                        </span>
                      )}
                    </div>

                    <div className="pt-2 border-t border-border/30">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Power</span>
                        <Switch
                          checked={device.isOn}
                          onCheckedChange={() => toggleDevice(device.id)}
                          className={cn(
                            'data-[state=checked]:bg-tahoe-green',
                            device.type === 'lock' && 'data-[state=checked]:bg-tahoe-blue'
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
