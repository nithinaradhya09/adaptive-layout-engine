import html2canvas from "html2canvas";
import {
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Zap,
  RotateCcw,
  Sparkles,
  GitCompare,
  Settings2,
  WandSparkles,
} from "lucide-react";

import AdEditor from "./components/AdEditor";
import AdPreview from "./components/AdPreview";
import InspectorPanel from "./components/InspectorPanel";
import SurfaceSelector from "./components/SurfaceSelector";

import {
  defaultAd,
  surfaces,
} from "./data/templates";

import {
  runLayoutEngine,
} from "./engine/layoutEngine";

import type {
  AdContent,
  LayoutType,
  Surface,
} from "./types";

function App() {
  const [ad, setAd] =
    useState<AdContent>(defaultAd);

  const previewRef =
    useRef<HTMLDivElement | null>(null);

  const [surface, setSurface] =
    useState<Surface>(surfaces[2]);

  const [mode, setMode] =
    useState<"auto" | "manual">("auto");

  const [manualLayout, setManualLayout] =
    useState<LayoutType>("horizontal");

  const [showComparison, setShowComparison] =
    useState(false);

  /*
   * Run the adaptive layout engine whenever
   * ad content or surface dimensions change.
   */
  const result = useMemo(
    () =>
      runLayoutEngine(
        ad,
        surface
      ),
    [ad, surface]
  );

  /*
   * Determine which layout is currently
   * being displayed.
   */
  const activeLayout =
    mode === "auto"
      ? result.selected.type
      : manualLayout;

  /*
   * Get the complete information about
   * the currently displayed layout.
   */
  const activeCandidate =
    mode === "auto"
      ? result.selected
      : result.candidates.find(
          (candidate) =>
            candidate.type === manualLayout
        ) ?? result.selected;

  /*
   * Calculate the actual image aspect ratio
   * detected by the browser.
   */
  const imageRatio =
    ad.imageWidth &&
    ad.imageHeight
      ? (
          ad.imageWidth /
          ad.imageHeight
        ).toFixed(2)
      : "—";

  /*
   * Reset the entire workspace.
   */
  const reset = () => {
    setAd(defaultAd);
    setSurface(surfaces[2]);
    setMode("auto");
    setManualLayout("horizontal");
    setShowComparison(false);
  };

  /*
   * Change target surface.
   */
  const handleSurfaceChange = (
    newSurface: Surface
  ) => {
    setSurface(newSurface);

    /*
     * Let the engine recalculate the
     * best layout for the new surface.
     */
    setMode("auto");
  };

  /*
   * Manually select a layout.
   */
  const handleLayoutSelection = (
    layout: LayoutType
  ) => {
    setManualLayout(layout);
    setMode("manual");
  };

  /*
   * Export the current advertisement preview
   * as a PNG image.
   */
  const exportAd = async () => {
    if (!previewRef.current) {
      return;
    }

    try {
      const canvas =
        await html2canvas(
          previewRef.current,
          {
            backgroundColor: "#0c0d10",
            useCORS: true,
            scale: 2,
          }
        );

      const link =
        document.createElement("a");

      link.download =
        `adaptiflow-${activeLayout}.png`;

      link.href =
        canvas.toDataURL("image/png");

      link.click();
    } catch (error) {
      console.error(
        "Export failed:",
        error
      );

      alert(
        "Unable to export the preview."
      );
    }
  };

  return (
    <div className="app-shell">

      {/* =====================================
          HEADER
          ===================================== */}

      <header className="topbar">

        <div className="brand">

          <div className="brand-mark">
            <Zap
              size={17}
              fill="currentColor"
            />
          </div>

          <div>
            <div className="brand-name">
              AdaptiFlow
            </div>

            <div className="brand-subtitle">
              Adaptive Layout Engine
            </div>
          </div>

        </div>

        <div className="topbar-actions">

          <div className="status">
            <span className="status-dot" />
            Engine online
          </div>

          {/* Export */}

          <button
            className="header-button export-button"
            onClick={exportAd}
          >
            Export
          </button>

          {/* Compare */}

          <button
            className={`header-button ${
              showComparison
                ? "active"
                : ""
            }`}
            onClick={() =>
              setShowComparison(
                (previous) =>
                  !previous
              )
            }
          >
            <GitCompare size={16} />

            Compare
          </button>

          {/* Settings */}

          <button className="header-button">
            <Settings2 size={16} />

            Settings
          </button>

          {/* Reset */}

          <button
            className="reset-button"
            onClick={reset}
            title="Reset workspace"
          >
            <RotateCcw size={16} />
          </button>

        </div>

      </header>

      {/* =====================================
          MAIN WORKSPACE
          ===================================== */}

      <main className="workspace">

        {/* =================================
            LEFT PANEL
            ================================= */}

        <AdEditor
          ad={ad}
          onChange={(newAd) => {
            setAd(newAd);

            /*
             * Any content change should allow
             * the engine to recalculate.
             */
            setMode("auto");
          }}
          onImageAnalyzed={(
            width,
            height
          ) => {
            setAd((previous) => ({
              ...previous,
              imageWidth: width,
              imageHeight: height,
            }));
          }}
        />

        {/* =================================
            CENTER CANVAS
            ================================= */}

        <section className="main-canvas">

          {/* Header */}

          <div className="canvas-header">

            <div>

              <span className="eyebrow">
                MULTI-SURFACE PREVIEW
              </span>

              <h1>
                Design once.
                <span>
                  {" "}
                  Adapt everywhere.
                </span>
              </h1>

            </div>

            <div className="engine-badge">

              <Sparkles size={15} />

              Constraint engine active

            </div>

          </div>

          {/* =================================
              LAYOUT MODE
              ================================= */}

          <div className="mode-switcher">

            <div>

              <span className="eyebrow">
                LAYOUT MODE
              </span>

              <strong>
                {mode === "auto"
                  ? "Automatic optimization"
                  : "Manual selection"}
              </strong>

            </div>

            <div className="mode-buttons">

              <button
                className={
                  mode === "auto"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setMode("auto")
                }
              >
                <WandSparkles
                  size={14}
                />

                Auto
              </button>

              <button
                className={
                  mode === "manual"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setMode("manual")
                }
              >
                Manual
              </button>

            </div>

          </div>

          {/* =================================
              SURFACE SELECTOR
              ================================= */}

          <SurfaceSelector
            surface={surface}
            onChange={
              handleSurfaceChange
            }
          />

          {/* =================================
              LIVE PREVIEW
              ================================= */}

          <AdPreview
            ad={ad}
            surface={surface}
            layout={activeLayout}
            fontScale={
              activeCandidate.fontScale
            }
            previewRef={previewRef}
          />

          {/* =================================
              MANUAL MODE NOTICE
              ================================= */}

          {mode === "manual" && (
            <div className="manual-notice">

              <div>

                <span>
                  Manual layout
                </span>

                <strong>
                  {activeCandidate.name}
                </strong>

              </div>

              <button
                onClick={() =>
                  setMode("auto")
                }
              >
                Return to Auto
              </button>

            </div>
          )}

          {/* =================================
              COMPARISON
              ================================= */}

          {showComparison && (
            <div className="comparison">

              <div className="comparison-heading">

                <div>

                  <span className="eyebrow">
                    LAYOUT COMPARISON
                  </span>

                  <h2>
                    Candidate performance
                  </h2>

                </div>

              </div>

              <div className="comparison-grid">

                {result.candidates.map(
                  (candidate) => (

                    <button
                      key={
                        candidate.type
                      }
                      className={`comparison-card ${
                        candidate.type ===
                        result.selected.type
                          ? "recommended"
                          : ""
                      }`}
                      onClick={() =>
                        handleLayoutSelection(
                          candidate.type
                        )
                      }
                    >

                      {candidate.type ===
                        result.selected.type && (
                        <span className="recommended-label">
                          Recommended
                        </span>
                      )}

                      <div className="comparison-layout">

                        <div
                          className={`mini-ad mini-${candidate.type}`}
                        >
                          <div />
                          <div />
                        </div>

                      </div>

                      <div className="comparison-info">

                        <strong>
                          {candidate.name}
                        </strong>

                        <span>
                          Score{" "}
                          <b>
                            {
                              candidate.score
                            }
                            /100
                          </b>
                        </span>

                      </div>

                    </button>

                  )
                )}

              </div>

            </div>
          )}

        </section>

        {/* =================================
            RIGHT INSPECTOR
            ================================= */}

        <InspectorPanel
          result={result}
          imageRatio={imageRatio}
          onSelectLayout={
            handleLayoutSelection
          }
        />

      </main>

      {/* =====================================
          FOOTER
          ===================================== */}

      <footer className="footer">

        <span>
          AdaptiFlow · Adaptive Layout Engine
        </span>

        <span>
          React · TypeScript · Constraint
          based rendering
        </span>

      </footer>

    </div>
  );
}

export default App;