import { useEffect, useState, useRef } from 'react';
import { touchInput, isTouchDevice, type Direction } from '../game/TouchInput';

/** Computes a responsive button size clamped between sane min/max bounds. */
function computeBtnSize(): number {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const shortSide = Math.min(w, h);
  // ~14% of the shorter viewport dimension, clamped to a comfortable range
  return Math.round(Math.min(72, Math.max(44, shortSide * 0.14)));
}

const baseBtnStyle = (size: number): React.CSSProperties => ({
  width: size,
  height: size,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'monospace',
  fontSize: Math.round(size * 0.38),
  color: '#ffd700',
  background: 'rgba(20, 20, 30, 0.55)',
  border: '2px solid rgba(255, 215, 0, 0.55)',
  borderRadius: Math.round(size * 0.18),
  userSelect: 'none',
  WebkitUserSelect: 'none',
  touchAction: 'none',
  WebkitTapHighlightColor: 'transparent',
});

/** One directional pad button. Holds `touchInput[dir]` true while pressed. */
function DPadButton({
  dir,
  label,
  size,
  style,
}: {
  dir: Direction;
  label: string;
  size: number;
  style?: React.CSSProperties;
}) {
  const press = (e: React.PointerEvent) => { e.preventDefault(); touchInput.setDirection(dir, true); };
  const release = (e: React.PointerEvent) => { e.preventDefault(); touchInput.setDirection(dir, false); };
  return (
    <div
      style={{ ...baseBtnStyle(size), ...style }}
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
  const [btnSize, setBtnSize] = useState(() => (typeof window !== 'undefined' ? computeBtnSize() : 56));
  const isTouch = useRef(isTouchDevice());

  useEffect(() => {
    const onVisibility = (e: Event) => setVisible((e as CustomEvent<boolean>).detail);
    window.addEventListener('lofa:touch-controls', onVisibility);
    return () => window.removeEventListener('lofa:touch-controls', onVisibility);
  }, []);

  useEffect(() => {
    const onResize = () => setBtnSize(computeBtnSize());
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    // visualViewport catches address-bar show/hide on mobile more reliably
    window.visualViewport?.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      window.visualViewport?.removeEventListener('resize', onResize);
    };
  }, []);

  if (!isTouch.current || !visible) return null;

  const dpadWrapSize = btnSize * 3;
  const aSize = Math.round(btnSize * 1.2);
  const menuSize = Math.round(btnSize * 0.8);
  const gutter = Math.round(btnSize * 0.3);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 10,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {/* D-pad, bottom-left */}
      <div
        style={{
          position: 'absolute',
          left: gutter,
          bottom: gutter,
          width: dpadWrapSize,
          height: dpadWrapSize,
          pointerEvents: 'auto',
        }}
      >
        <DPadButton dir="up"    label="▲" size={btnSize} style={{ position: 'absolute', left: btnSize, top: 0 }} />
        <DPadButton dir="left"  label="◀" size={btnSize} style={{ position: 'absolute', left: 0, top: btnSize }} />
        <DPadButton dir="right" label="▶" size={btnSize} style={{ position: 'absolute', left: btnSize * 2, top: btnSize }} />
        <DPadButton dir="down"  label="▼" size={btnSize} style={{ position: 'absolute', left: btnSize, top: btnSize * 2 }} />
      </div>

      {/* Interact button, bottom-right */}
      <div
        style={{
          position: 'absolute',
          right: gutter + 8,
          bottom: gutter + 16,
          pointerEvents: 'auto',
          ...baseBtnStyle(aSize),
          borderRadius: '50%',
        }}
        onPointerDown={(e) => { e.preventDefault(); touchInput.interact(); }}
      >
        A
      </div>

      {/* Menu button, top-right */}
      <div
        style={{
          position: 'absolute',
          right: gutter,
          top: gutter,
          pointerEvents: 'auto',
          ...baseBtnStyle(menuSize),
        }}
        onPointerDown={(e) => { e.preventDefault(); touchInput.menu(); }}
      >
        ☰
      </div>
    </div>
  );
}

export default TouchControls;