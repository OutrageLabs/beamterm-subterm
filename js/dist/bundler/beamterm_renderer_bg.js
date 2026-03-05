let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => state.dtor(state.a, state.b));

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function getArrayF32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

let cachedFloat32ArrayMemory0 = null;
function getFloat32ArrayMemory0() {
    if (cachedFloat32ArrayMemory0 === null || cachedFloat32ArrayMemory0.byteLength === 0) {
        cachedFloat32ArrayMemory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachedFloat32ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {

        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            state.a = a;
            real._wbg_cb_unref();
        }
    };
    real._wbg_cb_unref = () => {
        if (--state.cnt === 0) {
            state.dtor(state.a, state.b);
            state.a = 0;
            CLOSURE_DTORS.unregister(state);
        }
    };
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_externrefs.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    }
}

let WASM_VECTOR_LEN = 0;

function wasm_bindgen__convert__closures_____invoke__h5e1acc0fc387699a(arg0, arg1, arg2) {
    wasm.wasm_bindgen__convert__closures_____invoke__h5e1acc0fc387699a(arg0, arg1, arg2);
}

function wasm_bindgen__convert__closures_____invoke__hf49cfe0d95b75ac3(arg0, arg1, arg2) {
    wasm.wasm_bindgen__convert__closures_____invoke__hf49cfe0d95b75ac3(arg0, arg1, arg2);
}

const BatchFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_batch_free(ptr >>> 0, 1));

const BeamtermRendererFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_beamtermrenderer_free(ptr >>> 0, 1));

const CellFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_cell_free(ptr >>> 0, 1));

const CellQueryFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_cellquery_free(ptr >>> 0, 1));

const CellStyleFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_cellstyle_free(ptr >>> 0, 1));

const ModifierKeysFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_modifierkeys_free(ptr >>> 0, 1));

const MouseEventFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_mouseevent_free(ptr >>> 0, 1));

const SizeFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_size_free(ptr >>> 0, 1));

const TerminalDebugApiFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_terminaldebugapi_free(ptr >>> 0, 1));

const UrlMatchFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_urlmatch_free(ptr >>> 0, 1));

