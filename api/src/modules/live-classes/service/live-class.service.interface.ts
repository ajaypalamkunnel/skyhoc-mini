import type { LiveClassQueryStatus } from "../dto/live-class.dto";
import type {
  LiveClassResponseDTO,
  MyLiveClassResponseDTO,
} from "../dto/live-class.response.dto";

export interface ILiveClassService {
  getCourseLiveClasses(
    courseId: number,
    userId: number,
    status: LiveClassQueryStatus,
  ): Promise<LiveClassResponseDTO[]>;

  getMyLiveClasses(
    userId: number,
    status: LiveClassQueryStatus,
  ): Promise<MyLiveClassResponseDTO[]>;
}
