import type {
  AdContent,
  ConstraintStatus,
  LayoutCandidate,
  LayoutResult,
  LayoutType,
  Surface,
} from "../types";

/*
 * =========================================
 * ADAPTIFLOW LAYOUT ENGINE
 * =========================================
 *
 * The engine evaluates multiple layout
 * candidates against:
 *
 * 1. Surface dimensions
 * 2. Surface aspect ratio
 * 3. Content density
 * 4. Image aspect ratio
 * 5. Typography pressure
 * 6. CTA requirements
 * 7. Layout-specific constraints
 *
 * Each candidate receives a score from 0-100.
 * The highest scoring valid candidate becomes
 * the recommended layout.
 */

const layoutNames: Record<
  LayoutType,
  string
> = {
  horizontal: "Horizontal",
  stacked: "Stacked",
  overlay: "Image Overlay",
  compact: "Compact",
  "image-focus": "Image Focus",
};

/*
 * =========================================
 * UTILITY FUNCTIONS
 * =========================================
 */

const clamp = (
  value: number,
  min: number,
  max: number
) =>
  Math.max(
    min,
    Math.min(max, value)
  );

function getAspectRatio(
  surface: Surface
) {
  return (
    surface.width /
    Math.max(surface.height, 1)
  );
}

function getTextLength(
  ad: AdContent
) {
  return (
    ad.brand.length +
    ad.headline.length +
    ad.description.length +
    ad.cta.length
  );
}

function getHeadlineLength(
  ad: AdContent
) {
  return ad.headline.length;
}

function getDescriptionLength(
  ad: AdContent
) {
  return ad.description.length;
}

function getImageAspectRatio(
  ad: AdContent
): number {
  if (
    ad.imageWidth &&
    ad.imageHeight &&
    ad.imageHeight > 0
  ) {
    return (
      ad.imageWidth /
      ad.imageHeight
    );
  }

  /*
   * Neutral fallback when the image
   * has not been analyzed yet.
   */
  return 1;
}

/*
 * =========================================
 * SURFACE CLASSIFICATION
 * =========================================
 */

function classifySurface(
  surface: Surface
) {
  const ratio =
    getAspectRatio(surface);

  if (
    surface.height <= 120 ||
    ratio >= 5
  ) {
    return "banner";
  }

  if (
    surface.width <= 450 &&
    surface.height >= 500
  ) {
    return "mobile";
  }

  if (
    surface.width <= 900 &&
    surface.height >= 600
  ) {
    return "tablet";
  }

  if (
    surface.width >= 1400 &&
    surface.height >= 700
  ) {
    return "billboard";
  }

  return "desktop";
}

/*
 * =========================================
 * CONTENT DENSITY
 * =========================================
 */

function getContentDensity(
  ad: AdContent
) {
  const textLength =
    getTextLength(ad);

  if (textLength <= 80) {
    return "low";
  }

  if (textLength <= 160) {
    return "medium";
  }

  if (textLength <= 240) {
    return "high";
  }

  return "very-high";
}

/*
 * =========================================
 * TYPOGRAPHY PRESSURE
 * =========================================
 */

function estimateFontScale(
  surface: Surface,
  ad: AdContent
) {
  const longestText =
    Math.max(
      getHeadlineLength(ad),
      getDescriptionLength(ad)
    );

  let scale = 1;

  /*
   * Narrow surfaces require
   * smaller typography.
   */
  if (surface.width < 500) {
    scale -= 0.08;
  }

  if (surface.width < 400) {
    scale -= 0.08;
  }

  if (surface.width < 300) {
    scale -= 0.1;
  }

  /*
   * Longer content creates
   * typography pressure.
   */
  if (longestText > 50) {
    scale -= 0.05;
  }

  if (longestText > 80) {
    scale -= 0.08;
  }

  if (longestText > 120) {
    scale -= 0.1;
  }

  if (longestText > 160) {
    scale -= 0.08;
  }

  return clamp(
    scale,
    0.5,
    1
  );
}

