module.exports = async function (context, req) {
    try {
        const { contentType, context: userContext, isTitle, title, author, categories } = req.body;

        if (!process.env.MISTRAL_API_KEY) {
            context.res = {
                status: 500,
                body: { error: 'Mistral API key not configured' }
            };
            return;
        }

        // For title generation
        if (isTitle) {
            const titlePrompts = {
                blog: `You are a professional title generator for blog posts...`,
                news: `You are a professional title generator for news articles...`,
                announcement: `You are a professional title generator for official announcements...`
            };

            const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
                },
                body: JSON.stringify({
                    model: 'mistral-medium',
                    messages: [
                        {
                            role: 'system',
                            content: titlePrompts[contentType]
                        },
                        {
                            role: 'user',
                            content: `Generate a ${contentType} title for this topic: ${userContext}`
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 50
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }

            const result = await response.json();
            let generatedTitle = result.choices[0].message.content
                .trim()
                .replace(/^["']|["']$/g, '')
                .replace(/^#+ /g, '')
                .replace(/\.$/, '');

            context.res = {
                body: { content: generatedTitle }
            };
            return;
        }

        // For content generation
        const contentStructures = {
            blog: `Structure the blog post with these sections...`,
            news: `Structure the news article with...`,
            announcement: `Structure the announcement with...`
        };

        let contextString = `Title: ${title}\n\n`;
        contextString += `Content Type: ${contentType}\n\n`;
        contextString += `Structure: ${contentStructures[contentType]}\n\n`;
        
        if (userContext) {
            contextString += `Topic Details: ${userContext}\n\n`;
        }

        if (author) {
            contextString += `Author: ${author.name} (${author.role})\n\n`;
        }

        if (categories?.length) {
            contextString += `Categories: ${categories.join(', ')}\n\n`;
        }

        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'mistral-medium',
                messages: [
                    {
                        role: 'system',
                        content: "Generate content in markdown format. Do not include the title. Start directly with the main content."
                    },
                    {
                        role: 'user',
                        content: contextString
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        const result = await response.json();
        const generatedContent = result.choices[0].message.content;

        context.res = {
            body: { content: generatedContent }
        };

    } catch (error) {
        context.res = {
            status: 500,
            body: { error: error.message }
        };
    }
}; 