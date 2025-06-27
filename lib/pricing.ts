// Pricing configuration for image generation
export const PRICING_CONFIG = [
  {
    quality: "low",
    size: "1024x1024",
    api_cost: 0.011,
    price_with_50_margin: 0.0165,
    credits_to_charge: 2
  },
  {
    quality: "low",
    size: "1024x1536",
    api_cost: 0.016,
    price_with_50_margin: 0.024,
    credits_to_charge: 3
  },
  {
    quality: "low",
    size: "1536x1024",
    api_cost: 0.016,
    price_with_50_margin: 0.024,
    credits_to_charge: 3
  },
  {
    quality: "medium",
    size: "1024x1024",
    api_cost: 0.042,
    price_with_50_margin: 0.063,
    credits_to_charge: 7
  },
  {
    quality: "medium",
    size: "1024x1536",
    api_cost: 0.063,
    price_with_50_margin: 0.0945,
    credits_to_charge: 10
  },
  {
    quality: "medium",
    size: "1536x1024",
    api_cost: 0.063,
    price_with_50_margin: 0.0945,
    credits_to_charge: 10
  },
  {
    quality: "high",
    size: "1024x1024",
    api_cost: 0.167,
    price_with_50_margin: 0.2505,
    credits_to_charge: 25
  },
  {
    quality: "high",
    size: "1024x1536",
    api_cost: 0.25,
    price_with_50_margin: 0.375,
    credits_to_charge: 38
  },
  {
    quality: "high",
    size: "1536x1024",
    api_cost: 0.25,
    price_with_50_margin: 0.375,
    credits_to_charge: 38
  }
];

// Video generation pricing configuration
export const VIDEO_PRICING_CONFIG = [
  {
    duration: "5s",
    resolution: "360p",
    motion: "normal",
    api_cost: 0.30,
    price_with_30_margin: 0.39,
    credits_to_charge: 39
  },
  {
    duration: "5s",
    resolution: "360p",
    motion: "smooth",
    api_cost: 0.60,
    price_with_30_margin: 0.78,
    credits_to_charge: 78
  },
  {
    duration: "8s",
    resolution: "360p",
    motion: "normal",
    api_cost: 0.60,
    price_with_30_margin: 0.78,
    credits_to_charge: 78
  },
  {
    duration: "5s",
    resolution: "540p",
    motion: "normal",
    api_cost: 0.30,
    price_with_30_margin: 0.39,
    credits_to_charge: 39
  },
  {
    duration: "5s",
    resolution: "540p",
    motion: "smooth",
    api_cost: 0.60,
    price_with_30_margin: 0.78,
    credits_to_charge: 78
  },
  {
    duration: "8s",
    resolution: "540p",
    motion: "normal",
    api_cost: 0.60,
    price_with_30_margin: 0.78,
    credits_to_charge: 78
  },
  {
    duration: "5s",
    resolution: "720p",
    motion: "normal",
    api_cost: 0.40,
    price_with_30_margin: 0.52,
    credits_to_charge: 52
  },
  {
    duration: "5s",
    resolution: "720p",
    motion: "smooth",
    api_cost: 0.80,
    price_with_30_margin: 1.04,
    credits_to_charge: 104
  },
  {
    duration: "8s",
    resolution: "720p",
    motion: "normal",
    api_cost: 0.80,
    price_with_30_margin: 1.04,
    credits_to_charge: 104
  },
  {
    duration: "5s",
    resolution: "1080p",
    motion: "normal",
    api_cost: 0.80,
    price_with_30_margin: 1.04,
    credits_to_charge: 104
  }
];

/**
 * Calculate credits required for video generation based on options
 * @param duration - Video duration (5s, 8s)
 * @param resolution - Video resolution (360p, 540p, 720p, 1080p)
 * @param motion - Motion type (normal, smooth)
 * @returns Credits required for video generation or null if configuration not found
 */
export function calculateVideoCredits(
  duration: "5s" | "8s" = "5s",
  resolution: "360p" | "540p" | "720p" | "1080p" = "720p",
  motion: "normal" | "smooth" = "normal"
): number | null {
  const config = VIDEO_PRICING_CONFIG.find(
    (item) => item.duration === duration && item.resolution === resolution && item.motion === motion
  );

  return config ? config.credits_to_charge : null;
}

