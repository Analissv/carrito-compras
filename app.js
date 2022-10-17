const todosProductos = document.getElementById("todosProductos");
const templateCard = document.getElementById("template-card").content;
const invisible = document.createDocumentFragment();
const items = document.getElementById("items");
const totalCarrito = document.getElementById("total-carrito");
const templateCarrito = document.getElementById("template-carrito").content;
const templateTotalCarrito = document.getElementById("template-total-carrito").content;
let carrito = {};

document.addEventListener("DOMContentLoaded", ()=>{
    datos();
  if(localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"))
    hacerCarrito();
  }
})
todosProductos.addEventListener("click", e =>{
    llevarAlCarrito(e)
});

const datos = async()=>{
        const respuesta = await fetch("datos.json");
        const productos = await respuesta.json();
        hacerCards(productos);
        
    
}

const hacerCards = productos => {
    productos.forEach(producto => {
        templateCard.querySelector("h5").textContent = producto.nombre;
        templateCard.querySelector("p").textContent =producto.precio;
        templateCard.querySelector("img").setAttribute("src", producto.imagen);
        templateCard.querySelector("button").dataset.id = producto.id;


        const clon = templateCard.cloneNode(true);
        invisible.appendChild(clon);

    });
    todosProductos.appendChild(invisible);

}

const llevarAlCarrito = e =>{
    if(e.target.classList.contains("comprar")){
        llevarParaElCarro(e.target.parentElement);
    }
    e.stopPropagation();
}
const llevarParaElCarro = objeto =>{
    const prod = {
        nombre: objeto.querySelector("h5").textContent,
        precio: objeto.querySelector("p").textContent,
        id: objeto.querySelector(".comprar").dataset.id,
        cantidad: 1,
        
    }
    
    if(carrito.hasOwnProperty(prod.id)){
        prod.cantidad = carrito[prod.id].cantidad + 1;
    }
    carrito[prod.id] = {...prod};
    hacerCarrito();
}

const hacerCarrito = () =>{
    items.innerHTML = "";
    Object.values(carrito).forEach(el =>{
        templateCarrito.querySelector("th").textContent = el.id;
        templateCarrito.querySelectorAll("td")[0].textContent = el.nombre;
        templateCarrito.querySelectorAll("td")[1].textContent = el.cantidad;
        templateCarrito.querySelector(".aumentar").dataset.id = el.id;
        templateCarrito.querySelector(".disminuir").dataset.id = el.id;
        templateCarrito.querySelector("span").textContent = el.precio * el.cantidad;
        
        const clone = templateCarrito.cloneNode(true);
        invisible.appendChild(clone);
    })
    items.appendChild(invisible);
    hacerTotal();
    localStorage.setItem("carrito", JSON.stringify(carrito))
}

const hacerTotal = () =>{
    totalCarrito.innerHTML = "";
    if(Object.keys(carrito).length === 0){

        totalCarrito.innerHTML =  '<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>'
        return
    }
    const sumarCantidad = Object.values(carrito).reduce((acc, {cantidad}) =>acc + cantidad, 0);
    const sumarPrecio = Object.values(carrito).reduce((acc, {precio, cantidad}) => acc + cantidad*precio ,0);

    templateTotalCarrito.querySelectorAll("td")[0].textContent =  sumarCantidad;
    templateTotalCarrito.querySelector("span").textContent = sumarPrecio;

    const clon = templateTotalCarrito.cloneNode(true);
    invisible.appendChild(clon);
    totalCarrito.appendChild(invisible);

    const vaciar = document.getElementById("vaciar-carrito");
    vaciar.addEventListener("click", () =>{
        Swal.fire({
            title: 'El carro se ha vaciado.',
            width: 600,
            padding: '3em',
            color: '#22223b',
            background: '#fff url(https://img.freepik.com/psd-gratis/carrito-compras-3d_602782-22.jpg?size=338&ext=jpg&uid=R76737196&ga=GA1.2.1777241331.1659376232)',
            backdrop: `
              rgba(0,0,123,0.4)
              url("/images/nyan-cat.gif")
              left top
              no-repeat
            `
          })
       carrito = {};
        hacerCarrito();
   })
   addLocalStorage()
}

items.addEventListener("click", e =>{
    subirBajar(e)
})

const subirBajar = e => {
    if(e.target.classList.contains("aumentar")) {
       const btnaumentar = carrito[e.target.dataset.id];
       btnaumentar.cantidad++;
       carrito[e.target.dataset.id] = {...btnaumentar};
       hacerCarrito();
    }
    
    if(e.target.classList.contains("disminuir")) {
        const btdisminuir = carrito[e.target.dataset.id];
        btdisminuir.cantidad--;
        if(btdisminuir.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        }
        hacerCarrito()
    }
    e.stopPropagation()
}

function addLocalStorage(){
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

window.onload = function () {
   const sotorage = JSON.parse(localStorage.getItem('carrito'))
   if(sotorage){
    carrito = sotorage
    hacerCarrito()
   }
}