import {
  Smartphone,
  Tablet,
  Monitor,
  RectangleHorizontal,
  Maximize,
  SlidersHorizontal,
} from "lucide-react";

import type {
  ReactNode,
} from "react";

import type {
  Surface,
  SurfaceType,
} from "../types";

import {
  surfaces,
} from "../data/templates";

interface Props {
  surface: Surface;
  onChange: (
    surface: Surface
  ) => void;
}

/*
 * =========================================
 * SURFACE ICONS
 * =========================================
 */

const icons: Record<
  SurfaceType,
  ReactNode
> = {
  mobile: (
    <Smartphone size={17} />
  ),

  tablet: (
    <Tablet size={17} />
  ),

  desktop: (
    <Monitor size={17} />
  ),

  banner: (
    <RectangleHorizontal
      size={17}
    />
  ),

  billboard: (
    <Maximize size={17} />
  ),

  custom: (
    <SlidersHorizontal
      size={17}
    />
  ),
};

/*
 * =========================================
 * COMPONENT
 * =========================================
 */

export default function SurfaceSelector({
  surface,
  onChange,
}: Props) {

  /*
   * Determine whether a surface card
   * represents the currently selected
   * dimensions.
   *
   * We intentionally compare dimensions
   * instead of only SurfaceType because
   * multiple surfaces can share the same
   * type.
   */

  const isSelected = (
    candidate: Surface
  ) => {
    return (
      candidate.width ===
        surface.width &&
      candidate.height ===
        surface.height &&
      candidate.type ===
        surface.type
    );
  };

  /*
   * Select a predefined surface.
   */

  const selectSurface = (
    selected: Surface
  ) => {
    onChange({
      ...selected,
    });
  };

  /*
   * Update custom width while keeping
   * the rest of the current surface.
   */

  const updateWidth = (
    value: number
  ) => {
    onChange({
      ...surface,
      type: "custom",
      name: "Custom",
      width: Math.max(
        100,
        value
      ),
    });
  };

  /*
   * Update custom height.
   */

  const updateHeight = (
    value: number
  ) => {
    onChange({
      ...surface,
      type: "custom",
      name: "Custom",
      height: Math.max(
        60,
        value
      ),
    });
  };

  return (
    <div className="surface-section">

      {/* =====================================
          SECTION HEADER
          ===================================== */}

      <div className="section-title">

        <div>

          <span className="eyebrow">
            SURFACE
          </span>

          <h2>
            Target Surface
          </h2>

        </div>

        <span className="dimension-pill">

          {surface.width} ×{" "}
          {surface.height}

        </span>

      </div>

      {/* =====================================
          PREDEFINED SURFACES
          ===================================== */}

      <div className="surface-grid">

        {surfaces.map(
          (item, index) => {

            const selected =
              isSelected(item);

            return (
              <button
                key={`${item.type}-${item.width}-${item.height}-${index}`}
                type="button"
                className={`surface-card ${
                  selected
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  selectSurface(item)
                }
                aria-pressed={
                  selected
                }
              >

                <div className="surface-card-icon">
                  {icons[item.type]}
                </div>

                <strong>
                  {item.name}
                </strong>

                <span>
                  {item.width} ×{" "}
                  {item.height}
                </span>

                {selected && (
                  <span className="surface-selected">
                    Active
                  </span>
                )}

              </button>
            );
          }
        )}

      </div>

      {/* =====================================
          CUSTOM SURFACE
          ===================================== */}

      <div
        className={`custom-surface ${
          surface.type === "custom"
            ? "active"
            : ""
        }`}
      >

        <div className="custom-heading">

          <div className="custom-heading-left">

            <SlidersHorizontal
              size={15}
            />

            <span>
              Custom dimensions
            </span>

          </div>

          {surface.type ===
            "custom" && (
            <span className="custom-active">
              ACTIVE
            </span>
          )}

        </div>

        <div className="dimension-inputs">

          {/* WIDTH */}

          <div className="dimension-field">

            <label>
              Width
            </label>

            <input
              type="number"
              min="100"
              max="4000"
              value={surface.width}
              onChange={(e) =>
                updateWidth(
                  Number(
                    e.target.value
                  )
                )
              }
              aria-label="Custom surface width"
            />

          </div>

          <span className="dimension-separator">
            ×
          </span>

          {/* HEIGHT */}

          <div className="dimension-field">

            <label>
              Height
            </label>

            <input
              type="number"
              min="60"
              max="4000"
              value={surface.height}
              onChange={(e) =>
                updateHeight(
                  Number(
                    e.target.value
                  )
                )
              }
              aria-label="Custom surface height"
            />

          </div>

        </div>

        <div className="custom-help">
          Define any surface dimensions and
          let the engine recalculate the
          optimal layout.
        </div>

      </div>

    </div>
  );
}