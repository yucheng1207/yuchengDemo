import { KeyboardEventModifier } from "cesium";
import { CameraEventType, Cartesian3 } from "cesium";

export const DEFAULT_POLYLINE_COLOR = '#f03048';
export const DEFAULT_POLYGON_COLOR = 'rgba(240, 48, 72, 0.30)';

export interface Gestures {
	zoomEventTypes: CameraEventType | (CameraEventType | { eventType: CameraEventType, modifier: KeyboardEventModifier })[];
	rotateEventTypes: CameraEventType | (CameraEventType | { eventType: CameraEventType, modifier: KeyboardEventModifier })[];
	tiltEventTypes: CameraEventType | (CameraEventType | { eventType: CameraEventType, modifier: KeyboardEventModifier })[];

}

export const defaultGestures: Gestures = {
	zoomEventTypes: [
		CameraEventType.WHEEL,
		CameraEventType.PINCH,
		{
			eventType: CameraEventType.LEFT_DRAG,
			modifier: KeyboardEventModifier.CTRL
		},
	],
	rotateEventTypes: [
		CameraEventType.LEFT_DRAG,
	],
	tiltEventTypes: [
		CameraEventType.RIGHT_DRAG,
		CameraEventType.PINCH,
	],
};

export const HEIGHT_DIFF_PRECISION = 2;

/**
 * 模型抬升高度
 */
export const HEIGHT_OFFSET = 50

export const convertGPSToWGS84 = (lon: number, lat: number, elevation?: number) => {
	return Cartesian3.fromDegrees(lon, lat, (elevation || 0) + HEIGHT_OFFSET)
}