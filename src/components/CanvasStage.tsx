import React, { useRef, useState, useEffect, useCallback } from 'react';
import { CardElement, CardTemplate, StaffData, StudentData } from '../types';
import { CanvasElement } from './CanvasElement';
import { Lock, EyeOff, RotateCw } from 'lucide-react';

interface CanvasStageProps {
  template: CardTemplate;
  selectedIds: string[];
  selectElement: (id: string, multiSelect?: boolean) => void;
  clearSelection: () => void;
  updateElement: (id: string, partial: Partial<CardElement>, recordHistory?: boolean) => void;
  updateSelectedElements: (partial: Partial<CardElement>, recordHistory?: boolean) => void;
  previewMode: boolean;
  studentData: StudentData;
  staffData: StaffData;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  pan: { x: number; y: number };
  setPan: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  showGuides: boolean;
  activeTool: 'select' | 'hand';
}

type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

interface DragState {
  type: 'move' | 'resize' | 'rotate' | 'marquee' | 'pan';
  handle?: ResizeHandle;
  startX: number;
  startY: number;
  initialElements: { id: string; x: number; y: number; width: number; height: number; rotation: number }[];
  cardRect: DOMRect;
  centerX?: number;
  centerY?: number;
  initialAngle?: number;
}

interface AlignmentGuide {
  type: 'x' | 'y';
  pos: number;
}

