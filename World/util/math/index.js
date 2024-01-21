function isNearToPoint(x1, y1, x2, y2, distance = 10) {
	const dist = Math.hypot(x1 - x2, y1 - y2);
	return dist <= distance;
}



let a = {a: 1};
let b = a;
let c = b;

console.log(a); // {a: 1}
console.log(b); // {a: 1}
console.log(c); // {a: 1}

b.a = null;

console.log(a); // {a: null}
console.log(b); // {a: null}
console.log(c); // {a: null}