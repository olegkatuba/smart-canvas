function save() {
    fetch('/save').then(res => {
        return res.json();
    }).then(res => {
        alert(res);
    });
}

let canvas;
let ctx;

class Area {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    isContain() {
        return ctx.getImageData(this.x, this.y, Math.ceil(this.width), Math.ceil(this.height)).data.some(color => color >= 250);
    }

    draw(color) {
        color = color || 'rgba(0, 100, 0, 100)';
        let oldColor = ctx.strokeStyle;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = oldColor;
    }

    fill(color) {
        color = color || 'black';
        let oldColor = ctx.strokeStyle;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = oldColor;
    }
}

class Line {
    static drawLine(x1, y1, x2, y2, color) {
        color = color || 'rgba(100, 0, 0, 100)';
        let oldColor = ctx.strokeStyle;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.strokeStyle = oldColor;
    }
}

class Pixel {
    constructor(r, g, b, a) {

    }
}

window.onload = function() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    let scale = {
        x: canvas.getBoundingClientRect().width / canvas.width,
        y: canvas.getBoundingClientRect().height / canvas.height
    };

    window.onresize = (e) => {
        scale = {
            x: canvas.getBoundingClientRect().width / canvas.width,
            y: canvas.getBoundingClientRect().height / canvas.height
        };
    };

    canvas.onmousedown = canvas.ontouchstart = (e) => {
        ctx.beginPath();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = "3";
        const coords = e.touches ? e.touches[0] : e;
        ctx.moveTo(coords.pageX / scale.x, coords.pageY / scale.y);

        canvas.onmousemove = canvas.ontouchmove = (e) => {
            e.preventDefault();
            const coords = e.touches ? e.touches[0] : e;
            ctx.lineTo(coords.pageX / scale.x, coords.pageY / scale.y);
            ctx.stroke();
        };

        canvas.onmouseup = canvas.ontouchend = () => {
            canvas.onmousemove = canvas.ontouchmove = null;
        };
    };
};

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // drawField();
}

function getArea() {

    let coorgs = {};

    for (let i = 0; i < canvas.width; i++) {
        if(!coorgs.x1 && ctx.getImageData(i, 0, 1, canvas.height).data.some(color => color !== 0)) {
            coorgs.x1 = i;
        }
        if(!coorgs.y1 && ctx.getImageData(0, i, canvas.width, 1).data.some(color => color !== 0)) {
            coorgs.y1 = i;
        }
        if(!coorgs.x2 && ctx.getImageData(canvas.width - i, 0, 1, canvas.height).data.some(color => color !== 0)) {
            coorgs.x2 = canvas.width - i;
        }
        if(!coorgs.y2 && ctx.getImageData(0, canvas.height - i, canvas.width, 1).data.some(color => color !== 0)) {
            coorgs.y2 = canvas.height - i;
        }
        if(coorgs.x1 && coorgs.x2 && coorgs.y1 && coorgs.y2) {
            break;
        }
    }
    return new Area(coorgs.x1, coorgs.y1, coorgs.x2 - coorgs.x1, coorgs.y2 - coorgs.y1);
    //area.draw();
}

function submit(data) {
    fetch('/identify', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(drawField(data, 10))
    }).then(res => {
        return res.json();
    }).then(res => {
        let num = 0;
        Object.keys(res).forEach(key => {
            if (res[key] > res[num])
                num = key;
        });
        if(confirm('Is it ' + num + '?')) {
            train(data, num);
        } else {
            let num = prompt('So what is it?');
            if (num === null) return;
            train(data, num);
        }
    });
}

function train(data, num) {
    fetch('/train', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({data: drawField(data, 10), is: num})
    }).then(res => {
        return res.json();
    }).then(res => {
        console.log(res);
    });
}


function drawField (area, cellsCount) {
    ctx.strokeStyle = "#777";
    ctx.lineWidth = "0.3";
    ctx.beginPath();
    let colWidth = area.width / cellsCount;
    let rowHeight = area.height / cellsCount;
    let filledAreas = [];
    let filledAreasCoords = {};
    for(let i = 0; i < cellsCount; i++){
        for (let j = 0; j < cellsCount; j++) {
            let cell = new Area(j * colWidth + area.x, i * rowHeight + area.y, colWidth, rowHeight);
            // cell.draw('rgba(100, 0, 0, 100)');
            if(cell.isContain()) {
                filledAreas.push(cell);
                filledAreasCoords[`${i}:${j}`] = 1;
            }
        }
        // Line.drawLine(i * colWidth + area.x, area.y, i * colWidth + area.x, area.height + area.y);
        // Line.drawLine(area.x, i * rowHeight + area.y, area.width + area.x, i * rowHeight + area.y);
    }
    /*filledAreas.forEach(cell => {
        cell.fill('black');
    });*/
    ctx.stroke();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = "1";

    return filledAreasCoords;
}