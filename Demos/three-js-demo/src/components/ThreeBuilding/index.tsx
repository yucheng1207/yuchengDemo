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
	const renderThree = useCallback(() => {
		renderer && scene && camera && renderer.render(scene, camera);
	}, [renderer, scene, camera])

	const createCube = useCallback((scene) => {
		const geometry = new THREE.BoxGeometry(1, 2, 1, 4); // 绘制一个立方体，擦书相当于定点位置 （three自带的对象）
		const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // 定义材质 我们这里用简单的颜色，其他的属性可以写入对象，就可以更改材质
		const cube = new THREE.Mesh(geometry, material); // 我们用到网格将 定义的材质用到定义的立方题上生成cube
		scene && scene.add(cube); // 将我们生成的cube放到场景中 
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
	}, [])

	const init = useCallback(() => {
		const containerDiv = containerRef.current
		if (containerDiv) {
			const width = containerDiv.clientWidth
			const height = containerDiv.clientHeight
			const renderer = new THREE.WebGLRenderer({ antialias: true }); // 创建渲染器。讲道理我还没有看这个参数是什么意思。 但是官网中有一个测试浏览器是否可以使用WebGL的方法，需要用到的可看一下
			renderer.setSize(width, height); // 将渲染器的长宽 设置为我们要显示的容器长宽
			containerDiv.appendChild(renderer.domElement); // 将整个场景推入我们要显示的元素中
			const scene = new THREE.Scene() //创建场景
			const camera = new THREE.PerspectiveCamera(75, width / height, 1, 500); // 创建相机  这些参数在官网中都有指出  第一个参数 75 -> 视野角度（单位：度）  第二个参数是长宽比 第三个是近截面 第四个是远截面
			camera.position.set(0, 0, 100);
			camera.lookAt(0, 0, 0);

			setScene(scene)
			setCamera(camera)
			setRenderer(renderer)

			createLine(scene)
			createCube(scene)
			renderer.render(scene, camera);
		}
	}, [createLine, createCube])

	return <div className={styles.threeBuilding} ref={containerRef}>
	</div>;
};

export default ThreeBuilding;
