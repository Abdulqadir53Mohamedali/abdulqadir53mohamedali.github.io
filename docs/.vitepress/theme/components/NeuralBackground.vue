<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

// Neural field adapted from Inspira UI's NeuralBg (MIT); see /THIRD_PARTY_NOTICES.md.
const canvas = ref<HTMLCanvasElement>()
const layer = ref<HTMLElement>()
let dispose = () => {}
onMounted(() => {
  const el = canvas.value!
  const gl = el.getContext('webgl', { alpha: true, antialias: false, depth: false, powerPreference: 'low-power' })
  if (!gl) return // CSS keeps a quiet, static colour wash as a fallback.
  const shaders: WebGLShader[] = []
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!
    shaders.push(shader)
    gl.shaderSource(shader, source); gl.compileShader(shader)
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null
  }
  const vertex = compile(gl.VERTEX_SHADER, `attribute vec2 position; varying vec2 vUv;
    void main(){vUv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`)
  const fragment = compile(gl.FRAGMENT_SHADER, `precision mediump float;
    varying vec2 vUv; uniform float time; uniform float ratio;
    vec2 rotate(vec2 p,float a){return mat2(cos(a),sin(a),-sin(a),cos(a))*p;}
    float neural(vec2 uv,float t){
      vec2 acc=vec2(0.);vec2 result=vec2(0.);float scale=8.;
      for(int j=0;j<15;j++){
        uv=rotate(uv,1.);acc=rotate(acc,1.);
        vec2 field=uv*scale+float(j)+acc-t;
        acc+=sin(field);result+=(.5+.5*cos(field))/scale;scale*=1.2;
      }return result.x+result.y;
    }
    void main(){
      vec2 uv=.5*vUv;uv.x*=ratio;
      float n=neural(uv,time*.22);
      n=1.2*pow(n,3.);n+=pow(n,10.);n=max(0.,n-.5);
      n*=1.-length(vUv-.5);
      vec3 purple=vec3(.60,.38,.91),blue=vec3(.28,.48,.78),gold=vec3(.78,.64,.36);
      vec3 color=mix(purple,blue,smoothstep(.15,.85,vUv.x));
      color=mix(color,gold,.24*pow(.5+.5*sin(vUv.y*6.+time*.12),4.));
      float alpha=clamp(n*.55,0.,.56);
      gl_FragColor=vec4(color*alpha,alpha);
    }`)
  const program = gl.createProgram()!
  if (!vertex || !fragment) { shaders.forEach(s => gl.deleteShader(s)); gl.deleteProgram(program); return }
  gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { shaders.forEach(s => gl.deleteShader(s)); gl.deleteProgram(program); return }
  gl.useProgram(program)
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW)
  const position = gl.getAttribLocation(program, 'position')
  gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0)
  const time = gl.getUniformLocation(program,'time'), ratio = gl.getUniformLocation(program,'ratio')
  const motion = matchMedia('(prefers-reduced-motion: reduce)')
  let frame = 0, visible = false, last = 0, elapsed = 12, lost = false
  const draw = () => { gl.uniform1f(time,elapsed); gl.drawArrays(gl.TRIANGLES,0,6) }
  const resize = () => {
    const rect = el.getBoundingClientRect()
    // Cap backing resolution, especially on high-DPI mobile screens.
    const scale = Math.min(devicePixelRatio, rect.width < 761 ? 1 : 1.25, 1600 / rect.width)
    el.width = Math.round(rect.width*scale); el.height = Math.round(rect.height*scale)
    gl.viewport(0,0,el.width,el.height); gl.uniform1f(ratio,rect.width/rect.height)
    if (!lost) draw()
  }
  const tick = (now: number) => {
    if (now-last >= 1000/30) { elapsed += Math.min((now-last)/1000,.1); last=now; draw() }
    frame=requestAnimationFrame(tick)
  }
  const sync = () => {
    cancelAnimationFrame(frame)
    if (!lost && visible && !document.hidden && !motion.matches) { last=performance.now(); frame=requestAnimationFrame(tick) }
  }
  const observer = new IntersectionObserver(entries => { visible=entries[0].isIntersecting; sync() })
  observer.observe(layer.value!)
  const sizeObserver = new ResizeObserver(resize); sizeObserver.observe(el)
  const contextLost = (event: Event) => { event.preventDefault(); lost=true; sync() }
  el.addEventListener('webglcontextlost',contextLost)
  document.addEventListener('visibilitychange',sync); motion.addEventListener('change',sync)
  resize()
  dispose = () => {
    cancelAnimationFrame(frame); observer.disconnect(); sizeObserver.disconnect()
    document.removeEventListener('visibilitychange',sync); motion.removeEventListener('change',sync)
    el.removeEventListener('webglcontextlost',contextLost)
    gl.deleteBuffer(buffer); shaders.forEach(s => gl.deleteShader(s)); gl.deleteProgram(program)
  }
})
onBeforeUnmount(() => dispose())
</script>

<template>
  <div ref="layer" class="av-neural-layer" aria-hidden="true"><div class="av-neural-viewport"><canvas ref="canvas" /></div></div>
</template>

<style scoped>
.av-neural-layer { position:absolute; inset:0; pointer-events:none; z-index:0; }
.av-neural-viewport { position:sticky; top:0; width:100%; height:100vh; height:100svh; background:radial-gradient(ellipse at 20% 30%,#66469718,transparent 65%),radial-gradient(ellipse at 85% 70%,#355d9220,transparent 65%); }
canvas { display:block; width:100%; height:100%; filter:blur(3px); }
</style>
