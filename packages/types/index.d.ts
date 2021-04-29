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
}

export interface DBPaginationOptions {
  amount: number;
  offset: number;
  verified?: boolean | string;
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
