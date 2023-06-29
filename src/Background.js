import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry';

const SpaceBackground = () => {
	const canvasRef = useRef(null);

	useEffect(() => {
		let space;

		const texture = {
			matcap:
				'https://images.unsplash.com/photo-1626908013943-df94de54984c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2673&q=80',
			skin: 'https://images.unsplash.com/photo-1560780552-ba54683cb263?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
			env: 'https://images.unsplash.com/photo-1536566482680-fca31930a0bd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80',
		};

		const config = {
			scene: {
				speed: 0.1,
			},
			object: {
				speed: 0,
			},
		};

		const Control = class {
			constructor(props) {
				this.controls = new OrbitControls(props.camera, props.canvas);
				this.init();
			}
			init() {
				this.controls.target.set(0, 0, 0);
				this.controls.enableZoom = false;
				this.controls.enableDamping = true;
				this.controls.dampingFactor = 0;
				this.update();
			}
			update() {
				this.controls.update();
			}
		};

		const LightBar = class {
			constructor(props) {
				this.geometry(props.scene, props.uid);
			}
			geometry(e, i) {
				const amp = 1;
				const c_mat = new THREE.MeshBasicMaterial();
				const c_geo = new THREE.CapsuleGeometry(0.02, 0.5 + Math.random(), 5, 16);
				this.c_mes = new THREE.Mesh(c_geo, c_mat);
				this.c_mes.position.y = -Math.random() * (amp / 2) + Math.random() * (amp / 2);
				this.c_mes.position.x = -Math.sin(i * 0.3) * Math.PI;
				this.c_mes.position.z = -Math.cos(i * 0.3) * Math.PI;
				e.add(this.c_mes);
			}
		};

		const init = () => {
			space.renderer = new THREE.WebGLRenderer({
				canvas: canvasRef.current,
				antialias: true,
				alpha: true,
			});
			space.clock = new THREE.Clock();
			space.scene = new THREE.Scene();
			space.camera = new THREE.PerspectiveCamera(35);
			space.camera.position.set(5, -1.7, 8);
			space.scene.background = new THREE.Color(0x000a0b);
			space.control = new Control({ camera: space.camera, canvas: canvasRef.current });
			space.axesHelper = new THREE.AxesHelper(2);
			space.axesHelper.position.y = -1.5;
			space.renderer.shadowMap.enabled = true;
			space.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
			space.lights();
			space.object();
			space.capsule();
			space.resize();
			space.render();
			space.loop();
		};

		space = {
			renderer: null,
			clock: null,
			scene: null,
			camera: null,
			control: null,
			axesHelper: null,
			lights() {
				this.h_light = new THREE.HemisphereLight(0xffffff, 0xaaaacc, 1);
				this.p_light = new THREE.PointLight(0xffffff, 0.2);
				this.p_light.castShadow = true;
				this.p_light.position.set(1, 5, 1);
				this.scene.add(this.h_light, this.p_light);
			},
			capsule() {
				for (let i = 0; i <= 20; i++) {
					const lightbar = new LightBar({ scene: this.scene, uid: i });
				}
			},
			object() {
				const o_geo = new RoundedBoxGeometry(1, 1, 1, 5, 0.05);
				const c_geo = new THREE.CircleGeometry(5, 5);
				const o_mat = new THREE.MeshMatcapMaterial({
					color: 0xffffff,
					matcap: new THREE.TextureLoader().load(texture.matcap),
					map: new THREE.TextureLoader().load(texture.env),
				});

				this.c_mes = new THREE.Mesh(c_geo, o_mat);
				this.o_mes = new THREE.Mesh(o_geo, o_mat);
				this.c_mes.rotateX(Math.PI / 2);
				this.c_mes.position.y = -1;
				this.scene.add(this.o_mes);
			},
			resize() {
				this.camera.aspect = window.innerWidth / window.innerHeight;
				this.camera.updateProjectionMatrix();
				this.renderer.setSize(window.innerWidth, window.innerHeight);
			},
			render() {
				this.scene.rotation.y = this.clock.getElapsedTime() * config.scene.speed;
				this.o_mes.rotation.y = -this.clock.getElapsedTime() * config.object.speed;
				this.o_mes.rotation.z = this.clock.getElapsedTime() * config.object.speed;
				this.o_mes.rotation.x = this.clock.getElapsedTime() * config.object.speed;
				this.o_mes.position.y = Math.sin(this.clock.getElapsedTime() * config.object.speed) * 0.2;
				this.camera.lookAt(this.scene.position);
				this.camera.updateMatrixWorld();
				this.renderer.render(this.scene, this.camera);
				this.control.update();
			},
			loop() {
				this.render();
				requestAnimationFrame(this.loop.bind(this));
			},
		};

		window.addEventListener('resize', space.resize.bind(space));
		window.addEventListener('load', space.resize.bind(space));

		init();

		return () => {
			window.removeEventListener('resize', space.resize.bind(space));
			window.removeEventListener('load', space.resize.bind(space));
		};
	}, []);

	return <canvas ref={canvasRef} />;
};

export default SpaceBackground;
