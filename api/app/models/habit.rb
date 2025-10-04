class Habit < ApplicationRecord
  belongs_to :user
  has_many :tasks, dependent: :destroy

  validate :validate_rrule
  validate :validate_tzid

  # Currently we don't support updating habit
  after_commit :enqueue, on: :create
  
  def enqueue
    return if next_occurrence_at.nil?

    CreateTaskFromHabitJob
      .set(wait_until: next_occurrence_at)
      .perform_later(self.id)
  end

  def find_last_occurrence 
    tasks.order(created_at: :desc).first
  end

  def next_occurrence_at
    recurrences.first
  end

  private
    def recurrences
      return RRule::Rule.new rrule, tzid: tzid
    end

    def validate_rrule
      begin
        RRule::Rule.new rrule
      rescue RRule::InvalidRRule
        errors.add(:rrule, "is malformed")
      end
    end

    def validate_tzid
      # https://stackoverflow.com/questions/31792295/validating-a-time-zone-is-valid-in-rails
      if !ActiveSupport::TimeZone[tzid].present?
        errors.add(:tzid, "does not exist")
      end
    end
end
