import { AppError } from "../../../utils/app-error";
import { ERROR_CODES } from "../../../utils/error-codes";
import { HTTP_STATUS } from "../../../utils/http-status";
import type { LiveClassQueryStatus } from "../dto/live-class.dto";
import type {
  LiveClassResponseDTO,
  MyLiveClassResponseDTO,
} from "../dto/live-class.response.dto";
import type { ILiveClassRepository } from "../repository/live-class.repository.interface";
import type { ILiveClassService } from "./live-class.service.interface";

export class LiveClassService implements ILiveClassService {
  constructor(private readonly liveClassRepository: ILiveClassRepository) {}

  async getCourseLiveClasses(
    courseId: number,
    userId: number,
    status: LiveClassQueryStatus,
  ): Promise<LiveClassResponseDTO[]> {
    const liveClasses =
      await this.liveClassRepository.findLiveClassesByCourseForUser(
        courseId,
        userId,
        status,
      );

    if (liveClasses === null) {
      throw new AppError(
        "Course not found",
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.COURSE_NOT_FOUND,
      );
    }

    return liveClasses.map((liveClass) => ({
      id: liveClass.id,
      title: liveClass.title,
      startsAt: liveClass.startsAt,
      durationMinutes: liveClass.durationMinutes,
      status: liveClass.status,
    }));
  }

  async getMyLiveClasses(
    userId: number,
    status: LiveClassQueryStatus,
  ): Promise<MyLiveClassResponseDTO[]> {
    const liveClasses = await this.liveClassRepository.findLiveClassesByUserId(
      userId,
      status,
    );

    return liveClasses.map((liveClass) => ({
      id: liveClass.id,
      title: liveClass.title,
      startsAt: liveClass.startsAt,
      durationMinutes: liveClass.durationMinutes,
      status: liveClass.status,
      course: {
        id: liveClass.course.id,
        title: liveClass.course.title,
      },
    }));
  }
}