export class Batch {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Batch.prototype);
        obj.__wbg_ptr = ptr;
        BatchFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BatchFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_batch_free(ptr, 0);
    }
    /**
     * Updates a cell by its buffer index.
     * @param {number} idx
     * @param {Cell} cell_data
     */
    cellByIndex(idx, cell_data) {
        _assertClass(cell_data, Cell);
        wasm.batch_cellByIndex(this.__wbg_ptr, idx, cell_data.__wbg_ptr);
    }
    /**
     * Updates a single cell at the given position.
     * @param {number} x
     * @param {number} y
     * @param {Cell} cell_data
     */
    cell(x, y, cell_data) {
        _assertClass(cell_data, Cell);
        wasm.batch_cell(this.__wbg_ptr, x, y, cell_data.__wbg_ptr);
    }
    /**
     * Fill a rectangular region
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {Cell} cell_data
     */
    fill(x, y, width, height, cell_data) {
        _assertClass(cell_data, Cell);
        const ret = wasm.batch_fill(this.__wbg_ptr, x, y, width, height, cell_data.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Write text to the terminal
     * @param {number} x
     * @param {number} y
     * @param {string} text
     * @param {CellStyle} style
     */
    text(x, y, text, style) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(style, CellStyle);
        const ret = wasm.batch_text(this.__wbg_ptr, x, y, ptr0, len0, style.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Updates multiple cells from an array.
     * Each element should be [x, y, cellData].
     * @param {any} cells_json
     */
    cells(cells_json) {
        const ret = wasm.batch_cells(this.__wbg_ptr, cells_json);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Clear the terminal with specified background color
     * @param {number} bg
     */
    clear(bg) {
        const ret = wasm.batch_clear(this.__wbg_ptr, bg);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Synchronize all pending updates to the GPU
     */
    flush() {
        const ret = wasm.batch_flush(this.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
}
if (Symbol.dispose) Batch.prototype[Symbol.dispose] = Batch.prototype.free;

/**
 * JavaScript wrapper for the terminal renderer
 */
export class BeamtermRenderer {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(BeamtermRenderer.prototype);
        obj.__wbg_ptr = ptr;
        BeamtermRendererFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BeamtermRendererFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_beamtermrenderer_free(ptr, 0);
    }
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
     * @param {number} col
     * @param {number} row
     * @returns {UrlMatch | undefined}
     */
    findUrlAt(col, row) {
        const ret = wasm.beamtermrenderer_findUrlAt(this.__wbg_ptr, col, row);
        return ret === 0 ? undefined : UrlMatch.__wrap(ret);
    }
    /**
     * Check if there is an active selection
     * @returns {boolean}
     */
    hasSelection() {
        const ret = wasm.beamtermrenderer_hasSelection(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Get the terminal dimensions in cells
     * @returns {Size}
     */
    terminalSize() {
        const ret = wasm.beamtermrenderer_terminalSize(this.__wbg_ptr);
        return Size.__wrap(ret);
    }
    /**
     * Clear any active selection
     */
    clearSelection() {
        wasm.beamtermrenderer_clearSelection(this.__wbg_ptr);
    }
    /**
     * Enable default mouse selection behavior with built-in copy to clipboard
     * @param {SelectionMode} mode
     * @param {boolean} trim_whitespace
     */
    enableSelection(mode, trim_whitespace) {
        const ret = wasm.beamtermrenderer_enableSelection(this.__wbg_ptr, mode, trim_whitespace);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Create a new render batch
     * @returns {Batch}
     */
    batch() {
        const ret = wasm.beamtermrenderer_batch(this.__wbg_ptr);
        return Batch.__wrap(ret);
    }
    /**
     * Copy text to the system clipboard
     * @param {string} text
     */
    copyToClipboard(text) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.beamtermrenderer_copyToClipboard(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * Set a custom mouse event handler
     * @param {Function} handler
     */
    setMouseHandler(handler) {
        const ret = wasm.beamtermrenderer_setMouseHandler(this.__wbg_ptr, handler);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Create a terminal renderer with custom static font atlas data.
     *
     * # Arguments
     * * `canvas_id` - CSS selector for the canvas element
     * * `atlas_data` - Binary atlas data (from .atlas file), or null for default
     * * `auto_resize_canvas_css` - Whether to automatically set canvas CSS dimensions
     *   on resize. Set to `false` when external CSS (flexbox, grid) controls sizing.
     *   Defaults to `true` if not specified.
     * @param {string} canvas_id
     * @param {Uint8Array | null} [atlas_data]
     * @param {boolean | null} [auto_resize_canvas_css]
     * @returns {BeamtermRenderer}
     */
    static withStaticAtlas(canvas_id, atlas_data, auto_resize_canvas_css) {
        const ptr0 = passStringToWasm0(canvas_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.beamtermrenderer_withStaticAtlas(ptr0, len0, isLikeNone(atlas_data) ? 0 : addToExternrefTable0(atlas_data), isLikeNone(auto_resize_canvas_css) ? 0xFFFFFF : auto_resize_canvas_css ? 1 : 0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return BeamtermRenderer.__wrap(ret[0]);
    }
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
     * @param {string} canvas_id
     * @param {Array<any>} font_family
     * @param {number} font_size
     * @param {boolean | null} [auto_resize_canvas_css]
     * @returns {BeamtermRenderer}
     */
    static withDynamicAtlas(canvas_id, font_family, font_size, auto_resize_canvas_css) {
        const ptr0 = passStringToWasm0(canvas_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.beamtermrenderer_withDynamicAtlas(ptr0, len0, font_family, font_size, isLikeNone(auto_resize_canvas_css) ? 0xFFFFFF : auto_resize_canvas_css ? 1 : 0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return BeamtermRenderer.__wrap(ret[0]);
    }
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
     * @param {Uint8Array | null} [atlas_data]
     */
    replaceWithStaticAtlas(atlas_data) {
        const ret = wasm.beamtermrenderer_replaceWithStaticAtlas(this.__wbg_ptr, isLikeNone(atlas_data) ? 0 : addToExternrefTable0(atlas_data));
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
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
     * @param {Array<any>} font_family
     * @param {number} font_size
     */
    replaceWithDynamicAtlas(font_family, font_size) {
        const ret = wasm.beamtermrenderer_replaceWithDynamicAtlas(this.__wbg_ptr, font_family, font_size);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
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
     * @param {SelectionMode} mode
     * @param {boolean} trim_whitespace
     * @param {ModifierKeys} require_modifiers
     */
    enableSelectionWithOptions(mode, trim_whitespace, require_modifiers) {
        _assertClass(require_modifiers, ModifierKeys);
        const ret = wasm.beamtermrenderer_enableSelectionWithOptions(this.__wbg_ptr, mode, trim_whitespace, require_modifiers.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Create a new terminal renderer with the default embedded font atlas.
     * @param {string} canvas_id
     */
    constructor(canvas_id) {
        const ptr0 = passStringToWasm0(canvas_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.beamtermrenderer_new(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        BeamtermRendererFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Render the terminal to the canvas
     */
    render() {
        wasm.beamtermrenderer_render(this.__wbg_ptr);
    }
    /**
     * Resize the terminal to fit new canvas dimensions
     * @param {number} width
     * @param {number} height
     */
    resize(width, height) {
        const ret = wasm.beamtermrenderer_resize(this.__wbg_ptr, width, height);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Get selected text based on a cell query
     * @param {CellQuery} query
     * @returns {string}
     */
    getText(query) {
        let deferred1_0;
        let deferred1_1;
        try {
            _assertClass(query, CellQuery);
            const ret = wasm.beamtermrenderer_getText(this.__wbg_ptr, query.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get the cell size in pixels
     * @returns {Size}
     */
    cellSize() {
        const ret = wasm.beamtermrenderer_cellSize(this.__wbg_ptr);
        return Size.__wrap(ret);
    }
}
if (Symbol.dispose) BeamtermRenderer.prototype[Symbol.dispose] = BeamtermRenderer.prototype.free;

/**
 * JavaScript wrapper for cell data
 */
export class Cell {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Cell.prototype);
        obj.__wbg_ptr = ptr;
        CellFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CellFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_cell_free(ptr, 0);
    }
    /**
     * @param {string} symbol
     */
    set symbol(symbol) {
        const ptr0 = passStringToWasm0(symbol, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.cell_set_symbol(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {number}
     */
    get bg() {
        const ret = wasm.cell_bg(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get fg() {
        const ret = wasm.cell_fg(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {string} symbol
     * @param {CellStyle} style
     */
    constructor(symbol, style) {
        const ptr0 = passStringToWasm0(symbol, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(style, CellStyle);
        const ret = wasm.cell_new(ptr0, len0, style.__wbg_ptr);
        this.__wbg_ptr = ret >>> 0;
        CellFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {number}
     */
    get style() {
        const ret = wasm.cell_style(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} color
     */
    set bg(color) {
        wasm.cell_set_bg(this.__wbg_ptr, color);
    }
    /**
     * @param {number} color
     */
    set fg(color) {
        wasm.cell_set_fg(this.__wbg_ptr, color);
    }
    /**
     * @returns {string}
     */
    get symbol() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.cell_symbol(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {number} style
     */
    set style(style) {
        wasm.cell_set_style(this.__wbg_ptr, style);
    }
}
if (Symbol.dispose) Cell.prototype[Symbol.dispose] = Cell.prototype.free;

/**
 * Query for selecting cells in the terminal
 */
export class CellQuery {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CellQuery.prototype);
        obj.__wbg_ptr = ptr;
        CellQueryFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CellQueryFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_cellquery_free(ptr, 0);
    }
    /**
     * Configure whether to trim trailing whitespace from lines
     * @param {boolean} enabled
     * @returns {CellQuery}
     */
    trimTrailingWhitespace(enabled) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.cellquery_trimTrailingWhitespace(ptr, enabled);
        return CellQuery.__wrap(ret);
    }
    /**
     * Set the ending position for the selection
     * @param {number} col
     * @param {number} row
     * @returns {CellQuery}
     */
    end(col, row) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.cellquery_end(ptr, col, row);
        return CellQuery.__wrap(ret);
    }
    /**
     * Create a new cell query with the specified selection mode
     * @param {SelectionMode} mode
     */
    constructor(mode) {
        const ret = wasm.cellquery_new(mode);
        this.__wbg_ptr = ret >>> 0;
        CellQueryFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Set the starting position for the selection
     * @param {number} col
     * @param {number} row
     * @returns {CellQuery}
     */
    start(col, row) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.cellquery_start(ptr, col, row);
        return CellQuery.__wrap(ret);
    }
    /**
     * Check if the query is empty (no selection range)
     * @returns {boolean}
     */
    isEmpty() {
        const ret = wasm.cellquery_isEmpty(this.__wbg_ptr);
        return ret !== 0;
    }
}
if (Symbol.dispose) CellQuery.prototype[Symbol.dispose] = CellQuery.prototype.free;

export class CellStyle {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CellStyle.prototype);
        obj.__wbg_ptr = ptr;
        CellStyleFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CellStyleFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_cellstyle_free(ptr, 0);
    }
    /**
     * Add strikethrough effect
     * @returns {CellStyle}
     */
    strikethrough() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.cellstyle_strikethrough(ptr);
        return CellStyle.__wrap(ret);
    }
    /**
     * Sets the background color
     * @param {number} color
     * @returns {CellStyle}
     */
    bg(color) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.cellstyle_bg(ptr, color);
        return CellStyle.__wrap(ret);
    }
    /**
     * Sets the foreground color
     * @param {number} color
     * @returns {CellStyle}
     */
    fg(color) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.cellstyle_fg(ptr, color);
        return CellStyle.__wrap(ret);
    }
    /**
     * Create a new TextStyle with default (normal) style
     */
    constructor() {
        const ret = wasm.cellstyle_new();
        this.__wbg_ptr = ret >>> 0;
        CellStyleFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Get the combined style bits
     * @returns {number}
     */
    get bits() {
        const ret = wasm.cellstyle_bits(this.__wbg_ptr);
        return ret;
    }
    /**
     * Add bold style
     * @returns {CellStyle}
     */
    bold() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.cellstyle_bold(ptr);
        return CellStyle.__wrap(ret);
    }
    /**
     * Add italic style
     * @returns {CellStyle}
     */
    italic() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.cellstyle_italic(ptr);
        return CellStyle.__wrap(ret);
    }
    /**
     * Add underline effect
     * @returns {CellStyle}
     */
    underline() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.cellstyle_underline(ptr);
        return CellStyle.__wrap(ret);
    }
}
if (Symbol.dispose) CellStyle.prototype[Symbol.dispose] = CellStyle.prototype.free;

/**
 * Modifier key flags for mouse selection.
 *
 * Use bitwise OR to combine multiple modifiers:
 * ```javascript
 * const modifiers = ModifierKeys.SHIFT | ModifierKeys.CONTROL;
 * renderer.enableSelectionWithOptions(SelectionMode.Block, true, modifiers);
 * ```
 */
export class ModifierKeys {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ModifierKeys.prototype);
        obj.__wbg_ptr = ptr;
        ModifierKeysFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ModifierKeysFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_modifierkeys_free(ptr, 0);
    }
    /**
     * Combines two modifier key sets using bitwise OR
     * @param {ModifierKeys} other
     * @returns {ModifierKeys}
     */
    or(other) {
        _assertClass(other, ModifierKeys);
        const ret = wasm.modifierkeys_or(this.__wbg_ptr, other.__wbg_ptr);
        return ModifierKeys.__wrap(ret);
    }
    /**
     * Alt key (Option on macOS)
     * @returns {ModifierKeys}
     */
    static get ALT() {
        const ret = wasm.modifierkeys_ALT();
        return ModifierKeys.__wrap(ret);
    }
    /**
     * Meta key (Command on macOS, Windows key on Windows)
     * @returns {ModifierKeys}
     */
    static get META() {
        const ret = wasm.modifierkeys_META();
        return ModifierKeys.__wrap(ret);
    }
    /**
     * No modifier keys required
     * @returns {ModifierKeys}
     */
    static get NONE() {
        const ret = wasm.modifierkeys_NONE();
        return ModifierKeys.__wrap(ret);
    }
    /**
     * Shift key
     * @returns {ModifierKeys}
     */
    static get SHIFT() {
        const ret = wasm.modifierkeys_SHIFT();
        return ModifierKeys.__wrap(ret);
    }
    /**
     * Control key (Ctrl)
     * @returns {ModifierKeys}
     */
    static get CONTROL() {
        const ret = wasm.modifierkeys_CONTROL();
        return ModifierKeys.__wrap(ret);
    }
}
if (Symbol.dispose) ModifierKeys.prototype[Symbol.dispose] = ModifierKeys.prototype.free;

/**
 * Mouse event data with terminal coordinates
 */
export class MouseEvent {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(MouseEvent.prototype);
        obj.__wbg_ptr = ptr;
        MouseEventFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MouseEventFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_mouseevent_free(ptr, 0);
    }
    /**
     * Type of mouse event
     * @returns {MouseEventType}
     */
    get event_type() {
        const ret = wasm.__wbg_get_mouseevent_event_type(this.__wbg_ptr);
        return ret;
    }
    /**
     * Type of mouse event
     * @param {MouseEventType} arg0
     */
    set event_type(arg0) {
        wasm.__wbg_set_mouseevent_event_type(this.__wbg_ptr, arg0);
    }
    /**
     * Column in terminal grid (0-based)
     * @returns {number}
     */
    get col() {
        const ret = wasm.__wbg_get_mouseevent_col(this.__wbg_ptr);
        return ret;
    }
    /**
     * Column in terminal grid (0-based)
     * @param {number} arg0
     */
    set col(arg0) {
        wasm.__wbg_set_mouseevent_col(this.__wbg_ptr, arg0);
    }
    /**
     * Row in terminal grid (0-based)
     * @returns {number}
     */
    get row() {
        const ret = wasm.__wbg_get_mouseevent_row(this.__wbg_ptr);
        return ret;
    }
    /**
     * Row in terminal grid (0-based)
     * @param {number} arg0
     */
    set row(arg0) {
        wasm.__wbg_set_mouseevent_row(this.__wbg_ptr, arg0);
    }
    /**
     * Mouse button (0=left, 1=middle, 2=right)
     * @returns {number}
     */
    get button() {
        const ret = wasm.__wbg_get_mouseevent_button(this.__wbg_ptr);
        return ret;
    }
    /**
     * Mouse button (0=left, 1=middle, 2=right)
     * @param {number} arg0
     */
    set button(arg0) {
        wasm.__wbg_set_mouseevent_button(this.__wbg_ptr, arg0);
    }
    /**
     * Whether Ctrl key was pressed
     * @returns {boolean}
     */
    get ctrl_key() {
        const ret = wasm.__wbg_get_mouseevent_ctrl_key(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Whether Ctrl key was pressed
     * @param {boolean} arg0
     */
    set ctrl_key(arg0) {
        wasm.__wbg_set_mouseevent_ctrl_key(this.__wbg_ptr, arg0);
    }
    /**
     * Whether Shift key was pressed
     * @returns {boolean}
     */
    get shift_key() {
        const ret = wasm.__wbg_get_mouseevent_shift_key(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Whether Shift key was pressed
     * @param {boolean} arg0
     */
    set shift_key(arg0) {
        wasm.__wbg_set_mouseevent_shift_key(this.__wbg_ptr, arg0);
    }
    /**
     * Whether Alt key was pressed
     * @returns {boolean}
     */
    get alt_key() {
        const ret = wasm.__wbg_get_mouseevent_alt_key(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Whether Alt key was pressed
     * @param {boolean} arg0
     */
    set alt_key(arg0) {
        wasm.__wbg_set_mouseevent_alt_key(this.__wbg_ptr, arg0);
    }
    /**
     * Whether Meta key was pressed (Command on macOS, Windows key on Windows)
     * @returns {boolean}
     */
    get meta_key() {
        const ret = wasm.__wbg_get_mouseevent_meta_key(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Whether Meta key was pressed (Command on macOS, Windows key on Windows)
     * @param {boolean} arg0
     */
    set meta_key(arg0) {
        wasm.__wbg_set_mouseevent_meta_key(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) MouseEvent.prototype[Symbol.dispose] = MouseEvent.prototype.free;

/**
 * Type of mouse event
 * @enum {0 | 1 | 2 | 3 | 4 | 5}
 */
export const MouseEventType = Object.freeze({
    /**
     * Mouse button pressed
     */
    MouseDown: 0, "0": "MouseDown",
    /**
     * Mouse button released
     */
    MouseUp: 1, "1": "MouseUp",
    /**
     * Mouse moved
     */
    MouseMove: 2, "2": "MouseMove",
    /**
     * Mouse button clicked (pressed and released)
     */
    Click: 3, "3": "Click",
    /**
     * Mouse cursor entered the terminal area
     */
    MouseEnter: 4, "4": "MouseEnter",
    /**
     * Mouse cursor left the terminal area
     */
    MouseLeave: 5, "5": "MouseLeave",
});

/**
 * Selection mode for text selection in the terminal
 * @enum {0 | 1}
 */
export const SelectionMode = Object.freeze({
    /**
     * Rectangular block selection
     */
    Block: 0, "0": "Block",
    /**
     * Linear text flow selection
     */
    Linear: 1, "1": "Linear",
});

export class Size {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Size.prototype);
        obj.__wbg_ptr = ptr;
        SizeFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SizeFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_size_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get width() {
        const ret = wasm.__wbg_get_mouseevent_col(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set width(arg0) {
        wasm.__wbg_set_mouseevent_col(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get height() {
        const ret = wasm.__wbg_get_mouseevent_row(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set height(arg0) {
        wasm.__wbg_set_mouseevent_row(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) Size.prototype[Symbol.dispose] = Size.prototype.free;

/**
 * Debug API exposed to browser console for terminal inspection.
 */
export class TerminalDebugApi {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TerminalDebugApiFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_terminaldebugapi_free(ptr, 0);
    }
    /**
     * Returns the symbol for a given glyph ID, or null if not found.
     * @param {number} glyph_id
     * @returns {string | undefined}
     */
    getSymbol(glyph_id) {
        const ret = wasm.terminaldebugapi_getSymbol(this.__wbg_ptr, glyph_id);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * Returns the cell size in pixels as an object with `width` and `height` fields.
     * @returns {any}
     */
    getCellSize() {
        const ret = wasm.terminaldebugapi_getCellSize(this.__wbg_ptr);
        return ret;
    }
    /**
     * Returns the canvas size in pixels as an object with `width` and `height` fields.
     * @returns {any}
     */
    getCanvasSize() {
        const ret = wasm.terminaldebugapi_getCanvasSize(this.__wbg_ptr);
        return ret;
    }
    /**
     * Returns the number of glyphs available in the font atlas.
     * @returns {number}
     */
    getGlyphCount() {
        const ret = wasm.terminaldebugapi_getGlyphCount(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Returns the base glyph ID for a given symbol, or null if not found.
     * @param {string} symbol
     * @returns {number | undefined}
     */
    getBaseGlyphId(symbol) {
        const ptr0 = passStringToWasm0(symbol, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.terminaldebugapi_getBaseGlyphId(this.__wbg_ptr, ptr0, len0);
        return ret === 0xFFFFFF ? undefined : ret;
    }
    /**
     * @returns {Array<any>}
     */
    getAtlasLookup() {
        const ret = wasm.terminaldebugapi_getAtlasLookup(this.__wbg_ptr);
        return ret;
    }
    /**
     * Returns the terminal size in cells as an object with `cols` and `rows` fields.
     * @returns {any}
     */
    getTerminalSize() {
        const ret = wasm.terminaldebugapi_getTerminalSize(this.__wbg_ptr);
        return ret;
    }
    /**
     * Returns an array of glyphs that were requested but not found in the font atlas.
     * @returns {Array<any>}
     */
    getMissingGlyphs() {
        const ret = wasm.terminaldebugapi_getMissingGlyphs(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) TerminalDebugApi.prototype[Symbol.dispose] = TerminalDebugApi.prototype.free;

/**
 * Result of URL detection at a terminal position.
 *
 * Contains the detected URL string and a `CellQuery` for highlighting
 * or extracting the URL region.
 */
export class UrlMatch {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(UrlMatch.prototype);
        obj.__wbg_ptr = ptr;
        UrlMatchFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        UrlMatchFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_urlmatch_free(ptr, 0);
    }
    /**
     * Returns the detected URL string.
     * @returns {string}
     */
    get url() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.urlmatch_url(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Returns a `CellQuery` for the URL's position in the terminal grid.
     *
     * This can be used for highlighting or extracting text.
     * @returns {CellQuery}
     */
    get query() {
        const ret = wasm.urlmatch_query(this.__wbg_ptr);
        return CellQuery.__wrap(ret);
    }
}
if (Symbol.dispose) UrlMatch.prototype[Symbol.dispose] = UrlMatch.prototype.free;

/**
 * @param {string} symbol
 * @param {CellStyle} style
 * @returns {Cell}
 */
export function cell(symbol, style) {
    const ptr0 = passStringToWasm0(symbol, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    _assertClass(style, CellStyle);
    var ptr1 = style.__destroy_into_raw();
    const ret = wasm.cell(ptr0, len0, ptr1);
    return Cell.__wrap(ret);
}

/**
 * Initialize the WASM module
 */
export function main() {
    wasm.main();
}

/**
 * @returns {CellStyle}
 */
export function style() {
    const ret = wasm.cellstyle_new();
    return CellStyle.__wrap(ret);
}

export function __wbg_Error_52673b7de5a0ca89(arg0, arg1) {
    const ret = Error(getStringFromWasm0(arg0, arg1));
    return ret;
};

export function __wbg_Number_2d1dcfcf4ec51736(arg0) {
    const ret = Number(arg0);
    return ret;
};

export function __wbg_String_8f0eb39a4a4c2f66(arg0, arg1) {
    const ret = String(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg___wbindgen_boolean_get_dea25b33882b895b(arg0) {
    const v = arg0;
    const ret = typeof(v) === 'boolean' ? v : undefined;
    return isLikeNone(ret) ? 0xFFFFFF : ret ? 1 : 0;
};

export function __wbg___wbindgen_debug_string_adfb662ae34724b6(arg0, arg1) {
    const ret = debugString(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg___wbindgen_in_0d3e1e8f0c669317(arg0, arg1) {
    const ret = arg0 in arg1;
    return ret;
};

export function __wbg___wbindgen_is_function_8d400b8b1af978cd(arg0) {
    const ret = typeof(arg0) === 'function';
    return ret;
};

export function __wbg___wbindgen_is_object_ce774f3490692386(arg0) {
    const val = arg0;
    const ret = typeof(val) === 'object' && val !== null;
    return ret;
};

export function __wbg___wbindgen_is_undefined_f6b95eab589e0269(arg0) {
    const ret = arg0 === undefined;
    return ret;
};

export function __wbg___wbindgen_jsval_loose_eq_766057600fdd1b0d(arg0, arg1) {
    const ret = arg0 == arg1;
    return ret;
};

export function __wbg___wbindgen_number_get_9619185a74197f95(arg0, arg1) {
    const obj = arg1;
    const ret = typeof(obj) === 'number' ? obj : undefined;
    getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
};

export function __wbg___wbindgen_string_get_a2a31e16edf96e42(arg0, arg1) {
    const obj = arg1;
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg___wbindgen_throw_dd24417ed36fc46e(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

export function __wbg__wbg_cb_unref_87dfb5aaa0cbcea7(arg0) {
    arg0._wbg_cb_unref();
};

export function __wbg_activeTexture_59810c16ea8d6e34(arg0, arg1) {
    arg0.activeTexture(arg1 >>> 0);
};

export function __wbg_addEventListener_6a82629b3d430a48() { return handleError(function (arg0, arg1, arg2, arg3) {
    arg0.addEventListener(getStringFromWasm0(arg1, arg2), arg3);
}, arguments) };

export function __wbg_altKey_e13fae92dfebca3e(arg0) {
    const ret = arg0.altKey;
    return ret;
};

export function __wbg_apply_52e9ae668d017009() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.apply(arg1, arg2);
    return ret;
}, arguments) };

export function __wbg_attachShader_ce575704294db9cc(arg0, arg1, arg2) {
    arg0.attachShader(arg1, arg2);
};

export function __wbg_beginPath_33d1c14766492a39(arg0) {
    arg0.beginPath();
};

export function __wbg_bindBufferBase_ff74eb07e91625d0(arg0, arg1, arg2, arg3) {
    arg0.bindBufferBase(arg1 >>> 0, arg2 >>> 0, arg3);
};

export function __wbg_bindBuffer_c24c31cbec41cb21(arg0, arg1, arg2) {
    arg0.bindBuffer(arg1 >>> 0, arg2);
};

export function __wbg_bindTexture_6ed714c0afe8b8d1(arg0, arg1, arg2) {
    arg0.bindTexture(arg1 >>> 0, arg2);
};

export function __wbg_bindVertexArray_ced27387a0718508(arg0, arg1) {
    arg0.bindVertexArray(arg1);
};

export function __wbg_bufferData_69dbeea8e1d79f7b(arg0, arg1, arg2, arg3) {
    arg0.bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
};

export function __wbg_bufferData_ca0a87aa6811791d(arg0, arg1, arg2, arg3, arg4) {
    arg0.bufferData(arg1 >>> 0, getArrayU8FromWasm0(arg2, arg3), arg4 >>> 0);
};

export function __wbg_bufferSubData_16db9d7d9f1c86bb(arg0, arg1, arg2, arg3) {
    arg0.bufferSubData(arg1 >>> 0, arg2, arg3);
};

export function __wbg_button_a54acd25bab5d442(arg0) {
    const ret = arg0.button;
    return ret;
};

export function __wbg_call_abb4ff46ce38be40() { return handleError(function (arg0, arg1) {
    const ret = arg0.call(arg1);
    return ret;
}, arguments) };

export function __wbg_clearColor_66e5dad6393f32ec(arg0, arg1, arg2, arg3, arg4) {
    arg0.clearColor(arg1, arg2, arg3, arg4);
};

export function __wbg_clearRect_995d722c31c68b62(arg0, arg1, arg2, arg3, arg4) {
    arg0.clearRect(arg1, arg2, arg3, arg4);
};

export function __wbg_clear_00ac71df5db8ab17(arg0, arg1) {
    arg0.clear(arg1 >>> 0);
};

export function __wbg_clip_502afc9d77774101(arg0) {
    arg0.clip();
};

export function __wbg_clipboard_c210ce30f20907dd(arg0) {
    const ret = arg0.clipboard;
    return ret;
};

export function __wbg_compileShader_ba337110bed419e1(arg0, arg1) {
    arg0.compileShader(arg1);
};

export function __wbg_createBuffer_465b645a46535184(arg0) {
    const ret = arg0.createBuffer();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_createProgram_ffe9d4a2cba210f4(arg0) {
    const ret = arg0.createProgram();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_createShader_f88f9b82748ef6c0(arg0, arg1) {
    const ret = arg0.createShader(arg1 >>> 0);
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_createTexture_41211a4e8ae0afec(arg0) {
    const ret = arg0.createTexture();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_createVertexArray_997b3c5b1091afd9(arg0) {
    const ret = arg0.createVertexArray();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_ctrlKey_b391e5105c3f6e76(arg0) {
    const ret = arg0.ctrlKey;
    return ret;
};

export function __wbg_data_83b2a9a09dd4ab39(arg0, arg1) {
    const ret = arg1.data;
    const ptr1 = passArray8ToWasm0(ret, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_deleteBuffer_ba7f1164cc23b2ca(arg0, arg1) {
    arg0.deleteBuffer(arg1);
};

export function __wbg_deleteShader_c357bb8fbede8370(arg0, arg1) {
    arg0.deleteShader(arg1);
};

export function __wbg_deleteTexture_2a9b703dc2df5657(arg0, arg1) {
    arg0.deleteTexture(arg1);
};

export function __wbg_devicePixelRatio_390dee26c70aa30f(arg0) {
    const ret = arg0.devicePixelRatio;
    return ret;
};

export function __wbg_document_5b745e82ba551ca5(arg0) {
    const ret = arg0.document;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_done_62ea16af4ce34b24(arg0) {
    const ret = arg0.done;
    return ret;
};

export function __wbg_drawElementsInstanced_ad84faddf2b48335(arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.drawElementsInstanced(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
};

export function __wbg_enableVertexAttribArray_2898de871f949393(arg0, arg1) {
    arg0.enableVertexAttribArray(arg1 >>> 0);
};

export function __wbg_error_7534b8e9a36f1ab4(arg0, arg1) {
    let deferred0_0;
    let deferred0_1;
    try {
        deferred0_0 = arg0;
        deferred0_1 = arg1;
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
    }
};

export function __wbg_error_7bc7d576a6aaf855(arg0) {
    console.error(arg0);
};

export function __wbg_fillText_64c0e1b7373270a3() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.fillText(getStringFromWasm0(arg1, arg2), arg3, arg4);
}, arguments) };

export function __wbg_generateMipmap_85452cd8f350f404(arg0, arg1) {
    arg0.generateMipmap(arg1 >>> 0);
};

export function __wbg_getContext_01f42b234e833f0a() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.getContext(getStringFromWasm0(arg1, arg2));
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_getContext_2f210d0a58d43d95() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.getContext(getStringFromWasm0(arg1, arg2));
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_getImageData_da396caba11eb89f() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    const ret = arg0.getImageData(arg1, arg2, arg3, arg4);
    return ret;
}, arguments) };

export function __wbg_getParameter_1dfd667c33169fab() { return handleError(function (arg0, arg1) {
    const ret = arg0.getParameter(arg1 >>> 0);
    return ret;
}, arguments) };

export function __wbg_getProgramInfoLog_a0ff8b0971fcaf48(arg0, arg1, arg2) {
    const ret = arg1.getProgramInfoLog(arg2);
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_getProgramParameter_c777611a448a6ccd(arg0, arg1, arg2) {
    const ret = arg0.getProgramParameter(arg1, arg2 >>> 0);
    return ret;
};

export function __wbg_getUniformBlockIndex_1453ff945a9eefd5(arg0, arg1, arg2, arg3) {
    const ret = arg0.getUniformBlockIndex(arg1, getStringFromWasm0(arg2, arg3));
    return ret;
};

export function __wbg_getUniformLocation_21ac12bfc569cbbf(arg0, arg1, arg2, arg3) {
    const ret = arg0.getUniformLocation(arg1, getStringFromWasm0(arg2, arg3));
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_get_6b7bd52aca3f9671(arg0, arg1) {
    const ret = arg0[arg1 >>> 0];
    return ret;
};

export function __wbg_get_af9dab7e9603ea93() { return handleError(function (arg0, arg1) {
    const ret = Reflect.get(arg0, arg1);
    return ret;
}, arguments) };

export function __wbg_get_with_ref_key_1dc361bd10053bfe(arg0, arg1) {
    const ret = arg0[arg1];
    return ret;
};

export function __wbg_height_a07787f693c253d2(arg0) {
    const ret = arg0.height;
    return ret;
};

export function __wbg_height_b39b909fd2ab3669(arg0) {
    const ret = arg0.height;
    return ret;
};

export function __wbg_instanceof_ArrayBuffer_f3320d2419cd0355(arg0) {
    let result;
    try {
        result = arg0 instanceof ArrayBuffer;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_HtmlCanvasElement_c4251b1b6a15edcc(arg0) {
    let result;
    try {
        result = arg0 instanceof HTMLCanvasElement;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_OffscreenCanvasRenderingContext2d_52996da29a2bf2f5(arg0) {
    let result;
    try {
        result = arg0 instanceof OffscreenCanvasRenderingContext2D;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_Uint8Array_da54ccc9d3e09434(arg0) {
    let result;
    try {
        result = arg0 instanceof Uint8Array;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_WebGl2RenderingContext_121e4c8c95b128ef(arg0) {
    let result;
    try {
        result = arg0 instanceof WebGL2RenderingContext;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_Window_b5cf7783caa68180(arg0) {
    let result;
    try {
        result = arg0 instanceof Window;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_isArray_51fd9e6422c0a395(arg0) {
    const ret = Array.isArray(arg0);
    return ret;
};

export function __wbg_isContextLost_bda293babfe7540f(arg0) {
    const ret = arg0.isContextLost();
    return ret;
};

export function __wbg_isSafeInteger_ae7d3f054d55fa16(arg0) {
    const ret = Number.isSafeInteger(arg0);
    return ret;
};

export function __wbg_iterator_27b7c8b35ab3e86b() {
    const ret = Symbol.iterator;
    return ret;
};

export function __wbg_length_22ac23eaec9d8053(arg0) {
    const ret = arg0.length;
    return ret;
};

export function __wbg_length_d45040a40c570362(arg0) {
    const ret = arg0.length;
    return ret;
};

export function __wbg_linkProgram_93f76a2f5030041e(arg0, arg1) {
    arg0.linkProgram(arg1);
};

export function __wbg_log_1d990106d99dacb7(arg0) {
    console.log(arg0);
};

export function __wbg_metaKey_448c751accad2eba(arg0) {
    const ret = arg0.metaKey;
    return ret;
};

export function __wbg_mouseevent_new(arg0) {
    const ret = MouseEvent.__wrap(arg0);
    return ret;
};

export function __wbg_navigator_b49edef831236138(arg0) {
    const ret = arg0.navigator;
    return ret;
};

export function __wbg_new_1ba21ce319a06297() {
    const ret = new Object();
    return ret;
};

export function __wbg_new_25f239778d6112b9() {
    const ret = new Array();
    return ret;
};

export function __wbg_new_6421f6084cc5bc5a(arg0) {
    const ret = new Uint8Array(arg0);
    return ret;
};

export function __wbg_new_8a6f238a6ece86ea() {
    const ret = new Error();
    return ret;
};

export function __wbg_new_9468dd6e5df427f6() { return handleError(function (arg0, arg1) {
    const ret = new OffscreenCanvas(arg0 >>> 0, arg1 >>> 0);
    return ret;
}, arguments) };

export function __wbg_new_no_args_cb138f77cf6151ee(arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return ret;
};

export function __wbg_next_138a17bbf04e926c(arg0) {
    const ret = arg0.next;
    return ret;
};

export function __wbg_next_3cfe5c0fe2a4cc53() { return handleError(function (arg0) {
    const ret = arg0.next();
    return ret;
}, arguments) };

export function __wbg_offsetX_cef943cf53ab2b5a(arg0) {
    const ret = arg0.offsetX;
    return ret;
};

export function __wbg_offsetY_9a093457f71ef493(arg0) {
    const ret = arg0.offsetY;
    return ret;
};

export function __wbg_preventDefault_e97663aeeb9709d3(arg0) {
    arg0.preventDefault();
};

export function __wbg_prototypesetcall_dfe9b766cdc1f1fd(arg0, arg1, arg2) {
    Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), arg2);
};

export function __wbg_push_7d9be8f38fc13975(arg0, arg1) {
    const ret = arg0.push(arg1);
    return ret;
};

export function __wbg_querySelector_15a92ce6bed6157d() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.querySelector(getStringFromWasm0(arg1, arg2));
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_queueMicrotask_9b549dfce8865860(arg0) {
    const ret = arg0.queueMicrotask;
    return ret;
};

export function __wbg_queueMicrotask_fca69f5bfad613a5(arg0) {
    queueMicrotask(arg0);
};

export function __wbg_rect_9d502ba97dca2331(arg0, arg1, arg2, arg3, arg4) {
    arg0.rect(arg1, arg2, arg3, arg4);
};

export function __wbg_removeEventListener_565e273024b68b75() { return handleError(function (arg0, arg1, arg2, arg3) {
    arg0.removeEventListener(getStringFromWasm0(arg1, arg2), arg3);
}, arguments) };

export function __wbg_resolve_fd5bfbaa4ce36e1e(arg0) {
    const ret = Promise.resolve(arg0);
    return ret;
};

export function __wbg_restore_352c39c9bbeedc91(arg0) {
    arg0.restore();
};

export function __wbg_save_131c8dc648f702b6(arg0) {
    arg0.save();
};

export function __wbg_setProperty_f27b2c05323daf8a() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.setProperty(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
}, arguments) };

export function __wbg_set_781438a03c0c3c81() { return handleError(function (arg0, arg1, arg2) {
    const ret = Reflect.set(arg0, arg1, arg2);
    return ret;
}, arguments) };

export function __wbg_set_fillStyle_b26e462a87b14315(arg0, arg1, arg2) {
    arg0.fillStyle = getStringFromWasm0(arg1, arg2);
};

export function __wbg_set_font_6d67b15564a1e344(arg0, arg1, arg2) {
    arg0.font = getStringFromWasm0(arg1, arg2);
};

export function __wbg_set_height_6f8f8ef4cb40e496(arg0, arg1) {
    arg0.height = arg1 >>> 0;
};

export function __wbg_set_height_afe09c24165867f7(arg0, arg1) {
    arg0.height = arg1 >>> 0;
};

export function __wbg_set_textAlign_0e0827546ee09feb(arg0, arg1, arg2) {
    arg0.textAlign = getStringFromWasm0(arg1, arg2);
};

export function __wbg_set_textBaseline_4a53c509caa41c76(arg0, arg1, arg2) {
    arg0.textBaseline = getStringFromWasm0(arg1, arg2);
};

export function __wbg_set_width_7ff7a22c6e9f423e(arg0, arg1) {
    arg0.width = arg1 >>> 0;
};

export function __wbg_shaderSource_aea71cfa376fc985(arg0, arg1, arg2, arg3) {
    arg0.shaderSource(arg1, getStringFromWasm0(arg2, arg3));
};

export function __wbg_shiftKey_a6df227a917d203b(arg0) {
    const ret = arg0.shiftKey;
    return ret;
};

export function __wbg_stack_0ed75d68575b0f3c(arg0, arg1) {
    const ret = arg1.stack;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_static_accessor_GLOBAL_769e6b65d6557335() {
    const ret = typeof global === 'undefined' ? null : global;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_static_accessor_GLOBAL_THIS_60cf02db4de8e1c1() {
    const ret = typeof globalThis === 'undefined' ? null : globalThis;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_static_accessor_SELF_08f5a74c69739274() {
    const ret = typeof self === 'undefined' ? null : self;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_static_accessor_WINDOW_a8924b26aa92d024() {
    const ret = typeof window === 'undefined' ? null : window;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_style_521a717da50e53c6(arg0) {
    const ret = arg0.style;
    return ret;
};

export function __wbg_texParameteri_3a52bfd2ef280632(arg0, arg1, arg2, arg3) {
    arg0.texParameteri(arg1 >>> 0, arg2 >>> 0, arg3);
};

export function __wbg_texStorage3D_0b08c3a68b3d128e(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    arg0.texStorage3D(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5, arg6);
};

export function __wbg_texSubImage3D_fefbf42bde1981d3() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13) {
    arg0.texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, arg11 === 0 ? undefined : getArrayU8FromWasm0(arg11, arg12), arg13 >>> 0);
}, arguments) };

export function __wbg_then_429f7caf1026411d(arg0, arg1, arg2) {
    const ret = arg0.then(arg1, arg2);
    return ret;
};

export function __wbg_then_4f95312d68691235(arg0, arg1) {
    const ret = arg0.then(arg1);
    return ret;
};

export function __wbg_type_4bea23a78318af32(arg0, arg1) {
    const ret = arg1.type;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_uniform1i_85131b7388bc8e3f(arg0, arg1, arg2) {
    arg0.uniform1i(arg1, arg2);
};

export function __wbg_uniformBlockBinding_83eb9ed3f1189da9(arg0, arg1, arg2, arg3) {
    arg0.uniformBlockBinding(arg1, arg2 >>> 0, arg3 >>> 0);
};

export function __wbg_useProgram_4632a62f19deea67(arg0, arg1) {
    arg0.useProgram(arg1);
};

export function __wbg_value_57b7b035e117f7ee(arg0) {
    const ret = arg0.value;
    return ret;
};

export function __wbg_vertexAttribDivisor_4f37e0f7c1197d16(arg0, arg1, arg2) {
    arg0.vertexAttribDivisor(arg1 >>> 0, arg2 >>> 0);
};

export function __wbg_vertexAttribIPointer_87d7fcce484093c9(arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.vertexAttribIPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
};

export function __wbg_vertexAttribPointer_880223685613a791(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    arg0.vertexAttribPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 !== 0, arg5, arg6);
};

export function __wbg_viewport_1b0f7b63c424b52f(arg0, arg1, arg2, arg3, arg4) {
    arg0.viewport(arg1, arg2, arg3, arg4);
};

export function __wbg_width_9ab139dc647aa315(arg0) {
    const ret = arg0.width;
    return ret;
};

export function __wbg_width_dd0cfe94d42f5143(arg0) {
    const ret = arg0.width;
    return ret;
};

export function __wbg_writeText_c9776abb6826901c(arg0, arg1, arg2) {
    const ret = arg0.writeText(getStringFromWasm0(arg1, arg2));
    return ret;
};

export function __wbindgen_cast_12169bf36ec88363(arg0, arg1) {
    // Cast intrinsic for `Closure(Closure { dtor_idx: 32, function: Function { arguments: [NamedExternref("WebGLContextEvent")], shim_idx: 33, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
    const ret = makeMutClosure(arg0, arg1, wasm.wasm_bindgen__closure__destroy__h5133f6755abf574d, wasm_bindgen__convert__closures_____invoke__h5e1acc0fc387699a);
    return ret;
};

export function __wbindgen_cast_2241b6af4c4b2941(arg0, arg1) {
    // Cast intrinsic for `Ref(String) -> Externref`.
    const ret = getStringFromWasm0(arg0, arg1);
    return ret;
};

export function __wbindgen_cast_2f5fdfedb23a1836(arg0, arg1) {
    // Cast intrinsic for `Closure(Closure { dtor_idx: 32, function: Function { arguments: [NamedExternref("MouseEvent")], shim_idx: 33, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
    const ret = makeMutClosure(arg0, arg1, wasm.wasm_bindgen__closure__destroy__h5133f6755abf574d, wasm_bindgen__convert__closures_____invoke__h5e1acc0fc387699a);
    return ret;
};

export function __wbindgen_cast_cb9088102bce6b30(arg0, arg1) {
    // Cast intrinsic for `Ref(Slice(U8)) -> NamedExternref("Uint8Array")`.
    const ret = getArrayU8FromWasm0(arg0, arg1);
    return ret;
};

export function __wbindgen_cast_cd07b1914aa3d62c(arg0, arg1) {
    // Cast intrinsic for `Ref(Slice(F32)) -> NamedExternref("Float32Array")`.
    const ret = getArrayF32FromWasm0(arg0, arg1);
    return ret;
};

export function __wbindgen_cast_d6cd19b81560fd6e(arg0) {
    // Cast intrinsic for `F64 -> Externref`.
    const ret = arg0;
    return ret;
};

export function __wbindgen_cast_f1c9170db27db6a8(arg0, arg1) {
    // Cast intrinsic for `Closure(Closure { dtor_idx: 125, function: Function { arguments: [Externref], shim_idx: 126, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
    const ret = makeMutClosure(arg0, arg1, wasm.wasm_bindgen__closure__destroy__hefb398d87daaa8ec, wasm_bindgen__convert__closures_____invoke__hf49cfe0d95b75ac3);
    return ret;
};

export function __wbindgen_init_externref_table() {
    const table = wasm.__wbindgen_externrefs;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
};
