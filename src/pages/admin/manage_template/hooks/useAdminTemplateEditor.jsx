import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useTemplates from '../../../../api/templates/useTemplates';
import { INITIAL_PROJECT_DATA } from '../../../../utils/editorDefault';
import { COVER_REGISTRY } from '../../../../utils/CoverBuilder';

const deepClone = (v) => (v ? JSON.parse(JSON.stringify(v)) : v);

const DEFAULT_CARD = {
  bgType: 'gradient',
  gradient: { from: '#eef2ff', to: '#ffffff' },
  color: '#ffffff',
  bgImage: null,
  pattern: 'none',
  radius: 28,
  padding: 32,
};

const DEFAULT_MUSIC = { src: null, autoplay: false, loop: true, volume: 0.4 };
const DEFAULT_SNAP = { enabled: true, size: 25, color: 'rgba(0,0,0,0.08)', lineSize: 1 };

const makePageShape = (page, fallbackName, fallbackId) => {
  const raw = page ? deepClone(page) : {};
  const id = raw.id ?? fallbackId ?? `page-${Math.random().toString(36).slice(2, 9)}`;
  const name = raw.name ?? fallbackName ?? 'Halaman';
  const cardSource = raw.card || {};
  const musicSource = raw.music || {};
  const snapSource = raw.snap || {};
  const elementsSource = Array.isArray(raw.elements) ? raw.elements : [];

  return {
    ...raw,
    id,
    name,
    card: {
      ...DEFAULT_CARD,
      ...cardSource,
      gradient: { ...DEFAULT_CARD.gradient, ...(cardSource.gradient || {}) },
    },
    music: { ...DEFAULT_MUSIC, ...musicSource },
    snap: { ...DEFAULT_SNAP, ...snapSource },
    elements: deepClone(elementsSource),
  };
};

const makeCoverShape = (cover) => {
  const raw = cover ? deepClone(cover) : {};
  const requestedType = raw.type ?? 'wedding';
  const validType = COVER_REGISTRY.types[requestedType] ? requestedType : 'wedding';
  const defaultCover = COVER_REGISTRY.create(validType);
  const dataSeed = raw.data || {};

  const normalizedData = Object.keys(defaultCover.data).reduce((acc, key) => {
    acc[key] = dataSeed[key] ?? defaultCover.data[key];
    return acc;
  }, {});

  const cardSource = raw.card || {};
  const musicSource = raw.music || {};
  const snapSource = raw.snap || {};
  const elementsSource = Array.isArray(raw.elements) ? raw.elements : [];

  return {
    ...raw,
    type: validType,
    data: normalizedData,
    schema: defaultCover.schema,
    card: {
      ...DEFAULT_CARD,
      ...cardSource,
      gradient: { ...DEFAULT_CARD.gradient, ...(cardSource.gradient || {}) },
    },
    music: { ...DEFAULT_MUSIC, ...musicSource },
    snap: { ...DEFAULT_SNAP, ...snapSource },
    elements: deepClone(elementsSource),
  };
};

const normalizeTemplateData = (data) => {
  if (!data) {
    return {
      cover: makeCoverShape(null),
      pages: [],
    };
  }

  const next = deepClone(data);
  const normalizedPages = Array.isArray(next.pages)
    ? next.pages.map((page, index) => makePageShape(page, page?.name ?? `Halaman ${index + 1}`))
    : [];

  if (!normalizedPages.length) {
    normalizedPages.push(
      makePageShape(
        {
          id: 'page-1',
          name: 'Halaman 1',
          elements: [],
        },
        'Halaman 1',
        'page-1',
      ),
    );
  }

  next.pages = normalizedPages;
  next.cover = makeCoverShape(next.cover);

  return next;
};


