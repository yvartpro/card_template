import React from 'react';
import {
  CardElement,
  CardTemplate,
  BackgroundConfig,
  ElementType,
} from '../types';
import {
  DYNAMIC_STUDENT_FIELDS,
  DYNAMIC_STAFF_FIELDS,
} from '../constants/fields';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  BringToFront,
  SendToBack,
  ArrowUp,
  ArrowDown,
  Minus,
  Copy,
  Trash2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Link,
  Unlink,
  Sparkles,
  Sliders,
  Palette,
  Maximize,
  RotateCw,
} from 'lucide-react';

interface RightSidebarProps {
  template: CardTemplate;
  selectedElements: CardElement[];
  primarySelected: CardElement | null;
  updateElement: (id: string, partial: Partial<CardElement>, recordHistory?: boolean) => void;
  updateSelectedStyle: (style: Partial<CardElement['style']>, recordHistory?: boolean) => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;
  bringForward: () => void;
  sendBackward: () => void;
  bringToFront: () => void;
  sendToBack: () => void;
  alignSelected: (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  setBackground: (bg: BackgroundConfig) => void;
  setDimensions: (width: number, height: number) => void;
}

const FONT_FAMILIES = [
  'Inter',
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Courier New',
  'Trebuchet MS',
  'Verdana',
  'Impact',
  'monospace',
];

const PRESET_COLORS = [
  '#000000',
  '#0f172a',
  '#334155',
  '#64748b',
  '#ffffff',
  '#0284c7',
  '#0369a1',
  '#2563eb',
  '#4f46e5',
  '#7c3aed',
  '#059669',
  '#d97706',
  '#dc2626',
  '#e11d48',
  '#f8fafc',
  '#f1f5f9',
];

export const RightSidebar: React.FC<RightSidebarProps> = ({
  template,
  selectedElements,
  primarySelected,
  updateElement,
  updateSelectedStyle,
  deleteSelected,
  duplicateSelected,
  bringForward,
  sendBackward,
  bringToFront,
  sendToBack,
  alignSelected,
  setBackground,
  setDimensions,
}) => {
  const isMultiSelection = selectedElements.length > 1;
  const currentFieldOptions =
    template.type === 'student' ? DYNAMIC_STUDENT_FIELDS : DYNAMIC_STAFF_FIELDS;

  // Render Inspector for selected element
  if (primarySelected) {
    const el = primarySelected;
    const style = el.style || {};

    return (
      <aside
        id="right_sidebar_inspector"
        className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full select-none shrink-0 overflow-y-auto p-4 space-y-5 text-slate-200"
      >
        {/* Inspector Header: Element Name, Type & Quick Actions */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="text-xs font-semibold text-white truncate max-w-[170px]">
              {isMultiSelection ? `${selectedElements.length} Elements Selected` : el.name}
            </div>
            <div className="text-[10px] text-slate-400 font-mono uppercase">
              {isMultiSelection ? 'Multi-Selection' : `Type: ${el.type}`}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={duplicateSelected}
              title="Duplicate (Ctrl+D)"
              className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={deleteSelected}
              title="Delete (Backspace)"
              className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Field Mapping Binding */}
        {!isMultiSelection && (
          <div className="space-y-2 bg-slate-800/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Dynamic Field Binding</span>
              </label>
              {el.field && (
                <button
                  onClick={() => updateElement(el.id, { field: null })}
                  className="text-[10px] text-slate-400 hover:text-rose-300 flex items-center gap-1"
                  title="Disconnect dynamic field"
                >
                  <Unlink className="w-3 h-3" />
                  <span>Unlink</span>
                </button>
              )}
            </div>

            <select
              value={el.field || ''}
              onChange={(e) => {
                const val = e.target.value || null;
                const fieldDef = currentFieldOptions.find((f) => f.key === val);
                updateElement(el.id, {
                  field: val,
                  name: fieldDef ? fieldDef.label : el.name,
                });
              }}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">(None - Static Content)</option>
              <optgroup label={`${template.type === 'student' ? 'Student' : 'Staff'} Fields`}>
                {currentFieldOptions.map((f) => (
                  <option key={f.key} value={f.key}>
                    {f.label} ({f.key})
                  </option>
                ))}
              </optgroup>
            </select>

            {el.field ? (
              <div className="text-[10px] bg-blue-500/10 border border-blue-500/30 text-blue-300 px-2 py-1 rounded">
                Stores template JSON field: <code className="font-mono">{el.field}</code>
              </div>
            ) : (
              <div className="text-[10px] text-slate-400">
                This element stores static content directly in the template definition.
              </div>
            )}
          </div>
        )}

        {/* Position & Size */}
        <div className="space-y-2.5">
          <div className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
            Transform
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 font-mono">X (px)</label>
              <input
                type="number"
                value={Math.round(el.x)}
                onChange={(e) => updateElement(el.id, { x: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs px-2 py-1.5 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-mono">Y (px)</label>
              <input
                type="number"
                value={Math.round(el.y)}
                onChange={(e) => updateElement(el.id, { y: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs px-2 py-1.5 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-mono">Width (px)</label>
              <input
                type="number"
                value={Math.round(el.width)}
                onChange={(e) => updateElement(el.id, { width: Math.max(10, Number(e.target.value)) })}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs px-2 py-1.5 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-mono">Height (px)</label>
              <input
                type="number"
                value={Math.round(el.height)}
                onChange={(e) => updateElement(el.id, { height: Math.max(10, Number(e.target.value)) })}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs px-2 py-1.5 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <RotateCw className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] text-slate-400">Rotation:</span>
            <input
              type="range"
              min="0"
              max="360"
              value={el.rotation || 0}
              onChange={(e) => updateElement(el.id, { rotation: Number(e.target.value) })}
              className="flex-1 accent-blue-500 h-1 bg-slate-700 rounded-lg cursor-pointer"
            />
            <span className="text-xs font-mono w-9 text-right">{el.rotation || 0}°</span>
          </div>
        </div>

        {/* Alignment & Layer Arrangement */}
        <div className="space-y-2.5">
          <div className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
            Align & Arrange
          </div>
          <div className="grid grid-cols-6 gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => alignSelected('left')}
              title="Align Left"
              className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white flex justify-center"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => alignSelected('center')}
              title="Align Center"
              className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white flex justify-center"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => alignSelected('right')}
              title="Align Right"
              className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white flex justify-center"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => alignSelected('top')}
              title="Align Top"
              className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white flex justify-center"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => alignSelected('middle')}
              title="Align Middle"
              className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white flex justify-center"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => alignSelected('bottom')}
              title="Align Bottom"
              className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white flex justify-center"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={bringToFront}
              title="Bring to Front"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-[11px] flex items-center justify-center gap-1"
            >
              <BringToFront className="w-3 h-3" />
              <span>Top</span>
            </button>
            <button
              onClick={bringForward}
              title="Bring Forward"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-[11px] flex items-center justify-center gap-1"
            >
              <ChevronUp className="w-3 h-3" />
              <span>Up</span>
            </button>
            <button
              onClick={sendBackward}
              title="Send Backward"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-[11px] flex items-center justify-center gap-1"
            >
              <ChevronDown className="w-3 h-3" />
              <span>Down</span>
            </button>
            <button
              onClick={sendToBack}
              title="Send to Back"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-[11px] flex items-center justify-center gap-1"
            >
              <SendToBack className="w-3 h-3" />
              <span>Back</span>
            </button>
          </div>
        </div>

        {/* TYPOGRAPHY (When Text Element) */}
        {el.type === 'text' && (
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
              Typography
            </div>

            {/* Static Content / Fallback Label */}
            <div>
              <label className="text-[10px] text-slate-400">
                {el.field ? 'Fallback Label' : 'Text Content'}
              </label>
              <input
                type="text"
                value={el.content || ''}
                onChange={(e) => updateElement(el.id, { content: e.target.value })}
                placeholder="Enter text..."
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Font Family */}
            <div>
              <label className="text-[10px] text-slate-400">Font Family</label>
              <select
                value={style.fontFamily || 'Inter'}
                onChange={(e) => updateSelectedStyle({ fontFamily: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs px-2 py-1.5 rounded focus:outline-none focus:border-blue-500"
              >
                {FONT_FAMILIES.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size & Weight */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400">Size (px)</label>
                <input
                  type="number"
                  value={style.fontSize || 16}
                  onChange={(e) => updateSelectedStyle({ fontSize: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs px-2 py-1.5 rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400">Weight</label>
                <select
                  value={style.fontWeight || 400}
                  onChange={(e) => updateSelectedStyle({ fontWeight: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs px-2 py-1.5 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value={300}>Light (300)</option>
                  <option value={400}>Regular (400)</option>
                  <option value={500}>Medium (500)</option>
                  <option value={600}>SemiBold (600)</option>
                  <option value={700}>Bold (700)</option>
                  <option value={800}>ExtraBold (800)</option>
                </select>
              </div>
            </div>

            {/* Text Alignment & Formatting Bar */}
            <div className="flex items-center justify-between gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-800">
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => updateSelectedStyle({ textAlign: 'left' })}
                  className={`p-1.5 rounded hover:bg-slate-700 ${
                    style.textAlign === 'left' || !style.textAlign ? 'bg-slate-700 text-blue-400' : 'text-slate-400'
                  }`}
                  title="Align Left"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateSelectedStyle({ textAlign: 'center' })}
                  className={`p-1.5 rounded hover:bg-slate-700 ${
                    style.textAlign === 'center' ? 'bg-slate-700 text-blue-400' : 'text-slate-400'
                  }`}
                  title="Align Center"
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateSelectedStyle({ textAlign: 'right' })}
                  className={`p-1.5 rounded hover:bg-slate-700 ${
                    style.textAlign === 'right' ? 'bg-slate-700 text-blue-400' : 'text-slate-400'
                  }`}
                  title="Align Right"
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="h-4 w-px bg-slate-700" />

              <div className="flex items-center gap-0.5">
                <button
                  onClick={() =>
                    updateSelectedStyle({
                      fontStyle: style.fontStyle === 'italic' ? 'normal' : 'italic',
                    })
                  }
                  className={`p-1.5 rounded hover:bg-slate-700 ${
                    style.fontStyle === 'italic' ? 'bg-slate-700 text-blue-400' : 'text-slate-400'
                  }`}
                  title="Italic"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() =>
                    updateSelectedStyle({
                      textDecoration: style.textDecoration === 'underline' ? 'none' : 'underline',
                    })
                  }
                  className={`p-1.5 rounded hover:bg-slate-700 ${
                    style.textDecoration === 'underline' ? 'bg-slate-700 text-blue-400' : 'text-slate-400'
                  }`}
                  title="Underline"
                >
                  <Underline className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() =>
                    updateSelectedStyle({
                      textTransform: style.textTransform === 'uppercase' ? 'none' : 'uppercase',
                    })
                  }
                  className={`px-1.5 py-1 text-xs font-bold rounded hover:bg-slate-700 ${
                    style.textTransform === 'uppercase' ? 'bg-slate-700 text-blue-400' : 'text-slate-400'
                  }`}
                  title="Uppercase"
                >
                  AA
                </button>
              </div>
            </div>

            {/* Text Color */}
            <div>
              <label className="text-[10px] text-slate-400">Text Color</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={style.color || '#0f172a'}
                  onChange={(e) => updateSelectedStyle({ color: e.target.value })}
                  className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={style.color || '#0f172a'}
                  onChange={(e) => updateSelectedStyle({ color: e.target.value })}
                  className="flex-1 bg-slate-800 border border-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded font-mono"
                />
              </div>

              {/* Quick Preset Swatches */}
              <div className="grid grid-cols-8 gap-1 mt-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => updateSelectedStyle({ color: c })}
                    className="w-5 h-5 rounded border border-slate-700 hover:scale-110 transition-transform"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* IMAGE PROPERTIES */}
        {el.type === 'image' && (
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
              Image Properties
            </div>

            {!el.field && (
              <div>
                <label className="text-[10px] text-slate-400">Image URL</label>
                <input
                  type="text"
                  value={el.content || ''}
                  onChange={(e) => updateElement(el.id, { content: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded focus:outline-none focus:border-blue-500 truncate"
                />
              </div>
            )}

            <div>
              <label className="text-[10px] text-slate-400">Object Fit</label>
              <select
                value={style.objectFit || 'cover'}
                onChange={(e) => updateSelectedStyle({ objectFit: e.target.value as any })}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs px-2 py-1.5 rounded"
              >
                <option value="cover">Cover (Fill & Crop)</option>
                <option value="contain">Contain (Fit Whole Image)</option>
                <option value="fill">Fill (Stretch)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400">Border Radius (px)</label>
              <input
                type="number"
                value={style.borderRadius || 0}
                onChange={(e) => updateSelectedStyle({ borderRadius: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs px-2 py-1.5 rounded"
              />
            </div>
          </div>
        )}

        {/* BARCODE / QR PROPERTIES */}
        {(el.type === 'barcode' || el.type === 'qr') && (
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
              {el.type === 'barcode' ? 'Barcode' : 'QR Code'} Settings
            </div>

            {el.type === 'barcode' && (
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={style.barcodeShowText !== false}
                  onChange={(e) => updateSelectedStyle({ barcodeShowText: e.target.checked })}
                  className="accent-blue-600 rounded"
                />
                <span>Show Text Label below Bars</span>
              </label>
            )}

            <div>
              <label className="text-[10px] text-slate-400">Foreground Color</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={style.color || '#000000'}
                  onChange={(e) => updateSelectedStyle({ color: e.target.value })}
                  className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={style.color || '#000000'}
                  onChange={(e) => updateSelectedStyle({ color: e.target.value })}
                  className="flex-1 bg-slate-800 border border-slate-700 text-slate-200 text-xs px-2 py-1 rounded font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* APPEARANCE / STROKE & FILL (General for all shapes) */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <div className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
            Appearance
          </div>

          {/* Background / Fill */}
          <div>
            <label className="text-[10px] text-slate-400">Fill / Background</label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="color"
                value={style.backgroundColor && style.backgroundColor !== 'transparent' ? style.backgroundColor : '#ffffff'}
                onChange={(e) => updateSelectedStyle({ backgroundColor: e.target.value })}
                className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={style.backgroundColor || 'transparent'}
                onChange={(e) => updateSelectedStyle({ backgroundColor: e.target.value })}
                className="flex-1 bg-slate-800 border border-slate-700 text-slate-200 text-xs px-2 py-1 rounded font-mono"
              />
              <button
                onClick={() => updateSelectedStyle({ backgroundColor: 'transparent' })}
                className="px-2 py-1 text-[10px] bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Border Stroke */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-400">Border Width</label>
              <input
                type="number"
                value={style.borderWidth || 0}
                onChange={(e) => updateSelectedStyle({ borderWidth: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs px-2 py-1.5 rounded"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400">Border Radius</label>
              <input
                type="number"
                value={style.borderRadius || 0}
                onChange={(e) => updateSelectedStyle({ borderRadius: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs px-2 py-1.5 rounded"
              />
            </div>
          </div>

          {/* Opacity */}
          <div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Opacity</span>
              <span>{Math.round((style.opacity ?? 1) * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={style.opacity ?? 1}
              onChange={(e) => updateSelectedStyle({ opacity: Number(e.target.value) })}
              className="w-full accent-blue-500 h-1 bg-slate-700 rounded-lg cursor-pointer mt-1"
            />
          </div>
        </div>
      </aside>
    );
  }

  // When NO element is selected: Show Canvas Properties
  return (
    <aside
      id="right_sidebar_canvas_props"
      className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full select-none shrink-0 overflow-y-auto p-4 space-y-5 text-slate-200"
    >
      <div className="pb-3 border-b border-slate-800">
        <div className="text-xs font-semibold text-white">Card Properties</div>
        <div className="text-[10px] text-slate-400">Global Template Layout & Canvas</div>
      </div>

      {/* Card Dimensions */}
      <div className="space-y-2.5">
        <div className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
          Dimensions ({template.unit})
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-400">Width</label>
            <input
              type="number"
              value={template.width}
              onChange={(e) => setDimensions(Number(e.target.value), template.height)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400">Height</label>
            <input
              type="number"
              value={template.height}
              onChange={(e) => setDimensions(template.width, Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <div className="text-[11px] text-slate-400">
          Standard ID-1 / CR80 card is 856 × 540 px (85.6mm × 54mm).
        </div>
      </div>

      {/* Card Background Setting */}
      <div className="space-y-3 pt-2 border-t border-slate-800">
        <div className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
          Card Background
        </div>

        {/* Type Selector */}
        <div className="flex bg-slate-800 p-0.5 rounded-lg text-xs">
          <button
            onClick={() => setBackground({ type: 'color', value: template.background.value || '#ffffff' })}
            className={`flex-1 py-1 rounded font-medium transition-colors ${
              template.background.type === 'color' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Solid
          </button>
          <button
            onClick={() =>
              setBackground({
                type: 'gradient',
                value: '#ffffff',
                gradient: { type: 'linear', from: '#ffffff', to: '#e2e8f0', angle: 135 },
              })
            }
            className={`flex-1 py-1 rounded font-medium transition-colors ${
              template.background.type === 'gradient' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Gradient
          </button>
        </div>

        {template.background.type === 'color' && (
          <div>
            <label className="text-[10px] text-slate-400">Background Color</label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="color"
                value={template.background.value || '#ffffff'}
                onChange={(e) => setBackground({ type: 'color', value: e.target.value })}
                className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={template.background.value || '#ffffff'}
                onChange={(e) => setBackground({ type: 'color', value: e.target.value })}
                className="flex-1 bg-slate-800 border border-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded font-mono"
              />
            </div>

            {/* Swatches */}
            <div className="grid grid-cols-8 gap-1 mt-2">
              {['#ffffff', '#f8fafc', '#0f172a', '#0369a1', '#1e1b4b', '#064e3b', '#451a03', '#831843'].map((c) => (
                <button
                  key={c}
                  onClick={() => setBackground({ type: 'color', value: c })}
                  className="w-5 h-5 rounded border border-slate-700 hover:scale-110 transition-transform"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        )}

        {template.background.type === 'gradient' && template.background.gradient && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400">From Color</label>
                <div className="flex items-center gap-1.5 mt-1">
                  <input
                    type="color"
                    value={template.background.gradient.from}
                    onChange={(e) =>
                      setBackground({
                        ...template.background,
                        gradient: { ...template.background.gradient!, from: e.target.value },
                      })
                    }
                    className="w-6 h-6 rounded border border-slate-700 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={template.background.gradient.from}
                    onChange={(e) =>
                      setBackground({
                        ...template.background,
                        gradient: { ...template.background.gradient!, from: e.target.value },
                      })
                    }
                    className="w-full bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400">To Color</label>
                <div className="flex items-center gap-1.5 mt-1">
                  <input
                    type="color"
                    value={template.background.gradient.to}
                    onChange={(e) =>
                      setBackground({
                        ...template.background,
                        gradient: { ...template.background.gradient!, to: e.target.value },
                      })
                    }
                    className="w-6 h-6 rounded border border-slate-700 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={template.background.gradient.to}
                    onChange={(e) =>
                      setBackground({
                        ...template.background,
                        gradient: { ...template.background.gradient!, to: e.target.value },
                      })
                    }
                    className="w-full bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Gradient Angle</span>
                <span>{template.background.gradient.angle || 135}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={template.background.gradient.angle || 135}
                onChange={(e) =>
                  setBackground({
                    ...template.background,
                    gradient: { ...template.background.gradient!, angle: Number(e.target.value) },
                  })
                }
                className="w-full accent-blue-500 h-1 bg-slate-700 rounded-lg cursor-pointer mt-1"
              />
            </div>
          </div>
        )}
      </div>

      {/* Tip card */}
      <div className="bg-slate-800/50 border border-slate-700/60 p-3 rounded-xl text-xs text-slate-400 space-y-1">
        <div className="font-semibold text-slate-300">Quick Tip</div>
        <p>
          Click any element on the card canvas to select it and edit its typography, field mapping, borders, and position.
        </p>
      </div>
    </aside>
  );
};

const ChevronUp = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
);

const ChevronDown = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);
