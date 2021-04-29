export interface Pose {
  /**
   * Type of the pose, e.g. x, o, luru
   */
  id: string;
  /**
   * Unique id in the database
   */
  _id: string;
  /**
   * Actual pose data
   */
  pose: number[];
  /**
   * If the pose has been verified
   */
  verified: boolean;

  /**
   * Only for the main poses
   */
  description?: string;
}

export interface DBUpdateOption {
  id: string;
  updates: {
    verified?: boolean;
    pose?: number[];
  };
}

export type DBUpdateOptions = DBUpdateOption[];

export interface DBPaginationOptions {
  /**
   * Amount of returned poses, maximal 100
   */
  amount: number;
  /**
   * Offset by certain amount, useful for pagination
   */
  offset: number;
  /**
   * Filter for verified or unverified poses
   */
  verified?: boolean | string;
  /**
   * Filter for specific poses
   */
  id?: string;
}

interface Vector2D {
  x: number;
  y: number;
}

export interface RawPose {
  nose: Vector2D;
  leftEye: Vector2D;
  rightEye: Vector2D;
  leftEar: Vector2D;
  rightEar: Vector2D;
  leftShoulder: Vector2D;
  rightShoulder: Vector2D;
  leftElbow: Vector2D;
  rightElbow: Vector2D;
  leftWrist: Vector2D;
  rightWrist: Vector2D;
  leftHip: Vector2D;
  rightHip: Vector2D;
  leftKnee: Vector2D;
  rightKnee: Vector2D;
  leftAnkle: Vector2D;
  rightAnkle: Vector2D;
}
