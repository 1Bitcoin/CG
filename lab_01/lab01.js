let     rwidth = 10,
        rheight = 10,
        container = document.getElementById('canvas');

class Set {
    constructor(id) {
        this.set = [];
        this.id = id;
    }

    addPoint(str) {
        if (!str) return;
        if (this.set.map(e => e.join(" ")).includes(str)) {alert("Point already exists!"); return;}

        this.set.push(str.split(' '));
        let row = document.createElement("tr");

        str = this.set.length + ' ' + str;
        row.appendChild(document.createElement("td"));
        row.appendChild(document.createElement("td"));
        row.appendChild(document.createElement("td"));
        row.childNodes.forEach((e, i) => e.textContent = str.split(' ')[i]);
        document.getElementById('set' + this.id).appendChild(row);
        document.getElementById('ab' + this.id).value = '';
        document.getElementById('ab' + this.id).focus();
    }

    deletePoint(i) {
        if (!checkInput(/\d+/, i)) return;
        if (int(i) > this.set.length || int(i) <= 0) {alert("Incorrect index!"); return;}

        if (int(i) !== this.set.length) {
            this.set.splice(int(i) - 1, 1);
        } else {
            this.set.pop();
        }
        document.getElementById('tab1').deleteRow(int(i));
        document.getElementById('set1').childNodes.forEach(e => e.firstChild.textContent = (parseInt(e.firstChild.textContent) > int(i)) ? e.firstChild.textContent - 1 : e.firstChild.textContent);
        document.getElementById('db').value = '';
        reduceSize();
    }

    deleteAllpoits(){
        let len = this.set.length;
        for (let i = 0; i < len; i++){
            if (int(1) !== this.set.length) {
                this.set.splice(int(1) - 1, 1);
            } else {
                this.set.pop();
            }
            document.getElementById('tab1').deleteRow(int(1));
            document.getElementById('set1').childNodes.forEach(e => e.firstChild.textContent = (parseInt(e.firstChild.textContent) > int(1)) ? e.firstChild.textContent - 1 : e.firstChild.textContent);
            document.getElementById('db').value = '';
            reduceSize();
        }
    }

    modifyPoint(str, i) {
        if (!str || !checkInput(/\d+/, i)) return;
        if (int(i) > this.set.length || int(i) <= 0) {alert("Incorrect index!"); return;}

        this.set[i - 1] = str.split(' ');
        str = i + ' ' + str;
        document.getElementById('set1').childNodes.item(i - 1).childNodes.forEach((e, j) => e.textContent = str.split(' ')[j]);
        document.getElementById('mbc').value = '';
        document.getElementById('mbn').value = '';
    }
}


class Triangle {
    constructor() {
        this.a = [0, 0];
        this.b = [0, 2];
        this.c = [2, 0];
        this.s1 = Infinity;
        this.s2 = -1;
        this.s3 = 0;
        document.getElementById('tr1').placeholder = "A:(" + this.a.join(" ") + ")";
        document.getElementById('tr2').placeholder = "B:(" + this.b.join(" ") + ")";
        document.getElementById('tr3').placeholder = "C:(" + this.c.join(" ") + ")";
    }

    setTriangle(a, b, c) {
        if (!a || !b || !c) return;

        let na = a.split(' '),
            nb = b.split(' '),
            nc = c.split(' '),
            s1 = (na[1] - nb[1]) / (na[0] - nb[0]), //коэ-фы наклона сторон треугольника
            s2 = (nb[1] - nc[1]) / (nb[0] - nc[0]),
            s3 = (nc[1] - na[1]) / (nc[0] - na[0]);

        if (s1 === s2 || s1 === s3 || s2 === s3 || (isNaN(s1) && isNaN(s2) && isNaN(s3))) {alert("Triangle is incorrect!"); return;}

        this.a = na; this.b = nb; this.c = nc;
        this.s1 = s1; this.s2 = s2; this.s3 = s3;
        document.getElementById('tr1').value = this.a.join(" ");
        document.getElementById('tr2').value = this.b.join(" ");
        document.getElementById('tr3').value = this.c.join(" ");

        reduceSize();
    }
}


let set1 = new Set(1),
    triangle = new Triangle();


function setup() {
    let canvas = createCanvas(container.clientWidth, container.clientWidth);

    canvas.parent('canvas');
    canvas.class("border no-gutters");
    canvas.id("canvasPage");

    textSize(14);

    window.onresize = resize.bind(this);
}

