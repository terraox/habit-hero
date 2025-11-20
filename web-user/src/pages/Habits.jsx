import React, { useState } from 'react';
import HabitList from '../components/HabitList';
import AnalyticsModal from '../components/AnalyticsModal';
import AddEditHabitModal from '../components/AddEditHabitModal';
import { Plus } from 'lucide-react';

export default function Habits() {
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [editingHabit, setEditingHabit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleHabitSaved = () => {
    setRefreshKey(prev => prev + 1);
    if (selectedHabit && editingHabit && selectedHabit.id === editingHabit.id) {
      // Refresh selected habit if it was edited
      // We might need to reload it or just close and reopen
      setSelectedHabit(null); 
    }
  };

  const openCreateModal = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text">My Habits</h2>
        <button 
          onClick={openCreateModal}
          className="bg-primary hover:bg-primary/90 text-white p-2 rounded-full shadow-lg transition-colors"
        >
          <Plus size={24} />
        </button>
      </div>

      <HabitList key={refreshKey} onSelectHabit={setSelectedHabit} />

      {selectedHabit && (
        <AnalyticsModal 
          habit={selectedHabit} 
          onClose={() => setSelectedHabit(null)}
          onEdit={() => openEditModal(selectedHabit)}
          onUpdate={handleHabitSaved}
        />
      )}

      <AddEditHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        habit={editingHabit}
        onSave={handleHabitSaved}
      />
    </div>
  );
}
