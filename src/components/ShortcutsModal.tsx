import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl + Z / ⌘Z', desc: 'Undo last change' },
    { key: 'Ctrl + Y / ⌘⇧Z', desc: 'Redo change' },
    { key: 'Ctrl + D / ⌘D', desc: 'Duplicate selected element(s)' },
    { key: 'Delete / Backspace', desc: 'Delete selected element(s)' },
    { key: 'Ctrl + A / ⌘A', desc: 'Select all elements' },
    { key: 'Arrow Keys', desc: 'Nudge element by 1px' },
    { key: 'Shift + Arrow Keys', desc: 'Move element by 10px' },
    { key: 'Shift + Drag Handle', desc: 'Maintain aspect ratio / snap rotation angle to 45°' },
    { key: 'Middle Mouse / Space + Drag', desc: 'Pan canvas' },
    { key: 'Ctrl + Mouse Wheel', desc: 'Zoom in / Zoom out' },
  ];

  return (
    <div
      id="modal_shortcuts"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Keyboard Shortcuts</h3>
              <p className="text-xs text-slate-400">Boost your ID card design workflow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {shortcuts.map((sc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-800/50 border border-slate-800/80 text-xs"
            >
              <span className="text-slate-300">{sc.desc}</span>
              <kbd className="bg-slate-950 text-blue-300 font-mono px-2 py-1 rounded border border-slate-700/80 text-[11px] shadow-xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-xs font-semibold"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
