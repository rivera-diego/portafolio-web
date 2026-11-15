/* Flowing ribbons on a (2,3) torus knot, with a fixed viewing angle. */
(() => {
  const initialize = () => {
  const figure = document.querySelector('.hero-art');
  const canvas = document.querySelector('.sculpture-canvas');
  if (!figure || !canvas || navigator.connection?.saveData) return;
  const compact = matchMedia('(max-width: 700px)').matches || (navigator.hardwareConcurrency || 8) <= 4;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let gl;
  try { gl = canvas.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'low-power' }); } catch { return; }
  if (!gl) return; // Keep the original artwork when WebGL is unavailable.

  const vertexSource = `
    attribute vec2 aUV;
    attribute float aRibbon;
    uniform vec3 uAngles;
    uniform float uAspect;
    uniform float uTime;
    uniform bool uShadowPass;
    varying vec3 vNormal;
    varying vec3 vTangent;
    varying vec3 vBitangent;
    varying vec3 vPosition;
    varying vec3 vShadow;
    varying vec2 vUV;
    varying float vFace;
    varying float vRibbon;
    const float TAU = 6.28318530718;

    // Material coordinates travel along the closed knot. The camera and the
    // overall orientation stay fixed; each ribbon follows the curved body.
    vec3 surface(vec2 uv) {
      float material = uv.x * TAU;
      float t = material + uTime * 0.27;
      float radius = 1.12 + 0.36*cos(3.0*t);
      float dr = -1.08*sin(3.0*t);
      vec3 center = vec3(radius*cos(2.0*t),0.57*sin(3.0*t),radius*sin(2.0*t));
      vec3 tangent = normalize(vec3(
        dr*cos(2.0*t)-2.0*radius*sin(2.0*t),
        1.71*cos(3.0*t),
        dr*sin(2.0*t)+2.0*radius*cos(2.0*t)
      ));
      vec3 normal = normalize(cross(tangent,vec3(cos(2.0*t),0.0,sin(2.0*t))));
      vec3 binormal = normalize(cross(tangent,normal));
      // Small travelling bends and contractions give the body a supple motion.
      center += normal*0.055*sin(3.0*material-uTime*0.45)
              + binormal*0.035*sin(4.0*material-uTime*0.35);
      float wave = 1.0+0.035*sin(6.0*material);
      float section = uv.y*TAU;
      float twist = 2.0*material+0.16*sin(3.0*material-uTime*0.6);
      float angle = aRibbon*TAU/10.0+twist;
      vec3 radial = cos(angle)*normal+sin(angle)*binormal;
      vec3 lateral = -sin(angle)*normal+cos(angle)*binormal;
      // Each strip is a separate, closed sheet with a flat face and a bevel.
      // The thin radial section replaces the former rounded tubular ridges.
      float across = sign(cos(section))*pow(abs(cos(section)),0.24);
      float depth = sign(sin(section))*pow(abs(sin(section)),0.24);
      float width = 0.105*(1.0+0.025*sin(material*7.0+aRibbon));
      float tooth = 0.0018*(0.5+0.5*sin(material*420.0+aRibbon*2.0));
      vec3 spine = center+wave*(0.34*cos(angle)*normal+0.40*sin(angle)*binormal);
      return spine+lateral*across*(width+tooth)+radial*depth*0.009;

    }
    vec3 rotate(vec3 p) {
      float c = cos(uAngles.x), s = sin(uAngles.x);
      p = vec3(p.x, c*p.y-s*p.z, s*p.y+c*p.z);
      c = cos(uAngles.y); s = sin(uAngles.y);
      p = vec3(c*p.x+s*p.z, p.y, -s*p.x+c*p.z);
      c = cos(uAngles.z); s = sin(uAngles.z);
      return vec3(c*p.x-s*p.y, s*p.x+c*p.y, p.z);
    }
    void main() {
      vec3 point = surface(aUV);
      vec3 p = rotate(point);
      vec3 light = normalize(vec3(-3.0,4.0,5.0));
      vec3 right = normalize(cross(vec3(0.0,1.0,0.0),light));
      vec3 up = cross(light,right);
      vec3 shadowPosition = vec3(dot(p,right)/2.5,dot(p,up)/2.5,-dot(p,light)/5.0);
      float section=aUV.y*TAU;
      float across=sign(cos(section))*pow(abs(cos(section)),0.24);
      vUV=vec2(aUV.x,across*0.5+0.5);
      vFace=abs(sin(section));
      vRibbon=aRibbon;
      if (uShadowPass) {
        gl_Position = vec4(shadowPosition,1.0);
        return;
      }
      vShadow = shadowPosition*0.5+0.5;
      vPosition = p;
      // Recompute normals from the deformed surface so highlights follow it.
      vec3 du = surface(aUV+vec2(0.0001,0.0))-surface(aUV-vec2(0.0001,0.0));
      vec3 dv = surface(aUV+vec2(0.0,0.0001))-surface(aUV-vec2(0.0,0.0001));
      vNormal = rotate(normalize(cross(dv,du)));
      vTangent = rotate(normalize(du));
      vBitangent = rotate(normalize(dv));

      float perspective = 1.0 - p.z * 0.07;
      float scale = 2.02 / min(uAspect, 1.0);
      gl_Position = vec4(p.x/(scale*uAspect), p.y/scale, -p.z/6.0, perspective);
    }
  `;
  // Open perforations are cut in both passes, including their cast shadows.
  const perforations = `
    varying vec2 vUV;
    varying float vFace;
    varying float vRibbon;
    float holeMask() {
      vec2 grid=vec2(vUV.x*420.0,vUV.y*5.0);
      vec2 cell=floor(grid);
      vec2 local=fract(grid)-0.5;
      float panel=fract(sin(floor(cell.x/9.0)*17.13+vRibbon*3.7)*43758.5);
      float radius=mix(0.14,0.32,panel);
      float border=step(0.15,vUV.y)*step(vUV.y,0.85);
      float aa=0.04;
      #ifdef HAS_DERIVATIVES
        aa=max(0.04,fwidth(length(local))*0.55);
      #endif
      return (1.0-smoothstep(radius-aa,radius+aa,length(local)))*border*step(0.72,vFace);
    }
  `;
  // Derivatives keep the engraved detail stable as its projected size changes.
  const fragmentSource = `
    precision highp float;
    varying vec3 vNormal;
    varying vec3 vTangent;
    varying vec3 vBitangent;
    varying vec3 vPosition;
    varying vec3 vShadow;
    ${perforations}
    uniform sampler2D uShadowMap;
    uniform bool uShadowEnabled;
    uniform float uShadowTexel;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
    float noise(vec2 p) {
      vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
      return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),
                 mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x),f.y);
    }
    float shadow(float facing) {
      if (!uShadowEnabled) return 1.0;
      float visibility=0.0;
      float bias=max(0.00065,0.0022*(1.0-facing));
      for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++) {
        vec2 sampleUV=vShadow.xy+vec2(float(x),float(y))*uShadowTexel*1.4;
        vec2 packedDepth=texture2D(uShadowMap,sampleUV).rg;
        float depth=packedDepth.x+packedDepth.y/255.0;
        visibility+=step(vShadow.z-bias,depth);
      }
      return visibility/9.0;
    }
    void main() {
      float hole=holeMask();
      if(hole>0.98)discard;
      vec3 n=normalize(vNormal);
      if(!gl_FrontFacing)n=-n;
      float edgeDistance=min(vUV.y,1.0-vUV.y);
      float bevel=smoothstep(0.0,0.035,edgeDistance);
      float trim=1.0-smoothstep(0.015,0.045,edgeDistance);
      float pore=0.0;
      float grainPits=noise(vUV*vec2(1700.0,72.0)+vRibbon*13.0);
      float scratches=noise(vUV*vec2(920.0,320.0));
      float etched=smoothstep(0.7,0.9,grainPits)*0.14;
      float panelLine=1.0-smoothstep(0.01,0.035,abs(fract(vUV.x*46.0)-0.5));

      float patina=noise(vUV*vec2(110.0,38.0));
      float grain=noise(vUV*vec2(1900.0,620.0));
      float copperBand=0.25+0.75*step(7.5,vRibbon);
      vec3 ivory=vec3(0.74,0.72,0.65);
      vec3 copper=vec3(0.68,0.42,0.23);
      vec3 albedo=mix(ivory,copper,copperBand*trim*0.85);
      albedo*=mix(0.86,1.06,patina)*mix(0.91,1.0,grain);
      albedo*=1.0-etched-panelLine*0.12;
      albedo*=mix(0.87,1.0,scratches);
      albedo=pow(albedo,vec3(2.2));

      vec3 light=normalize(vec3(-3.0,4.0,5.0));
      vec3 view=normalize(vec3(0.0,0.0,12.0)-vPosition);
      float diffuse=max(dot(n,light),0.0);
      float visibility=shadow(diffuse);
      float fill=max(dot(n,normalize(vec3(3.0,1.0,1.0))),0.0)*0.045;
      float occlusion=mix(0.6,1.0,bevel);
      float specular=pow(max(dot(n,normalize(light+view)),0.0),mix(46.0,95.0,trim));
      vec3 color=albedo*(0.022+fill+1.45*diffuse*visibility)*occlusion;
      color+=vec3(1.0,0.88,0.69)*specular*(0.16+trim*0.3)*visibility*(1.0-pore)*bevel;
      float rim=pow(1.0-max(dot(n,view),0.0),4.0);
      color+=vec3(0.09,0.07,0.04)*rim*0.35*bevel;
      gl_FragColor=vec4(pow(max(color,vec3(0.0)),vec3(1.0/2.2)),1.0-hole);
    }
  `;
  const shadowFragmentSource = `
    precision highp float;
    ${perforations}
    void main() {
      if(holeMask()>0.5)discard;
      vec2 depth=fract(gl_FragCoord.z*vec2(1.0,255.0));
      depth.x-=depth.y/255.0;
      gl_FragColor=vec4(depth,0.0,1.0);
    }
  `;

  let program, shadowProgram, buffers = [];
  let shadowTexture, shadowDepth, shadowFramebuffer, shadowReady=false;
  const shadowSize=compact ? 768 : 1024;
  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader); throw new Error('Sculpture shader unavailable');
    }
    return shader;
  }
  const segments = compact ? 160 : 250, sides = 24, ribbons = 10;
  const vertices = [], indices = [];
  for(let ribbon=0;ribbon<ribbons;ribbon++) {
    const base=vertices.length/3;
    for(let i=0;i<=segments;i++)for(let j=0;j<=sides;j++) {
      // Offset samples from exact superellipse corners for finite normals.
      vertices.push(i/segments,(j+0.125)/sides,ribbon);
      if(i<segments&&j<sides){
        const a=base+i*(sides+1)+j,b=a+sides+1;
        indices.push(a,a+1,b,b,a+1,b+1);
      }
    }
  }
  const bufferData = new Float32Array(vertices);
  const indexData = new Uint16Array(indices);
  let uniforms, shadowUniforms;
  function makeProgram(fragment) {
    const vert=compile(gl.VERTEX_SHADER,vertexSource),frag=compile(gl.FRAGMENT_SHADER,fragment);
    const result=gl.createProgram();
    gl.attachShader(result,vert);gl.attachShader(result,frag);
    gl.bindAttribLocation(result,0,'aUV');gl.bindAttribLocation(result,1,'aRibbon');gl.linkProgram(result);
    gl.deleteShader(vert);gl.deleteShader(frag);
    if(!gl.getProgramParameter(result,gl.LINK_STATUS)) {
      gl.deleteProgram(result);throw new Error('Sculpture program unavailable');
    }
    return result;
  }
  function getUniforms(target) {
    const result={};
    for(const name of ['uAngles','uAspect','uTime','uShadowPass','uShadowMap','uShadowEnabled','uShadowTexel']) {
      result[name]=gl.getUniformLocation(target,name);
    }
    return result;
  }
  function setup() {
    const derivatives=gl.getExtension('OES_standard_derivatives');
    const prefix=derivatives?'#extension GL_OES_standard_derivatives : enable\n#define HAS_DERIVATIVES\n':'';
    program=makeProgram(prefix+fragmentSource);
    shadowProgram=makeProgram(shadowFragmentSource);
    uniforms=getUniforms(program);shadowUniforms=getUniforms(shadowProgram);
    const vertexBuffer=gl.createBuffer(),indexBuffer=gl.createBuffer();buffers=[vertexBuffer,indexBuffer];
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);gl.bufferData(gl.ARRAY_BUFFER,bufferData,gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,12,0);
    gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,1,gl.FLOAT,false,12,8);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indexData,gl.STATIC_DRAW);

    shadowTexture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,shadowTexture);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,shadowSize,shadowSize,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    shadowDepth=gl.createRenderbuffer();gl.bindRenderbuffer(gl.RENDERBUFFER,shadowDepth);
    gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,shadowSize,shadowSize);
    shadowFramebuffer=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,shadowFramebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,shadowTexture,0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,shadowDepth);
    shadowReady=gl.checkFramebufferStatus(gl.FRAMEBUFFER)===gl.FRAMEBUFFER_COMPLETE;
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.bindTexture(gl.TEXTURE_2D,null);
    gl.enable(gl.DEPTH_TEST);gl.disable(gl.BLEND);gl.disable(gl.DITHER);
  }
  try { setup(); } catch {
    buffers.forEach(buffer=>gl.deleteBuffer(buffer));
    if(program)gl.deleteProgram(program);if(shadowProgram)gl.deleteProgram(shadowProgram);
    if(shadowTexture)gl.deleteTexture(shadowTexture);if(shadowDepth)gl.deleteRenderbuffer(shadowDepth);
    if(shadowFramebuffer)gl.deleteFramebuffer(shadowFramebuffer);
    return;
  }

  let frame=0,last=0,elapsed=0,inView=false,lost=false;
  const paused = () => reduced.matches || document.documentElement.classList.contains('motion-off');
  function configure(target,locations,shadowPass) {
    gl.useProgram(target);
    gl.uniform1f(locations.uAspect,canvas.width/canvas.height);
    gl.uniform3f(locations.uAngles,1.0,.25,-.2);
    gl.uniform1f(locations.uTime,elapsed);
    gl.uniform1i(locations.uShadowPass,shadowPass);
  }
  function draw() {
    if(lost)return;
    if(shadowReady) {
      // Render the same deformed mesh from the light's viewpoint first.
      gl.disable(gl.SAMPLE_ALPHA_TO_COVERAGE);
      gl.bindTexture(gl.TEXTURE_2D,null);
      gl.bindFramebuffer(gl.FRAMEBUFFER,shadowFramebuffer);
      gl.viewport(0,0,shadowSize,shadowSize);
      gl.clearColor(1,1,1,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      configure(shadowProgram,shadowUniforms,true);
      gl.drawElements(gl.TRIANGLES,indexData.length,gl.UNSIGNED_SHORT,0);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);
    gl.viewport(0,0,canvas.width,canvas.height);
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.SAMPLE_ALPHA_TO_COVERAGE);
    configure(program,uniforms,false);
    gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,shadowTexture);
    gl.uniform1i(uniforms.uShadowMap,0);
    gl.uniform1i(uniforms.uShadowEnabled,shadowReady);
    gl.uniform1f(uniforms.uShadowTexel,1/shadowSize);
    gl.drawElements(gl.TRIANGLES,indexData.length,gl.UNSIGNED_SHORT,0);
    figure.classList.add('has-sculpture');
  }
  function tick(now) {
    frame=0;
    if(lost||!inView||document.hidden||paused()){last=0;return;}
    // Limit to 30 fps and clamp the delta after interrupted frames.
    if(!last)last=now;
    if(now-last>=1000/(compact ? 24 : 30)-1){elapsed+=Math.min((now-last)/1000,.1);last=now;draw();}
    frame=requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame);frame=0;last=0;
    if(lost||!inView||document.hidden)return;
    draw();if(!paused())frame=requestAnimationFrame(tick);
  }
  new ResizeObserver(() => {
    const {width,height}=canvas.getBoundingClientRect();
    const dpr=Math.min(devicePixelRatio||1,compact ? 1 : 1.5);
    canvas.width=Math.max(1,Math.round(width*dpr));canvas.height=Math.max(1,Math.round(height*dpr));
    sync();
  }).observe(canvas);
  new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;sync();},{threshold:0}).observe(figure);
  document.addEventListener('portfolio:motion',sync);
  document.addEventListener('visibilitychange',sync);
  reduced.addEventListener('change',sync);
  canvas.addEventListener('webglcontextlost',event=>{
    event.preventDefault();lost=true;cancelAnimationFrame(frame);figure.classList.remove('has-sculpture');
  });
  canvas.addEventListener('webglcontextrestored',()=>{
    try{setup();lost=false;sync();}catch{figure.classList.remove('has-sculpture');}
  });
  window.addEventListener('pagehide',()=>{cancelAnimationFrame(frame);frame=0;last=0;});
  window.addEventListener('pageshow',sync);
  };
  if ('requestIdleCallback' in window) requestIdleCallback(initialize,{timeout:1200});
  else setTimeout(initialize,0);
})();
