class Api::V1::HabitsController < ApplicationController
  before_action :set_habit, only: %i[ show update destroy ]

  # GET /habits
  def index
    @habits = current_user.habits

    render json: @habits
  end

  # GET /habits/1
  def show
    render json: @habit
  end

  # POST /habits
  def create
    @habit = current_user.habits.new(habit_params)

    if @habit.save
      render json: @habit, status: :created
    else
      render json: @habit.errors, status: :unprocessable_content
    end
  end

  # PATCH/PUT /habits/1
  def update
    if @habit.update(habit_params)
      render json: @habit
    else
      render json: @habit.errors, status: :unprocessable_content
    end
  end

  # DELETE /habits/1
  def destroy
    @habit.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_habit
      @habit = current_user.habits.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def habit_params
      params.expect(habit: [ :title, :description, :rrule, :tzid ])
    end
end
