class Api::V1::TasksController < Api::BaseController
  before_action :authenticate_user!
  before_action :set_task, only: %i[ show update destroy ]

  # GET /api/v1/tasks
  def index
    tasks = current_user.tasks

    if params.key?(:completed)
      completed = ActiveModel::Type::Boolean.new.cast(params[:completed])
      tasks = tasks.where(completed: completed)
    end

    tasks = tasks.order(created_at: :desc)

    render json: tasks
  end

  # GET /api/v1/tasks/1
  def show
    render json: @task
  end

  # POST /api/v1/tasks
  def create
    @task = current_user.tasks.new(task_params)

    if @task.save
      render json: @task, status: :created
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
    def set_task
      @task = current_user.tasks.find(params[:id])
    end

    def task_params
      params.expect(task: [ :title, :description, :completed ])
    end
end
