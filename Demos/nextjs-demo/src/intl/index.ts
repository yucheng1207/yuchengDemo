/* eslint-disable import/no-anonymous-default-export */
import zh_CN from "./zh_CN";
import en_US from './en_US ';
import { ILocalization } from './interface'

// 与next.cinfig.js中的`i18n.locales`一致
export enum Locales {
	en_US = 'en-US',
	zh_CN = 'zh-CN'
}

export function getLocales(lang: Locales): ILocalization {
	switch (lang) {
		case ('en-US'):
			return en_US
		case ('zh-CN'):
			return zh_CN
		default:
			return en_US
	}
}

export default {
	"en-US": en_US,
	"zh-CN": zh_CN
}