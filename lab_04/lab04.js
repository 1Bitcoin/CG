const   container = document.getElementById('canvas');

let     clr = "#00FF80";


function circLib(x1, y1, r) {
    ellipse(x1, y1, r * 2, r * 2);
}

function circCan(x1, y1, r) {
    let y = function (x) {
        return Math.sqrt(r ** 2 - x ** 2);
    };


    for (let x = 0; x <= Math.ceil(r * sqrt(2) / 2); x++) {
        let yx = y(x);

        point(Math.round(x+x1), Math.round(yx+y1));
        point(Math.round(-x+x1), Math.round(yx+y1));

        point(Math.round(x+x1), Math.round(-yx+y1));
        point(Math.round(-x+x1), Math.round(-yx+y1));

        point(Math.round(yx+x1), Math.round(x+y1));
        point(Math.round(-yx+x1), Math.round(x+y1));

        point(Math.round(yx+x1), Math.round(-x+y1));
        point(Math.round(-yx+x1), Math.round(-x+y1));
    }
}

function circPar(x1, y1, r) {
    let x = function (t) {
        return r * Math.cos(t);
    },
        y = function (t) {
        return r * Math.sin(t);
    };

    for (let t = 0; t <= PI / 4; t += 1 / r) {
        let xt = x(t),
            yt = y(t);

        point(Math.round(xt+x1), Math.round(yt+y1));
        point(Math.round(-xt+x1), Math.round(yt+y1));

        point(Math.round(xt+x1), Math.round(-yt+y1));
        point(Math.round(-xt+x1), Math.round(-yt+y1));

        point(Math.round(yt+x1), Math.round(xt+y1));
        point(Math.round(-yt+x1), Math.round(xt+y1));

        point(Math.round(yt+x1), Math.round(-xt+y1));
        point(Math.round(-yt+x1), Math.round(-xt+y1));
    }
}

function circBrz(x1, y1, r) { // вычисление производим для 1 четверти, затем отражаем
    let x = 0, 				  // алгоритм начинает работу в этих точках, идем по часовой стрелке
        y = r,
        d =  2 * (1 - r), 	  //(x + 1) ** 2 + (y - 1) ** 2 - r ** 2,
       					  	  // Ошибка, aнализ знака которой позволит выбрать нужный пиксел.

        yf = 0,
        d1, d2;

	point(x1, y1 + r);
	point(x1, y1 - r);
	point(x1 + r, y1);
	point(x1 - r, y1);

    while (y > yf) {
        if (d < 0) { 			// диагональная точка (X[i]+1, Y[i]-1) лежит внутри окружности
        						// раст. до гор. пикселя       раст. до диаг. пикселя
        						// |(xi+1)^2 + yi^2 - r^2| - |(xi+1)^2 + (yi-1)^2 - r^2|
            d1 = 2 * (d + y) - 1;
            if (d1 < 0) { 		// горизонтальный шаг
                x = x + 1;
                d = d + 2 * x + 1;
            } else { 			// диагональный шаг
                x = x + 1;
                y = y - 1;
                d = d + 2 * (x - y + 1);
            }
        } else if (d === 0) {	// диагональная точка лежит на окружности
            x = x + 1;
            y = y - 1;
            d = d + 2 * (x - y + 1);
        } else if (d > 0) {		// диагональная точка вне окружности
        						// раст. до диаг. пикселя          раст. до верт. пикселя
        						// |(xi+1)^2 + (yi-1)^2 - r^2| - |xi^2 + (yi-1)^2 - r^2|
            d2 = 2 * (d - x) - 1;
            if (d2 < 0) {		// диагональный шаг
                x = x + 1;
                y = y - 1;
                d = d + 2 * (x - y + 1);
            } else {			// вертикальный шаг
                y = y - 1;
                d = d - 2 * y + 1;
            }
        }
        point(x + x1, y + y1); // I - я четверть
        point(-x + x1, y + y1); // II - я четверть
        point(-x + x1, -y + y1); // III - я четверть
        point(x + x1, -y + y1); // IV - я четверть
    }
}

