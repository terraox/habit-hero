import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X } from 'lucide-react';
import { api } from '../lib/api';
import { toast } from 'react-toastify';
import clsx from 'clsx';

const COLORS = [
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 
  'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 
  'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500', 
  'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'
];

export default function AddEditHabitModal({ isOpen, onClose, habit, onSave }) {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      title: '',
      icon: '',
      color: COLORS[10], // Default blue
      frequency: 'DAILY',
      allowMultiple: false
    }
  });

  const selectedColor = watch('color');

  useEffect(() => {
    if (habit) {
      reset({
        title: habit.title,
        icon: habit.icon,
        color: habit.color || COLORS[10],
        frequency: habit.frequency || 'DAILY',
        allowMultiple: habit.allowMultiple || false
      });
    } else {
      reset({
        title: '',
        icon: '',
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        frequency: 'DAILY',
        allowMultiple: false
      });
    }
  }, [habit, isOpen, reset]);

  const onSubmit = async (data) => {
    try {
      let savedHabit;
      if (habit) {
        savedHabit = await api.put(`/api/habits/${habit.id}`, data);
        toast.success('Habit updated successfully');
      } else {
        savedHabit = await api.post('/api/habits', { ...data, active: true });
        toast.success('Habit created successfully');
      }
      onSave(savedHabit);
      onClose();
    } catch (error) {
      console.error('Failed to save habit', error);
      toast.error('Failed to save habit');
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-surface p-6 text-left align-middle shadow-xl transition-all border border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title as="h3" className="text-lg font-bold text-text">
                    {habit ? 'Edit Habit' : 'New Habit'}
                  </Dialog.Title>
                  <button onClick={onClose} className="text-muted hover:text-text">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Title</label>
                    <input
                      {...register('title', { required: 'Title is required' })}
                      className="w-full rounded-xl bg-background border border-white/10 p-3 text-text focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="e.g. Read 30 mins"
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-muted mb-1">Icon (Emoji)</label>
                      <input
                        {...register('icon')}
                        className="w-full rounded-xl bg-background border border-white/10 p-3 text-text focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-center text-xl"
                        placeholder="📚"
                        maxLength={2}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted mb-1">Frequency</label>
                      <select
                        {...register('frequency')}
                        className="w-full rounded-xl bg-background border border-white/10 p-3 text-text focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      >
                        <option value="DAILY">Daily</option>
                        <option value="WEEKLY">Weekly</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted mb-2">Color</label>
                    <div className="flex flex-wrap gap-2">
                      {COLORS.map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setValue('color', c)}
                          className={clsx(
                            "w-8 h-8 rounded-full transition-transform",
                            c,
                            selectedColor === c ? "ring-2 ring-white scale-110" : "hover:scale-105 opacity-70 hover:opacity-100"
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="allowMultiple"
                      {...register('allowMultiple')}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="allowMultiple" className="text-sm text-text">Allow multiple completions per day</label>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 py-3 rounded-xl bg-white/5 text-text hover:bg-white/10 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors font-bold shadow-lg shadow-primary/20"
                    >
                      {isSubmitting ? 'Saving...' : 'Save Habit'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