export const useTemplateEditor = () => {
  const { id: templateId } = useParams();
  const navigate = useNavigate();
  const isCreatingNew = templateId === 'new';

  const { getById: getTemplate, update: updateTemplate, create: createTemplate, loading, error } = useTemplates();

  const [templateMetadata, setTemplateMetadata] = useState({ title: '', category_id: '' });
  const [templateData, setTemplateData] = useState(null);
  const [activeViewState, setActiveViewState] = useState('cover');
  const [pageIndexState, setPageIndexState] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [liveElement, setLiveElement] = useState(null);
  
  // Helper untuk single select (backward compatibility)
  const selectedId = selectedIds[0] || null;
  const setSelectedId = (id) => setSelectedIds(id ? [id] : []);

  const memoizedGetTemplate = useCallback(getTemplate, [getTemplate]);
  const memoizedNavigate = useCallback(navigate, [navigate]);

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const fullTemplate = await memoizedGetTemplate(templateId);
        const normalized = normalizeTemplateData(fullTemplate.template_data);
        setTemplateData(normalized);
        setTemplateMetadata({
          title: fullTemplate.title,
          category_id: fullTemplate.category_id,
          description: fullTemplate.description,
          label: fullTemplate.label,
        });
        setHistory([normalized]);
        setHistoryIndex(0);
        setActiveViewState('cover');
        setPageIndexState(0);
        setSelectedId(null);
      } catch (err) {
        console.error('Gagal memuat template:', err);
        alert('Gagal memuat data template.');
        memoizedNavigate('/dashboardadmin/managetemplate');
      }
    };

    if (isCreatingNew) {
      const normalized = normalizeTemplateData(INITIAL_PROJECT_DATA);
      setTemplateData(normalized);
      setHistory([normalized]);
      setHistoryIndex(0);
      setActiveViewState('cover');
      setPageIndexState(0);
      setSelectedId(null);
    } else if (templateId) {
      loadTemplate();
    }
  }, [templateId, isCreatingNew, memoizedGetTemplate, memoizedNavigate]);

  const commitChange = useCallback((nextData) => {
    const normalized = normalizeTemplateData(nextData);
    setTemplateData(normalized);
    setHistory((prev) => {
      const nextHistory = prev.slice(0, historyIndex + 1);
      nextHistory.push(normalized);
      setHistoryIndex(nextHistory.length - 1);
      return nextHistory;
    });
  }, [historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setTemplateData(history[newIndex]);
      setSelectedId(null);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setTemplateData(history[newIndex]);
      setSelectedId(null);
    }
  };

  const setActiveView = useCallback((view) => {
    setActiveViewState(view);
    setSelectedId(null);
    if (typeof view === 'number') {
      setPageIndexState(view);
    }
  }, []);

  const setPageIndex = useCallback((index) => {
    setPageIndexState(index);
    setSelectedId(null);
    setActiveViewState(index);
  }, []);

  useEffect(() => {
    if (!templateData) return;
    if (typeof activeViewState === 'number') {
      const maxIndex = Math.max(0, (templateData.pages?.length || 1) - 1);
      if (activeViewState > maxIndex) {
        setActiveViewState(maxIndex);
        setPageIndexState(maxIndex);
      }
    }
  }, [templateData, activeViewState]);

  const page = useMemo(() => {
    if (!templateData) return null;
    if (activeViewState === 'cover') return templateData.cover;
    return templateData.pages?.[activeViewState] || templateData.pages?.[0] || null;
  }, [templateData, activeViewState]);

  const selectedElements = useMemo(() => {
    if (!page) return [];
    const elements = Array.isArray(page.elements) ? page.elements : [];
    return elements.filter((e) => selectedIds.includes(e.id));
  }, [page, selectedIds]);

  // Backward compatibility
  const selectedElement = selectedElements[0] || null;

  // Multi-select functions
  const toggleSelection = useCallback((id) => {
    setSelectedIds(prev => {
      const exists = prev.includes(id);
      if (exists) {
        return prev.filter(i => i !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  const addToSelection = useCallback((id) => {
    setSelectedIds(prev => [...new Set([...prev, id])]);
  }, []);

  const removeFromSelection = useCallback((id) => {
    setSelectedIds(prev => prev.filter(i => i !== id));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const updateLiveElement = useCallback((id, updates, otherElements = []) => {
    if (!page?.elements) return;
    const liveElements = {};

    const el = page.elements.find((e) => e.id === id);
    if (el) {
      liveElements[id] = { ...el, ...updates };
    }

    otherElements.forEach(({ id: otherId, updates: otherUpdates }) => {
      const otherEl = page.elements.find((e) => e.id === otherId);
      if (otherEl) {
        liveElements[otherId] = { ...otherEl, ...otherUpdates };
      }
    });

    setLiveElement(liveElements);
  }, [page]);

  const clearLiveElement = useCallback(() => {
    setLiveElement(null);
  }, []);

  const updatePage = useCallback((pageUpdater) => {
    if (!templateData) return;
    const nextData = deepClone(templateData);
    const resolve = (current) => (typeof pageUpdater === 'function' ? pageUpdater(current) : pageUpdater ?? current);

    if (activeViewState === 'cover') {
      const currentCoverState = makeCoverShape(nextData.cover);
      const updatedCover = resolve(currentCoverState) ?? currentCoverState;
      nextData.cover = makeCoverShape(updatedCover);
    } else {
      if (!nextData.pages?.length) return;
      const targetIndex = typeof activeViewState === 'number' ? activeViewState : pageIndexState;
      const safeIndex = Number.isInteger(targetIndex) ? targetIndex : 0;
      const currentPage = makePageShape(
        nextData.pages[safeIndex],
        nextData.pages[safeIndex]?.name ?? `Halaman ${safeIndex + 1}`,
        nextData.pages[safeIndex]?.id,
      );
      const updatedPage = resolve(currentPage) ?? currentPage;
      nextData.pages[safeIndex] = makePageShape(
        updatedPage,
        updatedPage?.name ?? currentPage.name,
        updatedPage?.id ?? currentPage.id,
      );
    }

    commitChange(nextData);
  }, [templateData, activeViewState, pageIndexState, commitChange]);

  const addPage = useCallback(() => {
    if (!templateData) return;
    const baseCard = templateData.pages?.[0]?.card || DEFAULT_CARD;
    const next = deepClone(templateData);
    const newPage = makePageShape(
      {
        id: `page-${Math.random().toString(36).slice(2, 9)}`,
        name: `Halaman ${next.pages.length + 1}`,
        card: deepClone(baseCard),
        elements: [],
      },
      undefined,
      undefined,
    );
    next.pages = [...(next.pages || []), newPage];
    commitChange(next);
    setActiveView(next.pages.length - 1);
  }, [templateData, commitChange, setActiveView]);

  const duplicatePage = useCallback(() => {
    if (!templateData) return;
    if (activeViewState === 'cover') return;
    const idx = typeof activeViewState === 'number' ? activeViewState : pageIndexState;
    const source = templateData.pages?.[idx];
    if (!source) return;
    const next = deepClone(templateData);
    const clone = makePageShape(source, source.name, undefined);
    clone.id = `page-${Math.random().toString(36).slice(2, 9)}`;
    clone.name = `${source.name || 'Halaman'} (Copy)`;
    next.pages.splice(idx + 1, 0, clone);
    commitChange(next);
    setActiveView(idx + 1);
  }, [templateData, activeViewState, pageIndexState, commitChange, setActiveView]);

  const deletePage = useCallback(() => {
    if (!templateData) return;
    if (activeViewState === 'cover') return;
    const idx = typeof activeViewState === 'number' ? activeViewState : pageIndexState;
    if ((templateData.pages?.length || 0) <= 1) return;
    const next = deepClone(templateData);
    next.pages.splice(idx, 1);
    commitChange(next);
    const nextIndex = Math.max(0, Math.min(idx, next.pages.length - 1));
    setActiveView(nextIndex);
  }, [templateData, activeViewState, pageIndexState, commitChange, setActiveView]);

  return {
    templateId,
    isCreatingNew,
    loading,
    error,
    templateData,
    setTemplateData,
    templateMetadata,
    setTemplateMetadata,
    page,
    pageIndex: pageIndexState,
    setPageIndex,
    activeView: activeViewState,
    setActiveView,
    selectedElement,
    setSelectedId,
    updatePage,
    addPage,
    duplicatePage,
    deletePage,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    createTemplate,
    updateTemplate,
    commitChange,
    liveElement,
    updateLiveElement,
    clearLiveElement,
    selectedIds,
    selectedElements,
    toggleSelection,
    addToSelection,
    removeFromSelection,
    clearSelection
  };
};
