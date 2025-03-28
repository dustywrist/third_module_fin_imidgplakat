// загрузка 3д модели и подключение библиотике


import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

document.addEventListener('DOMContentLoaded', () => {
    function initThree() {
        const modelContainer = document.querySelector('.model');
        if (!modelContainer) {
            console.error('Контейнер .model не найден');
            return;
        }

        RectAreaLightUniformsLib.init();

        const scene = new THREE.Scene();

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#08FF0C');
        gradient.addColorStop(1, '#F7F7F7');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const texture = new THREE.CanvasTexture(canvas);
        scene.background = texture;

        const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 3000);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        modelContainer.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.maxDistance = 300;
        controls.maxPolarAngle = Math.PI / 2.3;
        controls.enableZoom = false;

        const loader = new GLTFLoader();
        const modelPath = './model/the_main_screen.glb';

        fetch(modelPath)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Ошибка загрузки: ${response.status} ${response.statusText}`);
                }
                return response;
            })
            .then(() => {
                loader.load(
                    modelPath,
                    (gltf) => {
                        const object = gltf.scene;
                        scene.add(object);
                        console.log('Модель загружена:', object);

                        const box = new THREE.Box3().setFromObject(object);
                        const center = box.getCenter(new THREE.Vector3());
                        const size = box.getSize(new THREE.Vector3());

                        object.position.sub(center);
                        object.position.y += 1.5;

                        const mediaQuery = window.matchMedia('(max-width: 1024px)');
                        const mediaQuery_2 = window.matchMedia('(max-width: 375px)');
                        
                        function updateModelScale() {
                            if (mediaQuery_2.matches) {
                                object.scale.set(1.1 / 1.8, 1.1 / 1.8, 1.1 / 1.7);  // Для экранов меньше 375px
                            } else if (mediaQuery.matches) {
                                object.scale.set(1.1 / 1.4, 1.1 / 1.4, 1.1 / 1.4);  // Для экранов меньше 1024px
                            } else {
                                object.scale.set(1.1, 1.1, 1.1);  // для экранов больше 1024px
                            }
                        }
                        
                     
                        updateModelScale();
                        
                
                        mediaQuery.addEventListener('change', updateModelScale);
                        mediaQuery_2.addEventListener('change', updateModelScale);
                        

                        const maxDim = Math.max(size.x, size.y, size.z);
                        const fov = camera.fov * (Math.PI / 180);
                        let distance = Math.abs(maxDim / Math.sin(fov / 2));

                        distance *= 0.6;

                        camera.position.set(0, 0, distance);
                        controls.target.set(0, 0, 0);
                        controls.update();

                        let startTime = Date.now();
                        const duration = 4000;
                        const amplitude = 1;

                        function animate() {
                            const elapsedTime = Date.now() - startTime;
                            const cycleTime = duration * 2;

                            const yPosition = amplitude * Math.sin((2 * Math.PI * elapsedTime) / cycleTime);
                            object.position.y = 2 + yPosition;

                            requestAnimationFrame(animate);
                            controls.update();
                            renderer.render(scene, camera);
                        }

                        animate();
                    },
                    undefined,
                    (error) => console.error('Ошибка загрузки модели:', error)
                );
            })
            .catch((error) => console.error('Проверка файла не удалась:', error));

        const ambientLight = new THREE.AmbientLight(0xeeeeee, 0.5);
        scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.7);
        directionalLight1.position.set(5, 5, 5);
        scene.add(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.7);
        directionalLight2.position.set(-5, 5, -5);
        scene.add(directionalLight2);

        const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.7);
        directionalLight3.position.set(0, -5, 5);
        scene.add(directionalLight3);

        const directionalLight4 = new THREE.DirectionalLight(0xffffff, 0.7);
        directionalLight4.position.set(5, -5, -5);
        scene.add(directionalLight4);

        const directionalLight5 = new THREE.DirectionalLight(0xffffff, 0.7);
        directionalLight5.position.set(-5, -5, 5);
        scene.add(directionalLight5);

        const pointLight = new THREE.PointLight(0xffffff, 0.2);
        pointLight.position.set(0, 5, 0);
        scene.add(pointLight);

        const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x444444, 0.3);
        scene.add(hemisphereLight);

        function animateScene() {
            requestAnimationFrame(animateScene);
            renderer.render(scene, camera);
        }
        animateScene();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        new Swiper('.swiper-container', {
            loop: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }

    initThree();
});









function getRandomValue(min, max) {
  return Math.random() * (max - min) + min;
}

const scrollImagesNodeList = document.querySelectorAll('.scroll-image');
const scrollImages = Array.from(scrollImagesNodeList);


scrollImages.forEach(img => {
  const randomX = getRandomValue(-30, 30);
  const randomY = getRandomValue(-30, 30);
  const randomScale = getRandomValue(0.5, 1.5);
  img.dataset.transform = `translate(${randomX}vw, ${randomY}vh) scale(${randomScale})`;
  img.dataset.order = Math.random();
  img.style.opacity = '0';
});


scrollImages.sort((a, b) => parseFloat(a.dataset.order) - parseFloat(b.dataset.order));


let scrollPosition = 0;

function handleScroll(event) {
  event.preventDefault(); 
  const delta = event.deltaY > 0 ? 1 : -1;
  scrollPosition += delta;
  if (scrollPosition < 0) scrollPosition = 0;
  
 
  const imagesToShow = Math.min(scrollImages.length, Math.floor(scrollPosition));
  
  
  scrollImages.forEach((img, index) => {
    if (index < imagesToShow) {
      img.style.opacity = '1';
      
      img.style.transform = img.dataset.transform;
    
      img.style.zIndex = index + 1;

    } else {
      img.style.opacity = '0';
    }
  });
}

const screen6 = document.querySelector('.the_fourth_me_screen_scroll');
if (screen6) {
  screen6.addEventListener('wheel', handleScroll, { passive: false });
}


const menuButton = document.querySelector('.menu_button');
const closeMenuButton = document.querySelector('.close_menu_button');
const messageMenuButton = document.querySelector('.message_menu_button');
const ilovemeButton = document.querySelector('.me_menu_button');
const libraryButton = document.querySelector('.library_menu_button');
const plastinka1 = document.querySelector('.the_main_plastinka');
const galleryButton = document.querySelector('.hi_me_screen');
const menuAdapt = document.querySelector('.menu_adapt');

const menuOpen = document.querySelector('.menu_open');
const shrinkableElements = document.querySelectorAll('.constant_line, .information_line');
const model3D = document.querySelector('.model');
const galleryImages = document.querySelectorAll('.small_gallery img');

// экраны
const screen1 = document.querySelector('.the_first_screen');
const screen3 = document.querySelector('.the_third_library_screen');
const screen4 = document.querySelector('.the_fourth_me_screen');
const screen5 = document.querySelector('.gallery_screen');
const screen7 = document.querySelector ('.gradient_hi_screen')



const screens = [screen1, screen3, screen4, screen5, screen6, screen7];


function switchScreen(targetScreen) {
  screens.forEach(screen => screen.classList.remove('visible'));
  targetScreen.classList.add('visible');
}


function getCurrentScreen() {
  return screens.find(screen => screen.classList.contains('visible'));
}


messageMenuButton.addEventListener('click', () => switchScreen(screen1));
ilovemeButton.addEventListener('click', () => switchScreen(screen4));
libraryButton.addEventListener('click', () => switchScreen(screen3));
plastinka1.addEventListener('click', () => switchScreen(screen5));
galleryButton.addEventListener('click', () => switchScreen(screen6));


[...shrinkableElements, model3D].forEach(el => {
  if (el) el.style.transition = 'transform 0.5s ease, width 0.5s ease';
});


function adjustElementsWidth(isMenuOpen) {
  if (mediaQuery.matches) {
   
    shrinkableElements.forEach(element => {
      element.style.transition = 'none'; 
      element.style.transform = 'translateX(0)'; 
    });

    if (model3D) {
      model3D.style.transition = 'none'; 
      model3D.style.transform = 'translateX(0)'; 
    }

    if (plastinka1) {
      plastinka1.style.transition = 'none'; 
      plastinka1.style.transform = 'translateX(0)'; 
    }

    if (galleryButton) {
      galleryButton.style.transition = 'none'; 
      galleryButton.style.transform = 'translateX(0)'; 
    }

  } else {
    
    shrinkableElements.forEach(element => {
      element.style.transition = 'transform 0.5s ease, width 0.5s ease'; 
      element.style.width = isMenuOpen ? 'calc(100vw - 30vw)' : '100vw';
      element.style.transform = isMenuOpen ? 'translateX(15vw)' : 'translateX(0)';
    });

    if (model3D) {
      model3D.style.transition = 'transform 0.5s ease'; 
      model3D.style.transform = isMenuOpen ? 'translateX(15vw)' : 'translateX(0)';
    }

    if (plastinka1) {
      plastinka1.style.transition = 'transform 0.5s ease, width 0.5s ease'; 
      plastinka1.style.width = isMenuOpen ? 'calc(100vw + 30vw)' : '100vw';
      plastinka1.style.transform = isMenuOpen ? 'translateX(15vw)' : 'translateX(0)';
    }

    if (galleryButton) {
      galleryButton.style.transition = 'transform 0.5s ease, width 0.5s ease'; 
      galleryButton.style.width = isMenuOpen ? 'calc(100vw + 30vw)' : '100vw';
      galleryButton.style.transform = isMenuOpen ? 'translateX(15vw)' : 'translateX(0)';
    }
  }
}


menuButton.addEventListener('click', () => {
  const currentScreen = getCurrentScreen();
  if (currentScreen === screen5) switchScreen(screen3);
  if (currentScreen === screen6) switchScreen(screen4);
  menuOpen.style.display = 'flex';
  setTimeout(() => {
    menuOpen.classList.add('active');
    adjustElementsWidth(true);
  }, 10);
  menuButton.style.display = 'none';
  closeMenuButton.style.display = 'block';
});


closeMenuButton.addEventListener('click', () => {
  menuOpen.classList.remove('active');
  setTimeout(() => {
    menuOpen.style.display = 'none';
    menuButton.style.display = 'flex';
    closeMenuButton.style.display = 'none';
    adjustElementsWidth(false);
  }, 300);
});


galleryImages.forEach((img, index) => {
  img.addEventListener('mouseenter', () => {
    galleryImages.forEach(i => i.className = '');
    img.classList.add('active');
    if (galleryImages[index - 1]) galleryImages[index - 1].classList.add('neighbor');
    if (galleryImages[index + 1]) galleryImages[index + 1].classList.add('neighbor');
    if (galleryImages[index - 2]) galleryImages[index - 2].classList.add('second-neighbor');
    if (galleryImages[index + 2]) galleryImages[index + 2].classList.add('second-neighbor');
  });
});


plastinka1.addEventListener('click', () => {
  if (menuOpen.classList.contains('active')) closeMenuButton.click();
  switchScreen(screen5);
});

galleryButton.addEventListener('click', () => {
  if (menuOpen.classList.contains('active')) closeMenuButton.click();
  switchScreen(screen6);
});

screen7.addEventListener('click', () => {
  if (menuOpen.classList.contains('active')) closeMenuButton.click();
});


menuAdapt.addEventListener('click', () => {
  menuOpen.classList.remove('active');
  setTimeout(() => {
    menuOpen.style.display = 'none';
    menuButton.style.display = 'flex';
    closeMenuButton.style.display = 'none';
    adjustElementsWidth(false);
  }, 300);
});

const mediaQuery = window.matchMedia('(max-width: 1024px)');
const divsToHide = document.querySelectorAll('.Image_12, .Image_13, .Image_1'); 

function updateDivVisibility() {
    divsToHide.forEach(div => {
        div.style.display = mediaQuery.matches ? 'none' : 'block';
    });
}

updateDivVisibility();
mediaQuery.addEventListener('change', updateDivVisibility);

menuButton.addEventListener('click', () => {
  menuAdapt.classList.add('visible');
});


menuAdapt.addEventListener('click', () => {
  menuAdapt.classList.remove('visible');
});

const progressBar = document.getElementById('progress-bar');
const progressBarContainer = document.querySelector('.progress-bar-container');
const progressValue = document.getElementById("progress-value");

progressBar.addEventListener("progress", () => {
  const value = (progressBar.value / progressBar.max) * 100;
  progressValue.textContent = Math.round(value) + "%";
});

loadingManager.onLoad = function() {
  progressBarContainer.style.display = 'none';
}

loadingManager.onProgress = function(url, loaded, total) {
  progressBar.value = (loaded / total) * 100;
}