function circMPt(x1, y1, r) {
	let x = 0,
		y = r,

		f = 1 - r, // 5/4 - r, 1/4 отбрасываем, т.к она не 
				   //влияет на знак при работе в целых числах

				   // incrE = 2*x+3; incrSE = 2*(x-y)+5
		incrE = 3, // E - горизонтальная точка
		incrSE = 5 - 2 * r; // SE - диагональная точка

	point(x1, y1 + r);
	point(x1, y1 - r);
	point(x1 + r, y1);
	point(x1 - r, y1);

	while (x <= y) {

		if (f > 0) {
			y = y - 1;
			f = f + incrSE;
			incrSE = incrSE + 4;

		} else {
			f = f + incrE;
			incrSE = incrSE + 2;
		}
		incrE =incrE + 2;
		x = x + 1;

		point(x1 + x, y1 + y); 
		point(x1 - x, y1 + y);
		point(x1 + x, y1 - y);
		point(x1 - x, y1 - y);	// отражение в другие четверти
		point(x1 + y, y1 + x);
		point(x1 - y, y1 + x);
		point(x1 + y, y1 - x);
		point(x1 - y, y1 - x);
	}
}


function drawCircle(cent, rd) {
    if (!checkInput(/-?\d{1,10}\.?\d{0,12} -?\d{1,10}\.?\d{0,12}/, cent) || !checkInput(/\d+/, rd)) {return;}

    let method = '1';
    document.getElementsByName('mtd').forEach(e => {if (e.checked) method = e.value});
    clr = document.getElementById('color').value;
    clr = clr.substring(1).split('').reduce((res, e, i) => {if (i % 2 === 0) {res.push(e)} else {res[res.length-1]+=e} return res;}, []).map(e => parseInt(e, 16));

    stroke(...clr);

    if (rd === "0")
    {point(...(cent.split(' ').map((e, i) => i ? scalex(parseFloat(e)) : scaley(parseFloat(e))))); return;}

    switch (method) {
        case '1': circLib(...(cent+' '+rd).split(' ').map(e => parseFloat(e))); break;
        case '2': circCan(...(cent+' '+rd).split(' ').map(e => parseFloat(e))); break;
        case '3': circPar(...(cent+' '+rd).split(' ').map(e => parseFloat(e))); break;
        case '4': circBrz(...(cent+' '+rd).split(' ').map(e => parseFloat(e))); break;
        case '5': circMPt(...(cent+' '+rd).split(' ').map(e => parseFloat(e))); break;
    }
}


function drawTestCircles(rd0, drd, n) {
    if (!checkInput(/\d+/, rd0) || !checkInput(/\d+/, drd) || !checkInput(/\d+/, n)) {return;}

    for (let i = 0; i < parseInt(n); i++) {
        drawCircle('450 450', (parseInt(rd0)+parseInt(drd)*i).toString());
    }
}


function ellpLib(x1, y1, a, b) {
    ellipse(x1, y1, a * 2, b * 2);
}


function ellpCan(x1, y1, a, b) {
    let y = function (x) {
        return Math.sqrt(a ** 2 * b ** 2 - b ** 2 * x ** 2) / a;
    };

    let x = function (y) {
        return Math.sqrt(a ** 2 * b ** 2 - a ** 2 * y ** 2) / b;
    };

    let xf = a ** 2 / Math.sqrt(a ** 2 + b ** 2),
        yf = b ** 2 / Math.sqrt(a ** 2 + b ** 2);


    for (let x = 0; x <= xf; x++) {
        let yx = y(x);

        point(Math.round(x+x1), Math.round(yx+y1));
        point(Math.round(-x+x1), Math.round(yx+y1));
        point(Math.round(x+x1), Math.round(-yx+y1));
        point(Math.round(-x+x1), Math.round(-yx+y1));
    }
    for (let y = yf; y >= 0; y--) {
        let xy = x(y);

        point(Math.round(xy+x1), Math.round(y+y1));
        point(Math.round(xy+x1), Math.round(-y+y1));
        point(Math.round(-xy+x1), Math.round(y+y1));
        point(Math.round(-xy+x1), Math.round(-y+y1));
    }
}

function ellpPar(x1, y1, a, b) {
    let x = function (t) {
            return a * Math.cos(t);
        },

        y = function (t) {
            return b * Math.sin(t);
        };

    for (let t = 0; t <= PI / 2; t += 1 / Math.max(a, b)) {
        let xt = x(t),
            yt = y(t);

        point(Math.round(xt + x1), Math.round(yt + y1));
        point(Math.round(-xt + x1), Math.round(yt + y1));
        point(Math.round(xt + x1), Math.round(-yt + y1));
        point(Math.round(-xt + x1), Math.round(-yt + y1));
    }
}

