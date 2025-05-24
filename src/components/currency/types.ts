import * as tf from "@tensorflow/tfjs";

export interface PredictionResult {
  className: string;
  probability: number;
  allProbabilities: {
    name: string;
    probability: number;
  }[];
}

// Define window for objects that will be global
declare global {
  interface Window {
    tf?: typeof tf; // TensorFlow.js global object
    videoElement: HTMLVideoElement | null;
    canvasElement: HTMLCanvasElement | null;
  }
}
