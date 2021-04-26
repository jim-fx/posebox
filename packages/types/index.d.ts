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
