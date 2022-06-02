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

            response.status = "success"
            return response

        } catch (error) {
            return {status: "error"}    
        }
    }

    async function returnAllDatabases() {

        try {
            const response = await notion.search({
                filter: {
                    value: "database",
                    property: "object"
                }
            })

            response.status = "success"
            return response
        } catch(err) {
            console.log(err)
            return {
                status: "error"
            }
        }
    }

    async function addTextToDatabase(databaseId, text) {

        try {
            const response = await notion.pages.create({
                parent: {
                    database_id: databaseId
                },
                properties: {
                    title: [
                        {
                            text: {
                                content: text
                            }
                        }
                    ]
                }
            })

            response.status = "success"
            return response

        } catch (err) {
            console.log(err)
            return {
                status: "error"
            }
        }
    }

    async function getDatabaseData(databaseId) {
        try {
            const response = await notion.databases.retrieve({database_id: databaseId})
            return response
        } catch (err) {
            console.log(err)
            return {status: "error"}
        }
    }

    async function createPageWithBlock(database_id, config) {
        try {
            let response

            switch (config.blockType) {
                case "image":
                    response = await notion.pages.create({
                        parent: {
                            database_id
                        },
                        properties: {
                            title: [
                                {
                                    text: {
                                        content: config.title
                                    }
                                }
                            ]
                        },
                        children: [
                            {
                                object: "block",
                                type: "image",
                                image: {
                                    type: "external",
                                    external: {
                                        url: config.imageURL
                                    }
                                }
                            }
                        ]
                    })

                    response.databaseData = await getDatabaseData(database_id)
                    break;
            
                default:
                    return {status: "error"}
                    break;
            }
            return response
        } catch (err) {
            console.log(err)
            return {status: "error"}
        }
    }

    return {
        checkAuthCode,
        returnAllDatabases,
        addTextToDatabase,
        getDatabaseData,
        createPageWithBlock
    }
}

module.exports = NotionQuerys