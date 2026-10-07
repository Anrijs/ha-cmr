import { LitElement, html, type PropertyDeclarations, type TemplateResult } from "lit";
import { PICTURE_FIELDS, PICTURE_LABELS, fireEvent, labelsFrom } from "./shared";
import type { HassLike } from "./types";
import { LINK_STYLE_FIELD } from "./routing";

interface StrategyConfig {
  type: string;
  entry_id?: string;
  title?: string;
  link_style?: "straight" | "elbow";
  background_opacity?: number;
  background_tile?: boolean;
}

const SCHEMA = [
  { name: "entry_id", selector: { config_entry: { integration: "cmr" } } },
  { name: "title", selector: { text: {} } },
  LINK_STYLE_FIELD,
  ...PICTURE_FIELDS,
];

const LABELS = labelsFrom({
  entry_id: "Controller (empty: the first one)",
  title: "Title shown in the dashboard header",
  link_style: "Map link style",
  ...PICTURE_LABELS,
});

/**
 * The GUI behind "Edit dashboard" on a generated CMR dashboard: which
 * controller it shows. Home Assistant only offers a GUI for custom
 * strategies through `getConfigElement`, not through a form schema.
 */
export class CmrStrategyEditor extends LitElement {
  static properties: PropertyDeclarations = {
    hass: { attribute: false },
    lovelace: { attribute: false },
    _config: { state: true },
  };

  declare hass: HassLike;
  declare _config: StrategyConfig;

  setConfig(config: StrategyConfig): void {
    this._config = { link_style: "straight", ...config };
  }

  connectedCallback(): void {
    super.connectedCallback();
    void ensureFormLoaded();
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._config) return html``;
    return html`<ha-form
      .hass=${this.hass}
      .data=${this._config}
      .schema=${SCHEMA}
      .computeLabel=${LABELS}
      @value-changed=${this._changed}
    ></ha-form>`;
  }

  private _changed(ev: CustomEvent<{ value: Partial<StrategyConfig> }>): void {
    ev.stopPropagation();
    const config: StrategyConfig = { ...this._config, ...ev.detail.value, type: this._config.type };
    for (const key of ["entry_id", "title"] as const) {
      if (!config[key]) delete config[key];
    }
    this._config = config;
    fireEvent(this, "config-changed", { config });
  }
}

/**
 * `ha-form` is part of Home Assistant's lazily loaded editor code. Asking a
 * built-in card for its editor loads it, the usual trick for custom editors.
 */
async function ensureFormLoaded(): Promise<void> {
  if (customElements.get("ha-form")) return;
  try {
    const helpers = await (window as unknown as { loadCardHelpers?: () => Promise<{ createCardElement: (c: object) => Promise<HTMLElement> }> })
      .loadCardHelpers?.();
    const card = await helpers?.createCardElement({ type: "entities", entities: [] });
    await (card?.constructor as unknown as { getConfigElement?: () => Promise<unknown> })?.getConfigElement?.();
  } catch {
    // The YAML editor still works without it.
  }
}
