import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styles from './index.module.scss';
import { getProjectList, getValidProjectSelector, getValidProjectSelectorOptimized } from './selector';
import { useProjectHook, useRenderHook } from './hook';

interface Props {
	projectMapping: any
	getProjectDetailByUUID: any
	projectMappingOptimized: any
	getProjectDetailByUUIDOptimized: any
}

const ReselectTest: React.FunctionComponent<Props> = (props) => {
	const { triggerRender } = useRenderHook()

	const { projectMapping, getProjectDetailByUUID } = useProjectHook()

	useEffect(() => {
		console.log('Hook重构Selector', projectMapping)
	}, [projectMapping, getProjectDetailByUUID])

	useEffect(() => {
		console.log('有问题的用法', props.projectMapping)
	}, [props.projectMapping, props.getProjectDetailByUUID])

	useEffect(() => {
		console.log('重写Selector', props.projectMappingOptimized)
	}, [props.projectMappingOptimized, props.getProjectDetailByUUIDOptimized])


	return (
		<div className={styles.container}>
			<span>TEST</span>
			<button onClick={triggerRender}>手动触发渲染</button>
		</div>
	);
};


const mapStateToProps = (state) => {
	const projects = getProjectList(state);
	const projectMapping = {};
	projects.forEach((project) => {
		const validProject = getValidProjectSelector(
			state,
			project.uuid,
		);
		if (validProject) {
			projectMapping[project.uuid] = validProject
		}
	});
	// 正常不会这么用，这里是为了举例
	const getProjectDetailByUUID = (uuid) => getValidProjectSelector(state, uuid)

	const {
		projectMapping: projectMappingOptimized,
		getProjectDetailByUUID: getProjectDetailByUUIDOptimized
	} = getValidProjectSelectorOptimized(state)

	return {
	  projectMapping,
	  projectMappingOptimized,
	  getProjectDetailByUUID,
	  getProjectDetailByUUIDOptimized
	};
  };

export default connect(mapStateToProps, null)(ReselectTest);
