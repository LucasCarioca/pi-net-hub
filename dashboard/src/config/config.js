export default {
    baseUrl: process.env.NODE_ENV === "production" ? "/api"  : "http://localhost:8000/api"
}