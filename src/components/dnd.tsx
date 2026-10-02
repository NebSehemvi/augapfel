import { createContext, useContext, useRef, useState, type ReactNode, type PointerEvent as RPointerEvent } from 'react';
import { createPortal } from 'react-dom';
import s from './dnd.module.css';

/**
 * Minimal pointer-based drag & drop that works with mouse and touch (iOS Safari has no HTML5 DnD for touch).
 * Drop zones are marked with data-drop="<zone id>"; items inside a zone may carry data-index for insert positions.
 * A press without movement counts as a tap.
 */
export interface DropInfo {
  zone: string;
  /** insert index within the zone, if the zone has indexed children */
  index?: number;
}

interface Ctx {
  start(e: RPointerEvent<HTMLElement>, id: string, label: string, onDrop: (d: DropInfo | null) => void, onTap: () => void): void;
  dragging: string | null;
}

const DndCtx = createContext<Ctx | null>(null);

export function DndProvider({ children }: { children: ReactNode }) {
  const [ghost, setGhost] = useState<{ id: string; label: string; x: number; y: number; w: number } | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const state = useRef<{ moved: boolean; sx: number; sy: number } | null>(null);

  const start: Ctx['start'] = (e, id, label, onDrop, onTap) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    state.current = { moved: false, sx: e.clientX, sy: e.clientY };
    el.setPointerCapture(e.pointerId);

    const move = (ev: PointerEvent) => {
      const st = state.current!;
      if (!st.moved && Math.hypot(ev.clientX - st.sx, ev.clientY - st.sy) < 6) return;
      st.moved = true;
      setGhost({ id, label, x: ev.clientX, y: ev.clientY, w: rect.width });
      const zone = zoneAt(ev.clientX, ev.clientY);
      setOver(zone?.dataset.drop ?? null);
    };
    const up = (ev: PointerEvent) => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      const st = state.current!;
      state.current = null;
      setGhost(null);
      setOver(null);
      if (!st.moved) {
        if (ev.type === 'pointerup') onTap();
        return;
      }
      const zone = zoneAt(ev.clientX, ev.clientY);
      if (!zone) return onDrop(null);
      onDrop({ zone: zone.dataset.drop!, index: insertIndex(zone, ev.clientX, ev.clientY, id) });
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  };

  return (
    <DndCtx.Provider value={{ start, dragging: ghost?.id ?? null }}>
      <div data-dnd-over={over ?? undefined}>{children}</div>
      {ghost &&
        createPortal(
          <div className={s.ghost} style={{ left: ghost.x, top: ghost.y, minWidth: Math.min(ghost.w, 240) }}>
            {ghost.label}
          </div>,
          document.body,
        )}
    </DndCtx.Provider>
  );
}

function zoneAt(x: number, y: number): HTMLElement | null {
  const el = document.elementFromPoint(x, y) as HTMLElement | null;
  return el?.closest<HTMLElement>('[data-drop]') ?? null;
}

function insertIndex(zone: HTMLElement, x: number, y: number, draggedId: string): number | undefined {
  const items = [...zone.querySelectorAll<HTMLElement>('[data-index]')].filter((n) => n.dataset.id !== draggedId);
  if (items.length === 0) return 0;
  // Items flow in rows: find the first item whose centre is after the pointer (reading order).
  for (const it of items) {
    const r = it.getBoundingClientRect();
    const sameRow = y >= r.top - 4 && y <= r.bottom + 4;
    if ((sameRow && x < r.left + r.width / 2) || y < r.top - 4) return Number(it.dataset.index);
  }
  return Number(items[items.length - 1].dataset.index) + 1;
}

function useDnd() {
  const ctx = useContext(DndCtx);
  if (!ctx) throw new Error('useDnd outside DndProvider');
  return ctx;
}

interface TileProps {
  id: string;
  label: string;
  index?: number;
  onDrop: (d: DropInfo | null) => void;
  onTap: () => void;
  className?: string;
  disabled?: boolean;
  children?: ReactNode;
}

export function DragTile({ id, label, index, onDrop, onTap, className, disabled, children }: TileProps) {
  const { start, dragging } = useDnd();
  return (
    <button
      type="button"
      className={`${s.tile} ${dragging === id ? s.dragging : ''} ${className ?? ''}`}
      data-index={index}
      data-id={id}
      disabled={disabled}
      onPointerDown={(e) => !disabled && start(e, id, label, onDrop, onTap)}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onTap();
        }
      }}
      lang="de"
    >
      {children ?? label}
    </button>
  );
}
