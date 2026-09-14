"use client";
import { useEffect, useRef } from "react";
export function FlowField() {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = container.current;
    if (
      !host ||
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      matchMedia("(max-width: 767px)").matches
    )
      return;
    let disposed = false,
      frame = 0,
      observer: IntersectionObserver | undefined,
      resize: ResizeObserver | undefined;
    let release = () => {};
    const start = async () => {
      const { Renderer, Geometry, Program, Mesh } = await import("ogl");
      if (disposed) return;
      try {
        const renderer = new Renderer({
          alpha: true,
          antialias: false,
          dpr: Math.min(devicePixelRatio, 2),
          powerPreference: "low-power",
        });
        const gl = renderer.gl;
        host.appendChild(gl.canvas);
        gl.clearColor(0, 0, 0, 0);
        const count = 14400;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
          positions[i * 3] = (i % 240) / 240;
          positions[i * 3 + 1] = Math.floor(i / 240) / 59;
          positions[i * 3 + 2] = Math.sin(i * 123.45) * 0.5 + 0.5;
        }
        const geometry = new Geometry(gl, {
          position: { size: 3, data: positions },
        });
        const uniforms = {
          uTime: { value: 0 },
          uMouse: { value: [-9, -9] },
          uAspect: { value: 1 },
          uDpr: { value: renderer.dpr },
          uScroll: { value: 0 },
          uForce: { value: 0 },
        };
        const program = new Program(gl, {
          transparent: true,
          depthTest: false,
          depthWrite: false,
          uniforms,
          vertex: `precision highp float;
attribute vec3 position; uniform float uTime; uniform float uAspect; uniform float uDpr; uniform float uScroll; uniform float uForce; uniform vec2 uMouse; varying float vAlpha; varying float vTone;
float hash(float n){return fract(sin(n)*43758.5453);} float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(dot(i,vec2(127.1,311.7))),hash(dot(i+vec2(1,0),vec2(127.1,311.7))),f.x),mix(hash(dot(i+vec2(0,1),vec2(127.1,311.7))),hash(dot(i+vec2(1,1),vec2(127.1,311.7))),f.x),f.y);}
vec2 curlNoise(vec2 p){float e=.03;float dx=noise(p+vec2(e,0))-noise(p-vec2(e,0));float dy=noise(p+vec2(0,e))-noise(p-vec2(0,e));return vec2(dy,-dx)/(2.*e);}
void main(){float t=fract(position.x+uTime*.027);float lane=position.y*2.-1.;float settle=smoothstep(.03,.89,t);float x=t*2.9-1.45;vec2 curl=curlNoise(vec2(t*4.+uTime*.075,lane*3.));float chaos=curl.y*.22*(1.-uScroll*.65);float wave=sin(t*8.3+lane*2.7+uTime*.15)*.28*sin(t*3.14159)*(1.-uScroll*.5);float y=mix(lane*.75+chaos,lane*.26,settle)+wave; y+=sin(t*5.4-1.2)*.21;vec2 pt=vec2(x,y);pt.x+=curl.x*.07*(1.-settle);vec2 diff=pt-uMouse;float dist=length(diff*vec2(uAspect,1.));pt+=normalize(diff+.001)*exp(-dist*5.)*.17*uForce;gl_Position=vec4(pt,0.,1.);gl_PointSize=(.9+position.z*.7)*uDpr;vAlpha=(.14+.65*settle)*smoothstep(0.,.1,t)*smoothstep(1.,.86,t);vTone=settle;}`,
          fragment: `precision highp float;varying float vAlpha;varying float vTone;void main(){float d=length(gl_PointCoord-.5);float a=smoothstep(.5,.1,d)*vAlpha;vec3 c=mix(vec3(.35,.34,1.),vec3(.83,.88,1.),vTone);gl_FragColor=vec4(c,a);}`,
        });
        const mesh = new Mesh(gl, { geometry, program, mode: gl.POINTS });
        let active = true;
        let last = 0;
        let elapsed = 0;
        let targetForce = 0;
        let pointerIdle = 0;
        const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
        const draw = (now: number) => {
          frame = 0;
          if (!active || document.hidden || motionPreference.matches) return;
          frame = requestAnimationFrame(draw);
          if (now - last < 30) return;
          elapsed += Math.min((now - last) / 1000, 0.05);
          last = now;
          uniforms.uTime.value = elapsed;
          uniforms.uForce.value += (targetForce - uniforms.uForce.value) * 0.06;
          uniforms.uScroll.value = Math.min(
            1,
            window.scrollY / (host.closest("section")?.clientHeight || 900),
          );
          renderer.render({ scene: mesh });
        };
        const size = () => {
          renderer.setSize(host.clientWidth, host.clientHeight);
          uniforms.uAspect.value = host.clientWidth / host.clientHeight;
        };
        resize = new ResizeObserver(size);
        resize.observe(host);
        size();
        const move = (event: PointerEvent) => {
          const r = host.getBoundingClientRect();
          uniforms.uMouse.value = [
            ((event.clientX - r.left) / r.width) * 2 - 1,
            1 - ((event.clientY - r.top) / r.height) * 2,
          ];
          targetForce = 1;
          window.clearTimeout(pointerIdle);
          pointerIdle = window.setTimeout(() => {
            targetForce = 0;
          }, 250);
        };
        const leave = () => {
          window.clearTimeout(pointerIdle);
          targetForce = 0;
        };
        host.addEventListener("pointermove", move);
        host.addEventListener("pointerleave", leave);
        const resume = () => {
          if (active && !document.hidden && !motionPreference.matches && !frame)
            frame = requestAnimationFrame(draw);
        };
        document.addEventListener("visibilitychange", resume);
        motionPreference.addEventListener("change", resume);
        observer = new IntersectionObserver(
          ([entry]) => {
            active = entry.isIntersecting;
            if (active) resume();
            else {
              cancelAnimationFrame(frame);
              frame = 0;
            }
          },
          { rootMargin: "80px" },
        );
        observer.observe(host);
        frame = requestAnimationFrame(draw);
        release = () => {
          window.clearTimeout(pointerIdle);
          host.removeEventListener("pointermove", move);
          host.removeEventListener("pointerleave", leave);
          document.removeEventListener("visibilitychange", resume);
          motionPreference.removeEventListener("change", resume);
          geometry.remove();
          program.remove();
          gl.getExtension("WEBGL_lose_context")?.loseContext();
          gl.canvas.remove();
        };
      } catch {
        /* The server-rendered figure remains visible if WebGL is unavailable. */
      }
    };
    const idle = window.setTimeout(() => void start(), 700);
    return () => {
      disposed = true;
      clearTimeout(idle);
      cancelAnimationFrame(frame);
      observer?.disconnect();
      resize?.disconnect();
      release();
    };
  }, []);
  return <div ref={container} className="flow-canvas" aria-hidden="true" />;
}
