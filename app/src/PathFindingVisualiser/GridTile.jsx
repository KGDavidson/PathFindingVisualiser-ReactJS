import React, {useState} from 'react';

var centerY = -93 / 2;
var centerX = -70 / 2;

var mousePos = [];
var leftMouse = false;
var rightMouse = false;

class GridTile extends React.Component {
    constructor(props) {
        super(props);
        this.nodeType = props.nodeType;
        this.state = {
            pos: [props.i, props.j],
            i: props.i,
            j: props.j,
            isStartPoint: props.isStartPoint,
            isEndPoint: props.isEndPoint,
            isWall: props.isWall,
            colour: "#0b0c10"
        };
    }

    setOffset(offsetX, offsetY) {
        this.setState({
            offsetX: offsetX,
            offsetY: offsetY
        });
    }

    setIsDefault() {
        this.setState({
            isEndPoint: false,
            isStartPoint: false,
            isWall: false,
            colour: '#0b0c10'
        });
    }

    setIsEndPoint() {
        this.setState({
            isEndPoint: true,
            isStartPoint: false,
            isWall: false,
            colour: '#45a29e'
        });
    }

    setIsStartPoint() {
        this.setState({
            isEndPoint: false,
            isStartPoint: true,
            isWall: false,
            colour: '#66fcf1'
        });
    }

    setIsWall() {
        this.setState({
            isEndPoint: false,
            isStartPoint: false,
            isWall: true,
            colour: '#c5c6c7'
        });
    }

    setColour() {
    }

    render() {
        const handleEvent = (event) => {
            if (event !== undefined) {
                if (event.type === "mousedown") {
                    mousePos = [event.screenX, event.screenY];
                    leftMouse = (event.button === 0);
                    rightMouse = (event.button === 2);
                    if (leftMouse) {
                        if (this.props.nodeType > 0) {
                            this.setIsEndPoint();
                        } else {
                            this.setIsStartPoint();
                        }
                        /*var isCurrentlyWall = this.state.isWall;
                        //console.log(parent.props.nodeType);
                        if (this.state.isWall) {
                            this.setIsDefault();
                        } else {
                            this.setIsWall();
                        }*/
                        /*document.body.style.cursor = "crosshair";
                        var ij = event.target.id;
                        if (ij !== "") {
                            ij = ij.split(" ");
                            var i = Number.parseInt(ij[0]);
                            var j = Number.parseInt(ij[1]);
                            if (props.nodeType > 0) {
                                if (!JSON.stringify(props.walls).includes(JSON.stringify([i, j])) && JSON.stringify(props.startPoint) !== JSON.stringify([i, j])) {
                                    grid[i][j].setIsEndPoint();
                                    props.setEndPoint([i, j]);
                                }
                            } else {
                                if (!JSON.stringify(props.walls).includes(JSON.stringify([i, j])) && JSON.stringify(props.endPoint) !== JSON.stringify([i, j])) {
                                    props.setStartPoint([i, j]);
                                }
                            }
                        }*/
                    }
                    /*if (rightMouse) {
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
                    }*/
                }
    
                if (event.type === "mouseup") {
                    //changed = [];
                    event.preventDefault();
                    leftMouse = false;
                    rightMouse = false;
                }
            }
        };

        return <div id={this.state.i + " " + this.state.j} style={{background: this.state.colour, marginTop: centerY + (this.state.j * 5) + 'vh', marginLeft: centerX + (this.state.i * 5) + 'vh'}} className="Square" onClick={handleEvent} onMouseMove={handleEvent} onMouseUp={handleEvent} onMouseDown={handleEvent}></div>;
    }
  }

  export default GridTile;