function ellpBrz(x1, y1, a, b) {
    let x = 0,
        y = b,

        a2 = a ** 2,
        b2 = b ** 2,

        d = b2 * (x + 1) ** 2 + a2 * (y - 1) ** 2 - a2 * b2, // у-ре эллипса

        yf = 0,
        d1, d2;

    point(x1, y + y1);
    point(x1, -y + y1);

    while (y > yf) {
        if (d < 0) {								// пиксель лежит в эллипсе
            d1 = 2 * (d + y * a2) - a2;
            if (d1 < 0) {							// горизонтальный шаг
                x = x + 1;
                d = d + 2 * x * b2 + b2;
            } else {								// диагональный шаг
                x = x + 1;
                y = y - 1;
                d = d + 2 * (b2 * x - a2 * y) + b2 + a2;
            }
        } else if (d === 0) { 						// пиксель лежит на эллипсе
            x = x + 1; 		  						// диагональный шаг
            y = y - 1;
            d = d + 2 * (b2 * x - a2 * y) + b2 + a2;
        } else if (d > 0) { 						//  пиксель лежит вне эллипса
            d2 = 2 * (d - x * b2) - b2;
            if (d2 < 0) {							// вертикальный шаг
                x = x + 1;
                y = y - 1;
                d = d + 2 * (b2 * x - a2 * y) + b2 + a2;
            } else {
                y = y - 1;							// диагональный шаг
                d = d - 2 * a2 * y + a2;
            }
        }
        point(x + x1, y + y1);
        point(-x + x1, y + y1);
        point(x + x1, -y + y1);
        point(-x + x1, -y + y1);
    }
}

/*function ellpMPt(x1, y1, a, b) {
	let x = 0,
		y = b,

		a2 = a * a,
		b2 = b * b,
				   				  // b^2*x^2 + a^2*y^2 - a^2*b^2 - ур-е эллипса
		f = b2 - a2 * b + a2 / 4, // найдем первоначальное значение для точки: f(1, b - 1/2)

				   		// incrE = 2*x+3; incrSE = 2*(x-y)+5
		incrE = 3 * b2, // E - горизонтальная точка
		incrSE = 3 * b2 - 2 * a2 * b + 2 * a2; // SE - диагональная точка

	// Производная при y'= -1 , является границей для оптимального рисования
	// y'= -b^2/a^2 * x/y

	// |f'(x)| > 1 => идём по y
	// |f'(x)| < 1 => по x

	// b^2 * x < a^2 * y (|f'(x)| < 1) 

	while (b2 * x < a2 * y) {

		point(x1 + x, y1 + y); 
		point(x1 + x, y1 - y);
		point(x1 - x, y1 + y);
		point(x1 - x, y1 - y);	

		// M вне эллипса, ближе диагональный пиксель
		if (f >= 0) { 			
			y = y - 1;
			f -= 2 * a2 * y;
		} 

		x = x + 1;
		f += 2 * b2 * x + b2;
	}

	t += 3 / 4. * (a2 - b2) - (b2 * x + a2 * y);

	while (y > 0)
	{
		point(x1 + y, y1 + x);
		point(x1 + x, y1 - y);
		point(x1 - x, y1 + y);
		point(x1 - x, y1 - y);

		// M внутри эллипса, ближе диагональный пиксель
		if (f <= 0)
		{
			x = x + 1;;
			f += 2 * b2 * x;
		}

		y = y - 1;
		f += -2 * a2 * y + a2;
	}

	point(x1 + x, y1 + y);
	point(x1 + x, y1 - y);
	point(x1 - x, y1 + y);
	point(x1 - x, y1 - y);
}*/

