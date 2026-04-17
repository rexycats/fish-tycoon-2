// ============================================================
// STAFF PANEL — Hire, manage, train staff
// ============================================================
import React from 'react';
import { useGameStore } from '../store/gameStore.js';
import { STAFF_ROLES, getStaffWage, getTrainCost, getHireCost, getMaxStaff, getTotalDailyWages } from '../data/staff.js';

export default function StaffPanel() {
  const staff = useGameStore(s => s.staff || []);
  const tanks = useGameStore(s => s.tanks || []);
  const coins = useGameStore(s => s.player?.coins || 0);
  const playerLevel = useGameStore(s => s.player?.level || 1);
  const hireStaff = useGameStore(s => s.hireStaff);
  const fireStaff = useGameStore(s => s.fireStaff);
  const assignStaff = useGameStore(s => s.assignStaff);
  const trainStaff = useGameStore(s => s.trainStaff);

  const maxStaff = getMaxStaff(playerLevel);
  const totalWages = getTotalDailyWages(staff);

  return (
    <div className="staff-panel">
      <div className="staff-header">
        <div className="staff-title">STAFF</div>
        <div className="staff-meta">
          <span>{staff.length}/{maxStaff} hired</span>
          <span className="staff-wages">Daily wages: {totalWages}/day</span>
        </div>
      </div>

      {/* Hire buttons */}
      {staff.length < maxStaff && (
        <div className="staff-hire-row">
          {Object.values(STAFF_ROLES).map(role => (
            <button
              key={role.id}
              className="btn staff-hire-btn"
              onClick={() => hireStaff(role.id)}
              disabled={coins < getHireCost(role.id)}
            >
              <span className="staff-hire-role">{role.label}</span>
              <span className="staff-hire-cost">{getHireCost(role.id)}</span>
              <span className="staff-hire-desc">{role.desc}</span>
            </button>
          ))}
        </div>
      )}

      {/* Staff list */}
      {staff.length === 0 ? (
        <div className="staff-empty">
          No staff hired yet. Hire a Caretaker to auto-feed your fish!
        </div>
      ) : (
        <div className="staff-list">
          {staff.map(member => {
            const roleDef = STAFF_ROLES[member.role];
            const wage = getStaffWage(member);
            const trainCostVal = getTrainCost(member);
            const canTrain = member.level < (roleDef?.maxLevel || 5) && coins >= trainCostVal;
            const assignedTank = tanks.find(t => t.id === member.assignedTankId);
            return (
              <div key={member.id} className="staff-card">
                <div className="staff-card-top">
                  <div className="staff-card-info">
                    <span className="staff-card-name">{member.name}</span>
                    <span className="staff-card-role">{roleDef?.label || member.role}</span>
                    <span className="staff-card-level">LV.{member.level + 1}</span>
                  </div>
                  <span className="staff-card-wage">{wage}/day</span>
                </div>

                <div className="staff-card-assign">
                  <select
                    className="staff-tank-select"
                    value={member.assignedTankId || ''}
                    onChange={e => assignStaff(member.id, e.target.value || null)}
                  >
                    <option value="">Unassigned</option>
                    {tanks.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  {!assignedTank && <span className="staff-unassigned-hint">Assign to a tank to work</span>}
                </div>

                <div className="staff-card-actions">
                  <button
                    className="btn staff-train-btn"
                    onClick={() => trainStaff(member.id)}
                    disabled={!canTrain}
                  >
                    Train ({trainCostVal})
                  </button>
                  <button
                    className="btn staff-fire-btn"
                    onClick={() => fireStaff(member.id)}
                  >
                    Fire
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
