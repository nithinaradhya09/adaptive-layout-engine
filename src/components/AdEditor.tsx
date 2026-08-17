import {
  Image as ImageIcon,
  Type,
  Tag,
  FileText,
  Sparkles,
} from "lucide-react";

import type { AdContent } from "../types";
import { templates } from "../data/templates";

interface Props {
  ad: AdContent;
  onChange: (ad: AdContent) => void;
  onImageAnalyzed: (
    width: number,
    height: number
  ) => void;
}

export default function AdEditor({
  ad,
  onChange,
  onImageAnalyzed,
}: Props) {
  /*
   * Update a text-based ad property.
   */
  const update = (
    field: keyof AdContent,
    value: string
  ) => {
    onChange({
      ...ad,
      [field]: value,
    });
  };

  /*
   * Analyze an image URL using the browser's
   * native Image API.
   *
   * This gives the layout engine the actual
   * image dimensions instead of guessing them.
   */
  const analyzeImage = (url: string) => {
    if (!url.trim()) {
      return;
    }

    const image =
      new window.Image();

    image.onload = () => {
      onImageAnalyzed(
        image.naturalWidth,
        image.naturalHeight
      );
    };

    image.onerror = () => {
      console.warn(
        "Unable to analyze image dimensions."
      );
    };

    image.src = url;
  };

  /*
   * Load a predefined ad template.
   */
  const loadTemplate = (
    name: string
  ) => {
    const selectedTemplate =
      templates[name];

    if (!selectedTemplate) {
      return;
    }

    onChange({
      ...selectedTemplate,
    });

    /*
     * Analyze the template image as well.
     */
    if (selectedTemplate.imageUrl) {
      analyzeImage(
        selectedTemplate.imageUrl
      );
    }
  };

  return (
    <aside className="panel editor-panel">

      {/* =====================================
          HEADER
          ===================================== */}

      <div className="panel-heading">

        <div>

          <span className="eyebrow">
            CONTENT
          </span>

          <h2>
            Ad Configuration
          </h2>

        </div>

        <Sparkles size={18} />

      </div>

      {/* =====================================
          TEMPLATES
          ===================================== */}

      <div className="template-row">

        {Object.keys(templates).map(
          (template) => (

            <button
              key={template}
              className={`template-button ${
                ad.template === template
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                loadTemplate(template)
              }
            >
              {template}
            </button>

          )
        )}

      </div>

      {/* =====================================
          BRAND
          ===================================== */}

      <div className="field">

        <label>
          <Tag size={14} />
          Brand
        </label>

        <input
          value={ad.brand}
          onChange={(e) =>
            update(
              "brand",
              e.target.value
            )
          }
          placeholder="Brand name"
        />

      </div>

      {/* =====================================
          HEADLINE
          ===================================== */}

      <div className="field">

        <label>
          <Type size={14} />
          Headline
        </label>

        <textarea
          value={ad.headline}
          onChange={(e) =>
            update(
              "headline",
              e.target.value
            )
          }
          placeholder="Main headline"
          rows={3}
        />

        <span className="character-count">
          {ad.headline.length} characters
        </span>

      </div>

      {/* =====================================
          DESCRIPTION
          ===================================== */}

      <div className="field">

        <label>
          <FileText size={14} />
          Description
        </label>

        <textarea
          value={ad.description}
          onChange={(e) =>
            update(
              "description",
              e.target.value
            )
          }
          placeholder="Supporting description"
          rows={4}
        />

        <span className="character-count">
          {ad.description.length} characters
        </span>

      </div>

      {/* =====================================
          CTA
          ===================================== */}

      <div className="field">

        <label>
          <Sparkles size={14} />
          CTA
        </label>

        <input
          value={ad.cta}
          onChange={(e) =>
            update(
              "cta",
              e.target.value
            )
          }
          placeholder="Call to action"
        />

        <span className="character-count">
          {ad.cta.length} characters
        </span>

      </div>

      {/* =====================================
          IMAGE URL
          ===================================== */}

      <div className="field">

        <label>
          <ImageIcon size={14} />
          Image URL
        </label>

        <input
          value={ad.imageUrl}
          onChange={(e) => {
            const url =
              e.target.value;

            update(
              "imageUrl",
              url
            );

            /*
             * Analyze the image whenever
             * the URL changes.
             */
            if (url.trim()) {
              analyzeImage(url);
            }
          }}
          placeholder="https://..."
        />

        {/* =================================
            IMAGE ANALYSIS INFO
            ================================= */}

        {ad.imageWidth &&
          ad.imageHeight && (
            <div className="image-analysis">

              <div>
                <span>
                  Detected dimensions
                </span>

                <strong>
                  {ad.imageWidth} ×{" "}
                  {ad.imageHeight}
                </strong>
              </div>

              <div>
                <span>
                  Aspect ratio
                </span>

                <strong>
                  {(
                    ad.imageWidth /
                    ad.imageHeight
                  ).toFixed(2)}
                </strong>
              </div>

            </div>
          )}

      </div>

    </aside>
  );
}