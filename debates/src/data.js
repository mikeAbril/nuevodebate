const API_KEY = "AIzaSyAYxosLe9ts62wxwRESgaSxrLcL8CuOs78";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const personaje1 = "Gustavo Petro, Presidente de Colombia"
const personaje2 = "adolfo hitler" 

const debate = "tema aleatorio que los haga debatir"

// En tu archivo data.js

const prompt = `
Actúa como un moderador llamado Deivi. 
Inicia un debate breve entre dos personas:
- ${personaje1}
- ${personaje2}

El tema del debate es: ${debate}.
Quiero que las respuestas de los participantes y del moderador sean cortas, concisas y mantengan una conversación fluida.
Formatea la respuesta en HTML, usando etiquetas <p> para cada línea de diálogo y etiquetas <b> para los nombres. No incluyas ningún código extra.
`;
const chatContainer = document.getElementById("chat");
const headers = {
    'Content-Type': 'application/json'
};

const data = {
    "contents": [
        {
            "parts": [
                {
                    "text": prompt,
                }
            ]
        }
    ]
};

// Se utiliza 'async/await' para manejar la solicitud de forma asíncrona
async function generateContent() {
    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const responseData = await response.json();
        // Extrae el texto de la respuesta de la IA
        const generatedText = responseData.candidates[0].content.parts[0].text;
        console.log("Respuesta de la IA:");
        
        pintarDatos(generatedText)

    } catch (error) {
        console.error("Hubo un error al llamar a la API:", error);
    }
}



function limpiarChat(){
    document.getElementById("chat").innerHTML = "";
}


function pintarDatos(texto){
    const nuevoMensaje = document.createElement("div");
    
    // Procesar el texto para agregar las clases de Tailwind
    let contenidoHTML = texto.replace(/<p>/g, (match, offset) => {
        const baseClasses = "mx-4 my-2 p-3 rounded-lg max-w-[80%] break-words";
        if (texto.substring(offset, offset + 15).includes("Deivi:")) {
            // Mensaje del moderador (centrado)
            return `<p class="${baseClasses} bg-gray-200 text-center mx-auto max-w-[60%]">`;
        } else if (texto.substring(offset, offset + 20).includes("Gustavo Petro:")) {
            // Mensajes de Personaje 1 (alineados a la derecha)
            return `<p class="${baseClasses} bg-green-100 ml-auto">`;
        } else if (texto.substring(offset, offset + 20).includes("adolfo hitler:")) {
            // Mensajes de Personaje 2 (alineados a la izquierda)
            return `<p class="${baseClasses} bg-white shadow-sm mr-auto">`;
        }
        return match;
    });

    // Estilizar los nombres en negrita
    contenidoHTML = contenidoHTML.replace(/<b>/g, '<b class="text-gray-700 font-medium block mb-1">');
    
    nuevoMensaje.innerHTML = contenidoHTML;
    chatContainer.appendChild(nuevoMensaje);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}