import React, { useState } from 'react';
import HeadlampCard from '../components/HeadlampCard';
import HabitList from '../components/HabitList';
import AnalyticsModal from '../components/AnalyticsModal';

export default function Home() {
  const [selectedHabit, setSelectedHabit] = useState(null);

  return (
    <div className="space-y-6">
      <HeadlampCard />

      <section>
        <h3 className="text-lg font-semibold text-text mb-4">Today's Habits</h3>
        <HabitList onSelectHabit={setSelectedHabit} />
      </section>

      {selectedHabit && (
        <AnalyticsModal 
          habit={selectedHabit} 
          onClose={() => setSelectedHabit(null)} 
        />
      )}
    </div>
  );
}
