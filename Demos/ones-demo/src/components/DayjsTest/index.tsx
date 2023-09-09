import React, { useCallback, useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'; // import utc plugin
import timezone from 'dayjs/plugin/timezone'; // import timezone plugin
import localizedFormatPlugin from 'dayjs/plugin/localizedFormat';
// import 'dayjs/locale/ja';
// dayjs.locale('ja'); 
dayjs.extend(utc); // apply plugin to Day.js object
dayjs.extend(timezone); // apply plugin to Day.js object
dayjs.extend(localizedFormatPlugin);

dayjs.tz.setDefault("America/New_York");

const DayjsTest: React.FunctionComponent<{}> = function (props) {
    function useRefFn(fn) {
        const ref = useRef(fn);
      
        useEffect(() => {
          ref.current = fn;
        }, [fn]);
      
        return useCallback((...arg) => ref.current(...arg), []);
    }
    useEffect(() => {
        dayjs.tz("2014-06-01 12:00", "America/New_York")
        dayjs("2014-06-01 12:00").tz("America/New_York")
        
        dayjs.tz.guess()
        
        dayjs.tz.setDefault("America/New_York")
        for(let i= 0; i< 100; i++) {
            // dayjs.tz("2014-06-01 12:00", "America/New_York")
            console.time('dayjs.tz()')
            dayjs.tz("2014-06-01 12:00")
            console.timeEnd('dayjs.tz()')
            console.time('dayjs().tz()')
            dayjs("2014-06-01 12:00").tz("America/New_York")
            console.timeEnd('dayjs().tz()')
            console.time('dayjs().tz()2')
            dayjs("2014-06-01 12:00").tz().utc()
            console.timeEnd('dayjs().tz()2')
            console.time('dayjs')
            dayjs("2014-06-01 12:00")
            console.timeEnd('dayjs')


            console.time('item3')
            dayjs("2014-06-01 12:00")
            console.timeEnd('item3')
            console.time('item')
            dayjs("2014-06-01 12:00").tz("America/New_York")
            console.timeEnd('item')
            console.time('item5')
            dayjs.tz("2014-06-01 12:00", "America/New_York")
            console.timeEnd('item5')
        }

        console.time('start')
        new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
        console.timeEnd('start')

        console.time('start1')
        new Date()
        console.timeEnd('start1')

    }, [])

    const [a, setA] = useState<number>(1)

    const onClick = useCallback(() => {
        console.log('zyc', a)
    }, [a])

    const setAState = useCallback(() => {
        setA(a+1)
    }, [a])

    const getAState = useCallback(() => {
        console.log('current a', a)
    }, [a])

    const methoda = useRefFn(getAState)

    useEffect(() => {
        console.log('methoda')
    }, [methoda])

	return (
		<div style={{fontFamily: 'PingFang SC,"微软雅黑",Arial'}}>
			dayjs test
            <div onClick={onClick}>click</div>
            <div onClick={setAState}>setState</div>
            <div onClick={getAState}>getState</div>
		</div>
	)
}

export default DayjsTest

