/* tslint:disable */
/* eslint-disable */

export class Batch {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Updates a cell by its buffer index.
   */
  cellByIndex(idx: number, cell_data: Cell): void;
  /**
   * Updates a single cell at the given position.
   */
  cell(x: number, y: number, cell_data: Cell): void;
  /**
   * Fill a rectangular region
   */
  fill(x: number, y: number, width: number, height: number, cell_data: Cell): void;
  /**
   * Write text to the terminal
   */
  text(x: number, y: number, text: string, style: CellStyle): void;
  /**
   * Updates multiple cells from an array.
   * Each element should be [x, y, cellData].
   */
  cells(cells_json: any): void;
  /**
   * Clear the terminal with specified background color
   */
  clear(bg: number): void;
  /**
   * Synchronize all pending updates to the GPU
   */
  flush(): void;
}

export class BeamtermRenderer {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Detects an HTTP/HTTPS URL at or around the given cell position.
   *
   * Scans left from the position to find a URL scheme (`http://` or `https://`),
   * then scans right to find the URL end. Handles trailing punctuation and
   * unbalanced parentheses (e.g., Wikipedia URLs).
   *
   * Returns `undefined` if no URL is found at the position.
   *
   * **Note:** Only detects URLs within a single row. URLs that wrap across
   * multiple lines are not supported.
   *
   * # Example
   * ```javascript
   * // In a mouse handler:
   * renderer.setMouseHandler((event) => {
   *     const match = renderer.findUrlAt(event.col, event.row);
   *     if (match) {
   *         console.log("URL found:", match.url);
   *         // match.query can be used for highlighting
   *     }
   * });
   * ```
   */
  findUrlAt(col: number, row: number): UrlMatch | undefined;
  /**
   * Check if there is an active selection
   */
  hasSelection(): boolean;
  /**
   * Get the terminal dimensions in cells
   */
  terminalSize(): Size;
  /**
   * Clear any active selection
   */
  clearSelection(): void;
  /**
   * Enable default mouse selection behavior with built-in copy to clipboard
   */
  enableSelection(mode: SelectionMode, trim_whitespace: boolean): void;
  /**
   * Create a new render batch
   */
  batch(): Batch;
  /**
   * Copy text to the system clipboard
   */
  copyToClipboard(text: string): void;
  /**
   * Set a custom mouse event handler
   */
  setMouseHandler(handler: Function): void;
  /**
   * Create a terminal renderer with custom static font atlas data.
   *
   * # Arguments
   * * `canvas_id` - CSS selector for the canvas element
   * * `atlas_data` - Binary atlas data (from .atlas file), or null for default
   * * `auto_resize_canvas_css` - Whether to automatically set canvas CSS dimensions
   *   on resize. Set to `false` when external CSS (flexbox, grid) controls sizing.
   *   Defaults to `true` if not specified.
   */
  static withStaticAtlas(canvas_id: string, atlas_data?: Uint8Array | null, auto_resize_canvas_css?: boolean | null): BeamtermRenderer;
  /**
   * Create a terminal renderer with a dynamic font atlas using browser fonts.
   *
   * The dynamic atlas rasterizes glyphs on-demand using the browser's canvas API,
   * enabling support for any system font, emoji, and complex scripts.
   *
   * # Arguments
   * * `canvas_id` - CSS selector for the canvas element
   * * `font_family` - Array of font family names (e.g., `["Hack", "JetBrains Mono"]`)
   * * `font_size` - Font size in pixels
   * * `auto_resize_canvas_css` - Whether to automatically set canvas CSS dimensions
   *   on resize. Set to `false` when external CSS (flexbox, grid) controls sizing.
   *   Defaults to `true` if not specified.
   *
   * # Example
   * ```javascript
   * const renderer = BeamtermRenderer.withDynamicAtlas(
   *     "#terminal",
   *     ["JetBrains Mono", "Fira Code"],
   *     16.0
   * );
   * ```
   */
  static withDynamicAtlas(canvas_id: string, font_family: Array<any>, font_size: number, auto_resize_canvas_css?: boolean | null): BeamtermRenderer;
  /**
   * Replace the current font atlas with a new static atlas.
   *
   * This method enables runtime font switching by loading a new `.atlas` file.
   * All existing cell content is preserved and translated to the new atlas.
   *
   * # Arguments
   * * `atlas_data` - Binary atlas data (from .atlas file), or null for default
   *
   * # Example
   * ```javascript
   * const atlasData = await fetch('new-font.atlas').then(r => r.arrayBuffer());
   * renderer.replaceWithStaticAtlas(new Uint8Array(atlasData));
   * ```
   */
  replaceWithStaticAtlas(atlas_data?: Uint8Array | null): void;
  /**
   * Replace the current font atlas with a new dynamic atlas.
   *
   * This method enables runtime font switching by creating a new dynamic atlas
   * with the specified font family and size. All existing cell content is
   * preserved and translated to the new atlas.
   *
   * # Arguments
   * * `font_family` - Array of font family names (e.g., `["Hack", "JetBrains Mono"]`)
   * * `font_size` - Font size in pixels
   *
   * # Example
   * ```javascript
   * renderer.replaceWithDynamicAtlas(["Fira Code", "monospace"], 18.0);
   * ```
   */
  replaceWithDynamicAtlas(font_family: Array<any>, font_size: number): void;
  /**
   * Enable mouse selection with full configuration options.
   *
   * This method allows specifying modifier keys that must be held for selection
   * to activate, in addition to the selection mode and whitespace trimming.
   *
   * # Arguments
   * * `mode` - Selection mode (Block or Linear)
   * * `trim_whitespace` - Whether to trim trailing whitespace from selected text
   * * `require_modifiers` - Modifier keys that must be held to start selection
   *
   * # Example
   * ```javascript
   * // Require Shift+Click to start selection
   * renderer.enableSelectionWithOptions(
   *     SelectionMode.Linear,
   *     true,
   *     ModifierKeys.SHIFT
   * );
   *
   * // Require Ctrl+Shift+Click
   * renderer.enableSelectionWithOptions(
   *     SelectionMode.Block,
   *     false,
   *     ModifierKeys.CONTROL.or(ModifierKeys.SHIFT)
   * );
   * ```
   */
  enableSelectionWithOptions(mode: SelectionMode, trim_whitespace: boolean, require_modifiers: ModifierKeys): void;
  /**
   * Create a new terminal renderer with the default embedded font atlas.
   */
  constructor(canvas_id: string);
  /**
   * Render the terminal to the canvas
   */
  render(): void;
  /**
   * Resize the terminal to fit new canvas dimensions
   */
  resize(width: number, height: number): void;
  /**
   * Get selected text based on a cell query
   */
  getText(query: CellQuery): string;
  /**
   * Get the cell size in pixels
   */
  cellSize(): Size;
}