/*
 * =========================================
 * CONSTRAINT ENGINE
 * =========================================
 */

function evaluateConstraints(
  type: LayoutType,
  ad: AdContent,
  surface: Surface
): ConstraintStatus[] {
  const aspectRatio =
    getAspectRatio(surface);

  const textLength =
    getTextLength(ad);

  const density =
    getContentDensity(ad);

  const constraints: ConstraintStatus[] =
    [];

  /*
   * ---------------------------------------
   * Surface dimensions
   * ---------------------------------------
   */

  const dimensionsValid =
    surface.width >= 180 &&
    surface.height >= 60;

  constraints.push({
    id: "dimensions",

    label:
      "Minimum surface dimensions",

    passed: dimensionsValid,

    severity:
      dimensionsValid
        ? "success"
        : "error",

    detail: dimensionsValid
      ? "Surface has enough space for reliable rendering."
      : "Surface is too small for reliable rendering.",
  });

  /*
   * ---------------------------------------
   * Headline
   * ---------------------------------------
   */

  const headlineLength =
    ad.headline.length;

  const headlineReadable =
    headlineLength > 0 &&
    headlineLength <= 120;

  constraints.push({
    id: "headline",

    label:
      "Headline readability",

    passed: headlineReadable,

    severity:
      headlineReadable
        ? "success"
        : headlineLength === 0
        ? "error"
        : "warning",

    detail:
      headlineLength === 0
        ? "Headline content is missing."
        : headlineReadable
        ? "Headline fits within the recommended content range."
        : "Headline is unusually long and may require typography scaling.",
  });

  /*
   * ---------------------------------------
   * CTA
   * ---------------------------------------
   */

  const ctaValid =
    ad.cta.trim().length > 0;

  constraints.push({
    id: "cta",

    label:
      "CTA visibility",

    passed: ctaValid,

    severity:
      ctaValid
        ? "success"
        : "error",

    detail: ctaValid
      ? "CTA is available for rendering."
      : "CTA content is missing.",
  });

  /*
   * ---------------------------------------
   * Image
   * ---------------------------------------
   */

  const imageValid =
    ad.imageUrl.trim().length > 0;

  constraints.push({
    id: "image",

    label:
      "Image availability",

    passed: imageValid,

    severity:
      imageValid
        ? "success"
        : "warning",

    detail: imageValid
      ? "Visual asset is available."
      : "No image supplied.",
  });

  /*
   * ---------------------------------------
   * Layout aspect compatibility
   * ---------------------------------------
   */

  let aspectCompatible =
    true;

  let aspectDetail =
    "Surface proportions match this layout.";

  if (
    type === "horizontal"
  ) {
    aspectCompatible =
      aspectRatio >= 1.45;

    if (!aspectCompatible) {
      aspectDetail =
        "Horizontal layout requires a wider surface.";
    }
  }

  if (
    type === "stacked"
  ) {
    aspectCompatible =
      aspectRatio <= 1.8;

    if (!aspectCompatible) {
      aspectDetail =
        "Stacked layout is less efficient on very wide surfaces.";
    }
  }

  if (
    type === "overlay"
  ) {
    aspectCompatible =
      surface.width >= 500 &&
      surface.height >= 250;

    if (!aspectCompatible) {
      aspectDetail =
        "Overlay requires enough area for readable text over imagery.";
    }
  }

  if (
    type === "compact"
  ) {
    aspectCompatible =
      surface.height <= 180 ||
      aspectRatio >= 4;

    if (!aspectCompatible) {
      aspectDetail =
        "Compact layout is designed for short-height surfaces.";
    }
  }

  if (
    type === "image-focus"
  ) {
    aspectCompatible =
      surface.width >= 800 &&
      surface.height >= 400;

    if (!aspectCompatible) {
      aspectDetail =
        "Image-focus layout benefits from a large surface.";
    }
  }

  constraints.push({
    id: "aspect",

    label:
      "Layout aspect compatibility",

    passed: aspectCompatible,

    severity:
      aspectCompatible
        ? "success"
        : "warning",

    detail:
      aspectDetail,
  });

  /*
   * ---------------------------------------
   * Content density
   * ---------------------------------------
   */

  let densityValid =
    true;

  if (
    type === "compact"
  ) {
    densityValid =
      textLength <= 140;
  } else if (
    type === "overlay"
  ) {
    densityValid =
      textLength <= 220;
  } else {
    densityValid =
      textLength <= 260;
  }

  constraints.push({
    id: "text-space",

    label:
      "Content density",

    passed: densityValid,

    severity:
      densityValid
        ? "success"
        : "warning",

    detail:
      densityValid
        ? `${density} content density is within the recommended range.`
        : `${density} content density may reduce readability for this layout.`,
  });

  /*
   * ---------------------------------------
   * Typography pressure
   * ---------------------------------------
   */

  const fontScale =
    estimateFontScale(
      surface,
      ad
    );

  const typographyValid =
    fontScale >= 0.7;

  constraints.push({
    id: "typography",

    label:
      "Typography pressure",

    passed: typographyValid,

    severity:
      typographyValid
        ? "success"
        : "warning",

    detail:
      typographyValid
        ? "Typography can remain within a readable scale."
        : "Content requires significant typography reduction.",
  });

  return constraints;
}

