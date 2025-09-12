import CrudRepository from "./crud.repository.js";
import { Project } from "../models/index.js";
import AppError from "../utils/errors/appError.js";
import { StatusCodes } from "http-status-codes";

class ProjectRepository extends CrudRepository {
  constructor() {
    super(Project);
  }

  async getAllProjects(data) {
    const { user, skip, limit, page } = data;
    const [projects, total] = await Promise.all([
      this.model
        .find({ user })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .select("name"),
      this.model.countDocuments({ userId: user }),
    ]);

    if (!projects) {
      throw new AppError(["Projects not found"], StatusCodes.NOT_FOUND);
    }

    const totalPages = Math.ceil(total / limit);

    return {
      data: projects,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }
}

export default new ProjectRepository();
