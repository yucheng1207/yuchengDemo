import EventEmitter from 'events';

const perfMonitorEventType = {
  USER: 'user',
  COLLECT_PARAMETERIZED_URL: 'collectParameterizedUrl',
  FRAME: 'frame',
};

const perfMonitorEvents = new EventEmitter();

export { perfMonitorEventType, perfMonitorEvents };