function draw() {
    noStroke();
    fill(255, 255, 255);
    rect(0, 0, scalex(rwidth), scaley(rheight));
    noFill();
    stroke(0, 0, 0);
    //рисуем оси координат
    line(x(-rwidth/2), y(0), x(rwidth/2), y(0));
    line(x(0), y(rheight/2), x(0), y(-rheight/2));

    stroke(0, 100, 200); fill(255, 0, 0);

    //рисуем точки и их координаты
    set1.set.forEach((e, i) => {ellipse(x(parseFloat(e[0])), y(parseFloat(e[1])), 3, 3); 
        text(i + 1, x(parseFloat(e[0]))+2, y(parseFloat(e[1]))-2);
        text('[ ', x(parseFloat(e[0]))-45, y(parseFloat(e[1]))+15);
        text(parseFloat(e[0]), x(parseFloat(e[0]))-40, y(parseFloat(e[1]))+15);
        text('      ; ', x(parseFloat(e[0]))-42, y(parseFloat(e[1]))+15);
        text(parseFloat(e[1]), x(parseFloat(e[0]))-10, y(parseFloat(e[1]))+15);
        text(']', x(parseFloat(e[0]))+8, y(parseFloat(e[1]))+15);});

    noFill();
    //наибольший коэ-ф наклон одной из сторон треугольника
    let most = (Math.abs(triangle.s1) >= Math.abs(triangle.s2)) ?
        ((Math.abs(triangle.s1) >= Math.abs(triangle.s3)) ? Math.abs(triangle.s1) : Math.abs(triangle.s3)) :
        ((Math.abs(triangle.s2) >= Math.abs(triangle.s3)) ? Math.abs(triangle.s2) : Math.abs(triangle.s3));
    var tryCoordsellipse = [0, 0, 0];
    let flag = 0;
    for (let i = 0; i < set1.set.length; i++) {
        for (let j = i + 1; j < set1.set.length; j++) {
            for (let k = j + 1; k < set1.set.length; k++) {
                let tri = checkTriangle(set1.set[i], set1.set[j], set1.set[k]);
                if (tri[0] || tri[1] || tri[2]) {

                    if (!flag && isFinite(tri[4])){
                        tryCoordsellipse = [tri[3][0], tri[3][1], tri[4], tri[0], tri[1], tri[2]];
                        flag = 1;
                    }
                    if (Math.abs(triangle.s1) === most && tri[0] || Math.abs(triangle.s2) === most && tri[1] || Math.abs(triangle.s3) === most && tri[2]) {
                        if (isFinite(tri[4]) && isFinite(tri[3][0]) && isFinite(tri[3][1])){
                        tryCoordsellipse = [tri[3][0], tri[3][1], tri[4], tri[0], tri[1], tri[2]];
                        }
                    } 
                }
            }
        }
    }
    console.log(x(tryCoordsellipse[0]), y(tryCoordsellipse[1]), tryCoordsellipse[2]);
    console.log(triangle.s1);
    console.log(triangle.s2);
    console.log(triangle.s3);

    stroke(0, 200, 400);
    //рисуем треугольник
    line(x(parseFloat(triangle.a[0])), y(parseFloat(triangle.a[1])), x(parseFloat(triangle.b[0])), y(parseFloat(triangle.b[1])));
    line(x(parseFloat(triangle.b[0])), y(parseFloat(triangle.b[1])), x(parseFloat(triangle.c[0])), y(parseFloat(triangle.c[1])));
    line(x(parseFloat(triangle.c[0])), y(parseFloat(triangle.c[1])), x(parseFloat(triangle.a[0])), y(parseFloat(triangle.a[1])));
    //вершины треугольни
    text("A", x(parseFloat(triangle.a[0]))+3, y(parseFloat(triangle.a[1]))+3);
    text("B", x(parseFloat(triangle.b[0]))+3, y(parseFloat(triangle.b[1]))+3);
    text("C", x(parseFloat(triangle.c[0]))+3, y(parseFloat(triangle.c[1]))+3);

    console.log(tryCoordsellipse);
    //вывод координат центра окружности
    if (tryCoordsellipse[2] != 0){
        stroke(0, 255, 0);
        ellipse(x(tryCoordsellipse[0]), y(tryCoordsellipse[1]), scalex(tryCoordsellipse[2]*2), scaley(tryCoordsellipse[2]*2))
        text('[ ', x(tryCoordsellipse[0])-45, y(tryCoordsellipse[1])+15);
        text(tryCoordsellipse[0], x(tryCoordsellipse[0])-40, y(tryCoordsellipse[1])+15);
        text('      ; ', x(tryCoordsellipse[0])-42, y(tryCoordsellipse[1])+15);
        text(tryCoordsellipse[1], x(tryCoordsellipse[0])-10, y(tryCoordsellipse[1])+15);
        text(' ]', x(tryCoordsellipse[0])+8, y(tryCoordsellipse[1])+15);
    }
    //рисуем искомую прямую
    stroke(255, 0, 0);
    if (tryCoordsellipse[3]){
        line(x(parseFloat(triangle.a[0])), y(parseFloat(triangle.a[1])), x(tryCoordsellipse[0]), y(tryCoordsellipse[1]));
        line(x(parseFloat(triangle.b[0])), y(parseFloat(triangle.b[1])), x(tryCoordsellipse[0]), y(tryCoordsellipse[1]));
        text("Min. angle: ", width * 0.87, height / 15);
        text(calcAngle(triangle.a[0], triangle.a[1], triangle.b[0], triangle.b[1]), width -20, height / 15);


    } else if (tryCoordsellipse[4]){
        line(x(parseFloat(triangle.b[0])), y(parseFloat(triangle.b[1])), x(tryCoordsellipse[0]), y(tryCoordsellipse[1]));
        line(x(parseFloat(triangle.c[0])), y(parseFloat(triangle.c[1])), x(tryCoordsellipse[0]), y(tryCoordsellipse[1]));
        text("Min. angle: ", width * 0.87, height / 15);
        text(calcAngle(triangle.b[0], triangle.b[1], triangle.c[0], triangle.c[1]), width -20, height / 15);

    } else if (tryCoordsellipse[5]){
        line(x(parseFloat(triangle.c[0])), y(parseFloat(triangle.c[1])), x(tryCoordsellipse[0]), y(tryCoordsellipse[1]));
        line(x(parseFloat(triangle.a[0])), y(parseFloat(triangle.a[1])), x(tryCoordsellipse[0]), y(tryCoordsellipse[1]));
        text("Min. angle: ", width * 0.87, height / 15);
        text(calcAngle(triangle.c[0], triangle.c[1], triangle.a[0], triangle.a[1]), width -20, height / 15);
    } else{
        alert("нет решения")
    }
}

