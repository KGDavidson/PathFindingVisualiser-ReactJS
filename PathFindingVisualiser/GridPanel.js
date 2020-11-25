import React, {useState} from 'react';
import './GridPanel.css';

var centerY = -95 / 2;
var centerX = -70 / 1.5;

var mousePos = [0, 0];
var middleMouse = false;
var leftMouse = false;
var rightMouse = false;

var changed = [];

document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
});


function GridPanel(props) {
    const [offsetX, setOffsetX] = useState(1);
    const [offsetY, setOffsetY] = useState(1);

    const handleEvent = (event) => {
        if (event !== undefined) {
            event.preventDefault();
            if (event.type === "mousedown") {
                mousePos = [event.screenX, event.screenY];
                leftMouse = (event.button === 0);
                middleMouse = (event.button === 1);
                rightMouse = (event.button === 2);
                if (middleMouse) {
                    document.body.style.cursor = "all-scroll";
                }
                if (leftMouse) {
                    props.setStarted(false);
                    document.body.style.cursor = "crosshair";
                    var ij = event.target.id;
                    if (ij !== "") {
                        ij = ij.split(" ");
                        var i = Number.parseInt(ij[0]);
                        var j = Number.parseInt(ij[1]);
                        if (props.nodeType > 0) {
                            if (!JSON.stringify(props.walls).includes(JSON.stringify([i, j])) && JSON.stringify(props.startPoint) !== JSON.stringify([i, j])) {
                                props.setEndPoint([i, j]);
                            }
                        } else {
                            if (!JSON.stringify(props.walls).includes(JSON.stringify([i, j])) && JSON.stringify(props.endPoint) !== JSON.stringify([i, j])) {
                                props.setStartPoint([i, j]);
                            }
                        }
                    }
                }
                if (rightMouse) {
                    props.setStarted(false);
                    var ij = event.target.id;
                    if (ij !== "") {
                        ij = ij.split(" ");
                        var i = Number.parseInt(ij[0]);
                        var j = Number.parseInt(ij[1]);
                        var tempWalls = props.walls;
                        if (JSON.stringify(props.startPoint) !== JSON.stringify([i, j]) && JSON.stringify(props.endPoint) !== JSON.stringify([i, j]) && !JSON.stringify(changed).includes(JSON.stringify([i, j]))) {
                            if (JSON.stringify(tempWalls).includes(JSON.stringify([i, j]))){
                                tempWalls = tempWalls.filter(item => JSON.stringify(item) !== JSON.stringify([i, j]));
                            } else {
                                tempWalls.push([i, j]);
                            }
                            changed.push([i, j]);
                            const uniqueWalls = Array.from(new Set(tempWalls));
                            props.setWalls(uniqueWalls);
                        }
                    }
                }
            }
            
            if (event.type === "mousemove" && middleMouse) {
                var tempMousePos = [event.screenX, event.screenY];

                setOffsetX(offsetX + ((tempMousePos[0] - mousePos[0])) / 7);
                setOffsetY(offsetY + ((tempMousePos[1] - mousePos[1])) / 7);
        
                mousePos = [event.screenX, event.screenY];
            }

            if (event.type === "mousemove" && rightMouse) {
                var ij = event.target.id;
                if (ij !== "") {
                    ij = ij.split(" ");
                    var i = Number.parseInt(ij[0]);
                    var j = Number.parseInt(ij[1]);
                    var tempWalls = props.walls;
                    if (JSON.stringify(props.startPoint) !== JSON.stringify([i, j]) && JSON.stringify(props.endPoint) !== JSON.stringify([i, j]) && !JSON.stringify(changed).includes(JSON.stringify([i, j]))) {
                        if (JSON.stringify(tempWalls).includes(JSON.stringify([i, j]))){
                            tempWalls = tempWalls.filter(item => JSON.stringify(item) !== JSON.stringify([i, j]));
                        } else {
                            tempWalls.push([i, j]);
                        }
                        changed.push([i, j]);
                        const uniqueWalls = Array.from(new Set(tempWalls));
                        props.setWalls(uniqueWalls);
                    }
                }
            }

            if (event.type === "mouseup") {
                changed = [];
                middleMouse = false;
                leftMouse = false;
                rightMouse = false;
                document.body.style.cursor = "default";
            }
        }
    };

    function SpawnSquares(props) {
        var squares = [];
        for (var i = 0; i < 40; i++) {
            for (var j = 0; j < 20; j++) {
                var currentPoint = [i, j];
                if (JSON.stringify(currentPoint) === JSON.stringify(props.startPoint)){
                    squares.push(Square('#66fcf1', i, j));
                } else if (JSON.stringify(currentPoint) === JSON.stringify(props.endPoint)) {
                    squares.push(Square('#45a29e', i, j));
                } else if (JSON.stringify(props.currentPath).includes(JSON.stringify(currentPoint))) {
                    squares.push(Square('#62AB37', i, j));
                } else if (JSON.stringify(props.currentCheck).includes(JSON.stringify(currentPoint))) {
                    squares.push(Square('#E03616', i, j));
                } else if (JSON.stringify(props.walls).includes(JSON.stringify(currentPoint))) {
                    squares.push(Square('#c5c6c7', i, j));
                } else {
                    squares.push(Square('#0b0c10', i, j));
                }
            }
        }
        return (squares);
    }

    function Square(colour, i, j) {
        return (<div id={i + " " + j} style={{background: colour, marginTop: 93 / 2 + centerY + offsetY + (j * 5) + 'vh', marginLeft: 70 / 1.55 + centerX + offsetX + (i * 5) + 'vh'}} className="Square" onClick={handleEvent} onMouseUp={handleEvent}></div>);
    }

    return (
        <div className="GridPanel" onMouseDown={handleEvent} onMouseMove={handleEvent} onMouseUp={handleEvent}>
            {SpawnSquares(props)}
        </div>
    );
}

export default GridPanel;