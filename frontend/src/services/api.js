const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export async function apiFetch(endpoint, options = {}){

    const defaultHeaders = {
        "Content-Type": "application/json",
    };

    const response = await 
    fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorData = await 
        response.json().catch(() => ({}));

        const error = new
        Error(errorData.message || "Error en la peticion");
        error.status = response.status;
        throw error;
    }

    return response.json();
}
