class Api::V1::TasksController < ApplicationController
  before_action :set_task, only: %i[ show update destroy ]

  # GET /api/v1/tasks
  def index
    @tasks = Task.all

    render json: @tasks
  end

  # GET /api/v1/tasks/1
  def show
    render json: @task
  end

  # POST /api/v1/tasks
  def create
    @task = Task.new(task_params)

    if @task.save
      render json: @task, status: :created, location: api_v1_task_url(@task)
    else
      render json: @task.errors, status: :unprocessable_content
    end
  end

  # PATCH/PUT /api/v1/tasks/1
  def update
    if @task.update(task_params)
      render json: @task
    else
      render json: @task.errors, status: :unprocessable_content
    end
  end

  # DELETE /api/v1/tasks/1
  def destroy
    @task.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_task
      @task = Task.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def task_params
      params.expect(task: [ :title, :note, :complete ])
    end
end

