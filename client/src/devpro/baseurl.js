const devURL = "http://localhost:3001/";

const proURL = "";

const base_url = process.env.NODE_ENV === "production" ? proURL : devURL;

export default base_url;