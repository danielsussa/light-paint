function debugDrawPixel(v){
    ctx.fillStyle = "#FF0000";
    ctx.fillRect( v.x, v.y, 1, 1 );
}

function debugLineRender(line){
    ctx.beginPath();
    const x1 = line.v1.x;
    const y1 = line.v1.y;
    const x2 = line.v2.x;
    const y2 = line.v2.y;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#FF0000";
    ctx.stroke();
}

function drawSphereLight(c){
    ctx.beginPath();
    ctx.arc(c.center.x, c.center.y, c.radius, 0, 2 * Math.PI, true);
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.stroke();
}

function drawRaytrace(raytrace){
    ctx.beginPath();
    const x1 = raytrace.line.v1.x;
    const y1 = raytrace.line.v1.y;
    const x2 = raytrace.line.v2.x;
    const y2 = raytrace.line.v2.y;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = 1;


    const max = 0.008;
    const min = 0.002;

    // newvalue= (max-min)*(value-1)+max

    const nStart = (max-min)*(raytrace.startPower-1)+max;
    const nEnd = (max-min)*(raytrace.endPower-1)+max;
    const middle  = (nStart - nEnd) / 2 + nEnd;
    let gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, `rgba(${raytrace.color.r}, ${raytrace.color.g}, ${raytrace.color.b}, ${nStart})`);
    gradient.addColorStop(0.1, `rgba(${raytrace.color.r}, ${raytrace.color.g}, ${raytrace.color.b}, ${middle})`);
    gradient.addColorStop(1, `rgba(${raytrace.color.r}, ${raytrace.color.g}, ${raytrace.color.b}, ${nEnd})`);
    ctx.strokeStyle = gradient;


    ctx.stroke();
}

onmessage = function(e) {
    if (e.data.canvas !== undefined){
        canvas = e.data.canvas;
        canvas.width = 1920;
        canvas.height = 1080;
        ctx = canvas.getContext("2d");
        ctx.translate(0, canvas.height);
        ctx.scale(1, -1);
        return;
    }
    if (e.data.action === 'debugLineRender'){
        debugLineRender(e.data.data);
    }
    if (e.data.action === 'debugDrawPixel'){
        this.console.log('ola')
        debugDrawPixel(e.data.data);
    }
    if (e.data.action === 'drawSphereLight'){
        drawSphereLight(e.data.data);
    }
    if (e.data.action === 'drawRaytrace'){
        for (d of e.data.data){
            drawRaytrace(d);
        }
        
    }
}