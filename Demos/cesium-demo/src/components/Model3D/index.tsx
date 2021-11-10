import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Viewer as CViewer, Cartesian3, Cesium3DTileset, ScreenSpaceEventType, Matrix4, HeadingPitchRange, Math as CMath, Rectangle } from "cesium";
import { Entity, Cesium3DTileset as Resium3DTileset, CesiumComponentRef } from "resium";
import { Input, Button } from 'antd';
import styles from './index.module.scss'
import RViewer from './RViewer';
import { defaultGestures, HEIGHT_OFFSET } from './config';

export type IZoomModelFunction = (params: 'reset' | 'in' | 'out') => void;
export interface ICameraViewOption {
	destination: Cartesian3 | Rectangle,
	orientation: {
		direction: Cartesian3,
		up: Cartesian3,
	} | {
		heading: number,
		pitch: number,
		roll: number,
	}
}

const pointPosition = Cartesian3.fromDegrees(-74.0707383, 40.7117244, 100);
const pointGraphics = { pixelSize: 10 };

interface Props {

}

const Model3D: React.FunctionComponent<Props> = (props) => {
	const ref = useRef<CesiumComponentRef<CViewer>>(null);

	/**
	 * 保存位置
	 */
	const [position, setPosition] = useState<ICameraViewOption>()
	const handleCameraChange = useCallback(() => {
		if (ref.current?.cesiumElement) {
			const cameraViewOption: ICameraViewOption = {
				destination: ref.current.cesiumElement.camera.positionWC,
				orientation: {
					direction: ref.current.cesiumElement.camera.directionWC,
					up: ref.current.cesiumElement.camera.upWC,
				}
			}
			setPosition(cameraViewOption)
		}
	}, [])

	const tilesetRef = useRef<Cesium3DTileset | null>(null)
	const handleReady = useCallback(async (tileset: Cesium3DTileset) => {
		const viewer = ref.current?.cesiumElement;
		tilesetRef.current = tileset
		if (viewer) {
			// 设置鼠标操作
			viewer.scene.screenSpaceCameraController.zoomEventTypes = defaultGestures.zoomEventTypes;
			viewer.scene.screenSpaceCameraController.rotateEventTypes = defaultGestures.rotateEventTypes;
			viewer.scene.screenSpaceCameraController.tiltEventTypes = defaultGestures.tiltEventTypes;

			// 去除双击action，否则双击entity会自动缩放到entity位置
			viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

			// 抬升模型高度
			const cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(tileset.boundingSphere.center);
			const height = cartographic.height + HEIGHT_OFFSET;
			const surface = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
			const offset = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height);
			const translation = Cartesian3.subtract(offset, surface, new Cartesian3());
			tileset.modelMatrix = Matrix4.fromTranslation(translation);

			if (position) {
				// 跳转到固定坐标
				// viewer.camera.setView(position);
			}
			else {
				// zoom到tileset
				const boundingSphere = tileset.boundingSphere;
				viewer.camera.viewBoundingSphere(boundingSphere, new HeadingPitchRange(0, -2.0, 0));
				await viewer.zoomTo(tileset);
				viewer.zoomTo(tileset)
			}
		}
	}, [position])


	/**
	 * 控制天地图的展示和销毁
	 */
	const [tdtVisible, setTdtVisible] = useState(true)
	useEffect(() => {
		if (ref.current && ref.current?.cesiumElement) {
			ref.current.cesiumElement.scene.globe.show = tdtVisible
			ref.current.cesiumElement.scene.sun.show = tdtVisible
			ref.current.cesiumElement.scene.moon.show = tdtVisible
			ref.current.cesiumElement.scene.skyBox.show = tdtVisible
			ref.current.cesiumElement.scene.skyAtmosphere.show = tdtVisible
		}
	}, [tdtVisible])

	const onTdtClick = useCallback(() => {
		setTdtVisible(!tdtVisible)
	}, [tdtVisible])

	/**
	 * 显示模型
	 */
	const [tilesetUrls, setTilesetUrls] = useState<string[]>(['http://data.mars3d.cn/3dtiles/qx-shequ/tileset.json'])
	const renderModels = useCallback((viewer?: CViewer) => {
		if (!tilesetUrls || tilesetUrls.length === 0) return null;
		return tilesetUrls.map((json) => {
			return (
				<Resium3DTileset key={json} url={json} maximumScreenSpaceError={1} onReady={handleReady} />
			);
		})
	}, [tilesetUrls, handleReady])


	/**
	 * 输入模型链接
	 */
	const [inputValue, setInputValue] = useState<string>('http://data.mars3d.cn/3dtiles/qx-shequ/tileset.json')
	const onChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((e) => {
		setInputValue(e.target.value)
	}, [])
	const onClick = useCallback<React.MouseEventHandler<HTMLElement>>((e) => {
		inputValue && setTilesetUrls([inputValue])
	}, [inputValue])

	/**
	 * 控制缩放
	 */
	const onZoom = useCallback<IZoomModelFunction>((action) => {
		switch (action) {
			case 'in':
				ref.current?.cesiumElement?.camera.zoomIn(100);
				break;
			case 'out':
				ref.current?.cesiumElement?.camera.zoomOut(100);
				break;
			case 'reset':
				const viewer = ref.current?.cesiumElement;
				const tileset = tilesetRef.current
				viewer && tileset && viewer.zoomTo(tileset, new HeadingPitchRange(
					CMath.toRadians(0.0), 	// east, default value is 0.0 (north)
					CMath.toRadians(-90),   // default value (looking down)
				));
				break;
			default:
				break
		}
	}, [])

	const renderEntity = useCallback(() => {
		return <Entity position={pointPosition} point={pointGraphics} />
	}, [])


	return <div className={styles.model3d}>
		<div className={styles.inputContainer}>
			<span className={styles.title}>3D tiles:</span>
			<Input placeholder="请输入要加载的3D tiles链接" value={inputValue} onChange={onChange} className={styles.input} />
			<Button className={styles.button} onClick={onClick}>加载</Button>
			<Button className={styles.button} onClick={onTdtClick}>
				{
					tdtVisible ? '去除天地图' : '使用天地图'
				}</Button>
		</div>

		<RViewer
			ref={ref}
			showTdt={tdtVisible}
			compass={true}
			onCameraChange={handleCameraChange}
		>
			{renderModels()}
			{renderEntity()}
		</RViewer>
	</div>
}

export default Model3D;
