import React, { useState } from 'react';
import { CardTemplate } from '../types';
import { validateTemplateJson } from '../utils/templateUtils';
import {
  Code2,
  Copy,
  Check,
  Download,
  Upload,
  X,
  FileCode,
  AlertCircle,
} from 'lucide-react';

interface JsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: CardTemplate;
  onImportTemplate: (template: CardTemplate) => void;
}

export const JsonModal: React.FC<JsonModalProps> = ({
  isOpen,
  onClose,
  template,
  onImportTemplate,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'view' | 'import'>('view');
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(template, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.type}-template-${template.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    setImportError(null);
    const result = validateTemplateJson(importText);
    if (!result.valid || !result.template) {
      setImportError(result.error || 'Failed to parse JSON template');
      return;
    }

    onImportTemplate(result.template);
    setImportSuccess(true);
    setTimeout(() => {
      setImportSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div
      id="modal_json_viewer"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] text-slate-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Card Template JSON</h3>
              <p className="text-xs text-slate-400">
                Specification definition with dynamic field bindings (<code className="text-blue-300 font-mono">student.*</code> / <code className="text-blue-300 font-mono">staff.*</code>)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View / Import Tabs */}
            <div className="flex bg-slate-800 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setActiveTab('view')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  activeTab === 'view' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                View JSON
              </button>
              <button
                onClick={() => setActiveTab('import')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  activeTab === 'import' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Import / Paste
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'view' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{template.elements.length} elements mapped in template</span>
                <span className="font-mono text-slate-500">version {template.version}</span>
              </div>

              <div className="relative">
                <pre className="w-full bg-slate-950 border border-slate-800/80 rounded-xl p-4 font-mono text-xs text-emerald-400 overflow-x-auto max-h-[50vh] leading-relaxed select-text">
                  {jsonString}
                </pre>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Paste a valid card template JSON below to load and render it immediately into the visual editor.
              </p>

              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste Card Template JSON here..."
                rows={12}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
              />

              {importError && (
                <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-lg flex items-center gap-2 text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              {importSuccess && (
                <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-lg flex items-center gap-2 text-emerald-300 text-xs">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Template successfully imported!</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Export ready for integration with backend or print renderer
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'view' ? (
              <>
                <button
                  id="btn_copy_json"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy JSON'}</span>
                </button>

                <button
                  id="btn_download_json"
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .json</span>
                </button>
              </>
            ) : (
              <button
                id="btn_apply_import_json"
                onClick={handleImport}
                disabled={!importText.trim()}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Apply Template</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
