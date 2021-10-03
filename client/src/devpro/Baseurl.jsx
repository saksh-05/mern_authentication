const devURL = "http://localhost:3001/";

const proURL = "https://mern-authentication01.herokuapp.com/";

const base_url = process.env.NODE_ENV === "production" ? proURL : devURL;

export default base_url;
