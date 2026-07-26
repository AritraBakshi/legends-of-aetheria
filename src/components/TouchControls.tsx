import { useEffect, useState, useRef } from 'react';
import { touchInput, isTouchDevice, type Direction } from '../game/TouchInput';

const BTN_SIZE = 56;

const baseBtnStyle: React.CSSProperties = {
  width: BTN_SIZE,
  height: BTN_SIZE,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'monospace',
  fontSize: 22,
  color: '#ffd700',
  background: 'rgba(20, 20, 30, 0.55)',
  border: '2px solid rgba(255, 215, 0, 0.55)',
  borderRadius: 10,
  userSelect: 'none',
  WebkitUserSelect: 'none',
  touchAction: 'none',
  WebkitTapHighlightColor: 'transparent',
};

/** One directional pad button. Holds `touchInput[dir]` true while pressed. */
function DPadButton({ dir, label, style }: { dir: Direction; label: string; style?: React.CSSProperties }) {
  const press = (e: React.PointerEvent) => { e.preventDefault(); touchInput.setDirection(dir, true); };
  const release = (e: React.PointerEvent) => { e.preventDefault(); touchInput.setDirection(dir, false); };
  return (
    <div
      style={{ ...baseBtnStyle, ...style }}
      onPointerDown={press}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
    >
      {label}
    </div>
  );
}

export function TouchControls() {
  // Hidden by default — only the overworld scene turns this on. Title,
  // starter-select, battle, menu, dialogue, etc. never fire the event,
  // so the D-pad/A/menu buttons correctly stay off screen there.
  const [visible, setVisible] = useState(false);
  const isTouch = useRef(isTouchDevice());

  useEffect(() => {
    const onVisibility = (e: Event) => setVisible((e as CustomEvent<boolean>).detail);
    window.addEventListener('lofa:touch-controls', onVisibility);
    return () => window.removeEventListener('lofa:touch-controls', onVisibility);
  }, []);

  if (!isTouch.current || !visible) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
      {/* D-pad, bottom-left */}
      <div
        style={{
          position: 'absolute', left: 16, bottom: 16,
          width: BTN_SIZE * 3, height: BTN_SIZE * 3,
          pointerEvents: 'auto',
        }}
      >
        <DPadButton dir="up"    label="▲" style={{ position: 'absolute', left: BTN_SIZE, top: 0 }} />
        <DPadButton dir="left"  label="◀" style={{ position: 'absolute', left: 0, top: BTN_SIZE }} />
        <DPadButton dir="right" label="▶" style={{ position: 'absolute', left: BTN_SIZE * 2, top: BTN_SIZE }} />
        <DPadButton dir="down"  label="▼" style={{ position: 'absolute', left: BTN_SIZE, top: BTN_SIZE * 2 }} />
      </div>

      {/* Interact button, bottom-right */}
      <div
        style={{
          position: 'absolute', right: 24, bottom: 32, pointerEvents: 'auto',
          ...baseBtnStyle, width: 68, height: 68, borderRadius: '50%', fontSize: 18,
        }}
        onPointerDown={(e) => { e.preventDefault(); touchInput.interact(); }}
      >
        A
      </div>

      {/* Menu button, top-right */}
      <div
        style={{
          position: 'absolute', right: 16, top: 16, pointerEvents: 'auto',
          ...baseBtnStyle, width: 44, height: 44, fontSize: 18,
        }}
        onPointerDown={(e) => { e.preventDefault(); touchInput.menu(); }}
      >
        ☰
      </div>
    </div>
  );
}

export default TouchControls;