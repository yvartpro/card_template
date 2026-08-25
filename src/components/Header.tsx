import React, { useState } from 'react';
import { CardTemplate, CardType } from '../types';
import { DIMENSION_PRESETS } from '../constants/presets';
import {
  Undo2,
  Redo2,
  Code2,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid,
  Magnet,
  UserCheck,
  Briefcase,
  Layers,
  HelpCircle,
  Sparkles,
  Smartphone,
  CreditCard,
  RefreshCw,
} from 'lucide-react';

interface HeaderProps {
  template: CardTemplate;
  setTemplateName: (name: string) => void;
  switchCardType: (type: CardType) => void;
  setDimensions: (width: number, height: number) => void;
  toggleOrientation: () => void;
  previewMode: boolean;
  setPreviewMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  setPan: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  showGrid: boolean;
  setShowGrid: (val: boolean | ((prev: boolean) => boolean)) => void;
  snapToGrid: boolean;
  setSnapToGrid: (val: boolean | ((prev: boolean) => boolean)) => void;
  resetToInitial: () => void;
  onOpenJsonModal: () => void;
  onOpenShortcutsModal: () => void;
  onOpenPreviewDrawer: () => void;
  cyclePreviewProfile: () => void;
  onSaveTemplate: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  template,
  setTemplateName,
  switchCardType,
  setDimensions,
  toggleOrientation,
  previewMode,
  setPreviewMode,
  canUndo,
  canRedo,
  undo,
  redo,
  zoom,
  setZoom,
  setPan,
  showGrid,
  setShowGrid,
  snapToGrid,
  setSnapToGrid,
  resetToInitial,
  onOpenJsonModal,
  onOpenShortcutsModal,
  onOpenPreviewDrawer,
  cyclePreviewProfile,
  onSaveTemplate,
}) => {
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);

  const handleResetZoom = () => {
    setZoom(0.85);
    setPan({ x: 0, y: 0 });
  };

  const handleFitToScreen = () => {
    setZoom(0.75);
    setPan({ x: 0, y: 0 });
  };

  return (
    <header
      id="app_header_toolbar"
      className="h-16 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between text-white select-none z-30 shrink-0"
    >
      {/* Left: Logo & Template Mode Tabs */}
      <div className="flex items-center gap-5">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20">
            <CreditCard className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">macarte</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-400 font-semibold px-1.5 py-0.2 rounded">
                EDITOR
              </span>
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-slate-800" />

        {/* Student / Staff Card Mode Switcher Tabs */}
        <div className="flex bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
          <button
            id="tab_mode_student"
            onClick={() => switchCardType('student')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
              template.type === 'student'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Student Card</span>
          </button>
          <button
            id="tab_mode_staff"
            onClick={() => switchCardType('staff')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
              template.type === 'staff'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Staff Card</span>
          </button>
        </div>

        {/* Template Title Input */}
        <div className="hidden lg:flex items-center">
          <input
            id="template_name_input"
            type="text"
            value={template.name}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Template Name"
            className="bg-slate-800/60 hover:bg-slate-800 focus:bg-slate-800 text-slate-200 text-xs font-medium px-2.5 py-1.5 rounded-md border border-slate-700/60 focus:border-blue-500 focus:outline-none w-48 transition-colors truncate"
          />
        </div>
      </div>

      {/* Center: Canvas Dimensions, Undo/Redo & Zoom Tools */}
      <div className="flex items-center gap-2">
        {/* Preset Dimensions Dropdown */}
        <div className="relative">
          <button
            id="btn_dimension_presets"
            onClick={() => setShowPresetsMenu(!showPresetsMenu)}
            className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded-md border border-slate-700 transition-colors"
          >
            <span>{template.width} × {template.height} px</span>
            <span className="text-[10px] text-slate-400 uppercase">({template.orientation})</span>
          </button>

          {showPresetsMenu && (
            <div
              className="absolute top-full mt-2 left-0 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-100"
              onMouseLeave={() => setShowPresetsMenu(false)}
            >
              <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                Card Size Presets
              </div>
              {DIMENSION_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setDimensions(preset.width, preset.height);
                    setShowPresetsMenu(false);
                  }}
                  className={`text-left px-2.5 py-2 rounded-lg text-xs flex flex-col transition-colors ${
                    template.width === preset.width && template.height === preset.height
                      ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                      : 'hover:bg-slate-700/70 text-slate-200'
                  }`}
                >
                  <div className="font-medium flex justify-between">
                    <span>{preset.name}</span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {preset.width}×{preset.height}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{preset.description}</div>
                </button>
              ))}

              <div className="border-t border-slate-700/80 my-1" />

              <button
                onClick={() => {
                  toggleOrientation();
                  setShowPresetsMenu(false);
                }}
                className="text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-700 text-slate-300 flex items-center justify-between"
              >
                <span>Rotate Orientation ({template.orientation === 'landscape' ? 'Portrait' : 'Landscape'})</span>
                <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          )}
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center bg-slate-800/80 rounded-md border border-slate-700/60 p-0.5">
          <button
            id="btn_undo"
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 hover:bg-slate-700/60 transition-colors"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            id="btn_redo"
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 hover:bg-slate-700/60 transition-colors"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="hidden md:flex items-center bg-slate-800/80 rounded-md border border-slate-700/60 p-0.5">
          <button
            onClick={() => setZoom((prev) => Math.max(0.25, Number((prev - 0.1).toFixed(2))))}
            title="Zoom Out"
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetZoom}
            title="Reset Zoom"
            className="px-2 py-1 text-xs font-mono text-slate-300 hover:text-white"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={() => setZoom((prev) => Math.min(2.5, Number((prev + 0.1).toFixed(2))))}
            title="Zoom In"
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleFitToScreen}
            title="Fit to Canvas"
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Grid & Snap toggles */}
        <div className="hidden xl:flex items-center bg-slate-800/80 rounded-md border border-slate-700/60 p-0.5">
          <button
            onClick={() => setShowGrid((p) => !p)}
            title="Toggle Grid Canvas"
            className={`p-1.5 rounded transition-colors ${
              showGrid ? 'bg-blue-600/30 text-blue-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setSnapToGrid((p) => !p)}
            title="Toggle Snap to Grid"
            className={`p-1.5 rounded transition-colors ${
              snapToGrid ? 'bg-blue-600/30 text-blue-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Magnet className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right Actions: Preview Mode, Switch Data Persona, View JSON, Save */}
      <div className="flex items-center gap-2.5">
        {/* Dynamic Data Preview Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-800/90 p-1 rounded-lg border border-slate-700">
          <button
            id="btn_toggle_preview_mode"
            onClick={() => setPreviewMode((p) => !p)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              previewMode
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-amber-300 hover:bg-slate-700'
            }`}
            title="Toggle between real mock preview and field template placeholders"
          >
            {previewMode ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{previewMode ? 'Live Preview' : 'Field Tags'}</span>
          </button>

          {previewMode && (
            <button
              onClick={cyclePreviewProfile}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
              title="Cycle mock student/staff profiles"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onOpenPreviewDrawer}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
            title="Inspect/Customize Preview Data"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>

        {/* Reset Template */}
        <button
          id="btn_reset_template"
          onClick={resetToInitial}
          title="Reset to default starter template"
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* View JSON Modal Trigger */}
        <button
          id="btn_view_json"
          onClick={onOpenJsonModal}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-medium transition-colors"
        >
          <Code2 className="w-3.5 h-3.5 text-blue-400" />
          <span>View JSON</span>
        </button>

        {/* Save Template Button */}
        <button
          id="btn_save_template"
          onClick={onSaveTemplate}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-md shadow-blue-600/30 transition-all cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Template</span>
        </button>

        {/* Keyboard Shortcuts button */}
        <button
          onClick={onOpenShortcutsModal}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          title="Keyboard Shortcuts"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
