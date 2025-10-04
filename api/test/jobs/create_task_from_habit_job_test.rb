require "test_helper"

class CreateTaskFromHabitJobTest < ActiveJob::TestCase
  test "creates a task from a habit" do
    habit = habits(:one)

    CreateTaskFromHabitJob.perform_later(habit.id, habit.fingerprint)
    perform_enqueued_jobs

    assert_equal habit.tasks.count, 1
    assert_enqueued_with job: CreateTaskFromHabitJob, args: [ habit.id, habit.fingerprint ], at: habit.next_recur_at
  end
end
