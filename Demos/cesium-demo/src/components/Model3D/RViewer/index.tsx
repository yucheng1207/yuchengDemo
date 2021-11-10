import React, { forwardRef, useCallback, useMemo } from 'react';
import { Viewer as CViewer } from "cesium";
import { Viewer as RViewer, ImageryLayer, CesiumComponentRef, Camera } from 'resium';
import { ViewerProps as RViewerProps } from "resium/dist/Viewer/Viewer";
import { tdtRoad, tdtSat, tdtTerrainProvider } from './terrain';
import { debounce } from 'src/utils/index';

interface Props extends RViewerProps {
	// 是否加载天地图底图
	showTdt?: boolean;
	// 是否加载指南针
	compass?: boolean;
	onCameraChange?: () => void;
}

const ResiumViewer = forwardRef<CesiumComponentRef<CViewer>, Props>((props, ref) => {
	const { children, showTdt, compass, onCameraChange } = props;

	const debounceCameraChange = useMemo(() => onCameraChange ? debounce(onCameraChange, 500) : null, [onCameraChange])

	const handleCameraChange = useCallback(() => {
		debounceCameraChange && debounceCameraChange()
	}, [debounceCameraChange])

	const viewerMixin = useCallback<CViewer.ViewerMixin>((viewer: CViewer, options: any) => {
		const _window: any = window
		const cesiumNavigationMixin = _window?.Cesium?.viewerCesiumNavigationMixin
		if (!cesiumNavigationMixin) {
			console.error('加载指南针失败，请确保已安装`cesium-navigation`依赖')
		}
		// const option = {
		// 	enableCompass: true,
		// 	enableZoomControls: false,
		// 	enableDistanceLegend: false,
		// 	enableCompassOuterRing: true
		// }
		compass && viewer.extend((window as any).Cesium.viewerCesiumNavigationMixin, options);
	}, [compass])
	return <RViewer
		animation={false}
		timeline={false}
		homeButton={false}
		geocoder={false}
		navigationHelpButton={false}
		requestRenderMode
		maximumRenderTimeChange={Infinity}
		fullscreenButton={false}
		full
		ref={ref}
		terrainProvider={tdtTerrainProvider}
		extend={viewerMixin}
	>
		{
			showTdt ?
				<>
					<ImageryLayer imageryProvider={tdtSat} />
					<ImageryLayer imageryProvider={tdtRoad} />
					{/* <ImageryLayer imageryProvider={country} /> */}
				</> : null
		}
		<Camera onChange={handleCameraChange} onMoveEnd={handleCameraChange} />
		{children}
	</RViewer>
});

export default ResiumViewer;
