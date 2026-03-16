import type { GuidelineModule } from "./types";

const BASE_GUIDANCE = `# StreamCanvas Generative UI Guidelines

Design for progressive reveal. The first visible frame should explain itself before the widget is complete.

## Core rules
- Put structure and copy before decoration.
- Keep layouts readable on both 360px mobile widths and 1440px desktop widths.
- Use semantic sections and labels so the widget still communicates meaning without JavaScript.
- Prefer SVG and CSS to external libraries unless the use case clearly needs a runtime.
- Add 1-2 explicit actions per widget using data-sc-event or data-sc-tool attributes.`;

const MODULE_GUIDANCE: Record<GuidelineModule, string> = {
  chart: `## Chart
- Prefer inline SVG charts for the first render; they are reliable offline and stream well.
- Show the takeaway above the chart, not just the visualization.
- Use direct labels whenever possible instead of legends that force scanning.`,
  diagram: `## Diagram
- Use compact architecture diagrams with labeled lanes and arrows.
- Make relationships understandable without color alone.
- Keep arrow density low enough that the widget remains legible mid-stream.`,
  form: `## Form
- Forms should feel operational: clear primary action, concise helper text, safe defaults.
- Group related inputs into cards and expose the consequence of submission near the action button.
- When possible, post actions back to the host through data-sc-event or data-sc-tool attributes.`,
  interactive: `## Interactive
- Surface the current state in plain language before the control set.
- Buttons, toggles, and sliders should include nearby text describing what changes.
- Avoid dead controls. If interactivity depends on a host callback, make the button purpose explicit.`,
  mockup: `## Mockup
- Use editorial hierarchy: eyebrow, headline, supporting line, then the module content.
- Keep background treatments subtle so metrics and actions remain dominant.
- Make high-value states obvious: primary, warning, success, blocked.`,
};

export const AVAILABLE_GUIDELINE_MODULES = Object.keys(
  MODULE_GUIDANCE,
) as GuidelineModule[];

export function readGuidelines(modules: GuidelineModule[]): string {
  const uniqueModules = [...new Set(modules)];
  const sections = uniqueModules
    .filter((moduleName) => MODULE_GUIDANCE[moduleName])
    .map((moduleName) => MODULE_GUIDANCE[moduleName]);

  return [BASE_GUIDANCE, ...sections].join("\n\n");
}
