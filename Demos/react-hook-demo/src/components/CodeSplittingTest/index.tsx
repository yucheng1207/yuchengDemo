import React, { Suspense, useRef, useState, useCallback, useEffect } from 'react';
import DynamicImportAntDesign from './DynamicImportAntDesign';
import NormalImportAntDesign from './NormalImportAntDesign';
import LazyImportAntDesign from './LazyImportAntDesign';
import withDynamicModulesHOC from '../../util/hoc';
const NormalImportAntDesignLazy = React.lazy(() =>
  import(/* webpackChunkName: 'NormalImportAntDesign' */ './NormalImportAntDesign')
);

async function getDynamicModules() {
  const DynamicComponent = (await import(/* webpackChunkName: 'NormalImportAntDesignMoudles' */ './NormalImportAntDesign'))
    .default;
  return {
    DynamicComponent,
  };
}

function NormalImportAntDesignSuspense() {
	return <Suspense fallback={<div>Loading...</div>}>
		<NormalImportAntDesignLazy title="AntDesign Lazy" />
	</Suspense>
}

const CodeSplittingTest: React.FunctionComponent<any> = function (props) {
  useEffect(() => {
    console.log('CodeSplittingTest Loaded', props)
  }, [])
  const DynamicComponent = props.dynamicModules.DynamicComponent
	return (
		<div>
            {/* 使用import()动态引入 */}
            <DynamicImportAntDesign title="AntDesign Dynamic Import" />
            {/* 正常引入 */}
            {/* <NormalImportAntDesign title="AntDesign Normal Import" /> */}
            {/* 使用React.lazy引入 ant design button */}
            <LazyImportAntDesign />
            {/* 使用React.lazy引入 NormalImportAntDesignLazy */}
            <NormalImportAntDesignSuspense />
            <DynamicComponent title="Dynamic Component" />   
		</div>
	)
}

// export default withNormalImportAntDesignHOC(CodeSplittingTest)
export default withDynamicModulesHOC(CodeSplittingTest, getDynamicModules)

