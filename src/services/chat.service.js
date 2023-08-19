

const SignUp = async (body) => {
    const { username, secret, email, first_name, last_name } = body;

    try {
        const response = await axios.post(
        "https://api.chatengine.io/users/",
        { username, secret, email, first_name, last_name },
        { headers: { "Private-Key": process.env.CHAT_ENGINE_PRIVATE_KEY } }
        );

        return {success:true, data:"User Created Successfully", data: response.data}
    } catch (e) {
        return {success:false, message:"Error while creating chat", data:e}
    }
};

const Login = async (body) => {
    const { username, secret } = body;

    // Fetch this user from Chat Engine in this project!
    try {
        const response = await axios.get("https://api.chatengine.io/users/me/", {
            headers: {
                "Project-ID": process.env.CHAT_ENGINE_PROJECT_ID,
                "User-Name": username,
                "User-Secret": secret,
            },
        });
        
        return {success:true, data:"User Created Successfully", data: response.data}
    } catch (e) {
        return {success:false, message:"Error while creating chat", data:e}
    }
};

module.exports = {
    SignUp,
    Login
}