class CreateTaskFromHabitJob < ApplicationJob
  queue_as :default

  def perform(habit)
    last_occurrence = habit.find_last_occurrence

    if last_occurrence.nil? || last_occurrence.completed?
      task = habit.tasks.build(
        user: habit.user,
        title: habit.title,
        description: habit.description
      )
      task.save!
    end

    habit.enqueue
  end
end
