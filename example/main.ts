import './style.css';

import * as THREE from 'three';
// @ts-ignore
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { ErrorManager, ErrorObject, HistoryObject } from '../src';

// Setup error manager
const errorManager = ErrorManager.Instance;

/**
 * Simple example
 */
const example = () => {
    // Setup a basic THREE.js scene.
    const gui = new GUI();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 5;
    const animate = () => {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    };

    // Add error to error manager
    const params = {
        debug: true,
        addHistory1: async () => {
            await errorManager.addHistory(new HistoryObject('error', 'A user has done something.'));
        },
        addHistory2: async () => {
            await errorManager.addHistory(
                new HistoryObject('error', 'The user clicked elsewhere.'),
            );
        },
        addHistory3: async () => {
            await errorManager.addHistory(
                new HistoryObject('error', 'Now the user has done something else.'),
            );
        },
        throwError: async () => {
            throw await errorManager.error(new ErrorObject('error', 'The app crashed. Oh no.'));
        },
        export: () => {
            errorManager.export();
        },
    };

    const handleDebugMode = (value: boolean) => (ErrorManager.DEBUG = value);

    gui.add(params, 'debug').name('Debug mode').onChange(handleDebugMode);
    handleDebugMode(params.debug);

    const historyFolder = gui.addFolder('History');
    historyFolder.add(params, 'addHistory1').name('Add history 1 (user action)');
    historyFolder.add(params, 'addHistory2').name('Add history 2 (user action)');
    historyFolder.add(params, 'addHistory3').name('Add history 3 (user action)');

    const errorFolder = gui.addFolder('Error');
    errorFolder.add(params, 'throwError').name('Throw error (app crashed)s');

    const miscFolder = gui.addFolder('Misc');
    miscFolder.add(params, 'export').name('Export errors and history');

    // Everything is OK. Begin animation.
    animate();
};

example();