export const CanvasStage: React.FC<CanvasStageProps> = ({
  template,
  selectedIds,
  selectElement,
  clearSelection,
  updateElement,
  previewMode,
  studentData,
  staffData,
  zoom,
  setZoom,
  pan,
  setPan,
  showGrid,
  snapToGrid,
  gridSize,
  showGuides,
  activeTool,
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [dragState, setDragState] = useState<DragState | null>(null);
  const [activeGuides, setActiveGuides] = useState<AlignmentGuide[]>([]);
  const [marqueeBox, setMarqueeBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  // Helper: Snap value to grid if enabled
  const snapVal = useCallback((val: number) => {
    if (!snapToGrid) return Math.round(val);
    return Math.round(val / gridSize) * gridSize;
  }, [snapToGrid, gridSize]);

  // Handle Wheel Zoom (Ctrl + Wheel or normal pinch)
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      setZoom((prev) => Math.min(2.5, Math.max(0.2, Number((prev * zoomFactor).toFixed(2)))));
    } else if (e.shiftKey) {
      // Pan horizontally
      setPan((prev) => ({ ...prev, x: prev.x - e.deltaY }));
    } else {
      // Pan vertically
      setPan((prev) => ({ ...prev, y: prev.y - e.deltaY }));
    }
  };

  // Start Element Drag / Move
  const handleElementMouseDown = (e: React.MouseEvent, element: CardElement) => {
    e.stopPropagation();

    if (activeTool === 'hand' || e.button !== 0) return;
    if (element.locked) {
      selectElement(element.id, e.shiftKey || e.metaKey || e.ctrlKey);
      return;
    }

    const isAlreadySelected = selectedIds.includes(element.id);
    const multi = e.shiftKey || e.metaKey || e.ctrlKey;

    if (!isAlreadySelected) {
      selectElement(element.id, multi);
    }

    const currentSelectedIds = isAlreadySelected
      ? selectedIds
      : multi
      ? [...selectedIds, element.id]
      : [element.id];

    if (!cardRef.current) return;
    const cardRect = cardRef.current.getBoundingClientRect();

    const initialElements = template.elements
      .filter((el) => currentSelectedIds.includes(el.id) && !el.locked)
      .map((el) => ({
        id: el.id,
        x: el.x,
        y: el.y,
        width: el.width,
        height: el.height,
        rotation: el.rotation || 0,
      }));

    setDragState({
      type: 'move',
      startX: e.clientX,
      startY: e.clientY,
      initialElements,
      cardRect,
    });
  };

  // Start Resize Handle Drag
  const handleResizeMouseDown = (e: React.MouseEvent, handle: ResizeHandle, element: CardElement) => {
    e.stopPropagation();
    if (element.locked || e.button !== 0) return;

    if (!cardRef.current) return;
    const cardRect = cardRef.current.getBoundingClientRect();

    setDragState({
      type: 'resize',
      handle,
      startX: e.clientX,
      startY: e.clientY,
      initialElements: [{
        id: element.id,
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
        rotation: element.rotation || 0,
      }],
      cardRect,
    });
  };

  // Start Rotation Handle Drag
  const handleRotateMouseDown = (e: React.MouseEvent, element: CardElement) => {
    e.stopPropagation();
    if (element.locked || e.button !== 0) return;

    if (!cardRef.current) return;
    const cardRect = cardRef.current.getBoundingClientRect();
    const elemCenterCanvasX = element.x + element.width / 2;
    const elemCenterCanvasY = element.y + element.height / 2;
    const elemCenterScreenX = cardRect.left + elemCenterCanvasX * zoom;
    const elemCenterScreenY = cardRect.top + elemCenterCanvasY * zoom;

    const initialAngle = Math.atan2(e.clientY - elemCenterScreenY, e.clientX - elemCenterScreenX);

    setDragState({
      type: 'rotate',
      startX: e.clientX,
      startY: e.clientY,
      centerX: elemCenterScreenX,
      centerY: elemCenterScreenY,
      initialAngle,
      initialElements: [{
        id: element.id,
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
        rotation: element.rotation || 0,
      }],
      cardRect,
    });
  };

  // Background Stage Click & Marquee
  const handleStageMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || activeTool === 'hand' || e.spaceKey) {
      // Pan mode
      setDragState({
        type: 'pan',
        startX: e.clientX,
        startY: e.clientY,
        initialElements: [],
        cardRect: cardRef.current?.getBoundingClientRect() || new DOMRect(),
      });
      return;
    }

    if (e.target === stageRef.current || (cardRef.current && e.target === cardRef.current)) {
      if (!e.shiftKey) {
        clearSelection();
      }
      if (cardRef.current) {
        const cardRect = cardRef.current.getBoundingClientRect();
        const canvasX = (e.clientX - cardRect.left) / zoom;
        const canvasY = (e.clientY - cardRect.top) / zoom;

        setDragState({
          type: 'marquee',
          startX: canvasX,
          startY: canvasY,
          initialElements: [],
          cardRect,
        });
        setMarqueeBox({ x: canvasX, y: canvasY, width: 0, height: 0 });
      }
    }
  };

  // Global Mouse Move & Mouse Up
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState) return;

      if (dragState.type === 'pan') {
        const dx = e.clientX - dragState.startX;
        const dy = e.clientY - dragState.startY;
        setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
        setDragState((prev) => prev ? { ...prev, startX: e.clientX, startY: e.clientY } : null);
        return;
      }

      if (dragState.type === 'marquee' && cardRef.current) {
        const cardRect = cardRef.current.getBoundingClientRect();
        const currentCanvasX = (e.clientX - cardRect.left) / zoom;
        const currentCanvasY = (e.clientY - cardRect.top) / zoom;

        const x = Math.min(dragState.startX, currentCanvasX);
        const y = Math.min(dragState.startY, currentCanvasY);
        const width = Math.abs(currentCanvasX - dragState.startX);
        const height = Math.abs(currentCanvasY - dragState.startY);

        setMarqueeBox({ x, y, width, height });

        // Check which elements intersect
        const intersectingIds = template.elements
          .filter((el) => {
            return (
              el.x < x + width &&
              el.x + el.width > x &&
              el.y < y + height &&
              el.y + el.height > y
            );
          })
          .map((el) => el.id);

        if (intersectingIds.length > 0) {
          intersectingIds.forEach((id) => selectElement(id, true));
        }
        return;
      }

      if (dragState.type === 'move') {
        const deltaScreenX = e.clientX - dragState.startX;
        const deltaScreenY = e.clientY - dragState.startY;
        const deltaCanvasX = deltaScreenX / zoom;
        const deltaCanvasY = deltaScreenY / zoom;

        const guides: AlignmentGuide[] = [];

        dragState.initialElements.forEach((initEl) => {
          let nextX = snapVal(initEl.x + deltaCanvasX);
          let nextY = snapVal(initEl.y + deltaCanvasY);

          // Guide checks: Canvas Center Snap
          if (showGuides) {
            const centerX = template.width / 2;
            const centerY = template.height / 2;
            const elemCenterX = nextX + initEl.width / 2;
            const elemCenterY = nextY + initEl.height / 2;

            if (Math.abs(elemCenterX - centerX) < 6) {
              nextX = Math.round(centerX - initEl.width / 2);
              guides.push({ type: 'x', pos: centerX });
            }
            if (Math.abs(elemCenterY - centerY) < 6) {
              nextY = Math.round(centerY - initEl.height / 2);
              guides.push({ type: 'y', pos: centerY });
            }
            if (Math.abs(nextX) < 6) {
              nextX = 0;
              guides.push({ type: 'x', pos: 0 });
            }
            if (Math.abs(nextY) < 6) {
              nextY = 0;
              guides.push({ type: 'y', pos: 0 });
            }
          }

          updateElement(initEl.id, { x: nextX, y: nextY }, false);
        });

        setActiveGuides(guides);
      }

      if (dragState.type === 'resize' && dragState.handle && dragState.initialElements[0]) {
        const initEl = dragState.initialElements[0];
        const deltaScreenX = e.clientX - dragState.startX;
        const deltaScreenY = e.clientY - dragState.startY;
        const deltaCanvasX = deltaScreenX / zoom;
        const deltaCanvasY = deltaScreenY / zoom;

        let newX = initEl.x;
        let newY = initEl.y;
        let newWidth = initEl.width;
        let newHeight = initEl.height;
        const minSize = 15;

        const handle = dragState.handle;

        if (handle.includes('e')) {
          newWidth = Math.max(minSize, snapVal(initEl.width + deltaCanvasX));
        }
        if (handle.includes('s')) {
          newHeight = Math.max(minSize, snapVal(initEl.height + deltaCanvasY));
        }
        if (handle.includes('w')) {
          const rawW = initEl.width - deltaCanvasX;
          newWidth = Math.max(minSize, snapVal(rawW));
          newX = initEl.x + (initEl.width - newWidth);
        }
        if (handle.includes('n')) {
          const rawH = initEl.height - deltaCanvasY;
          newHeight = Math.max(minSize, snapVal(rawH));
          newY = initEl.y + (initEl.height - newHeight);
        }

        updateElement(initEl.id, { x: newX, y: newY, width: newWidth, height: newHeight }, false);
      }

      if (dragState.type === 'rotate' && dragState.centerX && dragState.centerY && dragState.initialElements[0]) {
        const initEl = dragState.initialElements[0];
        const currentAngle = Math.atan2(e.clientY - dragState.centerY, e.clientX - dragState.centerX);
        let angleDeg = Math.round((currentAngle * 180) / Math.PI) + 90;

        // Snap to 0, 45, 90, 180, 270 if Shift key pressed
        if (e.shiftKey) {
          angleDeg = Math.round(angleDeg / 45) * 45;
        }

        angleDeg = (angleDeg % 360 + 360) % 360;

        updateElement(initEl.id, { rotation: angleDeg }, false);
      }
    };

    const handleMouseUp = () => {
      if (dragState) {
        // Record final history entry if it was an editing drag
        if (dragState.type === 'move' || dragState.type === 'resize' || dragState.type === 'rotate') {
          dragState.initialElements.forEach((el) => {
            const current = template.elements.find((item) => item.id === el.id);
            if (current) {
              updateElement(el.id, { ...current }, true);
            }
          });
        }
        setDragState(null);
        setActiveGuides([]);
        setMarqueeBox(null);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, zoom, template, snapVal, showGuides, updateElement, selectElement]);

  // Render Background Styling
  const getBackgroundStyle = (): React.CSSProperties => {
    const { background } = template;
    if (background.type === 'gradient' && background.gradient) {
      const { from, to, angle = 135 } = background.gradient;
      return {
        background: `linear-gradient(${angle}deg, ${from}, ${to})`,
      };
    }
    if (background.type === 'image' && background.value) {
      return {
        backgroundImage: `url(${background.value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    return {
      backgroundColor: background.value || '#ffffff',
    };
  };

  const selectedElements = template.elements.filter((el) => selectedIds.includes(el.id));
  const isSingleSelection = selectedElements.length === 1;
  const singleSelected = isSingleSelection ? selectedElements[0] : null;

  return (
    <div
      ref={stageRef}
      id="card_canvas_stage"
      className="relative flex-1 h-full w-full overflow-hidden bg-slate-900/95 select-none flex items-center justify-center cursor-default"
      onWheel={handleWheel}
      onMouseDown={handleStageMouseDown}
      style={{
        cursor: activeTool === 'hand' || dragState?.type === 'pan' ? 'grab' : 'default',
      }}
    >
      {/* Background Dots Canvas Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: showGrid
            ? 'radial-gradient(circle, #94a3b8 1px, transparent 1px)'
            : 'none',
          backgroundSize: `${gridSize * zoom}px ${gridSize * zoom}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`,
        }}
      />

      {/* Main Card Container */}
      <div
        className="relative transition-transform duration-75 origin-center"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          width: `${template.width}px`,
          height: `${template.height}px`,
        }}
      >
        {/* Card Shadow and Frame */}
        <div
          ref={cardRef}
          id="card_canvas_artboard"
          className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl transition-[box-shadow]"
          style={{
            ...getBackgroundStyle(),
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Render Elements Sorted by zIndex */}
          {[...template.elements]
            .filter((el) => !el.hidden)
            .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
            .map((element) => {
              const isSelected = selectedIds.includes(element.id);

              return (
                <div
                  key={element.id}
                  id={`canvas_elem_${element.id}`}
                  onMouseDown={(e) => handleElementMouseDown(e, element)}
                  className="absolute cursor-move group"
                  style={{
                    left: `${element.x}px`,
                    top: `${element.y}px`,
                    width: `${element.width}px`,
                    height: `${element.height}px`,
                    transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
                    zIndex: element.zIndex || 1,
                  }}
                >
                  <CanvasElement
                    element={element}
                    previewMode={previewMode}
                    studentData={studentData}
                    staffData={staffData}
                    isSelected={isSelected}
                  />

                  {/* Lock Indicator */}
                  {element.locked && (
                    <div className="absolute top-1 right-1 bg-slate-900/80 text-amber-400 p-1 rounded-full shadow-xs pointer-events-none">
                      <Lock className="w-3 h-3" />
                    </div>
                  )}

                  {/* Single Selection Transform Handles */}
                  {isSelected && isSingleSelection && !element.locked && (
                    <>
                      {/* Bounding Box Outline */}
                      <div className="absolute -inset-0.5 border-2 border-blue-500 pointer-events-none rounded-xs" />

                      {/* 8 Resize Handles */}
                      {(['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as ResizeHandle[]).map((handle) => {
                        let positionClasses = '';
                        let cursorClass = '';
                        switch (handle) {
                          case 'nw':
                            positionClasses = '-top-1.5 -left-1.5';
                            cursorClass = 'cursor-nwse-resize';
                            break;
                          case 'n':
                            positionClasses = '-top-1.5 left-1/2 -translate-x-1/2';
                            cursorClass = 'cursor-ns-resize';
                            break;
                          case 'ne':
                            positionClasses = '-top-1.5 -right-1.5';
                            cursorClass = 'cursor-nesw-resize';
                            break;
                          case 'e':
                            positionClasses = 'top-1/2 -right-1.5 -translate-y-1/2';
                            cursorClass = 'cursor-ew-resize';
                            break;
                          case 'se':
                            positionClasses = '-bottom-1.5 -right-1.5';
                            cursorClass = 'cursor-nwse-resize';
                            break;
                          case 's':
                            positionClasses = '-bottom-1.5 left-1/2 -translate-x-1/2';
                            cursorClass = 'cursor-ns-resize';
                            break;
                          case 'sw':
                            positionClasses = '-bottom-1.5 -left-1.5';
                            cursorClass = 'cursor-nesw-resize';
                            break;
                          case 'w':
                            positionClasses = 'top-1/2 -left-1.5 -translate-y-1/2';
                            cursorClass = 'cursor-ew-resize';
                            break;
                        }

                        return (
                          <div
                            key={handle}
                            onMouseDown={(e) => handleResizeMouseDown(e, handle, element)}
                            className={`absolute w-3 h-3 bg-white border-2 border-blue-600 rounded-xs shadow-xs z-50 ${positionClasses} ${cursorClass}`}
                          />
                        );
                      })}

                      {/* Rotation Handle */}
                      <div
                        onMouseDown={(e) => handleRotateMouseDown(e, element)}
                        className="absolute -top-7 left-1/2 -translate-x-1/2 w-5 h-5 bg-white border-2 border-blue-600 rounded-full shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing z-50 hover:bg-blue-50 transition-colors"
                        title="Drag to Rotate"
                      >
                        <RotateCw className="w-2.5 h-2.5 text-blue-600" />
                      </div>
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-blue-500 pointer-events-none" />
                    </>
                  )}

                  {/* Multi-selection bounding box highlight */}
                  {isSelected && !isSingleSelection && (
                    <div className="absolute -inset-0.5 border-2 border-dashed border-blue-400 pointer-events-none" />
                  )}
                </div>
              );
            })}
        </div>

        {/* Alignment Guide Lines */}
        {activeGuides.map((guide, idx) => (
          <div
            key={idx}
            className="absolute pointer-events-none z-50"
            style={{
              left: guide.type === 'x' ? `${guide.pos}px` : '0px',
              top: guide.type === 'y' ? `${guide.pos}px` : '0px',
              width: guide.type === 'x' ? '1px' : '100%',
              height: guide.type === 'y' ? '1px' : '100%',
              backgroundColor: '#38bdf8',
              boxShadow: '0 0 4px #0284c7',
            }}
          />
        ))}

        {/* Marquee Selection Visual Box */}
        {marqueeBox && (
          <div
            className="absolute border border-blue-400 bg-blue-500/15 pointer-events-none z-50"
            style={{
              left: `${marqueeBox.x}px`,
              top: `${marqueeBox.y}px`,
              width: `${marqueeBox.width}px`,
              height: `${marqueeBox.height}px`,
            }}
          />
        )}
      </div>

      {/* Floating Canvas Footer Badge */}
      <div className="absolute bottom-4 left-6 bg-slate-800/90 backdrop-blur-md border border-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-lg flex items-center gap-3 shadow-lg pointer-events-none">
        <span className="font-medium text-white">
          {template.width} × {template.height} {template.unit}
        </span>
        <span className="text-slate-500">•</span>
        <span>{Math.round(zoom * 100)}%</span>
        <span className="text-slate-500">•</span>
        <span className="capitalize">{template.type} Card</span>
        {singleSelected && (
          <>
            <span className="text-slate-500">•</span>
            <span className="text-blue-400">
              X: {singleSelected.x}, Y: {singleSelected.y} ({singleSelected.width}×{singleSelected.height})
            </span>
          </>
        )}
      </div>
    </div>
  );
};
