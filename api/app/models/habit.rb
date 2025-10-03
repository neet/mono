class Habit < ApplicationRecord
  belongs_to :user
  has_many :tasks, dependent: :destroy

  validate :validate_rrule
  validate :validate_timezone

  # Currently we don't support updating habit
  after_commit :enqueue, on: :create
  
  def enqueue
    return if next_occurrence_at.nil?

    CreateTaskFromHabitJob
      .set(wait_until: next_occurrence_at)
      .perform_later(self)
  end

  def find_last_occurrence 
    tasks.order(created_at: :desc).first
  end

  private
    def next_occurrence_at
      now = Time.zone.now
      recurrences = RRule::Rule.new(rrule, dtstart: dtstart, tzid: tzid)
      # FIXME: Support annual or more rare occurrence
      occurrence_at = recurrences.between(now, now + 1.year).first
    end

    def validate_rrule
      begin
        RRule::Rule.new rrule
      rescue RRule::InvalidRRule
        errors.add(:rrule, "is malformed")
      end
    end

    def validate_timezone
      # https://stackoverflow.com/questions/31792295/validating-a-time-zone-is-valid-in-rails
      if !ActiveSupport::TimeZone[tzid].present?
        errors.add(:tzid, "does not exist")
      end
    end
end
