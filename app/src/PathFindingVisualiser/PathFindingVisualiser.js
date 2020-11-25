import React, {useEffect, useState} from 'react';
import OptionsPanel from './OptionsPanelPFV';
import GridPanel from './GridPanel';
import './PathFindingVisualiser.css';

var isStarted = false;
var tempCurrentCheck = [[-1, -1]];
var points = {};

function PathFindingVisualiser() {
    const [nodeType, SetNodeType] = useState(0);
    const [startPoint, SetStartPoint] = useState([10, 5]);
    const [endPoint, SetEndPoint] = useState([11, 6]);
    const [walls, SetWalls] = useState([]);
    const [sortAlg, SetSortAlg] = useState("0");
    const [currentCheck, SetCurrentCheck] = useState([[-1, -1]]);
    const [currentPath, SetCurrentPath] = useState([[-1, -1]]);

    useEffect(() => {
      document.title = "Path Finding Visualiser"
    }, []);

    const Pause = () => { 
        return new Promise(resolve => { 
            setTimeout(function() { 
            resolve(); 
            }, Number.MIN_VALUE); 
        }); 
    };

    const ResetPathFinding = () => {
        SetCurrentPath([]);
        SetCurrentCheck([]);
        tempCurrentCheck = [[-1, -1]];
        points = {};
    }

    const SetStarted = (i) => {
        if (!isStarted && !i) {
            isStarted = i;
            ResetPathFinding();
        } else {
            isStarted = i;
        }
    }

    const StartPathFinding = (val) => {
        SetStarted(val);
        if (isStarted) {
            if (sortAlg === "0") {
                DijkstraAlgorithm();
            }
        }
    }

    const DijkstraInitialisePoints = () => {
        points = {};
        for (var i = 0; i < 40; i++) {
            for (var j = 0; j < 20; j++) {
                if (JSON.stringify([i, j]) === JSON.stringify(startPoint)) {
                    points[i + " " + j] = [false, 0, null];
                } else {
                    points[i + " " + j] = [false, Infinity, null];
                }
            }
        }
    }

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
        SetCurrentCheck(Array.from(new Set(tempCurrentCheck)));
        await Pause();
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
        if (isStarted) {
            ResetPathFinding();
            DijkstraInitialisePoints();
            var returnVal = await DijkstraCheckNeighbours(startPoint);
            var point = [-1,-1];
            while (returnVal === 0) {
                point = DijkstraReturnCurrentShortest();
                returnVal = await DijkstraCheckNeighbours(point);
                if (!isStarted) {
                    returnVal = -1;
                }
            }
            SetStarted(false);
            if (returnVal === 1) {
                var pointInPath = endPoint;
                var pathInOrder = [];
                while (pointInPath !== startPoint) {
                    pathInOrder.unshift(pointInPath);
                    pointInPath = points[pointInPath[0] + " " + pointInPath[1]][2];
                }
                pathInOrder.unshift(startPoint);
                SetCurrentPath(pathInOrder);
            } else {
                ResetPathFinding();
            }
        }
    }

    return (
        <div className="PathFindingVisualiser">
            <OptionsPanel isStarted={isStarted} SetStarted={SetStarted} SetSortAlg={SetSortAlg} StartPathFinding={StartPathFinding} SetNodeType={SetNodeType}></OptionsPanel>
            <GridPanel currentPath={currentPath} SetStarted={SetStarted} currentCheck={currentCheck} nodeType={nodeType} SetStartPoint={SetStartPoint} startPoint={startPoint} SetEndPoint={SetEndPoint} endPoint={endPoint} SetWalls={SetWalls} walls={walls}></GridPanel>
        </div>
    );
}

export default PathFindingVisualiser;