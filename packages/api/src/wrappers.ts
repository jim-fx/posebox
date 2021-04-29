import { DBPaginationOptions, Pose } from "@poser/types";
import { readable } from "svelte/store";
import { get } from "./fetch";
import { off, on } from "./socket";

const getBrainHistory = () =>
  readable([], (set) => {
    let history = [];

    const handleSocket = (iteration) => {
      history = [...history, iteration];
      set(history);
    };

    get("/brain/iterations").then((res) => {
      history = [...res, ...history];
      set(history);
    });

    on("brain.iteration", handleSocket);

    return () => off("brain.iteration", handleSocket);
  });

const getTrainingPoses = async ({
  amount,
  offset,
  verified,
  id,
}: DBPaginationOptions): Promise<Pose[]> => {
  let url = "?";

  if (amount) {
    url += `amount=${amount}&`;
  }

  if (offset) {
    url += `offset=${offset}&`;
  }

  if (typeof verified !== undefined) {
    url += `verified=${verified}&`;
  }

  if (id) {
    url += `id=${id}`;
  }

  return get(`/data/training?${url}`);
};

const getPoses = (): Promise<Pose[]> => get("/poses");

const getTrainingDataInfo = (poseId?: string) =>
  get(`/data/status/${poseId ? poseId : ""}`);

export { getBrainHistory, getTrainingPoses, getPoses, getTrainingDataInfo };
