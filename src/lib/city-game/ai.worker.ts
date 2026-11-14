import { chooseAction } from './ai';
import type { Action, View } from './engine';

const worker = self as unknown as {
  onmessage: ((event: MessageEvent<{ view: View; level: number }>) => void) | null;
  postMessage: (action: Action) => void;
};
worker.onmessage = (event) => worker.postMessage(chooseAction(event.data.view, event.data.level));