/*
 * =========================================
 * LAYOUT EVALUATION
 * =========================================
 */

function evaluateLayout(
  type: LayoutType,
  ad: AdContent,
  surface: Surface
): LayoutCandidate {
  const aspectRatio =
    getAspectRatio(surface);

  const textLength =
    getTextLength(ad);

  const density =
    getContentDensity(ad);

  const surfaceClass =
    classifySurface(surface);

  const fontScale =
    estimateFontScale(
      surface,
      ad
    );

  const imageAspectRatio =
    getImageAspectRatio(ad);

  /*
   * Base metrics.
   */

  let contentFit = 78;

  let readability = 78;

  let ctaVisibility = 88;

  let imageVisibility = 82;

  let spacing = 82;

  const reasons: string[] =
    [];

  const violations: string[] =
    [];

  /*
   * =======================================
   * HORIZONTAL
   * =======================================
   */

  if (
    type === "horizontal"
  ) {
    if (
      aspectRatio >= 1.5
    ) {
      contentFit += 15;
      readability += 10;
      spacing += 6;

      reasons.push(
        "Wide surface provides strong side-by-side content space."
      );
    } else {
      contentFit -= 24;
      readability -= 18;
      spacing -= 12;

      violations.push(
        "Surface is not wide enough for an efficient horizontal composition."
      );
    }

    if (
      surfaceClass ===
      "desktop"
    ) {
      contentFit += 3;
      readability += 3;
    }

    if (
      surfaceClass ===
      "banner"
    ) {
      contentFit -= 20;
      readability -= 15;

      violations.push(
        "Banner surfaces favor a compact composition."
      );
    }

    if (
      imageAspectRatio < 0.9
    ) {
      imageVisibility -= 8;

      reasons.push(
        "Portrait imagery is less efficient in a horizontal split."
      );
    }

    if (
      textLength > 170
    ) {
      contentFit -= 12;
      readability -= 12;

      violations.push(
        "Long copy competes for limited horizontal space."
      );
    }
  }

  /*
   * =======================================
   * STACKED
   * =======================================
   */

  if (
    type === "stacked"
  ) {
    if (
      surface.width < 800 ||
      aspectRatio < 1.5
    ) {
      contentFit += 14;
      readability += 13;
      imageVisibility += 5;

      reasons.push(
        "Vertical composition handles constrained widths effectively."
      );
    } else {
      contentFit += 3;
      readability += 3;
    }

    if (
      density === "high" ||
      density === "very-high"
    ) {
      readability += 8;

      reasons.push(
        "Stacked content flow gives dense copy additional vertical room."
      );
    }

    if (
      surfaceClass ===
      "mobile"
    ) {
      contentFit += 7;
      readability += 7;

      reasons.push(
        "Mobile surface strongly favors vertical content flow."
      );
    }

    if (
      surface.height < 350
    ) {
      contentFit -= 16;
      spacing -= 12;

      violations.push(
        "Limited surface height reduces stacked-layout efficiency."
      );
    }

    if (
      aspectRatio > 2.2
    ) {
      contentFit -= 10;

      violations.push(
        "Very wide surfaces waste space in a stacked composition."
      );
    }
  }

  /*
   * =======================================
   * OVERLAY
   * =======================================
   */

  if (
    type === "overlay"
  ) {
    if (
      surface.width >= 500 &&
      surface.height >= 250
    ) {
      contentFit += 9;
      imageVisibility += 14;
      spacing += 3;

      reasons.push(
        "Surface is large enough for readable image-overlay content."
      );
    } else {
      contentFit -= 20;
      readability -= 22;

      violations.push(
        "Surface is too small for reliable overlay typography."
      );
    }

    if (
      imageAspectRatio >= 1.2
    ) {
      imageVisibility += 5;

      reasons.push(
        "Wide imagery works well behind overlay content."
      );
    }

    if (
      density ===
      "very-high"
    ) {
      readability -= 15;

      violations.push(
        "Very dense copy reduces overlay readability."
      );
    }

    if (
      textLength > 150
    ) {
      readability -= 10;

      violations.push(
        "Long copy competes with the background image."
      );
    }
  }

  /*
   * =======================================
   * COMPACT
   * =======================================
   */

  if (
    type === "compact"
  ) {
    if (
      surface.height <= 180 ||
      aspectRatio >= 4
    ) {
      contentFit += 20;
      spacing += 13;

      reasons.push(
        "Compact layout is optimized for short-height surfaces."
      );
    } else {
      contentFit -= 20;
      spacing -= 14;

      violations.push(
        "Surface has enough height for a richer composition."
      );
    }

    if (
      surfaceClass ===
      "banner"
    ) {
      contentFit += 7;
      readability += 7;

      reasons.push(
        "Banner surface strongly matches compact composition."
      );
    }

    if (
      textLength > 140
    ) {
      readability -= 22;

      violations.push(
        "Compact layout has limited room for long copy."
      );
    }

    if (
      ad.cta.length > 16
    ) {
      ctaVisibility -= 10;

      violations.push(
        "Long CTA requires additional horizontal button space."
      );
    }

    imageVisibility -= 5;
  }

  /*
   * =======================================
   * IMAGE FOCUS
   * =======================================
   */

  if (
    type === "image-focus"
  ) {
    if (
      surface.width >= 900 &&
      surface.height >= 500
    ) {
      imageVisibility += 17;
      contentFit += 8;
      spacing += 5;

      reasons.push(
        "Large surface allows an image-led composition."
      );
    } else {
      imageVisibility -= 14;
      contentFit -= 14;

      violations.push(
        "Image-focus layout benefits from a larger surface."
      );
    }

    if (
      surfaceClass ===
      "billboard"
    ) {
      imageVisibility += 7;
      contentFit += 5;

      reasons.push(
        "Billboard-scale surface supports image-dominant presentation."
      );
    }

    if (
      imageAspectRatio >= 1.3
    ) {
      imageVisibility += 4;
    }

    if (
      density ===
      "very-high"
    ) {
      readability -= 10;

      violations.push(
        "Dense copy competes with the image-led composition."
      );
    }

    if (
      textLength > 150
    ) {
      readability -= 8;
    }
  }

  /*
   * =======================================
   * GLOBAL TYPOGRAPHY
   * =======================================
   */

  if (
    fontScale < 0.8
  ) {
    readability -= 10;

    violations.push(
      "Content requires typography scaling."
    );
  }

  if (
    fontScale < 0.65
  ) {
    readability -= 10;

    violations.push(
      "Typography pressure is high for this surface."
    );
  }

  /*
   * =======================================
   * IMAGE QUALITY / RATIO
   * =======================================
   */

  if (
    !ad.imageUrl.trim()
  ) {
    imageVisibility -= 20;

    violations.push(
      "No image asset is available."
    );
  }

  /*
   * =======================================
   * CTA
   * =======================================
   */

  if (
    ad.cta.trim().length === 0
  ) {
    ctaVisibility = 20;

    violations.push(
      "CTA content is missing."
    );
  }

  if (
    ad.cta.length > 20
  ) {
    ctaVisibility -= 8;

    violations.push(
      "Long CTA text requires additional button space."
    );
  }

  /*
   * =======================================
   * VERY SMALL SURFACE
   * =======================================
   */

  if (
    surface.width < 300 ||
    surface.height < 100
  ) {
    readability -= 15;
    ctaVisibility -= 12;
    spacing -= 10;

    violations.push(
      "Very small surface limits readable content."
    );
  }

  /*
   * =======================================
   * CLAMP METRICS
   * =======================================
   */

  contentFit =
    clamp(
      contentFit,
      0,
      100
    );

  readability =
    clamp(
      readability,
      0,
      100
    );

  ctaVisibility =
    clamp(
      ctaVisibility,
      0,
      100
    );

  imageVisibility =
    clamp(
      imageVisibility,
      0,
      100
    );

  spacing =
    clamp(
      spacing,
      0,
      100
    );

  /*
   * =======================================
   * CONSTRAINT EVALUATION
   * =======================================
   */

  const constraints =
    evaluateConstraints(
      type,
      ad,
      surface
    );

  const passedConstraints =
    constraints.filter(
      (item) =>
        item.passed
    ).length;

  const constraintScore =
    constraints.length > 0
      ? (
          passedConstraints /
          constraints.length
        ) * 100
      : 0;

  /*
   * =======================================
   * FINAL WEIGHTED SCORE
   * =======================================
   *
   * Content fit        25%
   * Readability       23%
   * CTA visibility    17%
   * Image visibility  14%
   * Spacing             8%
   * Constraints        13%
   */

  const rawScore =
    contentFit * 0.25 +
    readability * 0.23 +
    ctaVisibility * 0.17 +
    imageVisibility * 0.14 +
    spacing * 0.08 +
    constraintScore * 0.13;

  /*
   * Apply a small penalty for every
   * explicit violation.
   */

  const violationPenalty =
    Math.min(
      violations.length * 1.5,
      10
    );

  const score = Math.round(
    clamp(
      rawScore -
        violationPenalty,
      0,
      100
    )
  );

  /*
   * =======================================
   * FINAL REASON
   * =======================================
   */

  if (
    score >= 90
  ) {
    reasons.push(
      "Excellent overall constraint compatibility."
    );
  } else if (
    score >= 80
  ) {
    reasons.push(
      "Good balance between content and available space."
    );
  } else if (
    score >= 65
  ) {
    reasons.push(
      "Layout is viable but has some constraint pressure."
    );
  } else {
    reasons.push(
      "Alternative layouts provide better constraint compatibility."
    );
  }

  /*
   * =======================================
   * RETURN CANDIDATE
   * =======================================
   */

  return {
    type,

    name:
      layoutNames[type],

    score,

    contentFit,

    readability,

    ctaVisibility,

    imageVisibility,

    spacing,

    fontScale,

    reasons,

    violations,

    constraints,
  };
}

/*
 * =========================================
 * PUBLIC ENGINE API
 * =========================================
 */

export function runLayoutEngine(
  ad: AdContent,
  surface: Surface
): LayoutResult {
  const layoutTypes: LayoutType[] =
    [
      "horizontal",
      "stacked",
      "overlay",
      "compact",
      "image-focus",
    ];

  const candidates =
    layoutTypes
      .map(
        (type) =>
          evaluateLayout(
            type,
            ad,
            surface
          )
      )
      .sort(
        (a, b) =>
          b.score -
          a.score
      );

  return {
    selected:
      candidates[0],

    candidates,
  };
}