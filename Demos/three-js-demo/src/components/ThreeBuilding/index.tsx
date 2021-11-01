import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import * as THREE from 'three'

interface Props {
}

const ThreeBuilding: React.FunctionComponent<Props> = (props) => {
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		init()
	}, [])

	const [scene, setScene] = useState<THREE.Scene>()
	const [camera, setCamera] = useState<THREE.PerspectiveCamera>()
	const [renderer, setRenderer] = useState<THREE.WebGLRenderer>()
	const [cube, setCube] = useState<THREE.Mesh<THREE.BoxGeometry, THREE.MeshLambertMaterial>>()


	/**
	 * 初始化渲染器
	 */
	const initRender = (containerDiv: HTMLDivElement, width: number, height: number) => {
		// 创建渲染器
		const renderer = new THREE.WebGLRenderer({
			antialias: true // 抗锯齿开启
		}); // 创建渲染器
		renderer.setSize(width, height); // 设置渲染器宽度和高度
		renderer.setClearColor('#000000', 1.0); // 设置背景颜色
		renderer.setPixelRatio(window.devicePixelRatio); // 设置设备像素比
		containerDiv.appendChild(renderer.domElement); // 将整个场景推入我们要显示的元素中
		return renderer
	}

	/**
	 * 创建相机：相机的作用就类似于人眼，决定了观察的视角和位置；
	 * ThreeJS 框架同样提供了多种相机，比较常用有两种，分别为PerspectiveCamera透视投影相机和OrthographicCamera正交投影相机；
	 * 其中和人眼观察效果一致的是透视投影相机，用其观察物体时能获得近大远小的效果
	 */
	const initCamera = (width: number, height: number) => {
		const origPoint = new THREE.Vector3(0, 0, 0); // 原点
		const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000); // 第一个参数 -> 视野角度（单位：度）  第二个参数是长宽比 第三个是近截面 第四个是远截面
		camera.position.set(200, 400, 600); // 设置相机位置
		camera.up.set(0, 1, 0); // 设置相机正方向
		camera.lookAt(origPoint); // 设置相机视点
		return camera
	}

	const createCube = useCallback((scene) => {
		const geometry = new THREE.BoxGeometry(100, 100, 100); // 正方体轮廓
		const material = new THREE.MeshLambertMaterial({ color: 0xff0000 }); // 正方体材质
		const cube = new THREE.Mesh(geometry, material);
		cube.position.set(0, 0, 0);
		scene && scene.add(cube); // 将生成的cube放到场景中
		return cube
	}, [])

	const createLine = useCallback((scene) => {
		const material = new THREE.LineBasicMaterial({ color: 0x0f00ff }) //定义线的材质
		const points = [];
		points.push(new THREE.Vector3(- 10, 0, 0));
		points.push(new THREE.Vector3(0, 10, 0));
		points.push(new THREE.Vector3(10, 0, 0));
		const geometry = new THREE.BufferGeometry().setFromPoints(points);
		const line = new THREE.Line(geometry, material)
		scene && scene.add(line)
		return line
	}, [])

	/**
	 * 初始化光源
	 */
	const initLight = useCallback((scene) => {
		//点光源
		const pointLight = new THREE.PointLight(0xffffff, 1, 2000);
		pointLight.position.set(70, 112, 98);
		//环境光
		const ambientLight = new THREE.AmbientLight(0x333333);
		scene.add(pointLight)
		scene.add(ambientLight)
	}, [])

	const render = useCallback(() => {
		if (renderer && scene && camera && cube) {
			renderer.clear();
			renderer.render(scene, camera);
			cube.rotation.x += 0.005;
			cube.rotation.y += 0.005;
			requestAnimationFrame(render);
		} else if (renderer && scene && camera) {
			renderer.render(scene, camera);
		}
	}, [renderer, camera, scene, cube])

	const init = useCallback(() => {
		const containerDiv = containerRef.current
		if (containerDiv) {
			const width = containerDiv.clientWidth
			const height = containerDiv.clientHeight

			// 创建渲染器
			const renderer = initRender(containerDiv, width, height)

			// 创建相机
			const camera = initCamera(width, height)

			// 创建场景
			const scene = new THREE.Scene();
			// 创建一个正方体
			const cube = createCube(scene)
			// 初始化光源
			initLight(scene)

			// 同步到state
			setScene(scene)
			setCamera(camera)
			setRenderer(renderer)
			setCube(cube)

			render()
		}
	}, [initLight, createCube, render])

	return <div className={styles.threeBuilding} ref={containerRef}>
	</div>;
};

export default ThreeBuilding;
