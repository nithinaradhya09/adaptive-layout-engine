import {
  CheckCircle2,
  AlertTriangle,
  Gauge,
  LayoutTemplate,
  Info,
  CircleAlert,
  BrainCircuit,
  Target,
} from "lucide-react";

import type { LayoutResult } from "../types";

interface Props {
  result: LayoutResult;

  onSelectLayout: (
    layout: LayoutResult["selected"]["type"]
  ) => void;

  imageRatio: string;
}

export default function InspectorPanel({
  result,
  onSelectLayout,
  imageRatio,
}: Props) {
  const selected = result.selected;

  /*
   * Count how many constraints passed.
   */
  const passedConstraints =
    selected.constraints.filter(
      (constraint) =>
        constraint.passed
    ).length;

  const totalConstraints =
    selected.constraints.length;

  /*
   * Calculate a simple confidence value
   * based on layout score + constraint health.
   *
   * This is an R&D presentation metric,
   * not a machine-learning probability.
   */
  const constraintHealth =
    totalConstraints > 0
      ? passedConstraints /
        totalConstraints
      : 0;

  const decisionConfidence = Math.min(
    99,
    Math.max(
      55,
      Math.round(
        selected.score * 0.8 +
          constraintHealth *
            100 *
            0.2
      )
    )
  );

  /*
   * Determine the overall engine status.
   */
  const engineStatus =
    selected.score >= 90
      ? "Excellent"
      : selected.score >= 80
      ? "Good"
      : selected.score >= 65
      ? "Review"
      : "Needs optimization";

  return (
    <aside className="panel inspector-panel">

      {/* =====================================
          HEADER
          ===================================== */}

      <div className="panel-heading">

        <div>

          <span className="eyebrow">
            ENGINE
          </span>

          <h2>
            Layout Intelligence
          </h2>

        </div>

        <Gauge size={18} />

      </div>

      {/* =====================================
          SCORE
          ===================================== */}

      <div className="score-card">

        <div className="score-top">

          <span>
            Layout quality
          </span>

          <strong>
            {selected.score}
          </strong>

        </div>

        <div className="score-bar">

          <div
            style={{
              width: `${selected.score}%`,
            }}
          />

        </div>

        <div className="score-bottom">

          <span className="score-label">
            {engineStatus}
          </span>

          <span className="score-max">
            / 100
          </span>

        </div>

      </div>

      {/* =====================================
          RECOMMENDATION
          ===================================== */}

      <div className="selected-layout">

        <span className="eyebrow">
          RECOMMENDED
        </span>

        <div className="selected-layout-row">

          <div className="layout-icon">
            <LayoutTemplate
              size={20}
            />
          </div>

          <div>

            <strong>
              {selected.name}
            </strong>

            <span>
              Automatically selected
            </span>

          </div>

        </div>

      </div>

      {/* =====================================
          DECISION CONFIDENCE
          ===================================== */}

      <div className="confidence-card">

        <div className="confidence-header">

          <div className="confidence-title">

            <BrainCircuit
              size={14}
            />

            <span>
              Decision confidence
            </span>

          </div>

          <strong>
            {decisionConfidence}%
          </strong>

        </div>

        <div className="confidence-bar">

          <div
            style={{
              width: `${decisionConfidence}%`,
            }}
          />

        </div>

        <p>
          Based on surface dimensions,
          content density and layout
          constraints.
        </p>

      </div>

      {/* =====================================
          METRICS
          ===================================== */}

      <div className="metrics">

        <Metric
          label="Content fit"
          value={selected.contentFit}
        />

        <Metric
          label="Readability"
          value={
            selected.readability
          }
        />

        <Metric
          label="CTA visibility"
          value={
            selected.ctaVisibility
          }
        />

        <Metric
          label="Image visibility"
          value={
            selected.imageVisibility
          }
        />

        <Metric
          label="Spacing"
          value={
            selected.spacing
          }
        />

      </div>

      {/* =====================================
          ENGINE REASONING
          ===================================== */}

      <div className="engine-section">

        <div className="engine-section-heading">

          <Info size={15} />

          Why this layout?

        </div>

        {selected.reasons.map(
          (reason, index) => (

            <div
              className="reason"
              key={`reason-${index}`}
            >

              <CheckCircle2
                size={14}
              />

              <span>
                {reason}
              </span>

            </div>

          )
        )}

        {selected.violations.map(
          (violation, index) => (

            <div
              className="reason warning"
              key={`violation-${index}`}
            >

              <AlertTriangle
                size={14}
              />

              <span>
                {violation}
              </span>

            </div>

          )
        )}

      </div>

      {/* =====================================
          CONSTRAINT CHECKS
          ===================================== */}

      <div className="engine-section">

        <div className="engine-section-heading">

          <CircleAlert
            size={15}
          />

          Constraint checks

        </div>

        <div className="constraint-list">

          {selected.constraints.map(
            (constraint) => (

              <div
                key={constraint.id}
                className={`constraint ${
                  constraint.passed
                    ? "passed"
                    : constraint.severity
                }`}
              >

                <div className="constraint-icon">

                  {constraint.passed ? (
                    <CheckCircle2
                      size={14}
                    />
                  ) : (
                    <AlertTriangle
                      size={14}
                    />
                  )}

                </div>

                <div>

                  <strong>
                    {constraint.label}
                  </strong>

                  <span>
                    {constraint.detail}
                  </span>

                </div>

              </div>

            )
          )}

        </div>

      </div>

      {/* =====================================
          ASSET ANALYSIS
          ===================================== */}

      <div className="asset-analysis">

        <div className="engine-section-heading">

          <Gauge size={15} />

          Asset analysis

        </div>

        <div className="asset-row">

          <span>
            Image aspect ratio
          </span>

          <strong>
            {imageRatio}
          </strong>

        </div>

        <div className="asset-row">

          <span>
            Detected layout
          </span>

          <strong>
            {selected.name}
          </strong>

        </div>

        <div className="asset-row">

          <span>
            Typography scale
          </span>

          <strong>
            {Math.round(
              selected.fontScale *
                100
            )}
            %
          </strong>

        </div>

        <div className="asset-row">

          <span>
            Constraints passed
          </span>

          <strong>
            {passedConstraints}/
            {totalConstraints}
          </strong>

        </div>

      </div>

      {/* =====================================
          CANDIDATE LAYOUTS
          ===================================== */}

      <div className="candidate-section">

        <div className="engine-section-heading">

          <Target size={15} />

          Candidate layouts

        </div>

        <div className="candidate-list">

          {result.candidates.map(
            (candidate, index) => (

              <button
                key={candidate.type}
                className={`candidate ${
                  candidate.type ===
                  selected.type
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  onSelectLayout(
                    candidate.type
                  )
                }
              >

                <div className="candidate-left">

                  <span className="candidate-rank">
                    {index + 1}
                  </span>

                  <span>
                    {candidate.name}
                  </span>

                </div>

                <strong>
                  {candidate.score}
                </strong>

              </button>

            )
          )}

        </div>

      </div>

    </aside>
  );
}

/* =========================================
   METRIC COMPONENT
   ========================================= */

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="metric">

      <div className="metric-top">

        <span>
          {label}
        </span>

        <strong>
          {value}%
        </strong>

      </div>

      <div className="metric-bar">

        <div
          style={{
            width: `${value}%`,
          }}
        />

      </div>

    </div>
  );
}