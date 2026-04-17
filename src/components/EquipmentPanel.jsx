// ============================================================
// EQUIPMENT PANEL — Buy, view, repair tank equipment
// ============================================================
import React from 'react';
import { useGameStore } from '../store/gameStore.js';
import { EQUIPMENT_TYPES } from '../data/equipment.js';

export default function EquipmentPanel({ tankId }) {
  const tank = useGameStore(s => s.tanks?.find(t => t.id === tankId));
  const coins = useGameStore(s => s.player?.coins || 0);
  const buyEquipment = useGameStore(s => s.buyEquipment);
  const repairEquipment = useGameStore(s => s.repairEquipment);

  if (!tank) return null;

  const equipment = tank.equipment || [];

  return (
    <div className="equipment-panel">
      <div className="equip-title">EQUIPMENT — {tank.name}</div>

      {/* Installed equipment */}
      {equipment.length > 0 && (
        <div className="equip-installed">
          {equipment.map(eq => {
            const type = EQUIPMENT_TYPES[eq.typeId];
            if (!type) return null;
            return (
              <div key={eq.id} className={`equip-item ${eq.broken ? 'equip-item--broken' : ''}`}>
                <span className="equip-item-name">{type.label}</span>
                {eq.broken ? (
                  <button
                    className="btn equip-repair-btn"
                    onClick={() => repairEquipment(tankId, eq.id)}
                    disabled={coins < type.repairCost}
                  >
                    Repair ({type.repairCost})
                  </button>
                ) : (
                  <span className="equip-item-status">Active</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Buy new equipment */}
      <div className="equip-shop">
        {Object.values(EQUIPMENT_TYPES).map(type => {
          const owned = equipment.filter(e => e.typeId === type.id).length;
          const maxed = owned >= type.maxPerTank;
          return (
            <button
              key={type.id}
              className="btn equip-buy-btn"
              onClick={() => buyEquipment(tankId, type.id)}
              disabled={maxed || coins < type.cost}
            >
              <span className="equip-buy-name">{type.label} ({type.cost})</span>
              <span className="equip-buy-desc">{type.desc}</span>
              <span className="equip-buy-count">{owned}/{type.maxPerTank}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
