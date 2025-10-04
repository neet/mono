class CreateTaskFromHabitJob < ApplicationJob
  queue_as :default

  def perform(habit_id, habit_fingerprint)
    habit = Habit.find_by(id: habit_id)

    if habit.present? && habit.fingerprint == habit_fingerprint
      habit.recur
    end
  end
end
