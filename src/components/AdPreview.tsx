import type {
  CSSProperties,
  RefObject,
} from "react";

import {
  ArrowUpRight,
  ImageOff,
} from "lucide-react";

import type {
  AdContent,
  LayoutType,
  Surface,
} from "../types";

interface Props {
  ad: AdContent;
  surface: Surface;
  layout: LayoutType;
  fontScale?: number;
  previewRef?: RefObject<HTMLDivElement | null>;
}

const layoutLabels: Record<
  LayoutType,
  string
> = {
  horizontal: "Horizontal",
  stacked: "Stacked",
  overlay: "Image Overlay",
  compact: "Compact",
  "image-focus": "Image Focus",
};

export default function AdPreview({
  ad,
  surface,
  layout,
  fontScale = 1,
  previewRef,
}: Props) {
  /*
   * Keep the preview's natural aspect ratio
   * based on the selected target surface.
   */
  const previewStyle: CSSProperties = {
    aspectRatio: `${surface.width} / ${surface.height}`,
  };

  /*
   * CSS custom property used by the adaptive
   * typography system.
   */
  const contentStyle: CSSProperties = {
    "--font-scale": fontScale,
  } as CSSProperties;

  const hasImage =
    Boolean(ad.imageUrl);

  const hasCTA =
    ad.cta.trim().length > 0;

  const layoutLabel =
    layoutLabels[layout];

  return (
    <div
      className="preview-stage"
      ref={previewRef}
    >
      {/* =====================================
          PREVIEW HEADER
          ===================================== */}

      <div className="preview-meta">

        <div>

          <span className="eyebrow">
            LIVE PREVIEW
          </span>

          <h2>
            {surface.name} Surface
          </h2>

        </div>

        <div className="preview-meta-right">

          <div className="preview-layout-pill">
            {layoutLabel}
          </div>

          <div className="preview-dimensions">
            {surface.width} ×{" "}
            {surface.height}
          </div>

        </div>

      </div>

      {/* =====================================
          PREVIEW CANVAS
          ===================================== */}

      <div className="preview-frame-wrapper">

        <div
          className={`ad-preview ad-${layout}`}
          style={previewStyle}
          data-layout={layout}
          data-surface={surface.type}
        >

          {/* =================================
              IMAGE
              ================================= */}

          {hasImage ? (
            <img
              src={ad.imageUrl}
              alt={
                ad.headline ||
                `${ad.brand} advertisement`
              }
              className="ad-image"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="ad-image-placeholder">

              <ImageOff size={24} />

              <span>
                No image supplied
              </span>

            </div>
          )}

          {/* =================================
              CONTENT
              ================================= */}

          <div
            className="ad-content"
            style={contentStyle}
          >

            {/* BRAND */}

            {ad.brand.trim() && (
              <span className="ad-brand">
                {ad.brand}
              </span>
            )}

            {/* HEADLINE */}

            {ad.headline.trim() && (
              <h1>
                {ad.headline}
              </h1>
            )}

            {/* DESCRIPTION */}

            {ad.description.trim() && (
              <p>
                {ad.description}
              </p>
            )}

            {/* CTA */}

            {hasCTA && (
              <button
                className="ad-cta"
                type="button"
                aria-label={`Advertisement action: ${ad.cta}`}
              >
                {ad.cta}

                <ArrowUpRight
                  size={15}
                  aria-hidden="true"
                />
              </button>
            )}

          </div>

        </div>

      </div>

      {/* =====================================
          PREVIEW FOOTER
          ===================================== */}

      <div className="preview-footer">

        <span>
          Rendering{" "}
          <strong>
            {layoutLabel}
          </strong>{" "}
          layout
        </span>

        <span className="preview-engine-status">

          <span className="mini-status-dot" />

          Adaptive Engine active

        </span>

      </div>

    </div>
  );
}