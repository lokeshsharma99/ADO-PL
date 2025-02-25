// Configuration
const MISTRAL_API_KEY = 'YOUR_MISTRAL_API_KEY_HERE'; // Replace with your actual API key

async function generateContent(options) {
    try {
        const { contentType, context, isTitle, title, author, categories } = options;

        // For title generation
        if (isTitle) {
            // Extract key information from context
            const analyzeContext = `Analyze this content and extract key points:
${context}

Focus on:
1. Main technology or innovation (e.g., Blockchain, AI, Digital Services)
2. Key benefit or impact (e.g., Security, Efficiency, Cost Reduction)
3. Target audience (e.g., SMEs, Government Departments, Citizens)
4. Type of resource (e.g., Playbook, Framework, Guide)

Return only these key elements in a structured format.`;

            // First, analyze the context
            const analysisResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${MISTRAL_API_KEY}`,
                },
                body: JSON.stringify({
                    model: 'mistral-medium',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an expert content analyzer. Extract and structure key information from the given content.'
                        },
                        {
                            role: 'user',
                            content: analyzeContext
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 200
                })
            });

            const analysisResult = await analysisResponse.json();
            const analysis = analysisResult.choices[0].message.content;

            const titlePrompts = {
                blog: `You are a professional title generator for GOV.UK blog posts. Create a compelling, specific title that:
                - Focuses on the main technology/innovation and its key benefit
                - Uses strong action verbs (e.g., Transforms, Launches, Empowers, Accelerates)
                - NEVER uses generic terms like "Introduction", "Overview", or "Update"
                - Must highlight the specific value proposition
                - Follows UK Government style guidelines
                - Is concise (5-10 words)
                - Includes the specific technology and target audience
                
                Key requirements:
                1. Start with the main technology or key innovation
                2. Include the specific benefit or impact
                3. Mention the target audience if relevant
                4. Use the correct resource type (Playbook, Framework, Guide, etc.)
                
                Example good titles for similar content:
                - "Bitcoin Security Playbook Launches for Financial Services"
                - "New Blockchain Framework Accelerates SME Innovation"
                - "Digital Security Guide Transforms Financial Technology"
                - "Architecture Handbook Strengthens Bitcoin Implementation"
                
                Example bad titles:
                - "Introduction to Bitcoin" (too generic)
                - "Blockchain Overview" (too vague)
                - "Latest Security Update" (not specific)
                - "A Guide to Technology" (too broad)

                Based on the analysis:
                ${analysis}

                Create a title that specifically mentions the main technology, its benefit, and target audience.`,
                news: `You are a professional title generator for news articles. Create a clear, informative title that:
                - Leads with the most important information
                - Uses present tense for current events
                - Is factual and objective
                - Avoids sensationalism
                - Follows UK Government style guidelines
                - Is concise (5-10 words)
                - Does not include unnecessary punctuation`,
                announcement: `You are a professional title generator for official announcements. Create a clear, authoritative title that:
                - States the announcement purpose directly
                - Uses official but accessible language
                - Includes relevant service or policy names
                - Follows UK Government style guidelines
                - Is concise (5-10 words)
                - Does not include unnecessary punctuation`
            };

            const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${MISTRAL_API_KEY}`,
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
                            content: `Generate a specific title that captures the essence of this content: ${context}\n\nThe title MUST include the main technology/innovation and its primary benefit. NEVER use generic words like "Introduction" or "Overview".`
                        }
                    ],
                    temperature: 0.4, // Lower temperature for more focused results
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

            // Enhanced check for generic titles
            const genericTitles = ['introduction', 'overview', 'update', 'summary', 'guide', 'about'];
            const genericWords = new RegExp(`^(${genericTitles.join('|')})\\b`, 'i');
            
            if (genericWords.test(generatedTitle)) {
                // Try again with more specific instructions and analysis
                return generateContent({
                    ...options,
                    context: `${context}\n\nBased on analysis:\n${analysis}\n\nIMPORTANT: Create a very specific title that includes:\n1. The main technology (${analysis.match(/Main technology: ([^\n]+)/)?.[1] || 'Bitcoin/Blockchain'})\n2. The key benefit (${analysis.match(/Key benefit: ([^\n]+)/)?.[1] || 'Security/Efficiency'})\n3. The target audience (${analysis.match(/Target audience: ([^\n]+)/)?.[1] || 'SMEs/Firms'})`
                });
            }

            return generatedTitle;
        }

        // For content generation
        const contentStructures = {
            blog: `Structure the blog post with these sections:
            - Start with an engaging introduction that sets the context
            - Use clear headings for main sections
            - Include real examples and specific details
            - End with a conclusion or call to action`,
            news: `Structure the news article with:
            - Lead paragraph summarizing key information
            - Supporting details and context
            - Quotes or relevant data
            - Background information if needed`,
            announcement: `Structure the announcement with:
            - Key message or change
            - Important dates or deadlines
            - Who is affected
            - What action is needed
            - Where to find more information`
        };

        let contextString = `Title: ${title}\n\n`;
        contextString += `Content Type: ${contentType}\n\n`;
        contextString += `Structure: ${contentStructures[contentType]}\n\n`;
        
        if (context) {
            contextString += `Topic Details: ${context}\n\n`;
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
                'Authorization': `Bearer ${MISTRAL_API_KEY}`,
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
            const error = await response.json();
            throw new Error(error.error || 'Failed to generate content');
        }

        const result = await response.json();
        return result.choices[0].message.content;
    } catch (error) {
        console.error('Error generating content:', error);
        throw error;
    }
}

// Example usage:
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('content-form');
    const output = document.getElementById('content-output');
    const generateButton = document.getElementById('generate-button');
    const titleInput = document.getElementById('title');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                generateButton.disabled = true;
                generateButton.textContent = 'Generating...';

                const formData = new FormData(form);
                const options = {
                    contentType: formData.get('content-type'),
                    context: formData.get('context'),
                    isTitle: !formData.get('title'), // Generate title if not provided
                    title: formData.get('title'),
                    author: {
                        name: formData.get('author-name'),
                        role: formData.get('author-role')
                    },
                    categories: formData.get('categories')?.split(',').map(c => c.trim()).filter(Boolean)
                };

                // First generate title if needed
                if (!options.title) {
                    const generatedTitle = await generateContent({ ...options, isTitle: true });
                    titleInput.value = generatedTitle;
                    options.title = generatedTitle;
                }

                // Then generate content
                const content = await generateContent({ ...options, isTitle: false });
                output.innerHTML = marked.parse(content);
            } catch (error) {
                output.innerHTML = `<div class="error">${error.message}</div>`;
            } finally {
                generateButton.disabled = false;
                generateButton.textContent = 'Generate Content';
            }
        });
    }
}); 