function ellpMPt(x1, y1, a, b) {
    let x = 0,
        y = b,

        a2 = a ** 2, // a^2
        b2 = b ** 2, // b^2

        a2b = a2 * 2, // 2*a^2
        b2b = b2 * 2, // 2*b^2

        f = b2 - a2 * b + a2 / 4; // найдем первоначальное значение для точки: f(1, b - 1/2)

    point(x + x1, y + y1);
    point(-x + x1, y + y1);
    point(x + x1, -y + y1);
    point(-x + x1, -y + y1);

    // Производная при y'= -1 , является границей для оптимального рисования
	// y'= -b^2/a^2 * x/y

	// |f'(x)| > 1 => идём по y
	// |f'(x)| < 1 => по x

	// b^2 * x < a^2 * y (|f'(x)| < 1) 

    while (b2 * x < a2 * y)  {
        if (f < 0) {			// Средняя точка внутри эллипса, ближе верхний пиксел, горизонтальный шаг
            x = x + 1;	
            f = f + b2b * x + b2;
        } else {				// Средняя точка вне эллипса, ближе диагональный пиксел, диагональный шаг
            x = x + 1;
            y = y - 1;
            f = f + b2b * x + b2 - a2b * y;
        }
        point(x + x1, y + y1);
        point(-x + x1, y + y1);
        point(x + x1, -y + y1);
        point(-x + x1, -y + y1);
    }
    f = f + 3 / 4 * (a2 - b2) - a2 * y - b2 * x; // корректирующее значение, для перехода от 1-го участка 
    											 //(|f'(x)| < 1) ко 2-му (|f'(x)| > 1)
    
    while (y >= 0) {
        if (f <= 0) {
            x = x + 1;
            y = y - 1;
            f = f - a2b * y + a2 + b2b * x;
        } else {
            y = y - 1;
            f = f - a2b * y + a2;
        }
        point(x + x1, y + y1);
        point(-x + x1, y + y1);
        point(x + x1, -y + y1);
        point(-x + x1, -y + y1);
    }
}


function drawEllipse(cent, wh) {
    if (!checkInput(/-?\d{1,10}\.?\d{0,12} -?\d{1,10}\.?\d{0,12}/, cent) || !checkInput(/\d{1,10}\.?\d{0,15} \d{1,10}\.?\d{0,15}/, wh)) {return;}

    let method = '1';
    document.getElementsByName('mtd').forEach(e => {if (e.checked) method = e.value});
    clr = document.getElementById('color').value;
    clr = clr.substring(1).split('').reduce((res, e, i) => {if (i % 2 === 0) {res.push(e)} else {res[res.length-1]+=e} return res;}, []).map(e => parseInt(e, 16));

    stroke(...clr);

    if (wh === "0 0")
    {point(...(cent.split(' ').map((e, i) => i ? scalex(parseFloat(e)) : scaley(parseFloat(e))))); return;}

    switch (method) {
        case '1': ellpLib(...(cent+' '+wh).split(' ').map(e => parseFloat(e))); break;
        case '2': ellpCan(...(cent+' '+wh).split(' ').map(e => parseFloat(e))); break;
        case '3': ellpPar(...(cent+' '+wh).split(' ').map(e => parseFloat(e))); break;
        case '4': ellpBrz(...(cent+' '+wh).split(' ').map(e => parseFloat(e))); break;
        case '5': ellpMPt(...(cent+' '+wh).split(' ').map(e => parseFloat(e))); break;
    }
}

function drawTestEllipses(wh0, dwh, n) {
    if (!checkInput(/\d{1,10}\.?\d{0,12} \d{1,10}\.?\d{0,12}/, wh0) || !checkInput(/\d+/, dwh) || !checkInput(/\d+/, n)) {return;}
    let ka = wh0.split(' ').map(e => parseFloat(e)),
        k = ka[0]/ka[1];

    for (let i = 0; i < parseInt(n); i++) {
        console.log(wh0.split(' ').map((e, j) => (parseFloat(e)+parseFloat(dwh)*i/(k**j)).toString()).join(' '));
        drawEllipse('450 450', wh0.split(' ').map((e, j) => (parseFloat(e)+parseFloat(dwh)*i/(k**j)).toString()).join(' '));
    }
}


function setup() {
    let canvas = createCanvas(container.clientWidth, container.clientWidth);

    canvas.parent('canvas');
    canvas.class("border no-gutters");
    canvas.id("canvasPage");

    noLoop();

    window.onresize = resize.bind(this);
}

function draw() {
    noStroke();
    fill(0, 0, 0);
    rect(0, 0, width, height);
    noFill();
}


function resize() {
    canvas.style.width = container.clientWidth + "px";
    canvas.style.height = container.clientWidth + "px";
}

function scalex(x) {
    return  x + Math.round(width / 2);
}

function scaley(y) {
    return  Math.round(height / 2) - y;
}

function checkInput(reg, str) {
    if (str.match(reg) != str) {
        alert("Incorrect input!");
        return false;
    }
    return true;
}
