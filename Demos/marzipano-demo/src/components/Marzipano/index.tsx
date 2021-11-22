import React, { useEffect } from 'react';
import styles from './index.module.scss'
import MarzipanoManager from '../../marzipano/MarzipanoManager';
import { createRectilinearView, createCubeGeometry, defaultRectilinearViewParams, createMultiresolutionSource } from '../../marzipano/utils';
import { MarzipanoView, MarzipanoSource, MarzipanoGeometry, MarzipanoTextureStoreOpts, MarzipanoLayerOpts, IMarzipano } from '../../marzipano/marzipanoTypes';
const Marzipano: IMarzipano = require('marzipano');

interface SceneOpts {
	view: MarzipanoView,
	source: MarzipanoSource,
	geometry: MarzipanoGeometry,
	pinFirstLevel?: boolean,
	textureStoreOpts?: MarzipanoTextureStoreOpts,
	layerOpts?: MarzipanoLayerOpts,
}

function generateSceneOpts(isCustom = false): SceneOpts {
	if (isCustom) {
		const urlPrefix = 'https://oss.meshkit.cn/mesh-panorama/panorama/727222046145570/88/o_1do0dpkssq0t156c691b8c1jl49'
		return {
			view: createRectilinearView(defaultRectilinearViewParams),
			geometry: createCubeGeometry([
				{ tileSize: 256, size: 256, }, // fallbackOnly: true },
				{ tileSize: 512, size: 512 },
				{ tileSize: 512, size: 1024 },
				{ tileSize: 512, size: 2048 },
				{ tileSize: 512, size: 4096 },
				{ tileSize: 512, size: 8192 },
				{ tileSize: 512, size: 16384 },
				{ tileSize: 512, size: 32768 },
				{ tileSize: 512, size: 65536 }
			]),
			source: createMultiresolutionSource(urlPrefix, false)
		}
	} else {
		const urlPrefix = "//www.marzipano.net/media/prague";
		const limiter = Marzipano.RectilinearView.limit.traditional(65536, 100 * Math.PI / 180);
		return {
			view: createRectilinearView(defaultRectilinearViewParams, limiter),
			geometry: createCubeGeometry([
				{ tileSize: 256, size: 256, }, // fallbackOnly: true },
				{ tileSize: 512, size: 512 },
				{ tileSize: 512, size: 1024 },
				{ tileSize: 512, size: 2048 },
				{ tileSize: 512, size: 4096 },
				{ tileSize: 512, size: 8192 },
				{ tileSize: 512, size: 16384 },
				{ tileSize: 512, size: 32768 },
				{ tileSize: 512, size: 65536 }
			]),
			source: createMultiresolutionSource(urlPrefix, false)
		}
	}
}

interface Props {

}

const App: React.FunctionComponent<Props> = (props) => {

	useEffect(() => {
		const sceneOpts = generateSceneOpts()
		MarzipanoManager.getInstance().init({ sceneOpts })
	}, [])

	return <div
		id="pano"
		className={styles.panoContainer}
	>
		{
			props.children || null
		}
	</div>
}

export default App;
