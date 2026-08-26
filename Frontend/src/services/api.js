
const API_URL = "https://hatbox-scanner-subscribe.ngrok-free.dev/api";


export const getDashboard = async () => {

    const token = localStorage.getItem("token");


    const response = await fetch(
        `${API_URL}/dashboard`,
        {
            method: "GET",

            headers: {
                "Content-Type": "application/json",

                Authorization: `Bearer ${token}`
            }
        }
    );


    const data = await response.json();


    if (!response.ok) {

        throw new Error(
            data.message || "Failed to load dashboard"
        );

    }


    return data;
};

