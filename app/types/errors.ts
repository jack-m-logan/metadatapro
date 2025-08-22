declare global {
  interface Error {
    type?: string
    suggestion?: string
    canRetry?: boolean
    originalError?: unknown
    severity?: 'error' | 'warning' | 'info'
    correctedValue?: string
    autoCorrect?: boolean
  }
}

export interface EnhancedError extends Error {
  type: string
  suggestion?: string
  canRetry?: boolean
  originalError?: unknown
}

export interface ValidationError extends Error {
  type: string
  suggestion?: string
  severity: 'error' | 'warning' | 'info'
  correctedValue?: string
  autoCorrect?: boolean
}

export {}