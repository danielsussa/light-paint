import { process } from "./draw-canvas.js";


const canvasOffscreen = document.getElementById('light-canvas').transferControlToOffscreen();

const canvasHeight = 1080;

canvasOffscreen.width = 1920;
canvasOffscreen.height = canvasHeight;

var lightWorker = new Worker('worker/light-worker.js');

var renderWorker = new Worker('worker/render-worker.js');

renderWorker.postMessage({canvas: canvasOffscreen}, [canvasOffscreen]);


var rayCounter = 0;

$( ".loadscene-wrapper" ).click(function() {
    $.getJSON("backend/prepare_scene1.json", function(json) {
        lightWorker.postMessage({data:json, action: 'loadJson'});
    });
})



$( ".render-wrapper" ).click(function() {
    // hide canvas

    var spheres = [];
    // collect all lights
    var sphereLightsDOM = $( ".wireframe-sphere-light");
    for (let sphereDOM of sphereLightsDOM) {
        const sphere = {
            kind: 'sphere',
            radius: getSphereRadius(sphereDOM), 
            color: convertColor(sphereDOM), 
            center: getCenterOfSphere(sphereDOM)
        }
        lightWorker.postMessage({lightSphere:sphere});
    } 
    $(".frame-draw").fadeOut();
    $(".light-element").fadeOut();
    const data = process();
    lightWorker.postMessage({colliders: data, action: 'prepare'});
})

function convertColor(dom){
    const bg = $(dom).css("background-color");
    const arr = bg.replace(/^(rgb|rgba)\(/,'').replace(/\)$/,'').replace(/\s/g,'').split(',');
    return {r: arr[0], g: arr[1], b: arr[2]}
}

function getSphereRadius(dom){
    const diameter = parseInt($(dom).css("width").replace('px',''));
    return diameter/2;
}
function getCenterOfSphere(dom){
    const top = parseInt($(dom).css("top").replace('px',''));
    const left = parseInt($(dom).css("left").replace('px',''));
    const diameter = parseInt($(dom).css("width").replace('px',''));
    const x = left + diameter / 2;
    const y = canvasHeight - top - diameter / 2;
    return {x: x, y: y};
}

lightWorker.addEventListener('message', function(e) {
    if (e.data.action === 'send_data'){
        lightWorker.postMessage({action: 'render'});
    }
    if (e.data.action === 'drawSphereLight' || e.data.action === 'debugDrawPixel' || e.data.action === `debugLineRender` || e.data.action === 'drawRaytrace'){
        renderWorker.postMessage({action: e.data.action, data: e.data.data});
    }
    if (e.data.action == 'counter'){
        $(".ray_counter").html(`raycast: ${e.data.data.counter} emmiters: ${e.data.data.total} `)
        // rayCounter = e.data.total;
    }

}, false);


