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
    tf?: any; // TensorFlow.js global object
    videoElement: HTMLVideoElement | null;
    canvasElement: HTMLCanvasElement | null;
  }
}
