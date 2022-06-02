const { fetch } = require("grammy/out/shim.node")

async function uploadImage(url) {

    const requestURL = "https://api.imgbb.com/1/upload?" + new URLSearchParams({
        key: process.env.IMGBB_API_KEY,
        image: url,
    })

    const response = await fetch(requestURL, {
        method: "POST" 
    }) 

    const data = await response.json()

    return data.data
}

module.exports = uploadImage