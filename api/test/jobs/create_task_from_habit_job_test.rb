require "test_helper"

class CreateTaskFromHabitJobTest < ActiveJob::TestCase
  test "creates a task from a habit" do
    habit = habits(:one)

    CreateTaskFromHabitJob.perform_later(habit)
    perform_enqueued_jobs

    assert_equal habit.tasks.count, 1
    assert_enqueued_with job: CreateTaskFromHabitJob, args: [habit], at: habit.next_occurrence_at
  end
end
