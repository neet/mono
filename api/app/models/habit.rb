class Habit < ApplicationRecord
  belongs_to :user
  has_many :tasks, dependent: :destroy

  validate :rrule_must_be_valid
  validate :timezone_exists

  def find_last_occurrence 
    tasks.order(created_at: :desc).first
  end

  def spawn
    last_occurrence = find_last_occurrence

    if last_occurrence.nil? || (last_occurrence.present? && last_occurrence.completed?)
      tasks.build(
        user: user,
        title: title,
        description: description
      )
    else
      nil
    end
  end

  def next_occurrence_at
    RRule::Rule.new(rrule, dtstart: dtstart, tzid: tzid).first
  end

  def rrule_must_be_valid
    begin
      RRule::Rule.new rrule
    rescue RRule::InvalidRRule
      errors.add(:rrule, "is malformed")
    end
  end

  # https://stackoverflow.com/questions/31792295/validating-a-time-zone-is-valid-in-rails
  def timezone_exists
    if !ActiveSupport::TimeZone[tzid].present?
      errors.add(:tzid, "does not exist")
    end
  end
end