function calcAngle(x1, y1, x2, y2){
    A = y2 - y1
    B = -(x2 - x1)
    console.log("A = ", A, "B = ", B);

    return Math.acos(abs(5 * A / (5 * sqrt(A * A + B * B)))) * 180 / Math.PI
}

function checkTriangle(a, b, c) {
    let center = function (a, b, c, i) { //поиск центра окружности
        return (a[0] * a[0] + a[1] * a[1]) * Math.pow(-1, i) * (c[i] - b[i]) +
            (b[0] * b[0] + b[1] * b[1]) * Math.pow(-1, i) * (a[i] - c[i]) +
            (c[0] * c[0] + c[1] * c[1]) * Math.pow(-1, i) * (b[i] - a[i]);
    };

    let d = 2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1])), 
        o = [center(a, b, c, 1) / d, center(a, b, c, 0) / d],
        //длины сторон для формулы Герона
        A = Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2)),
        B = Math.sqrt(Math.pow(b[0] - c[0], 2) + Math.pow(b[1] - c[1], 2)),
        C = Math.sqrt(Math.pow(c[0] - a[0], 2) + Math.pow(c[1] - a[1], 2)),
        t = (A + B + C) / 2,
        c1 = (!isFinite((o[1] - triangle.b[1]) / (o[0] - triangle.b[0])) && !isFinite(triangle.s1)) ||
            Math.abs((o[1] - triangle.b[1]) / (o[0] - triangle.b[0]) - triangle.s1) < 0.00001 ||
            (o[0] === parseFloat(triangle.b[0]) && o[1] === parseFloat(triangle.b[1])),
        c2 = (!isFinite((o[1] - triangle.c[1]) / (o[0] - triangle.c[0])) && !isFinite(triangle.s2)) ||
            Math.abs((o[1] - triangle.c[1]) / (o[0] - triangle.c[0]) - triangle.s2) < 0.00001 ||
            (o[0] === parseFloat(triangle.c[0]) && o[1] === parseFloat(triangle.c[1])),
        c3 = (!isFinite((o[1] - triangle.a[1]) / (o[0] - triangle.a[0])) && !isFinite(triangle.s3)) ||
            Math.abs((o[1] - triangle.a[1]) / (o[0] - triangle.a[0]) - triangle.s3) < 0.00001 ||
            (o[0] === parseFloat(triangle.a[0]) && o[1] === parseFloat(triangle.a[1]));



    return [c1, c2, c3, o, Math.abs(A * B * C / (4 * Math.sqrt(t * (t - A) * (t - B) * (t - C))))];
}

function resize() {
    canvas.style.width = container.clientWidth + "px";
    canvas.style.height = container.clientWidth + "px";
}

function scalex(cx) {
    return  cx / rwidth * width;
}

function scaley(cy) {
    return  cy / rheight * height;
}

function x(xc) {
    return Math.floor(scalex(xc + rwidth/2));
}

function y(yc) {
    return Math.floor(scaley(rheight/2 - yc));
}

function updateSize(str) {
    if (!checkInput(/-?\d{1,10}\.?\d{0,12} -?\d{1,10}\.?\d{0,12}/, str)) return null;

    rwidth = max(rwidth, Math.floor(Math.abs(str.split(' ')[0]*2)) + 1);
    rheight = max(max(rheight, Math.floor(Math.abs(str.split(' ')[1]*2)) + 1), rwidth);
    rwidth = max(rwidth, rheight);

    return str;
}

function reduceSize() {
    rwidth = set1.set.map(e => parseFloat(e[0])).reduce((m, e) => {return max(m, Math.abs(e * 2 + 1));}, 10);
    rheight = set1.set.map(e => parseFloat(e[1])).reduce((m, e) => {return max(m, Math.abs(e * 2 + 1));}, 10);
    rwidth = max(rwidth, rheight);
    updateSize(triangle.a.join(" "));
    updateSize(triangle.b.join(" "));
    updateSize(triangle.c.join(" "));
}

function checkInput(reg, str) {
    if (str.match(reg) != str) {
        alert("Incorrect input!");
        return false;
    }
    return true;
}