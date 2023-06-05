precision highp float;
precision highp int;

uniform float uLightness;
uniform float uSpecularDistance;
uniform float uSpecularSmooth;
uniform float uBandsAA;
uniform vec3 uLightPosition;
uniform vec3 uAmbientColor;
uniform vec3 uLightColor;
uniform vec3 uSpecularColor;

varying vec3 vNormal;
varying vec3 vViewPosition;

#define BANDS 4

void main() {
    vec3 color = vec3(uLightColor + uLightness);

    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(uLightPosition - vViewPosition);
    vec3 reflectDir = reflect(-lightDir, normal);
    vec3 viewDir = normalize(-vViewPosition);

    float lambertian = max(dot(lightDir, normal), 0.0);
    float specular = 0.0;
    float light = 0.0;

    float specAngle = max(dot(reflectDir, viewDir), 0.0);
    
    float AABands = uBandsAA;
    float bandFract = 1.0 / float(BANDS);
    for (int i = 1; i <= BANDS; ++i) {
        float d = 1.0 - (1. / float(i));
        light += smoothstep(d, d + AABands, lambertian) * bandFract;
    }

    specular = smoothstep(0.0, uSpecularSmooth, pow(specAngle, uSpecularDistance)) ;
   
    gl_FragColor = vec4(uAmbientColor +
                    light * color +
                    specular * uSpecularColor, 1.0);
}