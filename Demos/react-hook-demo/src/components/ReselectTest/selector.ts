import { createSelector } from "reselect"

export const getWhiteList = createSelector([(state) => state.application.projectWhiteList], projectWhiteList => projectWhiteList)
export const getProjectList = createSelector([(state) => state.application.projectList], projectList => projectList)
export const getProjectUUID = createSelector([(_, projectUUID) => projectUUID], projectUUID => projectUUID)
export const getProjectDetail = createSelector([getProjectList, getProjectUUID], (projects, projectUUID) => {
	return projects.find(item => item.uuid === projectUUID)
})

export const filterProject = (project, projectWhiteList) => {
	const isValid = projectWhiteList.includes(project.uuid) && project.show
	return isValid ? project : null
}

export const getValidProjectSelector = createSelector([
	getProjectDetail,
	getWhiteList,
], (project, projectWhiteList) => {
	return filterProject(project, projectWhiteList)
}) as any


export const getValidProjectSelectorOptimized = createSelector([
	getProjectList,
	getWhiteList,
], (projects, projectWhiteList) => {
	const projectMapping = {};
	projects.forEach((project) => {
		const validProject = filterProject(project, projectWhiteList);
		if (validProject) {
			projectMapping[project.uuid] = validProject
		}
	});
	const getProjectDetailByUUID = (uuid) => {
		const project = projects.find(item => item.uuid === uuid)
		return filterProject(project, projectWhiteList)
	}
	return {
	  projectMapping,
	  getProjectDetailByUUID,
	};
}) as any
