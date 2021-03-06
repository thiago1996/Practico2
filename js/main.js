const tareaInput = document.getElementById("nuevaTareaInput");
let botonAgregarTarea = document.getElementById("agregarTarea");
let lista = document.getElementById("lista");
let botonFullScreen = document.getElementById("fullscreen");
let checkbox = document.getElementsByClassName("checkbox").children;
let geo = {lat:null , lon:null};
let tareas = [];
let tareasAlmacenadas = [];

botonAgregarTarea.addEventListener("click", function(e){
  e.preventDefault();
  textoTarea = tareaInput.value;
  agregarTarea(textoTarea,false);
  almacenarTarea(textoTarea);
});

botonFullScreen.addEventListener("click", function(e){
  if(document.documentElement.requestFullscreen){
    
  if(document.fullscreenElement == null){

    document.getElementById('fullscreen').className = 'exitFullscreen';
    document.documentElement.requestFullscreen();
 
  }
  else{
    document.getElementById('fullscreen').className = 'fullscreen';
    document.exitFullscreen();
  }
   }
});

function agregarTarea(texto, completado) {

  const li= document.createElement("li");
  
   if(completado==false){
  li.innerHTML = `
    <input  type="checkbox" class="checkbox" onchange=almacenarChecked(this)>
    <p>${texto}</p>
    <button class="copiarTarea btn" onclick=copiarTarea(this)></button>
    <button class="compartirTarea btn" class="btn" onclick=compartirTarea(this)></button>
    <button class="eliminarTarea btn" onclick="eliminarTarea(this)"></button>
  `;

  }
  else
    {
      li.innerHTML = `
    <input  type="checkbox" class="checkbox" checked="true" onchange=almacenarChecked(this)>
    <p>${texto}</p>
    <button class="copiarTarea btn" onclick=copiarTarea(this)></button>
    <button class="compartirTarea btn" class="btn" onclick=compartirTarea(this)></button>
    <button class="eliminarTarea btn" onclick="eliminarTarea(this)"></button>
  `;
    }

  lista.prepend(li);
  
}

function eliminarTarea(b){

  b.parentElement.remove();
  eliminarAlmacenamientoTarea(b.parentElement.children[1].innerText);

}

function copiarTarea(b){

  if(navigator.clipboard != undefined){
    navigator.clipboard.writeText(b.parentElement.children[1].innerText)
    .then(
      () => console.log("copiado!")
    )
  
    .catch(err => console.log("error!"));
  }
}

function compartirTarea(b){

  if(!("share" in navigator)){

alert("API WEB SHARE NO COMPATIBLE")
return;
} 

texto = b.parentElement.children[1].innerText;

  navigator.share({ 
    
    title:"Comparto una tarea de mi lista",
    text: texto,
    url:document.URL

    }
    ).then(
      () => console.log("compartido!")
    ) 
    .catch(err => console.log("error: ", error)
    );
  
}

function getUbicacion(){

    if('geolocation' in navigator) {
navigator.geolocation.getCurrentPosition(
   function (location) {
        geo.lat = location.coords.latitude;
        geo.lon = location.coords.longitude;
    },
    function(err) {
        console.warn(err);
        geo.lat = null;
        geo.lon = null;
    }
);
}
else {
    return null;
}

}

function almacenarTarea(textoTarea)
{
  let id=0;
  let estado=false;
  tareasAlmacenadas = JSON.parse(localStorage.getItem("tareas"));
  tareas =[];


  if(tareasAlmacenadas!=null){ 

    id=tareasAlmacenadas.length;
    
  for(let i=0;i<tareasAlmacenadas.length; i++)
        {
          tareas.push({
            "id": tareasAlmacenadas[i].id,
            "texto": tareasAlmacenadas[i].texto,
            "completado": tareasAlmacenadas[i].completado,
            "ubicacion": tareasAlmacenadas[i].ubicacion
            });
          }

}
    tareas.push({
      "id": id,
      "texto": textoTarea,
      "completado": estado,
      "ubicacion": {"lat":geo.lat, "lon": geo.lon}
      });

    localStorage.setItem("tareas",JSON.stringify(tareas));

}

function recuperarTareas()
{
    tareasAlmacenadas= JSON.parse(localStorage.getItem("tareas"));
    
    if(tareasAlmacenadas !=null){ 
 
        for(let i=0;i<tareasAlmacenadas.length; i++)
        {

      agregarTarea(tareasAlmacenadas[i].texto, tareasAlmacenadas[i].completado);

      }
    }

    }

    function eliminarAlmacenamientoTarea(textoTarea){
      
      tareasAlmacenadas= JSON.parse(localStorage.getItem("tareas"));
      tareas=[];

      for(let i=0;i<tareasAlmacenadas.length; i++)
        {
          if(tareasAlmacenadas[i].texto!=textoTarea)
          {
            tareas.push({
              "id": tareasAlmacenadas[i].id,
              "texto": tareasAlmacenadas[i].texto,
              "completado": tareasAlmacenadas[i].completado,
              "ubicacion": tareasAlmacenadas[i].ubicacion
              });
          }
          }
          localStorage.setItem("tareas",JSON.stringify(tareas));

    }

window.onload = function() {
 
 
  getUbicacion();
  recuperarTareas();
 
}

function almacenarChecked(c){

  
  tareasAlmacenadas= JSON.parse(localStorage.getItem("tareas"));
  let estado= false;
     
  tareas=[];
       
       for(let i=0;i<tareasAlmacenadas.length; i++)
        {      
          if(tareasAlmacenadas[i].texto != c.parentElement.children[1].innerText)
          {
            estado=tareasAlmacenadas[i].completado;
          }
          else{    
            estado=c.checked;
          }
          {
            tareas.push({
              "id": tareasAlmacenadas[i].id,
              "texto": tareasAlmacenadas[i].texto,
              "completado": estado,
              "ubicacion": tareasAlmacenadas[i].ubicacion
              });
          }
          }
          localStorage.setItem("tareas",JSON.stringify(tareas));
    }