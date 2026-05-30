'use client'

import { useEffect } from 'react'

/**
 * Injects print-specific CSS rules into the document head.
 * Must be rendered once at the app root or in the reports module.
 */
export function PrintStyles() {
  useEffect(() => {
    const id = 'tenantflow-print-styles'
    if (document.getElementById(id)) return

    const style = document.createElement('style')
    style.id = id
    style.textContent = `
      @media print {
        /* Hide everything except the print area */
        body > *:not(#print-area) {
          display: none !important;
        }

        /* Show the print area */
        #print-area {
          display: block !important;
          position: static !important;
          width: 100% !important;
          height: auto !important;
          overflow: visible !important;
        }

        /* Hide app chrome */
        [data-sidebar],
        [data-sidebar-inset],
        [data-slot="header"],
        .sidebar,
        .no-print,
        nav,
        aside,
        header:not(.print-header),
        footer:not(.print-footer) {
          display: none !important;
        }

        /* Page setup */
        @page {
          size: letter; /* 8.5in x 11in */
          margin: 0.75in;
        }

        /* Reset body */
        body {
          background: white !important;
          color: #000 !important;
          font-size: 11pt !important;
          line-height: 1.4 !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        /* Remove shadows and borders */
        * {
          box-shadow: none !important;
          text-shadow: none !important;
        }

        .print-document {
          background: white !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          margin: 0 !important;
          max-width: none !important;
          width: 100% !important;
        }

        /* Page break controls */
        .page-break-before {
          page-break-before: always !important;
          break-before: page !important;
        }

        .page-break-after {
          page-break-after: always !important;
          break-after: page !important;
        }

        .page-break-inside-avoid {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        /* Keep table headers together */
        thead {
          display: table-header-group !important;
        }

        tr {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        /* Print-specific footer with page numbers */
        .print-footer {
          position: fixed !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          display: flex !important;
          justify-content: space-between !important;
          padding: 0.25in 0.75in !important;
          font-size: 9pt !important;
          color: #666 !important;
          border-top: 1px solid #e5e7eb !important;
        }

        /* Watermark */
        .watermark {
          position: fixed !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) rotate(-45deg) !important;
          font-size: 72pt !important;
          font-weight: bold !important;
          color: rgba(0, 0, 0, 0.04) !important;
          pointer-events: none !important;
          z-index: 9999 !important;
          white-space: nowrap !important;
        }

        /* Table styling */
        table {
          border-collapse: collapse !important;
          width: 100% !important;
        }

        th, td {
          border: 1px solid #d1d5db !important;
          padding: 6px 10px !important;
          text-align: left !important;
        }

        th {
          background-color: #f3f4f6 !important;
          font-weight: 600 !important;
        }

        /* Monospace numbers for financial data */
        .font-mono, .tabular-nums {
          font-variant-numeric: tabular-nums !important;
          font-feature-settings: 'tnum' !important;
        }

        /* Ensure links show URL in print */
        a[href]:after {
          content: none !important;
        }

        /* Reduce animations */
        * {
          animation: none !important;
          transition: none !important;
        }

        /* Show screen-only hidden elements */
        .print-show {
          display: block !important;
        }

        /* Hide screen-only elements */
        .print-hide {
          display: none !important;
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      const el = document.getElementById(id)
      if (el) el.remove()
    }
  }, [])

  return null
}
