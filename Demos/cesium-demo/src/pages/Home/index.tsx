import React, { useCallback, useRef, useState } from 'react';
import { Cartesian3, Viewer as CesiumViewer } from "cesium";
import { Viewer, Entity, Cesium3DTileset } from "resium";
import { Input, Button } from 'antd';
import styles from './index.module.scss'

const position = Cartesian3.fromDegrees(-74.0707383, 40.7117244, 100);
const pointGraphics = { pixelSize: 10 };

interface Props {

}

const Home: React.FunctionComponent<Props> = (props) => {
	const viewerRef = useRef<CesiumViewer | null>();
	const handleReady = useCallback(tileset => {
		if (viewerRef.current) {
			viewerRef.current.zoomTo(tileset);
		}
	}, [])
	const [tilesetUrl, setTilesetUrl] = useState<string>('http://data.mars3d.cn/3dtiles/qx-shequ/tileset.json')
	const [inputValue, setInputValue] = useState<string>('http://data.mars3d.cn/3dtiles/qx-shequ/tileset.json')
	const onChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((e) => {
		setInputValue(e.target.value)
	}, [])
	const onClick = useCallback<React.MouseEventHandler<HTMLElement>>((e) => {
		inputValue && setTilesetUrl(inputValue)
	}, [inputValue])
	return <div className={styles.home}>
		<div className={styles.inputContainer}>
			<span className={styles.title}>3D tiles:</span>
			<Input placeholder="请输入要加载的3D tiles链接" value={inputValue} onChange={onChange} className={styles.input} />
			<Button className={styles.button} onClick={onClick}>加载</Button>
		</div>

		<Viewer
			animation={false}
			timeline={false}
			homeButton={false}
			geocoder={false}
			navigationHelpButton={false}
			requestRenderMode
			fullscreenButton={false}
			full
			ref={e => {
				viewerRef.current = e && e.cesiumElement;
			}}
		>
			<Cesium3DTileset
				onReady={handleReady}
				url={tilesetUrl}
			/>
			<Entity position={position} point={pointGraphics} />
		</Viewer>
	</div>
}

export default Home;
