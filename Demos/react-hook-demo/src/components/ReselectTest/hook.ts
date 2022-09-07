import React, { useCallback, useMemo } from "react"
import { useSelector } from "react-redux"
import { AppState, useAppDispatch } from "../../store"
import { ITestData, SetTestDataAction } from "../../store/application/slice"
import { filterProject, getProjectList, getWhiteList } from "./selector"

export const useRenderHook = () => {
    const dispatch = useAppDispatch()

	/**
	 * 触发下state更新，模拟页面更新
	 */
	 const testData = useSelector<AppState, ITestData>(state => state.application.testData)
	const setTestData = useCallback(() => {
		dispatch(SetTestDataAction({...testData,}))
	}, [dispatch, testData])

	return {
        triggerRender: setTestData
    }
}

export const useProjectHook = () => {
	const projects = useSelector(getProjectList)
	const projectWhiteList = useSelector(getWhiteList)

    // 替换之前的 getProjectDetail selector
    const getProjectDetail = useCallback((projectUUID) => {
        return projects.find(item => item.uuid === projectUUID)
    }, [projects])

    // 替换之前的 getValidProjectSelector
    const getValidProject = useCallback((projectUUID) => {
        const project = getProjectDetail(projectUUID)
        return filterProject(project, projectWhiteList)
    }, [projectWhiteList, getProjectDetail])

	const projectMapping = useMemo(() => {
		const mapping = {}
		projects.forEach((project) => {
		
			const validProject = getValidProject(project.uuid);
			if (validProject) {
				mapping[project.uuid] = validProject
			}
		});
		return mapping
	}, [projects, getValidProject])

	return {
		projectMapping,
        getProjectDetailByUUID: getValidProject
	}
}