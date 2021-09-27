const devURL = "http://localhost:3001/";

const proURL = "https://sharp-hoover-114a0d.netlify.app/";

const base_url = process.env.NODE_ENV === "production" ? proURL : devURL;

export default base_url;