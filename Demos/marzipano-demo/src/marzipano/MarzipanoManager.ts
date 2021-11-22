import { MarzipanoViewer, MarzipanoViewerOpts, IMarzipano, MarzipanoViewerCreateSceneOpts, MarzipanoScene, MarzipanoSceneCreateLayerOpts, MarzipanoLayer, MarzipanoHotspotContainer, MarzipanoRectilinearViewCoords, MarzipanoFlatViewCoords, IPerspective, MarzipanoHotspot } from './marzipanoTypes';
import { viewerExist, createRectilinearView, sceneExist, layerExist, hotspotContainerExist } from './utils';
const Marzipano: IMarzipano = require('marzipano');

export default class MarzipanoManager {
	private static _marzipanoManager: MarzipanoManager

	// constructor() {
	// 	//
	// }

	private _viewer: MarzipanoViewer | null;
	private _scene: MarzipanoScene | null;
	private _layer: MarzipanoLayer | null;
	private _hotspotContainer: MarzipanoHotspotContainer | null;
	public _hotspot: MarzipanoHotspot | null;

	public static getInstance() {
		if (!this._marzipanoManager) {
			this._marzipanoManager = new MarzipanoManager()
		}

		return this._marzipanoManager
	}

	public init(params: { viewerOpts?: MarzipanoViewerOpts, sceneOpts?: MarzipanoViewerCreateSceneOpts }) {
		this.createViewer(params.viewerOpts)
		this.createScene(params.sceneOpts)
	}

	/**
	 * 创建 Viewer
	 */
	private createViewer(opts: MarzipanoViewerOpts = {
		controls: {
			mouseViewMode: 'drag'
		},
	}) {
		try {
			this._viewer && this.destoryViewer()
			const panoElement = document.getElementById('pano')
			this._viewer = new Marzipano.Viewer(panoElement, opts)
		} catch (error) {
			console.error('Create marzipaon viewer failed:', error)
		}
	}

	/**
	 * 销毁 Viewer
	 */
	private destoryViewer() {
		if (this._viewer) {
			viewerExist(this._viewer) && this._viewer.destroy()
			this._viewer = null;
			return true
		}
		else {
			console.warn('No viewer can be destroyed')
			return false
		}
	}

	/**
	 * 创建 Viewer
	 */
	private createScene(opts?: MarzipanoViewerCreateSceneOpts, id?: number, switchTo = true) {
		try {
			// Viewer check
			if (!this._viewer) {
				throw new Error('No viewer to create scene')
			}

			this._scene && this.destroyScene()

			if (opts && opts.view && opts.source && opts.geometry) {
				const { source, view, geometry } = opts
				this._scene = this._viewer.createScene({ ...opts, source, view, geometry })
				this._scene.id = id || Date.now()
			}
			else {
				this._scene = this._viewer.createEmptyScene({
					view: opts && opts.view ? opts.view : createRectilinearView()
				})
			}
			switchTo && this.switchToScene()
		} catch (error) {
			console.error('Create marzipaon scene failed:', error)
		}
	}

	/**
	 * 切换到scene
	 */
	private switchToScene() {
		this._scene && this._scene.switchTo();
	}

	/**
	 * 销毁scene
	 */
	private destroyScene() {
		if (this._viewer && this._scene) {
			viewerExist(this._viewer) && sceneExist(this._scene) && this._viewer.destroyScene(this._scene)
			this._scene = null
		}
	}

	/**
	 * 创建 Layer
	 */
	private async createLayer(opts: MarzipanoSceneCreateLayerOpts) {
		try {
			// Scene check
			if (!this._scene) {
				throw new Error('No scene to create layer')
			}
			this._layer && this.destroyLayer()
			this._layer = this._scene.createLayer(opts)
		} catch (error) {
			console.error('Create marzipaon layer failed:', error)
		}
	}

	/**
	 * 销毁 Layer
	 */
	private destroyLayer() {
		if (this._scene && this._layer) {
			sceneExist(this._scene) && layerExist(this._layer) && this._scene.destroyLayer(this._layer)
			this._layer = null
		}
	}

	/**
	 * 创建 Hotspot
	 */
	private async createHotspot(hotspotElement: React.ReactInstance, opts: {
		coords: MarzipanoRectilinearViewCoords | MarzipanoFlatViewCoords;
		perspective?: IPerspective;
		zLevel?: number;
		visible?: boolean;
	}) {
		try {
			// Scene check
			if (!this._scene) {
				throw new Error('No scene to create hotspot')
			}

			// HotspotContainer check
			this._hotspotContainer = this._scene.hotspotContainer()
			if (!this._hotspotContainer) {
				throw new Error('HotspotContainer not found')
			}

			this._hotspot && this.destroyHotspot()

			const { coords, perspective } = opts
			const hotpotPpts = perspective && { perspective }
			this._hotspot = this._hotspotContainer.createHotspot(hotspotElement, coords, hotpotPpts)
		} catch (error) {
			console.error('Create marzipaon hotspot failed:', error)
		}

	}

	/**
	 * 销毁 Hotspot
	 */
	private destroyHotspot() {
		if (this._scene && this._hotspotContainer && this._hotspot) {
			sceneExist(this._scene) && hotspotContainerExist(this._hotspotContainer) && this._hotspotContainer.destroyHotspot(this._hotspot)
			this._hotspot = null
		}
	}
}