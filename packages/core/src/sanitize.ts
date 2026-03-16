import DOMPurify from "isomorphic-dompurify";

const ALLOWED_SVG_TAGS = [
  "svg",
  "g",
  "defs",
  "linearGradient",
  "stop",
  "path",
  "circle",
  "rect",
  "line",
  "polyline",
  "polygon",
  "ellipse",
  "text",
  "tspan",
];

const ALLOWED_STRUCTURAL_TAGS = [
  "style",
  "section",
  "article",
  "header",
  "footer",
  "main",
  "aside",
  "figure",
  "figcaption",
  "summary",
  "details",
];

const ALLOWED_ATTRIBUTES = [
  "aria-describedby",
  "aria-hidden",
  "aria-label",
  "aria-live",
  "class",
  "cx",
  "cy",
  "d",
  "data-sc-event",
  "data-sc-label",
  "data-sc-tool",
  "data-sc-variant",
  "disabled",
  "fill",
  "for",
  "height",
  "href",
  "id",
  "max",
  "min",
  "name",
  "offset",
  "opacity",
  "placeholder",
  "points",
  "preserveAspectRatio",
  "r",
  "rel",
  "role",
  "rx",
  "ry",
  "selected",
  "step",
  "stop-color",
  "stop-opacity",
  "stroke",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-width",
  "style",
  "target",
  "transform",
  "type",
  "value",
  "viewBox",
  "width",
  "x",
  "x1",
  "x2",
  "xmlns",
  "y",
  "y1",
  "y2",
];

export interface SanitizeWidgetOptions {
  allowUnsafeHtml?: boolean;
}

export function sanitizeWidgetHtml(
  html: string,
  options: SanitizeWidgetOptions = {},
): string {
  if (options.allowUnsafeHtml) {
    return html;
  }

  return DOMPurify.sanitize(html, {
    ADD_ATTR: ALLOWED_ATTRIBUTES,
    ADD_TAGS: [...ALLOWED_SVG_TAGS, ...ALLOWED_STRUCTURAL_TAGS],
    FORBID_TAGS: ["embed", "iframe", "object", "script"],
  });
}
