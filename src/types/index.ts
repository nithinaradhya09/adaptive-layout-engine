export type SurfaceType =
  | "mobile"
  | "tablet"
  | "desktop"
  | "banner"
  | "billboard"
  | "custom";

export type LayoutType =
  | "horizontal"
  | "stacked"
  | "overlay"
  | "compact"
  | "image-focus";

/*
 * =========================================
 * AD CONTENT
 * =========================================
 */

export interface AdContent {
  brand: string;
  headline: string;
  description: string;
  cta: string;
  imageUrl: string;
  template: string;

  // Actual image dimensions detected by the browser
  imageWidth?: number;
  imageHeight?: number;
}

/*
 * =========================================
 * TARGET SURFACE
 * =========================================
 */

export interface Surface {
  type: SurfaceType;
  name: string;
  width: number;
  height: number;
}

/*
 * =========================================
 * CONSTRAINT STATUS
 * =========================================
 */

export interface ConstraintStatus {
  id: string;

  label: string;

  passed: boolean;

  severity:
    | "success"
    | "warning"
    | "error";

  detail: string;
}

/*
 * =========================================
 * LAYOUT CANDIDATE
 * =========================================
 *
 * Every possible layout is evaluated by
 * the adaptive layout engine.
 */

export interface LayoutCandidate {
  type: LayoutType;

  name: string;

  // Overall engine score
  score: number;

  // Individual scoring dimensions
  contentFit: number;
  readability: number;
  ctaVisibility: number;
  imageVisibility: number;
  spacing: number;

  // Recommended typography scale
  fontScale: number;

  // Human-readable engine reasoning
  reasons: string[];

  // Problems detected by the engine
  violations: string[];

  // Constraint evaluation
  constraints: ConstraintStatus[];
}

/*
 * =========================================
 * LAYOUT ENGINE RESULT
 * =========================================
 */

export interface LayoutResult {
  // Highest-scoring candidate
  selected: LayoutCandidate;

  // All evaluated candidates,
  // sorted from highest to lowest score
  candidates: LayoutCandidate[];
}