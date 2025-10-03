class CreateTaskFromHabitJob < ApplicationJob
  queue_as :default

  def perform(habit_id)
    habit = Habit.find(habit_id)
    return if habit.nil?

    last_occurrence = habit.find_last_occurrence

    if last_occurrence.nil? || last_occurrence.completed?
      # FIXME: 書き方キモい
      attrs = {
        user: habit.user,
        title: habit.title,
        description: habit.description
      }.compact

      task = habit.tasks.build(attrs)
      task.save!
    end

    habit.enqueue
  end
end
