import * as THREE from 'three';
import { BoxBufferGeometry, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js';
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"

export class Application {

  constructor() {
    //是否启用横截面
    const isLocalClippingEnabled=true;
    //#region 各个部件的状态
    const states = { erroR: 0, warN: 1, normaL: 3 };
    const PRT0172_1090_state = states.normaL;
    const PRT0161_1036_state = states.normaL;
    const PRT0164_1028_state = states.normaL;
    const PRT0026_159_state = states.normaL;
    const PRT0039_230_state = states.normaL;
    const PRT0039_230_01_state = states.normaL;
    const PRT0039_230_02_state = states.normaL;
    const PRT0043_234_state = states.normaL;
    const PRT0043_234_01_state = states.normaL;
    const PRT0043_234_02_state = states.normaL;
    const PRT0149_912_state = states.normaL;
    const PRT0103_683_state = states.normaL;
    //#endregion
    //#region 各个场景部件
    const scene = new Scene();
    const renderer = new WebGLRenderer();
    const composer = new EffectComposer(renderer);

    //#region 相机
    const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 500;
    //#endregion
    //#region 外轮廓发光
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
    outlinePass.edgeStrength = Number(3);
    outlinePass.edgeGlow = Number(2);
    outlinePass.edgeThickness = Number(3);
    outlinePass.pulsePeriod = Number(1);
    outlinePass.visibleEdgeColor.set('#66ccff');
    outlinePass.hiddenEdgeColor.set('#190a05');
    composer.addPass(outlinePass);
    const globalPlane = new THREE.Plane( new THREE.Vector3( 0, 0, -1 ), 0.1 );
    //#endregion
    //#region 横截面
    const globalPlanes = [ globalPlane ];
    renderer.clippingPlanes = globalPlanes; 
    renderer.localClippingEnabled = isLocalClippingEnabled;
    //#endregion
    //#region skydome
    const skydomeloader = new THREE.TextureLoader();
    //skydome credit:hiro K
    const skydometexture = skydomeloader.load('assets/sk01.png', () => {
      const temp = new THREE.WebGLCubeRenderTarget(skydometexture.image.height);
      temp.fromEquirectangularTexture(renderer, skydometexture);
      scene.background = temp.texture;
    })
    //#endregion

    //#region 渲染器
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    //#endregion
    //#region 旋转视图
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    //#endregion
    //#region 灯光
    const light = new THREE.HemisphereLight(0xbbbbff, 0x444422, 1.5);
    light.position.set(0, 1, 0);
    scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    scene.add(directionalLight);

    const ambientlight = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(ambientlight);
    //#endregion
    //#region 材质
    //默认材质
    const mapma = new THREE.TextureLoader().load('assets/iron.jpg');
    const colorma = new THREE.Color("rgb(180, 180, 190)");
    const material = new THREE.MeshStandardMaterial({
      map: mapma,
      color: colorma,
      metalness: 0.4,
      roughness: 0.5,
      flatShading: true,
    });
    //选择后的材质
    const selectedcolor = new THREE.Color("rgb(200, 200, 200)");
    const selectedMaterial = new THREE.MeshStandardMaterial({
      color: selectedcolor,
    });
    //故障的材质
    const errorMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000,//红色
    });
    //预警的材质
    const warncolor = new THREE.Color("rgb(243, 230, 50)");
    const warnMaterial = new THREE.MeshStandardMaterial({
      color: warncolor,//黄色
    });
    //#endregion
    //#endregion
    //#region glTF模型读取
    const loader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/examples/js/libs/draco/');
    loader.setDRACOLoader(dracoLoader);



    loader.load(
      //！一定放在assets中，不然会404 not found！
      'assets/cwp.glb',
      function (gltf) {

        //增加材质
        gltf.scene.traverse(child => {
          if ((<THREE.Mesh>child).isMesh) {
            (<THREE.Mesh>child).material = material;
          }
        });
        //状态

        gltf.scene.position.y = -230;	//右手坐标系置于视图中央

        //#region 各个部件
        /////////////////////////////////////
        //！名称很长请不要改动！
        //各个部件：
        //电机   PRT0172_1090 spped_PRT0172_1090
        //电机支架  PRT0161_1036
        //齿轮箱 PRT0164_1028 spped_PRT0164_1028
        //齿轮箱支架  PRT0026_159
        //轴护罩 PRT0039_230  spped_PRT0039_230
        //泵轴承 PRT0039_230_01实在是找不到)
        //泵导轴承 PRT0039_230_02实在是找不到)
        //基坑里衬 PRT0043_234
        //轴承支架 PRT0043_234_01
        //(泵盖 PRT0043_234_02实在是找不到)
        //叶轮   PRT0149_912  spped_PRT0149_912
        //下支撑环 PRT0103_683
        ////////////////////////////////////

        const PRT0172_1090 = gltf.scene.getObjectByName('02040643AECC26C70A2C76E840BFA5F2E13CCF5E___B8A4396250C5687B1D31');
        const PRT0164_1028 = gltf.scene.getObjectByName('37D1C060B95CF51D30CCDD51C99C38629BEC8F3E___B8A4396250C5687B1D31');
        const PRT0039_230 = gltf.scene.getObjectByName('0C2050CF1045CBFA57D6D808B4737ECD5E360791___B8A4396250C5687B1D31');
        const PRT0039_230_01 = null;
        const PRT0039_230_02 = null;
        const PRT0149_912 = gltf.scene.getObjectByName('29514B080A6B44919E8CE5C9F1DEF03D07F7CC50___B8A4396250C5687B1D31');

        const spped_PRT0172_1090 = 50;
        const spped_PRT0164_1028 = 1;
        const spped_PRT0039_230 = 30;
        const spped_PRT0149_912 = 50;

        const PRT0161_1036 = gltf.scene.getObjectByName('DE39F52F1BC2387EC3E13EC9AC76399CCFF39C51___B8A4396250C5687B1D31');
        const PRT0026_159 = gltf.scene.getObjectByName('33F634B9AE4E3753625527C029F2C969E022AD89___B8A4396250C5687B1D31');
        const PRT0043_234 = gltf.scene.getObjectByName('D2E607E106AF35183422765E42EEB2F198EE093A___B8A4396250C5687B1D31');
        const PRT0043_234_01 = gltf.scene.getObjectByName('1DD2BFAE5D75295DFF2503F10445EF9E42B68E00___B8A4396250C5687B1D31');
        const PRT0043_234_02 = null;
        const PRT0103_683 = gltf.scene.getObjectByName('9AAAFC11EFE9FE537144C927E4F062CCDC0DD60F___B8A4396250C5687B1D31');
        //#region 状态异常赋予材质
        function state_if(objecT: THREE.Object3D<THREE.Event> | undefined, statE: number) {
          if (statE == states.erroR) {
            ((objecT) as THREE.Mesh).material = errorMaterial;
          } else if (statE == states.warN) {
            ((objecT) as THREE.Mesh).material = warnMaterial;
          }
        }
        function part_State() {
          requestAnimationFrame(part_State);
          state_if(PRT0172_1090, PRT0172_1090_state);
          state_if(PRT0164_1028, PRT0164_1028_state);
          state_if(PRT0039_230, PRT0039_230_state);
          //state_if(PRT0039_230_01,PRT0039_230_01_state);
          //state_if(PRT0039_230_02,PRT0039_230_02_state);
          state_if(PRT0149_912, PRT0149_912_state);
          state_if(PRT0161_1036, PRT0161_1036_state);
          state_if(PRT0026_159, PRT0026_159_state);
          state_if(PRT0043_234, PRT0043_234_state);
          state_if(PRT0043_234_01, PRT0043_234_01_state);
          //state_if(PRT0043_234_02,PRT0043_234_02_state);
          state_if(PRT0103_683, PRT0103_683_state);

        }; part_State();

        //#endregion
        //#endregion
        //TODO:速度刷新异常
        //#region 设置旋转
        function rotationpart() {
          //电机 spped_PRT0172_1090
          if (PRT0172_1090) {
            PRT0172_1090.rotation.z -= spped_PRT0172_1090;
          }
          //齿轮箱 spped_PRT0164_1028
          if (PRT0164_1028) {
            PRT0164_1028.rotation.z -= spped_PRT0164_1028;
          }
          //轴护罩 spped_PRT0039_230
          if (PRT0039_230) {
            PRT0039_230.rotation.z -= spped_PRT0039_230;
          }
          //叶轮  spped_PRT0149_912
          if (PRT0149_912) {
            PRT0149_912.rotation.z -= spped_PRT0149_912;
          }

          renderer.render(scene, camera);

          requestAnimationFrame(rotationpart);
        } rotationpart();
        //#endregion

        //#region 点击显示
        window.addEventListener('mousedown', function (event) {
          event.preventDefault();
          var raycaster = new THREE.Raycaster();

          var pointer = { x: 0, y: 0 };
          var selectdObject: THREE.Object3D<THREE.Event> | THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]> | null = null;
          pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
          pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

          raycaster.setFromCamera(pointer, camera);
          var intersects = raycaster.intersectObjects(scene.children);

          if (intersects.length > 0) {
            selectdObject = intersects[0].object;
            //电机 PRT0172_1090
            if (selectdObject == PRT0172_1090) {
              console.log("电机");

            }
            //电机支架  PRT0161_1036
            if (selectdObject == PRT0161_1036) {
              console.log("电机支架");
            }
            //齿轮箱 PRT0164_1028
            if (selectdObject == PRT0164_1028) {
              console.log("齿轮箱");
            }
            //齿轮箱支架  PRT0026_159
            if (selectdObject == PRT0026_159) {
              console.log("齿轮箱支架");
            }

            //轴护罩 PRT0039_230
            if (selectdObject == PRT0039_230) {
              console.log("轴护罩");
              console.log("泵轴承");
              console.log("泵导轴");
            }
            //TODO：(泵轴承和泵导轴承实在是找不到)
            //基坑里衬 PRT0043_234
            if (selectdObject == PRT0043_234) {
              console.log("基坑里衬");
              console.log("泵盖");
            }
            //轴承支架 PRT0043_234_01
            if (selectdObject == PRT0043_234_01) {
              console.log("轴承支架");
            }
            //TODO：(泵盖实在是找不到)
            //叶轮  spped_PRT0149_912
            if (selectdObject == PRT0149_912) {
              console.log("叶轮");
            }
            //下支撑环 PRT0103_683
            if (selectdObject == PRT0103_683) {
              console.log("下支撑环");
            }
          }

        }, false)
        //#endregion
        scene.add(gltf.scene);
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      function (error) {
        console.log('错误', error);
      }
    );

    //#endregion


    //#region  重新设置窗口大小尺寸
    function onWindowResize() {

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();//不加会固定长宽比压缩
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', onWindowResize);

    //#endregion

    //#region 高亮选中物体

    const raycaster = new THREE.Raycaster();
    const pointer = { x: 0, y: 0 };
    let selectedObjects: any[] = [];
    function addSelectedObject(object: any) {
      selectedObjects = [];/////////////////////
      selectedObjects.push(object);

    }


    var selectedObject: THREE.Object3D<THREE.Event> | THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]> | null = null;
    window.addEventListener('mousemove', function (event) {
      event.preventDefault();

      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      var intersects = raycaster.intersectObjects(scene.children, true);

      if (selectedObject) {
        ((selectedObject) as THREE.Mesh).material = material;
      }
      if (intersects.length > 0) {
        selectedObject = intersects[0].object;
        ((intersects[0].object) as THREE.Mesh).material = selectedMaterial;
        addSelectedObject(selectedObject);
        outlinePass.selectedObjects = selectedObjects;
      }
    })
    //#endregion
    //#region 控制三维视图旋转
    function animate() {
      requestAnimationFrame(animate);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();//不加会固定长宽比压缩
      controls.update();
      if (composer) {
        composer.render()
      }
      //renderer.render(scene, camera);
    };
    animate();
    //#endregion
  }
}