export class Cell {
  free(): void;
  [Symbol.dispose](): void;
  constructor(symbol: string, style: CellStyle);
  symbol: string;
  bg: number;
  fg: number;
  style: number;
}

export class CellQuery {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Configure whether to trim trailing whitespace from lines
   */
  trimTrailingWhitespace(enabled: boolean): CellQuery;
  /**
   * Set the ending position for the selection
   */
  end(col: number, row: number): CellQuery;
  /**
   * Create a new cell query with the specified selection mode
   */
  constructor(mode: SelectionMode);
  /**
   * Set the starting position for the selection
   */
  start(col: number, row: number): CellQuery;
  /**
   * Check if the query is empty (no selection range)
   */
  isEmpty(): boolean;
}

export class CellStyle {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Add strikethrough effect
   */
  strikethrough(): CellStyle;
  /**
   * Sets the background color
   */
  bg(color: number): CellStyle;
  /**
   * Sets the foreground color
   */
  fg(color: number): CellStyle;
  /**
   * Create a new TextStyle with default (normal) style
   */
  constructor();
  /**
   * Add bold style
   */
  bold(): CellStyle;
  /**
   * Add italic style
   */
  italic(): CellStyle;
  /**
   * Add underline effect
   */
  underline(): CellStyle;
  /**
   * Get the combined style bits
   */
  readonly bits: number;
}

