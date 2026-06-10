
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProjects from '../../../../api/projects/useProjects';
import { ALL_REGISTRY, CANVAS } from '../../../../utils/InvitationBuilder';

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
const DEFAULT_SNAP = { enabled: true, size: 5 };

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

const normalizeProjectData = (data) => {
  if (!data) {
    return {
      cover: makePageShape(null, 'Cover', 'cover'),
      pages: [makePageShape(null, 'Main', 'page-1')],
    };
  }

  const next = deepClone(data);
  const normalizedPages = Array.isArray(next.pages)
    ? next.pages.map((page, index) => makePageShape(page, page?.name ?? `Halaman ${index + 1}`))
    : [];

  if (!normalizedPages.length) {
    normalizedPages.push(makePageShape(null, 'Main', 'page-1'));
  }

  next.pages = normalizedPages;

  const coverSeed = next.cover ?? {
    id: 'cover',
    name: 'Cover',
    card: normalizedPages[0]?.card,
    music: normalizedPages[0]?.music,
    snap: normalizedPages[0]?.snap,
    elements: [],
  };

  next.cover = makePageShape(coverSeed, coverSeed.name ?? 'Cover', coverSeed.id ?? 'cover');

  return next;
};

export const useInvitationEditor = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const { getById: getProject, update: updateProject, loading, error } = useProjects();

  const [projectData, setProjectData] = useState(null);
  const [activeViewState, setActiveViewState] = useState('cover');
  const [pageIndexState, setPageIndexState] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isSavingAuto, setIsSavingAuto] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const saveTimerRef = useRef(null);

  const memoizedGetProject = useCallback(getProject, []);
  const memoizedNavigate = useCallback(navigate, []);

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) return;
      try {
        const fullProject = await memoizedGetProject(projectId);
        const initialData = normalizeProjectData(fullProject.project_data);
        setProjectData(initialData);
        setHistory([initialData]);
        setHistoryIndex(0);
        setActiveViewState('cover');
        setPageIndexState(0);
        setSelectedId(null);
      } catch (err) {
        console.error('Gagal memuat project:', err);
        alert('Gagal memuat data project.');
        memoizedNavigate('/dashboard/invitations');
      }
    };
    loadProject();
  }, [projectId, memoizedGetProject, memoizedNavigate]);

  useEffect(() => {
    if (!projectData || historyIndex === -1) return;

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(async () => {
      setIsSavingAuto(true);
      setSaveError(null);
      try {
        await updateProject(projectId, { project_data: projectData }, false);
        console.log('Project saved automatically!');
      } catch (err) {
        console.error('Failed to auto-save project:', err);
        setSaveError(err);
      } finally {
        setIsSavingAuto(false);
      }
    }, 1000);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [projectData, projectId, updateProject, historyIndex]);

  const commitChange = useCallback((newData) => {
    const normalized = normalizeProjectData(newData);
    setProjectData(normalized);
    setHistory((prev) => {
      const nextHistory = prev.slice(0, historyIndex + 1);
      nextHistory.push(normalized);
      setHistoryIndex(nextHistory.length - 1);
      return nextHistory;
    });
  }, [historyIndex]);

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
    if (!projectData) return;
    if (typeof activeViewState === 'number') {
      const maxIndex = Math.max(0, (projectData.pages?.length || 1) - 1);
      if (activeViewState > maxIndex) {
        setActiveViewState(maxIndex);
        setPageIndexState(maxIndex);
      }
    }
  }, [projectData, activeViewState]);

  const page = useMemo(() => {
    if (!projectData) return null;
    if (activeViewState === 'cover') return projectData.cover;
    return projectData.pages?.[activeViewState] || projectData.pages?.[0] || null;
  }, [projectData, activeViewState]);

  const selectedElement = useMemo(() => {
    if (!page) return null;
    return page.elements.find((e) => e.id === selectedId) || null;
  }, [page, selectedId]);

  const updatePage = useCallback((pageUpdater) => {
    if (!projectData) return;
    const nextData = deepClone(projectData);
    const resolve = (current) => (typeof pageUpdater === 'function' ? pageUpdater(current) : pageUpdater ?? current);

    if (activeViewState === 'cover') {
      const currentCover = makePageShape(nextData.cover, nextData.cover?.name ?? 'Cover', nextData.cover?.id ?? 'cover');
      const updatedCover = resolve(currentCover) ?? currentCover;
      nextData.cover = makePageShape(updatedCover, updatedCover?.name ?? currentCover.name, updatedCover?.id ?? currentCover.id);
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
  }, [projectData, activeViewState, pageIndexState, commitChange]);

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setProjectData(history[newIndex]);
      setSelectedId(null);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setProjectData(history[newIndex]);
      setSelectedId(null);
    }
  };

  const addPage = useCallback(() => {
    if (!projectData) return;
    const baseCard = projectData.pages?.[0]?.card || DEFAULT_CARD;
    const next = deepClone(projectData);
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
  }, [projectData, commitChange, setActiveView]);

  const duplicatePage = useCallback(() => {
    if (!projectData) return;
    if (activeViewState === 'cover') return;
    const idx = typeof activeViewState === 'number' ? activeViewState : pageIndexState;
    const source = projectData.pages?.[idx];
    if (!source) return;
    const next = deepClone(projectData);
    const clone = makePageShape(source, source.name, undefined);
    clone.id = `page-${Math.random().toString(36).slice(2, 9)}`;
    clone.name = `${source.name || 'Halaman'} (Copy)`;
    next.pages.splice(idx + 1, 0, clone);
    commitChange(next);
    setActiveView(idx + 1);
  }, [projectData, activeViewState, pageIndexState, commitChange, setActiveView]);

  const deletePage = useCallback(() => {
    if (!projectData) return;
    if (activeViewState === 'cover') return;
    const idx = typeof activeViewState === 'number' ? activeViewState : pageIndexState;
    if ((projectData.pages?.length || 0) <= 1) return;
    const next = deepClone(projectData);
    next.pages.splice(idx, 1);
    commitChange(next);
    const nextIndex = Math.max(0, Math.min(idx, next.pages.length - 1));
    setActiveView(nextIndex);
  }, [projectData, activeViewState, pageIndexState, commitChange, setActiveView]);

  const addPageWithElement = (type) => {
    if (!projectData) return;
    const def = ALL_REGISTRY[type];
    if (!def) return;

    const w = def.minSize.w;
    const h = def.minSize.h;
    const newElement = {
      id: `el-${Math.random().toString(36).slice(2, 9)}`,
      type,
      x: Math.round((CANVAS.width - w) / 2),
      y: Math.round((CANVAS.height - h) / 2),
      w,
      h,
      data: deepClone(def.defaultData),
    };

    const baseCard = projectData.pages?.[0]?.card || DEFAULT_CARD;

    const newPage = {
      id: `page-${Math.random().toString(36).slice(2, 9)}`,
      name: def.label,
      card: deepClone(baseCard),
      elements: [newElement],
    };

    const next = deepClone(projectData);
    next.pages = [...(next.pages || []), makePageShape(newPage, newPage.name, newPage.id)];
    commitChange(next);
    setActiveView(next.pages.length - 1);
  };

  return {
    projectId,
    loading,
    error,
    projectData,
    setProjectData,
    page,
    pageIndex: pageIndexState,
    setPageIndex,
    activeView: activeViewState,
    setActiveView,
    selectedElement,
    setSelectedId,
    commitChange,
    updatePage,
    addPage,
    duplicatePage,
    deletePage,
    addPageWithElement,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    isSavingAuto,
    saveError,
  };
};
