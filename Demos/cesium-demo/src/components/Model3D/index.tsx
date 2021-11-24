import React, { useCallback, useRef, useState, useEffect } from 'react';
import * as Cesium from 'cesium'
import { Viewer as CViewer, Cartesian3, Cesium3DTileset, ScreenSpaceEventType, Matrix4, HeadingPitchRange, Math as CMath, Rectangle, Cartographic } from "cesium";
import { Entity, Cesium3DTileset as Resium3DTileset, CesiumComponentRef } from "resium";
import { Input, Button } from 'antd';
import styles from './index.module.scss'
import RViewer from './RViewer';
import { defaultGestures, HEIGHT_OFFSET } from './config';

console.log('Cesium 版本为：', (Cesium as any).VERSION)

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
const tilesUrl = 'http://data.mars3d.cn/3dtiles/qx-shequ/tileset.json'

/**
 * 获取高度
 */
const getHeight = async (scene: any, points: { lat: number; lng: number }[]) => {
	const formatErrorTip =
		'Get height failed, please enter a point in the correct format => getHeight(points: { lat: number, lng: number }[])'
	if (!points || !Array.isArray(points)) {
		throw new Error(formatErrorTip)
	} else {
		try {
			const isVaildPoints = points.every((item) => item.lat && item.lng)
			if (isVaildPoints) {
				const cartographics = points.map((item) =>
					Cartographic.fromDegrees(item.lng, item.lat)
				)
				console.log('Execution function sampleHeightMostDetailed', cartographics)
				console.log(scene.sampleHeightMostDetailed)
				const result = await scene.sampleHeightMostDetailed([
					Cartographic.fromDegrees(120.6893039381743, 27.947847140746887)
				])
				const isVaildResult = result.every((item: any) => item.height !== undefined)
				console.log('sampleHeightMostDetailed result', result)
				return {
					isAllVaild: isVaildResult,
					points: result
				}
			}
			else {
				console.error(formatErrorTip, points)
				throw formatErrorTip
			}
		} catch (error) {
			console.error('Get height failed', error)
			throw error
		}
	}
}

/**
 * 给window对象注册getHeight方法，后端使用无头浏览器调用该方法来获取点对应到模型的高度
 * doc: https://www.yuque.com/kiwi/frontend/iev7vm
 */
const registerWindowFunction = (scene?: any) => {
	if (scene) {
		// eslint-disable-next-line no-underscore-dangle
		const _window: any = window
		console.log('register getHeight function...')
		_window.getHeight = (points: { lat: number; lng: number }[]) => {
			try {
				getHeight(scene, points)
			} catch (error) {
				console.log(error)
			}
		}
		console.log('register getHeight function success')
	} else {
		console.error('register getHeight function failed, scene does not exist')
	}
}

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
			registerWindowFunction(viewer.scene)
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
	const [tilesetUrls, setTilesetUrls] = useState<string[]>([tilesUrl])
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
	const [inputValue, setInputValue] = useState<string>(tilesUrl)
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
