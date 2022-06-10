import React, { useRef, useCallback, Suspense, useState, useEffect } from 'react';
import DynamicImportAntDesign from './DynamicImportAntDesign';
import NormalImportAntDesign from './NormalImportAntDesign';
import LazyImportAntDesign from './LazyImportAntDesign';
const NormalImportAntDesignLazy = React.lazy(() =>
  import(/* webpackChunkName: 'NormalImportAntDesign' */ './NormalImportAntDesign')
);

function renderNormalImportAntDesign() {
	return <Suspense fallback={<div>Loading...</div>}>
		<NormalImportAntDesignLazy title="AntDesign Lazy" />
	</Suspense>
}

const CodeSplittingTest: React.FunctionComponent<{}> = function (props) {
	return (
		<div>
            {/* 使用import()动态引入 */}
            <DynamicImportAntDesign title="AntDesign Dynamic Import" />
            {/* 正常引入 */}
            {/* <NormalImportAntDesign title="AntDesign Normal Import" /> */}
            {/* 使用React.lazy引入 ant design button */}
            <LazyImportAntDesign />
            {/* 使用React.lazy引入 NormalImportAntDesignLazy */}
            {
                renderNormalImportAntDesign()
            }
		</div>
	)
}

export default CodeSplittingTest