/**
 * Get video pricing details for specific options
 * @param duration - Video duration
 * @param resolution - Video resolution
 * @param motion - Motion type
 * @returns Pricing configuration or null if not found
 */
export function getVideoPricingDetails(
  duration: "5s" | "8s",
  resolution: "360p" | "540p" | "720p" | "1080p",
  motion: "normal" | "smooth"
) {
  return VIDEO_PRICING_CONFIG.find(
    (item) => item.duration === duration && item.resolution === resolution && item.motion === motion
  );
}

/**
 * Calculate credits required for image generation
 * @param quality - Image quality (low, medium, high)
 * @param size - Image size (1024x1024, 1024x1536, 1536x1024)
 * @returns Credits required or null if configuration not found
 */
export function calculateCredits(
  quality: "low" | "medium" | "high",
  size: "1024x1024" | "1024x1536" | "1536x1024"
): number | null {
  const config = PRICING_CONFIG.find(
    (item) => item.quality === quality && item.size === size
  );

  return config ? config.credits_to_charge : null;
}

/**
 * Get pricing details for a specific quality and size combination
 * @param quality - Image quality
 * @param size - Image size
 * @returns Pricing configuration or null if not found
 */
export function getPricingDetails(
  quality: "low" | "medium" | "high",
  size: "1024x1024" | "1024x1536" | "1536x1024"
) {
  return PRICING_CONFIG.find(
    (item) => item.quality === quality && item.size === size
  );
}

/**
 * Format quality for display
 * @param quality - Quality string
 * @returns Formatted quality string
 */
export function formatQuality(quality: string): string {
  return quality.charAt(0).toUpperCase() + quality.slice(1);
}

/**
 * Format size for display
 * @param size - Size string
 * @returns Formatted size string
 */
export function formatSize(size: string): string {
  const [width, height] = size.split('x');
  if (width === height) return `Square (${size})`;
  if (parseInt(width) > parseInt(height)) return `Landscape (${size})`;
  return `Portrait (${size})`;
}

/**
 * Format video duration for display
 * @param duration - Duration string
 * @returns Formatted duration string
 */
export function formatDuration(duration: string): string {
  return duration === "5s" ? "5 seconds" : "8 seconds";
}

/**
 * Format video resolution for display
 * @param resolution - Resolution string
 * @returns Formatted resolution string
 */
export function formatResolution(resolution: string): string {
  switch (resolution) {
    case "360p":
      return "360p (SD)";
    case "540p":
      return "540p (QHD)";
    case "720p":
      return "720p (HD)";
    case "1080p":
      return "1080p (Full HD)";
    default:
      return resolution;
  }
}

/**
 * Format motion mode for display
 * @param motion - Motion mode string
 * @returns Formatted motion string
 */
export function formatMotionMode(motion: string): string {
  return motion === "normal" ? "Normal Motion" : "Smooth Motion";
}

// Credit packages configuration
export const CREDIT_PACKAGES = [
  {
    id: "starter",
    name: "Starter",
    price: 9,
    credits: 1000,
    description: "Perfect for trying out AI advertising",
    popular: false,
  },
  {
    id: "professional",
    name: "Professional",
    price: 18,
    credits: 2200,
    description: "Great value for regular creators",
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    price: 34,
    credits: 4000,
    description: "Maximum value for power users",
    popular: false,
  },
];

/**
 * Get credit package by ID
 * @param packageId - The package ID
 * @returns Credit package or null if not found
 */
export function getCreditPackage(packageId: string) {
  return CREDIT_PACKAGES.find(pkg => pkg.id === packageId) || null;
}

/**
 * Calculate credits per dollar for a package
 * @param packageId - The package ID
 * @returns Credits per dollar or null if package not found
 */
export function getCreditsPerDollar(packageId: string): number | null {
  const pkg = getCreditPackage(packageId);
  return pkg ? pkg.credits / pkg.price : null;
} 