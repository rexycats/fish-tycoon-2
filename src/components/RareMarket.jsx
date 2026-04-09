// RareMarket — not yet implemented; renders a placeholder so the tab isn't silently empty
import React from 'react';
export default function RareMarket() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 12, padding: '40px 24px', textAlign: 'center',
    }}>
      <span style={{ fontSize: 40 }}>🚧</span>
      <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary, #e8d5a0)' }}>
        Rare Market — Coming Soon
      </div>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted, #8a7a5a)', maxWidth: 280 }}>
        A rotating selection of exotic fish and special items will appear here.
        Check back after future updates!
      </div>
    </div>
  );
}
