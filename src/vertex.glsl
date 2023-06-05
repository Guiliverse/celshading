precision highp float;
precision highp int;

attribute vec3 position;
attribute vec3 normal;

uniform mat3 normalMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
    vNormal = vec3(normalMatrix * normal);
    vec3 newPosition = position;
    vec4 modelViewPosition = modelViewMatrix * vec4(newPosition, 1.0);
    vViewPosition = vec3(modelViewPosition) / modelViewPosition.w;
    gl_Position = projectionMatrix * modelViewPosition;

}