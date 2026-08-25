import { useState, useCallback, useRef, useEffect } from 'react';
import {
  CardElement,
  CardTemplate,
  CardType,
  BackgroundConfig,
  StudentData,
  StaffData,
} from '../types';
import {
  INITIAL_STUDENT_TEMPLATE,
  INITIAL_STAFF_TEMPLATE,
} from '../constants/presets';
import {
  PREVIEW_STUDENT_DATA,
  PREVIEW_STAFF_DATA,
  ALTERNATIVE_STUDENT_PROFILES,
  ALTERNATIVE_STAFF_PROFILES,
} from '../constants/fields';
import { cloneTemplate, generateElementId } from '../utils/templateUtils';

export function useCardEditor(initialCustomTemplate?: CardTemplate) {
  // 1. Template State
  const [template, setTemplate] = useState<CardTemplate>(() => {
    return initialCustomTemplate ? cloneTemplate(initialCustomTemplate) : cloneTemplate(INITIAL_STUDENT_TEMPLATE);
  });

  // 2. Selection & Tool State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTool, setActiveTool] = useState<'select' | 'hand'>('select');
  const [previewMode, setPreviewMode] = useState<boolean>(true); // Preview dynamic mock data by default for rich visual feedback
  const [zoom, setZoom] = useState<number>(0.9);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true);
  const [gridSize, setGridSize] = useState<number>(10);
  const [showGuides, setShowGuides] = useState<boolean>(true);

  // 3. Mock Data Profiles
  const [studentData, setStudentData] = useState<StudentData>(PREVIEW_STUDENT_DATA);
  const [staffData, setStaffData] = useState<StaffData>(PREVIEW_STAFF_DATA);
  const [studentProfileIndex, setStudentProfileIndex] = useState<number>(0);
  const [staffProfileIndex, setStaffProfileIndex] = useState<number>(0);

  // 4. Undo / Redo History
  const historyRef = useRef<CardTemplate[]>([cloneTemplate(template)]);
  const historyIndexRef = useRef<number>(0);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);

  const updateHistoryState = useCallback(() => {
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  }, []);

  const pushHistory = useCallback((newTemplate: CardTemplate) => {
    const nextHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    nextHistory.push(cloneTemplate(newTemplate));
    // Limit history stack size to 50
    if (nextHistory.length > 50) {
      nextHistory.shift();
    }
    historyRef.current = nextHistory;
    historyIndexRef.current = nextHistory.length - 1;
    updateHistoryState();
  }, [updateHistoryState]);

  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      const prevTemplate = cloneTemplate(historyRef.current[historyIndexRef.current]);
      setTemplate(prevTemplate);
      updateHistoryState();
    }
  }, [updateHistoryState]);

  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      const nextTemplate = cloneTemplate(historyRef.current[historyIndexRef.current]);
      setTemplate(nextTemplate);
      updateHistoryState();
    }
  }, [updateHistoryState]);

  // Apply template modification with history tracking
  const modifyTemplate = useCallback((updater: (prev: CardTemplate) => CardTemplate, recordHistory = true) => {
    setTemplate((prev) => {
      const next = updater(cloneTemplate(prev));
      if (recordHistory) {
        pushHistory(next);
      }
      return next;
    });
  }, [pushHistory]);

  // Selected element(s) helper
  const selectedElements = template.elements.filter((el) => selectedIds.includes(el.id));
  const primarySelected = selectedElements[0] || null;

  // Selection handlers
  const selectElement = useCallback((id: string, multiSelect = false) => {
    setSelectedIds((prev) => {
      if (multiSelect) {
        if (prev.includes(id)) {
          return prev.filter((item) => item !== id);
        }
        return [...prev, id];
      }
      return [id];
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(template.elements.map((el) => el.id));
  }, [template.elements]);

  // Element CRUD Operations
  const addElement = useCallback((newElement: CardElement) => {
    modifyTemplate((prev) => {
      const maxZ = prev.elements.reduce((max, el) => Math.max(max, el.zIndex || 1), 0);
      const elemToAdd = {
        ...newElement,
        zIndex: maxZ + 1,
      };
      return {
        ...prev,
        elements: [...prev.elements, elemToAdd],
      };
    });
    setSelectedIds([newElement.id]);
  }, [modifyTemplate]);

  const updateElement = useCallback((id: string, partial: Partial<CardElement>, recordHistory = true) => {
    modifyTemplate((prev) => {
      return {
        ...prev,
        elements: prev.elements.map((el) => (el.id === id ? { ...el, ...partial } : el)),
      };
    }, recordHistory);
  }, [modifyTemplate]);

  const updateSelectedElements = useCallback((partial: Partial<CardElement>, recordHistory = true) => {
    if (selectedIds.length === 0) return;
    modifyTemplate((prev) => {
      return {
        ...prev,
        elements: prev.elements.map((el) => (selectedIds.includes(el.id) ? { ...el, ...partial } : el)),
      };
    }, recordHistory);
  }, [selectedIds, modifyTemplate]);

  const updateSelectedStyle = useCallback((partialStyle: Partial<CardElement['style']>, recordHistory = true) => {
    if (selectedIds.length === 0) return;
    modifyTemplate((prev) => {
      return {
        ...prev,
        elements: prev.elements.map((el) => {
          if (!selectedIds.includes(el.id)) return el;
          return {
            ...el,
            style: {
              ...el.style,
              ...partialStyle,
            },
          };
        }),
      };
    }, recordHistory);
  }, [selectedIds, modifyTemplate]);

  const deleteSelected = useCallback(() => {
    if (selectedIds.length === 0) return;
    modifyTemplate((prev) => {
      return {
        ...prev,
        elements: prev.elements.filter((el) => !selectedIds.includes(el.id)),
      };
    });
    setSelectedIds([]);
  }, [selectedIds, modifyTemplate]);

  const deleteElement = useCallback((id: string) => {
    modifyTemplate((prev) => {
      return {
        ...prev,
        elements: prev.elements.filter((el) => el.id !== id),
      };
    });
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  }, [modifyTemplate]);

  const duplicateSelected = useCallback(() => {
    if (selectedIds.length === 0) return;
    const newAddedIds: string[] = [];

    modifyTemplate((prev) => {
      const maxZ = prev.elements.reduce((max, el) => Math.max(max, el.zIndex || 1), 0);
      const duplicates: CardElement[] = [];

      prev.elements.forEach((el, idx) => {
        if (selectedIds.includes(el.id)) {
          const newId = generateElementId();
          newAddedIds.push(newId);
          const clonedElement: CardElement = JSON.parse(JSON.stringify(el));
          duplicates.push({
            ...clonedElement,
            id: newId,
            name: `${el.name} (Copy)`,
            x: el.x + 20,
            y: el.y + 20,
            zIndex: maxZ + idx + 1,
          });
        }
      });

      return {
        ...prev,
        elements: [...prev.elements, ...duplicates],
      };
    });

    if (newAddedIds.length > 0) {
      setSelectedIds(newAddedIds);
    }
  }, [selectedIds, modifyTemplate]);

  // Layer Ordering
  const bringForward = useCallback(() => {
    if (selectedIds.length === 0) return;
    modifyTemplate((prev) => {
      const elements = [...prev.elements];
      const targetIndex = elements.findIndex((el) => selectedIds.includes(el.id));
      if (targetIndex >= 0 && targetIndex < elements.length - 1) {
        const item = elements.splice(targetIndex, 1)[0];
        elements.splice(targetIndex + 1, 0, item);
      }
      return { ...prev, elements };
    });
  }, [selectedIds, modifyTemplate]);

  const sendBackward = useCallback(() => {
    if (selectedIds.length === 0) return;
    modifyTemplate((prev) => {
      const elements = [...prev.elements];
      const targetIndex = elements.findIndex((el) => selectedIds.includes(el.id));
      if (targetIndex > 0) {
        const item = elements.splice(targetIndex, 1)[0];
        elements.splice(targetIndex - 1, 0, item);
      }
      return { ...prev, elements };
    });
  }, [selectedIds, modifyTemplate]);

  const bringToFront = useCallback(() => {
    if (selectedIds.length === 0) return;
    modifyTemplate((prev) => {
      const selected = prev.elements.filter((el) => selectedIds.includes(el.id));
      const unselected = prev.elements.filter((el) => !selectedIds.includes(el.id));
      return { ...prev, elements: [...unselected, ...selected] };
    });
  }, [selectedIds, modifyTemplate]);

  const sendToBack = useCallback(() => {
    if (selectedIds.length === 0) return;
    modifyTemplate((prev) => {
      const selected = prev.elements.filter((el) => selectedIds.includes(el.id));
      const unselected = prev.elements.filter((el) => !selectedIds.includes(el.id));
      return { ...prev, elements: [...selected, ...unselected] };
    });
  }, [selectedIds, modifyTemplate]);

  // Lock / Hide
  const toggleLock = useCallback((id: string) => {
    modifyTemplate((prev) => ({
      ...prev,
      elements: prev.elements.map((el) => (el.id === id ? { ...el, locked: !el.locked } : el)),
    }));
  }, [modifyTemplate]);

  const toggleHide = useCallback((id: string) => {
    modifyTemplate((prev) => ({
      ...prev,
      elements: prev.elements.map((el) => (el.id === id ? { ...el, hidden: !el.hidden } : el)),
    }));
  }, [modifyTemplate]);

  // Alignments
  const alignSelected = useCallback((alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (selectedIds.length === 0) return;
    modifyTemplate((prev) => {
      if (selectedIds.length === 1) {
        // Align relative to canvas bounds
        const target = prev.elements.find((el) => el.id === selectedIds[0]);
        if (!target) return prev;
        let newX = target.x;
        let newY = target.y;
        if (alignment === 'left') newX = 0;
        if (alignment === 'center') newX = Math.round((prev.width - target.width) / 2);
        if (alignment === 'right') newX = prev.width - target.width;
        if (alignment === 'top') newY = 0;
        if (alignment === 'middle') newY = Math.round((prev.height - target.height) / 2);
        if (alignment === 'bottom') newY = prev.height - target.height;

        return {
          ...prev,
          elements: prev.elements.map((el) => (el.id === target.id ? { ...el, x: newX, y: newY } : el)),
        };
      }

      // Align multiple relative to selection bounding box
      const selected = prev.elements.filter((el) => selectedIds.includes(el.id));
      const minX = Math.min(...selected.map((el) => el.x));
      const maxX = Math.max(...selected.map((el) => el.x + el.width));
      const minY = Math.min(...selected.map((el) => el.y));
      const maxY = Math.max(...selected.map((el) => el.y + el.height));
      const centerX = minX + (maxX - minX) / 2;
      const centerY = minY + (maxY - minY) / 2;

      return {
        ...prev,
        elements: prev.elements.map((el) => {
          if (!selectedIds.includes(el.id)) return el;
          let x = el.x;
          let y = el.y;
          if (alignment === 'left') x = minX;
          if (alignment === 'center') x = Math.round(centerX - el.width / 2);
          if (alignment === 'right') x = maxX - el.width;
          if (alignment === 'top') y = minY;
          if (alignment === 'middle') y = Math.round(centerY - el.height / 2);
          if (alignment === 'bottom') y = maxY - el.height;
          return { ...el, x, y };
        }),
      };
    });
  }, [selectedIds, modifyTemplate]);

  // Card Type Switcher
  const switchCardType = useCallback((newType: CardType) => {
    if (newType === template.type) return;
    const starterTemplate = newType === 'student' ? INITIAL_STUDENT_TEMPLATE : INITIAL_STAFF_TEMPLATE;
    const cloned = cloneTemplate(starterTemplate);
    setTemplate(cloned);
    setSelectedIds([]);
    pushHistory(cloned);
  }, [template.type, pushHistory]);

  // Dimensions & Orientation
  const setDimensions = useCallback((width: number, height: number) => {
    modifyTemplate((prev) => ({
      ...prev,
      width,
      height,
      orientation: height > width ? 'portrait' : 'landscape',
    }));
  }, [modifyTemplate]);

  const toggleOrientation = useCallback(() => {
    modifyTemplate((prev) => {
      const nextWidth = prev.height;
      const nextHeight = prev.width;
      return {
        ...prev,
        width: nextWidth,
        height: nextHeight,
        orientation: nextHeight > nextWidth ? 'portrait' : 'landscape',
      };
    });
  }, [modifyTemplate]);

  // Background
  const setBackground = useCallback((background: BackgroundConfig) => {
    modifyTemplate((prev) => ({
      ...prev,
      background,
    }));
  }, [modifyTemplate]);

  const setTemplateName = useCallback((name: string) => {
    modifyTemplate((prev) => ({ ...prev, name }), false);
  }, [modifyTemplate]);

  // Reset Template
  const resetToInitial = useCallback(() => {
    const starter = template.type === 'student' ? INITIAL_STUDENT_TEMPLATE : INITIAL_STAFF_TEMPLATE;
    const cloned = cloneTemplate(starter);
    setTemplate(cloned);
    setSelectedIds([]);
    pushHistory(cloned);
  }, [template.type, pushHistory]);

  // Load Custom or Preset Template
  const loadTemplate = useCallback((newTemplate: CardTemplate) => {
    const cloned = cloneTemplate(newTemplate);
    setTemplate(cloned);
    setSelectedIds([]);
    pushHistory(cloned);
  }, [pushHistory]);

  // Switch preview profiles
  const cycleStudentProfile = useCallback(() => {
    const nextIdx = (studentProfileIndex + 1) % ALTERNATIVE_STUDENT_PROFILES.length;
    setStudentProfileIndex(nextIdx);
    setStudentData(ALTERNATIVE_STUDENT_PROFILES[nextIdx]);
  }, [studentProfileIndex]);

  const cycleStaffProfile = useCallback(() => {
    const nextIdx = (staffProfileIndex + 1) % ALTERNATIVE_STAFF_PROFILES.length;
    setStaffProfileIndex(nextIdx);
    setStaffData(ALTERNATIVE_STAFF_PROFILES[nextIdx]);
  }, [staffProfileIndex]);

  // Keyboard Shortcuts Hook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input or textarea
      if (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName) ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      // Undo: Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      // Redo: Ctrl+Y or Cmd+Shift+Z or Ctrl+Shift+Z
      if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        redo();
        return;
      }

      // Duplicate: Ctrl+D / Cmd+D
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        duplicateSelected();
        return;
      }

      // Select All: Ctrl+A / Cmd+A
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        selectAll();
        return;
      }

      // Delete: Backspace or Delete
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSelected();
        return;
      }

      // Arrow Keys for moving elements
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        if (selectedIds.length === 0) return;
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        let deltaX = 0;
        let deltaY = 0;
        if (e.key === 'ArrowLeft') deltaX = -step;
        if (e.key === 'ArrowRight') deltaX = step;
        if (e.key === 'ArrowUp') deltaY = -step;
        if (e.key === 'ArrowDown') deltaY = step;

        modifyTemplate((prev) => ({
          ...prev,
          elements: prev.elements.map((el) => {
            if (!selectedIds.includes(el.id) || el.locked) return el;
            return {
              ...el,
              x: el.x + deltaX,
              y: el.y + deltaY,
            };
          }),
        }), false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, duplicateSelected, selectAll, deleteSelected, selectedIds, modifyTemplate]);

  return {
    template,
    selectedIds,
    selectedElements,
    primarySelected,
    activeTool,
    setActiveTool,
    previewMode,
    setPreviewMode,
    zoom,
    setZoom,
    pan,
    setPan,
    showGrid,
    setShowGrid,
    snapToGrid,
    setSnapToGrid,
    gridSize,
    setGridSize,
    showGuides,
    setShowGuides,
    studentData,
    setStudentData,
    staffData,
    setStaffData,
    cycleStudentProfile,
    cycleStaffProfile,
    canUndo,
    canRedo,
    undo,
    redo,
    selectElement,
    clearSelection,
    selectAll,
    addElement,
    updateElement,
    updateSelectedElements,
    updateSelectedStyle,
    deleteSelected,
    deleteElement,
    duplicateSelected,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    toggleLock,
    toggleHide,
    alignSelected,
    switchCardType,
    setDimensions,
    toggleOrientation,
    setBackground,
    setTemplateName,
    resetToInitial,
    loadTemplate,
  };
}
