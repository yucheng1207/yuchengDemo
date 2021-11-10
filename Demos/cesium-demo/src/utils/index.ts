/**
 * debounce for fn
 * @param fn target function
 * @param wait wait millisecond
 */
// tslint:disable-next-line: ban-types
export function debounce(fn: Function, wait: number): (...args: any[]) => void {
	let timer: any = 0
	return function (...args: any[]) {
		if (timer) {
			clearTimeout(timer)
		}

		timer = setTimeout(() => {
			fn.apply(this, args)
		}, wait)
	}
}
