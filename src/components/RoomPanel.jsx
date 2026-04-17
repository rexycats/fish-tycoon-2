// ============================================================
// ROOM PANEL — Manage aquarium rooms and tank assignments
// ============================================================
import React from 'react';
import { useGameStore } from '../store/gameStore.js';
import { ROOMS, getTanksInRoom } from '../data/rooms.js';

export default function RoomPanel() {
  const coins = useGameStore(s => s.player?.coins || 0);
  const rep = useGameStore(s => s.shop?.reputation || 0);
  const prestige = useGameStore(s => s.player?.prestigeLevel || 0);
  const unlockedRooms = useGameStore(s => s.unlockedRooms || ['lobby']);
  const tanks = useGameStore(s => s.tanks || []);
  const roomAssignments = useGameStore(s => s.roomAssignments || {});
  const unlockRoom = useGameStore(s => s.unlockRoom);
  const assignTank = useGameStore(s => s.assignTankToRoom);

  return (
    <div className="room-panel">
      <div className="room-title">AQUARIUM ROOMS</div>
      <div className="room-subtitle">Expand your aquarium with themed wings that give tank bonuses</div>

      <div className="room-list">
        {ROOMS.map(room => {
          const isUnlocked = unlockedRooms.includes(room.id);
          const tanksHere = tanks.filter(t => (roomAssignments[t.id] || 'lobby') === room.id);
          const canUnlock = !isUnlocked && coins >= room.cost
            && (!room.minRep || rep >= room.minRep)
            && (!room.minPrestige || prestige >= room.minPrestige);
          const locked = !isUnlocked;

          return (
            <div key={room.id} className={`room-card ${locked ? 'room-card--locked' : ''}`}>
              <div className="room-card-header">
                <span className="room-card-name">{room.label}</span>
                {isUnlocked && <span className="room-card-count">{tanksHere.length}/{room.maxTanks}</span>}
              </div>
              <div className="room-card-desc">{room.desc}</div>

              {isUnlocked && (
                <div className="room-tanks">
                  {tanksHere.map(t => (
                    <span key={t.id} className="room-tank-chip">{t.name}</span>
                  ))}
                  {tanks.filter(t => (roomAssignments[t.id] || 'lobby') !== room.id).length > 0 && tanksHere.length < room.maxTanks && (
                    <select
                      className="room-assign-select"
                      value=""
                      onChange={e => { if (e.target.value) assignTank(e.target.value, room.id); }}
                    >
                      <option value="">+ Assign tank...</option>
                      {tanks.filter(t => (roomAssignments[t.id] || 'lobby') !== room.id).map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {locked && (
                <button
                  className="btn room-unlock-btn"
                  onClick={() => unlockRoom(room.id)}
                  disabled={!canUnlock}
                >
                  Unlock ({room.cost})
                  {room.minRep && rep < room.minRep ? ` — Rep ${room.minRep}` : ''}
                  {room.minPrestige && prestige < room.minPrestige ? ` — Prestige ${room.minPrestige}` : ''}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
