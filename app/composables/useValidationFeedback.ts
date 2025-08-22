interface ValidationResult {
  isValid: boolean
  message: string
  suggestion?: string
  correctedValue?: string
  severity: 'error' | 'warning' | 'info'
  autoCorrect?: boolean
}

interface ValidationOptions {
  autoCorrect?: boolean
  strict?: boolean
}
  
export const useValidationFeedback = () => {
  
  const validateISRC = (value: string, options: ValidationOptions = {}): ValidationResult => {
    if (!value || value.trim() === '') {
      return {
        isValid: false,
        message: 'ISRC is required for radio royalties',
        suggestion: 'Generate an ISRC code from your music distributor (DistroKid, CD Baby, etc.) or register at ISRC.org',
        severity: 'warning'
      }
    }

    const cleaned = value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
    
    if (cleaned.length !== 12) {
      return {
        isValid: false,
        message: 'ISRC must be exactly 12 characters',
        suggestion: 'Format: XX-ABC-12-34567 (Country-Registrant-Year-Designation)',
        severity: 'error'
      }
    }
    
    const countryCode = cleaned.substring(0, 2)
    const registrantCode = cleaned.substring(2, 5)
    const year = cleaned.substring(5, 7)
    const designation = cleaned.substring(7, 12)
    
    if (!/^[A-Z]{2}$/.test(countryCode)) {
      return {
        isValid: false,
        message: 'Invalid country code',
        suggestion: 'Country code must be 2 letters (e.g., US, GB, FR)',
        severity: 'error'
      }
    }
    
    if (!/^[A-Z0-9]{3}$/.test(registrantCode)) {
      return {
        isValid: false,
        message: 'Invalid registrant code',
        suggestion: 'Registrant code must be 3 characters (letters/numbers)',
        severity: 'error'
      }
    }
    
    if (!/^\d{2}$/.test(year)) {
      return {
        isValid: false,
        message: 'Invalid year',
        suggestion: 'Year must be 2 digits',
        severity: 'error'
      }
    }
    
    if (!/^\d{5}$/.test(designation)) {
      return {
        isValid: false,
        message: 'Invalid designation code',
        suggestion: 'Designation code must be 5 digits',
        severity: 'error'
      }
    }
    
    const formatted = `${countryCode}-${registrantCode}-${year}-${designation}`
    
    if (formatted !== value.trim()) {
      return {
        isValid: true,
        message: 'ISRC format corrected',
        suggestion: 'Automatically formatted with proper dashes and capitalization',
        correctedValue: formatted,
        severity: 'info',
        autoCorrect: options.autoCorrect !== false
      }
    }
    
    return {
      isValid: true,
      message: 'Valid ISRC format',
      severity: 'info'
    }
  }

  const formatISRC = (value: string): string => {
    if (!value) return ''
    
    const cleaned = value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
    
    if (cleaned.length !== 12) return value // if wrong length return original
    
    return `${cleaned.substring(0, 2)}-${cleaned.substring(2, 5)}-${cleaned.substring(5, 7)}-${cleaned.substring(7, 12)}`
  }

  const validateArtistName = (value: string): ValidationResult => {
    if (!value || value.trim() === '') {
      return {
        isValid: false,
        message: 'Artist name is required',
        suggestion: 'Enter the performing artist or band name',
        severity: 'error'
      }
    }

    const trimmed = value.trim()
    
    if (trimmed.toLowerCase().includes('unknown') || trimmed.toLowerCase().includes('untitled')) {
      return {
        isValid: false,
        message: 'Generic artist name detected',
        suggestion: 'Use the actual artist or band name for proper metadata',
        severity: 'warning'
      }
    }
    
    if (trimmed.length > 200) {
      return {
        isValid: false,
        message: 'Artist name is too long',
        suggestion: 'Artist names should be under 100 characters for platform compatibility',
        severity: 'error'
      }
    }
    
    const hasSpecialChars = /[<>:"\\|?*]/.test(trimmed)
    if (hasSpecialChars) {
      return {
        isValid: false,
        message: 'Artist name contains problematic characters',
        suggestion: 'Remove characters like < > : " \\ | ? * which can cause distribution issues',
        severity: 'warning'
      }
    }
    
    return {
      isValid: true,
      message: 'Valid artist name',
      severity: 'info'
    }
  }

  const validateTrackTitle = (value: string): ValidationResult => {
    if (!value || value.trim() === '') {
      return {
        isValid: false,
        message: 'Track title is required',
        suggestion: 'Enter the song title',
        severity: 'error'
      }
    }

    const trimmed = value.trim()
    
    if (trimmed.toLowerCase().includes('untitled') || trimmed.toLowerCase().includes('track')) {
      return {
        isValid: false,
        message: 'Generic track title detected',
        suggestion: 'Use the actual song title for proper cataloging',
        severity: 'warning'
      }
    }
    
    if (trimmed.length > 255) {
      return {
        isValid: false,
        message: 'Track title is too long',
        suggestion: 'Track titles should be under 255 characters',
        severity: 'error'
      }
    }
    
    return {
      isValid: true,
      message: 'Valid track title',
      severity: 'info'
    }
  }

  const validateAlbumName = (value: string): ValidationResult => {
    if (!value || value.trim() === '') {
      return {
        isValid: true,
        message: 'Album name is optional but recommended',
        suggestion: 'Adding album information helps with organization and metadata completeness',
        severity: 'info'
      }
    }

    const trimmed = value.trim()
    
    if (trimmed.length > 1000) {
      return {
        isValid: false,
        message: 'Album name is too long',
        suggestion: 'Album name is too long, contact support if you need assistance',
        severity: 'error'
      }
    }
    
    return {
      isValid: true,
      message: 'Valid album name',
      severity: 'info'
    }
  }

  const validateDuration = (seconds: number): ValidationResult => {
    if (!seconds || seconds <= 0) {
      return {
        isValid: false,
        message: 'Invalid track duration',
        suggestion: 'Duration should be automatically detected from the audio file',
        severity: 'error'
      }
    }
    
    if (seconds < 30) {
      return {
        isValid: false,
        message: 'Track is too short',
        suggestion: 'Most streaming platforms require tracks to be at least 30 seconds',
        severity: 'warning'
      }
    }
    
    // TODO check this with distros
    if (seconds > 600) { // 10 minutes
      return {
        isValid: true,
        message: 'Long track detected',
        suggestion: 'Tracks over 10 minutes may have limited platform support',
        severity: 'info'
      }
    }
    
    return {
      isValid: true,
      message: 'Valid track duration',
      severity: 'info'
    }
  }

  const validateFileFormat = (format: string, sampleRate?: number): ValidationResult => {
    const acceptedFormats = ['mp3', 'wav', 'flac', 'm4a', 'aac']
    
    if (!format || !acceptedFormats.includes(format.toLowerCase())) {
      return {
        isValid: false,
        message: 'Unsupported file format',
        suggestion: 'Convert to MP3, WAV, FLAC, M4A, or AAC for distribution',
        severity: 'error'
      }
    }
    
    const formatLower = format.toLowerCase()
    
    if (formatLower === 'mp3') {
      return {
        isValid: true,
        message: 'MP3 format accepted',
        suggestion: 'For best quality, use 320kbps MP3 or consider lossless formats like FLAC',
        severity: 'info'
      }
    }
    
    if (formatLower === 'wav' || formatLower === 'flac') {
      if (sampleRate && sampleRate < 44100) {
        return {
          isValid: false,
          message: 'Low sample rate detected',
          suggestion: 'Use at least 44.1kHz (CD quality) for distribution',
          severity: 'warning'
        }
      }
      
      return {
        isValid: true,
        message: 'High-quality format detected',
        suggestion: 'Excellent choice for maintaining audio quality',
        severity: 'info'
      }
    }
    
    return {
      isValid: true,
      message: 'Supported format',
      severity: 'info'
    }
  }

  const validateTrack = (track: unknown): ValidationResult[] => {
    const results: ValidationResult[] = []
    
    results.push(validateTrackTitle(track.title))
    results.push(validateArtistName(track.artist))
    results.push(validateAlbumName(track.album))
    results.push(validateISRC(track.isrc))
    
    if (track.duration_seconds) {
      results.push(validateDuration(track.duration_seconds))
    }
    
    if (track.file_format) {
      results.push(validateFileFormat(track.file_format, track.sample_rate, track.bit_depth))
    }
    
    return results.filter(result => result.severity === 'error' || result.severity === 'warning')
  }

  const getValidationSummary = (results: ValidationResult[]) => {
    const errors = results.filter(r => r.severity === 'error').length
    const warnings = results.filter(r => r.severity === 'warning').length
    
    let score = 100
    score -= errors * 20 // -20 points per error
    score -= warnings * 10 // -10 points per warning
    score = Math.max(0, score)
    
    let status = 'excellent'
    if (errors > 0) status = 'poor'
    else if (warnings > 2) status = 'fair'
    else if (warnings > 0) status = 'good'
    
    return {
      score,
      status,
      errors,
      warnings,
      message: `${errors} errors, ${warnings} warnings`
    }
  }

  return {
    validateISRC,
    formatISRC,
    validateArtistName,
    validateTrackTitle,
    validateAlbumName,
    validateDuration,
    validateFileFormat,
    validateTrack,
    getValidationSummary
  }
}