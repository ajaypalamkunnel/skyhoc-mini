import { describe, expect, it } from "vitest";
import { AttendanceCalculatorService } from "../services/attendance-calculator.service";

describe("AttendanceCalculatorService", () => {
  const service = new AttendanceCalculatorService();

  const classStartsAt = new Date("2026-10-08T10:00:00.000Z");
  const classDurationMinutes = 60;

  const event = (
    eventType: "JOIN" | "LEAVE",
    time: string,
  ) => ({
    eventType,
    eventAt: new Date(`2026-10-08T${time}:00.000Z`),
  });

  // ============================================================
  // BASIC ATTENDANCE
  // ============================================================

  describe("basic attendance", () => {
    it("returns ABSENT when there are no attendance events", () => {
      const result = service.calculateAttendance({
        classStartsAt,
        classDurationMinutes,
        events: [],
      });

      expect(result).toEqual({
        totalMinutes: 0,
        attendancePercentage: 0,
        status: "ABSENT",
      });
    });

    it("calculates normal JOIN → LEAVE attendance", () => {
      const result = service.calculateAttendance({
        classStartsAt,
        classDurationMinutes,
        events: [
          event("JOIN", "10:00"),
          event("LEAVE", "10:30"),
        ],
      });

      expect(result).toEqual({
        totalMinutes: 30,
        attendancePercentage: 50,
        status: "ABSENT",
      });
    });

    it("calculates 100% attendance", () => {
      const result = service.calculateAttendance({
        classStartsAt,
        classDurationMinutes,
        events: [
          event("JOIN", "10:00"),
          event("LEAVE", "11:00"),
        ],
      });

      expect(result).toEqual({
        totalMinutes: 60,
        attendancePercentage: 100,
        status: "PRESENT",
      });
    });
  });

  // ============================================================
  // RECONNECT / MULTIPLE INTERVALS
  // ============================================================

  describe("reconnects and multiple intervals", () => {
    it("handles reconnects correctly", () => {
      const result = service.calculateAttendance({
        classStartsAt,
        classDurationMinutes,
        events: [
          event("JOIN", "10:00"),
          event("LEAVE", "10:20"),

          event("JOIN", "10:25"),
          event("LEAVE", "10:55"),
        ],
      });

      expect(result).toEqual({
        totalMinutes: 50,
        attendancePercentage: 83.33,
        status: "PRESENT",
      });
    });

    it("handles multiple reconnects", () => {
      const result = service.calculateAttendance({
        classStartsAt,
        classDurationMinutes,
        events: [
          event("JOIN", "10:00"),
          event("LEAVE", "10:10"),

          event("JOIN", "10:15"),
          event("LEAVE", "10:25"),

          event("JOIN", "10:30"),
          event("LEAVE", "10:45"),
        ],
      });

      expect(result).toEqual({
        totalMinutes: 35,
        attendancePercentage: 58.33,
        status: "ABSENT",
      });
    });
  });

  // ============================================================
  // OUT-OF-ORDER EVENTS
  // ============================================================

  describe("out-of-order events", () => {
    it("sorts events by eventAt instead of relying on input order", () => {
      const result = service.calculateAttendance({
        classStartsAt,
        classDurationMinutes,
        events: [
          event("LEAVE", "10:30"),
          event("JOIN", "10:00"),
        ],
      });

      expect(result).toEqual({
        totalMinutes: 30,
        attendancePercentage: 50,
        status: "ABSENT",
      });
    });
  });

  // ============================================================
  // DUPLICATE EVENTS
  // ============================================================

  describe("duplicate events", () => {
    it("does not double-count duplicate JOIN events", () => {
      const result = service.calculateAttendance({
        classStartsAt,
        classDurationMinutes,
        events: [
          event("JOIN", "10:00"),
          event("JOIN", "10:00"),
          event("LEAVE", "10:30"),
        ],
      });

      expect(result).toEqual({
        totalMinutes: 30,
        attendancePercentage: 50,
        status: "ABSENT",
      });
    });

    it("does not double-count duplicate LEAVE events", () => {
      const result = service.calculateAttendance({
        classStartsAt,
        classDurationMinutes,
        events: [
          event("JOIN", "10:00"),
          event("LEAVE", "10:30"),
          event("LEAVE", "10:30"),
        ],
      });

      expect(result).toEqual({
        totalMinutes: 30,
        attendancePercentage: 50,
        status: "ABSENT",
      });
    });
  });

  // ============================================================
  // UNMATCHED EVENTS
  // ============================================================

  describe("unmatched events", () => {
    it("ignores a LEAVE event without a JOIN", () => {
      const result = service.calculateAttendance({
        classStartsAt,
        classDurationMinutes,
        events: [
          event("LEAVE", "10:20"),
        ],
      });

      expect(result).toEqual({
        totalMinutes: 0,
        attendancePercentage: 0,
        status: "ABSENT",
      });
    });

    it("ignores unmatched LEAVE after a completed interval", () => {
      const result = service.calculateAttendance({
        classStartsAt,
        classDurationMinutes,
        events: [
          event("JOIN", "10:00"),
          event("LEAVE", "10:30"),
          event("LEAVE", "10:40"),
        ],
      });

      expect(result).toEqual({
        totalMinutes: 30,
        attendancePercentage: 50,
        status: "ABSENT",
      });
    });
  });

  // ============================================================
  // MISSING LEAVE
  // ============================================================

  describe("missing LEAVE events", () => {
    it("closes an open JOIN at class end", () => {
      const result = service.calculateAttendance({
        classStartsAt,
        classDurationMinutes,
        events: [
          event("JOIN", "10:20"),
        ],
      });

      expect(result).toEqual({
        totalMinutes: 40,
        attendancePercentage: 66.67,
        status: "ABSENT",
      });
    });

    it("calculates full attendance when JOIN occurs at class start and LEAVE is missing", () => {
      const result = service.calculateAttendance({
        classStartsAt,
        classDurationMinutes,
        events: [
          event("JOIN", "10:00"),
        ],
      });

      expect(result).toEqual({
        totalMinutes: 60,
        attendancePercentage: 100,
        status: "PRESENT",
      });
    });
  });

  // ============================================================
  // OVERLAPPING EVENTS / MULTI-TAB / MULTI-DEVICE
  // ============================================================

  describe("overlapping attendance", () => {
    it("does not double-count overlapping JOIN/LEAVE intervals", () => {
      const result = service.calculateAttendance({
        classStartsAt,
        classDurationMinutes,
        events: [
          event("JOIN", "10:00"),
          event("JOIN", "10:10"),
          event("LEAVE", "10:30"),
          event("LEAVE", "10:40"),
        ],
      });

      expect(result).toEqual({
        totalMinutes: 40,
        attendancePercentage: 66.67,
        status: "ABSENT",
      });
    });

    it("handles nested overlapping intervals", () => {
      const result = service.calculateAttendance({
        classStartsAt,
        classDurationMinutes,
        events: [
          event("JOIN", "10:00"),
          event("JOIN", "10:10"),
          event("JOIN", "10:20"),
          event("LEAVE", "10:30"),
          event("LEAVE", "10:40"),
          event("LEAVE", "10:50"),
        ],
      });

      expect(result).toEqual({
        totalMinutes: 50,
        attendancePercentage: 83.33,
        status: "PRESENT",
      });
    });
  });

  // ============================================================
  // CLASS BOUNDARIES
  // ============================================================

  describe("class boundaries", () => {
    it("clamps JOIN occurring before class start", () => {
      const result = service.calculateAttendance({
        classStartsAt,
        classDurationMinutes,
        events: [
          event("JOIN", "09:50"),
          event("LEAVE", "10:30"),
        ],
      });

      expect(result).toEqual({
        totalMinutes: 30,
        attendancePercentage: 50,
        status: "ABSENT",
      });
    });

    it("clamps LEAVE occurring after class end", () => {
      const result = service.calculateAttendance({
        classStartsAt,
        classDurationMinutes,
        events: [
          event("JOIN", "10:50"),
          event("LEAVE", "11:20"),
        ],
      });

      expect(result).toEqual({
        totalMinutes: 10,
        attendancePercentage: 16.67,
        status: "ABSENT",
      });
    });

    it("clamps an interval spanning the entire class", () => {
      const result = service.calculateAttendance({
        classStartsAt,
        classDurationMinutes,
        events: [
          event("JOIN", "09:00"),
          event("LEAVE", "12:00"),
        ],
      });

      expect(result).toEqual({
        totalMinutes: 60,
        attendancePercentage: 100,
        status: "PRESENT",
      });
    });

    it("ignores events completely outside the class", () => {
      const result = service.calculateAttendance({
        classStartsAt,
        classDurationMinutes,
        events: [
          event("JOIN", "08:00"),
          event("LEAVE", "09:00"),

          event("JOIN", "12:00"),
          event("LEAVE", "12:30"),
        ],
      });

      expect(result).toEqual({
        totalMinutes: 0,
        attendancePercentage: 0,
        status: "ABSENT",
      });
    });
  });

  // ============================================================
  // 70% THRESHOLD
  // ============================================================

  describe("attendance threshold", () => {
    it("marks exactly 70% attendance as PRESENT", () => {
      const result = service.calculateAttendance({
        classStartsAt,
        classDurationMinutes: 60,
        events: [
          event("JOIN", "10:00"),
          event("LEAVE", "10:42"),
        ],
      });

      expect(result).toEqual({
        totalMinutes: 42,
        attendancePercentage: 70,
        status: "PRESENT",
      });
    });

    it("marks attendance below 70% as ABSENT", () => {
      const result = service.calculateAttendance({
        classStartsAt,
        classDurationMinutes: 60,
        events: [
          event("JOIN", "10:00"),
          event("LEAVE", "10:41"),
        ],
      });

      expect(result).toEqual({
        totalMinutes: 41,
        attendancePercentage: 68.33,
        status: "ABSENT",
      });
    });

    it("marks attendance above 70% as PRESENT", () => {
      const result = service.calculateAttendance({
        classStartsAt,
        classDurationMinutes: 60,
        events: [
          event("JOIN", "10:00"),
          event("LEAVE", "10:50"),
        ],
      });

      expect(result).toEqual({
        totalMinutes: 50,
        attendancePercentage: 83.33,
        status: "PRESENT",
      });
    });
  });

  // ============================================================
  // INPUT VALIDATION
  // ============================================================

  describe("input validation", () => {
    it("rejects zero class duration", () => {
      expect(() =>
        service.calculateAttendance({
          classStartsAt,
          classDurationMinutes: 0,
          events: [],
        }),
      ).toThrow("classDurationMinutes must be a positive number greater than 0");
    });

    it("rejects negative class duration", () => {
      expect(() =>
        service.calculateAttendance({
          classStartsAt,
          classDurationMinutes: -10,
          events: [],
        }),
      ).toThrow("classDurationMinutes must be a positive number greater than 0");
    });

    it("rejects invalid class start date", () => {
      expect(() =>
        service.calculateAttendance({
          classStartsAt: new Date("invalid"),
          classDurationMinutes: 60,
          events: [],
        }),
      ).toThrow("classStartsAt must be a valid Date");
    });

    it("rejects invalid event date", () => {
      expect(() =>
        service.calculateAttendance({
          classStartsAt,
          classDurationMinutes: 60,
          events: [
            {
              eventType: "JOIN",
              eventAt: new Date("invalid"),
            },
          ],
        }),
      ).toThrow("Each event must have a valid eventAt Date");
    });

    it("rejects invalid event type", () => {
      expect(() =>
        service.calculateAttendance({
          classStartsAt,
          classDurationMinutes: 60,
          events: [
            {
              eventType: "JOINED" as "JOIN",
              eventAt: new Date("2026-10-08T10:00:00.000Z"),
            },
          ],
        }),
      ).toThrow("Each event must have eventType as 'JOIN' or 'LEAVE'");
    });
  });
});