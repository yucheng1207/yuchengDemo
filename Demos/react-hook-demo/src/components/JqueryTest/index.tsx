import React, { useRef, useCallback, Suspense, useState, useEffect } from 'react';
import { findDOMNode } from 'react-dom';
// import $ from 'jquery';

const JqueryTest: React.FunctionComponent<{}> = function (props) {
    const containerRef = useRef<any>(null)
    const test = useCallback(() => {
        import('jquery').then((result) => {
            const $ = result.default
            const node = findDOMNode(containerRef.current);
            console.log('containerRef:', containerRef, 'node:', node, '$(node):', $(node))
            $(node).addClass('jqurey_add_class') 
        })
    }, [])
    useEffect(() => {
        test()
    }, [])
	return (
		<div>
            <div ref={containerRef}>123</div>
		</div>
	)
}

export default JqueryTest

