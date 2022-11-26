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
            const response = await notion.search()
            const databases = response.results.filter(result => result.object === 'database')
            const databasesFormated = []
            response.status = "success"
            for (const database of databases) {
                if (database.parent.type === 'workspace') {
                    databasesFormated.push(database)
                    continue;
                }
                const parentPage = await notion.pages.retrieve({ page_id: database.parent.page_id });
                databasesFormated.push({
                    ...database,
                    title: database.title.map(titleItem => ({
                        ...titleItem,
                        text: {
                            ...titleItem.text,
                            content: `${titleItem.text.content} (${parentPage.properties.title.title[0].text.content})`
                        }
                    }))
                })
            }
            return {...response, results: databasesFormated}
        } catch(err) {
            console.log(err)
            return {
                status: "error"
            }
        }
    }

    async function addBlockToDatabase(databaseId, title, propierties) {

        try {
            const response = await notion.pages.create({
                parent: {
                    database_id: databaseId
                },
                properties: {
                    title: [
                        {
                            text: {
                                content: title
                            }
                        }
                    ],
                    ...propierties
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
                            ],
                            ...config.propierties
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
        addBlockToDatabase,
        getDatabaseData,
        createPageWithBlock
    }
}

module.exports = NotionQuerys