export class ModifierKeys {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Combines two modifier key sets using bitwise OR
   */
  or(other: ModifierKeys): ModifierKeys;
  /**
   * Alt key (Option on macOS)
   */
  static readonly ALT: ModifierKeys;
  /**
   * Meta key (Command on macOS, Windows key on Windows)
   */
  static readonly META: ModifierKeys;
  /**
   * No modifier keys required
   */
  static readonly NONE: ModifierKeys;
  /**
   * Shift key
   */
  static readonly SHIFT: ModifierKeys;
  /**
   * Control key (Ctrl)
   */
  static readonly CONTROL: ModifierKeys;
}

export class MouseEvent {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Type of mouse event
   */
  event_type: MouseEventType;
  /**
   * Column in terminal grid (0-based)
   */
  col: number;
  /**
   * Row in terminal grid (0-based)
   */
  row: number;
  /**
   * Mouse button (0=left, 1=middle, 2=right)
   */
  button: number;
  /**
   * Whether Ctrl key was pressed
   */
  ctrl_key: boolean;
  /**
   * Whether Shift key was pressed
   */
  shift_key: boolean;
  /**
   * Whether Alt key was pressed
   */
  alt_key: boolean;
  /**
   * Whether Meta key was pressed (Command on macOS, Windows key on Windows)
   */
  meta_key: boolean;
}

/**
 * Type of mouse event
 */
export enum MouseEventType {
  /**
   * Mouse button pressed
   */
  MouseDown = 0,
  /**
   * Mouse button released
   */
  MouseUp = 1,
  /**
   * Mouse moved
   */
  MouseMove = 2,
  /**
   * Mouse button clicked (pressed and released)
   */
  Click = 3,
  /**
   * Mouse cursor entered the terminal area
   */
  MouseEnter = 4,
  /**
   * Mouse cursor left the terminal area
   */
  MouseLeave = 5,
}

/**
 * Selection mode for text selection in the terminal
 */
export enum SelectionMode {
  /**
   * Rectangular block selection
   */
  Block = 0,
  /**
   * Linear text flow selection
   */
  Linear = 1,
}

export class Size {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  width: number;
  height: number;
}

export class TerminalDebugApi {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Returns the symbol for a given glyph ID, or null if not found.
   */
  getSymbol(glyph_id: number): string | undefined;
  /**
   * Returns the cell size in pixels as an object with `width` and `height` fields.
   */
  getCellSize(): any;
  /**
   * Returns the canvas size in pixels as an object with `width` and `height` fields.
   */
  getCanvasSize(): any;
  /**
   * Returns the number of glyphs available in the font atlas.
   */
  getGlyphCount(): number;
  /**
   * Returns the base glyph ID for a given symbol, or null if not found.
   */
  getBaseGlyphId(symbol: string): number | undefined;
  getAtlasLookup(): Array<any>;
  /**
   * Returns the terminal size in cells as an object with `cols` and `rows` fields.
   */
  getTerminalSize(): any;
  /**
   * Returns an array of glyphs that were requested but not found in the font atlas.
   */
  getMissingGlyphs(): Array<any>;
}

export class UrlMatch {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Returns the detected URL string.
   */
  readonly url: string;
  /**
   * Returns a `CellQuery` for the URL's position in the terminal grid.
   *
   * This can be used for highlighting or extracting text.
   */
  readonly query: CellQuery;
}

export function cell(symbol: string, style: CellStyle): Cell;

/**
 * Initialize the WASM module
 */
export function main(): void;

export function style(): CellStyle;
