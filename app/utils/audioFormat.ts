/**
 * Maps technical codec/container names from music-metadata library
 * to user-friendly format names that match common file extensions
 */

interface AudioFormatInfo {
  displayName: string;
  description?: string;
  quality?: 'lossless' | 'lossy' | 'uncompressed';
}

// Codec name mappings (from music-metadata library)
const CODEC_MAPPINGS: Record<string, AudioFormatInfo> = {
  // MP3 variants
  'MPEG 1 Layer 3': { 
    displayName: 'MP3', 
    description: 'MPEG Audio Layer III',
    quality: 'lossy'
  },
  'MPEG 2 Layer 3': { 
    displayName: 'MP3', 
    description: 'MPEG Audio Layer III',
    quality: 'lossy'
  },
  'MPEG 2.5 Layer 3': { 
    displayName: 'MP3', 
    description: 'MPEG Audio Layer III',
    quality: 'lossy'
  },
  'MPEG 1 Layer 2': { 
    displayName: 'MP2', 
    description: 'MPEG Audio Layer II',
    quality: 'lossy'
  },
  'MPEG 1 Layer 1': { 
    displayName: 'MP1', 
    description: 'MPEG Audio Layer I',
    quality: 'lossy'
  },

  // WAV variants
  'PCM': { 
    displayName: 'WAV (PCM)', 
    description: 'Uncompressed PCM Audio',
    quality: 'uncompressed'
  },
  'Linear PCM': { 
    displayName: 'WAV (PCM)', 
    description: 'Uncompressed PCM Audio',
    quality: 'uncompressed'
  },

  // Apple formats
  'ALAC': { 
    displayName: 'ALAC', 
    description: 'Apple Lossless Audio',
    quality: 'lossless'
  },
  'Apple Lossless': { 
    displayName: 'ALAC', 
    description: 'Apple Lossless Audio',
    quality: 'lossless'
  },
  'AAC': { 
    displayName: 'AAC', 
    description: 'Advanced Audio Coding',
    quality: 'lossy'
  },
  'Advanced Audio Coding': { 
    displayName: 'AAC', 
    description: 'Advanced Audio Coding',
    quality: 'lossy'
  },

  // FLAC
  'FLAC': { 
    displayName: 'FLAC', 
    description: 'Free Lossless Audio Codec',
    quality: 'lossless'
  },
  'Free Lossless Audio Codec': { 
    displayName: 'FLAC', 
    description: 'Free Lossless Audio Codec',
    quality: 'lossless'
  },

  // Ogg formats
  'Vorbis': { 
    displayName: 'OGG Vorbis', 
    description: 'Ogg Vorbis',
    quality: 'lossy'
  },
  'Opus': { 
    displayName: 'Opus', 
    description: 'Opus Audio',
    quality: 'lossy'
  },

  // Other formats
  'WMA': { 
    displayName: 'WMA', 
    description: 'Windows Media Audio',
    quality: 'lossy'
  },
  'Windows Media Audio': { 
    displayName: 'WMA', 
    description: 'Windows Media Audio',
    quality: 'lossy'
  }
};

// Container/format mappings (also from music-metadata library)
const CONTAINER_MAPPINGS: Record<string, AudioFormatInfo> = {
  'MPEG': { displayName: 'MP3', quality: 'lossy' },
  'WAVE': { displayName: 'WAV', quality: 'uncompressed' },
  'RIFF': { displayName: 'WAV', quality: 'uncompressed' },
  'FLAC': { displayName: 'FLAC', quality: 'lossless' },
  'MPEG-4': { displayName: 'M4A', quality: 'lossy' },
  'QuickTime': { displayName: 'M4A', quality: 'lossy' },
  'Ogg': { displayName: 'OGG', quality: 'lossy' },
  'Matroska': { displayName: 'MKA', quality: 'lossless' },
  'ASF': { displayName: 'WMA', quality: 'lossy' }
};

/**
 * Convert technical codec/container names to user-friendly format names
 * @param codec - The codec name from music-metadata (e.g., "MPEG 1 Layer 3")
 * @param container - The container name from music-metadata (e.g., "MPEG")
 * @returns User-friendly format name (e.g., "MP3")
 */
export const formatAudioFormat = (
  codec?: string | null, 
  container?: string | null
): string => {
  // First try to match codec name
  if (codec) {
    const codecInfo = CODEC_MAPPINGS[codec];
    if (codecInfo) {
      return codecInfo.displayName;
    }
    
    // Try partial matching for codec variations
    const codecLower = codec.toLowerCase();
    const codecMatch = Object.entries(CODEC_MAPPINGS).find(([key]) => 
      key.toLowerCase().includes(codecLower) || codecLower.includes(key.toLowerCase())
    );
    
    if (codecMatch) {
      return codecMatch[1].displayName;
    }
  }

  // Fall back to container name
  if (container) {
    const containerInfo = CONTAINER_MAPPINGS[container];
    if (containerInfo) {
      return containerInfo.displayName;
    }
    
    // Try partial matching for container variations
    const containerLower = container.toLowerCase();
    const containerMatch = Object.entries(CONTAINER_MAPPINGS).find(([key]) => 
      key.toLowerCase().includes(containerLower) || containerLower.includes(key.toLowerCase())
    );
    
    if (containerMatch) {
      return containerMatch[1].displayName;
    }
  }

  // Return the original codec name if no mapping found, but clean it up
  if (codec) {
    return codec.replace(/^MPEG\s*/, 'MP').replace(/\s*Layer\s*/, '');
  }
  
  if (container) {
    return container;
  }

  return 'Unknown';
};

/**
 * Get detailed format information including quality type
 * @param codec - The codec name from music-metadata
 * @param container - The container name from music-metadata
 * @returns Formatted string with quality indicator
 */
export const formatAudioFormatWithQuality = (
  codec?: string | null, 
  container?: string | null
): string => {
  const baseFormat = formatAudioFormat(codec, container);
  
  // Get quality information
  const codecInfo = codec ? CODEC_MAPPINGS[codec] : null;
  const containerInfo = container ? CONTAINER_MAPPINGS[container] : null;
  const quality = codecInfo?.quality || containerInfo?.quality;

  if (quality) {
    const qualityLabels = {
      'uncompressed': '• Uncompressed',
      'lossless': '• Lossless',
      'lossy': '• Compressed'
    };
    
    return `${baseFormat} ${qualityLabels[quality]}`;
  }

  return baseFormat;
};

/**
 * Get the quality type for an audio format
 * @param codec - The codec name from music-metadata
 * @param container - The container name from music-metadata
 * @returns Quality type or null if unknown
 */
export const getAudioQuality = (
  codec?: string | null, 
  container?: string | null
): 'uncompressed' | 'lossless' | 'lossy' | null => {
  const codecInfo = codec ? CODEC_MAPPINGS[codec] : null;
  const containerInfo = container ? CONTAINER_MAPPINGS[container] : null;
  
  return codecInfo?.quality || containerInfo?.quality || null;
};