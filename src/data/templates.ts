import type {
  AdContent,
  Surface,
} from "../types";

/*
 * =========================================
 * DEFAULT AD
 * =========================================
 */

export const defaultAd: AdContent = {
  brand: "NOVA",

  headline:
    "Designed for what's next.",

  description:
    "Experience a smarter way to move, work and create with our latest collection.",

  cta: "Explore Now",

  imageUrl:
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85",

  template: "product",
};

/*
 * =========================================
 * AD TEMPLATES
 * =========================================
 *
 * These templates intentionally have
 * different content lengths and tones so
 * the adaptive engine can be demonstrated
 * against different content conditions.
 */

export const templates: Record<
  string,
  AdContent
> = {
  /*
   * ---------------------------------------
   * PRODUCT
   * ---------------------------------------
   */

  product: {
    brand: "NOVA",

    headline:
      "Designed for what's next.",

    description:
      "Experience a smarter way to move, work and create with our latest collection.",

    cta: "Explore Now",

    imageUrl:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85",

    template: "product",
  },

  /*
   * ---------------------------------------
   * FASHION
   * ---------------------------------------
   */

  fashion: {
    brand: "ATELIER",

    headline:
      "The new season starts here.",

    description:
      "Discover refined essentials designed for everyday confidence and effortless style.",

    cta: "View Collection",

    imageUrl:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85",

    template: "fashion",
  },

  /*
   * ---------------------------------------
   * TRAVEL
   * ---------------------------------------
   */

  travel: {
    brand: "AERIS",

    headline:
      "Your next adventure is waiting.",

    description:
      "Find inspiring destinations and make your next journey unforgettable.",

    cta: "Start Exploring",

    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85",

    template: "travel",
  },

  /*
   * ---------------------------------------
   * FOOD
   * ---------------------------------------
   */

  food: {
    brand: "EMBER",

    headline:
      "Made fresh. Made for you.",

    description:
      "Discover bold flavours crafted from fresh ingredients.",

    cta: "Order Now",

    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58ee?auto=format&fit=crop&w=1200&q=85",

    template: "food",
  },

  /*
   * ---------------------------------------
   * TECHNOLOGY
   * ---------------------------------------
   *
   * Longer copy makes this useful for
   * demonstrating typography pressure.
   */

  technology: {
    brand: "NEXUS",

    headline:
      "Technology that adapts to the way you work.",

    description:
      "A smarter generation of connected tools designed to help teams collaborate, create and move faster across every surface.",

    cta: "Discover More",

    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85",

    template: "technology",
  },

  /*
   * ---------------------------------------
   * MINIMAL
   * ---------------------------------------
   *
   * Very low content density.
   * Useful for showing how the engine
   * handles simple advertisements.
   */

  minimal: {
    brand: "FORM",

    headline:
      "Less. Better.",

    description:
      "Simple products for modern living.",

    cta: "Discover",

    imageUrl:
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=85",

    template: "minimal",
  },

  /*
   * ---------------------------------------
   * LONG COPY
   * ---------------------------------------
   *
   * Deliberately dense content.
   * This is useful when demonstrating
   * constraint failures and layout changes.
   */

  editorial: {
    brand: "STUDIO",

    headline:
      "A new approach to everyday design, built around the people, spaces and ideas shaping what comes next.",

    description:
      "Explore a considered collection created for people who value thoughtful details, flexible experiences and products that work beautifully across every environment.",

    cta: "Read More",

    imageUrl:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",

    template: "editorial",
  },
};

/*
 * =========================================
 * TARGET SURFACES
 * =========================================
 *
 * These represent common advertising
 * surfaces that the adaptive engine must
 * support.
 */

export const surfaces: Surface[] = [
  /*
   * Mobile
   */

  {
    type: "mobile",

    name: "Mobile",

    width: 390,

    height: 844,
  },

  /*
   * Tablet
   */

  {
    type: "tablet",

    name: "Tablet",

    width: 768,

    height: 1024,
  },

  /*
   * Desktop
   */

  {
    type: "desktop",

    name: "Desktop",

    width: 1200,

    height: 628,
  },

  /*
   * Standard banner
   */

  {
    type: "banner",

    name: "Banner",

    width: 728,

    height: 90,
  },

  /*
   * Large billboard
   */

  {
    type: "billboard",

    name: "Billboard",

    width: 1920,

    height: 1080,
  },

  /*
   * Wide leaderboard-style surface
   */

  {
    type: "banner",

    name: "Wide Banner",

    width: 970,

    height: 250,
  },

  /*
   * Large desktop surface
   */

  {
    type: "desktop",

    name: "Large Desktop",

    width: 1440,

    height: 900,
  },
];