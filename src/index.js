import GUI from "uniforms-gui";
import OrbitControls from "orbit-controls-es6";

import fragmentShader from "./fragment.glsl";
import vertexShader from "./vertex.glsl";

const {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  Mesh,
  RawShaderMaterial,
  TorusGeometry
} = global.THREE;

class App {
  get size() {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  constructor() {
    const { height, width } = this.size;

    this.renderer = new WebGLRenderer({
      antialising: true,
      alpha: false,
      canvas: undefined
    });

    this.gui = new GUI();
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(width, height);

    this.camera = new PerspectiveCamera(45, width / height, 1, 1000);
    this.camera.position.z = 50;

    const cameraControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    cameraControls.enabled = true;
    cameraControls.maxDistance = 100;
    cameraControls.minDistance = 0.05;

    this.scene = new Scene();

    const material = new RawShaderMaterial({
      fragmentShader,
      vertexShader,
      uniforms: {
        uLightness: {
          value: 0.0,
          controls: {
            type: "knob",
            min: 0,
            max: 1
          }
        },
        uLightPosition: {
          value: [0.0, 100.0, -30],
          controls: {
            step: 10
          }
        },
        uAmbientColor: {
          value: [0.8, 0.0, 0.0],
          controls: {
            type: "color"
          }
        },
        uLightColor: {
          value: [0.7, 0.4, 1.0],
          controls: {
            type: "color"
          }
        },
        uSpecularColor: {
          value: [1.0, 1.0, 1.0],
          controls: {
            type: "color"
          }
        },
        uSpecularDistance: {
          value: 200.0,
          controls: {
            max: 300,
            min: 1
          }
        },
        uSpecularSmooth: {
          value: 0.01,
          controls: {
            max: 5,
            min: 0.01
          }
        },
        uBandsAA: {
          value: 0.01,
          controls: {
            max: 0.2,
            min: 0.001,
            precision: 3,
            step: 0.001
          }
        }
      }
    });

    material.uniformsNeedUpdate = true;

    this.gui.initFrom(material);
    this.gui.draw();

    this.mesh = new Mesh(new TorusGeometry(10, 3, 16, 100), material);
    this.scene.add(this.mesh);

    console.log(this.scene);

    global.document.getElementById("app").appendChild(this.renderer.domElement);
    this.update = this.update.bind(this);
  }

  update() {
    this.renderer.render(this.scene, this.camera);
    this.requestId = requestAnimationFrame(this.update);
  }
}

const app = new App();
app.update();
