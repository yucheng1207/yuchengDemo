import React, { Suspense, useRef, useCallback, useState, useEffect } from 'react';
import('antd/lib/button/style/css')
const AntDesignButton = React.lazy(() =>
  import('antd/lib/button')
);

function renderAntDesignButton() {
	return <Suspense fallback={<div>Loading...</div>}>
		<AntDesignButton>Lazy Button</AntDesignButton>
	</Suspense>
}

const LazyImportAntDesign: React.FunctionComponent<{title?: string}> = function (props) {

	return (
        <div style={{border: 'solid 1px black', margin: '24px', padding: '8px'}}>
            {
                renderAntDesignButton()
            }
        </div>
	)
}

export default LazyImportAntDesign
