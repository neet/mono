class Habit < ApplicationRecord
  belongs_to :user
  has_many :tasks, dependent: :destroy

  validate :validate_rrule
  validate :validate_tzid

  after_commit :enqueue, on: [ :create, :update ], if: :rrule_or_tzid_changed?

  def recur!
    last = tasks.order(created_at: :desc).first

    if last.nil? || last.completed?
      # FIXME: 書き方キモい
      attrs = {
        user: user,
        title: title,
        description: description
      }.compact

      task = tasks.build(attrs)
      task.save!
    end

    enqueue
  end

  def next_recur_at
    recurrences.first
  end

  def fingerprint 
    Digest::SHA256.hexdigest([rrule, tzid].join("\x00"))
  end

  private
    def recurrences
      RRule::Rule.new rrule, tzid: tzid
    end

    def rrule_or_tzid_changed?
      saved_change_to_rrule? || saved_change_to_tzid?
    end

    def validate_rrule
      recurrences
    rescue RRule::InvalidRRule
      errors.add(:rrule, "is malformed")
    end

    def validate_tzid
      # https://stackoverflow.com/questions/31792295/validating-a-time-zone-is-valid-in-rails
      if !ActiveSupport::TimeZone[tzid].present?
        errors.add(:tzid, "does not exist")
      end
    end

    def enqueue
      wait_until = next_recur_at

      return if wait_until.nil?

      CreateTaskFromHabitJob
        .set(wait_until: wait_until)
        .perform_later(id, fingerprint)
    end
end
