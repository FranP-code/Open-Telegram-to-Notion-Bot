const { Client } = require('@notionhq/client');

function NotionQuerys(authCode) {
    
    const notion = new Client({ auth: authCode });
    
    async function checkAuthCode() {
        
        try {    
            const response = await notion.search({
                page_size: 1,
                sort: {
                    direction: 'ascending',
                    timestamp: 'last_edited_time',
                }
            })

            console.log(response)
            response.status = "success"
            return response

        } catch (error) {
            return {status: "error"}    
        }
    }

    return {
        checkAuthCode
    }
}

module.exports = NotionQuerys