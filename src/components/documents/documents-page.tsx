'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  FolderOpen,
  FileText,
  File,
  Image,
  Table,
  Upload,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  MoreHorizontal,
  Plus,
  FileSpreadsheet,
  FileImage,
  Clock,
  Building2,
  User,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

// ── Types ────────────────────────────────────────────────────────────────────

interface DocumentItem {
  id: string
  name: string
  type: string
  category: string
  size: number
  propertyId?: string
  tenantId?: string
  createdAt: string
  fileUrl?: string
}

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_DOCUMENTS: DocumentItem[] = [
  { id: '1', name: 'Skyline Tower - Master Lease Agreement', type: 'contract', category: 'Leases', size: 2450000, propertyId: '1', createdAt: '2025-01-15T10:30:00Z' },
  { id: '2', name: 'Harbor View - Insurance Policy 2025', type: 'insurance', category: 'Insurance', size: 1200000, propertyId: '2', createdAt: '2025-01-10T14:00:00Z' },
  { id: '3', name: 'Tenant Application - James Mitchell', type: 'application', category: 'Applications', size: 850000, tenantId: '1', createdAt: '2025-01-08T09:15:00Z' },
  { id: '4', name: 'Metro Commercial - Floor Plan', type: 'blueprint', category: 'Plans', size: 5600000, propertyId: '3', createdAt: '2025-01-05T16:45:00Z' },
  { id: '5', name: 'Property Tax Receipt Q4 2024', type: 'tax', category: 'Financial', size: 340000, createdAt: '2025-01-03T11:20:00Z' },
  { id: '6', name: 'Greenfield Gardens - Maintenance Log', type: 'report', category: 'Maintenance', size: 780000, propertyId: '4', createdAt: '2024-12-28T08:00:00Z' },
  { id: '7', name: 'Pacific Heights - Rental Agreement Template', type: 'template', category: 'Templates', size: 450000, createdAt: '2024-12-20T13:30:00Z' },
  { id: '8', name: 'Downtown Lofts - Inspection Report', type: 'report', category: 'Inspections', size: 3200000, propertyId: '6', createdAt: '2024-12-15T10:00:00Z' },
  { id: '9', name: 'Vendor Contract - ABC Plumbing', type: 'contract', category: 'Vendors', size: 670000, createdAt: '2024-12-10T15:45:00Z' },
  { id: '10', name: 'Annual Budget Report 2024', type: 'report', category: 'Financial', size: 1800000, createdAt: '2024-12-05T09:00:00Z' },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

function getFileIcon(type: string) {
  switch (type) {
    case 'contract':
    case 'application':
    case 'template':
      return FileText
    case 'blueprint':
    case 'report':
      return FileSpreadsheet
    case 'insurance':
    case 'tax':
      return File
    case 'image':
      return FileImage
    default:
      return File
  }
}

function getFileColor(type: string) {
  switch (type) {
    case 'contract':
      return 'text-primary bg-primary/10'
    case 'application':
      return 'text-sky-600 bg-sky-500/10'
    case 'template':
      return 'text-violet-600 bg-violet-500/10'
    case 'blueprint':
      return 'text-amber-600 bg-amber-500/10'
    case 'report':
      return 'text-teal-600 bg-teal-500/10'
    case 'insurance':
      return 'text-rose-600 bg-rose-500/10'
    case 'tax':
      return 'text-orange-600 bg-orange-500/10'
    default:
      return 'text-gray-600 bg-gray-500/10'
  }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  return `${months} month${months > 1 ? 's' : ''} ago`
}

// ── Component ────────────────────────────────────────────────────────────────

export function DocumentsPage() {
  const [search, setSearch] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState('All')
  const [documents] = React.useState<DocumentItem[]>(DEMO_DOCUMENTS)
  const [uploadOpen, setUploadOpen] = React.useState(false)

  const categories = ['All', 'Leases', 'Insurance', 'Applications', 'Plans', 'Financial', 'Maintenance', 'Templates', 'Inspections', 'Vendors']

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalSize = documents.reduce((acc, doc) => acc + doc.size, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FolderOpen className="size-6 text-slate-600" />
            Documents
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage files, contracts, and documents across your portfolio
          </p>
        </div>
        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Upload className="size-4" />
            Upload Document
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>
                Upload a new document to your workspace. Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 transition-colors hover:border-primary/50 hover:bg-primary/5 cursor-pointer">
                <Upload className="size-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Drop files here or click to browse</p>
                <p className="text-xs text-muted-foreground mt-1">Max file size: 25MB</p>
              </div>
              <Input placeholder="Document name" />
              <Input placeholder="Category (e.g., Leases, Insurance)" />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadOpen(false)}>Cancel</Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setUploadOpen(false)}>Upload</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="mojave-card border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Total Documents</p>
                <p className="text-xl font-bold">{documents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="mojave-card border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-sky-500/10">
                <File className="size-4 text-sky-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Total Size</p>
                <p className="text-xl font-bold">{formatFileSize(totalSize)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="mojave-card border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10">
                <FileText className="size-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Contracts</p>
                <p className="text-xl font-bold">{documents.filter(d => d.type === 'contract').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="mojave-card border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-teal-500/10">
                <Clock className="size-4 text-teal-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Recent Uploads</p>
                <p className="text-xl font-bold">{documents.filter(d => timeAgo(d.createdAt) === 'Today' || timeAgo(d.createdAt) === 'Yesterday').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {categories.slice(0, 6).map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}
            >
              {cat}
            </Button>
          ))}
          {categories.length > 6 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  More <Filter className="size-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categories.slice(6).map((cat) => (
                  <DropdownMenuItem key={cat} onClick={() => setSelectedCategory(cat)}>
                    {cat}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Document List */}
      <Card className="mojave-card border-border/30">
        <CardContent className="p-0">
          <ScrollArea className="max-h-[600px]">
            <div className="divide-y divide-border/50">
              {filteredDocs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FolderOpen className="size-12 text-muted-foreground/40 mb-3" />
                  <h3 className="text-sm font-medium text-muted-foreground">No documents found</h3>
                  <p className="text-xs text-muted-foreground/60 mt-1">Try adjusting your search or filters</p>
                </div>
              ) : (
                filteredDocs.map((doc, i) => {
                  const Icon = getFileIcon(doc.type)
                  const colorClass = getFileColor(doc.type)
                  return (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03, duration: 0.15 }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer group"
                    >
                      <div className={`flex size-10 items-center justify-center rounded-lg ${colorClass}`}>
                        <Icon className="size-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{doc.category}</Badge>
                          <span className="text-xs text-muted-foreground">{formatFileSize(doc.size)}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{timeAgo(doc.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="size-8">
                          <Eye className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-8">
                          <Download className="size-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Eye className="size-4 mr-2" /> View</DropdownMenuItem>
                            <DropdownMenuItem><Download className="size-4 mr-2" /> Download</DropdownMenuItem>
                            <DropdownMenuItem><Building2 className="size-4 mr-2" /> Link to Property</DropdownMenuItem>
                            <DropdownMenuItem><User className="size-4 mr-2" /> Link to Tenant</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive"><Trash2 className="size-4 mr-2" /> Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  )
}
