import { openai } from '../../../config/openai.config'

const handler = async (event) => {
    try {
        const threadId = await createThread()
        return {
            statusCode: 200,
            body: JSON.stringify({ threadId }),
        }
    } catch (e) {
        console.error('error:', e)
        return { statusCode: 500, body: e.toString() }
    }
}


async function createThread() {
    try {
        const thread = await openai.beta.threads.create();
        return thread.id
    } catch (e) {
        console.error('Error creating a new thread', e)
    }
}


export { handler }