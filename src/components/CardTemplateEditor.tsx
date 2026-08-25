import React, { useState } from 'react';
import { CardTemplate, StaffData, StudentData } from '../types';
import { useCardEditor } from '../hooks/useCardEditor';
import { Header } from './Header';
import { LeftSidebar } from './LeftSidebar';
import { CanvasStage } from './CanvasStage';
import { RightSidebar } from './RightSidebar';
import { JsonModal } from './JsonModal';
import { DataPreviewDrawer } from './DataPreviewDrawer';
import { ShortcutsModal } from './ShortcutsModal';
import { Check, Info } from 'lucide-react';

export interface CardTemplateEditorProps {
  initialTemplate?: CardTemplate;
  previewStudentData?: StudentData;
  previewStaffData?: StaffData;
  onSave?: (template: CardTemplate) => void;
}

export const CardTemplateEditor: React.FC<CardTemplateEditorProps> = ({
  initialTemplate,
  previewStudentData,
  previewStaffData,
  onSave,
}) => {
  const editor = useCardEditor(initialTemplate);

  // Modals state
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isPreviewDrawerOpen, setIsPreviewDrawerOpen] = useState(false);
  const [saveToast, setSaveToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: '',
  });

  const handleSaveTemplate = () => {
    // 1. Save to local storage for persistence across reloads
    try {
      localStorage.setItem(`macarte_template_${editor.template.type}`, JSON.stringify(editor.template));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }

    // 2. Call external onSave prop if provided
    if (onSave) {
      onSave(editor.template);
    }

    // 3. Display feedback toast
    setSaveToast({
      show: true,
      message: `Template "${editor.template.name}" successfully saved as JSON!`,
    });
    setTimeout(() => {
      setSaveToast({ show: false, message: '' });
    }, 3000);
  };

  return (
    <div
      id="macarte_card_editor_root"
      className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans antialiased"
    >
      {/* Top Application Toolbar */}
      <Header
        template={editor.template}
        setTemplateName={editor.setTemplateName}
        switchCardType={editor.switchCardType}
        setDimensions={editor.setDimensions}
        toggleOrientation={editor.toggleOrientation}
        previewMode={editor.previewMode}
        setPreviewMode={editor.setPreviewMode}
        canUndo={editor.canUndo}
        canRedo={editor.canRedo}
        undo={editor.undo}
        redo={editor.redo}
        zoom={editor.zoom}
        setZoom={editor.setZoom}
        setPan={editor.setPan}
        showGrid={editor.showGrid}
        setShowGrid={editor.setShowGrid}
        snapToGrid={editor.snapToGrid}
        setSnapToGrid={editor.setSnapToGrid}
        resetToInitial={editor.resetToInitial}
        onOpenJsonModal={() => setIsJsonModalOpen(true)}
        onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
        onOpenPreviewDrawer={() => setIsPreviewDrawerOpen(true)}
        cyclePreviewProfile={
          editor.template.type === 'student'
            ? editor.cycleStudentProfile
            : editor.cycleStaffProfile
        }
        onSaveTemplate={handleSaveTemplate}
      />

      {/* Main 3-Column Studio Workspace */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Left: Dynamic Fields, Shapes, Branding & Layers */}
        <LeftSidebar
          template={editor.template}
          addElement={editor.addElement}
          selectedIds={editor.selectedIds}
          selectElement={editor.selectElement}
          toggleLock={editor.toggleLock}
          toggleHide={editor.toggleHide}
          deleteElement={editor.deleteElement}
          bringForward={editor.bringForward}
          sendBackward={editor.sendBackward}
        />

        {/* Center: Interactive Card Canvas Artboard */}
        <CanvasStage
          template={editor.template}
          selectedIds={editor.selectedIds}
          selectElement={editor.selectElement}
          clearSelection={editor.clearSelection}
          updateElement={editor.updateElement}
          updateSelectedElements={editor.updateSelectedElements}
          previewMode={editor.previewMode}
          studentData={editor.studentData}
          staffData={editor.staffData}
          zoom={editor.zoom}
          setZoom={editor.setZoom}
          pan={editor.pan}
          setPan={editor.setPan}
          showGrid={editor.showGrid}
          snapToGrid={editor.snapToGrid}
          gridSize={editor.gridSize}
          showGuides={editor.showGuides}
          activeTool={editor.activeTool}
        />

        {/* Right: Properties Inspector & Styling */}
        <RightSidebar
          template={editor.template}
          selectedElements={editor.selectedElements}
          primarySelected={editor.primarySelected}
          updateElement={editor.updateElement}
          updateSelectedStyle={editor.updateSelectedStyle}
          deleteSelected={editor.deleteSelected}
          duplicateSelected={editor.duplicateSelected}
          bringForward={editor.bringForward}
          sendBackward={editor.sendBackward}
          bringToFront={editor.bringToFront}
          sendToBack={editor.sendToBack}
          alignSelected={editor.alignSelected}
          setBackground={editor.setBackground}
          setDimensions={editor.setDimensions}
        />
      </main>

      {/* JSON Viewer & Import Modal */}
      <JsonModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        template={editor.template}
        onImportTemplate={editor.loadTemplate}
      />

      {/* Keyboard Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      {/* Dynamic Data Preview Inspector Drawer */}
      <DataPreviewDrawer
        isOpen={isPreviewDrawerOpen}
        onClose={() => setIsPreviewDrawerOpen(false)}
        cardType={editor.template.type}
        studentData={editor.studentData}
        setStudentData={editor.setStudentData}
        staffData={editor.staffData}
        setStaffData={editor.setStaffData}
      />

      {/* Save Notification Toast */}
      {saveToast.show && (
        <div
          id="toast_save_success"
          className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-white" />
          </div>
          <span>{saveToast.message}</span>
        </div>
      )}
    </div>
  );
};
