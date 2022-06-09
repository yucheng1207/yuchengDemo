import React from 'react';
import { Enumify } from 'enumify'

export type Mixin<T extends {}, MT extends {}> = {
	[K in keyof T]: T[K] & MT;
};

type EnumifyEnum<T, S extends {} = {}, MT extends {} = {}> = {
	enumValues: any[];
	initEnum: (enumItems: any) => void;
	[Symbol.iterator];
} & Mixin<T, MT> &
	S;

type CreateEnum = <ATTRS>(a: ATTRS) => EnumifyEnum<ATTRS>;


class Color extends Enumify {
	static red = new Color();
	static orange = new Color();
	static yellow = new Color();
	static green = new Color();
	static blue = new Color();
	static purple = new Color();
	static _ = Color.closeEnum(); // TypeScript: Color.closeEnum()
}

enum ColorEnum {
	red,
	orange,
	yellow,
	green = 10,
	blue,
	purple
}

// {
// 	0: "red"
// 	1: "orange"
// 	2: "yellow"
// 	10: "green"
// 	11: "blue"
// 	12: "purple"
// 	blue: 11
// 	green: 10
// 	orange: 1
// 	purple: 12
// 	red: 0
// 	yellow: 2
// }

export const EnumifyTest: React.FC<{}> = () => {
	console.log(Color, ColorEnum, Color.enumKeys, Color.enumValueOf('blue'), Color.enumValues)
	return (<div>
	</div>)
}