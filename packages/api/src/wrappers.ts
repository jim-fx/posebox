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
}: DBPaginationOptions): Promise<Pose[]> => {
  return get(
    `/data/training?amount=${amount}&offset=${offset}&verified=${verified}`
  );
};

export { getBrainHistory, getTrainingPoses };
