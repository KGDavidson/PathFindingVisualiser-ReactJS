import React, {useEffect, useState} from 'react';
import './PathFindingVisualiser.css';
import OptionsPanel from './OptionsPanelPFV';
import GridPanel from './GridPanel';

var started = false;
var tempCurrentCheck = [[-1, -1]];
var points = {};

function PathFindingVisualiser() {
    useEffect(() => {
      document.title = "Path Finding Visualiser"
    }, []);

    const [nodeType, setNodeType] = useState(0);
    const [startPoint, setStartPoint] = useState([10, 5]);
    const [endPoint, setEndPoint] = useState([11, 6]);
    const [walls, setWalls] = useState([]);
    const [sortAlg, setSortAlg] = useState("0");
    const [currentCheck, setCurrentCheck] = useState([[-1, -1]]);
    const [currentPath, setCurrentPath] = useState([[-1, -1]]);

    function setStarted(i) {
        if (!started && !i) {
            started = i;
            reset();
        } else {
            started = i;
        }
    }

    const StartButton = async (val) => {
        setStarted(val);
        if (started) {
            if (sortAlg === "0") {
                DijkstraAlgorithm();
            }
        }
    }

    const reset = () => {
        setCurrentPath([]);
        setCurrentCheck([]);
        tempCurrentCheck = [[-1, -1]];
        points = {};
    }

    const DijkstraInitialisePoints = () => {
        points = {};
        //var tempCurrentCheck = Array.from(currentCheck);
        for (var i = 0; i < 40; i++) {
            for (var j = 0; j < 20; j++) {
                if (JSON.stringify([i, j]) === JSON.stringify(startPoint)) {
                    points[i + " " + j] = [false, 0, null];
                } else {
                    points[i + " " + j] = [false, Infinity, null];
                }
                //tempCurrentCheck.push([i,j]);
                //setCurrentCheck(tempCurrentCheck);
            }
        }
    }

    var wait = function() { 
        return new Promise(resolve => { 
            setTimeout(function() { 
            resolve(); 
            }, Number.MIN_VALUE); 
        }); 
    };

    const DijkstraCheckNeighbours = async (point) => {
        if (JSON.stringify(point) === JSON.stringify([-1,-1])) {
            return -1;
        }
        var pointsToUpdate = [];
        var pointsToCheck = [[point[0] - 1, point[1]], [point[0] + 1, point[1]], [point[0], point[1] - 1], [point[0], point[1] + 1]];
        for (var i = 0; i < pointsToCheck.length; i++) {
            if (JSON.stringify(pointsToCheck[i]) === JSON.stringify(endPoint)) {
                DijkstraUpdatePointDistanceAndPrev([pointsToCheck[i]], point);
                return 1;
            }
            if (pointsToCheck[i][0]  >= 0 && pointsToCheck[i][0] < 40 && pointsToCheck[i][1]  >= 0 && pointsToCheck[i][1] < 20 && !JSON.stringify(walls).includes(JSON.stringify(pointsToCheck[i])) && JSON.stringify(startPoint) !== (JSON.stringify(pointsToCheck[i])) && points[pointsToCheck[i][0] + " " + pointsToCheck[i][1]][0] !== true) {
                pointsToUpdate.push(pointsToCheck[i]);
                tempCurrentCheck.push([pointsToCheck[i][0],pointsToCheck[i][1]]);
            }
        }
        setCurrentCheck(Array.from(new Set(tempCurrentCheck)));
        await wait();
        DijkstraUpdatePointDistanceAndPrev(pointsToUpdate, point);
        DijkstraUpdateVisited(point);
        return 0;
    }

    const DijkstraUpdateVisited = (point) => {
        points[point[0] + " " + point[1]][0] = true;
    }

    const DijkstraReturnDistanceTo = (point) => {
        var prevPoint = points[point[0] + " " + point[1]][2];
        var distanceTo = points[point[0] + " " + point[1]][1];
        while (prevPoint !== null) {
            distanceTo += points[prevPoint[0] + " " + prevPoint[1]][1];
            prevPoint = points[prevPoint[0] + " " + prevPoint[1]][2];
        }
        return distanceTo;
    }

    const DijkstraUpdatePointDistanceAndPrev =  (pointsInput, prevPoint) => {
        for (var i = 0; i < pointsInput.length; i++){
            var point = pointsInput[i];
            var distance = 1 + DijkstraReturnDistanceTo(prevPoint);
            var currentShortestDistance = points[point[0] + " " + point[1]][1];
            var currentPreviousNode = points[point[0] + " " + point[1]][2];
            var newShortestDistance = currentShortestDistance;
            var newPreviousNode = currentPreviousNode;
            if (distance < currentShortestDistance) {
                newShortestDistance = distance;
                newPreviousNode = prevPoint;
            }
            points[point[0] + " " + point[1]][1] = newShortestDistance;
            points[point[0] + " " + point[1]][2] = newPreviousNode;
        }
    }

    const DijkstraReturnCurrentShortest = () => {
        var point = [-1,-1];
        var currentShortestDistanceOverall = Infinity;
        for (var i = 0; i < 40; i++) {
            for (var j = 0; j < 20; j++) {
                var distance = points[i + " " + j][1];
                var visited = points[i + " " + j][0];
                if (distance < currentShortestDistanceOverall && !visited){
                    currentShortestDistanceOverall = distance;
                    point = [i, j];
                }
            }
        }
        return (point);
    }

    const DijkstraAlgorithm = async () => {
        if (started) {
            reset();
            DijkstraInitialisePoints();
            var returnVal = await DijkstraCheckNeighbours(startPoint);
            var point = [-1,-1];
            while (returnVal === 0) {
                point = DijkstraReturnCurrentShortest();
                returnVal = await DijkstraCheckNeighbours(point);
                if (!started) {
                    returnVal = -1;
                }
            }
            setStarted(false);
            if (returnVal === 1) {
                var pointInPath = endPoint;
                var pathInOrder = [];
                while (pointInPath !== startPoint) {
                    console.log("point");
                    pathInOrder.unshift(pointInPath);
                    pointInPath = points[pointInPath[0] + " " + pointInPath[1]][2];
                }
                pathInOrder.unshift(startPoint);
                setCurrentPath(pathInOrder);
            } else {
                reset();
            }
        }
    }

    return (
        <div className="PathFindingVisualiser">
            <OptionsPanel started={started} setStarted={setStarted} sortAlgSet={setSortAlg} startButton={StartButton} setNodeType={setNodeType}></OptionsPanel>
            <GridPanel currentPath={currentPath} setStarted={setStarted} currentCheck={currentCheck} nodeType={nodeType} setStartPoint={setStartPoint} startPoint={startPoint} setEndPoint={setEndPoint} endPoint={endPoint} setWalls={setWalls} walls={walls}></GridPanel>
        </div>
    );
}

export default PathFindingVisualiser;