// lib/types.ts
export type Role = "siswa" | "guru" | "admin";
export type TaskStatus = "draf" | "terkirim" | "perlu_revisi" | "dinilai";
export type ContentStatus = "draf" | "terbit" | "diarsipkan";
export type IotStatus = "online" | "data_terakhir" | "offline" | "tidak_valid" | "simulasi";

export interface SensorReading {
  deviceId: string;
  sensorId: string;
  sensorType: "soil_moisture" | "air_temp";
  value: number;
  unit: string;
  measuredAt: string;
  receivedAt: string;
  valid: boolean;
  connectionStatus: IotStatus;
  calibrationNote?: string;
  configVersion?: string;
}

export interface SensorHistoryPoint {
  time: string;
  value: number | null;
}

export interface Device {
  id: string;
  name: string;
  boxId: string;
  classId: string;
  status: IotStatus;
  lastDataAt: string;
  sensors: SensorReading[];
}

export interface Student {
  id: string;
  name: string;
  classId: string;
  classCode: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
}

export interface Class {
  id: string;
  name: string;
  code: string;
  teacherId: string;
  studentCount: number;
}

export interface LessonSection {
  /** Bila ada, video YouTube tampil sebelum storyboard bagian ini. */
  video?: { title: string; youtubeId: string; poster: string };
  label?: string;
  heading: string;
  /** Gambar storyboard; teks bacaan ada di dalam gambar, alt dipakai pembaca layar. */
  image: { src: string; alt: string };
}

export interface Module {
  id: string;
  slug: string;
  title: string;
  description: string;
  topic: string;
  durationMin: number;
  status: ContentStatus;
  classIds: string[];
  objectives: string[];
  content: string;
  quizId?: string;
  /** Modul berisi video + bacaan; bila ada, menggantikan tampilan modul standar. */
  lessons?: LessonSection[];
}

export interface Mission {
  id: string;
  title: string;
  objective: string;
  triggerQuestion: string;
  steps: string[];
  tools: string[];
  evidenceRequired: string[];
  completionCriteria: string[];
  deadline?: string;
  classIds: string[];
}

export interface Submission {
  id: string;
  missionId: string;
  studentId: string;
  status: TaskStatus;
  observation: string;
  sensorRefs: string[];
  conclusion: string;
  reflection: string;
  attachments: string[];
  submittedAt?: string;
  revision: number;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  moduleId: string;
  title: string;
  questions: QuizQuestion[];
}

export interface RubricRow {
  criteria: string;
  needsGuidance: string;
  developing: string;
  good: string;
}

export interface ActivityItem {
  id: string;
  type: "materi" | "tugas" | "data" | "umpan_balik";
  title: string;
  time: string;
  detail?: string;
}
